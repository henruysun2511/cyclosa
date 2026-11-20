package com.cyclosa.restructure.mapper;

import com.cyclosa.restructure.dto.request.CreateOrgScenarioRequest;
import com.cyclosa.restructure.dto.request.CreateScenarioDepartmentRequest;
import com.cyclosa.restructure.dto.response.OrgScenarioDetailResponse;
import com.cyclosa.restructure.dto.response.OrgScenarioResponse;
import com.cyclosa.restructure.dto.response.ScenarioActionResponse;
import com.cyclosa.restructure.dto.response.ScenarioDepartmentResponse;
import com.cyclosa.restructure.dto.response.ScenarioEmployeeAssignmentResponse;
import com.cyclosa.restructure.entity.OrgScenario;
import com.cyclosa.restructure.entity.ScenarioAction;
import com.cyclosa.restructure.entity.ScenarioDepartment;
import com.cyclosa.restructure.entity.ScenarioEmployeeAssignment;
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
public interface OrgRestructureMapper {

    OrgScenario toEntity(CreateOrgScenarioRequest request);

    OrgScenarioResponse toResponse(OrgScenario entity);

    OrgScenarioDetailResponse toDetailResponse(OrgScenario entity);

    ScenarioDepartment toEntity(CreateScenarioDepartmentRequest request);

    @Mapping(target = "scenarioId", source = "scenario.id")
    @Mapping(target = "parentScenarioDeptId", source = "parentScenarioDept.id")
    @Mapping(target = "parentDepartmentName", source = "parentScenarioDept.name")
    ScenarioDepartmentResponse toResponse(ScenarioDepartment entity);

    @Mapping(target = "scenarioId", source = "scenario.id")
    ScenarioActionResponse toResponse(ScenarioAction entity);

    @Mapping(target = "scenarioId", source = "scenario.id")
    @Mapping(target = "newScenarioDeptId", source = "newScenarioDept.id")
    @Mapping(target = "newScenarioDeptName", source = "newScenarioDept.name")
    ScenarioEmployeeAssignmentResponse toResponse(ScenarioEmployeeAssignment entity);
}
