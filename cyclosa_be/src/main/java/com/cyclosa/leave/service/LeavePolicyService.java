package com.cyclosa.leave.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.contract.entity.enums.ContractType;
import com.cyclosa.leave.dto.request.CreateLeavePolicyRequest;
import com.cyclosa.leave.dto.request.LeavePolicyFilter;
import com.cyclosa.leave.dto.request.UpdateLeavePolicyRequest;
import com.cyclosa.leave.dto.response.LeavePolicyResponse;
import com.cyclosa.leave.entity.LeavePolicy;
import com.cyclosa.leave.entity.LeaveType;
import com.cyclosa.leave.exception.LeaveErrorCode;
import com.cyclosa.leave.mapper.LeavePolicyMapper;
import com.cyclosa.leave.repository.LeavePolicyRepository;
import com.cyclosa.leave.repository.specification.LeavePolicySpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeavePolicyService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("effectiveFrom", "annualEntitlementDays", "createdAt");

    private final LeavePolicyRepository leavePolicyRepository;
    private final LeaveTypeService leaveTypeService;
    private final LeavePolicyMapper leavePolicyMapper;

    @Transactional(readOnly = true)
    public PageData<LeavePolicyResponse> getLeavePolicies(LeavePolicyFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("effectiveFrom", ALLOWED_SORT_FIELDS);

        Specification<LeavePolicy> spec = LeavePolicySpecification.withFilter(companyId, filter);
        Page<LeavePolicy> pageResult = leavePolicyRepository.findAll(spec, pageable);

        return PageData.of(pageResult, leavePolicyMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public LeavePolicyResponse getLeavePolicyById(UUID id) {
        LeavePolicy policy = findEntityById(id);
        return leavePolicyMapper.toResponse(policy);
    }

    @Transactional(readOnly = true)
    public LeavePolicy findEntityById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        return leavePolicyRepository.findById(id)
                .filter(p -> p.getCompanyId().equals(companyId))
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_POLICY_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Optional<LeavePolicy> resolveApplicablePolicy(
            UUID companyId, UUID leaveTypeId, ContractType contractType, LocalDate effectiveDate) {
        List<LeavePolicy> policies = leavePolicyRepository.findApplicablePolicies(
                companyId, leaveTypeId, contractType, effectiveDate);
        if (policies.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(policies.get(0));
    }

    @Transactional
    @Auditable(action = AuditAction.CREATE, entityType = "LEAVE_POLICY", entityIdExpression = "#result.id", description = "Tạo mới chính sách nghỉ phép")
    public LeavePolicyResponse createLeavePolicy(CreateLeavePolicyRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        LeaveType leaveType = leaveTypeService.findEntityById(request.getLeaveTypeId());

        boolean exists = leavePolicyRepository.existsByCompanyIdAndLeaveTypeIdAndContractTypeAndEffectiveFrom(
                companyId, leaveType.getId(), request.getContractType(), request.getEffectiveFrom());
        if (exists) {
            throw new AppException(LeaveErrorCode.LEAVE_POLICY_CONFLICT);
        }

        LeavePolicy policy = leavePolicyMapper.toEntity(request);
        policy.setCompanyId(companyId);
        policy.setLeaveType(leaveType);

        LeavePolicy saved = leavePolicyRepository.save(policy);
        log.info("Đã tạo chính sách nghỉ phép: id={}, leaveType={}", saved.getId(), leaveType.getCode());
        return leavePolicyMapper.toResponse(saved);
    }

    @Transactional
    @Auditable(action = AuditAction.UPDATE, entityType = "LEAVE_POLICY", entityIdExpression = "#id", description = "Cập nhật chính sách nghỉ phép")
    public LeavePolicyResponse updateLeavePolicy(UUID id, UpdateLeavePolicyRequest request) {
        LeavePolicy policy = findEntityById(id);

        boolean exists = leavePolicyRepository.existsByCompanyIdAndLeaveTypeIdAndContractTypeAndEffectiveFromAndIdNot(
                policy.getCompanyId(), policy.getLeaveType().getId(), request.getContractType(), request.getEffectiveFrom(), id);
        if (exists) {
            throw new AppException(LeaveErrorCode.LEAVE_POLICY_CONFLICT);
        }

        leavePolicyMapper.updateEntityFromRequest(request, policy);
        LeavePolicy updated = leavePolicyRepository.save(policy);
        log.info("Đã cập nhật chính sách nghỉ phép: id={}", updated.getId());
        return leavePolicyMapper.toResponse(updated);
    }

    @Transactional
    @Auditable(action = AuditAction.DELETE, entityType = "LEAVE_POLICY", entityIdExpression = "#id", description = "Xóa chính sách nghỉ phép")
    public void deleteLeavePolicy(UUID id) {
        LeavePolicy policy = findEntityById(id);
        leavePolicyRepository.delete(policy);
        log.info("Đã xóa chính sách nghỉ phép: id={}", id);
    }
}

