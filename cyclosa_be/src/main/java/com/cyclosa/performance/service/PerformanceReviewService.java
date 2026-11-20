package com.cyclosa.performance.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeWorkAssignment;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeWorkAssignmentRepository;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.performance.dto.request.*;
import com.cyclosa.performance.dto.response.*;
import com.cyclosa.performance.entity.*;
import com.cyclosa.performance.enums.*;
import com.cyclosa.performance.exception.PerformanceErrorCode;
import com.cyclosa.performance.mapper.PerformanceGoalMapper;
import com.cyclosa.performance.mapper.PerformanceReviewMapper;
import com.cyclosa.performance.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceReviewService {

    private final PerformanceReviewRepository reviewRepository;
    private final PerformanceCycleRepository cycleRepository;
    private final PerformanceGoalRepository goalRepository;
    private final KpiRepository kpiRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeWorkAssignmentRepository workAssignmentRepository;
    private final EmployeeService employeeService;
    private final PerformanceReviewMapper reviewMapper;
    private final PerformanceGoalMapper goalMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "status", "finalScore", "finalRating", "createdAt", "employee"
    );

    @Transactional
    public void initializeReviews(UUID cycleId, InitializeReviewsRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        PerformanceCycle cycle = cycleRepository.findByIdAndCompanyId(cycleId, companyId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_FOUND));

        if (cycle.getStatus() != PerformanceCycleStatus.ACTIVE) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_ACTIVE);
        }

        List<Employee> employees = employeeRepository.findAllById(request.getEmployeeIds());
        int createdCount = 0;

        for (Employee emp : employees) {
            if (!reviewRepository.existsByCycleIdAndEmployeeId(cycle.getId(), emp.getId())) {
                Employee manager = workAssignmentRepository
                        .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(emp.getId(), LocalDate.now())
                        .map(EmployeeWorkAssignment::getManager)
                        .orElse(null);

                PerformanceReview review = PerformanceReview.builder()
                        .cycle(cycle)
                        .employee(emp)
                        .managerEmployee(manager)
                        .status(ReviewStatus.DRAFT)
                        .build();
                reviewRepository.save(review);
                createdCount++;
            }
        }
        log.info("Initialized {} performance reviews for cycle: id={}", createdCount, cycleId);
    }

    @Transactional(readOnly = true)
    public PageData<PerformanceReviewResponse> getReviews(PerformanceReviewFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<PerformanceReview> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("cycle").get("companyId"), companyId));

            if (filter.getCycleId() != null) {
                predicates.add(cb.equal(root.get("cycle").get("id"), filter.getCycleId()));
            }

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employee").get("id"), filter.getEmployeeId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                var fullNameExpr = cb.concat(cb.concat(cb.lower(root.get("employee").get("lastName")), " "), cb.lower(root.get("employee").get("firstName")));
                Predicate nameMatch = cb.like(fullNameExpr, pattern);
                Predicate codeMatch = cb.like(cb.lower(root.get("employee").get("employeeCode")), pattern);
                predicates.add(cb.or(nameMatch, codeMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<PerformanceReview> page = reviewRepository.findAll(spec, pageable);
        List<PerformanceReviewResponse> items = page.getContent().stream()
                .map(this::populateReviewResponse)
                .toList();

        return PageableUtils.of(items, filter.getPage(), filter.getSize(), page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public PerformanceReviewDetailResponse getReviewDetail(UUID reviewId) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        PerformanceReviewDetailResponse res = reviewMapper.toDetailResponse(review);

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(reviewId);
        res.setGoals(goalMapper.toResponseList(goals));

        BigDecimal totalWeight = goals.stream()
                .map(PerformanceGoal::getWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        res.setTotalWeight(totalWeight);

        populateEmployeeJobInfo(review.getEmployee(), res);

        return res;
    }

    @Transactional(readOnly = true)
    public List<PerformanceReviewResponse> getMyReviews() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UUID employeeId = employeeService.findByUserId(currentUserId).map(Employee::getId).orElse(null);
        if (employeeId == null) {
            return Collections.emptyList();
        }

        List<PerformanceReview> list = reviewRepository.findAllByEmployeeIdWithDetails(employeeId);
        return list.stream().map(this::populateReviewResponse).toList();
    }

    @Transactional
    public PerformanceGoalResponse addGoal(UUID reviewId, CreateGoalRequest request) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        if (review.getCycle().getStatus() != PerformanceCycleStatus.ACTIVE) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_CYCLE_NOT_ACTIVE);
        }

        BigDecimal currentSumWeight = goalRepository.sumWeightByReviewId(review.getId());
        BigDecimal newTotalWeight = currentSumWeight.add(request.getWeight());
        if (newTotalWeight.compareTo(new BigDecimal("100.00")) > 0) {
            throw new AppException(PerformanceErrorCode.TOTAL_WEIGHT_EXCEEDED);
        }

        Kpi kpi = null;
        if (request.getKpiId() != null) {
            kpi = kpiRepository.findById(request.getKpiId())
                    .orElseThrow(() -> new AppException(PerformanceErrorCode.KPI_NOT_FOUND));

            if (kpi.getDepartment() != null) {
                UUID empDeptId = workAssignmentRepository
                        .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(review.getEmployee().getId(), LocalDate.now())
                        .map(wa -> wa.getDepartment() != null ? wa.getDepartment().getId() : null)
                        .orElse(null);

                if (empDeptId == null || !empDeptId.equals(kpi.getDepartment().getId())) {
                    throw new AppException(PerformanceErrorCode.KPI_DEPARTMENT_MISMATCH);
                }
            }
        }

        PerformanceGoal goal = goalMapper.toEntity(request);
        goal.setReview(review);
        goal.setKpi(kpi);
        goal.setName(request.getName().trim());
        goal.setStatus(GoalStatus.NOT_STARTED);

        PerformanceGoal saved = goalRepository.save(goal);
        log.info("Added goal to review: goalId={}, reviewId={}", saved.getId(), reviewId);
        return goalMapper.toResponse(saved);
    }

    @Transactional
    public PerformanceGoalResponse updateGoal(UUID goalId, UpdateGoalRequest request) {
        PerformanceGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND));

        if (goal.getReview().getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        BigDecimal sumOtherWeights = goalRepository.sumWeightByReviewIdExcluding(goal.getReview().getId(), goalId);
        BigDecimal newTotalWeight = sumOtherWeights.add(request.getWeight());
        if (newTotalWeight.compareTo(new BigDecimal("100.00")) > 0) {
            throw new AppException(PerformanceErrorCode.TOTAL_WEIGHT_EXCEEDED);
        }

        Kpi kpi = null;
        if (request.getKpiId() != null) {
            kpi = kpiRepository.findById(request.getKpiId())
                    .orElseThrow(() -> new AppException(PerformanceErrorCode.KPI_NOT_FOUND));

            if (kpi.getDepartment() != null) {
                UUID empDeptId = workAssignmentRepository
                        .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(goal.getReview().getEmployee().getId(), LocalDate.now())
                        .map(wa -> wa.getDepartment() != null ? wa.getDepartment().getId() : null)
                        .orElse(null);

                if (empDeptId == null || !empDeptId.equals(kpi.getDepartment().getId())) {
                    throw new AppException(PerformanceErrorCode.KPI_DEPARTMENT_MISMATCH);
                }
            }
        }

        goalMapper.updateEntityFromDto(request, goal);
        goal.setKpi(kpi);
        goal.setName(request.getName().trim());

        PerformanceGoal saved = goalRepository.save(goal);
        log.info("Updated goal: id={}", saved.getId());
        return goalMapper.toResponse(saved);
    }

    @Transactional
    public void deleteGoal(UUID goalId) {
        PerformanceGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND));

        if (goal.getReview().getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        goalRepository.delete(goal);
        log.info("Deleted goal: id={}", goalId);
    }

    @Transactional
    public PerformanceGoalResponse updateGoalStatus(UUID goalId, UpdateGoalStatusRequest request) {
        PerformanceGoal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND));

        if (goal.getReview().getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        goal.setStatus(request.getStatus());

        PerformanceGoal saved = goalRepository.save(goal);
        log.info("Updated goal status: id={}, status={}", saved.getId(), saved.getStatus());
        return goalMapper.toResponse(saved);
    }

    @Transactional
    public PerformanceReviewDetailResponse saveSelfAssessment(UUID reviewId, SelfAssessmentRequest request) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        if (request.getGeneralComment() != null) {
            review.setSelfComment(request.getGeneralComment());
        }

        if (request.getGoalScores() != null) {
            Map<UUID, PerformanceGoal> goalMap = new HashMap<>();
            goalRepository.findAllByReviewIdWithKpi(reviewId).forEach(g -> goalMap.put(g.getId(), g));

            for (SelfAssessmentRequest.GoalSelfScoreItem item : request.getGoalScores()) {
                PerformanceGoal g = goalMap.get(item.getGoalId());
                if (g != null) {
                    if (item.getSelfScore() != null) {
                        g.setSelfScore(item.getSelfScore());
                    }
                    if (item.getSelfComment() != null) {
                        g.setSelfComment(item.getSelfComment());
                    }
                    goalRepository.save(g);
                }
            }
        }

        if (review.getStatus() == ReviewStatus.DRAFT) {
            review.setStatus(ReviewStatus.SELF_REVIEWED);
        }

        reviewRepository.save(review);
        log.info("Saved self assessment for review: id={}", reviewId);
        return getReviewDetail(reviewId);
    }

    @Transactional
    public PerformanceReviewDetailResponse submitSelfAssessment(UUID reviewId) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(reviewId);
        boolean hasUnrated = goals.stream().anyMatch(g -> g.getSelfScore() == null);
        if (hasUnrated) {
            throw new AppException(PerformanceErrorCode.CANNOT_FINALIZE_REVIEW);
        }

        review.setStatus(ReviewStatus.SELF_REVIEWED);
        review.setSelfSubmittedAt(LocalDateTime.now());
        reviewRepository.save(review);
        log.info("Submitted self assessment for review: id={}", reviewId);
        return getReviewDetail(reviewId);
    }

    @Transactional
    public PerformanceReviewDetailResponse saveManagerAssessment(UUID reviewId, ManagerAssessmentRequest request) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        if (request.getGeneralComment() != null) {
            review.setManagerComment(request.getGeneralComment());
        }

        if (request.getGoalScores() != null) {
            Map<UUID, PerformanceGoal> goalMap = new HashMap<>();
            goalRepository.findAllByReviewIdWithKpi(reviewId).forEach(g -> goalMap.put(g.getId(), g));

            for (ManagerAssessmentRequest.GoalManagerScoreItem item : request.getGoalScores()) {
                PerformanceGoal g = goalMap.get(item.getGoalId());
                if (g != null) {
                    if (item.getManagerScore() != null) {
                        g.setManagerScore(item.getManagerScore());
                    }
                    if (item.getManagerComment() != null) {
                        g.setManagerComment(item.getManagerComment());
                    }
                    goalRepository.save(g);
                }
            }
        }

        review.setStatus(ReviewStatus.MANAGER_REVIEWED);
        reviewRepository.save(review);
        log.info("Saved manager assessment for review: id={}", reviewId);
        return getReviewDetail(reviewId);
    }

    @Transactional
    public PerformanceReviewDetailResponse submitManagerAssessment(UUID reviewId) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(reviewId);
        if (goals.isEmpty()) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND);
        }

        boolean hasUnrated = goals.stream().anyMatch(g -> g.getManagerScore() == null);
        if (hasUnrated) {
            throw new AppException(PerformanceErrorCode.CANNOT_FINALIZE_REVIEW);
        }

        ScorePreviewResponse preview = calculateScore(review.getId(), goals);
        review.setFinalScore(preview.getCalculatedScore());
        review.setFinalRating(preview.getCalculatedRating());
        review.setStatus(ReviewStatus.MANAGER_REVIEWED);
        review.setManagerSubmittedAt(LocalDateTime.now());

        reviewRepository.save(review);
        log.info("Submitted manager assessment for review: id={}, calculatedScore={}", reviewId, preview.getCalculatedScore());
        return getReviewDetail(reviewId);
    }

    @Transactional(readOnly = true)
    public ScorePreviewResponse getScorePreview(UUID reviewId) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(reviewId);
        if (goals.isEmpty()) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND);
        }

        return calculateScore(reviewId, goals);
    }

    public ScorePreviewResponse calculateScore(UUID reviewId, List<PerformanceGoal> goals) {
        BigDecimal weightedSum = BigDecimal.ZERO;
        BigDecimal sumWeights = BigDecimal.ZERO;
        int evaluatedCount = 0;

        for (PerformanceGoal g : goals) {
            BigDecimal score = g.getManagerScore();
            if (score == null) {
                score = g.getSelfScore();
            }
            if (score != null) {
                evaluatedCount++;
                BigDecimal weight = g.getWeight() != null ? g.getWeight() : BigDecimal.ZERO;
                weightedSum = weightedSum.add(score.multiply(weight));
                sumWeights = sumWeights.add(weight);
            }
        }

        BigDecimal finalScore = BigDecimal.ZERO;
        if (sumWeights.compareTo(BigDecimal.ZERO) > 0) {
            finalScore = weightedSum.divide(sumWeights, 2, RoundingMode.HALF_UP);
        }

        PerformanceRating rating = PerformanceRating.fromScore(finalScore.doubleValue());
        boolean isReady = !goals.isEmpty() && evaluatedCount == goals.size();

        return ScorePreviewResponse.builder()
                .reviewId(reviewId)
                .calculatedScore(finalScore)
                .calculatedRating(rating)
                .totalWeight(sumWeights)
                .totalGoals(goals.size())
                .evaluatedGoalsCount(evaluatedCount)
                .isReadyToFinalize(isReady)
                .validationMessage(isReady ? "Đủ điều kiện chốt kết quả" : "Còn mục tiêu chưa được chấm điểm")
                .build();
    }

    @Transactional
    public PerformanceReviewDetailResponse finalizeReview(UUID reviewId) {
        PerformanceReview review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_NOT_FOUND));

        if (review.getStatus() == ReviewStatus.FINALIZED) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_REVIEW_ALREADY_FINALIZED);
        }

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(reviewId);
        if (goals.isEmpty()) {
            throw new AppException(PerformanceErrorCode.PERFORMANCE_GOAL_NOT_FOUND);
        }

        ScorePreviewResponse preview = calculateScore(reviewId, goals);
        if (!preview.isReadyToFinalize()) {
            throw new AppException(PerformanceErrorCode.CANNOT_FINALIZE_REVIEW);
        }

        review.setFinalScore(preview.getCalculatedScore());
        review.setFinalRating(preview.getCalculatedRating());
        review.setStatus(ReviewStatus.FINALIZED);
        review.setFinalizedAt(LocalDateTime.now());
        review.setFinalizedByUserId(SecurityUtils.getCurrentUserId());

        PerformanceReview saved = reviewRepository.save(review);
        log.info("Finalized performance review: id={}, score={}, rating={}", saved.getId(), saved.getFinalScore(), saved.getFinalRating());

        return getReviewDetail(saved.getId());
    }

    private void populateEmployeeJobInfo(Employee employee, PerformanceReviewDetailResponse res) {
        if (employee == null) return;
        workAssignmentRepository
                .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employee.getId(), LocalDate.now())
                .ifPresent(wa -> {
                    if (wa.getDepartment() != null) {
                        if (wa.getDepartment().getVersions() != null && !wa.getDepartment().getVersions().isEmpty()) {
                            res.setDepartmentName(wa.getDepartment().getVersions().get(0).getName());
                        } else {
                            res.setDepartmentName(wa.getDepartment().getCode());
                        }
                    }
                    if (wa.getJobTitle() != null) {
                        res.setJobTitleName(wa.getJobTitle().getName());
                    }
                });
    }

    private PerformanceReviewResponse populateReviewResponse(PerformanceReview review) {
        PerformanceReviewResponse res = reviewMapper.toResponse(review);

        List<PerformanceGoal> goals = goalRepository.findAllByReviewIdWithKpi(review.getId());
        res.setTotalGoals(goals.size());

        BigDecimal totalWeight = goals.stream()
                .map(PerformanceGoal::getWeight)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        res.setTotalWeight(totalWeight);

        if (review.getEmployee() != null) {
            workAssignmentRepository
                    .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(review.getEmployee().getId(), LocalDate.now())
                    .ifPresent(wa -> {
                        if (wa.getDepartment() != null) {
                            if (wa.getDepartment().getVersions() != null && !wa.getDepartment().getVersions().isEmpty()) {
                                res.setDepartmentName(wa.getDepartment().getVersions().get(0).getName());
                            } else {
                                res.setDepartmentName(wa.getDepartment().getCode());
                            }
                        }
                        if (wa.getJobTitle() != null) {
                            res.setJobTitleName(wa.getJobTitle().getName());
                        }
                    });
        }
        return res;
    }
}
