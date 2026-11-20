package com.cyclosa.payroll.service;

import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.payroll.dto.request.CreateEmployeeSalaryItemRequest;
import com.cyclosa.payroll.dto.request.CreateSalaryComponentRequest;
import com.cyclosa.payroll.dto.request.SalaryComponentFilter;
import com.cyclosa.payroll.dto.request.UpdateSalaryComponentRequest;
import com.cyclosa.payroll.dto.response.EmployeeSalaryItemResponse;
import com.cyclosa.payroll.dto.response.SalaryComponentResponse;
import com.cyclosa.payroll.entity.EmployeeSalaryItem;
import com.cyclosa.payroll.entity.SalaryComponent;
import com.cyclosa.payroll.exception.PayrollErrorCode;
import com.cyclosa.payroll.exception.PayrollException;
import com.cyclosa.payroll.mapper.EmployeeSalaryItemMapper;
import com.cyclosa.payroll.mapper.SalaryComponentMapper;
import com.cyclosa.payroll.repository.EmployeeSalaryItemRepository;
import com.cyclosa.payroll.repository.SalaryComponentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalaryComponentService {

    private final SalaryComponentRepository salaryComponentRepository;
    private final EmployeeSalaryItemRepository employeeSalaryItemRepository;
    private final SalaryComponentMapper salaryComponentMapper;
    private final EmployeeSalaryItemMapper employeeSalaryItemMapper;

    @Transactional(readOnly = true)
    public List<SalaryComponentResponse> getSalaryComponents(SalaryComponentFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        List<SalaryComponent> components = salaryComponentRepository.findAllByCompanyIdAndIsActiveTrue(companyId);
        return salaryComponentMapper.toResponseList(components);
    }

    @Transactional(readOnly = true)
    public SalaryComponentResponse getSalaryComponentById(UUID id) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_COMPONENT_NOT_FOUND));
        return salaryComponentMapper.toResponse(component);
    }

    @Transactional
    public SalaryComponentResponse createSalaryComponent(CreateSalaryComponentRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        if (salaryComponentRepository.existsByCompanyIdAndCode(companyId, request.getCode())) {
            throw new PayrollException(PayrollErrorCode.SALARY_COMPONENT_CODE_DUPLICATED);
        }

        SalaryComponent component = salaryComponentMapper.toEntity(request);
        component.setCompanyId(companyId);
        component.setIsActive(true);

        SalaryComponent saved = salaryComponentRepository.save(component);
        return salaryComponentMapper.toResponse(saved);
    }

    @Transactional
    public SalaryComponentResponse updateSalaryComponent(UUID id, UpdateSalaryComponentRequest request) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_COMPONENT_NOT_FOUND));

        salaryComponentMapper.updateEntityFromDto(request, component);
        SalaryComponent updated = salaryComponentRepository.save(component);
        return salaryComponentMapper.toResponse(updated);
    }

    @Transactional
    public void deleteSalaryComponent(UUID id) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_COMPONENT_NOT_FOUND));

        if (employeeSalaryItemRepository.existsBySalaryComponentId(id)) {
            throw new PayrollException(PayrollErrorCode.CANNOT_DELETE_ACTIVE_COMPONENT);
        }

        salaryComponentRepository.delete(component);
    }

    @Transactional(readOnly = true)
    public List<EmployeeSalaryItemResponse> getEmployeeSalaryItems(UUID employeeId) {
        List<EmployeeSalaryItem> items = employeeSalaryItemRepository.findAllByEmployeeId(employeeId);
        return employeeSalaryItemMapper.toResponseList(items);
    }

    @Transactional
    public EmployeeSalaryItemResponse assignSalaryItemToEmployee(CreateEmployeeSalaryItemRequest request) {
        SalaryComponent component = salaryComponentRepository.findById(request.getSalaryComponentId())
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.SALARY_COMPONENT_NOT_FOUND));

        EmployeeSalaryItem item = employeeSalaryItemMapper.toEntity(request);
        item.setSalaryComponent(component);

        EmployeeSalaryItem saved = employeeSalaryItemRepository.save(item);
        return employeeSalaryItemMapper.toResponse(saved);
    }

    @Transactional
    public void removeSalaryItemFromEmployee(UUID itemId) {
        EmployeeSalaryItem item = employeeSalaryItemRepository.findById(itemId)
                .orElseThrow(() -> new PayrollException(PayrollErrorCode.EMPLOYEE_SALARY_ITEM_NOT_FOUND));
        employeeSalaryItemRepository.delete(item);
    }
}
