package com.cyclosa.career.dto.request;

import com.cyclosa.career.enums.TalentTag;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Yêu cầu gắn thẻ nhân tài nội bộ")
public class AddTalentPoolEntryRequest {

    @NotNull(message = "Nhân viên không được để trống")
    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @NotNull(message = "Thẻ nhân tài không được để trống")
    @Schema(description = "Thẻ phân loại")
    private TalentTag tag;

    @Schema(description = "Lý do / thành tích nổi bật")
    private String reason;
}
