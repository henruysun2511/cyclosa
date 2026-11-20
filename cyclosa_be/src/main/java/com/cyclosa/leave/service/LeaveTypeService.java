package com.cyclosa.leave.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.leave.dto.request.CreateLeaveTypeRequest;
import com.cyclosa.leave.dto.request.LeaveTypeFilter;
import com.cyclosa.leave.dto.request.UpdateLeaveTypeRequest;
import com.cyclosa.leave.dto.response.LeaveTypeResponse;
import com.cyclosa.leave.entity.LeaveType;
import com.cyclosa.leave.exception.LeaveErrorCode;
import com.cyclosa.leave.mapper.LeaveTypeMapper;
import com.cyclosa.leave.repository.LeaveBalanceRepository;
import com.cyclosa.leave.repository.LeavePolicyRepository;
import com.cyclosa.leave.repository.LeaveRequestRepository;
import com.cyclosa.leave.repository.LeaveTypeRepository;
import com.cyclosa.leave.repository.specification.LeaveTypeSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveTypeService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("code", "name", "leaveGroup", "payer", "createdAt");

    private final LeaveTypeRepository leaveTypeRepository;
    private final LeavePolicyRepository leavePolicyRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeMapper leaveTypeMapper;

    @Transactional(readOnly = true)
    public PageData<LeaveTypeResponse> getLeaveTypes(LeaveTypeFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<LeaveType> spec = LeaveTypeSpecification.withFilter(companyId, filter);
        Page<LeaveType> pageResult = leaveTypeRepository.findAll(spec, pageable);

        return PageData.of(pageResult, leaveTypeMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<LeaveTypeResponse> getActiveLeaveTypes() {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<LeaveType> list = leaveTypeRepository.findByCompanyIdAndIsActiveTrue(companyId);
        return leaveTypeMapper.toResponseList(list);
    }

    @Transactional(readOnly = true)
    public LeaveTypeResponse getLeaveTypeById(UUID id) {
        LeaveType entity = findEntityById(id);
        return leaveTypeMapper.toResponse(entity);
    }

    @Transactional(readOnly = true)
    public LeaveType findEntityById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        return leaveTypeRepository.findById(id)
                .filter(t -> t.getCompanyId().equals(companyId))
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_TYPE_NOT_FOUND));
    }

    @Transactional
    @Auditable(action = AuditAction.CREATE, entityType = "LEAVE_TYPE", entityIdExpression = "#result.id", description = "Tạo mới loại nghỉ phép")
    public LeaveTypeResponse createLeaveType(CreateLeaveTypeRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        String code = request.getCode().trim().toUpperCase();
        if (leaveTypeRepository.existsByCompanyIdAndCode(companyId, code)) {
            throw new AppException(LeaveErrorCode.LEAVE_TYPE_CODE_ALREADY_EXISTS);
        }

        LeaveType entity = leaveTypeMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setCode(code);

        LeaveType saved = leaveTypeRepository.save(entity);
        log.info("Đã tạo loại nghỉ phép mới: id={}, code={}", saved.getId(), saved.getCode());
        return leaveTypeMapper.toResponse(saved);
    }

    @Transactional
    @Auditable(action = AuditAction.UPDATE, entityType = "LEAVE_TYPE", entityIdExpression = "#id", description = "Cập nhật loại nghỉ phép")
    public LeaveTypeResponse updateLeaveType(UUID id, UpdateLeaveTypeRequest request) {
        LeaveType entity = findEntityById(id);

        leaveTypeMapper.updateEntityFromRequest(request, entity);
        LeaveType updated = leaveTypeRepository.save(entity);
        log.info("Đã cập nhật loại nghỉ phép: id={}, code={}", updated.getId(), updated.getCode());
        return leaveTypeMapper.toResponse(updated);
    }

    @Transactional
    @Auditable(action = AuditAction.DELETE, entityType = "LEAVE_TYPE", entityIdExpression = "#id", description = "Xóa loại nghỉ phép")
    public void deleteLeaveType(UUID id) {
        LeaveType entity = findEntityById(id);

        // Kiểm tra ràng buộc tham chiếu trước khi xóa
        if (leavePolicyRepository.existsByLeaveTypeId(id)
                || leaveBalanceRepository.existsByLeaveTypeId(id)
                || leaveRequestRepository.existsByLeaveTypeId(id)) {
            throw new AppException(LeaveErrorCode.LEAVE_TYPE_IN_USE);
        }

        leaveTypeRepository.delete(entity);
        log.info("Đã xóa loại nghỉ phép: id={}, code={}", id, entity.getCode());
    }
}

