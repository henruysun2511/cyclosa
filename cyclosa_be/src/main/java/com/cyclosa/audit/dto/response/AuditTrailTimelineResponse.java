package com.cyclosa.audit.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Lịch sử truy vết thực thể (Audit Trail Timeline)")
public class AuditTrailTimelineResponse {

    @Schema(description = "Loại thực thể", example = "CONTRACT")
    private String entityType;

    @Schema(description = "ID thực thể", example = "741")
    private String entityId;

    @Schema(description = "Tổng số sự kiện biến động được ghi nhận")
    private int totalEvents;

    @Schema(description = "Trục thời gian các sự kiện sắp xếp từ quá khứ đến hiện tại (occurredAt ASC)")
    private List<AuditTrailEventResponse> timeline;
}

