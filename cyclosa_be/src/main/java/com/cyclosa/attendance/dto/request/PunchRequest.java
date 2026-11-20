package com.cyclosa.attendance.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "Dữ liệu chấm công trực tuyến (Face AI + GPS)")
public class PunchRequest {

    @NotBlank(message = "Mã giao dịch chấm công không được để trống")
    @Schema(description = "Mã giao dịch độc nhất chống trùng lặp (client sinh)", example = "TX-20261115-080102-12345")
    private String transactionCode;

    @Schema(description = "Ảnh chụp trực tiếp từ Camera (Base64)", example = "data:image/jpeg;base64,...")
    private String liveImageBase64;

    @Schema(description = "Vĩ độ GPS thiết bị", example = "21.028511")
    private BigDecimal latitude;

    @Schema(description = "Kinh độ GPS thiết bị", example = "105.854444")
    private BigDecimal longitude;

    @Schema(description = "Thông tin thiết bị (User Agent / Model)", example = "iPhone 15 Pro, iOS 18.1")
    private String deviceInfo;
}

