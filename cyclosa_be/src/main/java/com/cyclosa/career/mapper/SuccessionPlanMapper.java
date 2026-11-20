package com.cyclosa.career.mapper;

import com.cyclosa.career.dto.request.CreateSuccessionPlanRequest;
import com.cyclosa.career.dto.request.UpdateSuccessionPlanRequest;
import com.cyclosa.career.dto.response.SuccessionPlanDetailResponse;
import com.cyclosa.career.dto.response.SuccessionPlanResponse;
import com.cyclosa.career.entity.SuccessionCandidate;
import com.cyclosa.career.entity.SuccessionPlan;
import com.cyclosa.career.enums.Readiness;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        builder = @Builder(disableBuilder = true),
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = {SuccessionCandidateMapper.class}
)
public interface SuccessionPlanMapper {

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "jobTitleId", source = "jobTitle.id")
    @Mapping(target = "jobTitleName", source = "jobTitle.name")
    @Mapping(target = "candidateCount", expression = "java(entity.getCandidates() != null ? entity.getCandidates().size() : 0)")
    @Mapping(target = "readyNowCount", expression = "java(countReadyNow(entity.getCandidates()))")
    @Mapping(target = "currentHolderId", ignore = true)
    @Mapping(target = "currentHolderCode", ignore = true)
    @Mapping(target = "currentHolderName", ignore = true)
    SuccessionPlanResponse toResponse(SuccessionPlan entity);

    List<SuccessionPlanResponse> toResponseList(List<SuccessionPlan> list);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "jobTitleId", source = "jobTitle.id")
    @Mapping(target = "jobTitleName", source = "jobTitle.name")
    @Mapping(target = "candidates", source = "candidates")
    @Mapping(target = "currentHolderId", ignore = true)
    @Mapping(target = "currentHolderCode", ignore = true)
    @Mapping(target = "currentHolderName", ignore = true)
    @Mapping(target = "currentHolderPortraitUrl", ignore = true)
    SuccessionPlanDetailResponse toDetailResponse(SuccessionPlan entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "jobTitle", ignore = true)
    @Mapping(target = "candidates", ignore = true)
    SuccessionPlan toEntity(CreateSuccessionPlanRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "companyId", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "jobTitle", ignore = true)
    @Mapping(target = "candidates", ignore = true)
    void updateEntityFromRequest(UpdateSuccessionPlanRequest request, @MappingTarget SuccessionPlan entity);

    default int countReadyNow(List<SuccessionCandidate> candidates) {
        if (candidates == null) return 0;
        return (int) candidates.stream()
                .filter(c -> c.getReadiness() == Readiness.READY_NOW)
                .count();
    }
}
