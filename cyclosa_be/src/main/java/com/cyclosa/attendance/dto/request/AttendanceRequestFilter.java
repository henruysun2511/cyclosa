package com.cyclosa.attendance.dto.request;

import com.cyclosa.attendance.enums.AttendanceRequestStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách đơn giải trình")
public class AttendanceRequestFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên")
    private UUID employeeId;

    @Schema(description = "Lọc theo trạng thái (PENDING, APPROVED, REJECTED, CANCELLED)")
    private AttendanceRequestStatus status;

    @Schema(description = "Từ ngày (YYYY-MM-DD)")
    private LocalDate startDate;

    @Schema(description = "Đến ngày (YYYY-MM-DD)")
    private LocalDate endDate;
}

