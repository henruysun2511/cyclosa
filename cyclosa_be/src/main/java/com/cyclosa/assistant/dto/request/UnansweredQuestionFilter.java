package com.cyclosa.assistant.dto.request;

import com.cyclosa.assistant.enums.UnansweredQuestionStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnansweredQuestionFilter extends BaseFilterRequest {

    @Parameter(description = "Lọc theo trạng thái câu hỏi: PENDING_REVIEW, DOCUMENT_ADDED, DISMISSED")
    private UnansweredQuestionStatus status;
}
