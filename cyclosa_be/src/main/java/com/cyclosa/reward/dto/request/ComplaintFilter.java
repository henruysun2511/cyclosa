package com.cyclosa.reward.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.reward.enums.ComplaintCategory;
import com.cyclosa.reward.enums.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số lọc danh sách khiếu nại nội bộ")
public class ComplaintFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo trạng thái khiếu nại")
    private ComplaintStatus status;

    @Schema(description = "Lọc theo nhóm khiếu nại")
    private ComplaintCategory category;
}

