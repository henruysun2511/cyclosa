package com.cyclosa.onboarding.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.onboarding.dto.OnboardingProcessDto;
import com.cyclosa.onboarding.dto.OnboardingTaskDto;
import com.cyclosa.onboarding.entity.*;
import com.cyclosa.onboarding.enums.ItAccountRequestStatus;
import com.cyclosa.onboarding.enums.OnboardingStatus;
import com.cyclosa.onboarding.enums.OnboardingTaskGroup;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import com.cyclosa.onboarding.exception.OnboardingErrorCode;
import com.cyclosa.onboarding.mapper.OnboardingMapper;
import com.cyclosa.onboarding.repository.*;
import com.cyclosa.onboarding.repository.specification.OnboardingProcessSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OnboardingProcessService {

    private final OnboardingProcessRepository processRepository;
    private final OnboardingChecklistTemplateRepository templateRepository;
    private final OnboardingTaskRepository taskRepository;
    private final ItAccountRequestRepository itRequestRepository;
    private final OrientationSessionRepository sessionRepository;
    private final OnboardingMapper mapper;

    @Transactional
    @Auditable(
        action = AuditAction.CREATE,
        entityType = "ONBOARDING_PROCESS",
        entityIdExpression = "#result.id",
        description = "Khởi tạo tiến trình hội nhập nhân sự mới"
    )
    public OnboardingProcessDto.DetailResponse createProcess(OnboardingProcessDto.CreateRequest request) {
        if (processRepository.existsByEmployeeIdAndStatus(request.getEmployeeId(), OnboardingStatus.IN_PROGRESS)) {
            throw new AppException(OnboardingErrorCode.ACTIVE_PROCESS_ALREADY_EXISTS);
        }

        OnboardingChecklistTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TEMPLATE_NOT_FOUND));

        OnboardingProcess process = OnboardingProcess.builder()
                .employeeId(request.getEmployeeId())
                .template(template)
                .startedAt(LocalDateTime.now())
                .status(OnboardingStatus.IN_PROGRESS)
                .build();

        List<OnboardingTask> tasks = new ArrayList<>();
        if (template.getItems() != null) {
            for (OnboardingTemplateItem item : template.getItems()) {
                OnboardingTask task = OnboardingTask.builder()
                        .process(process)
                        .taskGroup(item.getTaskGroup())
                        .title(item.getTitle())
                        .description(item.getDescription())
                        .sequenceNo(item.getSequenceNo())
                        .isMandatory(item.getIsMandatory())
                        .documentTypeId(item.getDocumentTypeId())
                        .itAccountTypeId(item.getItAccountTypeId())
                        .assetCategoryId(item.getAssetCategoryId())
                        .status(OnboardingTaskStatus.PENDING)
                        .build();

                if (item.getTaskGroup() == OnboardingTaskGroup.ACCOUNTS && item.getItAccountTypeId() != null) {
                    ItAccountRequest itReq = ItAccountRequest.builder()
                            .onboardingTask(task)
                            .status(ItAccountRequestStatus.PENDING)
                            .build();
                    task.setItAccountRequest(itReq);
                }

                tasks.add(task);
            }
        }

        process.setTasks(tasks);
        OnboardingProcess saved = processRepository.save(process);
        log.info("Khởi tạo thành công tiến trình hội nhập id={} cho nhân viên id={} từ mẫu '{}'",
                saved.getId(), saved.getEmployeeId(), template.getName());

        return mapper.toDetailResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageData<OnboardingProcessDto.Response> searchProcesses(OnboardingProcessDto.FilterRequest filter) {
        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<OnboardingProcess> page = processRepository.findAll(
                OnboardingProcessSpecification.withFilters(filter.getStatus(), null),
                pageRequest
        );

        return PageData.of(page, mapper::toResponse);
    }

    @Transactional(readOnly = true)
    public OnboardingProcessDto.DetailResponse getProcessById(UUID id) {
        OnboardingProcess process = processRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.PROCESS_NOT_FOUND));
        return mapper.toDetailResponse(process);
    }

    @Transactional(readOnly = true)
    public OnboardingProcessDto.DetailResponse getProcessByEmployeeId(UUID employeeId) {
        OnboardingProcess process = processRepository.findFirstByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.PROCESS_NOT_FOUND));
        return mapper.toDetailResponse(process);
    }

    @Transactional
    @Auditable(
        action = AuditAction.APPROVE,
        entityType = "ONBOARDING_PROCESS",
        entityIdExpression = "#id",
        description = "Nghiệm thu hoàn tất tiến trình hội nhập nhân sự"
    )
    public OnboardingProcessDto.Response acceptProcess(UUID id, UUID hrEmployeeId) {
        OnboardingProcess process = processRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.PROCESS_NOT_FOUND));

        if (process.getStatus() == OnboardingStatus.COMPLETED) {
            throw new AppException(OnboardingErrorCode.PROCESS_ALREADY_COMPLETED);
        }

        boolean hasUnfinishedMandatory = taskRepository.existsByProcess_IdAndIsMandatoryTrueAndStatusNot(
                id, OnboardingTaskStatus.COMPLETED
        );

        if (hasUnfinishedMandatory) {
            throw new AppException(OnboardingErrorCode.CANNOT_ACCEPT_UNFINISHED_MANDATORY_TASKS);
        }

        process.setStatus(OnboardingStatus.COMPLETED);
        process.setCompletedAt(LocalDateTime.now());
        process.setAcceptedByEmployeeId(hrEmployeeId);

        OnboardingProcess saved = processRepository.save(process);
        log.info("HR id={} đã nghiệm thu hoàn tất tiến trình hội nhập id={}", hrEmployeeId, id);
        return mapper.toResponse(saved);
    }

    @Transactional
    @Auditable(
        action = AuditAction.REJECT,
        entityType = "ONBOARDING_PROCESS",
        entityIdExpression = "#id",
        description = "Hủy bỏ tiến trình hội nhập nhân sự"
    )
    public OnboardingProcessDto.Response cancelProcess(UUID id) {
        OnboardingProcess process = processRepository.findById(id)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.PROCESS_NOT_FOUND));

        if (process.getStatus() == OnboardingStatus.COMPLETED) {
            throw new AppException(OnboardingErrorCode.PROCESS_ALREADY_COMPLETED);
        }

        process.setStatus(OnboardingStatus.CANCELLED);
        OnboardingProcess saved = processRepository.save(process);
        log.info("Đã hủy bỏ tiến trình hội nhập id={}", id);
        return mapper.toResponse(saved);
    }

    // ── Task Operations ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OnboardingTaskDto.Response> getTasksByProcessId(UUID processId) {
        List<OnboardingTask> tasks = taskRepository.findByProcess_IdOrderBySequenceNoAsc(processId);
        return tasks.stream().map(mapper::toTaskResponse).toList();
    }

    @Transactional
    public OnboardingTaskDto.Response addAdHocTask(UUID processId, OnboardingTaskDto.CreateAdHocTaskRequest req) {
        OnboardingProcess process = processRepository.findById(processId)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.PROCESS_NOT_FOUND));

        if (process.getStatus() != OnboardingStatus.IN_PROGRESS) {
            throw new AppException(OnboardingErrorCode.PROCESS_ALREADY_COMPLETED);
        }

        List<OnboardingTask> existingTasks = taskRepository.findByProcess_IdOrderBySequenceNoAsc(processId);
        int nextSeq = existingTasks.isEmpty() ? 1 : existingTasks.get(existingTasks.size() - 1).getSequenceNo() + 1;

        OrientationSession session = null;
        if (req.getOrientationSessionId() != null) {
            session = sessionRepository.findById(req.getOrientationSessionId()).orElse(null);
        }

        OnboardingTask task = OnboardingTask.builder()
                .process(process)
                .taskGroup(req.getTaskGroup())
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .sequenceNo(nextSeq)
                .isMandatory(Boolean.TRUE.equals(req.getIsMandatory()))
                .documentTypeId(req.getDocumentTypeId())
                .itAccountTypeId(req.getItAccountTypeId())
                .assetCategoryId(req.getAssetCategoryId())
                .orientationSession(session)
                .status(OnboardingTaskStatus.PENDING)
                .build();

        if (req.getTaskGroup() == OnboardingTaskGroup.ACCOUNTS && req.getItAccountTypeId() != null) {
            ItAccountRequest itReq = ItAccountRequest.builder()
                    .onboardingTask(task)
                    .status(ItAccountRequestStatus.PENDING)
                    .build();
            task.setItAccountRequest(itReq);
        }

        OnboardingTask saved = taskRepository.save(task);
        log.info("Đã thêm công việc phát sinh id={} cho tiến trình id={}", saved.getId(), processId);
        return mapper.toTaskResponse(saved);
    }

    @Transactional
    public OnboardingTaskDto.Response completeTask(UUID taskId, UUID completedByEmployeeId) {
        OnboardingTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TASK_NOT_FOUND));

        task.setStatus(OnboardingTaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task.setCompletedByEmployeeId(completedByEmployeeId);

        OnboardingTask saved = taskRepository.save(task);
        log.info("Xác nhận hoàn thành công việc id={} bởi employeeId={}", taskId, completedByEmployeeId);
        return mapper.toTaskResponse(saved);
    }

    @Transactional
    public OnboardingTaskDto.Response skipTask(UUID taskId) {
        OnboardingTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new AppException(OnboardingErrorCode.TASK_NOT_FOUND));

        if (Boolean.TRUE.equals(task.getIsMandatory())) {
            throw new AppException(OnboardingErrorCode.CANNOT_SKIP_MANDATORY_TASK);
        }

        task.setStatus(OnboardingTaskStatus.SKIPPED);
        task.setCompletedAt(LocalDateTime.now());

        OnboardingTask saved = taskRepository.save(task);
        log.info("Đã bỏ qua công việc không bắt buộc id={}", taskId);
        return mapper.toTaskResponse(saved);
    }
}

