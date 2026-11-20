package com.cyclosa.transfer.dto.response;

import com.cyclosa.transfer.enums.TransferReason;
import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferResponse {

    private UUID id;

    // Nhân viên
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String employeePortraitUrl;
    private String employeeEmail;
    private String employeePhone;

    // Loại & Trạng thái
    private TransferType transferType;
    private String transferTypeDescription;
    private TransferStatus status;
    private String statusDescription;

    // Snapshot Trước
    private UUID fromDepartmentId;
    private String fromDepartmentName;
    private UUID fromBranchId;
    private String fromBranchName;
    private UUID fromJobTitleId;
    private String fromJobTitleName;
    private UUID fromJobLevelId;
    private String fromJobLevelName;
    private UUID fromManagerId;
    private String fromManagerName;
    private BigDecimal fromBaseSalary;

    // Đích Sau
    private UUID toDepartmentId;
    private String toDepartmentName;
    private UUID toBranchId;
    private String toBranchName;
    private UUID toJobTitleId;
    private String toJobTitleName;
    private UUID toJobLevelId;
    private String toJobLevelName;
    private UUID toManagerId;
    private String toManagerName;
    private BigDecimal toBaseSalary;

    // Thời hạn & Lý do
    private LocalDate effectiveDate;
    private LocalDate endDate;
    private TransferReason reason;
    private String reasonDescription;
    private String reasonDetail;
    private String notes;

    // Đãi ngộ & Phụ cấp
    private Boolean hasSalaryAdjustment;
    private String salaryNotes;
    private List<TransferAllowanceResponse> allowances;

    // Workflow & Phê duyệt
    private UUID workflowRequestId;
    private UUID approvedBy;
    private String approvedByName;
    private LocalDateTime approvedAt;
    private String rejectionReason;

    // Thực thi hoàn tất
    private UUID completedBy;
    private String completedByName;
    private LocalDateTime completedAt;
    private Boolean isReturned;

    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
