package com.cyclosa.performance.mapper;

import com.cyclosa.performance.dto.response.PerformanceReviewDetailResponse;
import com.cyclosa.performance.dto.response.PerformanceReviewResponse;
import com.cyclosa.performance.entity.PerformanceReview;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {PerformanceGoalMapper.class})
public interface PerformanceReviewMapper {

    @Mapping(target = "cycleId", source = "cycle.id")
    @Mapping(target = "cycleName", source = "cycle.name")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "jobTitleName", ignore = true)
    @Mapping(target = "managerEmployeeId", source = "managerEmployee.id")
    @Mapping(target = "managerEmployeeName", source = "managerEmployee.fullName")
    @Mapping(target = "totalGoals", ignore = true)
    @Mapping(target = "totalWeight", ignore = true)
    PerformanceReviewResponse toResponse(PerformanceReview entity);

    List<PerformanceReviewResponse> toResponseList(List<PerformanceReview> entities);

    @Mapping(target = "cycleId", source = "cycle.id")
    @Mapping(target = "cycleName", source = "cycle.name")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "jobTitleName", ignore = true)
    @Mapping(target = "managerEmployeeId", source = "managerEmployee.id")
    @Mapping(target = "managerEmployeeName", source = "managerEmployee.fullName")
    @Mapping(target = "totalWeight", ignore = true)
    PerformanceReviewDetailResponse toDetailResponse(PerformanceReview entity);
}
