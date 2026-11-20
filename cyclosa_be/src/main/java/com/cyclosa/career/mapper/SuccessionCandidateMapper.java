package com.cyclosa.career.mapper;

import com.cyclosa.career.dto.response.SuccessionCandidateResponse;
import com.cyclosa.career.entity.SuccessionCandidate;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SuccessionCandidateMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "currentDepartmentName", expression = "java(entity.getEmployee() != null && entity.getEmployee().getCurrentDepartment() != null ? entity.getEmployee().getCurrentDepartment().getName() : null)")
    @Mapping(target = "currentJobTitleName", expression = "java(entity.getEmployee() != null && entity.getEmployee().getCurrentJobTitle() != null ? entity.getEmployee().getCurrentJobTitle().getName() : null)")
    SuccessionCandidateResponse toResponse(SuccessionCandidate entity);

    List<SuccessionCandidateResponse> toResponseList(List<SuccessionCandidate> list);
}
