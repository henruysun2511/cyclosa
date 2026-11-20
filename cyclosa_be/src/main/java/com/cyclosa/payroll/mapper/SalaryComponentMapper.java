package com.cyclosa.payroll.mapper;

import com.cyclosa.payroll.dto.request.CreateSalaryComponentRequest;
import com.cyclosa.payroll.dto.request.UpdateSalaryComponentRequest;
import com.cyclosa.payroll.dto.response.SalaryComponentResponse;
import com.cyclosa.payroll.entity.SalaryComponent;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface SalaryComponentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    SalaryComponent toEntity(CreateSalaryComponentRequest request);

    void updateEntityFromDto(UpdateSalaryComponentRequest request, @MappingTarget SalaryComponent entity);

    SalaryComponentResponse toResponse(SalaryComponent entity);

    List<SalaryComponentResponse> toResponseList(List<SalaryComponent> entities);
}
