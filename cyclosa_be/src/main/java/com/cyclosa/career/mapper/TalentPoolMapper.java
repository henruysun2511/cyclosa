package com.cyclosa.career.mapper;

import com.cyclosa.career.dto.response.TalentPoolEntryResponse;
import com.cyclosa.career.entity.InternalTalentPoolEntry;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TalentPoolMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "departmentName", expression = "java(entity.getEmployee() != null && entity.getEmployee().getCurrentDepartment() != null ? entity.getEmployee().getCurrentDepartment().getName() : null)")
    @Mapping(target = "jobTitleName", expression = "java(entity.getEmployee() != null && entity.getEmployee().getCurrentJobTitle() != null ? entity.getEmployee().getCurrentJobTitle().getName() : null)")
    TalentPoolEntryResponse toResponse(InternalTalentPoolEntry entity);

    List<TalentPoolEntryResponse> toResponseList(List<InternalTalentPoolEntry> list);
}
