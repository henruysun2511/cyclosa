package com.cyclosa.offboarding.mapper;

import com.cyclosa.offboarding.dto.response.ExitInterviewResponse;
import com.cyclosa.offboarding.dto.response.OffboardingClearanceItemResponse;
import com.cyclosa.offboarding.dto.response.OffboardingRequestResponse;
import com.cyclosa.offboarding.entity.ExitInterview;
import com.cyclosa.offboarding.entity.OffboardingClearanceItem;
import com.cyclosa.offboarding.entity.OffboardingRequest;
import com.cyclosa.offboarding.enums.ClearanceStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OffboardingMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", source = "employee.fullName")
    @Mapping(target = "departmentName", ignore = true)
    @Mapping(target = "positionName", ignore = true)
    @Mapping(target = "avatarUrl", ignore = true)
    @Mapping(target = "successorId", source = "successor.id")
    @Mapping(target = "successorName", source = "successor.fullName")
    @Mapping(target = "approverId", source = "approver.id")
    @Mapping(target = "approverName", source = "approver.fullName")
    @Mapping(target = "totalClearanceItems", expression = "java(entity.getClearanceItems() != null ? entity.getClearanceItems().size() : 5)")
    @Mapping(target = "clearedItemsCount", expression = "java(calculateClearedCount(entity))")
    @Mapping(target = "clearanceProgressPercent", expression = "java(calculateProgressPercent(entity))")
    OffboardingRequestResponse toResponse(OffboardingRequest entity);

    List<OffboardingRequestResponse> toResponseList(List<OffboardingRequest> entities);

    @Mapping(target = "offboardingRequestId", source = "offboardingRequest.id")
    @Mapping(target = "clearedById", source = "clearedBy.id")
    @Mapping(target = "clearedByName", source = "clearedBy.fullName")
    OffboardingClearanceItemResponse toClearanceItemResponse(OffboardingClearanceItem entity);

    List<OffboardingClearanceItemResponse> toClearanceItemResponseList(List<OffboardingClearanceItem> entities);

    @Mapping(target = "offboardingRequestId", source = "offboardingRequest.id")
    @Mapping(target = "interviewerId", source = "interviewer.id")
    @Mapping(target = "interviewerName", source = "interviewer.fullName")
    ExitInterviewResponse toExitInterviewResponse(ExitInterview entity);

    default int calculateClearedCount(OffboardingRequest entity) {
        if (entity.getClearanceItems() == null || entity.getClearanceItems().isEmpty()) {
            return 0;
        }
        return (int) entity.getClearanceItems().stream()
                .filter(item -> item.getStatus() == ClearanceStatus.CLEARED)
                .count();
    }

    default int calculateProgressPercent(OffboardingRequest entity) {
        if (entity.getClearanceItems() == null || entity.getClearanceItems().isEmpty()) {
            return 0;
        }
        int total = entity.getClearanceItems().size();
        int cleared = calculateClearedCount(entity);
        return total > 0 ? (cleared * 100) / total : 0;
    }
}
