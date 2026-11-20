package com.cyclosa.assistant.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ChatRequestDto {

    @NotBlank(message = "Nội dung câu hỏi không được để trống")
    @Size(max = 2000, message = "Câu hỏi tối đa 2000 ký tự")
    @Schema(description = "Câu hỏi hoặc yêu cầu gửi đến Trợ lý AI", example = "Tôi còn bao nhiêu ngày phép năm?")
    private String query;

    @Schema(description = "ID cuộc trò chuyện (để tiếp tục chuỗi hội thoại; nếu để null hệ thống tự tạo mới)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID conversationId;
}
