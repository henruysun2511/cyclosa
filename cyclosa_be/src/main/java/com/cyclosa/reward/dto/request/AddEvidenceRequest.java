package com.cyclosa.reward.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu thêm bằng chứng vi phạm vào hồ sơ")
public class AddEvidenceRequest {

    @NotBlank(message = "Mô tả bằng chứng không được để trống")
    @Schema(description = "Mô tả bằng chứng", example = "Biên bản kiểm kê quỹ tiền mặt thiếu hụt")
    private String description;

    @Schema(description = "ID tệp đính kèm")
    private UUID fileId;

    @Schema(description = "Đường dẫn tải tệp")
    private String fileUrl;

    @Schema(description = "Tên tệp đính kèm")
    private String fileName;
}

