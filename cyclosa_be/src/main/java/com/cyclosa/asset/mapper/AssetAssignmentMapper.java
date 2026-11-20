package com.cyclosa.asset.mapper;

import com.cyclosa.asset.dto.response.AssetAssignmentResponse;
import com.cyclosa.asset.entity.AssetAssignment;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AssetAssignmentMapper {

    @Mapping(target = "assetId", source = "asset.id")
    @Mapping(target = "assetCode", source = "asset.assetCode")
    @Mapping(target = "assetName", source = "asset.name")
    @Mapping(target = "categoryName", source = "asset.category.name")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", expression = "java(entity.getEmployee() != null ? entity.getEmployee().getFullName() : null)")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "active", expression = "java(entity.isActive())")
    AssetAssignmentResponse toResponse(AssetAssignment entity);

    List<AssetAssignmentResponse> toResponseList(List<AssetAssignment> list);
}
