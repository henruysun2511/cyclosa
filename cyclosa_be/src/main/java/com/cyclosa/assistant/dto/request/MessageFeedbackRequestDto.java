package com.cyclosa.assistant.dto.request;

import com.cyclosa.assistant.enums.AiMessageFeedback;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageFeedbackRequestDto {

    @NotNull(message = "Đánh giá không được để trống")
    @Schema(description = "Đánh giá chất lượng: HELPFUL hoặc NOT_HELPFUL", example = "HELPFUL")
    private AiMessageFeedback feedback;

    @Schema(description = "Ghi chú ý kiến góp ý chi tiết của người dùng", example = "Câu trả lời giải thích chi tiết, viện dẫn đúng điều khoản quy chế")
    private String note;
}
