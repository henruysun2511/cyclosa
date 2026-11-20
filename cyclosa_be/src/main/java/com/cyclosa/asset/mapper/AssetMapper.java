package com.cyclosa.asset.mapper;

import com.cyclosa.asset.dto.request.CreateAssetRequest;
import com.cyclosa.asset.dto.request.UpdateAssetRequest;
import com.cyclosa.asset.dto.response.AssetDetailResponse;
import com.cyclosa.asset.dto.response.AssetSummaryResponse;
import com.cyclosa.asset.entity.Asset;
import com.cyclosa.asset.entity.AssetAssignment;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {AssetAssignmentMapper.class}
)
public interface AssetMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryCode", source = "category.code")
    @Mapping(target = "currentEmployeeId", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getEmployee().getId() : null)")
    @Mapping(target = "currentEmployeeCode", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getEmployee().getEmployeeCode() : null)")
    @Mapping(target = "currentEmployeeName", expression = "java(getActiveAssignment(entity) != null && getActiveAssignment(entity).getEmployee() != null ? getActiveAssignment(entity).getEmployee().getFullName() : null)")
    @Mapping(target = "assignedAt", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getAssignedAt() : null)")
    AssetSummaryResponse toSummaryResponse(Asset entity);

    List<AssetSummaryResponse> toSummaryResponseList(List<Asset> list);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryCode", source = "category.code")
    @Mapping(target = "currentEmployeeId", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getEmployee().getId() : null)")
    @Mapping(target = "currentEmployeeCode", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getEmployee().getEmployeeCode() : null)")
    @Mapping(target = "currentEmployeeName", expression = "java(getActiveAssignment(entity) != null && getActiveAssignment(entity).getEmployee() != null ? getActiveAssignment(entity).getEmployee().getFullName() : null)")
    @Mapping(target = "currentAssignedAt", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getAssignedAt() : null)")
    @Mapping(target = "currentAssignmentId", expression = "java(getActiveAssignment(entity) != null ? getActiveAssignment(entity).getId() : null)")
    @Mapping(target = "assignments", source = "assignments")
    AssetDetailResponse toDetailResponse(Asset entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    Asset toEntity(CreateAssetRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "assetCode", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "assignments", ignore = true)
    void updateEntityFromRequest(UpdateAssetRequest request, @MappingTarget Asset entity);

    default AssetAssignment getActiveAssignment(Asset asset) {
        if (asset.getAssignments() == null || asset.getAssignments().isEmpty()) {
            return null;
        }
        return asset.getAssignments().stream()
                .filter(AssetAssignment::isActive)
                .findFirst()
                .orElse(null);
    }
}
