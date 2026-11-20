package com.cyclosa.notification.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Kết quả phát thông báo toàn công ty")
public class BroadcastResponse {

    @Schema(description = "Số lượng người dùng đã được phát tán thông báo (fan-out)", example = "350")
    private int recipientsCount;

    @Schema(description = "Thời điểm phát sóng")
    private LocalDateTime broadcastAt;
}

