package com.cyclosa.career.service;

import com.cyclosa.career.dto.request.AddSuccessionCandidateRequest;
import com.cyclosa.career.dto.request.CreateSuccessionPlanRequest;
import com.cyclosa.career.dto.request.SuccessionPlanFilter;
import com.cyclosa.career.dto.request.UpdateSuccessionCandidateRequest;
import com.cyclosa.career.dto.request.UpdateSuccessionPlanRequest;
import com.cyclosa.career.dto.response.SuccessionCandidateResponse;
import com.cyclosa.career.dto.response.SuccessionPlanDetailResponse;
import com.cyclosa.career.dto.response.SuccessionPlanResponse;
import com.cyclosa.career.dto.response.SuccessionSuggestionResponse;
import com.cyclosa.career.entity.InternalTalentPoolEntry;
import com.cyclosa.career.entity.SuccessionCandidate;
import com.cyclosa.career.entity.SuccessionPlan;
import com.cyclosa.career.enums.Readiness;
import com.cyclosa.career.exception.CareerErrorCode;
import com.cyclosa.career.mapper.SuccessionCandidateMapper;
import com.cyclosa.career.mapper.SuccessionPlanMapper;
import com.cyclosa.career.repository.InternalTalentPoolRepository;
import com.cyclosa.career.repository.SuccessionCandidateRepository;
import com.cyclosa.career.repository.SuccessionPlanRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeWorkAssignment;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.organization.repository.CompanyRepository;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.organization.repository.JobTitleRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SuccessionPlanService {

    private final SuccessionPlanRepository successionPlanRepository;
    private final SuccessionCandidateRepository successionCandidateRepository;
    private final InternalTalentPoolRepository talentPoolRepository;
    private final SuccessionPlanMapper successionPlanMapper;
    private final SuccessionCandidateMapper successionCandidateMapper;
    private final DepartmentRepository departmentRepository;
    private final JobTitleRepository jobTitleRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;

    public PageData<SuccessionPlanResponse> getSuccessionPlans(SuccessionPlanFilter filter) {
        UUID companyId = resolveCurrentCompanyId();
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<SuccessionPlan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getDepartmentId() != null) {
                predicates.add(cb.equal(root.get("department").get("id"), filter.getDepartmentId()));
            }
            if (filter.getRiskLevel() != null) {
                predicates.add(cb.equal(root.get("riskLevel"), filter.getRiskLevel()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<SuccessionPlan> page = successionPlanRepository.findAll(spec, pageRequest);
        List<SuccessionPlanResponse> items = page.getContent().stream()
                .map(this::enrichSummaryResponse)
                .collect(Collectors.toList());

        return PageData.of(page, items);
    }

    public SuccessionPlanDetailResponse getSuccessionPlanById(UUID id) {
        SuccessionPlan entity = successionPlanRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.SUCCESSION_PLAN_NOT_FOUND));

        SuccessionPlanDetailResponse response = successionPlanMapper.toDetailResponse(entity);
        enrichCurrentHolder(response, entity);
        return response;
    }

    @Transactional
    public SuccessionPlanResponse createSuccessionPlan(CreateSuccessionPlanRequest request) {
        UUID companyId = resolveCurrentCompanyId();

        if (successionPlanRepository.existsByDepartmentIdAndJobTitleId(request.getDepartmentId(), request.getJobTitleId())) {
            throw new AppException(CareerErrorCode.SUCCESSION_PLAN_ALREADY_EXISTS);
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new AppException(CareerErrorCode.DEPARTMENT_NOT_FOUND));

        JobTitle jobTitle = jobTitleRepository.findById(request.getJobTitleId())
                .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));

        SuccessionPlan entity = successionPlanMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setDepartment(department);
        entity.setJobTitle(jobTitle);

        SuccessionPlan saved = successionPlanRepository.save(entity);
        log.info("Created succession plan {} for {} in {}", saved.getId(), jobTitle.getName(), department.getName());
        return enrichSummaryResponse(saved);
    }

    @Transactional
    public SuccessionPlanResponse updateSuccessionPlan(UUID id, UpdateSuccessionPlanRequest request) {
        SuccessionPlan entity = successionPlanRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.SUCCESSION_PLAN_NOT_FOUND));

        successionPlanMapper.updateEntityFromRequest(request, entity);
        SuccessionPlan saved = successionPlanRepository.save(entity);
        log.info("Updated succession plan {}", id);
        return enrichSummaryResponse(saved);
    }

    @Transactional
    public void deleteSuccessionPlan(UUID id) {
        SuccessionPlan entity = successionPlanRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.SUCCESSION_PLAN_NOT_FOUND));
        successionPlanRepository.delete(entity);
        log.info("Deleted succession plan {}", id);
    }

    @Transactional
    public SuccessionCandidateResponse addCandidate(UUID planId, AddSuccessionCandidateRequest request) {
        SuccessionPlan plan = successionPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException(CareerErrorCode.SUCCESSION_PLAN_NOT_FOUND));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(CareerErrorCode.EMPLOYEE_NOT_FOUND));

        // Validation: Cannot add current holder as successor
        Employee currentHolder = findCurrentHolder(plan.getDepartment().getId(), plan.getJobTitle().getId());
        if (currentHolder != null && currentHolder.getId().equals(employee.getId())) {
            throw new AppException(CareerErrorCode.CANDIDATE_IS_CURRENT_HOLDER);
        }

        if (successionCandidateRepository.existsBySuccessionPlanIdAndEmployeeId(planId, request.getEmployeeId())) {
            throw new AppException(CareerErrorCode.CANDIDATE_ALREADY_IN_PLAN);
        }

        SuccessionCandidate candidate = SuccessionCandidate.builder()
                .successionPlan(plan)
                .employee(employee)
                .readiness(request.getReadiness())
                .developmentNotes(request.getDevelopmentNotes())
                .build();

        SuccessionCandidate saved = successionCandidateRepository.save(candidate);
        log.info("Added candidate {} to succession plan {}", employee.getEmployeeCode(), planId);
        return successionCandidateMapper.toResponse(saved);
    }

    @Transactional
    public SuccessionCandidateResponse updateCandidate(UUID planId, UUID employeeId, UpdateSuccessionCandidateRequest request) {
        SuccessionCandidate candidate = successionCandidateRepository.findBySuccessionPlanIdAndEmployeeId(planId, employeeId)
                .orElseThrow(() -> new AppException(CareerErrorCode.CANDIDATE_NOT_FOUND_IN_PLAN));

        candidate.setReadiness(request.getReadiness());
        if (request.getDevelopmentNotes() != null) {
            candidate.setDevelopmentNotes(request.getDevelopmentNotes());
        }

        SuccessionCandidate saved = successionCandidateRepository.save(candidate);
        log.info("Updated candidate {} in succession plan {}", employeeId, planId);
        return successionCandidateMapper.toResponse(saved);
    }

    @Transactional
    public void removeCandidate(UUID planId, UUID employeeId) {
        SuccessionCandidate candidate = successionCandidateRepository.findBySuccessionPlanIdAndEmployeeId(planId, employeeId)
                .orElseThrow(() -> new AppException(CareerErrorCode.CANDIDATE_NOT_FOUND_IN_PLAN));
        successionCandidateRepository.delete(candidate);
        log.info("Removed candidate {} from succession plan {}", employeeId, planId);
    }

    public List<SuccessionSuggestionResponse> getSuggestions(UUID planId) {
        SuccessionPlan plan = successionPlanRepository.findById(planId)
                .orElseThrow(() -> new AppException(CareerErrorCode.SUCCESSION_PLAN_NOT_FOUND));

        UUID companyId = plan.getCompanyId();
        Set<UUID> existingCandidateIds = plan.getCandidates().stream()
                .map(c -> c.getEmployee().getId())
                .collect(Collectors.toSet());

        Employee currentHolder = findCurrentHolder(plan.getDepartment().getId(), plan.getJobTitle().getId());
        if (currentHolder != null) {
            existingCandidateIds.add(currentHolder.getId());
        }

        List<InternalTalentPoolEntry> talentPoolEntries = talentPoolRepository.findAllByCompanyIdWithEmployee(companyId);
        List<SuccessionSuggestionResponse> suggestions = new ArrayList<>();

        for (InternalTalentPoolEntry entry : talentPoolEntries) {
            Employee emp = entry.getEmployee();
            if (existingCandidateIds.contains(emp.getId())) {
                continue;
            }

            suggestions.add(SuccessionSuggestionResponse.builder()
                    .employeeId(emp.getId())
                    .employeeCode(emp.getEmployeeCode())
                    .employeeName(emp.getFullName())
                    .departmentName(emp.getCurrentDepartment() != null ? emp.getCurrentDepartment().getName() : null)
                    .jobTitleName(emp.getCurrentJobTitle() != null ? emp.getCurrentJobTitle().getName() : null)
                    .matchScore(BigDecimal.valueOf(85.0))
                    .matchingFactors(List.of(
                            "Thuộc nhóm nhân tài: " + entry.getTag().getDescription(),
                            "Lý do ghi nhận: " + entry.getReason()
                    ))
                    .performanceRating(BigDecimal.valueOf(4.5))
                    .experienceMonths(24)
                    .build());

            existingCandidateIds.add(emp.getId()); // prevent duplicates if multiple tags
        }

        return suggestions;
    }

    private SuccessionPlanResponse enrichSummaryResponse(SuccessionPlan entity) {
        SuccessionPlanResponse response = successionPlanMapper.toResponse(entity);
        Employee currentHolder = findCurrentHolder(entity.getDepartment().getId(), entity.getJobTitle().getId());
        if (currentHolder != null) {
            response.setCurrentHolderId(currentHolder.getId());
            response.setCurrentHolderCode(currentHolder.getEmployeeCode());
            response.setCurrentHolderName(currentHolder.getFullName());
        }
        return response;
    }

    private void enrichCurrentHolder(SuccessionPlanDetailResponse response, SuccessionPlan entity) {
        Employee currentHolder = findCurrentHolder(entity.getDepartment().getId(), entity.getJobTitle().getId());
        if (currentHolder != null) {
            response.setCurrentHolderId(currentHolder.getId());
            response.setCurrentHolderCode(currentHolder.getEmployeeCode());
            response.setCurrentHolderName(currentHolder.getFullName());
            response.setCurrentHolderPortraitUrl(currentHolder.getPortraitUrl());
        }
    }

    private Employee findCurrentHolder(UUID departmentId, UUID jobTitleId) {
        List<Employee> employees = employeeRepository.findAll();
        for (Employee emp : employees) {
            if (emp.getWorkAssignments() != null && !emp.getWorkAssignments().isEmpty()) {
                EmployeeWorkAssignment wa = emp.getWorkAssignments().get(0);
                if (wa.getDepartment() != null && wa.getDepartment().getId().equals(departmentId)
                        && wa.getJobTitle() != null && wa.getJobTitle().getId().equals(jobTitleId)) {
                    return emp;
                }
            }
        }
        return null;
    }

    private UUID resolveCurrentCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
