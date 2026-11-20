package com.cyclosa.asset.mapper;

import com.cyclosa.asset.dto.request.CreateAssetCategoryRequest;
import com.cyclosa.asset.dto.request.UpdateAssetCategoryRequest;
import com.cyclosa.asset.dto.response.AssetCategoryResponse;
import com.cyclosa.asset.entity.AssetCategory;
import org.mapstruct.*;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AssetCategoryMapper {

    AssetCategoryResponse toResponse(AssetCategory entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    AssetCategory toEntity(CreateAssetCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    void updateEntityFromRequest(UpdateAssetCategoryRequest request, @MappingTarget AssetCategory entity);
}
