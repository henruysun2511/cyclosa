package com.cyclosa.audit.dto.response;

import com.cyclosa.audit.enums.AuditAction;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Chi tiết bản ghi nhật ký kiểm toán kèm snapshot và danh sách trường biến động")
public class AuditLogDetailResponse {

    @Schema(description = "ID bản ghi nhật ký kiểm toán")
    private UUID id;

    @Schema(description = "Thông tin chi tiết người thực hiện")
    private ActorInfoResponse actor;

    @Schema(description = "Hành động kiểm toán")
    private AuditAction action;

    @Schema(description = "Loại thực thể bị tác động")
    private String entityType;

    @Schema(description = "ID thực thể bị tác động")
    private String entityId;

    @Schema(description = "Thời điểm diễn ra thao tác")
    private LocalDateTime occurredAt;

    @Schema(description = "Địa chỉ IP nguồn")
    private String ipAddress;

    @Schema(description = "Thông tin trình duyệt / User-Agent")
    private String userAgent;

    @Schema(description = "Mô tả chi tiết")
    private String description;

    @Schema(description = "Snapshot dữ liệu trước khi thay đổi (JSON Object)")
    private Object oldValue;

    @Schema(description = "Snapshot dữ liệu sau khi thay đổi (JSON Object)")
    private Object newValue;

    @Schema(description = "Danh sách chi tiết các trường có sự thay đổi giữa oldValue và newValue")
    private List<ChangedFieldResponse> changedFields;
}

