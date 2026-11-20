package com.cyclosa.leave.mapper;

import com.cyclosa.leave.dto.response.LeaveCalendarEventResponse;
import com.cyclosa.leave.dto.response.LeaveRequestResponse;
import com.cyclosa.leave.entity.LeaveRequest;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true),
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LeaveRequestMapper {

    @Mapping(target = "leaveTypeId", source = "leaveType.id")
    @Mapping(target = "leaveTypeCode", source = "leaveType.code")
    @Mapping(target = "leaveTypeName", source = "leaveType.name")
    @Mapping(target = "leaveGroup", source = "leaveType.leaveGroup")
    @Mapping(target = "payer", source = "leaveType.payer")
    @Mapping(target = "employeeCode", ignore = true)
    @Mapping(target = "employeeFullName", ignore = true)
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "jobTitleName", ignore = true)
    @Mapping(target = "requestedByUserName", ignore = true)
    LeaveRequestResponse toResponse(LeaveRequest request);

    @Mapping(target = "leaveTypeId", source = "leaveType.id")
    @Mapping(target = "leaveTypeCode", source = "leaveType.code")
    @Mapping(target = "leaveTypeName", source = "leaveType.name")
    @Mapping(target = "leaveGroup", source = "leaveType.leaveGroup")
    @Mapping(target = "payer", source = "leaveType.payer")
    @Mapping(target = "employeeCode", ignore = true)
    @Mapping(target = "employeeFullName", ignore = true)
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "jobTitleName", ignore = true)
    @Mapping(target = "requestedByUserName", ignore = true)
    List<LeaveRequestResponse> toResponseList(List<LeaveRequest> requests);

    @Mapping(target = "leaveTypeCode", source = "leaveType.code")
    @Mapping(target = "leaveTypeName", source = "leaveType.name")
    @Mapping(target = "leaveGroup", source = "leaveType.leaveGroup")
    @Mapping(target = "employeeCode", ignore = true)
    @Mapping(target = "employeeFullName", ignore = true)
    @Mapping(target = "departmentName", ignore = true)
    LeaveCalendarEventResponse toCalendarEvent(LeaveRequest request);
}
