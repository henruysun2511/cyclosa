package com.cyclosa.career.mapper;

import com.cyclosa.career.dto.response.CareerSimulationDetailResponse;
import com.cyclosa.career.dto.response.CareerSimulationResponse;
import com.cyclosa.career.entity.CareerSimulation;
import com.cyclosa.career.entity.CareerSimulationStep;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CareerSimulationMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "startJobTitleId", source = "startJobTitle.id")
    @Mapping(target = "startJobTitleName", source = "startJobTitle.name")
    @Mapping(target = "totalSteps", expression = "java(entity.getSteps() != null ? entity.getSteps().size() : 0)")
    CareerSimulationResponse toResponse(CareerSimulation entity);

    List<CareerSimulationResponse> toResponseList(List<CareerSimulation> list);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "startJobTitleId", source = "startJobTitle.id")
    @Mapping(target = "startJobTitleName", source = "startJobTitle.name")
    @Mapping(target = "steps", source = "steps")
    CareerSimulationDetailResponse toDetailResponse(CareerSimulation entity);

    @Mapping(target = "jobTitleId", source = "jobTitle.id")
    @Mapping(target = "jobTitleCode", source = "jobTitle.code")
    @Mapping(target = "jobTitleName", source = "jobTitle.name")
    CareerSimulationDetailResponse.SimulationStepResponse toStepResponse(CareerSimulationStep entity);
}
