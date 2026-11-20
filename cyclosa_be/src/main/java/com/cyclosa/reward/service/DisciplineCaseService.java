package com.cyclosa.reward.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeStatusHistory;
import com.cyclosa.employee.entity.enums.EmployeeStatus;
import com.cyclosa.employee.repository.EmployeeDependentRepository;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeStatusHistoryRepository;
import com.cyclosa.payroll.service.PayrollRecordService;
import com.cyclosa.reward.dto.request.*;
import com.cyclosa.reward.dto.response.*;
import com.cyclosa.reward.entity.DisciplineCase;
import com.cyclosa.reward.entity.DisciplineEvidence;
import com.cyclosa.reward.entity.DisciplineParticipant;
import com.cyclosa.reward.enums.DisciplineForm;
import com.cyclosa.reward.enums.DisciplineStatus;
import com.cyclosa.reward.enums.ViolationCategory;
import com.cyclosa.reward.exception.RewardDisciplineErrorCode;
import com.cyclosa.reward.mapper.DisciplineCaseMapper;
import com.cyclosa.reward.repository.DisciplineCaseRepository;
import com.cyclosa.reward.repository.DisciplineEvidenceRepository;
import com.cyclosa.reward.repository.DisciplineParticipantRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DisciplineCaseService {

    private final DisciplineCaseRepository disciplineCaseRepository;
    private final DisciplineParticipantRepository participantRepository;
    private final DisciplineEvidenceRepository evidenceRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeDependentRepository dependentRepository;
    private final EmployeeStatusHistoryRepository statusHistoryRepository;
    private final DisciplineCaseMapper disciplineCaseMapper;
    private final PayrollRecordService payrollRecordService;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "violationDate", "createdAt", "status", "disciplineForm"
    );

    @Transactional(readOnly = true)
    public PageData<DisciplineCaseResponse> getDisciplineCases(DisciplineCaseFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("violationDate", ALLOWED_SORT_FIELDS);

        Specification<DisciplineCase> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employee").get("id"), filter.getEmployeeId()));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getDisciplineForm() != null) {
                predicates.add(cb.equal(root.get("disciplineForm"), filter.getDisciplineForm()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String kw = "%" + PageableUtils.normalizeKeyword(filter.getKeyword()) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("violationDescription")), kw),
                        cb.like(cb.lower(root.get("employee").get("lastName")), kw),
                        cb.like(cb.lower(root.get("employee").get("firstName")), kw),
                        cb.like(cb.lower(root.get("employee").get("employeeCode")), kw)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<DisciplineCase> page = disciplineCaseRepository.findAll(spec, pageable);
        return PageData.of(page, this::enrichDisciplineResponse);
    }

    @Transactional(readOnly = true)
    public DisciplineCaseDetailResponse getDisciplineCaseById(UUID caseId) {
        DisciplineCase dCase = disciplineCaseRepository.findByIdWithDetails(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        DisciplineCaseResponse caseResp = enrichDisciplineResponse(dCase);

        List<DisciplineParticipant> participants = participantRepository.findAllByDisciplineCaseIdWithEmployee(caseId);
        List<DisciplineEvidence> evidences = evidenceRepository.findAllByDisciplineCaseId(caseId);

        return DisciplineCaseDetailResponse.builder()
                .caseInfo(caseResp)
                .ruleBasis(dCase.getRuleBasis())
                .meetingDate(dCase.getMeetingDate())
                .meetingNote(dCase.getMeetingNote())
                .reason(dCase.getReason())
                .participants(disciplineCaseMapper.toParticipantResponseList(participants))
                .evidences(disciplineCaseMapper.toEvidenceResponseList(evidences))
                .build();
    }

    @Transactional(readOnly = true)
    public DisciplineEligibilityResponse checkEligibility(UUID caseId) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        LocalDate violationDate = dCase.getViolationDate();
        int limitationMonths = dCase.getViolationCategory() == ViolationCategory.FINANCIAL_ASSET_SECRET ? 12 : 6;
        LocalDate deadline = violationDate.plusMonths(limitationMonths);
        LocalDate today = LocalDate.now();

        boolean isLimitationExpired = today.isAfter(deadline);
        long remainingMonths = isLimitationExpired ? 0 : ChronoUnit.MONTHS.between(today, deadline);

        List<String> restrictionReasons = new ArrayList<>();
        boolean isRestricted = false;

        Employee employee = dCase.getEmployee();
        if (employee != null) {
            Optional<EmployeeStatusHistory> currentStatus = statusHistoryRepository
                    .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employee.getId(), today);
            if (currentStatus.isPresent() && (currentStatus.get().getStatus() == EmployeeStatus.ON_LEAVE || currentStatus.get().getStatus() == EmployeeStatus.SUSPENDED)) {
                isRestricted = true;
                restrictionReasons.add("Nhân viên đang tạm hoãn HĐLĐ hoặc trong thời gian nghỉ phép/thai sản/điều trị bệnh");
            }

            // Kiểm tra con dưới 12 tháng tuổi qua bảng người phụ thuộc
            LocalDate twelveMonthsAgo = today.minusMonths(12);
            boolean hasInfant = dependentRepository.findAllByEmployeeId(employee.getId()).stream()
                    .anyMatch(dep -> dep.getDateOfBirth() != null && dep.getDateOfBirth().isAfter(twelveMonthsAgo));
            if (hasInfant) {
                isRestricted = true;
                restrictionReasons.add("Người lao động đang nuôi con dưới 12 tháng tuổi");
            }
        }

        if (isLimitationExpired) {
            restrictionReasons.add(String.format("Đã hết thời hiệu xử lý kỷ luật lao động (%d tháng kể từ ngày vi phạm %s)", limitationMonths, violationDate));
        }

        boolean eligible = !isLimitationExpired && !isRestricted;

        return DisciplineEligibilityResponse.builder()
                .eligible(eligible)
                .remainingLimitationMonths(remainingMonths)
                .isLimitationExpired(isLimitationExpired)
                .isRestricted(isRestricted)
                .restrictionReasons(restrictionReasons)
                .build();
    }

    @Transactional
    public DisciplineCaseResponse createDisciplineCase(CreateDisciplineCaseRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên vi phạm"));

        DisciplineCase dCase = disciplineCaseMapper.toEntity(request);
        dCase.setCompanyId(companyId);
        dCase.setEmployee(employee);
        dCase.setStatus(DisciplineStatus.DRAFT);

        DisciplineCase saved = disciplineCaseRepository.save(dCase);
        return enrichDisciplineResponse(saved);
    }

    @Transactional
    public DisciplineCaseResponse updateDisciplineCase(UUID caseId, UpdateDisciplineCaseRequest request) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        if (dCase.getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        disciplineCaseMapper.updateEntityFromDto(request, dCase);

        if (request.getDecidedByEmployeeId() != null) {
            Employee decidedBy = employeeRepository.findById(request.getDecidedByEmployeeId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên ban hành quyết định"));
            dCase.setDecidedByEmployee(decidedBy);
        }

        DisciplineCase saved = disciplineCaseRepository.save(dCase);
        return enrichDisciplineResponse(saved);
    }

    @Transactional
    public List<DisciplineParticipantResponse> updateParticipants(UUID caseId, UpdateParticipantsRequest request) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        if (dCase.getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        participantRepository.deleteAllByDisciplineCaseId(caseId);

        List<DisciplineParticipant> participants = new ArrayList<>();
        for (UpdateParticipantsRequest.ParticipantItem item : request.getParticipants()) {
            Employee emp = employeeRepository.findById(item.getEmployeeId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy người tham gia: " + item.getEmployeeId()));

            DisciplineParticipant p = DisciplineParticipant.builder()
                    .disciplineCase(dCase)
                    .employee(emp)
                    .participantRole(item.getParticipantRole())
                    .build();
            participants.add(p);
        }

        List<DisciplineParticipant> saved = participantRepository.saveAll(participants);
        return disciplineCaseMapper.toParticipantResponseList(saved);
    }

    @Transactional
    public DisciplineEvidenceResponse addEvidence(UUID caseId, AddEvidenceRequest request) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        if (dCase.getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        DisciplineEvidence evidence = DisciplineEvidence.builder()
                .disciplineCase(dCase)
                .description(request.getDescription())
                .fileId(request.getFileId())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .build();

        DisciplineEvidence saved = evidenceRepository.save(evidence);
        return disciplineCaseMapper.toEvidenceResponse(saved);
    }

    @Transactional
    public void deleteEvidence(UUID evidenceId) {
        DisciplineEvidence evidence = evidenceRepository.findById(evidenceId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_EVIDENCE_NOT_FOUND));

        if (evidence.getDisciplineCase().getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        evidenceRepository.delete(evidence);
    }

    @Transactional
    public DisciplineCaseResponse decideDiscipline(UUID caseId, DecideDisciplineRequest request) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        if (dCase.getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        if (request.getDisciplineForm() == DisciplineForm.SA_THAI) {
            throw new AppException(RewardDisciplineErrorCode.DISMISSAL_REQUIRES_WORKFLOW_APPROVAL);
        }

        if (request.getDisciplineForm() == DisciplineForm.KEO_DAI_NANG_LUONG) {
            if (request.getSalaryExtensionMonths() == null || request.getSalaryExtensionMonths() <= 0 || request.getSalaryExtensionMonths() > 6) {
                throw new AppException(RewardDisciplineErrorCode.INVALID_SALARY_EXTENSION_MONTHS);
            }
        }

        // Thẩm định điều kiện và thời hiệu
        DisciplineEligibilityResponse eligibility = checkEligibility(caseId);
        if (!eligibility.getEligible()) {
            if (eligibility.getIsLimitationExpired()) {
                throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_LIMITATION_EXPIRED);
            }
            if (eligibility.getIsRestricted()) {
                throw new AppException(RewardDisciplineErrorCode.EMPLOYEE_RESTRICTED_FROM_DISCIPLINE);
            }
        }

        // Thẩm định thủ tục bắt buộc
        List<DisciplineEvidence> evidences = evidenceRepository.findAllByDisciplineCaseId(caseId);
        List<DisciplineParticipant> participants = participantRepository.findAllByDisciplineCaseIdWithEmployee(caseId);

        String ruleBasis = request.getRuleBasis() != null ? request.getRuleBasis() : dCase.getRuleBasis();
        LocalDate meetingDate = request.getMeetingDate() != null ? request.getMeetingDate() : dCase.getMeetingDate();

        if (ruleBasis == null || ruleBasis.isBlank() || evidences.isEmpty() || participants.isEmpty() || meetingDate == null) {
            throw new AppException(RewardDisciplineErrorCode.INSUFFICIENT_DISCIPLINE_PROCEDURES);
        }

        Employee decidedBy = employeeRepository.findById(request.getDecidedByEmployeeId())
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên ban hành quyết định"));

        dCase.setDisciplineForm(request.getDisciplineForm());
        dCase.setSalaryExtensionMonths(request.getSalaryExtensionMonths());
        dCase.setRuleBasis(ruleBasis);
        dCase.setMeetingDate(meetingDate);
        if (request.getMeetingNote() != null) dCase.setMeetingNote(request.getMeetingNote());
        if (request.getReason() != null) dCase.setReason(request.getReason());
        dCase.setDecidedByEmployee(decidedBy);
        dCase.setDecidedAt(request.getDecidedAt());
        dCase.setStatus(DisciplineStatus.DECIDED);

        DisciplineCase saved = disciplineCaseRepository.save(dCase);
        return enrichDisciplineResponse(saved);
    }

    @Transactional
    public DisciplineCaseResponse submitDismissal(UUID caseId) {
        DisciplineCase dCase = disciplineCaseRepository.findById(caseId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_NOT_FOUND));

        if (dCase.getStatus() == DisciplineStatus.DECIDED) {
            throw new AppException(RewardDisciplineErrorCode.DISCIPLINE_CASE_ALREADY_DECIDED);
        }

        // Thẩm định thủ tục sa thải
        List<DisciplineEvidence> evidences = evidenceRepository.findAllByDisciplineCaseId(caseId);
        List<DisciplineParticipant> participants = participantRepository.findAllByDisciplineCaseIdWithEmployee(caseId);

        if (evidences.isEmpty() || participants.isEmpty() || dCase.getMeetingDate() == null || dCase.getRuleBasis() == null) {
            throw new AppException(RewardDisciplineErrorCode.INSUFFICIENT_DISCIPLINE_PROCEDURES);
        }

        dCase.setDisciplineForm(DisciplineForm.SA_THAI);
        dCase.setStatus(DisciplineStatus.PENDING_DISMISSAL_APPROVAL);

        DisciplineCase saved = disciplineCaseRepository.save(dCase);
        return enrichDisciplineResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DisciplineCaseResponse> getMyDisciplineCases() {
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                .orElseThrow(() -> AppException.unauthorized("Chưa đăng nhập"));

        Employee employee = employeeRepository.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản này"));

        List<DisciplineCase> list = disciplineCaseRepository.findAllByEmployeeIdOrderByViolationDateDesc(employee.getId());
        return list.stream().map(this::enrichDisciplineResponse).toList();
    }

    private DisciplineCaseResponse enrichDisciplineResponse(DisciplineCase dCase) {
        DisciplineCaseResponse resp = disciplineCaseMapper.toResponse(dCase);

        // Tính toán Derived State xóa án tích (Expired)
        LocalDate decidedAt = dCase.getDecidedAt();
        DisciplineForm form = dCase.getDisciplineForm();
        if (dCase.getStatus() == DisciplineStatus.DECIDED && decidedAt != null && form != null) {
            LocalDate expiryDate = null;
            if (form == DisciplineForm.KHIEN_TRACH) {
                expiryDate = decidedAt.plusMonths(3);
            } else if (form == DisciplineForm.KEO_DAI_NANG_LUONG || form == DisciplineForm.CACH_CHUC) {
                expiryDate = decidedAt.plusMonths(6);
            }
            resp.setExpiryDate(expiryDate);
            resp.setIsExpired(expiryDate != null && !LocalDate.now().isBefore(expiryDate));
        } else {
            resp.setIsExpired(false);
        }

        // Tính thời hiệu còn lại
        int limitationMonths = dCase.getViolationCategory() == ViolationCategory.FINANCIAL_ASSET_SECRET ? 12 : 6;
        LocalDate deadline = dCase.getViolationDate().plusMonths(limitationMonths);
        long remainingMonths = LocalDate.now().isAfter(deadline) ? 0 : ChronoUnit.MONTHS.between(LocalDate.now(), deadline);
        resp.setRemainingLimitationMonths(remainingMonths);

        // Kiểm tra đã liên kết khấu trừ lương
        boolean pushed = payrollRecordService.isDisciplinePushedToPayroll(dCase.getId());
        resp.setPushedToPayroll(pushed);

        return resp;
    }
}
