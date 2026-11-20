package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.request.CreateSalaryHistoryRequest;
import com.cyclosa.payroll.dto.response.SalaryHistoryResponse;
import com.cyclosa.payroll.entity.SalaryHistory;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface SalaryHistoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "effectiveFrom", source = "effectiveDate")
    @Mapping(target = "baseSalary", source = "newBaseSalary")
    @Mapping(target = "insuranceSalary", source = "newInsuranceSalary")
    @Mapping(target = "decisionNo", source = "decisionNumber")
    SalaryHistory toEntity(CreateSalaryHistoryRequest request);

    SalaryHistoryResponse toResponse(SalaryHistory entity);

    List<SalaryHistoryResponse> toResponseList(List<SalaryHistory> entities);
}
