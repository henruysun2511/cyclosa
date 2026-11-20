package com.cyclosa.offboarding.dto.response;

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
@Schema(description = "Kết quả khảo sát phỏng vấn thôi việc")
public class ExitInterviewResponse {

    @Schema(description = "ID bản ghi phỏng vấn")
    private UUID id;

    @Schema(description = "ID hồ sơ thôi việc")
    private UUID offboardingRequestId;

    @Schema(description = "ID người phỏng vấn")
    private UUID interviewerId;

    @Schema(description = "Họ tên người phỏng vấn")
    private String interviewerName;

    @Schema(description = "Ngày diễn ra phỏng vấn")
    private LocalDate interviewDate;

    @Schema(description = "Lý do chính yếu chia sẻ")
    private String primaryReason;

    @Schema(description = "Đánh giá môi trường & văn hóa")
    private String workingEnvironmentFeedback;

    @Schema(description = "Đánh giá quản lý trực tiếp")
    private String managementFeedback;

    @Schema(description = "Đánh giá chế độ đãi ngộ & thu nhập")
    private String compensationFeedback;

    @Schema(description = "Đề xuất cải thiện")
    private String improvementSuggestions;

    @Schema(description = "Sẵn sàng giới thiệu bạn bè/ứng viên")
    private Boolean willingToRecommend;

    @Schema(description = "Ghi chú của HR")
    private String notes;

    @Schema(description = "Thời điểm ghi nhận")
    private LocalDateTime createdAt;
}
