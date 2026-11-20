package com.cyclosa.reward.dto.response;

import com.cyclosa.reward.enums.DisciplineForm;
import com.cyclosa.reward.enums.DisciplineStatus;
import com.cyclosa.reward.enums.ViolationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Thông tin tóm tắt hồ sơ kỷ luật")
public class DisciplineCaseResponse {

    private UUID id;
    private UUID companyId;
    private UUID employeeId;
    private String employeeName;
    private String employeeCode;
    private String departmentName;

    private LocalDate violationDate;
    private ViolationCategory violationCategory;
    private String violationDescription;

    private DisciplineForm disciplineForm;
    private Integer salaryExtensionMonths;
    private DisciplineStatus status;

    private UUID decidedByEmployeeId;
    private String decidedByEmployeeName;
    private LocalDate decidedAt;

    @Schema(description = "Ngày quyết định hết hiệu lực (xóa án) - tính toán động")
    private LocalDate expiryDate;

    @Schema(description = "Trạng thái đã hết hiệu lực xóa án - tính toán động")
    private Boolean isExpired;

    @Schema(description = "Thời hiệu xử lý còn lại (tháng)")
    private Long remainingLimitationMonths;

    @Schema(description = "Cờ trạng thái đã gắn khấu trừ vào bảng lương")
    private Boolean pushedToPayroll;

    private LocalDateTime createdAt;
}
