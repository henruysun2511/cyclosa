package com.cyclosa.document.dto;

import com.cyclosa.document.enums.DocumentFormat;
import com.cyclosa.document.enums.DocumentStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class DocumentDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu tạo mới tài liệu số hóa")
    public static class CreateRequest {
        @NotNull(message = "ID nhân viên không được để trống")
        @Schema(description = "ID nhân viên", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        private UUID employeeId;

        @Schema(description = "ID bộ hồ sơ gom nhóm")
        private UUID dossierId;

        @NotNull(message = "ID loại tài liệu không được để trống")
        @Schema(description = "ID loại tài liệu", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        private UUID documentTypeId;

        @NotBlank(message = "Mã tài liệu không được để trống")
        @Size(max = 50, message = "Mã tài liệu tối đa 50 ký tự")
        @Schema(description = "Mã tài liệu", example = "DOC-CCCD-001")
        private String documentCode;

        @NotBlank(message = "Tiêu đề tài liệu không được để trống")
        @Size(max = 255, message = "Tiêu đề tài liệu tối đa 255 ký tự")
        @Schema(description = "Tiêu đề tài liệu", example = "Căn cước công dân - Nguyễn Văn A")
        private String title;

        @Schema(description = "Ngày cấp/ban hành")
        private LocalDate issueDate;

        @Schema(description = "Ngày hết hạn giấy tờ")
        private LocalDate expiryDate;

        @Schema(description = "ID tệp nguồn SIP")
        private UUID sourceFileId;

        @Schema(description = "URL tệp PDF/ảnh")
        private String fileUrl;

        @Schema(description = "Mã băm SHA-256")
        private String sha256Checksum;

        @Schema(description = "Định dạng tệp")
        private DocumentFormat fileFormat;

        @Schema(description = "Kích thước tệp (bytes)")
        private Long fileSize;

        @Schema(description = "Trang bắt đầu")
        private Integer pageFrom;

        @Schema(description = "Trang kết thúc")
        private Integer pageTo;

        @Schema(description = "Các giá trị metadata bóc tách (fieldKey -> value)")
        private Map<String, String> metadata;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu cập nhật thông tin tài liệu")
    public static class UpdateRequest {
        @NotBlank(message = "Tiêu đề tài liệu không được để trống")
        @Size(max = 255, message = "Tiêu đề tài liệu tối đa 255 ký tự")
        @Schema(description = "Tiêu đề tài liệu", example = "Căn cước công dân - Nguyễn Văn A")
        private String title;

        @Schema(description = "ID bộ hồ sơ gom nhóm")
        private UUID dossierId;

        @Schema(description = "Ngày cấp/ban hành")
        private LocalDate issueDate;

        @Schema(description = "Ngày hết hạn giấy tờ")
        private LocalDate expiryDate;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu thẩm định & xác thực metadata (Split-screen Review)")
    public static class VerifyMetadataRequest {
        @NotNull(message = "Danh sách giá trị metadata không được để trống")
        @Schema(description = "Bản đồ giá trị metadata (fieldId -> value)")
        private Map<UUID, String> metadataValues;

        @Schema(description = "Cờ yêu cầu tự động đồng bộ sang Module 05 Hồ sơ nhân sự", example = "true")
        @Builder.Default
        private Boolean syncToEmployeeProfile = false;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu ký số xác thực số hóa (Điều 9 Khoản 6 Thông tư 05/2025/TT-BNV)")
    public static class DigitizationSignRequest {
        @NotBlank(message = "Chữ ký điện tử/mã ký số không được để trống")
        @Schema(description = "Chuỗi chữ ký số xác thực hoặc Token chứng thư số")
        private String signatureValue;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Kết quả ký số xác thực số hóa")
    public static class DigitizationSignResponse {
        private UUID documentId;
        private String documentCode;
        private Boolean isDigitallySigned;
        private LocalDateTime digitallySignedAt;
        private UUID signedByUserId;
        private String signedByUserName;
        private String sha256Checksum;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Giá trị metadata của tài liệu")
    public static class MetadataValueResponse {
        private UUID id;
        private UUID fieldId;
        private String fieldKey;
        private String label;
        private String value;
        private BigDecimal ocrConfidence;
        private Boolean isVerified;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin tài liệu tóm tắt trong danh sách")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String documentCode;
        private String title;
        private UUID dossierId;
        private String dossierTitle;
        private UUID documentTypeId;
        private String documentTypeCode;
        private String documentTypeName;
        private Boolean isSensitive;
        private UUID employeeId;
        private String employeeCode;
        private String employeeFullName;
        private DocumentStatus status;
        private Boolean isLegalHold;
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private LocalDate retentionUntil;
        private Boolean isDigitallySigned;
        private LocalDateTime digitallySignedAt;
        private Integer currentVersionNo;
        private String currentFileUrl;
        private String currentSha256;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết tài liệu phục vụ Split-screen & Thẩm định")
    public static class DetailResponse {
        private UUID id;
        private UUID companyId;
        private String documentCode;
        private String title;
        private UUID dossierId;
        private String dossierTitle;
        private UUID documentTypeId;
        private String documentTypeCode;
        private String documentTypeName;
        private Boolean isSensitive;
        private UUID employeeId;
        private String employeeCode;
        private String employeeFullName;
        private String departmentName;
        private String positionTitle;
        private DocumentStatus status;
        private Boolean isLegalHold;
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private UUID retentionPolicyId;
        private String retentionPolicyName;
        private Integer retentionMonths;
        private LocalDate retentionUntil;

        // Thẩm định
        private UUID verifiedByUserId;
        private String verifiedByUserName;
        private LocalDateTime verifiedAt;

        // Lưu kho
        private UUID archivedByUserId;
        private String archivedByUserName;
        private LocalDateTime archivedAt;

        // Ký số
        private Boolean isDigitallySigned;
        private LocalDateTime digitallySignedAt;
        private UUID signedByUserId;
        private String signedByUserName;
        private String digitalSignatureValue;

        // Tiêu hủy
        private LocalDateTime destroyedAt;
        private UUID destructionProposalId;

        // Metadata & Phiên bản
        private List<MetadataValueResponse> metadataValues;
        private List<DocumentVersionDto.Response> versions;
        private DocumentVersionDto.Response currentVersion;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
