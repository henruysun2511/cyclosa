package com.cyclosa.leave.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeavePayer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Bộ lọc danh sách loại nghỉ phép")
public class LeaveTypeFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhóm nghỉ (ANNUAL, SICK, MATERNITY...)")
    private LeaveGroup leaveGroup;

    @Schema(description = "Lọc theo nguồn chi trả (EMPLOYER, SOCIAL_INSURANCE, NONE)")
    private LeavePayer payer;

    @Schema(description = "Lọc theo trạng thái kích hoạt")
    private Boolean isActive;
}

