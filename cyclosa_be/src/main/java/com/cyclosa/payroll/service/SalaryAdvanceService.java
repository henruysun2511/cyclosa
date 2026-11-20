package com.cyclosa.payroll.service;

import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.dto.request.CreateSalaryAdvanceRequest;
import com.cyclosa.payroll.dto.request.SalaryAdvanceFilter;
import com.cyclosa.payroll.dto.response.SalaryAdvanceResponse;
import com.cyclosa.payroll.entity.SalaryAdvance;
import com.cyclosa.payroll.enums.SalaryAdvanceStatus;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.SalaryAdvanceMapper;
import com.cyclosa.payroll.repository.SalaryAdvanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryAdvanceService {

    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryAdvanceMapper salaryAdvanceMapper;

    @Transactional(readOnly = true)
    public List<SalaryAdvanceResponse> getSalaryAdvances(SalaryAdvanceFilter filter) {
        if (filter != null && filter.getEmployeeId() != null) {
            List<SalaryAdvance> list = salaryAdvanceRepository.findAllByEmployeeIdOrderByRequestedAtDesc(filter.getEmployeeId());
            return enrichResponses(list);
        }
        List<SalaryAdvance> all = salaryAdvanceRepository.findAll();
        return enrichResponses(all);
    }

    @Transactional(readOnly = true)
    public List<SalaryAdvanceResponse> getMySalaryAdvances() {
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

        List<SalaryAdvance> advances = salaryAdvanceRepository.findAllByEmployeeIdOrderByRequestedAtDesc(emp.getId());
        return enrichResponses(advances);
    }

    @Transactional
    public SalaryAdvanceResponse requestSalaryAdvance(CreateSalaryAdvanceRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID empId = request.getEmployeeId();

        if (empId == null) {
            UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                    .orElseThrow(() -> new PayrollException(PayrollErrorCode.EMPLOYEE_SALARY_ITEM_NOT_FOUND));
            Employee emp = employeeRepository.findByUserId(currentUserId)
                    .orElseThrow(() -> new PayrollException(PayrollErrorCode.EMPLOYEE_SALARY_ITEM_NOT_FOUND));
            empId = emp.getId();
        }

        SalaryAdvance advance = salaryAdvanceMapper.toEntity(request);
        advance.setCompanyId(companyId);
        advance.setEmployeeId(empId);
        advance.setStatus(SalaryAdvanceStatus.PENDING_APPROVAL);
        advance.setRequestedAt(LocalDateTime.now());

        SalaryAdvance saved = salaryAdvanceRepository.save(advance);
        return enrichResponse(saved);
    }

    @Transactional
    public SalaryAdvanceResponse approveSalaryAdvance(UUID id) {
        SalaryAdvance advance = salaryAdvanceRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_ADVANCE_NOT_FOUND));

        if (advance.getStatus() != SalaryAdvanceStatus.PENDING_APPROVAL) {
            throw new PayrollException(PayrollErrorCode.CANNOT_CANCEL_APPROVED_ADVANCE);
        }

        advance.setStatus(SalaryAdvanceStatus.APPROVED);
        SalaryAdvance saved = salaryAdvanceRepository.save(advance);
        return enrichResponse(saved);
    }

    @Transactional
    public SalaryAdvanceResponse rejectSalaryAdvance(UUID id, String rejectionReason) {
        SalaryAdvance advance = salaryAdvanceRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_ADVANCE_NOT_FOUND));

        if (advance.getStatus() != SalaryAdvanceStatus.PENDING_APPROVAL) {
            throw new PayrollException(PayrollErrorCode.CANNOT_CANCEL_APPROVED_ADVANCE);
        }

        advance.setStatus(SalaryAdvanceStatus.REJECTED);
        SalaryAdvance saved = salaryAdvanceRepository.save(advance);
        return enrichResponse(saved);
    }

    @Transactional
    public SalaryAdvanceResponse disburseSalaryAdvance(UUID id, UUID payrollPeriodId) {
        SalaryAdvance advance = salaryAdvanceRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_ADVANCE_NOT_FOUND));

        if (advance.getStatus() != SalaryAdvanceStatus.APPROVED) {
            throw new PayrollException(PayrollErrorCode.CANNOT_DISBURSE_UNAPPROVED_ADVANCE);
        }

        advance.setStatus(SalaryAdvanceStatus.DISBURSED);
        advance.setDisbursedAt(LocalDateTime.now());
        advance.setRecoveryPayrollPeriodId(payrollPeriodId);

        SalaryAdvance saved = salaryAdvanceRepository.save(advance);
        return enrichResponse(saved);
    }

    private List<SalaryAdvanceResponse> enrichResponses(List<SalaryAdvance> advances) {
        return advances.stream().map(this::enrichResponse).toList();
    }

    private SalaryAdvanceResponse enrichResponse(SalaryAdvance advance) {
        SalaryAdvanceResponse resp = salaryAdvanceMapper.toResponse(advance);
        employeeRepository.findById(advance.getEmployeeId()).ifPresent(emp -> {
            resp.setEmployeeName(emp.getFullName());
            resp.setEmployeeCode(emp.getEmployeeCode());
        });
        return resp;
    }
}
