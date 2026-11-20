package com.cyclosa.performance.mapper;

import com.cyclosa.performance.dto.request.CreateKpiRequest;
import com.cyclosa.performance.dto.request.UpdateKpiRequest;
import com.cyclosa.performance.dto.response.KpiResponse;
import com.cyclosa.performance.entity.Kpi;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface KpiMapper {

    @Mapping(target = "department", ignore = true)
    Kpi toEntity(CreateKpiRequest request);

    @Mapping(target = "department", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateKpiRequest request, @MappingTarget Kpi entity);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", ignore = true)
    KpiResponse toResponse(Kpi entity);

    @AfterMapping
    default void enrichDepartmentName(Kpi entity, @MappingTarget KpiResponse response) {
        if (entity.getDepartment() != null) {
            if (entity.getDepartment().getVersions() != null && !entity.getDepartment().getVersions().isEmpty()) {
                response.setDepartmentName(entity.getDepartment().getVersions().get(0).getName());
            } else {
                response.setDepartmentName(entity.getDepartment().getCode());
            }
        }
    }

    List<KpiResponse> toResponseList(List<Kpi> entities);
}
