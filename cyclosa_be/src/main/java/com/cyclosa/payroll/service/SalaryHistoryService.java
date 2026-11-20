package com.cyclosa.payroll.service;

import com.cyclosa.payroll.dto.request.CreateSalaryHistoryRequest;
import com.cyclosa.payroll.dto.response.SalaryHistoryResponse;
import com.cyclosa.payroll.entity.SalaryHistory;
import com.cyclosa.payroll.mapper.SalaryHistoryMapper;
import com.cyclosa.payroll.repository.SalaryHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryHistoryService {

    private final SalaryHistoryRepository salaryHistoryRepository;
    private final SalaryHistoryMapper salaryHistoryMapper;

    @Transactional(readOnly = true)
    public List<SalaryHistoryResponse> getSalaryHistoriesByEmployee(UUID employeeId) {
        List<SalaryHistory> histories = salaryHistoryRepository.findAllByEmployeeIdOrderByEffectiveFromDesc(employeeId);
        return salaryHistoryMapper.toResponseList(histories);
    }

    @Transactional(readOnly = true)
    public SalaryHistoryResponse getEffectiveSalaryAtDate(UUID employeeId, LocalDate targetDate) {
        SalaryHistory history = salaryHistoryRepository.findEffectiveSalaryAtDate(employeeId, targetDate)
                .orElse(null);
        return history != null ? salaryHistoryMapper.toResponse(history) : null;
    }

    @Transactional
    public SalaryHistoryResponse recordSalaryChange(CreateSalaryHistoryRequest request) {
        SalaryHistory history = salaryHistoryMapper.toEntity(request);
        SalaryHistory saved = salaryHistoryRepository.save(history);
        return salaryHistoryMapper.toResponse(saved);
    }
}
