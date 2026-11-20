package com.cyclosa.payroll.service;

import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.dto.response.PayslipResponse;
import com.cyclosa.payroll.entity.PayrollRecord;
import com.cyclosa.payroll.entity.PayrollRecordLine;
import com.cyclosa.payroll.entity.Payslip;
import com.cyclosa.payroll.enums.PayrollLineType;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.PayrollRecordMapper;
import com.cyclosa.payroll.mapper.PayslipMapper;
import com.cyclosa.payroll.repository.PayslipRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayslipService {

    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;
    private final PayslipMapper payslipMapper;
    private final PayrollRecordMapper payrollRecordMapper;

    @Transactional(readOnly = true)
    public List<PayslipResponse> getPayslipsByPeriod(UUID periodId) {
        List<Payslip> payslips = payslipRepository.findAllByPayrollPeriodId(periodId);
        List<PayslipResponse> responses = new ArrayList<>();

        for (Payslip ps : payslips) {
            responses.add(enrichPayslip(ps));
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public List<PayslipResponse> getMyPayslips() {
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                .orElse(null);
        if (currentUserId == null) {
            return List.of();
        }

        Employee emp = employeeRepository.findByUserId(currentUserId)
                .orElse(null);
        if (emp == null) {
            return List.of();
        }

        List<Payslip> payslips = payslipRepository.findAllByEmployeeIdOrderByIssuedAtDesc(emp.getId(), PageRequest.of(0, 50)).getContent();
        List<PayslipResponse> responses = new ArrayList<>();

        for (Payslip ps : payslips) {
            responses.add(enrichPayslip(ps));
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public PayslipResponse getPayslipDetail(UUID payslipId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYSLIP_NOT_FOUND));

        return enrichPayslip(payslip);
    }

    private PayslipResponse enrichPayslip(Payslip ps) {
        PayslipResponse resp = payslipMapper.toResponse(ps);

        employeeRepository.findById(ps.getEmployeeId()).ifPresent(emp -> {
            resp.setEmployeeName(emp.getFullName());
            resp.setEmployeeCode(emp.getEmployeeCode());
            if (emp.getCurrentDepartment() != null) {
                resp.setDepartmentName(emp.getCurrentDepartment().getName());
            }
            if (emp.getCurrentJobTitle() != null) {
                resp.setPositionName(emp.getCurrentJobTitle().getName());
            }
        });

        PayrollRecord rec = ps.getPayrollRecord();
        if (rec != null) {
            BigDecimal gross = BigDecimal.ZERO;
            BigDecimal allowances = BigDecimal.ZERO;
            BigDecimal empIns = BigDecimal.ZERO;
            BigDecimal pit = BigDecimal.ZERO;
            BigDecimal advance = BigDecimal.ZERO;
            BigDecimal otherDeductions = BigDecimal.ZERO;

            if (rec.getLines() != null && !rec.getLines().isEmpty()) {
                resp.setLines(payrollRecordMapper.toLineResponseList(rec.getLines()));
                for (PayrollRecordLine line : rec.getLines()) {
                    switch (line.getLineType()) {
                        case BASE_SALARY, OVERTIME, BONUS, REIMBURSEMENT -> gross = gross.add(line.getAmount());
                        case ALLOWANCE -> {
                            allowances = allowances.add(line.getAmount());
                            gross = gross.add(line.getAmount());
                        }
                        case INSURANCE_EMPLOYEE -> empIns = empIns.add(line.getAmount());
                        case PERSONAL_INCOME_TAX -> pit = line.getAmount();
                        case ADVANCE_RECOVERY -> advance = line.getAmount();
                        case DEDUCTION -> otherDeductions = otherDeductions.add(line.getAmount());
                        default -> {}
                    }
                }
            }

            BigDecimal net = gross.subtract(empIns.add(pit).add(advance).add(otherDeductions));

            resp.setGrossSalary(gross);
            resp.setNetSalary(net);
            resp.setTotalAllowances(allowances);
            resp.setEmployeeInsurance(empIns);
            resp.setPitTax(pit);
            resp.setSalaryAdvance(advance);
        }

        return resp;
    }
}
