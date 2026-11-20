package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentLegalHoldDto;
import com.cyclosa.document.entity.Document;
import com.cyclosa.document.entity.DocumentLegalHold;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DocumentLegalHoldMapper;
import com.cyclosa.document.repository.DocumentLegalHoldRepository;
import com.cyclosa.document.repository.DocumentRepository;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentLegalHoldService {

    private final DocumentLegalHoldRepository legalHoldRepository;
    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    private final DocumentLegalHoldMapper legalHoldMapper;

    @Transactional(readOnly = true)
    public List<DocumentLegalHoldDto.Response> getHoldsByDocumentId(UUID documentId) {
        List<DocumentLegalHold> list = legalHoldRepository.findAllByDocumentIdOrderByPlacedAtDesc(documentId);
        return list.stream().map(this::mapWithUserNames).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageData<DocumentLegalHoldDto.Response> getLegalHolds(UUID companyId, Pageable pageable) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        Page<DocumentLegalHold> page = legalHoldRepository.findAll(
                (root, query, cb) -> effectiveCompanyId != null
                        ? cb.equal(root.get("companyId"), effectiveCompanyId)
                        : cb.conjunction(),
                pageable
        );

        List<DocumentLegalHoldDto.Response> content = page.getContent().stream()
                .map(this::mapWithUserNames)
                .collect(Collectors.toList());

        return PageData.of(page, content);
    }

    @Auditable(action = AuditAction.LOCK, entityType = "DOCUMENT_LEGAL_HOLD", entityIdExpression = "#documentId", description = "Ban hành lệnh tạm giữ pháp lý chống tiêu hủy")
    @Transactional
    public DocumentLegalHoldDto.Response placeHold(
            UUID documentId,
            DocumentLegalHoldDto.PlaceHoldRequest request,
            UUID companyId,
            UUID currentUserId) {

        Document document = documentRepository.findByIdAndCompanyId(documentId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (document.getStatus() == com.cyclosa.document.enums.DocumentStatus.DESTROYED) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_DESTROYED);
        }

        String holdCode = "HOLD-" + System.currentTimeMillis();
        DocumentLegalHold hold = legalHoldMapper.toEntity(request, document, holdCode, currentUserId);
        hold = legalHoldRepository.save(hold);

        // Bật cờ Legal Hold trên tài liệu
        document.setIsLegalHold(true);
        documentRepository.save(document);

        log.warn("ĐÃ BAN HÀNH LỆNH TẠM GIỮ PHÁP LÝ cho tài liệu: {} ({}) - Lý do: {}", document.getTitle(), document.getDocumentCode(), request.getReason());
        return mapWithUserNames(hold);
    }

    @Auditable(action = AuditAction.UNLOCK, entityType = "DOCUMENT_LEGAL_HOLD", entityIdExpression = "#holdId", description = "Gỡ bỏ lệnh tạm giữ pháp lý")
    @Transactional
    public DocumentLegalHoldDto.Response releaseHold(
            UUID holdId,
            DocumentLegalHoldDto.ReleaseHoldRequest request,
            UUID companyId,
            UUID currentUserId) {

        DocumentLegalHold hold = legalHoldRepository.findByIdAndCompanyId(holdId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.LEGAL_HOLD_NOT_FOUND));

        if (hold.isReleased()) {
            throw new AppException(DocumentErrorCode.LEGAL_HOLD_ALREADY_RELEASED);
        }

        hold.setReleasedByUserId(currentUserId);
        hold.setReleasedAt(LocalDateTime.now());
        hold.setReleaseNote(request.getReleaseNote());
        hold = legalHoldRepository.save(hold);

        // Kiểm tra xem tài liệu còn lệnh hold nào khác chưa gỡ không
        UUID documentId = hold.getDocument().getId();
        boolean hasActiveHolds = legalHoldRepository.existsByDocumentIdAndReleasedAtIsNull(documentId);
        if (!hasActiveHolds) {
            Document doc = hold.getDocument();
            doc.setIsLegalHold(false);
            documentRepository.save(doc);
            log.info("Tài liệu {} ({}) đã được giải tỏa hoàn toàn khỏi tình trạng Tạm giữ pháp lý", doc.getTitle(), doc.getDocumentCode());
        }

        log.info("Đã gỡ bỏ lệnh tạm giữ pháp lý: {}", hold.getHoldCode());
        return mapWithUserNames(hold);
    }

    private DocumentLegalHoldDto.Response mapWithUserNames(DocumentLegalHold entity) {
        String placedByName = getUserName(entity.getPlacedByUserId());
        String releasedByName = getUserName(entity.getReleasedByUserId());
        return legalHoldMapper.toResponse(entity, placedByName, releasedByName);
    }

    private String getUserName(UUID userId) {
        if (userId == null) return null;
        return employeeRepository.findById(userId).map(Employee::getFullName).orElse("Hệ thống");
    }
}
