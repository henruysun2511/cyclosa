package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.RetentionPolicyDto;
import com.cyclosa.document.entity.RetentionPolicy;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class RetentionPolicyMapper {

    public RetentionPolicy toEntity(RetentionPolicyDto.CreateRequest request, UUID companyId) {
        if (request == null) return null;
        return RetentionPolicy.builder()
                .companyId(companyId)
                .name(request.getName().trim())
                .description(request.getDescription())
                .retentionMonths(request.getRetentionMonths())
                .startEvent(request.getStartEvent())
                .isActive(true)
                .build();
    }

    public void updateEntity(RetentionPolicy entity, RetentionPolicyDto.UpdateRequest request) {
        if (entity == null || request == null) return;
        entity.setName(request.getName().trim());
        entity.setDescription(request.getDescription());
        entity.setRetentionMonths(request.getRetentionMonths());
        entity.setStartEvent(request.getStartEvent());
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }
    }

    public RetentionPolicyDto.Response toResponse(RetentionPolicy entity) {
        if (entity == null) return null;
        return RetentionPolicyDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .name(entity.getName())
                .description(entity.getDescription())
                .retentionMonths(entity.getRetentionMonths())
                .startEvent(entity.getStartEvent())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public List<RetentionPolicyDto.Response> toResponseList(List<RetentionPolicy> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
