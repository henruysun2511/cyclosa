package com.cyclosa.onboarding.mapper;

import com.cyclosa.onboarding.dto.*;
import com.cyclosa.onboarding.entity.*;
import com.cyclosa.onboarding.enums.OnboardingTaskStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OnboardingMapper {

    // ── IT Account Type ────────────────────────────────────────────────────────

    public ItAccountType toEntity(ItAccountTypeDto.CreateRequest request) {
        if (request == null) return null;
        return ItAccountType.builder()
                .companyId(request.getCompanyId())
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();
    }

    public ItAccountTypeDto.Response toResponse(ItAccountType entity) {
        if (entity == null) return null;
        return ItAccountTypeDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .name(entity.getName())
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // ── Orientation Session ───────────────────────────────────────────────────

    public OrientationSession toEntity(OrientationSessionDto.CreateRequest request) {
        if (request == null) return null;
        return OrientationSession.builder()
                .companyId(request.getCompanyId())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation().trim())
                .trainerEmployeeId(request.getTrainerEmployeeId())
                .build();
    }

    public OrientationSessionDto.Response toResponse(OrientationSession entity) {
        if (entity == null) return null;
        return OrientationSessionDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .location(entity.getLocation())
                .trainerEmployeeId(entity.getTrainerEmployeeId())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .attendeeCount(0)
                .build();
    }

    // ── Template & Items ──────────────────────────────────────────────────────

    public OnboardingChecklistTemplate toEntity(OnboardingTemplateDto.CreateRequest request) {
        if (request == null) return null;
        OnboardingChecklistTemplate template = OnboardingChecklistTemplate.builder()
                .companyId(request.getCompanyId())
                .name(request.getName().trim())
                .departmentId(request.getDepartmentId())
                .jobTitleId(request.getJobTitleId())
                .isActive(true)
                .build();

        if (request.getItems() != null) {
            List<OnboardingTemplateItem> items = new ArrayList<>();
            for (OnboardingTemplateDto.ItemRequest ir : request.getItems()) {
                OnboardingTemplateItem item = toEntity(ir);
                item.setTemplate(template);
                items.add(item);
            }
            template.setItems(items);
        }
        return template;
    }

    public OnboardingTemplateItem toEntity(OnboardingTemplateDto.ItemRequest request) {
        if (request == null) return null;
        return OnboardingTemplateItem.builder()
                .taskGroup(request.getTaskGroup())
                .title(request.getTitle().trim())
                .description(request.getDescription())
                .sequenceNo(request.getSequenceNo())
                .isMandatory(Boolean.TRUE.equals(request.getIsMandatory()))
                .documentTypeId(request.getDocumentTypeId())
                .itAccountTypeId(request.getItAccountTypeId())
                .assetCategoryId(request.getAssetCategoryId())
                .build();
    }

    public OnboardingTemplateDto.ItemResponse toItemResponse(OnboardingTemplateItem entity) {
        if (entity == null) return null;
        return OnboardingTemplateDto.ItemResponse.builder()
                .id(entity.getId())
                .taskGroup(entity.getTaskGroup())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .sequenceNo(entity.getSequenceNo())
                .isMandatory(entity.getIsMandatory())
                .documentTypeId(entity.getDocumentTypeId())
                .itAccountTypeId(entity.getItAccountTypeId())
                .assetCategoryId(entity.getAssetCategoryId())
                .build();
    }

    public OnboardingTemplateDto.Response toResponse(OnboardingChecklistTemplate entity) {
        if (entity == null) return null;
        List<OnboardingTemplateDto.ItemResponse> itemResponses = new ArrayList<>();
        if (entity.getItems() != null) {
            for (OnboardingTemplateItem item : entity.getItems()) {
                itemResponses.add(toItemResponse(item));
            }
        }

        return OnboardingTemplateDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .name(entity.getName())
                .departmentId(entity.getDepartmentId())
                .jobTitleId(entity.getJobTitleId())
                .isActive(entity.getIsActive())
                .itemCount(itemResponses.size())
                .items(itemResponses)
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // ── Tasks & Processes ─────────────────────────────────────────────────────

    public OnboardingTaskDto.Response toTaskResponse(OnboardingTask task) {
        if (task == null) return null;
        String itAccountIdentifier = null;
        var itReqStatus = task.getItAccountRequest() != null ? task.getItAccountRequest().getStatus() : null;
        if (task.getItAccountRequest() != null) {
            itAccountIdentifier = task.getItAccountRequest().getAccountIdentifier();
        }

        return OnboardingTaskDto.Response.builder()
                .id(task.getId())
                .processId(task.getProcess() != null ? task.getProcess().getId() : null)
                .taskGroup(task.getTaskGroup())
                .title(task.getTitle())
                .description(task.getDescription())
                .sequenceNo(task.getSequenceNo())
                .isMandatory(task.getIsMandatory())
                .documentTypeId(task.getDocumentTypeId())
                .itAccountTypeId(task.getItAccountTypeId())
                .assetCategoryId(task.getAssetCategoryId())
                .orientationSessionId(task.getOrientationSession() != null ? task.getOrientationSession().getId() : null)
                .orientationSessionTitle(task.getOrientationSession() != null ? task.getOrientationSession().getTitle() : null)
                .status(task.getStatus())
                .completedAt(task.getCompletedAt())
                .completedByEmployeeId(task.getCompletedByEmployeeId())
                .itAccountIdentifier(itAccountIdentifier)
                .itRequestStatus(itReqStatus)
                .build();
    }

    public OnboardingProcessDto.Response toResponse(OnboardingProcess process) {
        if (process == null) return null;
        int total = process.getTasks() != null ? process.getTasks().size() : 0;
        int completed = 0;
        if (process.getTasks() != null) {
            for (OnboardingTask t : process.getTasks()) {
                if (t.getStatus() == OnboardingTaskStatus.COMPLETED) {
                    completed++;
                }
            }
        }
        int percent = total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0;

        return OnboardingProcessDto.Response.builder()
                .id(process.getId())
                .employeeId(process.getEmployeeId())
                .templateId(process.getTemplate() != null ? process.getTemplate().getId() : null)
                .templateName(process.getTemplate() != null ? process.getTemplate().getName() : null)
                .startedAt(process.getStartedAt())
                .status(process.getStatus())
                .completedAt(process.getCompletedAt())
                .acceptedByEmployeeId(process.getAcceptedByEmployeeId())
                .totalTasks(total)
                .completedTasks(completed)
                .progressPercent(percent)
                .build();
    }

    public OnboardingProcessDto.DetailResponse toDetailResponse(OnboardingProcess process) {
        if (process == null) return null;
        OnboardingProcessDto.Response summary = toResponse(process);
        List<OnboardingTaskDto.Response> taskResponses = new ArrayList<>();
        if (process.getTasks() != null) {
            for (OnboardingTask t : process.getTasks()) {
                taskResponses.add(toTaskResponse(t));
            }
        }

        return OnboardingProcessDto.DetailResponse.builder()
                .summary(summary)
                .tasks(taskResponses)
                .build();
    }

    // ── IT Account Request ────────────────────────────────────────────────────

    public ItAccountRequestDto.Response toResponse(ItAccountRequest req) {
        if (req == null) return null;
        OnboardingTask task = req.getOnboardingTask();
        return ItAccountRequestDto.Response.builder()
                .id(req.getId())
                .onboardingTaskId(task != null ? task.getId() : null)
                .taskTitle(task != null ? task.getTitle() : null)
                .processId(task != null && task.getProcess() != null ? task.getProcess().getId() : null)
                .employeeId(task != null && task.getProcess() != null ? task.getProcess().getEmployeeId() : null)
                .itAccountTypeId(task != null ? task.getItAccountTypeId() : null)
                .status(req.getStatus())
                .accountIdentifier(req.getAccountIdentifier())
                .handledAt(req.getHandledAt())
                .failureReason(req.getFailureReason())
                .createdAt(req.getCreatedAt())
                .build();
    }
}

