package com.cyclosa.reward.service;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.reward.dto.request.ComplaintFilter;
import com.cyclosa.reward.dto.request.CreateComplaintRequest;
import com.cyclosa.reward.dto.request.ResolveComplaintRequest;
import com.cyclosa.reward.dto.response.ComplaintResponse;
import com.cyclosa.reward.entity.Complaint;
import com.cyclosa.reward.enums.ComplaintStatus;
import com.cyclosa.reward.exception.RewardDisciplineErrorCode;
import com.cyclosa.reward.mapper.ComplaintMapper;
import com.cyclosa.reward.repository.ComplaintRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final EmployeeRepository employeeRepository;
    private final ComplaintMapper complaintMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "submittedAt", "createdAt", "status", "category", "subject"
    );

    @Transactional(readOnly = true)
    public PageData<ComplaintResponse> getComplaints(ComplaintFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("submittedAt", ALLOWED_SORT_FIELDS);

        Specification<Complaint> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getCategory() != null) {
                predicates.add(cb.equal(root.get("category"), filter.getCategory()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String kw = "%" + PageableUtils.normalizeKeyword(filter.getKeyword()) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("subject")), kw),
                        cb.like(cb.lower(root.get("content")), kw),
                        cb.like(cb.lower(root.get("complainantEmployee").get("lastName")), kw),
                        cb.like(cb.lower(root.get("complainantEmployee").get("firstName")), kw),
                        cb.like(cb.lower(root.get("complainantEmployee").get("employeeCode")), kw)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Complaint> page = complaintRepository.findAll(spec, pageable);
        return PageData.of(page, complaintMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(UUID complaintId) {
        Complaint complaint = complaintRepository.findByIdWithDetails(complaintId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.COMPLAINT_NOT_FOUND));
        return complaintMapper.toResponse(complaint);
    }

    @Transactional
    public ComplaintResponse createComplaint(CreateComplaintRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                .orElseThrow(() -> AppException.unauthorized("Chưa đăng nhập"));

        Employee employee = employeeRepository.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản này"));

        Complaint complaint = complaintMapper.toEntity(request);
        complaint.setCompanyId(companyId);
        complaint.setComplainantEmployee(employee);
        complaint.setStatus(ComplaintStatus.OPEN);
        complaint.setSubmittedAt(LocalDateTime.now());

        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toResponse(saved);
    }

    @Transactional
    public ComplaintResponse assignHandler(UUID complaintId, UUID handlerEmployeeId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.COMPLAINT_NOT_FOUND));

        if (complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new AppException(RewardDisciplineErrorCode.COMPLAINT_ALREADY_CLOSED);
        }

        Employee handler = employeeRepository.findById(handlerEmployeeId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy cán bộ nhân sự thụ lý"));

        complaint.setHandlerEmployee(handler);
        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toResponse(saved);
    }

    @Transactional
    public ComplaintResponse startInvestigation(UUID complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.COMPLAINT_NOT_FOUND));

        if (complaint.getStatus() != ComplaintStatus.OPEN) {
            throw new AppException(RewardDisciplineErrorCode.INVALID_COMPLAINT_TRANSITION);
        }

        complaint.setStatus(ComplaintStatus.INVESTIGATING);
        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toResponse(saved);
    }

    @Transactional
    public ComplaintResponse resolveComplaint(UUID complaintId, ResolveComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.COMPLAINT_NOT_FOUND));

        if (complaint.getStatus() != ComplaintStatus.INVESTIGATING) {
            throw new AppException(RewardDisciplineErrorCode.INVALID_COMPLAINT_TRANSITION);
        }

        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setResolution(request.getResolution());
        complaint.setResolvedAt(LocalDateTime.now());

        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toResponse(saved);
    }

    @Transactional
    public ComplaintResponse closeComplaint(UUID complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.COMPLAINT_NOT_FOUND));

        if (complaint.getStatus() == ComplaintStatus.CLOSED) {
            throw new AppException(RewardDisciplineErrorCode.COMPLAINT_ALREADY_CLOSED);
        }

        complaint.setStatus(ComplaintStatus.CLOSED);
        complaint.setClosedAt(LocalDateTime.now());

        Complaint saved = complaintRepository.save(complaint);
        return complaintMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageData<ComplaintResponse> getMyComplaints(BaseFilterRequest filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                .orElseThrow(() -> AppException.unauthorized("Chưa đăng nhập"));

        Employee employee = employeeRepository.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));

        Pageable pageable = filter.toPageable("submittedAt", ALLOWED_SORT_FIELDS);
        Page<Complaint> page = complaintRepository.findAllByEmployeeId(employee.getId(), pageable);
        return PageData.of(page, complaintMapper::toResponse);
    }
}
