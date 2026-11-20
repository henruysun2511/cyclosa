package com.cyclosa.leave.dto.response;

import com.cyclosa.leave.enums.DayPortion;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeavePayer;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chi tiết đơn xin nghỉ phép")
public class LeaveRequestResponse {

    @Schema(description = "ID đơn xin nghỉ phép")
    private UUID id;

    @Schema(description = "ID công ty")
    private UUID companyId;

    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @Schema(description = "Mã nhân viên")
    private String employeeCode;

    @Schema(description = "Họ và tên nhân viên")
    private String employeeFullName;

    @Schema(description = "Phòng ban nhân viên")
    private String departmentName;

    @Schema(description = "Chức vụ / Vị trí")
    private String jobTitleName;

    @Schema(description = "ID người lập đơn")
    private UUID requestedByUserId;

    @Schema(description = "Tên người lập đơn")
    private String requestedByUserName;

    @Schema(description = "ID loại nghỉ")
    private UUID leaveTypeId;

    @Schema(description = "Mã loại nghỉ")
    private String leaveTypeCode;

    @Schema(description = "Tên loại nghỉ")
    private String leaveTypeName;

    @Schema(description = "Nhóm phân loại nghỉ")
    private LeaveGroup leaveGroup;

    @Schema(description = "Nguồn chi trả chế độ")
    private LeavePayer payer;

    @Schema(description = "Ngày bắt đầu nghỉ")
    private LocalDate startDate;

    @Schema(description = "Ngày kết thúc nghỉ")
    private LocalDate endDate;

    @Schema(description = "Buổi nghỉ (FULL_DAY, MORNING, AFTERNOON)")
    private DayPortion dayPortion;

    @Schema(description = "Số ngày nghỉ tính toán đã chốt khi nộp")
    private BigDecimal daysCount;

    @Schema(description = "Lý do xin nghỉ")
    private String reason;

    @Schema(description = "Thời điểm nộp đơn")
    private LocalDateTime submittedAt;

    @Schema(description = "Trạng thái đơn (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, CANCELLED)")
    private LeaveRequestStatus status;

    @Schema(description = "ID phiếu workflow phê duyệt (nếu có)")
    private UUID workflowRequestId;

    @Schema(description = "Lý do từ chối (nếu bị REJECTED)")
    private String rejectionReason;

    @Schema(description = "Thời điểm hủy đơn (nếu bị CANCELLED)")
    private LocalDateTime cancelledAt;

    @Schema(description = "ID người hủy đơn")
    private UUID cancelledBy;

    @Schema(description = "Thời điểm tạo")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm cập nhật")
    private LocalDateTime updatedAt;
}
