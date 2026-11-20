package com.cyclosa.attendance.service;

import com.cyclosa.attendance.dto.request.AttendanceRequestFilter;
import com.cyclosa.attendance.dto.request.CreateAttendanceRequestDto;
import com.cyclosa.attendance.dto.request.UpdateApprovedTimesRequest;
import com.cyclosa.attendance.dto.response.AttendanceAdjustmentResponse;
import com.cyclosa.attendance.dto.response.AttendanceRequestResponse;
import com.cyclosa.attendance.entity.AttendanceAdjustment;
import com.cyclosa.attendance.entity.AttendanceRequest;
import com.cyclosa.attendance.enums.AttendanceRequestStatus;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.AttendanceAdjustmentRepository;
import com.cyclosa.attendance.repository.AttendanceRequestRepository;
import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.event.SendNotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceRequestService {

    private final AttendanceRequestRepository attendanceRequestRepository;
    private final AttendanceAdjustmentRepository attendanceAdjustmentRepository;
    private final EmployeeService employeeService;
    private final AttendanceMapper attendanceMapper;
    private final ApplicationEventPublisher eventPublisher;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "workDate", "submittedAt", "createdAt"
    );

    @Auditable(action = AuditAction.CREATE, entityType = "ATTENDANCE_REQUEST", entityIdExpression = "#result.id", description = "Tạo mới đơn giải trình chấm công")
    @Transactional
    public AttendanceRequestResponse createRequest(CreateAttendanceRequestDto req) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên để gửi đơn giải trình"));

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        // Kiểm tra xem đã có đơn PENDING cho ngày này chưa
        if (attendanceRequestRepository.existsByEmployeeIdAndWorkDateAndStatus(employee.getId(), req.getWorkDate(), AttendanceRequestStatus.PENDING)) {
            throw new AppException(AttendanceErrorCode.ATTENDANCE_REQUEST_ALREADY_EXISTS);
        }

        AttendanceRequest entity = AttendanceRequest.builder()
                .companyId(companyId)
                .employeeId(employee.getId())
                .workDate(req.getWorkDate())
                .requestType(req.getRequestType())
                .proposedCheckIn(req.getProposedCheckIn())
                .proposedCheckOut(req.getProposedCheckOut())
                .reason(req.getReason())
                .attachmentFileId(req.getAttachmentFileId())
                .submittedAt(Instant.now())
                .status(AttendanceRequestStatus.PENDING)
                .build();

        AttendanceRequest saved = attendanceRequestRepository.save(entity);
        log.info("Nhân viên {} đã gửi đơn giải trình chấm công ngày {}", employee.getEmployeeCode(), req.getWorkDate());

        if (employee.getUserId() != null) {
            eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                    employee.getUserId(),
                    NotificationType.ATTENDANCE,
                    "Đơn giải trình chấm công đã gửi",
                    "Đơn giải trình chấm công ngày " + req.getWorkDate() + " của bạn đã được gửi thành công và đang chờ xét duyệt.",
                    "/me/attendance-requests"
            ));
        }

        AttendanceRequestResponse res = attendanceMapper.toResponse(saved);
        res.setEmployeeName(employee.getLastName() + " " + employee.getFirstName());
        res.setEmployeeCode(employee.getEmployeeCode());
        return res;
    }

    @Transactional(readOnly = true)
    public PageData<AttendanceRequestResponse> getMyRequests(AttendanceRequestFilter filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));

        filter.setEmployeeId(employee.getId());
        return getAllRequests(filter);
    }

    @Transactional(readOnly = true)
    public PageData<AttendanceRequestResponse> getAllRequests(AttendanceRequestFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("submittedAt", ALLOWED_SORT_FIELDS);

        Page<AttendanceRequest> page = attendanceRequestRepository.searchRequests(
                companyId,
                filter.getEmployeeId(),
                filter.getStatus(),
                filter.getStartDate(),
                filter.getEndDate(),
                pageable
        );

        return PageData.of(page, req -> {
            AttendanceRequestResponse res = attendanceMapper.toResponse(req);
            employeeService.findEntityById(req.getEmployeeId()).ifPresent(e -> {
                res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
                res.setEmployeeCode(e.getEmployeeCode());
            });

            Optional<AttendanceAdjustment> adjOpt = attendanceAdjustmentRepository.findByAttendanceRequestId(req.getId());
            if (adjOpt.isPresent()) {
                res.setAdjusted(true);
                res.setAdjustedCheckIn(adjOpt.get().getAdjustedCheckIn());
                res.setAdjustedCheckOut(adjOpt.get().getAdjustedCheckOut());
            }
            return res;
        });
    }

    @Transactional(readOnly = true)
    public AttendanceRequestResponse getRequestById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        AttendanceRequest req = attendanceRequestRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.ATTENDANCE_REQUEST_NOT_FOUND));

        AttendanceRequestResponse res = attendanceMapper.toResponse(req);
        employeeService.findEntityById(req.getEmployeeId()).ifPresent(e -> {
            res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
            res.setEmployeeCode(e.getEmployeeCode());
        });

        attendanceAdjustmentRepository.findByAttendanceRequestId(id).ifPresent(adj -> {
            res.setAdjusted(true);
            res.setAdjustedCheckIn(adj.getAdjustedCheckIn());
            res.setAdjustedCheckOut(adj.getAdjustedCheckOut());
        });
        return res;
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "ATTENDANCE_REQUEST", entityIdExpression = "#id", description = "Hủy đơn giải trình chấm công")
    @Transactional
    public void cancelRequest(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        AttendanceRequest req = attendanceRequestRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.ATTENDANCE_REQUEST_NOT_FOUND));

        if (req.getStatus() != AttendanceRequestStatus.PENDING) {
            throw new AppException(AttendanceErrorCode.CANNOT_CANCEL_APPROVED_REQUEST);
        }

        req.setStatus(AttendanceRequestStatus.CANCELLED);
        attendanceRequestRepository.save(req);
        log.info("Đã hủy đơn giải trình ID: {}", id);
    }

    @Auditable(action = AuditAction.APPROVE, entityType = "ATTENDANCE_REQUEST", entityIdExpression = "#id", description = "Phê duyệt đơn giải trình chấm công")
    @Transactional
    public AttendanceRequestResponse updateApprovedTimesAndApprove(UUID id, UpdateApprovedTimesRequest body) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID reviewerUserId = SecurityUtils.getCurrentUserId();

        AttendanceRequest req = attendanceRequestRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.ATTENDANCE_REQUEST_NOT_FOUND));

        if (req.getStatus() != AttendanceRequestStatus.PENDING) {
            throw AppException.badRequest("Đơn giải trình này đã được xử lý trước đó");
        }

        Instant checkIn = body != null && body.getApprovedCheckIn() != null ? body.getApprovedCheckIn() : req.getProposedCheckIn();
        Instant checkOut = body != null && body.getApprovedCheckOut() != null ? body.getApprovedCheckOut() : req.getProposedCheckOut();

        // 1. Cập nhật trạng thái đơn
        req.setStatus(AttendanceRequestStatus.APPROVED);
        req.setReviewedByUserId(reviewerUserId);
        req.setReviewedAt(Instant.now());
        attendanceRequestRepository.save(req);

        // 2. Tạo bản ghi điều chỉnh công (AttendanceAdjustment) - Không bao giờ sửa log gốc
        AttendanceAdjustment adjustment = AttendanceAdjustment.builder()
                .companyId(companyId)
                .employeeId(req.getEmployeeId())
                .attendanceRequest(req)
                .adjustedCheckIn(checkIn)
                .adjustedCheckOut(checkOut)
                .notes(body != null ? body.getReviewerNotes() : "Đã phê duyệt đơn giải trình")
                .build();
        attendanceAdjustmentRepository.save(adjustment);

        // Bắn thông báo phê duyệt cho nhân viên
        employeeService.findEntityById(req.getEmployeeId()).ifPresent(emp -> {
            if (emp.getUserId() != null) {
                eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                        emp.getUserId(),
                        NotificationType.ATTENDANCE,
                        "Đơn giải trình chấm công đã được phê duyệt",
                        "Đơn giải trình chấm công ngày " + req.getWorkDate() + " của bạn đã được phê duyệt và ghi nhận số liệu điều chỉnh.",
                        "/me/attendance-requests"
                ));
            }
        });

        log.info("Đã phê duyệt đơn giải trình {} và tạo bản ghi điều chỉnh công tương ứng", id);
        return getRequestById(id);
    }

    @Auditable(action = AuditAction.REJECT, entityType = "ATTENDANCE_REQUEST", entityIdExpression = "#id", description = "Từ chối đơn giải trình chấm công")
    @Transactional
    public AttendanceRequestResponse rejectRequest(UUID id, String rejectionReason) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID reviewerUserId = SecurityUtils.getCurrentUserId();

        AttendanceRequest req = attendanceRequestRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(AttendanceErrorCode.ATTENDANCE_REQUEST_NOT_FOUND));

        if (req.getStatus() != AttendanceRequestStatus.PENDING) {
            throw AppException.badRequest("Đơn giải trình này đã được xử lý trước đó");
        }

        req.setStatus(AttendanceRequestStatus.REJECTED);
        req.setReviewedByUserId(reviewerUserId);
        req.setReviewedAt(Instant.now());
        req.setRejectionReason(rejectionReason != null ? rejectionReason.trim() : null);
        attendanceRequestRepository.save(req);

        // Bắn thông báo từ chối cho nhân viên
        employeeService.findEntityById(req.getEmployeeId()).ifPresent(emp -> {
            if (emp.getUserId() != null) {
                eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                        emp.getUserId(),
                        NotificationType.ATTENDANCE,
                        "Đơn giải trình chấm công bị từ chối",
                        "Đơn giải trình chấm công ngày " + req.getWorkDate() + " của bạn đã bị từ chối. Lý do: " + (rejectionReason != null ? rejectionReason.trim() : "Không nêu"),
                        "/me/attendance-requests"
                ));
            }
        });

        log.info("Đã từ chối đơn giải trình {} của nhân viên {}", id, req.getEmployeeId());
        return getRequestById(id);
    }

    @Transactional(readOnly = true)
    public PageData<AttendanceAdjustmentResponse> getAdjustments(UUID employeeId, Pageable pageable) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Page<AttendanceAdjustment> page = attendanceAdjustmentRepository.searchAdjustments(companyId, employeeId, pageable);

        return PageData.of(page, adj -> {
            AttendanceAdjustmentResponse res = attendanceMapper.toResponse(adj);
            employeeService.findEntityById(adj.getEmployeeId()).ifPresent(e -> {
                res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
                res.setEmployeeCode(e.getEmployeeCode());
            });
            return res;
        });
    }
}

