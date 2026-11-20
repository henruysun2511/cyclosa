package com.cyclosa.attendance.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số lọc lịch phân ca làm việc")
public class ShiftAssignmentFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên cụ thể")
    private UUID employeeId;

    @Schema(description = "Lọc theo phòng ban")
    private UUID departmentId;

    @Schema(description = "Từ ngày (YYYY-MM-DD)")
    private LocalDate startDate;

    @Schema(description = "Đến ngày (YYYY-MM-DD)")
    private LocalDate endDate;
}

