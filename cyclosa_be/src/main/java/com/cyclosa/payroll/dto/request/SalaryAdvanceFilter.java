package com.cyclosa.payroll.dto.request;

import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryAdvanceFilter {

    private UUID employeeId;

    private UUID departmentId;

    private SalaryAdvanceStatus status;

    private LocalDate fromDate;

    private LocalDate toDate;

    private String search;
}
