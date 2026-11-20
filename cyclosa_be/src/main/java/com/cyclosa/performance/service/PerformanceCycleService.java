package com.cyclosa.performance.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.performance.dto.request.CreatePerformanceCycleRequest;
import com.cyclosa.performance.dto.request.PerformanceCycleFilter;
import com.cyclosa.performance.dto.request.UpdatePerformanceCycleRequest;
import com.cyclosa.performance.dto.response.PerformanceCycleResponse;
import com.cyclosa.performance.dto.response.PerformanceCycleSummaryResponse;
import com.cyclosa.performance.entity.PerformanceCycle;
import com.cyclosa.performance.entity.PerformanceReview;
import com.cyclosa.performance.enums.PerformanceCycleStatus;
import com.cyclosa.performance.enums.PerformanceRating;
import com.cyclosa.performance.enums.ReviewStatus;
import com.cyclosa.performance.exception.PerformanceErrorCode;
import com.cyclosa.performance.mapper.PerformanceCycleMapper;
import com.cyclosa.performance.repository.PerformanceCycleRepository;
import com.cyclosa.performance.repository.PerformanceReviewRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceCycleService {

    private final PerformanceCycleRepository cycleRepository;
    private final PerformanceReviewRepository reviewRepository;
    private final PerformanceCycleMapper cycleMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "name", "startDate", "endDate", "status", "createdAt"
    );

    @Transactional(readOnly = true)
    public PageData<PerformanceCycleResponse> getCycles(PerformanceCycleFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("startDate", ALLOWED_SORT_FIELDS);

        Specification<PerformanceCycle> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), pattern));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getYear() != null) {
                predicates.add(cb.equal(cb.function("date_part", Integer.class, cb.literal("year"), root.get("startDate")), filter.getYear()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<PerformanceCycle> page = cycleRepository.findAll(spec, pageable);
        List<PerformanceCycleResponse> responses = page.getContent().stream()
                .map(c -> {
                    PerformanceCycleResponse res = cycleMapper.toResponse(c);
                    res.setTotalReviews(reviewRepository.countByCycleId(c.getId()));
                    res.setFinalizedReviews(reviewRepository.countByCycleIdAndStatus(c.getId(), ReviewStatus.FINALIZED));
                    return res;
                })
                .toList();

        return PageData.of(page, responses);
    }

    @Transactional(readOnly = true)
    public PerformanceCycleResponse getCycleById(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        PerformanceCycleResponse res = cycleMapper.toResponse(cycle);
        res.setTotalReviews(reviewRepository.countByCycleId(cycle.getId()));
        res.setFinalizedReviews(reviewRepository.countByCycleIdAndStatus(cycle.getId(), ReviewStatus.FINALIZED));
        return res;
    }

    @Transactional
    public PerformanceCycleResponse createCycle(CreatePerformanceCycleRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(PerformanceErrorCode.INVALID_PERFORMANCE_CYCLE_DATES);
        }

        if (cycleRepository.existsByCompanyIdAndName(companyId, request.getName().trim())) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NAME_EXISTS);
        }

        PerformanceCycle cycle = cycleMapper.toEntity(request);
        cycle.setCompanyId(companyId);
        cycle.setName(request.getName().trim());
        cycle.setStatus(PerformanceCycleStatus.DRAFT);

        PerformanceCycle saved = cycleRepository.save(cycle);
        log.info("Created performance cycle: id={}, name={}", saved.getId(), saved.getName());

        PerformanceCycleResponse res = cycleMapper.toResponse(saved);
        res.setTotalReviews(0L);
        res.setFinalizedReviews(0L);
        return res;
    }

    @Transactional
    public PerformanceCycleResponse updateCycle(UUID id, UpdatePerformanceCycleRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        if (cycle.getStatus() != PerformanceCycleStatus.DRAFT) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_DRAFT);
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(PerformanceErrorCode.INVALID_PERFORMANCE_CYCLE_DATES);
        }

        if (cycleRepository.existsByCompanyIdAndNameAndIdNot(companyId, request.getName().trim(), id)) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NAME_EXISTS);
        }

        cycleMapper.updateEntityFromDto(request, cycle);
        cycle.setName(request.getName().trim());

        PerformanceCycle saved = cycleRepository.save(cycle);
        log.info("Updated performance cycle: id={}, name={}", saved.getId(), saved.getName());

        PerformanceCycleResponse res = cycleMapper.toResponse(saved);
        res.setTotalReviews(reviewRepository.countByCycleId(saved.getId()));
        res.setFinalizedReviews(reviewRepository.countByCycleIdAndStatus(saved.getId(), ReviewStatus.FINALIZED));
        return res;
    }

    @Transactional
    public void deleteCycle(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        if (cycle.getStatus() != PerformanceCycleStatus.DRAFT) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_DRAFT);
        }

        long reviewsCount = reviewRepository.countByCycleId(cycle.getId());
        if (reviewsCount > 0) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_HAS_REVIEWS);
        }

        cycleRepository.delete(cycle);
        log.info("Deleted performance cycle: id={}", id);
    }

    @Transactional
    public PerformanceCycleResponse activateCycle(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        if (cycle.getStatus() != PerformanceCycleStatus.DRAFT) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_DRAFT);
        }

        cycle.setStatus(PerformanceCycleStatus.ACTIVE);
        PerformanceCycle saved = cycleRepository.save(cycle);
        log.info("Activated performance cycle: id={}", saved.getId());

        PerformanceCycleResponse res = cycleMapper.toResponse(saved);
        res.setTotalReviews(reviewRepository.countByCycleId(saved.getId()));
        res.setFinalizedReviews(reviewRepository.countByCycleIdAndStatus(saved.getId(), ReviewStatus.FINALIZED));
        return res;
    }

    @Transactional
    public PerformanceCycleResponse closeCycle(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        if (cycle.getStatus() != PerformanceCycleStatus.ACTIVE) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_CANNOT_CLOSE);
        }

        cycle.setStatus(PerformanceCycleStatus.CLOSED);
        PerformanceCycle saved = cycleRepository.save(cycle);
        log.info("Closed performance cycle: id={}", saved.getId());

        PerformanceCycleResponse res = cycleMapper.toResponse(saved);
        res.setTotalReviews(reviewRepository.countByCycleId(saved.getId()));
        res.setFinalizedReviews(reviewRepository.countByCycleIdAndStatus(saved.getId(), ReviewStatus.FINALIZED));
        return res;
    }

    @Transactional(readOnly = true)
    public PerformanceCycleSummaryResponse getCycleSummary(UUID id) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        List<PerformanceReview> reviews = reviewRepository.findAllByCycleIdWithDetails(cycle.getId());
        long total = reviews.size();
        long draft = reviews.stream().filter(r -> r.getStatus() == ReviewStatus.DRAFT).count();
        long selfReviewed = reviews.stream().filter(r -> r.getStatus() == ReviewStatus.SELF_REVIEWED).count();
        long managerReviewed = reviews.stream().filter(r -> r.getStatus() == ReviewStatus.MANAGER_REVIEWED).count();
        long finalized = reviews.stream().filter(r -> r.getStatus() == ReviewStatus.FINALIZED).count();

        double completionRate = total > 0 ? (double) finalized / total * 100.0 : 0.0;

        Map<String, Long> ratingDistribution = new LinkedHashMap<>();
        for (PerformanceRating rating : PerformanceRating.values()) {
            ratingDistribution.put(rating.name(), reviews.stream().filter(r -> r.getFinalRating() == rating).count());
        }

        return PerformanceCycleSummaryResponse.builder()
                .cycleId(cycle.getId())
                .cycleName(cycle.getName())
                .totalReviews(total)
                .draftCount(draft)
                .selfReviewedCount(selfReviewed)
                .managerReviewedCount(managerReviewed)
                .finalizedCount(finalized)
                .completionRate(Math.round(completionRate * 100.0) / 100.0)
                .ratingDistribution(ratingDistribution)
                .build();
    }
}
