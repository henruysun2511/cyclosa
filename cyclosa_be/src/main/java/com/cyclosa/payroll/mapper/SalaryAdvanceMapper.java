package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.request.CreateSalaryAdvanceRequest;
import com.cyclosa.payroll.dto.response.SalaryAdvanceResponse;
import com.cyclosa.payroll.entity.SalaryAdvance;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface SalaryAdvanceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "status", constant = "PENDING_APPROVAL")
    @Mapping(target = "requestedAt", expression = "java(java.time.LocalDateTime.now())")
    SalaryAdvance toEntity(CreateSalaryAdvanceRequest request);

    SalaryAdvanceResponse toResponse(SalaryAdvance entity);

    List<SalaryAdvanceResponse> toResponseList(List<SalaryAdvance> entities);
}
