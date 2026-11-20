package com.cyclosa.payroll.service;

import com.cyclosa.attendance.entity.TimesheetPeriod;
import com.cyclosa.attendance.entity.TimesheetSnapshot;
import com.cyclosa.attendance.entity.TimesheetSnapshotOvertime;
import com.cyclosa.attendance.repository.TimesheetPeriodRepository;
import com.cyclosa.attendance.repository.TimesheetSnapshotRepository;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeDependentRepository;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.dto.request.CreatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.request.PayrollPeriodFilter;
import com.cyclosa.payroll.dto.request.UpdatePayrollPeriodRequest;
import com.cyclosa.payroll.dto.response.PayrollAnomalyResponse;
import com.cyclosa.payroll.dto.response.PayrollPeriodResponse;
import com.cyclosa.payroll.dto.response.PayrollPeriodSummaryResponse;
import com.cyclosa.payroll.dto.response.PayrollPrecheckResponse;
import com.cyclosa.payroll.entity.*;
import com.cyclosa.payroll.enums.PaymentStatus;
import com.cyclosa.payroll.enums.PayrollLineType;
import com.cyclosa.payroll.enums.PayrollPeriodStatus;
import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.PayrollPeriodMapper;
import com.cyclosa.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollPeriodService {

    private final PayrollPeriodRepository payrollPeriodRepository;
    private final PayrollRecordRepository payrollRecordRepository;
    private final PayrollPaymentRepository payrollPaymentRepository;
    private final PayslipRepository payslipRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryHistoryRepository salaryHistoryRepository;
    private final EmployeeSalaryItemRepository employeeSalaryItemRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final TimesheetPeriodRepository timesheetPeriodRepository;
    private final TimesheetSnapshotRepository timesheetSnapshotRepository;
    private final EmployeeDependentRepository employeeDependentRepository;

    private final PayrollPeriodMapper payrollPeriodMapper;
    private final PayrollCalculationEngine calculationEngine;

    @Transactional(readOnly = true)
    public List<PayrollPeriodResponse> getPayrollPeriods(PayrollPeriodFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<PayrollPeriod> periods = payrollPeriodRepository.findAllByCompanyIdOrderByStartDateDesc(companyId);

        List<PayrollPeriodResponse> responses = new ArrayList<>();
        for (PayrollPeriod p : periods) {
            PayrollPeriodResponse resp = payrollPeriodMapper.toResponse(p);
            List<PayrollRecord> records = payrollRecordRepository.findAllByPayrollPeriodId(p.getId());
            resp.setTotalEmployees(records.size());

            BigDecimal totalGross = BigDecimal.ZERO;
            BigDecimal totalNet = BigDecimal.ZERO;
            BigDecimal totalCost = BigDecimal.ZERO;

            for (PayrollRecord r : records) {
                BigDecimal recGross = BigDecimal.ZERO;
                BigDecimal recDeductions = BigDecimal.ZERO;
                BigDecimal recCost = BigDecimal.ZERO;

                for (PayrollRecordLine line : r.getLines()) {
                    if (line.getLineType() == PayrollLineType.BASE_SALARY ||
                        line.getLineType() == PayrollLineType.ALLOWANCE ||
                        line.getLineType() == PayrollLineType.OVERTIME ||
                        line.getLineType() == PayrollLineType.BONUS ||
                        line.getLineType() == PayrollLineType.REIMBURSEMENT) {
                        recGross = recGross.add(line.getAmount());
                    } else if (line.getLineType() == PayrollLineType.INSURANCE_EMPLOYEE ||
                               line.getLineType() == PayrollLineType.PERSONAL_INCOME_TAX ||
                               line.getLineType() == PayrollLineType.ADVANCE_RECOVERY ||
                               line.getLineType() == PayrollLineType.DEDUCTION) {
                        recDeductions = recDeductions.add(line.getAmount());
                    } else if (line.getLineType() == PayrollLineType.INSURANCE_EMPLOYER) {
                        recCost = recCost.add(line.getAmount());
                    }
                }
                totalGross = totalGross.add(recGross);
                totalNet = totalNet.add(recGross.subtract(recDeductions));
                totalCost = totalCost.add(recGross.add(recCost));
            }
            resp.setTotalGross(totalGross);
            resp.setTotalNet(totalNet);
            resp.setTotalEmployerCost(totalCost);
            responses.add(resp);
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public PayrollPeriodResponse getPayrollPeriodById(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));
        PayrollPeriodResponse resp = payrollPeriodMapper.toResponse(period);

        List<PayrollRecord> records = payrollRecordRepository.findAllByPayrollPeriodId(period.getId());
        resp.setTotalEmployees(records.size());

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;

        for (PayrollRecord r : records) {
            BigDecimal recGross = BigDecimal.ZERO;
            BigDecimal recDeductions = BigDecimal.ZERO;
            BigDecimal recCost = BigDecimal.ZERO;

            for (PayrollRecordLine line : r.getLines()) {
                if (line.getLineType() == PayrollLineType.BASE_SALARY ||
                    line.getLineType() == PayrollLineType.ALLOWANCE ||
                    line.getLineType() == PayrollLineType.OVERTIME ||
                    line.getLineType() == PayrollLineType.BONUS ||
                    line.getLineType() == PayrollLineType.REIMBURSEMENT) {
                    recGross = recGross.add(line.getAmount());
                } else if (line.getLineType() == PayrollLineType.INSURANCE_EMPLOYEE ||
                           line.getLineType() == PayrollLineType.PERSONAL_INCOME_TAX ||
                           line.getLineType() == PayrollLineType.ADVANCE_RECOVERY ||
                           line.getLineType() == PayrollLineType.DEDUCTION) {
                    recDeductions = recDeductions.add(line.getAmount());
                } else if (line.getLineType() == PayrollLineType.INSURANCE_EMPLOYER) {
                    recCost = recCost.add(line.getAmount());
                }
            }
            totalGross = totalGross.add(recGross);
            totalNet = totalNet.add(recGross.subtract(recDeductions));
            totalCost = totalCost.add(recGross.add(recCost));
        }
        resp.setTotalGross(totalGross);
        resp.setTotalNet(totalNet);
        resp.setTotalEmployerCost(totalCost);

        return resp;
    }

    @Transactional
    public PayrollPeriodResponse createPayrollPeriod(CreatePayrollPeriodRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        if (payrollPeriodRepository.existsByCompanyIdAndCode(companyId, request.getCode())) {
            throw new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_CODE_DUPLICATED);
        }

        PayrollPeriod period = payrollPeriodMapper.toEntity(request);
        period.setCompanyId(companyId);
        period.setStatus(PayrollPeriodStatus.OPEN);

        PayrollPeriod saved = payrollPeriodRepository.save(period);
        return payrollPeriodMapper.toResponse(saved);
    }

    @Transactional
    public PayrollPeriodResponse updatePayrollPeriod(UUID id, UpdatePayrollPeriodRequest request) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() == PayrollPeriodStatus.LOCKED || period.getStatus() == PayrollPeriodStatus.APPROVED) {
            throw new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_ALREADY_LOCKED);
        }

        payrollPeriodMapper.updateEntityFromDto(request, period);
        PayrollPeriod saved = payrollPeriodRepository.save(period);
        return payrollPeriodMapper.toResponse(saved);
    }

    @Transactional
    public void deletePayrollPeriod(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() != PayrollPeriodStatus.OPEN) {
            throw new PayrollException(PayrollErrorCode.CANNOT_MODIFY_LOCKED_PERIOD);
        }

        payrollPeriodRepository.delete(period);
    }

    @Transactional(readOnly = true)
    public PayrollPrecheckResponse precheckPayroll(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        List<Employee> employees = employeeRepository.findAllByCompanyId(companyId);
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        int missingSalary = 0;
        for (Employee emp : employees) {
            Optional<SalaryHistory> sh = salaryHistoryRepository.findEffectiveSalaryAtDate(emp.getId(), period.getEndDate());
            if (sh.isEmpty() || sh.get().getBaseSalary() == null || sh.get().getBaseSalary().compareTo(BigDecimal.ZERO) <= 0) {
                missingSalary++;
            }
        }

        if (missingSalary > 0) {
            warnings.add(String.format("Có %d nhân viên chưa thiết lập mức lương cơ bản hiệu lực trong kỳ", missingSalary));
        }

        List<SalaryAdvance> pendingAdvances = salaryAdvanceRepository.findAllByRecoveryPayrollPeriodIdAndStatus(id, SalaryAdvanceStatus.PENDING_APPROVAL);
        if (!pendingAdvances.isEmpty()) {
            warnings.add(String.format("Có %d đề nghị tạm ứng đang chờ duyệt cho kỳ lương này", pendingAdvances.size()));
        }

        int pYear = period.getStartDate().getYear();
        int pMonth = period.getStartDate().getMonthValue();
        Optional<TimesheetPeriod> tsPeriodOpt = timesheetPeriodRepository.findByCompanyIdAndYearAndMonth(companyId, pYear, pMonth);
        if (tsPeriodOpt.isEmpty() || tsPeriodOpt.get().getStatus() != com.cyclosa.attendance.enums.TimesheetPeriodStatus.LOCKED) {
            warnings.add(String.format("Kỳ công tháng %02d/%d chưa được khóa Snapshot chốt công. Hệ thống sẽ dùng ngày công chuẩn mặc định cho đến khi kỳ công được khóa.", pMonth, pYear));
        }

        return PayrollPrecheckResponse.builder()
                .isReady(errors.isEmpty())
                .totalEligibleEmployees(employees.size())
                .missingSalaryContractEmployees(missingSalary)
                .pendingAdvancesCount(pendingAdvances.size())
                .warnings(warnings)
                .errors(errors)
                .build();
    }

    @Transactional
    public PayrollPeriodResponse calculatePayroll(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() == PayrollPeriodStatus.LOCKED || period.getStatus() == PayrollPeriodStatus.APPROVED) {
            throw new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_ALREADY_LOCKED);
        }

        // Xóa các records cũ của kỳ nếu đã tính trước đó
        List<PayrollRecord> oldRecords = payrollRecordRepository.findAllByPayrollPeriodId(period.getId());
        if (!oldRecords.isEmpty()) {
            payrollRecordRepository.deleteAll(oldRecords);
        }

        List<Employee> employees = employeeRepository.findAllByCompanyId(companyId);
        List<PayrollRecord> createdRecords = new ArrayList<>();

        // Tự động liên thông dữ liệu Chấm công & Nghỉ phép (Timesheet Snapshots) cho kỳ tính lương
        int pYear = period.getStartDate().getYear();
        int pMonth = period.getStartDate().getMonthValue();
        Optional<TimesheetPeriod> tsPeriodOpt = timesheetPeriodRepository.findByCompanyIdAndYearAndMonth(companyId, pYear, pMonth);
        Map<UUID, TimesheetSnapshot> snapshotMap = new HashMap<>();
        if (tsPeriodOpt.isPresent()) {
            List<TimesheetSnapshot> snapshots = timesheetSnapshotRepository.findByTimesheetPeriodIdWithOvertime(tsPeriodOpt.get().getId());
            for (TimesheetSnapshot s : snapshots) {
                snapshotMap.put(s.getEmployeeId(), s);
            }
            log.info("Đã liên thông bảng chốt công kỳ {}/{} ({} nhân sự) vào bảng lương", pMonth, pYear, snapshots.size());
        } else {
            log.info("Chưa có bảng chốt công (Timesheet Period) kỳ {}/{}, sử dụng ngày công chuẩn mặc định", pMonth, pYear);
        }

        for (Employee emp : employees) {
            PayrollRecord record = PayrollRecord.builder()
                    .payrollPeriod(period)
                    .employeeId(emp.getId())
                    .calculatedAt(LocalDateTime.now())
                    .build();

            // Chuẩn bị tham số tính lương
            PayrollCalculationEngine.EmployeePayrollInput input = new PayrollCalculationEngine.EmployeePayrollInput();
            input.standardDays = period.getStandardWorkDays() != null ? period.getStandardWorkDays() : new BigDecimal("22");
            input.actualWorkDays = input.standardDays;

            // 1. Kéo dữ liệu thực tế từ Chấm công & Nghỉ phép (Timesheet Snapshot)
            TimesheetSnapshot snap = snapshotMap.get(emp.getId());
            if (snap != null) {
                if (snap.getActualWorkDays() != null && snap.getActualWorkDays().compareTo(BigDecimal.ZERO) >= 0) {
                    input.actualWorkDays = snap.getActualWorkDays();
                }
                if (snap.getPaidLeaveDays() != null) {
                    input.paidLeaveDays = snap.getPaidLeaveDays();
                }
                if (snap.getUnpaidLeaveDays() != null) {
                    input.unpaidLeaveDays = snap.getUnpaidLeaveDays();
                }
                if (snap.getOvertimeDetails() != null) {
                    for (TimesheetSnapshotOvertime ot : snap.getOvertimeDetails()) {
                        if (ot.getOvertimeDayType() != null && ot.getHours() != null) {
                            switch (ot.getOvertimeDayType()) {
                                case NORMAL_DAY -> input.otWeekdayHours = input.otWeekdayHours.add(ot.getHours());
                                case WEEKEND -> input.otWeekendHours = input.otWeekendHours.add(ot.getHours());
                                case PUBLIC_HOLIDAY -> input.otHolidayHours = input.otHolidayHours.add(ot.getHours());
                            }
                        }
                        if (Boolean.TRUE.equals(ot.getIsNightWork()) && ot.getHours() != null) {
                            input.nightWorkHours = input.nightWorkHours.add(ot.getHours());
                        }
                    }
                }
            }

            // 2. Kéo số người phụ thuộc thực tế từ Hồ sơ nhân sự để giảm trừ gia cảnh thuế TNCN
            try {
                input.dependentCount = employeeDependentRepository.findAllByEmployeeId(emp.getId()).size();
            } catch (Exception ignored) {
                input.dependentCount = 0;
            }

            Optional<SalaryHistory> sh = salaryHistoryRepository.findEffectiveSalaryAtDate(emp.getId(), period.getEndDate());
            if (sh.isPresent()) {
                input.baseSalary = sh.get().getBaseSalary() != null ? sh.get().getBaseSalary() : BigDecimal.ZERO;
                input.insuranceSalary = sh.get().getInsuranceSalary() != null ? sh.get().getInsuranceSalary() : input.baseSalary;
            } else {
                input.baseSalary = new BigDecimal("10000000");
                input.insuranceSalary = input.baseSalary;
            }

            List<EmployeeSalaryItem> items = employeeSalaryItemRepository.findActiveItemsForPeriod(
                    emp.getId(), period.getStartDate(), period.getEndDate(), period.getId());
            BigDecimal allowances = BigDecimal.ZERO;
            for (EmployeeSalaryItem item : items) {
                if (item.getAmount() != null) {
                    allowances = allowances.add(item.getAmount());
                }
            }
            input.allowances = allowances;

            List<SalaryAdvance> advances = salaryAdvanceRepository.findAllByRecoveryPayrollPeriodIdAndStatus(period.getId(), SalaryAdvanceStatus.DISBURSED);
            BigDecimal advanceAmount = BigDecimal.ZERO;
            for (SalaryAdvance adv : advances) {
                if (adv.getEmployeeId().equals(emp.getId()) && adv.getAmount() != null) {
                    advanceAmount = advanceAmount.add(adv.getAmount());
                }
            }
            input.advanceAmount = advanceAmount;

            PayrollCalculationEngine.CalculationResult calcRes = calculationEngine.calculate(record, input);
            record.setLines(calcRes.lines);

            createdRecords.add(record);
        }

        payrollRecordRepository.saveAll(createdRecords);

        period.setStatus(PayrollPeriodStatus.CALCULATED);
        PayrollPeriod savedPeriod = payrollPeriodRepository.save(period);

        return getPayrollPeriodById(savedPeriod.getId());
    }

    @Transactional(readOnly = true)
    public PayrollPeriodSummaryResponse getSummary(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        List<PayrollRecord> records = payrollRecordRepository.findAllByPayrollPeriodId(period.getId());

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalEmpInsurance = BigDecimal.ZERO;
        BigDecimal totalCompInsurance = BigDecimal.ZERO;
        BigDecimal totalPitTax = BigDecimal.ZERO;
        BigDecimal totalAdvance = BigDecimal.ZERO;

        List<PayrollAnomalyResponse> anomalies = new ArrayList<>();

        for (PayrollRecord r : records) {
            BigDecimal recGross = BigDecimal.ZERO;
            BigDecimal recDeductions = BigDecimal.ZERO;
            BigDecimal recTax = BigDecimal.ZERO;

            for (PayrollRecordLine line : r.getLines()) {
                switch (line.getLineType()) {
                    case BASE_SALARY, ALLOWANCE, OVERTIME, BONUS, REIMBURSEMENT -> {
                        recGross = recGross.add(line.getAmount());
                        totalGross = totalGross.add(line.getAmount());
                    }
                    case INSURANCE_EMPLOYEE -> {
                        recDeductions = recDeductions.add(line.getAmount());
                        totalEmpInsurance = totalEmpInsurance.add(line.getAmount());
                    }
                    case PERSONAL_INCOME_TAX -> {
                        recDeductions = recDeductions.add(line.getAmount());
                        recTax = line.getAmount();
                        totalPitTax = totalPitTax.add(line.getAmount());
                    }
                    case ADVANCE_RECOVERY -> {
                        recDeductions = recDeductions.add(line.getAmount());
                        totalAdvance = totalAdvance.add(line.getAmount());
                    }
                    case DEDUCTION -> recDeductions = recDeductions.add(line.getAmount());
                    case INSURANCE_EMPLOYER -> {
                        totalCompInsurance = totalCompInsurance.add(line.getAmount());
                        totalCost = totalCost.add(line.getAmount());
                    }
                }
            }

            BigDecimal recNet = recGross.subtract(recDeductions);
            totalNet = totalNet.add(recNet);

            // Quét bất thường
            if (recNet.compareTo(BigDecimal.ZERO) <= 0) {
                Employee emp = employeeRepository.findById(r.getEmployeeId()).orElse(null);
                anomalies.add(PayrollAnomalyResponse.builder()
                        .recordId(r.getId())
                        .employeeId(r.getEmployeeId())
                        .employeeName(emp != null ? emp.getFullName() : "")
                        .employeeCode(emp != null ? emp.getEmployeeCode() : "")
                        .anomalyType("NET_ZERO_OR_NEGATIVE")
                        .message("Lương thực nhận Net <= 0 VNĐ")
                        .currentNet(recNet)
                        .build());
            }

            if (recTax.compareTo(BigDecimal.ZERO) < 0) {
                Employee emp = employeeRepository.findById(r.getEmployeeId()).orElse(null);
                anomalies.add(PayrollAnomalyResponse.builder()
                        .recordId(r.getId())
                        .employeeId(r.getEmployeeId())
                        .employeeName(emp != null ? emp.getFullName() : "")
                        .employeeCode(emp != null ? emp.getEmployeeCode() : "")
                        .anomalyType("TAX_NEGATIVE")
                        .message("Thuế TNCN bị âm")
                        .currentNet(recNet)
                        .build());
            }
        }

        totalCost = totalCost.add(totalGross);

        return PayrollPeriodSummaryResponse.builder()
                .periodId(period.getId())
                .periodCode(period.getCode())
                .periodName(period.getName())
                .totalEmployees(records.size())
                .totalGross(totalGross)
                .totalNet(totalNet)
                .totalEmployerCost(totalCost)
                .totalEmployeeInsurance(totalEmpInsurance)
                .totalEmployerInsurance(totalCompInsurance)
                .totalPitTax(totalPitTax)
                .totalAdvanceDeducted(totalAdvance)
                .totalPaid(BigDecimal.ZERO)
                .totalPendingPayment(totalNet)
                .diffGrossPercentage(BigDecimal.ZERO)
                .diffNetPercentage(BigDecimal.ZERO)
                .anomalyCount(anomalies.size())
                .anomalies(anomalies)
                .build();
    }

    @Transactional
    public PayrollPeriodResponse submitForApproval(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() != PayrollPeriodStatus.CALCULATED) {
            throw new PayrollException(PayrollErrorCode.CANNOT_SUBMIT_NON_CALCULATED_PERIOD);
        }

        period.setStatus(PayrollPeriodStatus.PENDING_APPROVAL);
        PayrollPeriod saved = payrollPeriodRepository.save(period);
        return getPayrollPeriodById(saved.getId());
    }

    @Transactional
    public PayrollPeriodResponse approvePayroll(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() != PayrollPeriodStatus.PENDING_APPROVAL) {
            throw new PayrollException(PayrollErrorCode.CANNOT_MODIFY_LOCKED_PERIOD);
        }

        period.setStatus(PayrollPeriodStatus.APPROVED);
        PayrollPeriod saved = payrollPeriodRepository.save(period);

        // Tự động sinh PayrollPayment & Payslip cho từng record
        List<PayrollRecord> records = payrollRecordRepository.findAllByPayrollPeriodId(period.getId());
        List<PayrollPayment> payments = new ArrayList<>();
        List<Payslip> payslips = new ArrayList<>();

        for (PayrollRecord r : records) {
            Employee emp = employeeRepository.findById(r.getEmployeeId()).orElse(null);

            BigDecimal gross = BigDecimal.ZERO;
            BigDecimal deductions = BigDecimal.ZERO;

            for (PayrollRecordLine line : r.getLines()) {
                if (line.getLineType() == PayrollLineType.BASE_SALARY ||
                    line.getLineType() == PayrollLineType.ALLOWANCE ||
                    line.getLineType() == PayrollLineType.OVERTIME ||
                    line.getLineType() == PayrollLineType.BONUS ||
                    line.getLineType() == PayrollLineType.REIMBURSEMENT) {
                    gross = gross.add(line.getAmount());
                } else if (line.getLineType() == PayrollLineType.INSURANCE_EMPLOYEE ||
                           line.getLineType() == PayrollLineType.PERSONAL_INCOME_TAX ||
                           line.getLineType() == PayrollLineType.ADVANCE_RECOVERY ||
                           line.getLineType() == PayrollLineType.DEDUCTION) {
                    deductions = deductions.add(line.getAmount());
                }
            }

            BigDecimal netAmount = gross.subtract(deductions);

            PayrollPayment payment = PayrollPayment.builder()
                    .payrollRecord(r)
                    .bankName("Vietcombank")
                    .accountNumber("1903" + (emp != null && emp.getEmployeeCode() != null ? emp.getEmployeeCode() : "0000"))
                    .accountHolderName(emp != null ? emp.getFullName() : "NHAN VIEN")
                    .amount(netAmount)
                    .status(PaymentStatus.PENDING)
                    .build();
            payments.add(payment);

            Payslip payslip = Payslip.builder()
                    .payrollRecord(r)
                    .employeeId(r.getEmployeeId())
                    .issuedAt(LocalDateTime.now())
                    .build();
            payslips.add(payslip);
        }

        payrollPaymentRepository.saveAll(payments);
        payslipRepository.saveAll(payslips);

        return getPayrollPeriodById(saved.getId());
    }

    @Transactional
    public PayrollPeriodResponse rejectPayroll(UUID id, String reason) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() != PayrollPeriodStatus.PENDING_APPROVAL) {
            throw new PayrollException(PayrollErrorCode.CANNOT_MODIFY_LOCKED_PERIOD);
        }

        period.setStatus(PayrollPeriodStatus.OPEN);
        period.setNote("Từ chối phê duyệt: " + reason);
        PayrollPeriod saved = payrollPeriodRepository.save(period);
        return getPayrollPeriodById(saved.getId());
    }

    @Transactional
    public PayrollPeriodResponse lockPeriod(UUID id) {
        PayrollPeriod period = payrollPeriodRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_FOUND));

        if (period.getStatus() != PayrollPeriodStatus.APPROVED) {
            throw new PayrollException(PayrollErrorCode.PAYROLL_PERIOD_NOT_APPROVED);
        }

        period.setStatus(PayrollPeriodStatus.LOCKED);
        PayrollPeriod saved = payrollPeriodRepository.save(period);
        return getPayrollPeriodById(saved.getId());
    }
}
