package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.request.CreateEmployeeSalaryItemRequest;
import com.cyclosa.payroll.dto.request.UpdateEmployeeSalaryItemRequest;
import com.cyclosa.payroll.dto.response.EmployeeSalaryItemResponse;
import com.cyclosa.payroll.entity.EmployeeSalaryItem;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface EmployeeSalaryItemMapper {

    @Mapping(target = "id", ignore = true)
    EmployeeSalaryItem toEntity(CreateEmployeeSalaryItemRequest request);

    void updateEntityFromDto(UpdateEmployeeSalaryItemRequest request, @MappingTarget EmployeeSalaryItem entity);

    @Mapping(target = "salaryComponentId", source = "salaryComponent.id")
    @Mapping(target = "componentCode", source = "salaryComponent.code")
    @Mapping(target = "componentName", source = "salaryComponent.name")
    @Mapping(target = "category", expression = "java(entity.getSalaryComponent() != null && entity.getSalaryComponent().getCategory() != null ? entity.getSalaryComponent().getCategory().name() : null)")
    EmployeeSalaryItemResponse toResponse(EmployeeSalaryItem entity);

    List<EmployeeSalaryItemResponse> toResponseList(List<EmployeeSalaryItem> entities);
}
