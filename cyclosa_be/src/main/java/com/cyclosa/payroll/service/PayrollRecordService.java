package com.cyclosa.payroll.service;

import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.dto.request.ManualAdjustmentRequest;
import com.cyclosa.payroll.dto.response.PayrollRecordDetailResponse;
import com.cyclosa.payroll.dto.response.PayrollRecordLineResponse;
import com.cyclosa.payroll.dto.response.PayrollRecordResponse;
import com.cyclosa.payroll.entity.PayrollPeriod;
import com.cyclosa.payroll.entity.PayrollRecord;
import com.cyclosa.payroll.entity.PayrollRecordLine;
import com.cyclosa.payroll.enums.PayrollLineSource;
import com.cyclosa.payroll.enums.PayrollLineType;
import com.cyclosa.payroll.enums.PayrollPeriodStatus;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.PayrollRecordMapper;
import com.cyclosa.payroll.repository.PayrollRecordLineRepository;
import com.cyclosa.payroll.repository.PayrollRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollRecordService {

    private final PayrollRecordRepository payrollRecordRepository;
    private final PayrollRecordLineRepository payrollRecordLineRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollRecordMapper payrollRecordMapper;

    @Transactional(readOnly = true)
    public List<PayrollRecordResponse> getRecordsByPeriod(UUID periodId) {
        List<PayrollRecord> records = payrollRecordRepository.findAllByPayrollPeriodId(periodId);
        List<PayrollRecordResponse> responses = new ArrayList<>();

        for (PayrollRecord r : records) {
            PayrollRecordResponse resp = payrollRecordMapper.toResponse(r);
            enrichRecordFields(resp, r);
            responses.add(resp);
        }

        return responses;
    }

    @Transactional(readOnly = true)
    public PayrollRecordDetailResponse getRecordDetail(UUID recordId) {
        PayrollRecord record = payrollRecordRepository.findById(recordId)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_RECORD_NOT_FOUND));

        PayrollRecordResponse recordResp = payrollRecordMapper.toResponse(record);
        enrichRecordFields(recordResp, record);

        List<PayrollRecordLineResponse> lineResponses = payrollRecordMapper.toLineResponseList(record.getLines());

        return PayrollRecordDetailResponse.builder()
                .record(recordResp)
                .lines(lineResponses)
                .build();
    }

    @Transactional
    public PayrollRecordDetailResponse manualAdjustLine(UUID recordId, ManualAdjustmentRequest request) {
        PayrollRecord record = payrollRecordRepository.findById(recordId)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_RECORD_NOT_FOUND));

        PayrollPeriod period = record.getPayrollPeriod();
        if (period.getStatus() == PayrollPeriodStatus.LOCKED || period.getStatus() == PayrollPeriodStatus.APPROVED) {
            throw new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_ALREADY_LOCKED);
        }

        PayrollRecordLine lineToAdjust;
        if (request.getLineId() != null) {
            lineToAdjust = payrollRecordLineRepository.findById(request.getLineId())
                    .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_RECORD_LINE_NOT_FOUND));
            lineToAdjust.setAmount(request.getAmount());
            lineToAdjust.setSource(PayrollLineSource.MANUAL_ADJUSTMENT);
            lineToAdjust.setAdjustmentReason(request.getReason());
        } else {
            lineToAdjust = PayrollRecordLine.builder()
                    .payrollRecord(record)
                    .lineType(PayrollLineType.ALLOWANCE)
                    .title(request.getTitle() != null ? request.getTitle() : "Điều chỉnh phụ cấp thủ công")
                    .amount(request.getAmount())
                    .source(PayrollLineSource.MANUAL_ADJUSTMENT)
                    .adjustmentReason(request.getReason())
                    .build();
            record.getLines().add(lineToAdjust);
        }

        payrollRecordRepository.save(record);
        return getRecordDetail(recordId);
    }

    @Transactional(readOnly = true)
    public boolean isRewardPushedToPayroll(UUID rewardId) {
        return payrollRecordLineRepository.existsByRewardDecisionId(rewardId);
    }

    @Transactional(readOnly = true)
    public boolean isDisciplinePushedToPayroll(UUID disciplineCaseId) {
        return payrollRecordLineRepository.existsByDisciplineCaseId(disciplineCaseId);
    }

    private void enrichRecordFields(PayrollRecordResponse resp, PayrollRecord r) {
        employeeRepository.findById(r.getEmployeeId()).ifPresent(emp -> {
            resp.setEmployeeName(emp.getFullName());
            resp.setEmployeeCode(emp.getEmployeeCode());
        });

        boolean hasManual = false;
        BigDecimal baseSal = BigDecimal.ZERO;
        BigDecimal allowances = BigDecimal.ZERO;
        BigDecimal otPay = BigDecimal.ZERO;
        BigDecimal gross = BigDecimal.ZERO;
        BigDecimal empIns = BigDecimal.ZERO;
        BigDecimal compIns = BigDecimal.ZERO;
        BigDecimal pit = BigDecimal.ZERO;
        BigDecimal advance = BigDecimal.ZERO;
        BigDecimal otherDeductions = BigDecimal.ZERO;

        for (PayrollRecordLine line : r.getLines()) {
            if (line.getSource() == PayrollLineSource.MANUAL_ADJUSTMENT) {
                hasManual = true;
            }
            switch (line.getLineType()) {
                case BASE_SALARY -> {
                    baseSal = baseSal.add(line.getAmount());
                    gross = gross.add(line.getAmount());
                }
                case ALLOWANCE -> {
                    allowances = allowances.add(line.getAmount());
                    gross = gross.add(line.getAmount());
                }
                case OVERTIME -> {
                    otPay = otPay.add(line.getAmount());
                    gross = gross.add(line.getAmount());
                }
                case BONUS, REIMBURSEMENT -> gross = gross.add(line.getAmount());
                case INSURANCE_EMPLOYEE -> empIns = empIns.add(line.getAmount());
                case INSURANCE_EMPLOYER -> compIns = compIns.add(line.getAmount());
                case PERSONAL_INCOME_TAX -> pit = line.getAmount();
                case ADVANCE_RECOVERY -> advance = line.getAmount();
                case DEDUCTION -> otherDeductions = otherDeductions.add(line.getAmount());
            }
        }

        BigDecimal totalEmployeeDeductions = empIns.add(pit).add(advance).add(otherDeductions);
        BigDecimal net = gross.subtract(totalEmployeeDeductions);
        BigDecimal cost = gross.add(compIns);

        resp.setBaseSalary(baseSal);
        resp.setTotalAllowances(allowances);
        resp.setGrossSalary(gross);
        resp.setEmployeeInsurance(empIns);
        resp.setEmployerInsurance(compIns);
        resp.setPitTax(pit);
        resp.setSalaryAdvance(advance);
        resp.setOtherDeductions(otherDeductions);
        resp.setNetSalary(net);
        resp.setTotalEmployerCost(cost);
        resp.setHasManualAdjustment(hasManual);
    }
}
