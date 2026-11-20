package com.cyclosa.attendance.service;

import com.cyclosa.attendance.client.AttendanceAiClient;
import com.cyclosa.attendance.config.AttendanceProperties;
import com.cyclosa.attendance.dto.request.AttendanceLogFilter;
import com.cyclosa.attendance.dto.request.PunchRequest;
import com.cyclosa.attendance.dto.response.AttendanceLogResponse;
import com.cyclosa.attendance.dto.response.TodayAttendanceStatusResponse;
import com.cyclosa.attendance.entity.AttendanceLog;
import com.cyclosa.attendance.entity.Shift;
import com.cyclosa.attendance.entity.ShiftAssignment;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import com.cyclosa.attendance.enums.VerificationResult;
import com.cyclosa.attendance.exception.AttendanceErrorCode;
import com.cyclosa.attendance.mapper.AttendanceMapper;
import com.cyclosa.attendance.repository.AttendanceLogRepository;
import com.cyclosa.attendance.repository.ShiftAssignmentRepository;
import com.cyclosa.attendance.service.helper.GeofencingHelper;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.dto.response.WorkAssignmentResponse;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeAssignmentService;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.organization.dto.response.BranchResponse;
import com.cyclosa.organization.service.BranchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendancePunchService {

    private final AttendanceLogRepository attendanceLogRepository;
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final EmployeeService employeeService;
    private final EmployeeAssignmentService employeeAssignmentService;
    private final BranchService branchService;
    private final AttendanceAiClient attendanceAiClient;
    private final AttendanceProperties attendanceProperties;
    private final AttendanceMapper attendanceMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "occurredAt", "createdAt"
    );

    @Transactional
    public AttendanceLogResponse punch(AttendanceEventType eventType, PunchRequest req) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên để thực hiện chấm công"));

        // 1. Chống lặp mã giao dịch
        if (attendanceLogRepository.existsByTransactionCode(req.getTransactionCode())) {
            throw new AppException(AttendanceErrorCode.DUPLICATE_PUNCH_TRANSACTION);
        }

        Instant now = Instant.now();
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));

        // 2. Tìm ca làm việc hôm nay
        Optional<ShiftAssignment> assignmentOpt = shiftAssignmentRepository.findByEmployeeIdAndWorkDate(employee.getId(), today);
        UUID assignmentId = assignmentOpt.map(ShiftAssignment::getId).orElse(null);

        // 3. Xác thực sinh trắc học AI (Khuôn mặt & Liveness)
        VerificationResult verificationResult = VerificationResult.SUCCESS;
        BigDecimal matchScore = BigDecimal.valueOf(95.0);

        if (req.getLiveImageBase64() != null && !req.getLiveImageBase64().isBlank()) {
            AttendanceAiClient.FaceVerifyAiRequest aiReq = AttendanceAiClient.FaceVerifyAiRequest.builder()
                    .employee_id(employee.getId().toString())
                    .live_image_base64(req.getLiveImageBase64())
                    .enrolled_template_ref(employee.getPortraitUrl())
                    .liveness_check(attendanceProperties.isLivenessCheckRequired())
                    .threshold(attendanceProperties.getFaceMatchThreshold())
                    .build();

            Optional<AttendanceAiClient.FaceVerifyAiResult> aiResOpt = attendanceAiClient.verifyFace(aiReq);
            if (aiResOpt.isPresent()) {
                AttendanceAiClient.FaceVerifyAiResult aiRes = aiResOpt.get();
                matchScore = aiRes.getMatch_score() != null ? BigDecimal.valueOf(aiRes.getMatch_score()) : matchScore;

                if ("LIVENESS_FAILED".equalsIgnoreCase(aiRes.getVerification_result())) {
                    verificationResult = VerificationResult.LIVENESS_FAILED;
                } else if ("FACE_MISMATCH".equalsIgnoreCase(aiRes.getVerification_result()) || Boolean.FALSE.equals(aiRes.getIs_matched())) {
                    verificationResult = VerificationResult.FACE_MISMATCH;
                } else if ("LOW_IMAGE_QUALITY".equalsIgnoreCase(aiRes.getVerification_result())) {
                    verificationResult = VerificationResult.LOW_IMAGE_QUALITY;
                } else {
                    verificationResult = VerificationResult.SUCCESS;
                }
            }
        }

        // 4. Kiểm tra Geofencing GPS (Khoảng cách tới Chi nhánh công tác)
        if (req.getLatitude() != null && req.getLongitude() != null) {
            try {
                WorkAssignmentResponse workAssignment = employeeAssignmentService.getWorkAssignmentAt(employee.getId(), today);
                if (workAssignment != null && workAssignment.getBranchId() != null) {
                    BranchResponse branch = branchService.getBranchById(workAssignment.getBranchId());
                    if (branch != null && branch.getLatitude() != null && branch.getLongitude() != null) {
                        int radiusMeters = (branch.getAttendanceRadiusMeters() != null && branch.getAttendanceRadiusMeters() > 0)
                                ? branch.getAttendanceRadiusMeters()
                                : attendanceProperties.getDefaultRadiusMeters();

                        boolean withinRadius = GeofencingHelper.isWithinRadius(
                                req.getLatitude(), req.getLongitude(),
                                branch.getLatitude(), branch.getLongitude(),
                                radiusMeters
                        );

                        if (!withinRadius) {
                            log.warn("Nhân viên {} chấm công ngoài phạm vi chi nhánh {}: coords=({}, {}), branch=({}, {}), radius={}m",
                                    employee.getEmployeeCode(), branch.getName(),
                                    req.getLatitude(), req.getLongitude(),
                                    branch.getLatitude(), branch.getLongitude(), radiusMeters);
                            if (verificationResult == VerificationResult.SUCCESS) {
                                verificationResult = VerificationResult.OUT_OF_RANGE;
                            }
                        }
                    }
                }
            } catch (Exception ex) {
                log.warn("Không thể kiểm tra Geofencing chi nhánh cho nhân viên {}: {}", employee.getEmployeeCode(), ex.getMessage());
            }

            // Kiểm tra dị thường GPS qua AI (tốc độ di chuyển, nhảy vọt tọa độ)
            AttendanceAiClient.AnomalyDetectAiRequest anomalyReq = AttendanceAiClient.AnomalyDetectAiRequest.builder()
                    .employee_id(employee.getId().toString())
                    .latitude(req.getLatitude().doubleValue())
                    .longitude(req.getLongitude().doubleValue())
                    .occurred_at(now.toString())
                    .build();
            attendanceAiClient.detectAnomaly(anomalyReq);
        }

        // 5. Ghi log bất biến (Append-Only)
        AttendanceLog logEntity = AttendanceLog.builder()
                .transactionCode(req.getTransactionCode())
                .employeeId(employee.getId())
                .shiftAssignmentId(assignmentId)
                .eventType(eventType)
                .occurredAt(now)
                .verificationResult(verificationResult)
                .faceMatchScore(matchScore)
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .deviceInfo(req.getDeviceInfo())
                .build();

        AttendanceLog saved = attendanceLogRepository.save(logEntity);
        log.info("Nhân viên {} thực hiện {}: kết quả = {}", employee.getEmployeeCode(), eventType, verificationResult);

        AttendanceLogResponse response = attendanceMapper.toResponse(saved);
        response.setEmployeeName(employee.getLastName() + " " + employee.getFirstName());
        response.setEmployeeCode(employee.getEmployeeCode());
        return response;
    }

    @Transactional(readOnly = true)
    public TodayAttendanceStatusResponse getMyTodayStatus() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));
        return getTodayStatus(employee.getId());
    }

    @Transactional(readOnly = true)
    public TodayAttendanceStatusResponse getTodayStatus(UUID employeeId) {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
        Instant startOfDay = today.atStartOfDay(zone).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(zone).toInstant();

        Optional<Employee> empOpt = employeeService.findEntityById(employeeId);
        String empName = empOpt.map(e -> e.getLastName() + " " + e.getFirstName()).orElse("Nhân viên");

        Optional<ShiftAssignment> saOpt = shiftAssignmentRepository.findByEmployeeIdAndWorkDate(employeeId, today);
        Shift shift = saOpt.map(ShiftAssignment::getShift).orElse(null);

        List<AttendanceLog> logs = attendanceLogRepository.findByEmployeeIdAndOccurredAtBetween(employeeId, startOfDay, endOfDay);

        Instant firstIn = logs.stream()
                .filter(l -> l.getEventType() == AttendanceEventType.CHECK_IN && l.getVerificationResult() == VerificationResult.SUCCESS)
                .map(AttendanceLog::getOccurredAt)
                .min(Instant::compareTo)
                .orElse(null);

        Instant lastOut = logs.stream()
                .filter(l -> l.getEventType() == AttendanceEventType.CHECK_OUT && l.getVerificationResult() == VerificationResult.SUCCESS)
                .map(AttendanceLog::getOccurredAt)
                .max(Instant::compareTo)
                .orElse(null);

        DailyAttendanceStatus status = DailyAttendanceStatus.ON_TIME;
        int lateMin = 0;
        int earlyMin = 0;
        BigDecimal workCredit = shift != null ? shift.getWorkCredit() : BigDecimal.valueOf(1.0);

        if (firstIn == null && lastOut == null) {
            status = DailyAttendanceStatus.MISSING_CHECK_OUT;
        } else if (firstIn != null && shift != null) {
            LocalTime actualInTime = firstIn.atZone(zone).toLocalTime();
            int diffMin = (int) Duration.between(shift.getStartTime(), actualInTime).toMinutes();
            if (diffMin > shift.getLateGraceMinutes()) {
                lateMin = diffMin;
                status = DailyAttendanceStatus.LATE;
            }
        }

        return TodayAttendanceStatusResponse.builder()
                .employeeId(employeeId)
                .employeeName(empName)
                .todayDate(today)
                .shiftName(shift != null ? shift.getName() : "Ca mặc định")
                .shiftHours(shift != null ? shift.getStartTime() + " - " + shift.getEndTime() : "08:00 - 17:00")
                .firstCheckInTime(firstIn)
                .lastCheckOutTime(lastOut)
                .status(status)
                .lateMinutes(lateMin)
                .earlyMinutes(earlyMin)
                .workCredit(workCredit)
                .canCheckIn(true)
                .canCheckOut(firstIn != null)
                .build();
    }

    @Transactional(readOnly = true)
    public PageData<AttendanceLogResponse> getLogs(AttendanceLogFilter filter) {
        Pageable pageable = filter.toPageable("occurredAt", ALLOWED_SORT_FIELDS);

        Page<AttendanceLog> page = attendanceLogRepository.searchLogs(
                filter.getEmployeeId(),
                filter.getEventType(),
                filter.getVerificationResult(),
                filter.getFrom(),
                filter.getTo(),
                pageable
        );

        return PageData.of(page, log -> {
            AttendanceLogResponse res = attendanceMapper.toResponse(log);
            try {
                employeeService.findEntityById(log.getEmployeeId()).ifPresent(e -> {
                    res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
                    res.setEmployeeCode(e.getEmployeeCode());
                });
            } catch (Exception ignored) {
            }
            return res;
        });
    }

    @Transactional(readOnly = true)
    public PageData<AttendanceLogResponse> getMyLogs(AttendanceLogFilter filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên"));

        filter.setEmployeeId(employee.getId());
        return getLogs(filter);
    }

    @Transactional(readOnly = true)
    public AttendanceLogResponse getLogById(UUID id) {
        AttendanceLog log = attendanceLogRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy bản ghi quẹt thẻ"));

        AttendanceLogResponse res = attendanceMapper.toResponse(log);
        employeeService.findEntityById(log.getEmployeeId()).ifPresent(e -> {
            res.setEmployeeName(e.getLastName() + " " + e.getFirstName());
            res.setEmployeeCode(e.getEmployeeCode());
        });
        return res;
    }
}

