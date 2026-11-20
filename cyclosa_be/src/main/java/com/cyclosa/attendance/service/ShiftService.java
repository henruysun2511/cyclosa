package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.CreateShiftRequest;
import com.cyclosa.attendance.dto.request.ShiftFilter;
import com.cyclosa.attendance.dto.request.UpdateShiftRequest;
import com.cyclosa.attendance.dto.response.ShiftResponse;
import com.cyclosa.attendance.entity.Shift;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.ShiftAssignmentRepository;
import com.cyclosa.attendance.repository.ShiftRepository;
import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.common.util.PageableUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final AttendanceMapper attendanceMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "name", "code", "startTime", "endTime", "workCredit", "createdAt"
    );

    @Transactional(readOnly = true)
    public PageData<ShiftResponse> getShifts(ShiftFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("startTime", ALLOWED_SORT_FIELDS);

        Page<Shift> page = shiftRepository.searchShifts(companyId, kw, filter.getIsActive(), pageable);
        return PageData.of(page, attendanceMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ShiftResponse getShiftById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Shift shift = shiftRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.SHIFT_NOT_FOUND));
        return attendanceMapper.toResponse(shift);
    }

    @Transactional(readOnly = true)
    public Shift getEntityById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        return shiftRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.SHIFT_NOT_FOUND));
    }

    @Auditable(action = AuditAction.CREATE, entityType = "SHIFT", entityIdExpression = "#result.id", description = "Tạo mới ca làm việc")
    @Transactional
    public ShiftResponse createShift(CreateShiftRequest req) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        if (shiftRepository.existsByCompanyIdAndCodeIgnoreCase(companyId, req.getCode().trim())) {
            throw new AppException(AttendanceErrorCode.SHIFT_CODE_DUPLICATED);
        }

        Shift shift = attendanceMapper.toEntity(req);
        shift.setCompanyId(companyId);
        shift.setCode(req.getCode().trim().toUpperCase());

        Shift saved = shiftRepository.save(shift);
        log.info("Đã tạo mới ca làm việc: {} ({}) cho công ty: {}", saved.getName(), saved.getCode(), companyId);
        return attendanceMapper.toResponse(saved);
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "SHIFT", entityIdExpression = "#id", description = "Cập nhật cấu hình ca làm việc")
    @Transactional
    public ShiftResponse updateShift(UUID id, UpdateShiftRequest req) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Shift shift = shiftRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.SHIFT_NOT_FOUND));

        attendanceMapper.updateEntityFromDto(req, shift);
        Shift updated = shiftRepository.save(shift);
        log.info("Đã cập nhật ca làm việc: {}", id);
        return attendanceMapper.toResponse(updated);
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "SHIFT", entityIdExpression = "#id", description = "Thay đổi trạng thái kích hoạt ca làm việc")
    @Transactional
    public void activateShift(UUID id, boolean active) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Shift shift = shiftRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.SHIFT_NOT_FOUND));

        shift.setIsActive(active);
        shiftRepository.save(shift);
        log.info("Đã thay đổi trạng thái ca làm việc {}: isActive = {}", id, active);
    }

    @Auditable(action = AuditAction.DELETE, entityType = "SHIFT", entityIdExpression = "#id", description = "Xóa ca làm việc")
    @Transactional
    public void deleteShift(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Shift shift = shiftRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.SHIFT_NOT_FOUND));

        if (shiftAssignmentRepository.existsByShiftId(id)) {
            throw new AppException(AttendanceErrorCode.CANNOT_DELETE_ASSIGNED_SHIFT);
        }

        shiftRepository.delete(shift);
        log.info("Đã xóa ca làm việc: {}", id);
    }
}

