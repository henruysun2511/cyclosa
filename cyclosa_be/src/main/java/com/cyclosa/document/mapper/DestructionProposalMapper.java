package com.cyclosa.document.mapper;

import com.cyclosa.document.dto.DestructionProposalDto;
import com.cyclosa.document.entity.*;
import com.cyclosa.document.enums.CouncilVote;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DestructionProposalMapper {

    public DestructionProposal toEntity(DestructionProposalDto.CreateRequest request, UUID companyId, UUID employeeId, RetentionPolicy policy) {
        if (request == null) return null;
        return DestructionProposal.builder()
                .companyId(companyId)
                .proposalCode(request.getProposalCode().trim().toUpperCase())
                .retentionPolicy(policy)
                .proposedByEmployeeId(employeeId)
                .reason(request.getReason().trim())
                .requiredApprovalRatio(request.getRequiredApprovalRatio() != null ? request.getRequiredApprovalRatio() : new BigDecimal("100.00"))
                .build();
    }

    public DestructionProposalDto.Response toResponse(DestructionProposal entity, String proposedByEmployeeName) {
        if (entity == null) return null;

        int totalItems = entity.getItems() != null ? entity.getItems().size() : 0;
        int totalCouncil = entity.getCouncilMembers() != null ? entity.getCouncilMembers().size() : 0;
        int approved = 0;
        int rejected = 0;

        if (entity.getCouncilMembers() != null) {
            for (DestructionCouncilMember m : entity.getCouncilMembers()) {
                if (m.getVote() == CouncilVote.APPROVE) approved++;
                else if (m.getVote() == CouncilVote.REJECT) rejected++;
            }
        }

        return DestructionProposalDto.Response.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .proposalCode(entity.getProposalCode())
                .retentionPolicyName(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getName() : null)
                .proposedByEmployeeId(entity.getProposedByEmployeeId())
                .proposedByEmployeeName(proposedByEmployeeName)
                .reason(entity.getReason())
                .proposedAt(entity.getProposedAt())
                .status(entity.getStatus())
                .requiredApprovalRatio(entity.getRequiredApprovalRatio())
                .totalItems(totalItems)
                .totalCouncilMembers(totalCouncil)
                .approvedVotes(approved)
                .rejectedVotes(rejected)
                .executedAt(entity.getExecutedAt())
                .evidenceFileUrl(entity.getEvidenceFileUrl())
                .build();
    }

    public DestructionProposalDto.DetailResponse toDetailResponse(
            DestructionProposal entity,
            String proposedByEmployeeName,
            String executedByUserName,
            List<DestructionProposalDto.ProposalItemResponse> items,
            List<DestructionProposalDto.CouncilMemberResponse> councilMembers) {
        if (entity == null) return null;

        return DestructionProposalDto.DetailResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .proposalCode(entity.getProposalCode())
                .retentionPolicyId(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getId() : null)
                .retentionPolicyName(entity.getRetentionPolicy() != null ? entity.getRetentionPolicy().getName() : null)
                .proposedByEmployeeId(entity.getProposedByEmployeeId())
                .proposedByEmployeeName(proposedByEmployeeName)
                .reason(entity.getReason())
                .proposedAt(entity.getProposedAt())
                .status(entity.getStatus())
                .requiredApprovalRatio(entity.getRequiredApprovalRatio())
                .executedByUserId(entity.getExecutedByUserId())
                .executedByUserName(executedByUserName)
                .executedAt(entity.getExecutedAt())
                .evidenceFileUrl(entity.getEvidenceFileUrl())
                .certificateSha256(entity.getCertificateSha256())
                .items(items != null ? items : Collections.emptyList())
                .councilMembers(councilMembers != null ? councilMembers : Collections.emptyList())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
