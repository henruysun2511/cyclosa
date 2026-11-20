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
@Schema(description = "Sự kiện kiểm toán trên trục thời gian Audit Trail của thực thể")
public class AuditTrailEventResponse {

    @Schema(description = "ID bản ghi nhật ký kiểm toán")
    private UUID logId;

    @Schema(description = "Thời điểm xảy ra")
    private LocalDateTime occurredAt;

    @Schema(description = "Mã hành động")
    private AuditAction action;

    @Schema(description = "Tên người thực hiện", example = "Lê Văn Cường (Chuyên viên C&B)")
    private String actorName;

    @Schema(description = "Mô tả hành động")
    private String description;
}

