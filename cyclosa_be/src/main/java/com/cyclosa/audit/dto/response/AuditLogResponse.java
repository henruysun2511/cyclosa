package com.cyclosa.audit.dto.response;

import com.cyclosa.audit.enums.AuditAction;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin tóm tắt bản ghi nhật ký kiểm toán trong danh sách")
public class AuditLogResponse {

    @Schema(description = "ID bản ghi nhật ký kiểm toán")
    private UUID id;

    @Schema(description = "Thông tin người thực hiện")
    private ActorInfoResponse actor;

    @Schema(description = "Hành động kiểm toán")
    private AuditAction action;

    @Schema(description = "Loại thực thể bị tác động", example = "CONTRACT")
    private String entityType;

    @Schema(description = "ID thực thể bị tác động")
    private String entityId;

    @Schema(description = "Chuỗi định danh / Tham chiếu thực thể hiển thị cho người dùng", example = "HĐLĐ-2026-0089 (Trần Thị B)")
    private String entityReference;

    @Schema(description = "Thời điểm chính xác thao tác diễn ra")
    private LocalDateTime occurredAt;

    @Schema(description = "Địa chỉ IP nguồn")
    private String ipAddress;

    @Schema(description = "Thông tin trình duyệt / User-Agent")
    private String userAgent;

    @Schema(description = "Mô tả tóm tắt hành động")
    private String description;
}

