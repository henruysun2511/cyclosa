package com.cyclosa.attendance.mapper;

import com.cyclosa.attendance.dto.request.CreateShiftRequest;
import com.cyclosa.attendance.dto.request.UpdateShiftRequest;
import com.cyclosa.attendance.dto.response.ShiftResponse;
import com.cyclosa.attendance.entity.Shift;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        builder = @Builder(disableBuilder = true)
)
public interface ShiftMapper {

    @Mapping(target = "companyId", ignore = true)
    Shift toEntity(CreateShiftRequest request);

    void updateEntityFromDto(UpdateShiftRequest request, @MappingTarget Shift entity);

    @Mapping(target = "isNightShift", expression = "java(shift.isNightShift())")
    ShiftResponse toResponse(Shift shift);

    List<ShiftResponse> toShiftResponseList(List<Shift> shifts);
}

