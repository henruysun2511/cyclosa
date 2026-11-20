package com.cyclosa.audit.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Chi tiết trường dữ liệu có sự biến động giữa 2 trạng thái")
public class ChangedFieldResponse {

    @Schema(description = "Tên kỹ thuật của trường dữ liệu", example = "baseSalary")
    private String field;

    @Schema(description = "Tên hiển thị tiếng Việt thân thiện", example = "Lương cơ bản")
    private String displayName;

    @Schema(description = "Giá trị trước khi thay đổi")
    private Object oldValue;

    @Schema(description = "Giá trị sau khi thay đổi")
    private Object newValue;
}

