package com.cyclosa.attendance.controller;

import com.cyclosa.attendance.dto.request.AttendanceLogFilter;
import com.cyclosa.attendance.dto.request.CheckInRequest;
import com.cyclosa.attendance.dto.request.CheckOutRequest;
import com.cyclosa.attendance.dto.request.DailyRecordFilter;
import com.cyclosa.attendance.dto.request.MonthlySummaryFilter;
import com.cyclosa.attendance.dto.request.PunchRequest;
import com.cyclosa.attendance.dto.response.*;
import com.cyclosa.attendance.enums.AttendanceEventType;
import com.cyclosa.attendance.service.AttendanceCalculationService;
import com.cyclosa.attendance.service.AttendancePunchService;
import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Attendance", description = "Chấm công trực tuyến (Face AI + GPS) và Đối soát bảng công")
public class AttendanceController {

    private final AttendancePunchService attendancePunchService;
    private final AttendanceCalculationService attendanceCalculationService;

    @PostMapping("/api/v1/attendance/check-in")
    @Operation(summary = "Thực hiện Check-in vào ca", description = "Gửi ảnh camera, tọa độ GPS và mã transactionCode")
    public ResponseEntity<ApiResponse<AttendanceLogResponse>> checkIn(@Valid @RequestBody CheckInRequest req) {
        AttendanceLogResponse result = attendancePunchService.punch(AttendanceEventType.CHECK_IN, req);
        return ResponseEntity.ok(ApiResponse.ok(result, "Check-in thành công"));
    }

    @PostMapping("/api/v1/attendance/check-out")
    @Operation(summary = "Thực hiện Check-out tan ca", description = "Gửi ảnh camera, tọa độ GPS và mã transactionCode")
    public ResponseEntity<ApiResponse<AttendanceLogResponse>> checkOut(@Valid @RequestBody CheckOutRequest req) {
        AttendanceLogResponse result = attendancePunchService.punch(AttendanceEventType.CHECK_OUT, req);
        return ResponseEntity.ok(ApiResponse.ok(result, "Check-out thành công"));
    }

    @GetMapping("/api/v1/me/attendance/today")
    @Operation(summary = "Trạng thái chấm công ngày hôm nay của tôi")
    public ResponseEntity<ApiResponse<TodayAttendanceStatusResponse>> getMyTodayStatus() {
        TodayAttendanceStatusResponse result = attendancePunchService.getMyTodayStatus();
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy trạng thái chấm công hôm nay thành công"));
    }

    @GetMapping("/api/v1/me/attendance/logs")
    @Operation(summary = "Nhật ký các lượt quẹt thẻ của tôi")
    public ResponseEntity<ApiResponse<PageData<AttendanceLogResponse>>> getMyLogs(@Valid AttendanceLogFilter filter) {
        PageData<AttendanceLogResponse> result = attendancePunchService.getMyLogs(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy nhật ký chấm công cá nhân thành công"));
    }

    @GetMapping("/api/v1/me/attendance/daily-records")
    @Operation(summary = "Kết quả ngày công của tôi (đi muộn, về sớm, công tính)")
    public ResponseEntity<ApiResponse<PageData<DailyAttendanceRecordResponse>>> getMyDailyRecords(@Valid DailyRecordFilter filter) {
        PageData<DailyAttendanceRecordResponse> result = attendanceCalculationService.getMyDailyRecords(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy kết quả ngày công cá nhân thành công"));
    }

    @GetMapping("/api/v1/attendance/logs")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Tra cứu nhật ký log chấm công toàn công ty")
    public ResponseEntity<ApiResponse<PageData<AttendanceLogResponse>>> getLogs(@Valid AttendanceLogFilter filter) {
        PageData<AttendanceLogResponse> result = attendancePunchService.getLogs(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách log chấm công thành công"));
    }

    @GetMapping("/api/v1/attendance/logs/{id}")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Xem chi tiết log quẹt thẻ (ảnh live, tọa độ GPS)")
    public ResponseEntity<ApiResponse<AttendanceLogResponse>> getLogById(@PathVariable UUID id) {
        AttendanceLogResponse result = attendancePunchService.getLogById(id);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy chi tiết log thành công"));
    }

    @GetMapping("/api/v1/attendance/daily-records")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Kết quả công theo ngày của nhân viên toàn công ty")
    public ResponseEntity<ApiResponse<PageData<DailyAttendanceRecordResponse>>> getDailyRecords(@Valid DailyRecordFilter filter) {
        PageData<DailyAttendanceRecordResponse> result = attendanceCalculationService.calculateDailyRecords(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy kết quả ngày công thành công"));
    }

    @GetMapping("/api/v1/attendance/monthly-summary")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Ma trận bảng công tháng thời gian thực (chưa khóa)")
    public ResponseEntity<ApiResponse<MonthlyTimesheetSummaryResponse>> getMonthlySummary(@Valid MonthlySummaryFilter filter) {
        MonthlyTimesheetSummaryResponse result = attendanceCalculationService.calculateMonthlySummary(filter);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy ma trận bảng công tháng thành công"));
    }

    @GetMapping("/api/v1/attendance/exceptions")
    @PreAuthorize("@perm.has('attendance.view')")
    @RequirePermission("attendance.view")
    @Operation(summary = "Danh sách ngoại lệ chấm công cần xử lý gấp")
    public ResponseEntity<ApiResponse<List<AttendanceExceptionSummaryResponse>>> getExceptions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<AttendanceExceptionSummaryResponse> result = attendanceCalculationService.getExceptionSummaries(companyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(result, "Lấy danh sách ngoại lệ thành công"));
    }
}

