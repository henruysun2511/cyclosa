package com.cyclosa.offboarding.dto.request;

import com.cyclosa.offboarding.enums.ResignationReason;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tiếp nhận / Tạo đơn xin thôi việc")
public class CreateResignationRequest {

    @NotNull(message = "Nhân viên không được để trống")
    @Schema(description = "ID nhân viên làm đơn", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employeeId;

    @NotNull(message = "Lý do thôi việc không được để trống")
    @Schema(description = "Lý do chính xin thôi việc", requiredMode = Schema.RequiredMode.REQUIRED)
    private ResignationReason resignationReason;

    @NotNull(message = "Ngày gửi thông báo không được để trống")
    @Schema(description = "Ngày nhân viên gửi thông báo thôi việc", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate noticeDate;

    @NotNull(message = "Ngày mong muốn làm việc cuối cùng không được để trống")
    @Schema(description = "Ngày mong muốn làm việc cuối cùng", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate desiredLastWorkingDate;

    @NotNull(message = "Ngày làm việc cuối cùng chính thức không được để trống")
    @Schema(description = "Ngày làm việc cuối cùng chính thức được chốt", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate actualLastWorkingDate;

    @Schema(description = "ID người tiếp nhận bàn giao công việc")
    private UUID successorId;

    @Schema(description = "Chi tiết lý do thôi việc")
    private String reasonDetail;

    @Schema(description = "Ghi chú bổ sung")
    private String notes;
}
