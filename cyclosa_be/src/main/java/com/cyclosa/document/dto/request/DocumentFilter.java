package com.cyclosa.document.dto.request;

import com.cyclosa.common.dto.request.BaseFilterRequest;
import com.cyclosa.document.enums.DocumentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Schema(description = "Tham số tìm kiếm và phân trang tài liệu số hóa")
public class DocumentFilter extends BaseFilterRequest {

    @Schema(description = "Lọc theo nhân viên sở hữu", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID employeeId;

    @Schema(description = "Lọc theo bộ hồ sơ (Dossier)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID dossierId;

    @Schema(description = "Lọc theo loại tài liệu", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
    private UUID documentTypeId;

    @Schema(description = "Lọc theo trạng thái tài liệu", example = "ARCHIVED")
    private DocumentStatus status;

    @Schema(description = "Lọc theo cờ tạm giữ pháp lý (Legal Hold)")
    private Boolean isLegalHold;
}
