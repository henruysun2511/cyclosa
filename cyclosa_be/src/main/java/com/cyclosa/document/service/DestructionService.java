package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DestructionProposalDto;
import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.request.DestructionProposalFilter;
import com.cyclosa.document.entity.*;
import com.cyclosa.document.enums.CouncilVote;
import com.cyclosa.document.enums.DestructionStatus;
import com.cyclosa.document.enums.DocumentStatus;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DestructionProposalMapper;
import com.cyclosa.document.mapper.DocumentMapper;
import com.cyclosa.document.repository.*;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.exception.EmployeeErrorCode;
import com.cyclosa.employee.repository.EmployeeRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DestructionService {

    private final DestructionProposalRepository proposalRepository;
    private final DestructionProposalItemRepository itemRepository;
    private final DestructionCouncilMemberRepository councilMemberRepository;
    private final DocumentRepository documentRepository;
    private final RetentionPolicyRepository retentionPolicyRepository;
    private final EmployeeRepository employeeRepository;

    private final DestructionProposalMapper proposalMapper;
    private final DocumentMapper documentMapper;

    @Transactional(readOnly = true)
    public List<DocumentDto.Response> getDestructionCandidates(UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        LocalDate today = LocalDate.now();
        List<Document> candidates = documentRepository.findDestructionCandidates(effectiveCompanyId, DocumentStatus.ARCHIVED, today);

        return candidates.stream().map(doc -> {
            Employee emp = employeeRepository.findById(doc.getEmployeeId()).orElse(null);
            String code = emp != null ? emp.getEmployeeCode() : null;
            String name = emp != null ? emp.getFullName() : null;
            return documentMapper.toResponse(doc, code, name);
        }).collect(Collectors.toList());
    }

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "proposedAt", "proposalCode", "status"
    );

    @Transactional(readOnly = true)
    public PageData<DestructionProposalDto.Response> getProposals(DestructionProposalFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("proposedAt", ALLOWED_SORT_FIELDS);

        Specification<DestructionProposal> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (kw != null && !kw.isEmpty()) {
                String pattern = "%" + kw.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("proposalCode")), pattern),
                        cb.like(cb.lower(root.get("reason")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<DestructionProposal> page = proposalRepository.findAll(spec, pageable);

        List<DestructionProposalDto.Response> content = page.getContent().stream().map(p -> {
            String proposerName = getUserName(p.getProposedByEmployeeId());
            return proposalMapper.toResponse(p, proposerName);
        }).collect(Collectors.toList());

        return PageData.of(page, content);
    }

    @Transactional(readOnly = true)
    public DestructionProposalDto.DetailResponse getProposalDetail(UUID id, UUID companyId) {
        DestructionProposal proposal = proposalRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DESTRUCTION_PROPOSAL_NOT_FOUND));

        String proposerName = getUserName(proposal.getProposedByEmployeeId());
        String executorName = getUserName(proposal.getExecutedByUserId());

        // Lấy danh sách items
        List<DestructionProposalDto.ProposalItemResponse> items = proposal.getItems().stream().map(item -> {
            Document doc = item.getDocument();
            Employee emp = doc != null ? employeeRepository.findById(doc.getEmployeeId()).orElse(null) : null;
            return DestructionProposalDto.ProposalItemResponse.builder()
                    .id(item.getId())
                    .documentId(doc != null ? doc.getId() : null)
                    .documentCode(doc != null ? doc.getDocumentCode() : null)
                    .documentTitle(doc != null ? doc.getTitle() : null)
                    .documentTypeName(doc != null && doc.getDocumentType() != null ? doc.getDocumentType().getName() : null)
                    .employeeFullName(emp != null ? emp.getFullName() : null)
                    .retentionUntil(item.getRetentionUntil())
                    .build();
        }).collect(Collectors.toList());

        // Lấy danh sách thành viên hội đồng
        List<DestructionProposalDto.CouncilMemberResponse> council = proposal.getCouncilMembers().stream().map(m -> {
            Employee emp = employeeRepository.findById(m.getMemberEmployeeId()).orElse(null);
            return DestructionProposalDto.CouncilMemberResponse.builder()
                    .id(m.getId())
                    .memberEmployeeId(m.getMemberEmployeeId())
                    .memberEmployeeCode(emp != null ? emp.getEmployeeCode() : null)
                    .memberFullName(emp != null ? emp.getFullName() : null)
                    .departmentName(emp != null && emp.getCurrentDepartment() != null ? emp.getCurrentDepartment().getName() : null)
                    .positionTitle(emp != null && emp.getCurrentJobTitle() != null ? emp.getCurrentJobTitle().getName() : null)
                    .councilRole(m.getCouncilRole())
                    .vote(m.getVote())
                    .votedAt(m.getVotedAt())
                    .comment(m.getComment())
                    .build();
        }).collect(Collectors.toList());

        return proposalMapper.toDetailResponse(proposal, proposerName, executorName, items, council);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "DESTRUCTION_PROPOSAL", entityIdExpression = "#result.id", description = "Lập đề xuất tiêu hủy tài liệu")
    @Transactional
    public DestructionProposalDto.Response createProposal(
            DestructionProposalDto.CreateRequest request,
            UUID companyId,
            UUID currentEmployeeId) {

        if (proposalRepository.existsByCompanyIdAndProposalCode(companyId, request.getProposalCode().trim().toUpperCase())) {
            throw new AppException(DocumentErrorCode.DESTRUCTION_PROPOSAL_CODE_EXISTS);
        }

        RetentionPolicy policy = null;
        if (request.getRetentionPolicyId() != null) {
            policy = retentionPolicyRepository.findByIdAndCompanyId(request.getRetentionPolicyId(), companyId).orElse(null);
        }

        DestructionProposal proposal = proposalMapper.toEntity(request, companyId, currentEmployeeId, policy);
        proposal.setStatus(DestructionStatus.COUNCIL_REVIEW);
        proposal = proposalRepository.save(proposal);

        // Thêm danh mục tài liệu
        for (UUID docId : request.getDocumentIds()) {
            Document doc = documentRepository.findByIdAndCompanyId(docId, companyId)
                    .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

            if (Boolean.TRUE.equals(doc.getIsLegalHold())) {
                throw new AppException(DocumentErrorCode.DOCUMENT_UNDER_LEGAL_HOLD);
            }
            if (doc.getStatus() == DocumentStatus.DESTROYED) {
                throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_DESTROYED);
            }

            DestructionProposalItem item = DestructionProposalItem.builder()
                    .proposal(proposal)
                    .document(doc)
                    .retentionUntil(doc.getRetentionUntil())
                    .build();
            itemRepository.save(item);
            proposal.getItems().add(item);
        }

        // Thêm thành viên Hội đồng xét duyệt
        for (DestructionProposalDto.CouncilMemberRequest memberReq : request.getCouncilMembers()) {
            Employee emp = employeeRepository.findById(memberReq.getEmployeeId())
                    .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

            DestructionCouncilMember member = DestructionCouncilMember.builder()
                    .proposal(proposal)
                    .memberEmployeeId(emp.getId())
                    .councilRole(memberReq.getCouncilRole())
                    .vote(CouncilVote.PENDING)
                    .build();
            councilMemberRepository.save(member);
            proposal.getCouncilMembers().add(member);
        }

        log.info("Đã lập đề xuất tiêu hủy tài liệu: {} ({}) với {} tài liệu và {} thành viên hội đồng",
                proposal.getProposalCode(), proposal.getId(), proposal.getItems().size(), proposal.getCouncilMembers().size());

        String proposerName = getUserName(currentEmployeeId);
        return proposalMapper.toResponse(proposal, proposerName);
    }

    @Auditable(action = AuditAction.APPROVE, entityType = "DESTRUCTION_PROPOSAL", entityIdExpression = "#proposalId", description = "Hội đồng biểu quyết tiêu hủy tài liệu")
    @Transactional
    public DestructionProposalDto.Response voteProposal(
            UUID proposalId,
            DestructionProposalDto.VoteRequest request,
            UUID companyId,
            UUID currentEmployeeId) {

        DestructionProposal proposal = proposalRepository.findByIdAndCompanyId(proposalId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DESTRUCTION_PROPOSAL_NOT_FOUND));

        if (proposal.getStatus() != DestructionStatus.COUNCIL_REVIEW) {
            throw new AppException(DocumentErrorCode.DESTRUCTION_NOT_APPROVED);
        }

        DestructionCouncilMember member = councilMemberRepository.findByProposalIdAndMemberEmployeeId(proposalId, currentEmployeeId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.COUNCIL_MEMBER_NOT_FOUND));

        if (member.getVote() != CouncilVote.PENDING) {
            throw new AppException(DocumentErrorCode.COUNCIL_MEMBER_ALREADY_VOTED);
        }

        member.setVote(request.getVote());
        member.setVotedAt(LocalDateTime.now());
        member.setComment(request.getComment());
        councilMemberRepository.save(member);

        // Kiểm tra xem tất cả thành viên đã biểu quyết chưa
        List<DestructionCouncilMember> members = councilMemberRepository.findAllByProposalId(proposalId);
        long votedCount = members.stream().filter(m -> m.getVote() != CouncilVote.PENDING).count();
        long approveCount = members.stream().filter(m -> m.getVote() == CouncilVote.APPROVE).count();

        if (votedCount == members.size()) {
            BigDecimal approvalRatio = BigDecimal.valueOf(approveCount)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(members.size()), 2, RoundingMode.HALF_UP);

            if (approvalRatio.compareTo(proposal.getRequiredApprovalRatio()) >= 0) {
                proposal.setStatus(DestructionStatus.APPROVED);
                log.info("Đề xuất tiêu hủy {} ĐÃ ĐƯỢC HỘI ĐỒNG PHÊ DUYỆT (Đồng thuận: {}%)", proposal.getProposalCode(), approvalRatio);
            } else {
                proposal.setStatus(DestructionStatus.REJECTED);
                log.warn("Đề xuất tiêu hủy {} BỊ HỘI ĐỒNG BÁC BỎ (Đồng thuận: {}% < {}%)",
                        proposal.getProposalCode(), approvalRatio, proposal.getRequiredApprovalRatio());
            }
            proposalRepository.save(proposal);
        }

        return proposalMapper.toResponse(proposal, getUserName(proposal.getProposedByEmployeeId()));
    }

    @Auditable(action = AuditAction.DELETE, entityType = "DESTRUCTION_PROPOSAL", entityIdExpression = "#proposalId", description = "Thực thi tiêu hủy tài liệu")
    @Transactional
    public DestructionProposalDto.Response executeDestruction(
            UUID proposalId,
            DestructionProposalDto.ExecuteRequest request,
            UUID companyId,
            UUID currentUserId) {

        DestructionProposal proposal = proposalRepository.findByIdAndCompanyId(proposalId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DESTRUCTION_PROPOSAL_NOT_FOUND));

        if (proposal.getStatus() != DestructionStatus.APPROVED) {
            throw new AppException(DocumentErrorCode.DESTRUCTION_NOT_APPROVED);
        }

        proposal.setStatus(DestructionStatus.EXECUTED);
        proposal.setExecutedByUserId(currentUserId);
        proposal.setExecutedAt(LocalDateTime.now());
        proposal.setEvidenceFileUrl(request.getEvidenceFileUrl());
        proposal.setCertificateSha256(request.getCertificateSha256());
        proposal = proposalRepository.save(proposal);

        // Đổi trạng thái tất cả tài liệu sang DESTROYED
        for (DestructionProposalItem item : proposal.getItems()) {
            Document doc = item.getDocument();
            if (doc != null) {
                doc.setStatus(DocumentStatus.DESTROYED);
                doc.setDestroyedAt(LocalDateTime.now());
                doc.setDestructionProposalId(proposal.getId());
                documentRepository.save(doc);
                log.info("Tài liệu {} ({}) đã tiêu hủy hoàn tất", doc.getTitle(), doc.getDocumentCode());
            }
        }

        log.info("THỰC THI TIÊU HỦY THÀNH CÔNG cho đề xuất: {} kèm biên bản: {}", proposal.getProposalCode(), request.getEvidenceFileUrl());
        return proposalMapper.toResponse(proposal, getUserName(proposal.getProposedByEmployeeId()));
    }

    private String getUserName(UUID userId) {
        if (userId == null) return null;
        return employeeRepository.findById(userId).map(Employee::getFullName).orElse("Hệ thống");
    }
}
