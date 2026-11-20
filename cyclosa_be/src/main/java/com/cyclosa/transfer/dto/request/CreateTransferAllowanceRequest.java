package com.cyclosa.transfer.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransferAllowanceRequest {

    @NotBlank(message = "Tên khoản phụ cấp không được để trống")
    @Size(max = 150, message = "Tên phụ cấp tối đa 150 ký tự")
    private String allowanceName;

    @NotNull(message = "Số tiền phụ cấp không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Số tiền phụ cấp phải lớn hơn 0")
    private BigDecimal amount;

    @Size(max = 255, message = "Ghi chú tối đa 255 ký tự")
    private String notes;
}
