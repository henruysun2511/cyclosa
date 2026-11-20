package com.cyclosa.transfer.mapper;

import com.cyclosa.organization.entity.Department;
import com.cyclosa.transfer.dto.response.TransferAllowanceResponse;
import com.cyclosa.transfer.dto.response.TransferResponse;
import com.cyclosa.transfer.dto.response.TransferSummaryResponse;
import com.cyclosa.transfer.entity.TransferAllowance;
import com.cyclosa.transfer.entity.TransferRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransferMapper {

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", expression = "java(entity.getEmployee() != null ? entity.getEmployee().getFullName() : null)")
    @Mapping(target = "employeePortraitUrl", source = "employee.portraitUrl")
    @Mapping(target = "employeeEmail", source = "employee.personalEmail")
    @Mapping(target = "employeePhone", source = "employee.phone")
    @Mapping(target = "transferTypeDescription", expression = "java(entity.getTransferType() != null ? entity.getTransferType().getDescription() : null)")
    @Mapping(target = "statusDescription", expression = "java(entity.getStatus() != null ? entity.getStatus().getDescription() : null)")
    @Mapping(target = "reasonDescription", expression = "java(entity.getReason() != null ? entity.getReason().getDescription() : null)")
    @Mapping(target = "fromDepartmentId", source = "fromDepartment.id")
    @Mapping(target = "fromDepartmentName", expression = "java(getDepartmentName(entity.getFromDepartment()))")
    @Mapping(target = "fromBranchId", source = "fromBranch.id")
    @Mapping(target = "fromBranchName", expression = "java(entity.getFromBranch() != null ? entity.getFromBranch().getName() : null)")
    @Mapping(target = "fromJobTitleId", source = "fromJobTitle.id")
    @Mapping(target = "fromJobTitleName", source = "fromJobTitle.name")
    @Mapping(target = "fromJobLevelId", source = "fromJobLevel.id")
    @Mapping(target = "fromJobLevelName", expression = "java(entity.getFromJobLevel() != null ? entity.getFromJobLevel().getName() : null)")
    @Mapping(target = "fromManagerId", source = "fromManager.id")
    @Mapping(target = "fromManagerName", expression = "java(entity.getFromManager() != null ? entity.getFromManager().getFullName() : null)")
    @Mapping(target = "toDepartmentId", source = "toDepartment.id")
    @Mapping(target = "toDepartmentName", expression = "java(getDepartmentName(entity.getToDepartment()))")
    @Mapping(target = "toBranchId", source = "toBranch.id")
    @Mapping(target = "toBranchName", expression = "java(entity.getToBranch() != null ? entity.getToBranch().getName() : null)")
    @Mapping(target = "toJobTitleId", source = "toJobTitle.id")
    @Mapping(target = "toJobTitleName", source = "toJobTitle.name")
    @Mapping(target = "toJobLevelId", source = "toJobLevel.id")
    @Mapping(target = "toJobLevelName", expression = "java(entity.getToJobLevel() != null ? entity.getToJobLevel().getName() : null)")
    @Mapping(target = "toManagerId", source = "toManager.id")
    @Mapping(target = "toManagerName", expression = "java(entity.getToManager() != null ? entity.getToManager().getFullName() : null)")
    @Mapping(target = "approvedByName", ignore = true)
    @Mapping(target = "completedByName", ignore = true)
    TransferResponse toResponse(TransferRequest entity);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeCode", source = "employee.employeeCode")
    @Mapping(target = "employeeName", expression = "java(entity.getEmployee() != null ? entity.getEmployee().getFullName() : null)")
    @Mapping(target = "employeePortraitUrl", source = "employee.portraitUrl")
    @Mapping(target = "transferTypeDescription", expression = "java(entity.getTransferType() != null ? entity.getTransferType().getDescription() : null)")
    @Mapping(target = "statusDescription", expression = "java(entity.getStatus() != null ? entity.getStatus().getDescription() : null)")
    @Mapping(target = "reasonDescription", expression = "java(entity.getReason() != null ? entity.getReason().getDescription() : null)")
    @Mapping(target = "fromDepartmentName", expression = "java(getDepartmentName(entity.getFromDepartment()))")
    @Mapping(target = "fromBranchName", expression = "java(entity.getFromBranch() != null ? entity.getFromBranch().getName() : null)")
    @Mapping(target = "fromJobTitleName", source = "fromJobTitle.name")
    @Mapping(target = "fromManagerName", expression = "java(entity.getFromManager() != null ? entity.getFromManager().getFullName() : null)")
    @Mapping(target = "toDepartmentName", expression = "java(getDepartmentName(entity.getToDepartment()))")
    @Mapping(target = "toBranchName", expression = "java(entity.getToBranch() != null ? entity.getToBranch().getName() : null)")
    @Mapping(target = "toJobTitleName", source = "toJobTitle.name")
    @Mapping(target = "toManagerName", expression = "java(entity.getToManager() != null ? entity.getToManager().getFullName() : null)")
    TransferSummaryResponse toSummaryResponse(TransferRequest entity);

    List<TransferSummaryResponse> toSummaryResponseList(List<TransferRequest> entities);

    TransferAllowanceResponse toAllowanceResponse(TransferAllowance entity);

    List<TransferAllowanceResponse> toAllowanceResponseList(List<TransferAllowance> entities);

    default String getDepartmentName(Department dept) {
        if (dept == null) return null;
        if (dept.getVersions() != null && !dept.getVersions().isEmpty()) {
            return dept.getVersions().get(0).getName();
        }
        return dept.getCode();
    }
}
