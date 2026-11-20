package com.cyclosa.leave.dto.response;

import com.cyclosa.leave.enums.DayPortion;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Sự kiện lịch nghỉ phép dành cho Calendar View")
public class LeaveCalendarEventResponse {

    @Schema(description = "ID đơn nghỉ phép")
    private UUID id;

    @Schema(description = "ID nhân viên")
    private UUID employeeId;

    @Schema(description = "Mã nhân viên")
    private String employeeCode;

    @Schema(description = "Họ và tên nhân viên")
    private String employeeFullName;

    @Schema(description = "Tên phòng ban")
    private String departmentName;

    @Schema(description = "Mã loại nghỉ")
    private String leaveTypeCode;

    @Schema(description = "Tên loại nghỉ")
    private String leaveTypeName;

    @Schema(description = "Nhóm phân loại nghỉ")
    private LeaveGroup leaveGroup;

    @Schema(description = "Ngày bắt đầu")
    private LocalDate startDate;

    @Schema(description = "Ngày kết thúc")
    private LocalDate endDate;

    @Schema(description = "Buổi nghỉ")
    private DayPortion dayPortion;

    @Schema(description = "Số ngày nghỉ")
    private BigDecimal daysCount;

    @Schema(description = "Trạng thái đơn")
    private LeaveRequestStatus status;
}
