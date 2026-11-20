package com.cyclosa.document.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.document.enums.DestructionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số tìm kiếm và phân trang đề xuất tiêu hủy tài liệu")
public class DestructionProposalFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo trạng thái đề xuất tiêu hủy", example = "VOTING")
    private DestructionStatus status;
}
