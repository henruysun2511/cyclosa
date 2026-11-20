package com.cyclosa.career.service;

import com.cyclosa.career.dto.request.CareerPathFilter;
import com.cyclosa.career.dto.request.CreateCareerPathRequest;
import com.cyclosa.career.dto.request.UpdateCareerPathRequest;
import com.cyclosa.career.dto.response.CareerGraphResponse;
import com.cyclosa.career.dto.response.CareerPathResponse;
import com.cyclosa.career.dto.response.CareerStatisticsResponse;
import com.cyclosa.career.entity.CareerPath;
import com.cyclosa.career.enums.Readiness;
import com.cyclosa.career.enums.RiskLevel;
import com.cyclosa.career.exception.CareerErrorCode;
import com.cyclosa.career.mapper.CareerPathMapper;
import com.cyclosa.career.repository.CareerPathRepository;
import com.cyclosa.career.repository.InternalTalentPoolRepository;
import com.cyclosa.career.repository.SuccessionCandidateRepository;
import com.cyclosa.career.repository.SuccessionPlanRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.organization.entity.JobTitle;
import com.cyclosa.organization.repository.CompanyRepository;
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

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CareerPathService {

    private final CareerPathRepository careerPathRepository;
    private final CareerPathMapper careerPathMapper;
    private final JobTitleRepository jobTitleRepository;
    private final CompanyRepository companyRepository;
    private final SuccessionPlanRepository successionPlanRepository;
    private final SuccessionCandidateRepository successionCandidateRepository;
    private final InternalTalentPoolRepository internalTalentPoolRepository;

    public PageData<CareerPathResponse> getCareerPaths(CareerPathFilter filter) {
        UUID companyId = resolveCurrentCompanyId();
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<CareerPath> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getFromJobTitleId() != null) {
                predicates.add(cb.equal(root.get("fromJobTitle").get("id"), filter.getFromJobTitleId()));
            }
            if (filter.getToJobTitleId() != null) {
                predicates.add(cb.equal(root.get("toJobTitle").get("id"), filter.getToJobTitleId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<CareerPath> page = careerPathRepository.findAll(spec, pageRequest);
        List<CareerPathResponse> items = careerPathMapper.toResponseList(page.getContent());
        return PageData.of(page, items);
    }

    public CareerPathResponse getCareerPathById(UUID id) {
        CareerPath entity = careerPathRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.CAREER_PATH_NOT_FOUND));
        return careerPathMapper.toResponse(entity);
    }

    @Transactional
    public CareerPathResponse createCareerPath(CreateCareerPathRequest request) {
        UUID companyId = resolveCurrentCompanyId();

        if (request.getFromJobTitleId().equals(request.getToJobTitleId())) {
            throw new AppException(CareerErrorCode.SAME_JOB_TITLE_NOT_ALLOWED);
        }

        if (careerPathRepository.existsByCompanyIdAndFromJobTitleIdAndToJobTitleId(
                companyId, request.getFromJobTitleId(), request.getToJobTitleId())) {
            throw new AppException(CareerErrorCode.CAREER_PATH_ALREADY_EXISTS);
        }

        JobTitle fromJobTitle = jobTitleRepository.findById(request.getFromJobTitleId())
                .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));

        JobTitle toJobTitle = jobTitleRepository.findById(request.getToJobTitleId())
                .orElseThrow(() -> new AppException(CareerErrorCode.JOB_TITLE_NOT_FOUND));

        CareerPath entity = careerPathMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setFromJobTitle(fromJobTitle);
        entity.setToJobTitle(toJobTitle);

        CareerPath saved = careerPathRepository.save(entity);
        log.info("Created career path {} from {} to {}", saved.getId(), fromJobTitle.getName(), toJobTitle.getName());
        return careerPathMapper.toResponse(saved);
    }

    @Transactional
    public CareerPathResponse updateCareerPath(UUID id, UpdateCareerPathRequest request) {
        CareerPath entity = careerPathRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.CAREER_PATH_NOT_FOUND));

        careerPathMapper.updateEntityFromRequest(request, entity);
        CareerPath saved = careerPathRepository.save(entity);
        log.info("Updated career path {}", id);
        return careerPathMapper.toResponse(saved);
    }

    @Transactional
    public void deleteCareerPath(UUID id) {
        CareerPath entity = careerPathRepository.findById(id)
                .orElseThrow(() -> new AppException(CareerErrorCode.CAREER_PATH_NOT_FOUND));
        careerPathRepository.delete(entity);
        log.info("Deleted career path {}", id);
    }

    public CareerGraphResponse getCareerGraph(UUID fromJobTitleId) {
        UUID companyId = resolveCurrentCompanyId();
        List<CareerPath> allPaths;

        if (fromJobTitleId != null) {
            allPaths = careerPathRepository.findAllByFromJobTitle(companyId, fromJobTitleId);
        } else {
            allPaths = careerPathRepository.findAllByCompanyIdWithDetails(companyId);
        }

        Map<String, CareerGraphResponse.Node> nodeMap = new LinkedHashMap<>();
        List<CareerGraphResponse.Edge> edges = new ArrayList<>();

        for (CareerPath cp : allPaths) {
            JobTitle from = cp.getFromJobTitle();
            JobTitle to = cp.getToJobTitle();

            String fromId = from.getId().toString();
            String toId = to.getId().toString();

            if (!nodeMap.containsKey(fromId)) {
                nodeMap.put(fromId, CareerGraphResponse.Node.builder()
                        .id(fromId)
                        .label(from.getName())
                        .code(from.getCode())
                        .isCurrent(fromJobTitleId != null && from.getId().equals(fromJobTitleId))
                        .build());
            }

            if (!nodeMap.containsKey(toId)) {
                nodeMap.put(toId, CareerGraphResponse.Node.builder()
                        .id(toId)
                        .label(to.getName())
                        .code(to.getCode())
                        .isCurrent(false)
                        .build());
            }

            edges.add(CareerGraphResponse.Edge.builder()
                    .id(cp.getId().toString())
                    .source(fromId)
                    .target(toId)
                    .minYears(cp.getMinExperienceYears())
                    .requirements(cp.getRequirements())
                    .build());
        }

        return CareerGraphResponse.builder()
                .nodes(new ArrayList<>(nodeMap.values()))
                .edges(edges)
                .build();
    }

    public CareerStatisticsResponse getStatistics() {
        UUID companyId = resolveCurrentCompanyId();

        long totalKeyPositions = successionPlanRepository.countByCompanyId(companyId);
        long highRiskPositions = successionPlanRepository.countByCompanyIdAndRiskLevelIn(
                companyId,
                List.of(RiskLevel.HIGH, RiskLevel.CRITICAL)
        );
        long readyNowCandidates = successionCandidateRepository.countByCompanyIdAndReadiness(
                companyId,
                Readiness.READY_NOW
        );
        long totalTalents = internalTalentPoolRepository.countByCompanyId(companyId);

        return CareerStatisticsResponse.builder()
                .totalKeyPositions(totalKeyPositions)
                .highRiskPositions(highRiskPositions)
                .readyNowCandidates(readyNowCandidates)
                .totalTalents(totalTalents)
                .build();
    }

    private UUID resolveCurrentCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
