package com.cyclosa.recruitment.mapper;

import com.cyclosa.recruitment.dto.OfferDto;
import com.cyclosa.recruitment.entity.Offer;
import com.cyclosa.recruitment.entity.OfferAllowance;
import com.cyclosa.recruitment.enums.OfferStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OfferMapper {

    public Offer toEntity(OfferDto.CreateRequest request) {
        if (request == null) {
            return null;
        }

        return Offer.builder()
                .baseSalary(request.getBaseSalary())
                .expectedStartDate(request.getStartDate())
                .responseDeadline(request.getExpiryDate() != null ? request.getExpiryDate().atTime(23, 59, 59) : LocalDateTime.now().plusDays(7))
                .status(OfferStatus.DRAFT)
                .build();
    }

    public OfferDto.Response toResponse(Offer entity) {
        if (entity == null) {
            return null;
        }

        return OfferDto.Response.builder()
                .id(entity.getId())
                .companyId(null)
                .offerCode(entity.getId() != null ? "OFF-" + entity.getId().toString().substring(0, 8).toUpperCase() : null)
                .applicationId(entity.getApplication() != null ? entity.getApplication().getId() : null)
                .candidateId(entity.getApplication() != null && entity.getApplication().getCandidate() != null ? entity.getApplication().getCandidate().getId() : null)
                .baseSalary(entity.getBaseSalary())
                .currency("VND")
                .startDate(entity.getExpectedStartDate())
                .expiryDate(entity.getResponseDeadline() != null ? entity.getResponseDeadline().toLocalDate() : null)
                .status(entity.getStatus())
                .declineReason(entity.getDeclineReason())
                .declineNotes(entity.getDeclineNote())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public OfferDto.AllowanceDto toAllowanceDto(OfferAllowance entity) {
        if (entity == null) {
            return null;
        }

        return OfferDto.AllowanceDto.builder()
                .id(entity.getId())
                .name(entity.getAllowanceType())
                .amount(entity.getAmount())
                .taxable(false)
                .build();
    }
}
