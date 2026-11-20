package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.JobOpeningDto;
import com.cyclosa.recruitment.entity.InterviewCriterion;
import com.cyclosa.recruitment.entity.InterviewQuestion;
import com.cyclosa.recruitment.entity.InterviewRound;
import com.cyclosa.recruitment.entity.JobOpening;
import com.cyclosa.recruitment.enums.JobOpeningStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
public class JobOpeningMapper {

    public JobOpening toEntity(JobOpeningDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        String slug = request.getTitle() != null
                ? request.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + UUID.randomUUID().toString().substring(0, 6)
                : UUID.randomUUID().toString();

        return JobOpening.builder()
                .companyId(request.getCompanyId())
                .recruitmentRequestId(request.getRecruitmentRequestId())
                .departmentId(request.getDepartmentId())
                .jobTitleId(request.getPositionId() != null ? request.getPositionId() : request.getDepartmentId())
                .title(request.getTitle())
                .requiredQuantity(request.getTargetQuantity() != null ? request.getTargetQuantity() : 1)
                .description(request.getJobDescription() != null ? request.getJobDescription() : "")
                .requirements(request.getRequirements() != null ? request.getRequirements() : "")
                .requirementsVersion(1)
                .benefits(request.getBenefits())
                .salaryBandMin(request.getSalaryRangeMin())
                .salaryBandMax(request.getSalaryRangeMax())
                .isSalaryNegotiable(request.getIsSalaryNegotiable() != null ? request.getIsSalaryNegotiable() : true)
                .workLocation(request.getWorkLocation())
                .deadlineDate(request.getClosingDate() != null ? request.getClosingDate() : LocalDate.now().plusMonths(1))
                .landingSlug(slug)
                .status(JobOpeningStatus.DRAFT)
                .build();
    }

    public JobOpeningDto.Response toResponse(JobOpening entity) {
        if (entity == null) {
            return null;
        }

        return JobOpeningDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .jobCode(entity.getId() != null ? "JOB-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .recruitmentRequestId(entity.getRecruitmentRequestId())
                .departmentId(entity.getDepartmentId())
                .positionId(entity.getJobTitleId())
                .title(entity.getTitle())
                .targetQuantity(entity.getRequiredQuantity())
                .hiredQuantity(0)
                .jobDescription(entity.getDescription())
                .requirements(entity.getRequirements())
                .benefits(entity.getBenefits())
                .salaryRangeMin(entity.getSalaryBandMin())
                .salaryRangeMax(entity.getSalaryBandMax())
                .isSalaryNegotiable(entity.getIsSalaryNegotiable())
                .workLocation(entity.getWorkLocation())
                .publishDate(entity.getCreatedAt() != null ? entity.getCreatedAt().toLocalDate() : null)
                .closingDate(entity.getDeadlineDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDto(JobOpeningDto.UpdateRequest request, JobOpening entity) {
        if (request == null || entity == null) {
            return;
        }

        if (request.getTitle() != null) entity.setTitle(request.getTitle());
        if (request.getTargetQuantity() != null) entity.setRequiredQuantity(request.getTargetQuantity());
        if (request.getJobDescription() != null) entity.setDescription(request.getJobDescription());
        if (request.getRequirements() != null) entity.setRequirements(request.getRequirements());
        if (request.getBenefits() != null) entity.setBenefits(request.getBenefits());
        if (request.getSalaryRangeMin() != null) entity.setSalaryBandMin(request.getSalaryRangeMin());
        if (request.getSalaryRangeMax() != null) entity.setSalaryBandMax(request.getSalaryRangeMax());
        if (request.getIsSalaryNegotiable() != null) entity.setIsSalaryNegotiable(request.getIsSalaryNegotiable());
        if (request.getWorkLocation() != null) entity.setWorkLocation(request.getWorkLocation());
        if (request.getClosingDate() != null) entity.setDeadlineDate(request.getClosingDate());
        if (request.getStatus() != null) entity.setStatus(request.getStatus());
    }

    public JobOpeningDto.RoundResponse toRoundResponse(InterviewRound entity) {
        if (entity == null) return null;
        return JobOpeningDto.RoundResponse.builder()
                .id(entity.getId())
                .roundOrder(entity.getRoundNo())
                .name(entity.getName())
                .roundType(entity.getRoundType())
                .description(entity.getDescription())
                .build();
    }

    public JobOpeningDto.CriterionResponse toCriterionResponse(InterviewCriterion entity) {
        if (entity == null) return null;
        return JobOpeningDto.CriterionResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .weight(entity.getWeight())
                .maxScore(entity.getMaxScore())
                .build();
    }

    public JobOpeningDto.QuestionResponse toQuestionResponse(InterviewQuestion entity) {
        if (entity == null) return null;
        return JobOpeningDto.QuestionResponse.builder()
                .id(entity.getId())
                .questionText(entity.getQuestionText())
                .category("INTERVIEW")
                .sampleAnswer(entity.getExpectedAnswerGuideline())
                .build();
    }
}
