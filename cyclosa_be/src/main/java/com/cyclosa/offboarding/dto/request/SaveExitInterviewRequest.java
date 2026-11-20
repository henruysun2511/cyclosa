package com.cyclosa.offboarding.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu ghi nhận / cập nhật khảo sát phỏng vấn thôi việc")
public class SaveExitInterviewRequest {

    @NotNull(message = "Người phỏng vấn không được để trống")
    @Schema(description = "ID người thực hiện phỏng vấn (HR)", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID interviewerId;

    @NotNull(message = "Ngày phỏng vấn không được để trống")
    @Schema(description = "Ngày diễn ra buổi phỏng vấn", requiredMode = Schema.RequiredMode.REQUIRED)
    private LocalDate interviewDate;

    @Schema(description = "Lý do chính yếu chia sẻ trong buổi phỏng vấn")
    private String primaryReason;

    @Schema(description = "Ý kiến phản hồi về môi trường và văn hóa doanh nghiệp")
    private String workingEnvironmentFeedback;

    @Schema(description = "Ý kiến phản hồi về phong cách quản lý và lãnh đạo trực tiếp")
    private String managementFeedback;

    @Schema(description = "Ý kiến phản hồi về chính sách đãi ngộ, lương thưởng")
    private String compensationFeedback;

    @Schema(description = "Đề xuất cải thiện dành cho doanh nghiệp")
    private String improvementSuggestions;

    @Schema(description = "Sẵn sàng giới thiệu bạn bè/ứng viên gia nhập công ty")
    @Builder.Default
    private Boolean willingToRecommend = false;

    @Schema(description = "Ghi chú bảo mật hoặc tóm tắt của HR")
    private String notes;
}
