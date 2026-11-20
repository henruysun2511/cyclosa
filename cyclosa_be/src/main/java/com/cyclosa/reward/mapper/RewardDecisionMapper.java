package com.cyclosa.reward.mapper;

import com.cyclosa.reward.dto.request.CreateRewardDecisionRequest;
import com.cyclosa.reward.dto.request.UpdateRewardDecisionRequest;
import com.cyclosa.reward.dto.response.RewardDecisionResponse;
import com.cyclosa.reward.entity.RewardDecision;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RewardDecisionMapper {

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "decidedByEmployee", ignore = true)
    RewardDecision toEntity(CreateRewardDecisionRequest request);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "decidedByEmployee", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateRewardDecisionRequest request, @MappingTarget RewardDecision entity);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "decidedByEmployeeId", source = "decidedByEmployee.id")
    @Mapping(target = "decidedByEmployeeName", source = "decidedByEmployee.fullName")
    RewardDecisionResponse toResponse(RewardDecision entity);

    List<RewardDecisionResponse> toResponseList(List<RewardDecision> entities);
}
