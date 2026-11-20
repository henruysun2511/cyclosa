package com.cyclosa.transfer.dto.response;

import com.cyclosa.transfer.enums.TransferReason;
import com.cyclosa.transfer.enums.TransferStatus;
import com.cyclosa.transfer.enums.TransferType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransferSummaryResponse {

    private UUID id;

    // Nhân sự
    private UUID employeeId;
    private String employeeCode;
    private String employeeName;
    private String employeePortraitUrl;

    // Loại & Trạng thái
    private TransferType transferType;
    private String transferTypeDescription;
    private TransferStatus status;
    private String statusDescription;

    // Đơn vị nguồn (Trước)
    private String fromDepartmentName;
    private String fromBranchName;
    private String fromJobTitleName;
    private String fromManagerName;

    // Đơn vị đích (Sau)
    private String toDepartmentName;
    private String toBranchName;
    private String toJobTitleName;
    private String toManagerName;

    // Thời hạn & Lý do
    private LocalDate effectiveDate;
    private LocalDate endDate;
    private TransferReason reason;
    private String reasonDescription;

    private Boolean hasSalaryAdjustment;
    private Boolean isReturned;

    private LocalDateTime createdAt;
}
