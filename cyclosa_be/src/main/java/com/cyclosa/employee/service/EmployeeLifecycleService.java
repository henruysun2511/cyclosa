package com.cyclosa.employee.service;

import com.cyclosa.auth.service.UserService;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.employee.dto.request.ChangeStatusRequest;
import com.cyclosa.employee.dto.request.CreateProbationEvaluationRequest;
import com.cyclosa.employee.dto.response.OfficialEligibilityResponse;
import com.cyclosa.employee.dto.response.ProbationEvaluationResponse;
import com.cyclosa.employee.dto.response.StatusHistoryResponse;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeStatusHistory;
import com.cyclosa.employee.entity.ProbationEvaluation;
import com.cyclosa.employee.entity.enums.EmployeeStatus;
import com.cyclosa.employee.entity.enums.ProbationResult;
import com.cyclosa.employee.exception.EmployeeErrorCode;
import com.cyclosa.employee.mapper.EmployeeMapper;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeStatusHistoryRepository;
import com.cyclosa.employee.repository.ProbationEvaluationRepository;
import com.cyclosa.workflow.dto.request.SubmitWorkflowRequest;
import com.cyclosa.workflow.enums.RequestType;
import com.cyclosa.workflow.enums.WorkflowOverallStatus;
import com.cyclosa.workflow.service.WorkflowExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeLifecycleService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeStatusHistoryRepository statusHistoryRepository;
    private final ProbationEvaluationRepository probationEvaluationRepository;
    private final UserService userService;
    private final EmployeeMapper employeeMapper;
    private final WorkflowExecutionService workflowExecutionService;

    public List<StatusHistoryResponse> getStatusHistory(UUID employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND);
        }
        return statusHistoryRepository.findAllByEmployeeIdOrderByEffectiveFromDesc(employeeId)
                .stream()
                .map(employeeMapper::toStatusHistoryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StatusHistoryResponse changeStatus(UUID employeeId, ChangeStatusRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        LocalDate today = LocalDate.now();
        EmployeeStatus currentStatus = statusHistoryRepository
                .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employeeId, today)
                .map(EmployeeStatusHistory::getStatus)
                .orElse(EmployeeStatus.ACTIVE);

        if (currentStatus == EmployeeStatus.TERMINATED) {
            throw new AppException(EmployeeErrorCode.EMPLOYEE_ALREADY_TERMINATED);
        }

        EmployeeStatusHistory history = EmployeeStatusHistory.builder()
                .employee(employee)
                .status(request.getStatus())
                .effectiveFrom(request.getEffectiveFrom())
                .note(request.getNote())
                .build();

        EmployeeStatusHistory saved = statusHistoryRepository.save(history);

        // Nếu chuyển sang trạng thái Thôi việc (TERMINATED) -> khóa tài khoản User đăng nhập
        if (request.getStatus() == EmployeeStatus.TERMINATED && employee.getUserId() != null) {
            userService.lockUser(employee.getUserId());
        }

        return employeeMapper.toStatusHistoryResponse(saved);
    }

    public List<ProbationEvaluationResponse> getProbationEvaluations(UUID employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND);
        }
        return probationEvaluationRepository.findAllByEmployeeIdOrderByEvaluationDateDesc(employeeId)
                .stream()
                .map(employeeMapper::toProbationEvaluationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProbationEvaluationResponse createProbationEvaluation(UUID employeeId, CreateProbationEvaluationRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        Employee evaluator = employeeRepository.findById(request.getEvaluatedByEmployeeId())
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        ProbationEvaluation eval = ProbationEvaluation.builder()
                .employee(employee)
                .result(request.getResult())
                .status(WorkflowOverallStatus.PENDING)
                .evaluationDate(request.getEvaluationDate())
                .evaluatedBy(evaluator)
                .comment(request.getComment())
                .build();

        ProbationEvaluation saved = probationEvaluationRepository.save(eval);

        if (employee.getCompanyId() != null) {
            String resultText = request.getResult() == ProbationResult.PASSED ? "Đạt thử việc (PASSED)"
                    : request.getResult() == ProbationResult.FAILED ? "Không đạt (FAILED)" : "Kéo dài thử việc (EXTENDED)";
            workflowExecutionService.submit(SubmitWorkflowRequest.builder()
                    .companyId(employee.getCompanyId())
                    .requestType(RequestType.PROBATION_EVAL)
                    .referenceId(saved.getId())
                    .referenceCode("DGTV-" + employee.getEmployeeCode())
                    .title("Đánh giá kết quả thử việc: " + employee.getFullName() + " (" + employee.getEmployeeCode() + ") - " + resultText)
                    .requesterEmployeeId(evaluator.getId())
                    .build());
        }

        return employeeMapper.toProbationEvaluationResponse(saved);
    }

    /**
     * Thẩm định điều kiện chuyển chính thức
     */
    public OfficialEligibilityResponse checkOfficialEligibility(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        LocalDate today = LocalDate.now();
        EmployeeStatus currentStatus = statusHistoryRepository
                .findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(employeeId, today)
                .map(EmployeeStatusHistory::getStatus)
                .orElse(EmployeeStatus.ACTIVE);

        if (currentStatus != EmployeeStatus.PROBATION) {
            return OfficialEligibilityResponse.builder()
                    .employeeId(employeeId)
                    .eligible(false)
                    .reason("Nhân viên hiện không ở trạng thái Thử việc (PROBATION).")
                    .build();
        }

        boolean hasPassed = probationEvaluationRepository
                .findTopByEmployeeIdOrderByEvaluationDateDesc(employeeId)
                .map(e -> e.getResult() == ProbationResult.PASSED && e.getStatus() == WorkflowOverallStatus.APPROVED)
                .orElse(false);

        boolean eligible = hasPassed;
        String reason = eligible
                ? "Đủ điều kiện chuyển nhân viên chính thức (Đã hoàn tất phê duyệt đánh giá thử việc đạt)."
                : "Chưa đạt đánh giá thử việc hoặc biên bản đánh giá chưa được phê duyệt hoàn tất.";

        return OfficialEligibilityResponse.builder()
                .employeeId(employeeId)
                .eligible(eligible)
                .hasPassedEvaluation(hasPassed)
                .isOnboardingCompleted(true)
                .hasOfficialContract(true)
                .reason(reason)
                .build();
    }

    /**
     * Xác nhận chuyển chính thức
     */
    @Transactional
    public StatusHistoryResponse confirmOfficial(UUID employeeId) {
        OfficialEligibilityResponse eligibility = checkOfficialEligibility(employeeId);
        if (!eligibility.isEligible()) {
            throw new AppException(EmployeeErrorCode.PROBATION_NOT_PASSED);
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        LocalDate today = LocalDate.now();
        EmployeeStatusHistory history = EmployeeStatusHistory.builder()
                .employee(employee)
                .status(EmployeeStatus.ACTIVE)
                .effectiveFrom(today)
                .note("Hoàn thành thử việc xuất sắc, chính thức tiếp nhận vào công ty")
                .build();

        return employeeMapper.toStatusHistoryResponse(statusHistoryRepository.save(history));
    }
}

