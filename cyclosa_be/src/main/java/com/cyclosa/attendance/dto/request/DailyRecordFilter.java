package com.cyclosa.attendance.dto.request;

import com.cyclosa.attendance.enums.DailyAttendanceStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc kết quả công theo ngày")
public class DailyRecordFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên")
    private UUID employeeId;

    @Schema(description = "Lọc theo phòng ban")
    private UUID departmentId;

    @Schema(description = "Ngày cần xem (YYYY-MM-DD)")
    private LocalDate workDate;

    @Schema(description = "Từ ngày (YYYY-MM-DD)")
    private LocalDate startDate;

    @Schema(description = "Đến ngày (YYYY-MM-DD)")
    private LocalDate endDate;

    @Schema(description = "Lọc theo trạng thái công (ON_TIME, LATE, EARLY, MISSING_CHECK_OUT, ABSENT...)")
    private DailyAttendanceStatus status;
}

