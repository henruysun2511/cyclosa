package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.DisciplineForm;
import com.cyclosa.reward.enums.ViolationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu cập nhật hồ sơ kỷ luật ở trạng thái DRAFT")
public class UpdateDisciplineCaseRequest {

    @Schema(description = "Ngày xảy ra vi phạm")
    private LocalDate violationDate;

    @Schema(description = "Nhóm vi phạm")
    private ViolationCategory violationCategory;

    @Schema(description = "Mô tả vi phạm")
    private String violationDescription;

    @Schema(description = "Căn cứ điều khoản Nội quy lao động")
    private String ruleBasis;

    @Schema(description = "Ngày tổ chức họp xử lý kỷ luật")
    private LocalDate meetingDate;

    @Schema(description = "Nội dung & biên bản cuộc họp")
    private String meetingNote;

    @Schema(description = "Hình thức kỷ luật đề xuất")
    private DisciplineForm disciplineForm;

    @Schema(description = "Số tháng kéo dài nâng lương (<= 6 tháng)")
    private Integer salaryExtensionMonths;

    @Schema(description = "Lý do xử lý kỷ luật")
    private String reason;

    @Schema(description = "ID người ban hành quyết định")
    private UUID decidedByEmployeeId;

    @Schema(description = "Ngày ban hành quyết định")
    private LocalDate decidedAt;
}

