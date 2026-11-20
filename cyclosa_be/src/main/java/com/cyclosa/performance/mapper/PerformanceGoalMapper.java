package com.cyclosa.performance.mapper;

import com.cyclosa.performance.dto.request.CreateGoalRequest;
import com.cyclosa.performance.dto.request.UpdateGoalRequest;
import com.cyclosa.performance.dto.response.PerformanceGoalResponse;
import com.cyclosa.performance.entity.PerformanceGoal;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PerformanceGoalMapper {

    @Mapping(target = "review", ignore = true)
    @Mapping(target = "kpi", ignore = true)
    PerformanceGoal toEntity(CreateGoalRequest request);

    @Mapping(target = "review", ignore = true)
    @Mapping(target = "kpi", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateGoalRequest request, @MappingTarget PerformanceGoal entity);

    @Mapping(target = "reviewId", source = "review.id")
    @Mapping(target = "kpiId", source = "kpi.id")
    @Mapping(target = "kpiName", source = "kpi.name")
    @Mapping(target = "kpiUnit", source = "kpi.unit")
    PerformanceGoalResponse toResponse(PerformanceGoal entity);

    List<PerformanceGoalResponse> toResponseList(List<PerformanceGoal> entities);
}
