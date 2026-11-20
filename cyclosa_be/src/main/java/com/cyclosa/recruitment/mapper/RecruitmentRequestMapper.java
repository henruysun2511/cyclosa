package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.RecruitmentRequestDto;
import com.cyclosa.recruitment.entity.RecruitmentRequest;
import com.cyclosa.recruitment.enums.RecruitmentRequestStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RecruitmentRequestMapper {

    public RecruitmentRequest toEntity(RecruitmentRequestDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        return RecruitmentRequest.builder()
                .companyId(request.getCompanyId())
                .departmentId(request.getDepartmentId())
                .jobTitleId(request.getPositionId() != null ? request.getPositionId() : request.getDepartmentId())
                .requestedQuantity(request.getQuantity())
                .justification(request.getReason() != null ? request.getReason() : (request.getTitle() != null ? request.getTitle() : "Yêu cầu tuyển dụng"))
                .targetStartDate(request.getTargetDate())
                .requestedByEmployeeId(request.getCompanyId())
                .requestedAt(LocalDateTime.now())
                .status(RecruitmentRequestStatus.PENDING_APPROVAL)
                .build();
    }

    public RecruitmentRequestDto.Response toResponse(RecruitmentRequest entity) {
        if (entity == null) {
            return null;
        }

        return RecruitmentRequestDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .requestCode(entity.getId() != null ? "REQ-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .requesterId(entity.getRequestedByEmployeeId())
                .departmentId(entity.getDepartmentId())
                .positionId(entity.getJobTitleId())
                .title(entity.getJustification())
                .quantity(entity.getRequestedQuantity())
                .reason(entity.getJustification())
                .targetDate(entity.getTargetStartDate())
                .status(entity.getStatus())
                .workflowRequestId(null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDto(RecruitmentRequestDto.UpdateRequest request, RecruitmentRequest entity) {
        if (request == null || entity == null) {
            return;
        }

        if (request.getQuantity() != null) {
            entity.setRequestedQuantity(request.getQuantity());
        }
        if (request.getReason() != null) {
            entity.setJustification(request.getReason());
        }
        if (request.getTargetDate() != null) {
            entity.setTargetStartDate(request.getTargetDate());
        }
    }
}
