package com.cyclosa.payroll.service;

import com.cyclosa.payroll.entity.PayrollRecord;
import com.cyclosa.payroll.entity.PayrollRecordLine;
import com.cyclosa.payroll.enums.InsuranceKind;
import com.cyclosa.payroll.enums.PayrollLineSource;
import com.cyclosa.payroll.enums.PayrollLineType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class PayrollCalculationEngine {

    // Tham số Luật Thuế TNCN 109/2025/QH15
    public static final BigDecimal PERSONAL_DEDUCTION = new BigDecimal("15500000"); // 15.5 triệu / tháng
    public static final BigDecimal DEPENDENT_DEDUCTION = new BigDecimal("6200000");  // 6.2 triệu / người / tháng

    // Tham số Luật BHXH 2024 & Trần đóng bảo hiểm
    public static final BigDecimal STATUTORY_REFERENCE_SALARY = new BigDecimal("2340000"); // Mức tham chiếu 2.34tr
    public static final BigDecimal MAX_INSURANCE_CAP = STATUTORY_REFERENCE_SALARY.multiply(new BigDecimal("20")); // 46.8 triệu

    // Tỷ lệ bảo hiểm NLĐ đóng (10.5%)
    public static final BigDecimal EMP_SI_RATE = new BigDecimal("0.08");  // BHXH 8%
    public static final BigDecimal EMP_HI_RATE = new BigDecimal("0.015"); // BHYT 1.5%
    public static final BigDecimal EMP_UI_RATE = new BigDecimal("0.01");  // BHTN 1%

    // Tỷ lệ bảo hiểm Doanh nghiệp đóng (21.5%)
    public static final BigDecimal COMP_SI_RATE = new BigDecimal("0.17");  // BHXH 17%
    public static final BigDecimal COMP_HI_RATE = new BigDecimal("0.03");  // BHYT 3%
    public static final BigDecimal COMP_UI_RATE = new BigDecimal("0.01");  // BHTN 1%
    public static final BigDecimal COMP_AI_RATE = new BigDecimal("0.005"); // TNLĐ-BNN 0.5%

    public static class EmployeePayrollInput {
        public BigDecimal baseSalary = BigDecimal.ZERO;
        public BigDecimal insuranceSalary = BigDecimal.ZERO;
        public BigDecimal standardDays = new BigDecimal("22");
        public BigDecimal actualWorkDays = BigDecimal.ZERO;
        public BigDecimal paidLeaveDays = BigDecimal.ZERO;
        public BigDecimal unpaidLeaveDays = BigDecimal.ZERO;
        public BigDecimal otWeekdayHours = BigDecimal.ZERO;
        public BigDecimal otWeekendHours = BigDecimal.ZERO;
        public BigDecimal otHolidayHours = BigDecimal.ZERO;
        public BigDecimal nightWorkHours = BigDecimal.ZERO;
        public int dependentCount = 0;
        public BigDecimal allowances = BigDecimal.ZERO;
        public BigDecimal nonTaxableAllowances = BigDecimal.ZERO;
        public BigDecimal advanceAmount = BigDecimal.ZERO;
        public BigDecimal otherDeductions = BigDecimal.ZERO;
    }

    public static class CalculationResult {
        public BigDecimal baseTimeSalary = BigDecimal.ZERO;
        public BigDecimal paidLeaveSalary = BigDecimal.ZERO;
        public BigDecimal otWeekdayPay = BigDecimal.ZERO;
        public BigDecimal otWeekendPay = BigDecimal.ZERO;
        public BigDecimal otHolidayPay = BigDecimal.ZERO;
        public BigDecimal nightWorkPay = BigDecimal.ZERO;
        public BigDecimal totalOtPay = BigDecimal.ZERO;
        public BigDecimal grossSalary = BigDecimal.ZERO;

        // BHXH NLĐ
        public BigDecimal empSocialInsurance = BigDecimal.ZERO;
        public BigDecimal empHealthInsurance = BigDecimal.ZERO;
        public BigDecimal empUnemploymentInsurance = BigDecimal.ZERO;
        public BigDecimal totalEmpInsurance = BigDecimal.ZERO;

        // BHXH Doanh nghiệp
        public BigDecimal compSocialInsurance = BigDecimal.ZERO;
        public BigDecimal compHealthInsurance = BigDecimal.ZERO;
        public BigDecimal compUnemploymentInsurance = BigDecimal.ZERO;
        public BigDecimal compAccidentInsurance = BigDecimal.ZERO;
        public BigDecimal totalCompInsurance = BigDecimal.ZERO;

        // Thuế TNCN
        public BigDecimal personalDeduction = PERSONAL_DEDUCTION;
        public BigDecimal dependentDeduction = BigDecimal.ZERO;
        public BigDecimal taxableIncome = BigDecimal.ZERO;
        public BigDecimal pitTax = BigDecimal.ZERO;

        // Khấu trừ & Net
        public BigDecimal salaryAdvance = BigDecimal.ZERO;
        public BigDecimal otherDeductions = BigDecimal.ZERO;
        public BigDecimal netSalary = BigDecimal.ZERO;
        public BigDecimal totalEmployerCost = BigDecimal.ZERO;

        public List<PayrollRecordLine> lines = new ArrayList<>();
    }

    public CalculationResult calculate(PayrollRecord record, EmployeePayrollInput input) {
        CalculationResult res = new CalculationResult();

        BigDecimal standardDays = input.standardDays.compareTo(BigDecimal.ZERO) > 0 ? input.standardDays : new BigDecimal("22");
        BigDecimal dailyRate = input.baseSalary.divide(standardDays, 4, RoundingMode.HALF_UP);
        BigDecimal hourlyRate = dailyRate.divide(new BigDecimal("8"), 4, RoundingMode.HALF_UP);

        // 1. Lương thời gian
        res.baseTimeSalary = dailyRate.multiply(input.actualWorkDays).setScale(0, RoundingMode.HALF_UP);
        res.paidLeaveSalary = dailyRate.multiply(input.paidLeaveDays).setScale(0, RoundingMode.HALF_UP);

        // 2. Làm thêm giờ
        res.otWeekdayPay = hourlyRate.multiply(input.otWeekdayHours).multiply(new BigDecimal("1.5")).setScale(0, RoundingMode.HALF_UP);
        res.otWeekendPay = hourlyRate.multiply(input.otWeekendHours).multiply(new BigDecimal("2.0")).setScale(0, RoundingMode.HALF_UP);
        res.otHolidayPay = hourlyRate.multiply(input.otHolidayHours).multiply(new BigDecimal("3.0")).setScale(0, RoundingMode.HALF_UP);
        res.nightWorkPay = hourlyRate.multiply(input.nightWorkHours).multiply(new BigDecimal("0.3")).setScale(0, RoundingMode.HALF_UP);
        res.totalOtPay = res.otWeekdayPay.add(res.otWeekendPay).add(res.otHolidayPay).add(res.nightWorkPay);

        // 3. Gross = Lương thời gian + Nghỉ lễ phép + OT + Phụ cấp
        res.grossSalary = res.baseTimeSalary
                .add(res.paidLeaveSalary)
                .add(res.totalOtPay)
                .add(input.allowances)
                .setScale(0, RoundingMode.HALF_UP);

        // 4. Bảo hiểm
        BigDecimal insBase = input.insuranceSalary.compareTo(BigDecimal.ZERO) > 0 ? input.insuranceSalary : input.baseSalary;
        if (insBase.compareTo(MAX_INSURANCE_CAP) > 0) {
            insBase = MAX_INSURANCE_CAP;
        }

        // NLĐ (10.5%)
        res.empSocialInsurance = insBase.multiply(EMP_SI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.empHealthInsurance = insBase.multiply(EMP_HI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.empUnemploymentInsurance = insBase.multiply(EMP_UI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.totalEmpInsurance = res.empSocialInsurance.add(res.empHealthInsurance).add(res.empUnemploymentInsurance);

        // Doanh nghiệp (21.5%)
        res.compSocialInsurance = insBase.multiply(COMP_SI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.compHealthInsurance = insBase.multiply(COMP_HI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.compUnemploymentInsurance = insBase.multiply(COMP_UI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.compAccidentInsurance = insBase.multiply(COMP_AI_RATE).setScale(0, RoundingMode.HALF_UP);
        res.totalCompInsurance = res.compSocialInsurance.add(res.compHealthInsurance)
                .add(res.compUnemploymentInsurance).add(res.compAccidentInsurance);

        // 5. Thuế TNCN (Luật 109/2025/QH15)
        res.personalDeduction = PERSONAL_DEDUCTION;
        res.dependentDeduction = DEPENDENT_DEDUCTION.multiply(new BigDecimal(input.dependentCount));

        BigDecimal totalDeductionsForTax = res.totalEmpInsurance
                .add(res.personalDeduction)
                .add(res.dependentDeduction)
                .add(input.nonTaxableAllowances);

        BigDecimal incomeForTax = res.grossSalary.subtract(totalDeductionsForTax);
        if (incomeForTax.compareTo(BigDecimal.ZERO) > 0) {
            res.taxableIncome = incomeForTax.setScale(0, RoundingMode.HALF_UP);
            res.pitTax = calculatePitTaxProgressive(res.taxableIncome);
        } else {
            res.taxableIncome = BigDecimal.ZERO;
            res.pitTax = BigDecimal.ZERO;
        }

        // 6. Tạm ứng & Khấu trừ khác
        res.salaryAdvance = input.advanceAmount.setScale(0, RoundingMode.HALF_UP);
        res.otherDeductions = input.otherDeductions.setScale(0, RoundingMode.HALF_UP);

        // 7. Net = Gross - BHXH NLĐ - Thuế TNCN - Tạm ứng - Khấu trừ khác
        BigDecimal totalEmployeeDeductions = res.totalEmpInsurance
                .add(res.pitTax)
                .add(res.salaryAdvance)
                .add(res.otherDeductions);

        res.netSalary = res.grossSalary.subtract(totalEmployeeDeductions).setScale(0, RoundingMode.HALF_UP);

        // 8. Tổng chi phí DN = Gross + BHXH Doanh nghiệp đóng
        res.totalEmployerCost = res.grossSalary.add(res.totalCompInsurance).setScale(0, RoundingMode.HALF_UP);

        // Tạo các RecordLine chi tiết
        buildRecordLines(record, input, res);

        return res;
    }

    public BigDecimal calculatePitTaxProgressive(BigDecimal taxableIncome) {
        if (taxableIncome == null || taxableIncome.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal b1 = new BigDecimal("10000000");
        BigDecimal b2 = new BigDecimal("30000000");
        BigDecimal b3 = new BigDecimal("60000000");
        BigDecimal b4 = new BigDecimal("100000000");

        if (taxableIncome.compareTo(b1) <= 0) {
            return taxableIncome.multiply(new BigDecimal("0.05")).setScale(0, RoundingMode.HALF_UP);
        } else if (taxableIncome.compareTo(b2) <= 0) {
            return taxableIncome.multiply(new BigDecimal("0.10")).subtract(new BigDecimal("500000")).setScale(0, RoundingMode.HALF_UP);
        } else if (taxableIncome.compareTo(b3) <= 0) {
            return taxableIncome.multiply(new BigDecimal("0.20")).subtract(new BigDecimal("3500000")).setScale(0, RoundingMode.HALF_UP);
        } else if (taxableIncome.compareTo(b4) <= 0) {
            return taxableIncome.multiply(new BigDecimal("0.30")).subtract(new BigDecimal("9500000")).setScale(0, RoundingMode.HALF_UP);
        } else {
            return taxableIncome.multiply(new BigDecimal("0.35")).subtract(new BigDecimal("14500000")).setScale(0, RoundingMode.HALF_UP);
        }
    }

    private void buildRecordLines(PayrollRecord record, EmployeePayrollInput input, CalculationResult res) {
        List<PayrollRecordLine> lines = new ArrayList<>();

        // 1. Lương thời gian
        lines.add(PayrollRecordLine.builder()
                .payrollRecord(record)
                .lineType(PayrollLineType.BASE_SALARY)
                .title("Lương thời gian làm việc thực tế")
                .quantity(input.actualWorkDays)
                .rate(input.baseSalary)
                .amount(res.baseTimeSalary)
                .source(PayrollLineSource.SYSTEM_CALCULATED)
                .build());

        // 2. Lương phép/nghỉ lễ
        if (res.paidLeaveSalary.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(PayrollRecordLine.builder()
                    .payrollRecord(record)
                    .lineType(PayrollLineType.BASE_SALARY)
                    .title("Lương ngày nghỉ phép / lễ hưởng lương")
                    .quantity(input.paidLeaveDays)
                    .rate(input.baseSalary)
                    .amount(res.paidLeaveSalary)
                    .source(PayrollLineSource.SYSTEM_CALCULATED)
                    .build());
        }

        // 3. OT
        if (res.totalOtPay.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(PayrollRecordLine.builder()
                    .payrollRecord(record)
                    .lineType(PayrollLineType.OVERTIME)
                    .title("Lương làm thêm giờ (OT)")
                    .amount(res.totalOtPay)
                    .source(PayrollLineSource.SYSTEM_CALCULATED)
                    .build());
        }

        // 4. Phụ cấp
        if (input.allowances.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(PayrollRecordLine.builder()
                    .payrollRecord(record)
                    .lineType(PayrollLineType.ALLOWANCE)
                    .title("Phụ cấp theo chế độ")
                    .amount(input.allowances)
                    .source(PayrollLineSource.SYSTEM_CALCULATED)
                    .build());
        }

        // 5. BHXH NLĐ
        lines.add(PayrollRecordLine.builder()
                .payrollRecord(record)
                .lineType(PayrollLineType.INSURANCE_EMPLOYEE)
                .insuranceKind(InsuranceKind.SOCIAL)
                .title("Bảo hiểm bắt buộc NLĐ đóng (10.5%)")
                .amount(res.totalEmpInsurance)
                .source(PayrollLineSource.SYSTEM_CALCULATED)
                .build());

        // 6. Thuế TNCN
        lines.add(PayrollRecordLine.builder()
                .payrollRecord(record)
                .lineType(PayrollLineType.PERSONAL_INCOME_TAX)
                .title("Thuế thu nhập cá nhân (TNCN)")
                .amount(res.pitTax)
                .source(PayrollLineSource.SYSTEM_CALCULATED)
                .build());

        // 7. Khấu trừ tạm ứng
        if (res.salaryAdvance.compareTo(BigDecimal.ZERO) > 0) {
            lines.add(PayrollRecordLine.builder()
                    .payrollRecord(record)
                    .lineType(PayrollLineType.ADVANCE_RECOVERY)
                    .title("Thu hồi tạm ứng lương trong kỳ")
                    .amount(res.salaryAdvance)
                    .source(PayrollLineSource.SYSTEM_CALCULATED)
                    .build());
        }

        // 8. BHXH Doanh nghiệp đóng (Chi phí DN)
        lines.add(PayrollRecordLine.builder()
                .payrollRecord(record)
                .lineType(PayrollLineType.INSURANCE_EMPLOYER)
                .title("Bảo hiểm doanh nghiệp đóng (21.5%)")
                .amount(res.totalCompInsurance)
                .source(PayrollLineSource.SYSTEM_CALCULATED)
                .build());

        res.lines = lines;
    }
}
