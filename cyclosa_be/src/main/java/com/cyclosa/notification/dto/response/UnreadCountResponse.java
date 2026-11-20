package com.cyclosa.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Số lượng thông báo chưa đọc cho biểu tượng chuông")
public class UnreadCountResponse {

    @Schema(description = "Tổng số lượng thông báo chưa đọc", example = "5")
    private long unreadCount;
}

