package com.cyclosa.employee.listener;

import com.cyclosa.employee.entity.enums.ProbationResult;
import com.cyclosa.employee.repository.ProbationEvaluationRepository;
import com.cyclosa.workflow.enums.RequestType;
import com.cyclosa.workflow.enums.StepDecision;
import com.cyclosa.workflow.enums.WorkflowOverallStatus;
import com.cyclosa.workflow.event.WorkflowCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class EmployeeWorkflowEventListener {

    private final ProbationEvaluationRepository probationEvaluationRepository;

    @EventListener
    @Transactional
    public void onWorkflowCompleted(WorkflowCompletedEvent event) {
        if (event.getRequestType() == RequestType.PROBATION_EVAL && event.getReferenceId() != null) {
            log.info("Nhận sự kiện phê duyệt cho Đánh giá thử việc {}: kết quả {}", event.getReferenceId(), event.getFinalDecision());

            probationEvaluationRepository.findById(event.getReferenceId()).ifPresent(eval -> {
                if (event.getFinalDecision() == StepDecision.APPROVED) {
                    eval.setStatus(WorkflowOverallStatus.APPROVED);
                    log.info("Đã chuyển trạng thái Đánh giá thử việc {} sang APPROVED", eval.getId());
                } else if (event.getFinalDecision() == StepDecision.REJECTED) {
                    eval.setStatus(WorkflowOverallStatus.REJECTED);
                    log.info("Đánh giá thử việc {} bị từ chối, chuyển sang REJECTED", eval.getId());
                }
                probationEvaluationRepository.save(eval);
            });
        }
    }
}

