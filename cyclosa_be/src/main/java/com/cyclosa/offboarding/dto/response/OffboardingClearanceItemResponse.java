package com.cyclosa.offboarding.dto.response;

import com.cyclosa.offboarding.enums.ClearanceStatus;
import com.cyclosa.offboarding.enums.ClearanceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin hạng mục bàn giao thủ tục thôi việc")
public class OffboardingClearanceItemResponse {

    @Schema(description = "ID hạng mục")
    private UUID id;

    @Schema(description = "ID hồ sơ thôi việc")
    private UUID offboardingRequestId;

    @Schema(description = "Loại hạng mục bàn giao")
    private ClearanceType clearanceType;

    @Schema(description = "Trạng thái xác nhận")
    private ClearanceStatus status;

    @Schema(description = "ID người xác nhận")
    private UUID clearedById;

    @Schema(description = "Họ tên người xác nhận")
    private String clearedByName;

    @Schema(description = "Thời điểm xác nhận")
    private LocalDateTime clearedAt;

    @Schema(description = "Ghi chú bàn giao")
    private String notes;

    @Schema(description = "Thời điểm tạo")
    private LocalDateTime createdAt;
}
