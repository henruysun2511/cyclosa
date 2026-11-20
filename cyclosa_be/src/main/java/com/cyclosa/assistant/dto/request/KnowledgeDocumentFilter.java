package com.cyclosa.assistant.dto.request;

import com.cyclosa.assistant.enums.KnowledgeCategory;
import com.cyclosa.assistant.enums.KnowledgeDocumentStatus;
import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KnowledgeDocumentFilter extends BaseFilterRequest {

    @Parameter(description = "Lọc theo danh mục tri thức")
    private KnowledgeCategory category;

    @Parameter(description = "Lọc theo trạng thái tài liệu: ACTIVE, PROCESSING, ARCHIVED")
    private KnowledgeDocumentStatus status;
}
