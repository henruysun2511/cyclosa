package com.cyclosa.attendance.mapper;

import com.cyclosa.attendance.dto.response.TimesheetPeriodResponse;
import com.cyclosa.attendance.dto.response.TimesheetSnapshotResponse;
import com.cyclosa.attendance.entity.TimesheetPeriod;
import com.cyclosa.attendance.entity.TimesheetSnapshot;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface TimesheetPeriodMapper {

    TimesheetPeriodResponse toResponse(TimesheetPeriod period);

    List<TimesheetPeriodResponse> toTimesheetPeriodResponseList(List<TimesheetPeriod> periods);

    @Mapping(target = "timesheetPeriodId", source = "timesheetPeriod.id")
    @Mapping(target = "year", source = "timesheetPeriod.year")
    @Mapping(target = "month", source = "timesheetPeriod.month")
    TimesheetSnapshotResponse toResponse(TimesheetSnapshot snapshot);

    List<TimesheetSnapshotResponse> toTimesheetSnapshotResponseList(List<TimesheetSnapshot> snapshots);
}

