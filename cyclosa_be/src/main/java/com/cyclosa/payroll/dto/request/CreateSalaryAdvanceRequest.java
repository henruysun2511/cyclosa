package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSalaryAdvanceRequest {

    private UUID employeeId;

    @NotNull(message = "Số tiền tạm ứng không được để trống")
    @DecimalMin(value = "100000", message = "Số tiền tạm ứng tối thiểu là 100.000 VNĐ")
    private BigDecimal amount;

    @NotNull(message = "Ngày đề nghị tạm ứng không được để trống")
    private LocalDate requestDate;

    @NotBlank(message = "Lý do tạm ứng không được để trống")
    @Size(max = 500, message = "Lý do không được vượt quá 500 ký tự")
    private String reason;
}
