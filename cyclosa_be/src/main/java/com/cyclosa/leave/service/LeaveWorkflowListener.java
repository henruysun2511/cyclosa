package com.cyclosa.leave.service;

import com.cyclosa.leave.enums.LeaveRequestStatus;
import com.cyclosa.workflow.enums.RequestType;
import com.cyclosa.workflow.enums.StepDecision;
import com.cyclosa.workflow.event.WorkflowCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LeaveWorkflowListener {

    private final LeaveRequestService leaveRequestService;

    @EventListener
    public void onWorkflowCompleted(WorkflowCompletedEvent event) {
        if (event.getRequestType() != RequestType.LEAVE_REQUEST) {
            return;
        }

        log.info("Nhận sự kiện hoàn tất Workflow cho Leave Request: referenceId={}, decision={}",
                event.getReferenceId(), event.getFinalDecision());

        LeaveRequestStatus newStatus = (event.getFinalDecision() == StepDecision.APPROVED)
                ? LeaveRequestStatus.APPROVED
                : LeaveRequestStatus.REJECTED;

        leaveRequestService.updateStatusFromWorkflow(event.getReferenceId(), newStatus, event.getComment());
    }
}

