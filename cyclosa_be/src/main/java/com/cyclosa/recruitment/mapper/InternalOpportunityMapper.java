package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.InternalOpportunityDto;
import com.cyclosa.recruitment.entity.InternalOpportunity;
import com.cyclosa.recruitment.entity.InternalOpportunityApplication;
import com.cyclosa.recruitment.enums.InternalOpportunityStatus;
import com.cyclosa.recruitment.enums.InternalOpportunityType;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class InternalOpportunityMapper {

    public InternalOpportunity toEntity(InternalOpportunityDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        return InternalOpportunity.builder()
                .companyId(request.getCompanyId())
                .title(request.getTitle())
                .type(request.getOpportunityType() != null ? request.getOpportunityType() : InternalOpportunityType.OPEN_POSITION)
                .description(request.getDescription() != null ? request.getDescription() : "")
                .startDate(LocalDate.now())
                .endDate(request.getDeadline())
                .status(InternalOpportunityStatus.OPEN)
                .build();
    }

    public InternalOpportunityDto.Response toResponse(InternalOpportunity entity) {
        if (entity == null) {
            return null;
        }

        return InternalOpportunityDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .opportunityCode(entity.getId() != null ? "OPP-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .jobOpeningId(entity.getJobOpening() != null ? entity.getJobOpening().getId() : null)
                .title(entity.getTitle())
                .opportunityType(entity.getType())
                .description(entity.getDescription())
                .deadline(entity.getEndDate())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public InternalOpportunityDto.ApplicationResponse toApplicationResponse(InternalOpportunityApplication entity) {
        if (entity == null) {
            return null;
        }

        return InternalOpportunityDto.ApplicationResponse.builder()
                .id(entity.getId())
                .opportunityId(entity.getOpportunity() != null ? entity.getOpportunity().getId() : null)
                .employeeId(entity.getEmployeeId())
                .motivationLetter(entity.getMotivation())
                .status(entity.getStatus())
                .appliedAt(entity.getCreatedAt())
                .build();
    }
}
