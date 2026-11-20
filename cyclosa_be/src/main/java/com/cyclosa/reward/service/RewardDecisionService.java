package com.cyclosa.reward.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.payroll.service.PayrollRecordService;
import com.cyclosa.reward.dto.request.CreateRewardDecisionRequest;
import com.cyclosa.reward.dto.request.RewardDecisionFilter;
import com.cyclosa.reward.dto.request.UpdateRewardDecisionRequest;
import com.cyclosa.reward.dto.response.RewardDecisionResponse;
import com.cyclosa.reward.entity.RewardDecision;
import com.cyclosa.reward.enums.RewardType;
import com.cyclosa.reward.exception.RewardDisciplineErrorCode;
import com.cyclosa.reward.mapper.RewardDecisionMapper;
import com.cyclosa.reward.repository.RewardDecisionRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RewardDecisionService {

    private final RewardDecisionRepository rewardDecisionRepository;
    private final EmployeeRepository employeeRepository;
    private final RewardDecisionMapper rewardDecisionMapper;
    private final PayrollRecordService payrollRecordService;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "decisionDate", "createdAt", "amount", "title", "rewardType"
    );

    @Transactional(readOnly = true)
    public PageData<RewardDecisionResponse> getRewardDecisions(RewardDecisionFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("decisionDate", ALLOWED_SORT_FIELDS);

        Specification<RewardDecision> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employee").get("id"), filter.getEmployeeId()));
            }
            if (filter.getRewardType() != null) {
                predicates.add(cb.equal(root.get("rewardType"), filter.getRewardType()));
            }
            if (filter.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("decisionDate"), filter.getFrom()));
            }
            if (filter.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("decisionDate"), filter.getTo()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String kw = "%" + PageableUtils.normalizeKeyword(filter.getKeyword()) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), kw),
                        cb.like(cb.lower(root.get("employee").get("lastName")), kw),
                        cb.like(cb.lower(root.get("employee").get("firstName")), kw),
                        cb.like(cb.lower(root.get("employee").get("employeeCode")), kw)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<RewardDecision> page = rewardDecisionRepository.findAll(spec, pageable);
        return PageData.of(page, this::enrichRewardResponse);
    }

    @Transactional(readOnly = true)
    public RewardDecisionResponse getRewardDecisionById(UUID decisionId) {
        RewardDecision decision = rewardDecisionRepository.findById(decisionId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.REWARD_DECISION_NOT_FOUND));
        return enrichRewardResponse(decision);
    }

    @Transactional
    public RewardDecisionResponse createRewardDecision(CreateRewardDecisionRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();

        if (request.getRewardType() == RewardType.MONETARY_BONUS) {
            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new AppException(RewardDisciplineErrorCode.INVALID_REWARD_AMOUNT);
            }
        } else {
            if (request.getAmount() != null) {
                throw new AppException(RewardDisciplineErrorCode.REWARD_AMOUNT_NOT_ALLOWED);
            }
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên được khen thưởng"));

        Employee decidedBy = employeeRepository.findById(request.getDecidedByEmployeeId())
                .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên ký quyết định"));

        RewardDecision entity = rewardDecisionMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setEmployee(employee);
        entity.setDecidedByEmployee(decidedBy);

        RewardDecision saved = rewardDecisionRepository.save(entity);
        return enrichRewardResponse(saved);
    }

    @Transactional
    public RewardDecisionResponse updateRewardDecision(UUID decisionId, UpdateRewardDecisionRequest request) {
        RewardDecision decision = rewardDecisionRepository.findById(decisionId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.REWARD_DECISION_NOT_FOUND));

        if (payrollRecordService.isRewardPushedToPayroll(decisionId)) {
            throw new AppException(RewardDisciplineErrorCode.REWARD_ALREADY_PUSHED_TO_PAYROLL);
        }

        if (request.getRewardType() != null) {
            if (request.getRewardType() == RewardType.MONETARY_BONUS) {
                if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new AppException(RewardDisciplineErrorCode.INVALID_REWARD_AMOUNT);
                }
            } else {
                request.setAmount(null);
            }
        }

        rewardDecisionMapper.updateEntityFromDto(request, decision);

        if (request.getDecidedByEmployeeId() != null) {
            Employee decidedBy = employeeRepository.findById(request.getDecidedByEmployeeId())
                    .orElseThrow(() -> AppException.notFound("Không tìm thấy nhân viên ký quyết định"));
            decision.setDecidedByEmployee(decidedBy);
        }

        RewardDecision saved = rewardDecisionRepository.save(decision);
        return enrichRewardResponse(saved);
    }

    @Transactional
    public void deleteRewardDecision(UUID decisionId) {
        RewardDecision decision = rewardDecisionRepository.findById(decisionId)
                .orElseThrow(() -> new AppException(RewardDisciplineErrorCode.REWARD_DECISION_NOT_FOUND));

        if (payrollRecordService.isRewardPushedToPayroll(decisionId)) {
            throw new AppException(RewardDisciplineErrorCode.REWARD_ALREADY_PUSHED_TO_PAYROLL);
        }

        rewardDecisionRepository.delete(decision);
    }

    @Transactional(readOnly = true)
    public List<RewardDecisionResponse> getMyRewardDecisions() {
        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional()
                .orElseThrow(() -> AppException.unauthorized("Chưa đăng nhập"));

        Employee employee = employeeRepository.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản này"));

        List<RewardDecision> list = rewardDecisionRepository.findAllByEmployeeIdOrderByDecisionDateDesc(employee.getId());
        return list.stream().map(this::enrichRewardResponse).toList();
    }

    private RewardDecisionResponse enrichRewardResponse(RewardDecision decision) {
        RewardDecisionResponse resp = rewardDecisionMapper.toResponse(decision);
        boolean pushed = payrollRecordService.isRewardPushedToPayroll(decision.getId());
        resp.setPushedToPayroll(pushed);
        return resp;
    }
}
