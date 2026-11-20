package com.cyclosa.assistant.exception;

import com.cyclosa.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AssistantErrorCode implements ErrorCode {

    CONVERSATION_NOT_FOUND(4801, "Không tìm thấy cuộc hội thoại yêu cầu", HttpStatus.NOT_FOUND),
    MESSAGE_NOT_FOUND(4802, "Không tìm thấy tin nhắn yêu cầu", HttpStatus.NOT_FOUND),
    KNOWLEDGE_DOC_NOT_FOUND(4803, "Không tìm thấy tài liệu tri thức yêu cầu", HttpStatus.NOT_FOUND),
    UNANSWERED_QUESTION_NOT_FOUND(4804, "Không tìm thấy câu hỏi chưa giải đáp", HttpStatus.NOT_FOUND),
    RATE_LIMIT_EXCEEDED(4805, "Đã vượt quá hạn mức số câu hỏi AI trong khoảng thời gian này. Vui lòng thử lại sau.", HttpStatus.TOO_MANY_REQUESTS),
    MESSAGE_TOO_LONG(4806, "Độ dài câu hỏi vượt quá giới hạn cho phép (tối đa 2000 ký tự)", HttpStatus.BAD_REQUEST),
    AI_SERVICE_UNAVAILABLE(4807, "Dịch vụ AI hiện không khả dụng hoặc phản hồi quá thời gian chờ", HttpStatus.SERVICE_UNAVAILABLE);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
