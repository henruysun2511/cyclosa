package com.cyclosa.leave.mapper;

import com.cyclosa.leave.dto.request.CreateLeaveTypeRequest;
import com.cyclosa.leave.dto.request.UpdateLeaveTypeRequest;
import com.cyclosa.leave.dto.response.LeaveTypeResponse;
import com.cyclosa.leave.entity.LeaveType;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true),
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LeaveTypeMapper {

    LeaveType toEntity(CreateLeaveTypeRequest request);

    void updateEntityFromRequest(UpdateLeaveTypeRequest request, @MappingTarget LeaveType leaveType);

    LeaveTypeResponse toResponse(LeaveType leaveType);

    List<LeaveTypeResponse> toResponseList(List<LeaveType> leaveTypes);
}
