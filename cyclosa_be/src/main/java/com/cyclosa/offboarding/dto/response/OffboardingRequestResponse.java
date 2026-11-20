package com.cyclosa.offboarding.dto.response;

import com.cyclosa.offboarding.enums.OffboardingStatus;
import com.cyclosa.offboarding.enums.OffboardingType;
import com.cyclosa.offboarding.enums.ResignationReason;
import com.cyclosa.offboarding.enums.TerminationReason;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin chi tiết hồ sơ thôi việc / quyết định chấm dứt HĐLĐ")
public class OffboardingRequestResponse {

    @Schema(description = "ID hồ sơ")
    private UUID id;

    // Nhân viên
    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @Schema(description = "Mã nhân viên")
    private String employeeCode;

    @Schema(description = "Họ và tên nhân viên")
    private String employeeName;

    @Schema(description = "Tên phòng ban")
    private String departmentName;

    @Schema(description = "Tên chức vụ")
    private String positionName;

    @Schema(description = "Ảnh đại diện nhân viên")
    private String avatarUrl;

    // Thông tin phân loại & Trạng thái
    @Schema(description = "Loại hồ sơ")
    private OffboardingType type;

    @Schema(description = "Trạng thái hồ sơ")
    private OffboardingStatus status;

    // Đơn xin thôi việc
    @Schema(description = "Lý do xin thôi việc")
    private ResignationReason resignationReason;

    @Schema(description = "Ngày gửi thông báo")
    private LocalDate noticeDate;

    @Schema(description = "Ngày mong muốn làm việc cuối cùng")
    private LocalDate desiredLastWorkingDate;

    // Quyết định chấm dứt
    @Schema(description = "Lý do chấm dứt")
    private TerminationReason terminationReason;

    @Schema(description = "ID biên bản kỷ luật (nếu có)")
    private UUID disciplineId;

    @Schema(description = "Số quyết định")
    private String decisionNumber;

    @Schema(description = "Ngày quyết định")
    private LocalDate decisionDate;

    // Bàn giao & Thời hạn
    @Schema(description = "Ngày làm việc cuối cùng chính thức")
    private LocalDate actualLastWorkingDate;

    @Schema(description = "ID người tiếp nhận bàn giao")
    private UUID successorId;

    @Schema(description = "Họ tên người tiếp nhận bàn giao")
    private String successorName;

    @Schema(description = "Chi tiết lý do")
    private String reasonDetail;

    @Schema(description = "Ghi chú")
    private String notes;

    // Phê duyệt
    @Schema(description = "ID người duyệt")
    private UUID approverId;

    @Schema(description = "Họ tên người duyệt")
    private String approverName;

    @Schema(description = "Thời điểm duyệt")
    private LocalDateTime approvedAt;

    @Schema(description = "Lý do từ chối")
    private String rejectionReason;

    @Schema(description = "Thời điểm hoàn tất thủ tục")
    private LocalDateTime completedAt;

    // Tiến độ bàn giao
    @Schema(description = "Tổng số hạng mục bàn giao")
    @Builder.Default
    private int totalClearanceItems = 5;

    @Schema(description = "Số hạng mục đã xác nhận hoàn tất")
    @Builder.Default
    private int clearedItemsCount = 0;

    @Schema(description = "Tỷ lệ phần trăm hoàn tất bàn giao")
    @Builder.Default
    private int clearanceProgressPercent = 0;

    @Schema(description = "Thời điểm tạo")
    private LocalDateTime createdAt;

    @Schema(description = "Thời điểm cập nhật")
    private LocalDateTime updatedAt;
}
