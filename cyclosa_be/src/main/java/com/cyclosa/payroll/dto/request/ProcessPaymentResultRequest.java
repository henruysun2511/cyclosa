package com.cyclosa.payroll.dto.request;

import com.cyclosa.payroll.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentResultRequest {

    @NotNull(message = "Trạng thái thanh toán không được để trống")
    private PaymentStatus status; // PAID, FAILED

    private String transactionRef;

    private String bankResponseCode;

    private String bankResponseMessage;

    private LocalDateTime paidAt;
}

