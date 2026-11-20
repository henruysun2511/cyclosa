package com.cyclosa.payroll.dto.request;

import com.cyclosa.payroll.enums.PayrollPeriodStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollPeriodFilter {

    private Integer year;

    private Integer month;

    private PayrollPeriodStatus status;

    private String search;
}

