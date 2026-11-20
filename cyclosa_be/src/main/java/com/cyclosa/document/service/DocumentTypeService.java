package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentMetadataFieldDto;
import com.cyclosa.document.dto.DocumentTypeDto;
import com.cyclosa.document.entity.DocumentMetadataField;
import com.cyclosa.document.entity.DocumentType;
import com.cyclosa.document.entity.RetentionPolicy;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DocumentMetadataFieldMapper;
import com.cyclosa.document.mapper.DocumentTypeMapper;
import com.cyclosa.document.repository.DocumentMetadataFieldRepository;
import com.cyclosa.document.repository.DocumentRepository;
import com.cyclosa.document.repository.DocumentTypeRepository;
import com.cyclosa.document.repository.RetentionPolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentTypeService {

    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentMetadataFieldRepository metadataFieldRepository;
    private final RetentionPolicyRepository retentionPolicyRepository;
    private final DocumentRepository documentRepository;
    private final DocumentTypeMapper documentTypeMapper;
    private final DocumentMetadataFieldMapper metadataFieldMapper;

    @Transactional(readOnly = true)
    public List<DocumentTypeDto.SimpleResponse> getSimpleList(UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        List<DocumentType> list = effectiveCompanyId != null
                ? documentTypeRepository.findAllByCompanyId(effectiveCompanyId)
                : documentTypeRepository.findAll();
        return documentTypeMapper.toSimpleResponseList(list);
    }

    @Transactional(readOnly = true)
    public PageData<DocumentTypeDto.Response> getDocumentTypes(UUID companyId, Pageable pageable) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        Page<DocumentType> page = documentTypeRepository.findAll(
                (root, query, cb) -> effectiveCompanyId != null
                        ? cb.equal(root.get("companyId"), effectiveCompanyId)
                        : cb.conjunction(),
                pageable
        );
        List<DocumentTypeDto.Response> content = documentTypeMapper.toResponseList(page.getContent());
        return PageData.of(page, content);
    }

    @Transactional(readOnly = true)
    public DocumentTypeDto.Response getById(UUID id, UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        DocumentType docType = (effectiveCompanyId != null
                ? documentTypeRepository.findByIdAndCompanyId(id, effectiveCompanyId)
                : documentTypeRepository.findById(id))
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));
        return documentTypeMapper.toResponse(docType);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "DOCUMENT_TYPE", entityIdExpression = "#result.id", description = "Tạo mới loại tài liệu số hóa")
    @Transactional
    public DocumentTypeDto.Response create(DocumentTypeDto.CreateRequest request, UUID companyId) {
        if (documentTypeRepository.existsByCompanyIdAndCode(companyId, request.getCode().trim().toUpperCase())) {
            throw new AppException(DocumentErrorCode.DOCUMENT_TYPE_CODE_EXISTS);
        }

        RetentionPolicy policy = null;
        if (request.getRetentionPolicyId() != null) {
            policy = retentionPolicyRepository.findByIdAndCompanyId(request.getRetentionPolicyId(), companyId)
                    .orElseThrow(() -> new AppException(DocumentErrorCode.RETENTION_POLICY_NOT_FOUND));
        }

        DocumentType docType = documentTypeMapper.toEntity(request, companyId, policy);
        docType = documentTypeRepository.save(docType);

        if (request.getMetadataFields() != null && !request.getMetadataFields().isEmpty()) {
            for (DocumentMetadataFieldDto.CreateRequest fieldReq : request.getMetadataFields()) {
                DocumentMetadataField field = metadataFieldMapper.toEntity(fieldReq, docType);
                metadataFieldRepository.save(field);
                docType.getMetadataFields().add(field);
            }
        }

        log.info("Đã tạo loại tài liệu: {} ({}) cho công ty: {}", docType.getName(), docType.getCode(), companyId);
        return documentTypeMapper.toResponse(docType);
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "DOCUMENT_TYPE", entityIdExpression = "#id", description = "Cập nhật loại tài liệu số hóa")
    @Transactional
    public DocumentTypeDto.Response update(UUID id, DocumentTypeDto.UpdateRequest request, UUID companyId) {
        DocumentType docType = documentTypeRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));

        RetentionPolicy policy = null;
        if (request.getRetentionPolicyId() != null) {
            policy = retentionPolicyRepository.findByIdAndCompanyId(request.getRetentionPolicyId(), companyId)
                    .orElseThrow(() -> new AppException(DocumentErrorCode.RETENTION_POLICY_NOT_FOUND));
        }

        documentTypeMapper.updateEntity(docType, request, policy);
        docType = documentTypeRepository.save(docType);
        log.info("Đã cập nhật loại tài liệu: {} ({})", docType.getName(), docType.getId());
        return documentTypeMapper.toResponse(docType);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "DOCUMENT_METADATA_FIELD", entityIdExpression = "#result.id", description = "Thêm trường metadata cho loại tài liệu")
    @Transactional
    public DocumentMetadataFieldDto.Response addMetadataField(UUID documentTypeId, DocumentMetadataFieldDto.CreateRequest request, UUID companyId) {
        DocumentType docType = documentTypeRepository.findByIdAndCompanyId(documentTypeId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));

        if (metadataFieldRepository.existsByDocumentTypeIdAndFieldKey(documentTypeId, request.getFieldKey().trim().toLowerCase())) {
            throw new AppException(DocumentErrorCode.METADATA_FIELD_KEY_EXISTS);
        }

        DocumentMetadataField field = metadataFieldMapper.toEntity(request, docType);
        field = metadataFieldRepository.save(field);
        log.info("Đã thêm trường metadata: {} ({}) cho loại tài liệu: {}", field.getLabel(), field.getFieldKey(), docType.getCode());
        return metadataFieldMapper.toResponse(field);
    }

    @Transactional
    public void deleteMetadataField(UUID documentTypeId, UUID fieldId, UUID companyId) {
        DocumentType docType = documentTypeRepository.findByIdAndCompanyId(documentTypeId, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));

        DocumentMetadataField field = metadataFieldRepository.findById(fieldId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.METADATA_FIELD_NOT_FOUND));

        if (!field.getDocumentType().getId().equals(docType.getId())) {
            throw new AppException(DocumentErrorCode.METADATA_FIELD_NOT_FOUND);
        }

        metadataFieldRepository.delete(field);
        log.info("Đã xóa trường metadata: {} khỏi loại tài liệu: {}", field.getFieldKey(), docType.getCode());
    }

    @Transactional
    public void delete(UUID id, UUID companyId) {
        DocumentType docType = documentTypeRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));

        if (documentRepository.existsByDocumentTypeId(id)) {
            throw new AppException(DocumentErrorCode.DOCUMENT_TYPE_IN_USE);
        }

        documentTypeRepository.delete(docType);
        log.info("Đã xóa loại tài liệu: {} ({})", docType.getName(), id);
    }
}
