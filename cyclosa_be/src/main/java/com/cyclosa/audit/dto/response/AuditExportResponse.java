package com.cyclosa.audit.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Thông tin phản hồi tiến trình xuất file nhật ký kiểm toán")
public class AuditExportResponse {

    @Schema(description = "Mã định danh tác vụ xuất file", example = "JOB-AUDIT-EXP-20261114-001")
    private String jobId;

    @Schema(description = "Số lượng bản ghi ước tính được xuất")
    private long estimatedRecords;

    @Schema(description = "Đường dẫn tải file đã xuất")
    private String downloadUrl;

    @Schema(description = "Trạng thái tác vụ xuất file (PROCESSING, COMPLETED, FAILED)", example = "COMPLETED")
    private String status;
}

