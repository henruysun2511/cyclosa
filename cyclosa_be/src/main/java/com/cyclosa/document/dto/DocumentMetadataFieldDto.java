package com.cyclosa.document.dto;

import com.cyclosa.document.enums.MetadataDataType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

public class DocumentMetadataFieldDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cấu hình trường metadata")
    public static class CreateRequest {
        @NotBlank(message = "Mã trường không được để trống")
        @Pattern(regexp = "^[a-z0-9_]+$", message = "Mã trường chỉ chứa chữ thường, số và dấu gạch dưới")
        @Size(max = 50, message = "Mã trường tối đa 50 ký tự")
        @Schema(description = "Mã trường dữ liệu", example = "id_number")
        private String fieldKey;

        @NotBlank(message = "Nhãn hiển thị không được để trống")
        @Size(max = 100, message = "Nhãn hiển thị tối đa 100 ký tự")
        @Schema(description = "Tên hiển thị", example = "Số CCCD/CMND")
        private String label;

        @NotNull(message = "Kiểu dữ liệu không được để trống")
        @Schema(description = "Kiểu dữ liệu", example = "TEXT")
        private MetadataDataType dataType;

        @Builder.Default
        @Schema(description = "Bắt buộc nhập", example = "true")
        private Boolean isRequired = false;

        @Builder.Default
        @Schema(description = "Thứ tự hiển thị", example = "1")
        private Integer displayOrder = 0;

        @Schema(description = "Regex kiểm tra định dạng", example = "^[0-9]{12}$")
        private String validationRegex;

        @Schema(description = "Danh sách lựa chọn (JSON)", example = "[\"Đại học\", \"Cao đẳng\"]")
        private String optionsJson;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin trường metadata")
    public static class Response {
        private UUID id;
        private UUID documentTypeId;
        private String fieldKey;
        private String label;
        private MetadataDataType dataType;
        private Boolean isRequired;
        private Integer displayOrder;
        private String validationRegex;
        private String optionsJson;
    }
}
