package com.cyclosa.leave.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Bộ lọc tra cứu quỹ phép nhân viên")
public class LeaveBalanceFilter extends BaseFilterRequest {

    @Schema(description = "Năm tra cứu quỹ phép", example = "2026")
    private Integer year;

    @Schema(description = "ID loại nghỉ phép")
    private UUID leaveTypeId;

    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @Schema(description = "ID phòng ban")
    private UUID departmentId;
}

