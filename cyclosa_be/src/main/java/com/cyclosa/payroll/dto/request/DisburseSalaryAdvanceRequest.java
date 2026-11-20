package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisburseSalaryAdvanceRequest {

    @NotNull(message = "Ngày chi trả không được để trống")
    private LocalDate disbursementDate;

    @NotBlank(message = "Phương thức chi trả không được để trống")
    private String paymentMethod; // BANK_TRANSFER, CASH

    private String transactionRef;

    private String note;
}

