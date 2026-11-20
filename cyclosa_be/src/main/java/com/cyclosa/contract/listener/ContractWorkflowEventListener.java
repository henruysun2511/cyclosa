package com.cyclosa.contract.listener;

import com.cyclosa.contract.entity.Contract;
import com.cyclosa.contract.entity.ContractAppendix;
import com.cyclosa.contract.entity.enums.ContractStatus;
import com.cyclosa.contract.repository.ContractAppendixRepository;
import com.cyclosa.contract.repository.ContractRepository;
import com.cyclosa.workflow.enums.RequestType;
import com.cyclosa.workflow.enums.StepDecision;
import com.cyclosa.workflow.event.WorkflowCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class ContractWorkflowEventListener {

    private final ContractRepository contractRepository;
    private final ContractAppendixRepository appendixRepository;

    @EventListener
    @Transactional
    public void onWorkflowCompleted(WorkflowCompletedEvent event) {
        if (event.getRequestType() == RequestType.CONTRACT && event.getReferenceId() != null) {
            log.info("Nhận sự kiện phê duyệt cho Hợp đồng {}: kết quả {}", event.getReferenceId(), event.getFinalDecision());

            contractRepository.findById(event.getReferenceId()).ifPresent(contract -> {
                if (event.getFinalDecision() == StepDecision.APPROVED) {
                    contract.setStatus(ContractStatus.APPROVED);
                    log.info("Đã chuyển trạng thái Hợp đồng {} sang APPROVED", contract.getContractNo());
                } else if (event.getFinalDecision() == StepDecision.REJECTED) {
                    contract.setStatus(ContractStatus.DRAFT);
                    log.info("Hợp đồng {} bị từ chối phê duyệt, chuyển về DRAFT", contract.getContractNo());
                }
                contractRepository.save(contract);
            });
        }

        if (event.getRequestType() == RequestType.CONTRACT_APPENDIX && event.getReferenceId() != null) {
            log.info("Nhận sự kiện phê duyệt cho Phụ lục Hợp đồng {}: kết quả {}", event.getReferenceId(), event.getFinalDecision());

            appendixRepository.findById(event.getReferenceId()).ifPresent(appendix -> {
                if (event.getFinalDecision() == StepDecision.APPROVED) {
                    appendix.setStatus(ContractStatus.APPROVED);
                    log.info("Đã chuyển trạng thái Phụ lục HĐ số {} sang APPROVED", appendix.getAppendixNo());
                } else if (event.getFinalDecision() == StepDecision.REJECTED) {
                    appendix.setStatus(ContractStatus.DRAFT);
                    log.info("Phụ lục HĐ số {} bị từ chối phê duyệt, chuyển về DRAFT", appendix.getAppendixNo());
                }
                appendixRepository.save(appendix);
            });
        }
    }
}

