package com.cyclosa.document.dto;

import com.cyclosa.document.enums.CouncilRole;
import com.cyclosa.document.enums.CouncilVote;
import com.cyclosa.document.enums.DestructionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class DestructionProposalDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu lập đề xuất tiêu hủy tài liệu")
    public static class CreateRequest {
        @NotBlank(message = "Mã đề xuất không được để trống")
        @Size(max = 50, message = "Mã đề xuất tối đa 50 ký tự")
        @Schema(description = "Mã đề xuất", example = "PROP-DEST-2026-001")
        private String proposalCode;

        @Schema(description = "ID chính sách lưu trữ áp dụng")
        private UUID retentionPolicyId;

        @NotBlank(message = "Lý do tiêu hủy không được để trống")
        @Schema(description = "Lý do tiêu hủy", example = "Hồ sơ ứng viên không trúng tuyển đã hết thời hạn lưu trữ 5 năm theo quy định")
        private String reason;

        @Schema(description = "Tỷ lệ phê duyệt yêu cầu (%)", example = "100.00")
        @Builder.Default
        private BigDecimal requiredApprovalRatio = new BigDecimal("100.00");

        @NotEmpty(message = "Danh sách tài liệu tiêu hủy không được để trống")
        @Schema(description = "Danh sách ID tài liệu hết hạn lưu trữ")
        private List<UUID> documentIds;

        @NotEmpty(message = "Danh sách thành viên hội đồng không được để trống")
        @Schema(description = "Danh sách thành viên hội đồng xét duyệt tiêu hủy")
        private List<CouncilMemberRequest> councilMembers;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin thành viên hội đồng đề xuất")
    public static class CouncilMemberRequest {
        @NotNull(message = "ID nhân viên thành viên hội đồng không được để trống")
        private UUID employeeId;

        @NotNull(message = "Vai trò trong hội đồng không được để trống")
        @Builder.Default
        private CouncilRole councilRole = CouncilRole.MEMBER;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu biểu quyết tiêu hủy của thành viên hội đồng")
    public static class VoteRequest {
        @NotNull(message = "Kết quả biểu quyết không được để trống")
        @Schema(description = "Biểu quyết (APPROVE / REJECT)", example = "APPROVE")
        private CouncilVote vote;

        @Schema(description = "Ý kiến biểu quyết", example = "Đồng ý tiêu hủy theo đúng quy định Thông tư 05/2025/TT-BNV")
        private String comment;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Yêu cầu thực thi tiêu hủy")
    public static class ExecuteRequest {
        @NotBlank(message = "URL biên bản tiêu hủy có chữ ký hội đồng không được để trống")
        @Schema(description = "URL biên bản tiêu hủy", example = "https://minio.../bien-ban-huy-2026.pdf")
        private String evidenceFileUrl;

        @NotBlank(message = "Mã băm SHA-256 của biên bản không được để trống")
        @Schema(description = "Mã băm SHA-256 của biên bản", example = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
        private String certificateSha256;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin thành viên hội đồng trong kết quả")
    public static class CouncilMemberResponse {
        private UUID id;
        private UUID memberEmployeeId;
        private String memberEmployeeCode;
        private String memberFullName;
        private String departmentName;
        private String positionTitle;
        private CouncilRole councilRole;
        private CouncilVote vote;
        private LocalDateTime votedAt;
        private String comment;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin tài liệu trong đề xuất tiêu hủy")
    public static class ProposalItemResponse {
        private UUID id;
        private UUID documentId;
        private String documentCode;
        private String documentTitle;
        private String documentTypeName;
        private String employeeFullName;
        private LocalDate retentionUntil;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin tóm tắt đề xuất tiêu hủy")
    public static class Response {
        private UUID id;
        private UUID companyId;
        private String proposalCode;
        private String retentionPolicyName;
        private UUID proposedByEmployeeId;
        private String proposedByEmployeeName;
        private String reason;
        private LocalDateTime proposedAt;
        private DestructionStatus status;
        private BigDecimal requiredApprovalRatio;
        private Integer totalItems;
        private Integer totalCouncilMembers;
        private Integer approvedVotes;
        private Integer rejectedVotes;
        private LocalDateTime executedAt;
        private String evidenceFileUrl;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Thông tin chi tiết đề xuất tiêu hủy")
    public static class DetailResponse {
        private UUID id;
        private UUID companyId;
        private String proposalCode;
        private UUID retentionPolicyId;
        private String retentionPolicyName;
        private UUID proposedByEmployeeId;
        private String proposedByEmployeeName;
        private String reason;
        private LocalDateTime proposedAt;
        private DestructionStatus status;
        private BigDecimal requiredApprovalRatio;
        private UUID executedByUserId;
        private String executedByUserName;
        private LocalDateTime executedAt;
        private String evidenceFileUrl;
        private String certificateSha256;
        private List<ProposalItemResponse> items;
        private List<CouncilMemberResponse> councilMembers;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
