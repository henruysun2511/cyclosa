package com.cyclosa.audit.mapper;

import com.cyclosa.audit.dto.response.AuditLogDetailResponse;
import com.cyclosa.audit.dto.response.AuditLogResponse;
import com.cyclosa.audit.dto.response.AuditTrailEventResponse;
import com.cyclosa.audit.entity.AuditLog;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface AuditLogMapper {

    @Mapping(target = "actor", ignore = true)
    @Mapping(target = "entityReference", ignore = true)
    AuditLogResponse toResponse(AuditLog log);

    @Mapping(target = "actor", ignore = true)
    @Mapping(target = "oldValue", ignore = true)
    @Mapping(target = "newValue", ignore = true)
    @Mapping(target = "changedFields", ignore = true)
    AuditLogDetailResponse toDetailResponse(AuditLog log);

    @Mapping(target = "logId", source = "id")
    @Mapping(target = "actorName", ignore = true)
    AuditTrailEventResponse toTimelineEvent(AuditLog log);
}

