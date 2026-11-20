package com.cyclosa.payroll.dto.response;

import com.cyclosa.payroll.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollPaymentResponse {

    private UUID id;
    private UUID payrollRecordId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;
    private String bankName;
    private String accountNumber;
    private String accountHolderName;
    private BigDecimal amount;
    private PaymentStatus status;
    private String bankReference;
    private LocalDateTime paidAt;
    private String failureReason;
    private LocalDateTime createdAt;
}
