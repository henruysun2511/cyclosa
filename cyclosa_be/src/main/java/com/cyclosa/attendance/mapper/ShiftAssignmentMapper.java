package com.cyclosa.attendance.mapper;

import com.cyclosa.attendance.dto.response.ShiftAssignmentResponse;
import com.cyclosa.attendance.entity.ShiftAssignment;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface ShiftAssignmentMapper {

    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "shiftCode", source = "shift.code")
    @Mapping(target = "shiftName", source = "shift.name")
    @Mapping(target = "shiftHours", expression = "java(assignment.getShift().getStartTime() + \" - \" + assignment.getShift().getEndTime())")
    ShiftAssignmentResponse toResponse(ShiftAssignment assignment);

    List<ShiftAssignmentResponse> toShiftAssignmentResponseList(List<ShiftAssignment> assignments);
}

