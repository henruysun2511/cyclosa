package com.cyclosa.leave.mapper;

import com.cyclosa.leave.dto.request.CreateLeavePolicyRequest;
import com.cyclosa.leave.dto.request.UpdateLeavePolicyRequest;
import com.cyclosa.leave.dto.response.LeavePolicyResponse;
import com.cyclosa.leave.entity.LeavePolicy;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        builder = @Builder(disableBuilder = true),
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LeavePolicyMapper {

    LeavePolicy toEntity(CreateLeavePolicyRequest request);

    void updateEntityFromRequest(UpdateLeavePolicyRequest request, @MappingTarget LeavePolicy policy);

    @Mapping(target = "leaveTypeId", source = "leaveType.id")
    @Mapping(target = "leaveTypeCode", source = "leaveType.code")
    @Mapping(target = "leaveTypeName", source = "leaveType.name")
    LeavePolicyResponse toResponse(LeavePolicy policy);

    List<LeavePolicyResponse> toResponseList(List<LeavePolicy> policies);
}
