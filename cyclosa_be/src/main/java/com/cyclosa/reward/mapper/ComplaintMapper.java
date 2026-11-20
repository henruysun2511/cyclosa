package com.cyclosa.reward.mapper;

import com.cyclosa.reward.dto.request.CreateComplaintRequest;
import com.cyclosa.reward.dto.response.ComplaintResponse;
import com.cyclosa.reward.entity.Complaint;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ComplaintMapper {

    @Mapping(target = "complainantEmployee", ignore = true)
    @Mapping(target = "status", constant = "OPEN")
    @Mapping(target = "handlerEmployee", ignore = true)
    Complaint toEntity(CreateComplaintRequest request);

    @Mapping(target = "complainantEmployeeId", source = "complainantEmployee.id")
    @Mapping(target = "complainantEmployeeName", source = "complainantEmployee.fullName")
    @Mapping(target = "complainantEmployeeCode", source = "complainantEmployee.employeeCode")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "handlerEmployeeId", source = "handlerEmployee.id")
    @Mapping(target = "handlerEmployeeName", source = "handlerEmployee.fullName")
    ComplaintResponse toResponse(Complaint entity);

    List<ComplaintResponse> toResponseList(List<Complaint> entities);
}
