package com.cyclosa.performance.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.performance.dto.request.CreateKpiRequest;
import com.cyclosa.performance.dto.request.KpiFilter;
import com.cyclosa.performance.dto.request.UpdateKpiRequest;
import com.cyclosa.performance.dto.response.KpiResponse;
import com.cyclosa.performance.entity.Kpi;
import com.cyclosa.performance.exception.PerformanceErrorCode;
import com.cyclosa.performance.mapper.KpiMapper;
import com.cyclosa.performance.repository.KpiRepository;
import com.cyclosa.performance.repository.PerformanceGoalRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class KpiService {

    private final KpiRepository kpiRepository;
    private final DepartmentRepository departmentRepository;
    private final PerformanceGoalRepository goalRepository;
    private final KpiMapper kpiMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "name", "unit", "isActive", "createdAt"
    );

    @Transactional(readOnly = true)
    public PageData<KpiResponse> getKpis(KpiFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("name", ALLOWED_SORT_FIELDS);

        Specification<Kpi> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), pattern));
            }

            if (filter.getDepartmentId() != null) {
                predicates.add(cb.equal(root.get("department").get("id"), filter.getDepartmentId()));
            }

            if (filter.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Kpi> page = kpiRepository.findAll(spec, pageable);
        List<KpiResponse> responses = kpiMapper.toResponseList(page.getContent());
        return PageData.of(page, responses);
    }

    @Transactional(readOnly = true)
    public KpiResponse getKpiById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Kpi kpi = kpiRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.KPI_NOT_FOUND));
        return kpiMapper.toResponse(kpi);
    }

    @Transactional
    public KpiResponse createKpi(CreateKpiRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        if (kpiRepository.existsByCompanyIdAndName(companyId, request.getName().trim())) {
            throw new AppException(PerformanceErrorCode.KPI_NAME_EXISTS);
        }

        Kpi kpi = kpiMapper.toEntity(request);
        kpi.setCompanyId(companyId);
        kpi.setName(request.getName().trim());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
            kpi.setDepartment(department);
        }

        Kpi saved = kpiRepository.save(kpi);
        log.info("Created KPI: id={}, name={}", saved.getId(), saved.getName());
        return kpiMapper.toResponse(saved);
    }

    @Transactional
    public KpiResponse updateKpi(UUID id, UpdateKpiRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Kpi kpi = kpiRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.KPI_NOT_FOUND));

        if (kpiRepository.existsByCompanyIdAndNameAndIdNot(companyId, request.getName().trim(), id)) {
            throw new AppException(PerformanceErrorCode.KPI_NAME_EXISTS);
        }

        kpiMapper.updateEntityFromDto(request, kpi);
        kpi.setName(request.getName().trim());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
            kpi.setDepartment(department);
        } else {
            kpi.setDepartment(null);
        }

        if (request.getIsActive() != null) {
            kpi.setIsActive(request.getIsActive());
        }

        Kpi saved = kpiRepository.save(kpi);
        log.info("Updated KPI: id={}, name={}", saved.getId(), saved.getName());
        return kpiMapper.toResponse(saved);
    }

    @Transactional
    public void deleteKpi(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Kpi kpi = kpiRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.KPI_NOT_FOUND));

        if (goalRepository.existsByKpiId(kpi.getId())) {
            throw new AppException(PerformanceErrorCode.KPI_IN_USE);
        }

        kpiRepository.delete(kpi);
        log.info("Deleted KPI: id={}", id);
    }
}
