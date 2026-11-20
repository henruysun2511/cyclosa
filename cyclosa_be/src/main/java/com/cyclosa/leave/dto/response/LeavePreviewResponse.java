package com.cyclosa.leave.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả xem trước tính toán ngày nghỉ phép")
public class LeavePreviewResponse {

    @Schema(description = "Tổng số ngày tính nghỉ thực tế (đã loại trừ thứ 7, CN và ngày lễ)")
    private BigDecimal daysCount;

    @Schema(description = "Số ngày rơi vào thứ 7 và Chủ Nhật (không tính vào phép)")
    private int weekendDays;

    @Schema(description = "Số ngày rơi vào ngày lễ, Tết (không tính vào phép)")
    private int holidayDays;

    @Schema(description = "Danh sách các ngày cụ thể rơi vào ngày lễ")
    private List<LocalDate> holidayDates;

    @Schema(description = "Số dư quỹ phép khả dụng hiện tại")
    private BigDecimal currentRemainingDays;

    @Schema(description = "Số dư dự kiến còn lại sau khi đơn này được duyệt")
    private BigDecimal projectedRemainingDays;

    @Schema(description = "Đủ số dư phép để nộp đơn hay không")
    private boolean isBalanceSufficient;

    @Schema(description = "Loại nghỉ này có cần phê duyệt qua quy trình hay tự động duyệt")
    private boolean requiresApproval;
}
