package com.cyclosa.leave.dto.request;

import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeavePayer;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "Yêu cầu cập nhật loại nghỉ phép")
public class UpdateLeaveTypeRequest {

    @NotBlank(message = "Tên loại nghỉ không được để trống")
    @Size(max = 150, message = "Tên loại nghỉ tối đa 150 ký tự")
    @Schema(description = "Tên loại nghỉ", example = "Nghỉ phép năm")
    private String name;

    @NotNull(message = "Nhóm phân loại nghỉ không được để trống")
    @Schema(description = "Nhóm phân loại nghỉ")
    private LeaveGroup leaveGroup;

    @NotNull(message = "Nguồn chi trả không được để trống")
    @Schema(description = "Nguồn chi trả chế độ")
    private LeavePayer payer;

    @Schema(description = "Số ngày cố định theo sự kiện (kết hôn: 3 ngày, tang lễ: 3 ngày...)")
    private BigDecimal fixedDays;

    @NotNull(message = "Cần phê duyệt không được để trống")
    @Schema(description = "Cần phê duyệt qua quy trình", example = "true")
    private Boolean requiresApproval;

    @NotNull(message = "Trạng thái kích hoạt không được để trống")
    @Schema(description = "Trạng thái đang kích hoạt sử dụng", example = "true")
    private Boolean isActive;

    @Schema(description = "Mô tả chi tiết hoặc quy định áp dụng")
    private String description;
}

