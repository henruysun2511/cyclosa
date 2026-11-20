package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.ApplicationDto;
import com.cyclosa.recruitment.entity.Application;
import com.cyclosa.recruitment.enums.ApplicationStage;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ApplicationMapper {

    public Application toEntity(ApplicationDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        return Application.builder()
                .appliedAt(LocalDateTime.now())
                .currentStage(ApplicationStage.APPLIED)
                .referrerEmployeeId(request.getReferrerId())
                .build();
    }

    public ApplicationDto.Response toResponse(Application entity) {
        if (entity == null) {
            return null;
        }

        return ApplicationDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getJobOpening() != null ? entity.getJobOpening().getCompanyId() : null)
                .applicationCode(entity.getId() != null ? "APP-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .jobOpeningId(entity.getJobOpening() != null ? entity.getJobOpening().getId() : null)
                .candidateId(entity.getCandidate() != null ? entity.getCandidate().getId() : null)
                .candidateName(entity.getCandidate() != null ? entity.getCandidate().getFullName() : null)
                .candidateEmail(entity.getCandidate() != null ? entity.getCandidate().getEmail() : null)
                .candidatePhone(entity.getCandidate() != null ? entity.getCandidate().getPhone() : null)
                .channelId(entity.getSourceChannel() != null ? entity.getSourceChannel().getId() : null)
                .referrerId(entity.getReferrerEmployeeId())
                .currentStage(entity.getCurrentStage())
                .aiMatchingScore(entity.getAiMatchScore())
                .aiSummary(entity.getAiMatchReasoning())
                .aiScreenedAt(entity.getAiScreenedAt())
                .isRejected(entity.getRejectionReason() != null)
                .rejectionReason(entity.getRejectionReason())
                .rejectedAt(entity.getRejectionReason() != null ? entity.getUpdatedAt() : null)
                .isWithdrawn(false)
                .withdrawalReason(null)
                .withdrawnAt(null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
