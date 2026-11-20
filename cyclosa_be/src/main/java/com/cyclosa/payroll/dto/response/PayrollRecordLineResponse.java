package com.cyclosa.payroll.dto.response;

import com.cyclosa.attendance.enums.OvertimeDayType;
import com.cyclosa.payroll.enums.InsuranceKind;
import com.cyclosa.payroll.enums.PayrollLineSource;
import com.cyclosa.payroll.enums.PayrollLineType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRecordLineResponse {

    private UUID id;
    private UUID payrollRecordId;
    private PayrollLineType lineType;
    private String title;
    private OvertimeDayType overtimeDayType;
    private Boolean isNightWork;
    private InsuranceKind insuranceKind;
    private UUID salaryComponentId;
    private UUID rewardDecisionId;
    private UUID salaryAdvanceId;
    private UUID disciplineCaseId;
    private BigDecimal quantity;
    private BigDecimal rate;
    private BigDecimal amount;
    private PayrollLineSource source;
    private String adjustmentReason;
}
