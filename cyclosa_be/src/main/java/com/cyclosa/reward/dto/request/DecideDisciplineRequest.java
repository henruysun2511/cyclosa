package com.cyclosa.reward.dto.request;

import com.cyclosa.reward.enums.DisciplineForm;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Yêu cầu ban hành quyết định kỷ luật (không áp dụng cho SA_THAI)")
public class DecideDisciplineRequest {

    @NotNull(message = "Hình thức kỷ luật không được để trống")
    @Schema(description = "Hình thức kỷ luật (KHIEN_TRACH, KEO_DAI_NANG_LUONG, CACH_CHUC)")
    private DisciplineForm disciplineForm;

    @Schema(description = "Số tháng kéo dài nâng lương (<= 6 tháng, bắt buộc khi KEO_DAI_NANG_LUONG)")
    private Integer salaryExtensionMonths;

    @Schema(description = "Căn cứ điều khoản Nội quy lao động")
    private String ruleBasis;

    @Schema(description = "Ngày tổ chức cuộc họp")
    private LocalDate meetingDate;

    @Schema(description = "Nội dung & kết luận cuộc họp")
    private String meetingNote;

    @Schema(description = "Lý do và kết luận xử lý")
    private String reason;

    @NotNull(message = "Người ban hành quyết định không được để trống")
    @Schema(description = "ID người ban hành quyết định")
    private UUID decidedByEmployeeId;

    @NotNull(message = "Ngày ban hành quyết định không được để trống")
    @Schema(description = "Ngày ban hành quyết định")
    private LocalDate decidedAt;
}

