package com.cyclosa.transfer.service;

import com.cyclosa.auth.repository.UserRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeWorkAssignment;
import com.cyclosa.employee.entity.enums.AssignmentChangeReason;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeWorkAssignmentRepository;
import com.cyclosa.organization.entity.Branch;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.entity.JobLevel;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.organization.repository.BranchRepository;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.organization.repository.JobLevelRepository;
import com.cyclosa.organization.repository.JobTitleRepository;
import com.cyclosa.transfer.dto.request.*;
import com.cyclosa.transfer.dto.response.*;
import com.cyclosa.transfer.entity.TransferAllowance;
import com.cyclosa.transfer.entity.TransferRequest;
import com.cyclosa.transfer.enums.TransferReason;
import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import com.cyclosa.transfer.exception.TransferErrorCode;
import com.cyclosa.transfer.mapper.TransferMapper;
import com.cyclosa.transfer.repository.TransferAllowanceRepository;
import com.cyclosa.transfer.repository.TransferRequestRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Concrete Service trực tiếp theo Quy chuẩn 01 CYCLOSA Backend (Không tạo interface + impl thừa thãi).
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransferService {

    private final TransferRequestRepository transferRequestRepository;
    private final TransferAllowanceRepository transferAllowanceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeWorkAssignmentRepository workAssignmentRepository;
    private final DepartmentRepository departmentRepository;
    private final BranchRepository branchRepository;
    private final JobTitleRepository jobTitleRepository;
    private final JobLevelRepository jobLevelRepository;
    private final UserRepository userRepository;
    private final TransferMapper mapper;

    public PageData<TransferSummaryResponse> getTransfers(TransferFilter filter) {
        int pageIndex = Math.max(0, filter.getPage());
        int pageSize = filter.getSize() <= 0 ? 10 : filter.getSize();

        PageRequest pageRequest = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

        Specification<TransferRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isNull(root.get("deletedAt")));

            if (StringUtils.hasText(filter.getKeyword())) {
                String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate employeeCodePredicate = cb.like(cb.lower(root.get("employee").get("employeeCode")), searchPattern);
                Predicate lastNamePredicate = cb.like(cb.lower(root.get("employee").get("lastName")), searchPattern);
                Predicate firstNamePredicate = cb.like(cb.lower(root.get("employee").get("firstName")), searchPattern);
                Predicate reasonDetailPredicate = cb.like(cb.lower(root.get("reasonDetail")), searchPattern);

                predicates.add(cb.or(employeeCodePredicate, lastNamePredicate, firstNamePredicate, reasonDetailPredicate));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getTransferType() != null) {
                predicates.add(cb.equal(root.get("transferType"), filter.getTransferType()));
            }

            if (Boolean.TRUE.equals(filter.getIsTemporary())) {
                predicates.add(cb.equal(root.get("transferType"), TransferType.TEMPORARY_DISPATCH));
            }

            if (filter.getDepartmentId() != null) {
                predicates.add(cb.or(
                        cb.equal(root.get("toDepartment").get("id"), filter.getDepartmentId()),
                        cb.equal(root.get("fromDepartment").get("id"), filter.getDepartmentId())
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<TransferRequest> page = transferRequestRepository.findAll(spec, pageRequest);
        return PageData.of(page, mapper.toSummaryResponseList(page.getContent()));
    }

    public TransferStatisticsResponse getStatistics() {
        return TransferStatisticsResponse.builder()
                .total(transferRequestRepository.countByDeletedAtIsNull())
                .pendingApprovalCount(transferRequestRepository.countByStatusAndDeletedAtIsNull(TransferStatus.PENDING_APPROVAL))
                .approvedCount(transferRequestRepository.countByStatusAndDeletedAtIsNull(TransferStatus.APPROVED))
                .temporaryDispatchCount(transferRequestRepository.countByTransferTypeAndDeletedAtIsNull(TransferType.TEMPORARY_DISPATCH))
                .build();
    }

    public TransferResponse getTransferById(UUID id) {
        TransferRequest entity = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        TransferResponse response = mapper.toResponse(entity);

        if (entity.getApprovedBy() != null) {
            userRepository.findById(entity.getApprovedBy())
                    .ifPresent(u -> response.setApprovedByName(u.getUsername()));
        }

        if (entity.getCompletedBy() != null) {
            userRepository.findById(entity.getCompletedBy())
                    .ifPresent(u -> response.setCompletedByName(u.getUsername()));
        }

        return response;
    }

    public CurrentWorkSnapshotResponse getCurrentSnapshot(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .filter(e -> e.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.EMPLOYEE_NOT_FOUND));

        EmployeeWorkAssignment currentAssignment = workAssignmentRepository
                .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employeeId, LocalDate.now())
                .orElse(null);

        CurrentWorkSnapshotResponse.CurrentWorkSnapshotResponseBuilder builder = CurrentWorkSnapshotResponse.builder()
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(employee.getFullName())
                .portraitUrl(employee.getPortraitUrl());

        if (currentAssignment != null) {
            if (currentAssignment.getDepartment() != null) {
                Department dept = currentAssignment.getDepartment();
                builder.departmentId(dept.getId());
                String deptName = dept.getCode();
                if (dept.getVersions() != null && !dept.getVersions().isEmpty()) {
                    deptName = dept.getVersions().get(0).getName();
                }
                builder.departmentName(deptName);
            }
            if (currentAssignment.getBranch() != null) {
                builder.branchId(currentAssignment.getBranch().getId());
                builder.branchName(currentAssignment.getBranch().getName());
            }
            if (currentAssignment.getJobTitle() != null) {
                builder.jobTitleId(currentAssignment.getJobTitle().getId());
                builder.jobTitleName(currentAssignment.getJobTitle().getName());
            }
            if (currentAssignment.getJobLevel() != null) {
                builder.jobLevelId(currentAssignment.getJobLevel().getId());
                builder.jobLevelName(currentAssignment.getJobLevel().getName());
            }
            if (currentAssignment.getManager() != null) {
                builder.managerId(currentAssignment.getManager().getId());
                builder.managerName(currentAssignment.getManager().getFullName());
            }
            builder.effectiveFrom(currentAssignment.getEffectiveFrom());
        }

        return builder.build();
    }

    @Transactional
    public TransferResponse createTransfer(CreateTransferRequest request, UUID currentUserId) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .filter(e -> e.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.EMPLOYEE_NOT_FOUND));

        // 1. Kiểm tra nhân sự có phiếu điều chuyển đang xử lý không
        if (transferRequestRepository.existsActiveTransferForEmployee(employee.getId())) {
            throw new AppException(TransferErrorCode.TRANSFER_REQUEST_ALREADY_EXISTS);
        }

        // 2. Validate ngày hiệu lực
        if (request.getEffectiveDate() == null || request.getEffectiveDate().isBefore(LocalDate.now())) {
            throw new AppException(TransferErrorCode.INVALID_EFFECTIVE_DATE);
        }

        // 3. Nếu là TEMPORARY_DISPATCH, bắt buộc có endDate > effectiveDate
        if (request.getTransferType() == TransferType.TEMPORARY_DISPATCH) {
            if (request.getEndDate() == null || !request.getEndDate().isAfter(request.getEffectiveDate())) {
                throw new AppException(TransferErrorCode.INVALID_TEMPORARY_END_DATE);
            }
        }

        // 4. Lấy Snapshot công tác hiện tại
        EmployeeWorkAssignment currentAssignment = workAssignmentRepository
                .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employee.getId(), LocalDate.now())
                .orElseThrow(() -> new AppException(TransferErrorCode.EMPLOYEE_NOT_FOUND));

        // 5. Kiểm tra thay đổi đích tiếp nhận so với hiện tại
        boolean sameDepartment = Objects.equals(currentAssignment.getDepartment().getId(), request.getToDepartmentId());
        boolean sameBranch = currentAssignment.getBranch() == null ? request.getToBranchId() == null
                : Objects.equals(currentAssignment.getBranch().getId(), request.getToBranchId());
        boolean sameJobTitle = Objects.equals(currentAssignment.getJobTitle().getId(), request.getToJobTitleId());
        boolean sameJobLevel = currentAssignment.getJobLevel() == null ? request.getToJobLevelId() == null
                : Objects.equals(currentAssignment.getJobLevel().getId(), request.getToJobLevelId());
        boolean sameManager = currentAssignment.getManager() == null ? request.getToManagerId() == null
                : Objects.equals(currentAssignment.getManager().getId(), request.getToManagerId());

        if (sameDepartment && sameBranch && sameJobTitle && sameJobLevel && sameManager) {
            throw new AppException(TransferErrorCode.NO_DESTINATION_CHANGE);
        }

        // 6. Truy xuất các entities đích
        Department toDepartment = departmentRepository.findById(request.getToDepartmentId())
                .filter(d -> d.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.DEPARTMENT_NOT_FOUND));

        Branch toBranch = null;
        if (request.getToBranchId() != null) {
            toBranch = branchRepository.findById(request.getToBranchId())
                    .filter(b -> b.getDeletedAt() == null)
                    .orElseThrow(() -> new AppException(TransferErrorCode.BRANCH_NOT_FOUND));
        }

        JobTitle toJobTitle = jobTitleRepository.findById(request.getToJobTitleId())
                .filter(j -> j.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.JOB_TITLE_NOT_FOUND));

        JobLevel toJobLevel = null;
        if (request.getToJobLevelId() != null) {
            toJobLevel = jobLevelRepository.findById(request.getToJobLevelId()).orElse(null);
        }

        Employee toManager = null;
        if (request.getToManagerId() != null) {
            toManager = employeeRepository.findById(request.getToManagerId()).orElse(null);
        }

        // 7. Tạo TransferRequest
        TransferRequest transfer = TransferRequest.builder()
                .employee(employee)
                .transferType(request.getTransferType())
                .status(TransferStatus.DRAFT)
                // From snapshot
                .fromDepartment(currentAssignment.getDepartment())
                .fromBranch(currentAssignment.getBranch())
                .fromJobTitle(currentAssignment.getJobTitle())
                .fromJobLevel(currentAssignment.getJobLevel())
                .fromManager(currentAssignment.getManager())
                .fromBaseSalary(null)
                // To snapshot
                .toDepartment(toDepartment)
                .toBranch(toBranch)
                .toJobTitle(toJobTitle)
                .toJobLevel(toJobLevel)
                .toManager(toManager)
                .toBaseSalary(request.getToBaseSalary())
                // Dates & Reason
                .effectiveDate(request.getEffectiveDate())
                .endDate(request.getTransferType() == TransferType.TEMPORARY_DISPATCH ? request.getEndDate() : null)
                .reason(request.getReason())
                .reasonDetail(request.getReasonDetail())
                .notes(request.getNotes())
                .hasSalaryAdjustment(Boolean.TRUE.equals(request.getHasSalaryAdjustment()))
                .salaryNotes(request.getSalaryNotes())
                .isReturned(false)
                .build();

        // 8. Allowances
        if (request.getAllowances() != null && !request.getAllowances().isEmpty()) {
            for (CreateTransferAllowanceRequest allowanceReq : request.getAllowances()) {
                TransferAllowance allowance = TransferAllowance.builder()
                        .allowanceName(allowanceReq.getAllowanceName())
                        .amount(allowanceReq.getAmount())
                        .notes(allowanceReq.getNotes())
                        .build();
                transfer.addAllowance(allowance);
            }
        }

        TransferRequest saved = transferRequestRepository.save(transfer);
        log.info("Created transfer request {} for employee {}", saved.getId(), employee.getEmployeeCode());
        return mapper.toResponse(saved);
    }

    @Transactional
    public TransferResponse updateTransfer(UUID id, UpdateTransferRequest request, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.DRAFT) {
            throw new AppException(TransferErrorCode.INVALID_TRANSFER_STATUS);
        }

        if (request.getEffectiveDate() == null || request.getEffectiveDate().isBefore(LocalDate.now())) {
            throw new AppException(TransferErrorCode.INVALID_EFFECTIVE_DATE);
        }

        if (request.getTransferType() == TransferType.TEMPORARY_DISPATCH) {
            if (request.getEndDate() == null || !request.getEndDate().isAfter(request.getEffectiveDate())) {
                throw new AppException(TransferErrorCode.INVALID_TEMPORARY_END_DATE);
            }
        }

        Department toDepartment = departmentRepository.findById(request.getToDepartmentId())
                .filter(d -> d.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.DEPARTMENT_NOT_FOUND));

        Branch toBranch = null;
        if (request.getToBranchId() != null) {
            toBranch = branchRepository.findById(request.getToBranchId())
                    .filter(b -> b.getDeletedAt() == null)
                    .orElseThrow(() -> new AppException(TransferErrorCode.BRANCH_NOT_FOUND));
        }

        JobTitle toJobTitle = jobTitleRepository.findById(request.getToJobTitleId())
                .filter(j -> j.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.JOB_TITLE_NOT_FOUND));

        JobLevel toJobLevel = null;
        if (request.getToJobLevelId() != null) {
            toJobLevel = jobLevelRepository.findById(request.getToJobLevelId()).orElse(null);
        }

        Employee toManager = null;
        if (request.getToManagerId() != null) {
            toManager = employeeRepository.findById(request.getToManagerId()).orElse(null);
        }

        transfer.setTransferType(request.getTransferType());
        transfer.setToDepartment(toDepartment);
        transfer.setToBranch(toBranch);
        transfer.setToJobTitle(toJobTitle);
        transfer.setToJobLevel(toJobLevel);
        transfer.setToManager(toManager);
        transfer.setToBaseSalary(request.getToBaseSalary());
        transfer.setEffectiveDate(request.getEffectiveDate());
        transfer.setEndDate(request.getTransferType() == TransferType.TEMPORARY_DISPATCH ? request.getEndDate() : null);
        transfer.setReason(request.getReason());
        transfer.setReasonDetail(request.getReasonDetail());
        transfer.setNotes(request.getNotes());
        transfer.setHasSalaryAdjustment(Boolean.TRUE.equals(request.getHasSalaryAdjustment()));
        transfer.setSalaryNotes(request.getSalaryNotes());

        // Update allowances
        transfer.getAllowances().clear();
        if (request.getAllowances() != null && !request.getAllowances().isEmpty()) {
            for (CreateTransferAllowanceRequest allowanceReq : request.getAllowances()) {
                TransferAllowance allowance = TransferAllowance.builder()
                        .allowanceName(allowanceReq.getAllowanceName())
                        .amount(allowanceReq.getAmount())
                        .notes(allowanceReq.getNotes())
                        .build();
                transfer.addAllowance(allowance);
            }
        }

        TransferRequest updated = transferRequestRepository.save(transfer);
        return mapper.toResponse(updated);
    }

    @Transactional
    public void deleteTransfer(UUID id) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.DRAFT && transfer.getStatus() != TransferStatus.REJECTED) {
            throw new AppException(TransferErrorCode.CANNOT_DELETE_ACTIVE_TRANSFER);
        }

        transfer.setDeletedAt(LocalDateTime.now());
        transferRequestRepository.save(transfer);
        log.info("Deleted transfer request {}", id);
    }

    @Transactional
    public TransferResponse submitTransfer(UUID id, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.DRAFT) {
            throw new AppException(TransferErrorCode.INVALID_TRANSFER_STATUS);
        }

        transfer.setStatus(TransferStatus.PENDING_APPROVAL);
        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Submitted transfer request {} for approval", id);
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse approveTransfer(UUID id, ApproveTransferRequest request, UUID approverId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.PENDING_APPROVAL && transfer.getStatus() != TransferStatus.SUBMITTED) {
            throw new AppException(TransferErrorCode.INVALID_TRANSFER_STATUS);
        }

        transfer.setStatus(TransferStatus.APPROVED);
        transfer.setApprovedBy(approverId);
        transfer.setApprovedAt(LocalDateTime.now());
        if (request != null && StringUtils.hasText(request.getNotes())) {
            transfer.setNotes(StringUtils.hasText(transfer.getNotes())
                    ? transfer.getNotes() + "\n[Phê duyệt]: " + request.getNotes()
                    : "[Phê duyệt]: " + request.getNotes());
        }

        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Approved transfer request {} by user {}", id, approverId);
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse rejectTransfer(UUID id, RejectTransferRequest request, UUID approverId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.PENDING_APPROVAL && transfer.getStatus() != TransferStatus.SUBMITTED) {
            throw new AppException(TransferErrorCode.INVALID_TRANSFER_STATUS);
        }

        transfer.setStatus(TransferStatus.REJECTED);
        transfer.setApprovedBy(approverId);
        transfer.setApprovedAt(LocalDateTime.now());
        transfer.setRejectionReason(request.getRejectionReason());

        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Rejected transfer request {} by user {}", id, approverId);
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse cancelTransfer(UUID id, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.DRAFT && transfer.getStatus() != TransferStatus.PENDING_APPROVAL) {
            throw new AppException(TransferErrorCode.INVALID_TRANSFER_STATUS);
        }

        transfer.setStatus(TransferStatus.CANCELLED);
        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Cancelled transfer request {}", id);
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse applyTransfer(UUID id, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getStatus() != TransferStatus.APPROVED) {
            throw new AppException(TransferErrorCode.CANNOT_APPLY_TRANSFER);
        }

        // Tạo phân công công tác mới cho nhân viên
        EmployeeWorkAssignment newAssignment = EmployeeWorkAssignment.builder()
                .employee(transfer.getEmployee())
                .effectiveFrom(transfer.getEffectiveDate())
                .department(transfer.getToDepartment())
                .branch(transfer.getToBranch())
                .jobTitle(transfer.getToJobTitle())
                .jobLevel(transfer.getToJobLevel())
                .manager(transfer.getToManager())
                .changeReason(AssignmentChangeReason.TRANSFER)
                .build();

        workAssignmentRepository.save(newAssignment);

        transfer.setStatus(TransferStatus.COMPLETED);
        transfer.setCompletedBy(currentUserId);
        transfer.setCompletedAt(LocalDateTime.now());

        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Applied transfer request {} into employee work assignment", id);
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse extendTemporaryTransfer(UUID id, ExtendTemporaryTransferRequest request, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getTransferType() != TransferType.TEMPORARY_DISPATCH) {
            throw new AppException(TransferErrorCode.NOT_TEMPORARY_DISPATCH);
        }

        if (request.getNewEndDate() == null || !request.getNewEndDate().isAfter(transfer.getEffectiveDate())) {
            throw new AppException(TransferErrorCode.INVALID_TEMPORARY_END_DATE);
        }

        transfer.setEndDate(request.getNewEndDate());
        if (StringUtils.hasText(request.getNotes())) {
            transfer.setNotes(StringUtils.hasText(transfer.getNotes())
                    ? transfer.getNotes() + "\n[Gia hạn đến " + request.getNewEndDate() + "]: " + request.getNotes()
                    : "[Gia hạn đến " + request.getNewEndDate() + "]: " + request.getNotes());
        }

        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Extended temporary transfer request {} to {}", id, request.getNewEndDate());
        return mapper.toResponse(updated);
    }

    @Transactional
    public TransferResponse returnTemporaryTransfer(UUID id, UUID currentUserId) {
        TransferRequest transfer = transferRequestRepository.findById(id)
                .filter(t -> t.getDeletedAt() == null)
                .orElseThrow(() -> new AppException(TransferErrorCode.TRANSFER_REQUEST_NOT_FOUND));

        if (transfer.getTransferType() != TransferType.TEMPORARY_DISPATCH) {
            throw new AppException(TransferErrorCode.NOT_TEMPORARY_DISPATCH);
        }

        if (Boolean.TRUE.equals(transfer.getIsReturned())) {
            throw new AppException(TransferErrorCode.ALREADY_RETURNED);
        }

        // Tạo phân công công tác hồi hương về đơn vị ban đầu
        LocalDate returnDate = LocalDate.now();
        EmployeeWorkAssignment returnAssignment = EmployeeWorkAssignment.builder()
                .employee(transfer.getEmployee())
                .effectiveFrom(returnDate)
                .department(transfer.getFromDepartment())
                .branch(transfer.getFromBranch())
                .jobTitle(transfer.getFromJobTitle())
                .jobLevel(transfer.getFromJobLevel())
                .manager(transfer.getFromManager())
                .changeReason(AssignmentChangeReason.TRANSFER)
                .build();

        workAssignmentRepository.save(returnAssignment);

        transfer.setIsReturned(true);
        TransferRequest updated = transferRequestRepository.save(transfer);
        log.info("Processed return transfer for temporary dispatch {}", id);
        return mapper.toResponse(updated);
    }
}
