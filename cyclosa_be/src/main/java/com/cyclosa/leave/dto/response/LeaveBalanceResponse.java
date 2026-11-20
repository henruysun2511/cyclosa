package com.cyclosa.leave.dto.response;

import com.cyclosa.leave.enums.LeaveGroup;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin quỹ phép cá nhân theo năm (Derived State)")
public class LeaveBalanceResponse {

    @Schema(description = "ID bản ghi quỹ phép")
    private UUID id;

    @Schema(description = "ID công ty")
    private UUID companyId;

    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @Schema(description = "Mã nhân viên")
    private String employeeCode;

    @Schema(description = "Họ và tên nhân viên")
    private String employeeFullName;

    @Schema(description = "Phòng ban của nhân viên")
    private String departmentName;

    @Schema(description = "Chức danh / vị trí")
    private String jobTitleName;

    @Schema(description = "ID loại nghỉ phép")
    private UUID leaveTypeId;

    @Schema(description = "Mã loại nghỉ phép")
    private String leaveTypeCode;

    @Schema(description = "Tên loại nghỉ phép")
    private String leaveTypeName;

    @Schema(description = "Nhóm phân loại nghỉ")
    private LeaveGroup leaveGroup;

    @Schema(description = "Năm quỹ phép")
    private Integer year;

    @Schema(description = "Số ngày được cấp (lưu CSDL)")
    private BigDecimal entitledDays;

    @Schema(description = "Số ngày chuyển từ năm trước (lưu CSDL)")
    private BigDecimal carriedOverDays;

    @Schema(description = "Tổng quỹ phép (được cấp + chuyển)")
    private BigDecimal totalEntitledDays;

    @Schema(description = "Số ngày đã sử dụng (tính động từ đơn APPROVED)")
    private BigDecimal usedDays;

    @Schema(description = "Số ngày đang chờ duyệt (tính động từ đơn PENDING_APPROVAL)")
    private BigDecimal pendingDays;

    @Schema(description = "Số ngày còn lại khả dụng (tính động)")
    private BigDecimal remainingDays;

    @Schema(description = "Ghi chú quỹ phép")
    private String notes;

    @Schema(description = "Thời điểm cập nhật")
    private LocalDateTime updatedAt;
}
