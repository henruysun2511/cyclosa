package com.cyclosa.assistant.dto.request;

import com.cyclosa.assistant.enums.KnowledgeCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateKnowledgeDocumentRequestDto {

    @NotBlank(message = "Tiêu đề tài liệu không được để trống")
    @Size(max = 500, message = "Tiêu đề tài liệu tối đa 500 ký tự")
    @Schema(description = "Tiêu đề tài liệu quy chế", example = "Nội quy lao động và chính sách phúc lợi 2026")
    private String title;

    @NotNull(message = "Danh mục tài liệu không được để trống")
    @Schema(description = "Danh mục tri thức", example = "HR_POLICY")
    private KnowledgeCategory category;

    @Schema(description = "Phiên bản tài liệu", example = "v2.0")
    private String version = "v1.0";

    @Schema(description = "URL tải file tài liệu đính kèm (PDF/DOCX)", example = "/uploads/kb/noi-quy-2026.pdf")
    private String fileUrl;

    @Schema(description = "Dung lượng file tính theo bytes", example = "2048500")
    private Long fileSize;

    @Schema(description = "Nội dung văn bản thô để bóc tách chunk ngay (nếu không dùng file đính kèm)")
    private String content;
}
