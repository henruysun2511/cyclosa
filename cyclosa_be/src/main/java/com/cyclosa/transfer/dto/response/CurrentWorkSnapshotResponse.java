package com.cyclosa.transfer.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentWorkSnapshotResponse {

    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String portraitUrl;

    // Snapshot hiện tại
    private UUID departmentId;
    private String departmentName;

    private UUID branchId;
    private String branchName;

    private UUID jobTitleId;
    private String jobTitleName;

    private UUID jobLevelId;
    private String jobLevelName;

    private UUID managerId;
    private String managerName;

    private BigDecimal currentBaseSalary;
    private LocalDate effectiveFrom;
}
