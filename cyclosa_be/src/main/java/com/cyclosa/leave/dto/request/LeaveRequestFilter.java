package com.cyclosa.leave.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Bộ lọc danh sách đơn xin nghỉ phép")
public class LeaveRequestFilter extends BaseFilterRequest {

    @Schema(description = "ID nhân viên nghỉ")
    private UUID employeeId;

    @Schema(description = "ID phòng ban")
    private UUID departmentId;

    @Schema(description = "ID loại nghỉ")
    private UUID leaveTypeId;

    @Schema(description = "Trạng thái đơn (PENDING_APPROVAL, APPROVED, REJECTED, CANCELLED)")
    private LeaveRequestStatus status;

    @Schema(description = "Từ ngày", example = "2026-01-01")
    private LocalDate from;

    @Schema(description = "Đến ngày", example = "2026-12-31")
    private LocalDate to;

    @Schema(description = "Năm cần lọc (dành cho màn hình My Leave)", example = "2026")
    private Integer year;
}

