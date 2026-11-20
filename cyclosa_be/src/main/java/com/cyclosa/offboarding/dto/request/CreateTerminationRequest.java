package com.cyclosa.offboarding.dto.request;

import com.cyclosa.offboarding.enums.TerminationReason;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "Yêu cầu ban hành quyết định chấm dứt hợp đồng lao động")
public class CreateTerminationRequest {

    @NotNull(message = "Nhân viên không được để trống")
    @Schema(description = "ID nhân viên bị chấm dứt HĐLĐ", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID employeeId;

    @NotNull(message = "Lý do chấm dứt không được để trống")
    @Schema(description = "Lý do pháp lý chấm dứt HĐLĐ", requiredMode = Schema.RequiredMode.REQUIRED)
    private TerminationReason terminationReason;

    @Schema(description = "ID biên bản kỷ luật nếu thuộc diện sa thải kỷ luật")
    private UUID disciplineId;

    @NotBlank(message = "Số quyết định không được để trống")
    @Schema(description = "Số quyết định chấm dứt HĐLĐ", example = "QD-CD-2026/01", requiredMode = Schema.RequiredMode.REQUIRED)
    private String decisionNumber;

    @NotNull(message = "Ngày ký quyết định không được để trống")
    @Schema(description = "Ngày ký quyết định", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate decisionDate;

    @NotNull(message = "Ngày làm việc cuối cùng không được để trống")
    @Schema(description = "Ngày làm việc cuối cùng của nhân sự", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate actualLastWorkingDate;

    @Schema(description = "ID người tiếp nhận bàn giao công việc")
    private UUID successorId;

    @Schema(description = "Chi tiết lý do chấm dứt hợp đồng")
    private String reasonDetail;

    @Schema(description = "Ghi chú nội bộ")
    private String notes;
}
