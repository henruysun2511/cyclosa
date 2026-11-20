package com.cyclosa.attendance.mapper;

import com.cyclosa.attendance.dto.request.CreateShiftRequest;
import com.cyclosa.attendance.dto.request.UpdateShiftRequest;
import com.cyclosa.attendance.dto.response.*;
import com.cyclosa.attendance.entity.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface AttendanceMapper {

    @Mapping(target = "companyId", ignore = true)
    Shift toEntity(CreateShiftRequest request);

    void updateEntityFromDto(UpdateShiftRequest request, @MappingTarget Shift entity);

    @Mapping(target = "isNightShift", expression = "java(shift.isNightShift())")
    ShiftResponse toResponse(Shift shift);

    List<ShiftResponse> toShiftResponseList(List<Shift> shifts);

    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "shiftCode", source = "shift.code")
    @Mapping(target = "shiftName", source = "shift.name")
    @Mapping(target = "shiftHours", expression = "java(assignment.getShift().getStartTime() + \" - \" + assignment.getShift().getEndTime())")
    ShiftAssignmentResponse toResponse(ShiftAssignment assignment);

    List<ShiftAssignmentResponse> toShiftAssignmentResponseList(List<ShiftAssignment> assignments);

    AttendanceLogResponse toResponse(AttendanceLog log);

    List<AttendanceLogResponse> toAttendanceLogResponseList(List<AttendanceLog> logs);

    @Mapping(target = "adjusted", ignore = true)
    @Mapping(target = "adjustedCheckIn", ignore = true)
    @Mapping(target = "adjustedCheckOut", ignore = true)
    AttendanceRequestResponse toResponse(AttendanceRequest request);

    List<AttendanceRequestResponse> toAttendanceRequestResponseList(List<AttendanceRequest> requests);

    @Mapping(target = "attendanceRequestId", source = "attendanceRequest.id")
    @Mapping(target = "workDate", source = "attendanceRequest.workDate")
    AttendanceAdjustmentResponse toResponse(AttendanceAdjustment adjustment);

    List<AttendanceAdjustmentResponse> toAttendanceAdjustmentResponseList(List<AttendanceAdjustment> adjustments);

    TimesheetPeriodResponse toResponse(TimesheetPeriod period);

    List<TimesheetPeriodResponse> toTimesheetPeriodResponseList(List<TimesheetPeriod> periods);

    @Mapping(target = "timesheetPeriodId", source = "timesheetPeriod.id")
    @Mapping(target = "year", source = "timesheetPeriod.year")
    @Mapping(target = "month", source = "timesheetPeriod.month")
    TimesheetSnapshotResponse toResponse(TimesheetSnapshot snapshot);

    List<TimesheetSnapshotResponse> toTimesheetSnapshotResponseList(List<TimesheetSnapshot> snapshots);
}

