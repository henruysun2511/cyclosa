package com.cyclosa.audit.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Định nghĩa hành động kiểm toán chuẩn hóa phục vụ bộ lọc giao diện")
public class AuditActionDefinitionResponse {

    @Schema(description = "Mã hành động", example = "UPDATE")
    private String code;

    @Schema(description = "Tên hiển thị tiếng Việt", example = "Cập nhật")
    private String name;

    @Schema(description = "Kiểu màu sắc nhãn Badge trên giao diện (success, info, destructive, warning, secondary, outline, default)", example = "info")
    private String badgeVariant;
}

