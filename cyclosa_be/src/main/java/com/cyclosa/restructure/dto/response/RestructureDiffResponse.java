package com.cyclosa.restructure.dto.response;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestructureDiffResponse {

    private UUID scenarioId;

    private List<DepartmentDiffItem> departmentDiffs;
    private List<EmployeeDiffItem> employeeDiffs;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentDiffItem {
        private UUID departmentId;
        private String code;
        private String name;
        private String changeType; // ADDED, MODIFIED, MERGED, SPLIT, DISSOLVED, UNCHANGED
        private String oldParentName;
        private String newParentName;
        private String oldManagerName;
        private String newManagerName;
        private String details;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmployeeDiffItem {
        private UUID employeeId;
        private String employeeCode;
        private String employeeName;
        private String changeType; // TRANSFERRED, PROMOTED, REDUNDANT, UNCHANGED
        private String oldDepartmentName;
        private String newDepartmentName;
        private String oldJobTitleName;
        private String newJobTitleName;
        private String oldManagerName;
        private String newManagerName;
    }
}
