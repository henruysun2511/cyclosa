package com.cyclosa.payroll.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePayrollPeriodRequest {

    @NotBlank(message = "Tên kỳ lương không được để trống")
    private String name;

    @NotNull(message = "Từ ngày không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Đến ngày không được để trống")
    private LocalDate endDate;

    @NotNull(message = "Ngày dự kiến thanh toán không được để trống")
    private LocalDate plannedPaymentDate;

    @NotNull(message = "Số ngày làm việc tiêu chuẩn không được để trống")
    @DecimalMin(value = "1.0", message = "Số ngày làm việc tiêu chuẩn tối thiểu là 1")
    private BigDecimal standardWorkDays;

    private String note;
}
