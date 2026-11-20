package com.cyclosa.attendance.mapper;

import com.cyclosa.attendance.dto.response.AttendanceLogResponse;
import com.cyclosa.attendance.entity.AttendanceLog;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface AttendanceLogMapper {

    AttendanceLogResponse toResponse(AttendanceLog log);

    List<AttendanceLogResponse> toAttendanceLogResponseList(List<AttendanceLog> logs);
}

