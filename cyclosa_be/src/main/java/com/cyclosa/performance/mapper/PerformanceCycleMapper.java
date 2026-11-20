package com.cyclosa.performance.mapper;

import com.cyclosa.performance.dto.request.CreatePerformanceCycleRequest;
import com.cyclosa.performance.dto.request.UpdatePerformanceCycleRequest;
import com.cyclosa.performance.dto.response.PerformanceCycleResponse;
import com.cyclosa.performance.entity.PerformanceCycle;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PerformanceCycleMapper {

    PerformanceCycle toEntity(CreatePerformanceCycleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdatePerformanceCycleRequest request, @MappingTarget PerformanceCycle entity);

    PerformanceCycleResponse toResponse(PerformanceCycle entity);

    List<PerformanceCycleResponse> toResponseList(List<PerformanceCycle> entities);
}
