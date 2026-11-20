package com.cyclosa.career.mapper;

import com.cyclosa.career.dto.request.CreateCareerPathRequest;
import com.cyclosa.career.dto.request.UpdateCareerPathRequest;
import com.cyclosa.career.dto.response.CareerPathResponse;
import com.cyclosa.career.entity.CareerPath;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CareerPathMapper {

    @Mapping(target = "fromJobTitleId", source = "fromJobTitle.id")
    @Mapping(target = "fromJobTitleCode", source = "fromJobTitle.code")
    @Mapping(target = "fromJobTitleName", source = "fromJobTitle.name")
    @Mapping(target = "toJobTitleId", source = "toJobTitle.id")
    @Mapping(target = "toJobTitleCode", source = "toJobTitle.code")
    @Mapping(target = "toJobTitleName", source = "toJobTitle.name")
    CareerPathResponse toResponse(CareerPath entity);

    List<CareerPathResponse> toResponseList(List<CareerPath> list);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "fromJobTitle", ignore = true)
    @Mapping(target = "toJobTitle", ignore = true)
    CareerPath toEntity(CreateCareerPathRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "fromJobTitle", ignore = true)
    @Mapping(target = "toJobTitle", ignore = true)
    void updateEntityFromRequest(UpdateCareerPathRequest request, @MappingTarget CareerPath entity);
}
