package com.cyclosa.notification.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.notification.enums.NotificationType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Bộ lọc danh sách thông báo của tôi")
public class NotificationFilterRequest extends BaseFilterRequest {

    @Schema(description = "Lọc theo trạng thái đọc: true = đã đọc, false = chưa đọc, null = tất cả", example = "false")
    private Boolean read;

    @Schema(description = "Lọc theo phân loại thông báo", example = "WORKFLOW")
    private NotificationType type;
}
