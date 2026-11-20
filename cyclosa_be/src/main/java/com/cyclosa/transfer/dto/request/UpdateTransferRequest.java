package com.cyclosa.transfer.dto.request;

import com.cyclosa.transfer.enums.TransferReason;
import com.cyclosa.transfer.enums.TransferType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateTransferRequest {

    @NotNull(message = "Loại hình điều chuyển không được để trống")
    private TransferType transferType;

    // === Đích tiếp nhận ===
    @NotNull(message = "Phòng ban tiếp nhận không được để trống")
    private UUID toDepartmentId;

    private UUID toBranchId;

    @NotNull(message = "Chức danh tiếp nhận không được để trống")
    private UUID toJobTitleId;

    private UUID toJobLevelId;

    private UUID toManagerId;

    private BigDecimal toBaseSalary;

    // === Thời hạn & Lý do ===
    @NotNull(message = "Ngày có hiệu lực không được để trống")
    private LocalDate effectiveDate;

    private LocalDate endDate;

    @NotNull(message = "Lý do điều chuyển không được để trống")
    private TransferReason reason;

    private String reasonDetail;

    @Size(max = 1000, message = "Ghi chú tối đa 1000 ký tự")
    private String notes;

    // === Đãi ngộ & Phụ cấp ===
    private Boolean hasSalaryAdjustment;

    private String salaryNotes;

    @Valid
    private List<CreateTransferAllowanceRequest> allowances;
}
