package com.cyclosa.leave.dto.response;

import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeavePayer;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chi tiết loại nghỉ phép")
public class LeaveTypeResponse {

    @Schema(description = "ID loại nghỉ phép")
    private UUID id;

    @Schema(description = "ID công ty")
    private UUID companyId;

    @Schema(description = "Mã loại nghỉ")
    private String code;

    @Schema(description = "Tên loại nghỉ")
    private String name;

    @Schema(description = "Nhóm phân loại nghỉ")
    private LeaveGroup leaveGroup;

    @Schema(description = "Nguồn chi trả chế độ")
    private LeavePayer payer;

    @Schema(description = "Số ngày cố định theo sự kiện (nếu có)")
    private BigDecimal fixedDays;

    @Schema(description = "Cần phê duyệt qua quy trình")
    private boolean requiresApproval;

    @Schema(description = "Trạng thái đang kích hoạt")
    private boolean isActive;

    @Schema(description = "Mô tả chi tiết")
    private String description;

    @Schema(description = "Thời điểm tạo")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm cập nhật")
    private LocalDateTime updatedAt;
}
