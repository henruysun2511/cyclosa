package com.cyclosa.document.dto;

import com.cyclosa.document.enums.LegalHoldReason;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentLegalHoldDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu ban hành lệnh tạm giữ pháp lý")
    public static class PlaceHoldRequest {
        @NotNull(message = "Lý do tạm giữ không được để trống")
        @Schema(description = "Lý do tạm giữ", example = "DISPUTE")
        private LegalHoldReason reason;

        @NotBlank(message = "Ghi chú lý do tạm giữ không được để trống")
        @Schema(description = "Ghi chú chi tiết vụ việc/cơ quan thụ lý", example = "Phục vụ giải quyết tranh chấp lao động theo yêu cầu Tòa án")
        private String note;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu gỡ bỏ lệnh tạm giữ pháp lý")
    public static class ReleaseHoldRequest {
        @NotBlank(message = "Lý do gỡ bỏ tạm giữ không được để trống")
        @Schema(description = "Ghi chú giải tỏa lệnh tạm giữ", example = "Vụ án đã có bản án có hiệu lực pháp luật, kết thúc tranh chấp")
        private String releaseNote;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin lệnh tạm giữ pháp lý")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private UUID documentId;
        private String documentCode;
        private String documentTitle;
        private String holdCode;
        private LegalHoldReason reason;
        private String note;
        private UUID placedByUserId;
        private String placedByUserName;
        private LocalDateTime placedAt;
        private UUID releasedByUserId;
        private String releasedByUserName;
        private LocalDateTime releasedAt;
        private String releaseNote;
        private Boolean isReleased;
    }
}
