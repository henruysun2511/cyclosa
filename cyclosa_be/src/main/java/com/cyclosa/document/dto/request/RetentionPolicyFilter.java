package com.cyclosa.document.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Tham số tìm kiếm và phân trang chính sách lưu trữ tài liệu")
public class RetentionPolicyFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo trạng thái kích hoạt", example = "true")
    private Boolean isActive;
}
