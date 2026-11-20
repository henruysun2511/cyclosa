package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.client.DocumentAiClient;
import com.cyclosa.document.client.dto.DocumentAiDto;
import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.DocumentVersionDto;
import com.cyclosa.document.dto.request.DocumentFilter;
import com.cyclosa.document.entity.*;
import com.cyclosa.document.enums.DocumentFormat;
import com.cyclosa.document.enums.DocumentStatus;
import com.cyclosa.document.enums.RetentionStartEvent;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DocumentMapper;
import com.cyclosa.document.mapper.DocumentVersionMapper;
import com.cyclosa.document.repository.*;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeIdentityDocument;
import com.cyclosa.employee.entity.enums.IdentityDocumentType;
import com.cyclosa.employee.exception.EmployeeErrorCode;
import com.cyclosa.employee.repository.EmployeeIdentityDocumentRepository;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DossierRepository dossierRepository;
    private final DocumentSourceFileRepository sourceFileRepository;
    private final DocumentVersionRepository versionRepository;
    private final DocumentMetadataValueRepository metadataValueRepository;
    private final DocumentMetadataFieldRepository metadataFieldRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeIdentityDocumentRepository identityDocumentRepository;

    private final DocumentMapper documentMapper;
    private final DocumentVersionMapper versionMapper;
    private final DocumentAiClient documentAiClient;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "updatedAt", "title", "documentCode", "status", "retentionUntil"
    );

    @Transactional(readOnly = true)
    public PageData<DocumentDto.Response> getDocuments(DocumentFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<Document> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employeeId"), filter.getEmployeeId()));
            }
            if (filter.getDossierId() != null) {
                predicates.add(cb.equal(root.get("dossier").get("id"), filter.getDossierId()));
            }
            if (filter.getDocumentTypeId() != null) {
                predicates.add(cb.equal(root.get("documentType").get("id"), filter.getDocumentTypeId()));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getIsLegalHold() != null) {
                predicates.add(cb.equal(root.get("isLegalHold"), filter.getIsLegalHold()));
            }
            if (kw != null && !kw.isEmpty()) {
                String pattern = "%" + kw.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("documentCode")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Document> page = documentRepository.findAll(spec, pageable);

        List<DocumentDto.Response> content = page.getContent().stream().map(doc -> {
            Employee emp = employeeRepository.findById(doc.getEmployeeId()).orElse(null);
            String code = emp != null ? emp.getEmployeeCode() : null;
            String name = emp != null ? emp.getFullName() : null;
            return documentMapper.toResponse(doc, code, name);
        }).collect(Collectors.toList());

        return PageData.of(page, content);
    }

    @Transactional(readOnly = true)
    public DocumentDto.DetailResponse getDetailById(UUID id, UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        Document document = (effectiveCompanyId != null
                ? documentRepository.findByIdAndCompanyId(id, effectiveCompanyId)
                : documentRepository.findById(id))
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        Employee employee = employeeRepository.findById(document.getEmployeeId()).orElse(null);
        String code = employee != null ? employee.getEmployeeCode() : null;
        String name = employee != null ? employee.getFullName() : null;
        String dept = employee != null && employee.getCurrentDepartment() != null ? employee.getCurrentDepartment().getName() : null;
        String pos = employee != null && employee.getCurrentJobTitle() != null ? employee.getCurrentJobTitle().getName() : null;

        // Tên người thẩm định / người nộp lưu / người ký số
        String verifiedByName = getUserName(document.getVerifiedByUserId());
        String archivedByName = getUserName(document.getArchivedByUserId());
        String signedByName = getUserName(document.getSignedByUserId());

        // Lấy danh sách metadata values
        List<DocumentMetadataValue> metaValues = metadataValueRepository.findAllByDocumentId(id);
        List<DocumentDto.MetadataValueResponse> metaResponses = metaValues.stream().map(mv -> {
            DocumentMetadataField f = mv.getField();
            return DocumentDto.MetadataValueResponse.builder()
                    .id(mv.getId())
                    .fieldId(f != null ? f.getId() : null)
                    .fieldKey(f != null ? f.getFieldKey() : null)
                    .label(f != null ? f.getLabel() : null)
                    .value(mv.getValue())
                    .ocrConfidence(mv.getOcrConfidence())
                    .isVerified(mv.getIsVerified())
                    .build();
        }).collect(Collectors.toList());

        return documentMapper.toDetailResponse(
                document, code, name, dept, pos, verifiedByName, archivedByName, signedByName, metaResponses);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "DOCUMENT", entityIdExpression = "#result.id", description = "Khởi tạo tài liệu số hóa mới")
    @Transactional
    public DocumentDto.Response create(DocumentDto.CreateRequest request, UUID companyId, UUID currentUserId) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        DocumentType docType = documentTypeRepository.findByIdAndCompanyId(request.getDocumentTypeId(), companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_TYPE_NOT_FOUND));

        if (documentRepository.existsByCompanyIdAndDocumentCode(companyId, request.getDocumentCode().trim().toUpperCase())) {
            throw new AppException(DocumentErrorCode.DOCUMENT_CODE_EXISTS);
        }

        Dossier dossier = null;
        if (request.getDossierId() != null) {
            dossier = dossierRepository.findByIdAndCompanyId(request.getDossierId(), companyId)
                    .orElseThrow(() -> new AppException(DocumentErrorCode.DOSSIER_NOT_FOUND));
        }

        Document document = documentMapper.toEntity(request, companyId, docType, dossier);
        document = documentRepository.save(document);

        // Tạo phiên bản 1 ban đầu
        DocumentSourceFile sourceFile = null;
        if (request.getSourceFileId() != null) {
            sourceFile = sourceFileRepository.findByIdAndCompanyId(request.getSourceFileId(), companyId).orElse(null);
        }

        String fileUrl = request.getFileUrl() != null ? request.getFileUrl() : (sourceFile != null ? sourceFile.getFilePath() : "");
        String checksum = request.getSha256Checksum() != null ? request.getSha256Checksum() : UUID.randomUUID().toString().replace("-", "");
        DocumentFormat format = request.getFileFormat() != null ? request.getFileFormat() : DocumentFormat.PDF_A;
        long fileSize = request.getFileSize() != null ? request.getFileSize() : (sourceFile != null ? sourceFile.getFileSize() : 0L);

        DocumentVersion version = DocumentVersion.builder()
                .document(document)
                .versionNo(1)
                .sourceFile(sourceFile)
                .fileUrl(fileUrl)
                .fileFormat(format)
                .fileSize(fileSize)
                .sha256Checksum(checksum)
                .pageFrom(request.getPageFrom() != null ? request.getPageFrom() : 1)
                .pageTo(request.getPageTo() != null ? request.getPageTo() : 1)
                .changeReason("Bản số hóa gốc tiếp nhận ban đầu")
                .isCurrent(true)
                .build();
        versionRepository.save(version);
        document.getVersions().add(version);

        // Khởi tạo các giá trị metadata
        if (request.getMetadata() != null && !request.getMetadata().isEmpty()) {
            List<DocumentMetadataField> fields = metadataFieldRepository.findAllByDocumentTypeIdOrderByDisplayOrderAsc(docType.getId());
            for (DocumentMetadataField field : fields) {
                String val = request.getMetadata().get(field.getFieldKey());
                if (val != null) {
                    DocumentMetadataValue metaVal = DocumentMetadataValue.builder()
                            .document(document)
                            .field(field)
                            .value(val)
                            .ocrConfidence(BigDecimal.valueOf(0.9500))
                            .isVerified(false)
                            .build();
                    metadataValueRepository.save(metaVal);
                    document.getMetadataValues().add(metaVal);
                }
            }
        }

        log.info("Đã tạo hồ sơ số hóa: {} ({}) cho nhân viên: {}", document.getTitle(), document.getDocumentCode(), employee.getFullName());
        return documentMapper.toResponse(document, employee.getEmployeeCode(), employee.getFullName());
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Thẩm định và xác thực metadata OCR")
    @Transactional
    public DocumentDto.DetailResponse verifyMetadata(UUID id, DocumentDto.VerifyMetadataRequest request, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (document.getStatus() == DocumentStatus.ARCHIVED || document.getStatus() == DocumentStatus.DESTROYED) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_ARCHIVED);
        }

        // Cập nhật các trường metadata
        if (request.getMetadataValues() != null) {
            for (Map.Entry<UUID, String> entry : request.getMetadataValues().entrySet()) {
                UUID fieldId = entry.getKey();
                String val = entry.getValue();

                DocumentMetadataField field = metadataFieldRepository.findById(fieldId)
                        .orElseThrow(() -> new AppException(DocumentErrorCode.METADATA_FIELD_NOT_FOUND));

                final Document finalDoc = document;
                DocumentMetadataValue metaVal = metadataValueRepository.findByDocumentIdAndFieldId(id, fieldId)
                        .orElseGet(() -> DocumentMetadataValue.builder()
                                .document(finalDoc)
                                .field(field)
                                .build());

                metaVal.setValue(val);
                metaVal.setIsVerified(true);
                metadataValueRepository.save(metaVal);
            }
        }

        // Thẩm định thành công -> Chuyển sang VERIFIED
        document.setStatus(DocumentStatus.VERIFIED);
        document.setVerifiedByUserId(currentUserId);
        document.setVerifiedAt(LocalDateTime.now());
        document = documentRepository.save(document);

        // Đồng bộ dữ liệu sang Hồ sơ nhân viên (Module 05) nếu yêu cầu
        if (Boolean.TRUE.equals(request.getSyncToEmployeeProfile())) {
            syncToEmployeeProfile(document);
        }

        log.info("HR đã thẩm định & xác thực metadata hồ sơ: {} ({})", document.getTitle(), document.getId());
        return getDetailById(id, companyId);
    }

    @Auditable(action = AuditAction.LOCK, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Phê duyệt nộp lưu kho bất biến (AIP)")
    @Transactional
    public DocumentDto.Response archiveDocument(UUID id, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (document.getStatus() == DocumentStatus.ARCHIVED) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_ARCHIVED);
        }
        if (document.getStatus() == DocumentStatus.DRAFT) {
            throw new AppException(DocumentErrorCode.DOCUMENT_NOT_VERIFIED);
        }

        // Tính thời hạn lưu trữ dựa vào chính sách retention_policies
        RetentionPolicy policy = document.getRetentionPolicy();
        if (policy == null && document.getDocumentType() != null) {
            policy = document.getDocumentType().getRetentionPolicy();
            document.setRetentionPolicy(policy);
        }

        LocalDate retentionUntil = null;
        if (policy != null && policy.getRetentionMonths() != null && policy.getRetentionMonths() > 0) {
            LocalDate startDate = LocalDate.now();
            if (policy.getStartEvent() == RetentionStartEvent.DOCUMENT_EXPIRY_DATE && document.getExpiryDate() != null) {
                startDate = document.getExpiryDate();
            }
            retentionUntil = startDate.plusMonths(policy.getRetentionMonths());
        }

        document.setStatus(DocumentStatus.ARCHIVED);
        document.setArchivedByUserId(currentUserId);
        document.setArchivedAt(LocalDateTime.now());
        document.setRetentionUntil(retentionUntil);

        document = documentRepository.save(document);
        log.info("Tài liệu {} ({}) đã chính thức NỘP LƯU KHO BẤT BIẾN, hạn lưu trữ: {}",
                document.getTitle(), document.getDocumentCode(), retentionUntil);

        Employee employee = employeeRepository.findById(document.getEmployeeId()).orElse(null);
        String code = employee != null ? employee.getEmployeeCode() : null;
        String name = employee != null ? employee.getFullName() : null;
        return documentMapper.toResponse(document, code, name);
    }

    @Auditable(action = AuditAction.APPROVE, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Ký số chứng thực số hóa TT 05")
    @Transactional
    public DocumentDto.DigitizationSignResponse digitizationSign(UUID id, DocumentDto.DigitizationSignRequest request, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (Boolean.TRUE.equals(document.getIsDigitallySigned())) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_SIGNED);
        }

        DocumentVersion currentVersion = versionRepository.findByDocumentIdAndIsCurrentTrue(id)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_VERSION_NOT_FOUND));

        document.setIsDigitallySigned(true);
        document.setDigitallySignedAt(LocalDateTime.now());
        document.setSignedByUserId(currentUserId);
        document.setDigitalSignatureValue(request.getSignatureValue());

        documentRepository.save(document);
        log.info("Đã ký số xác thực số hóa Thông tư 05/2025/TT-BNV cho tài liệu: {} ({})", document.getTitle(), document.getDocumentCode());

        return DocumentDto.DigitizationSignResponse.builder()
                .documentId(document.getId())
                .documentCode(document.getDocumentCode())
                .isDigitallySigned(true)
                .digitallySignedAt(document.getDigitallySignedAt())
                .signedByUserId(currentUserId)
                .signedByUserName(getUserName(currentUserId))
                .sha256Checksum(currentVersion.getSha256Checksum())
                .build();
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Tải phiên bản mới thay thế")
    @Transactional
    public DocumentVersionDto.Response createNewVersion(UUID id, DocumentVersionDto.CreateVersionRequest request, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (document.getStatus() == DocumentStatus.DESTROYED) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_DESTROYED);
        }

        // Tắt cờ isCurrent của tất cả phiên bản cũ
        List<DocumentVersion> oldVersions = versionRepository.findAllByDocumentIdOrderByVersionNoDesc(id);
        for (DocumentVersion v : oldVersions) {
            v.setIsCurrent(false);
            versionRepository.save(v);
        }

        int nextVersionNo = versionRepository.findMaxVersionNoByDocumentId(id) + 1;
        DocumentSourceFile sourceFile = null;
        if (request.getSourceFileId() != null) {
            sourceFile = sourceFileRepository.findByIdAndCompanyId(request.getSourceFileId(), companyId).orElse(null);
        }

        DocumentVersion newVersion = versionMapper.toEntity(request, document, nextVersionNo, sourceFile);
        newVersion = versionRepository.save(newVersion);

        // Đánh dấu lại trạng thái nếu cần kiểm tra lại
        if (document.getStatus() == DocumentStatus.ARCHIVED) {
            document.setStatus(DocumentStatus.VERIFIED); // Cần thẩm định lại phiên bản mới trước khi tái nộp lưu
            document.setIsDigitallySigned(false); // Reset cờ ký số vì tệp đã thay đổi
            documentRepository.save(document);
        }

        log.info("Đã tải phiên bản mới (v{}) cho tài liệu: {} ({}) - Lý do: {}", nextVersionNo, document.getTitle(), id, request.getChangeReason());
        return versionMapper.toResponse(newVersion);
    }

    @Auditable(action = AuditAction.DELETE, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Xóa tài liệu số hóa nháp")
    @Transactional
    public void delete(UUID id, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        if (document.getStatus() == DocumentStatus.ARCHIVED || document.getStatus() == DocumentStatus.DESTROYED) {
            throw new AppException(DocumentErrorCode.DOCUMENT_ALREADY_ARCHIVED);
        }

        documentRepository.delete(document);
        log.info("Đã xóa tài liệu nháp: {} ({}) bởi user: {}", document.getTitle(), id, currentUserId);
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "DOCUMENT", entityIdExpression = "#id", description = "Kích hoạt bóc tách OCR thông minh")
    @Transactional
    public DocumentDto.DetailResponse performOcr(UUID id, UUID companyId, UUID currentUserId) {
        Document document = documentRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOCUMENT_NOT_FOUND));

        DocumentVersion currentVersion = document.getVersions().stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsCurrent()))
                .findFirst()
                .orElse(null);

        String fileUrl = currentVersion != null ? currentVersion.getFileUrl() : null;
        String docTypeCode = document.getDocumentType() != null ? document.getDocumentType().getCode() : "GENERAL_DOC";

        DocumentAiDto.OcrExtractRequest ocrReq = DocumentAiDto.OcrExtractRequest.builder()
                .documentId(document.getId().toString())
                .employeeId(document.getEmployeeId() != null ? document.getEmployeeId().toString() : null)
                .documentType(docTypeCode)
                .fileUrl(fileUrl)
                .build();

        var ocrOpt = documentAiClient.extractDocument(ocrReq);
        if (ocrOpt.isPresent()) {
            DocumentAiDto.OcrExtractResponse ocrRes = ocrOpt.get();
            Map<String, Object> fields = ocrRes.getExtractedFields();
            Map<String, Double> confidences = ocrRes.getFieldConfidences();

            if (fields != null && document.getDocumentType() != null) {
                List<DocumentMetadataField> metaFields = metadataFieldRepository.findAllByDocumentTypeIdOrderByDisplayOrderAsc(document.getDocumentType().getId());
                for (DocumentMetadataField field : metaFields) {
                    Object valObj = fields.get(field.getFieldKey());
                    if (valObj != null) {
                        String valStr = String.valueOf(valObj);
                        final Document finalDoc = document;
                        DocumentMetadataValue metaVal = metadataValueRepository.findByDocumentIdAndFieldId(id, field.getId())
                                .orElseGet(() -> DocumentMetadataValue.builder()
                                        .document(finalDoc)
                                        .field(field)
                                        .build());

                        metaVal.setValue(valStr);
                        Double conf = confidences != null ? confidences.get(field.getFieldKey()) : null;
                        if (conf != null) {
                            metaVal.setOcrConfidence(BigDecimal.valueOf(conf));
                        } else {
                            metaVal.setOcrConfidence(BigDecimal.valueOf(ocrRes.getOverallConfidence()));
                        }
                        metaVal.setIsVerified(false);
                        metadataValueRepository.save(metaVal);
                    }
                }
            }

            log.info("Thực hiện OCR thành công cho tài liệu {} (Overall Confidence: {}%)",
                    document.getDocumentCode(), (int) (ocrRes.getOverallConfidence() * 100));
        }

        return getDetailById(id, companyId);
    }

    private void syncToEmployeeProfile(Document document) {
        // Đồng bộ CCCD nếu loại tài liệu là CCCD
        if (document.getDocumentType() != null && "CCCD".equalsIgnoreCase(document.getDocumentType().getCode())) {
            List<DocumentMetadataValue> metaValues = metadataValueRepository.findAllByDocumentId(document.getId());
            String idNumber = null;
            LocalDate issueDate = document.getIssueDate();
            String issuePlace = null;
            LocalDate expiryDate = document.getExpiryDate();

            for (DocumentMetadataValue mv : metaValues) {
                if (mv.getField() != null) {
                    String k = mv.getField().getFieldKey();
                    if ("id_number".equalsIgnoreCase(k)) idNumber = mv.getValue();
                    if ("issue_place".equalsIgnoreCase(k)) issuePlace = mv.getValue();
                }
            }

            if (idNumber != null && !idNumber.trim().isEmpty()) {
                List<EmployeeIdentityDocument> existingList = identityDocumentRepository.findAllByEmployeeId(document.getEmployeeId());
                Optional<EmployeeIdentityDocument> existing = existingList.stream()
                        .filter(d -> d.getDocumentType() == IdentityDocumentType.CITIZEN_ID)
                        .findFirst();

                EmployeeIdentityDocument doc = existing.orElseGet(() -> {
                    Employee emp = employeeRepository.findById(document.getEmployeeId()).orElse(null);
                    return EmployeeIdentityDocument.builder()
                            .employee(emp)
                            .documentType(IdentityDocumentType.CITIZEN_ID)
                            .build();
                });

                doc.setDocumentNumber(idNumber.trim());
                if (issueDate != null) doc.setIssueDate(issueDate);
                if (issuePlace != null) doc.setIssuePlace(issuePlace);
                if (expiryDate != null) doc.setExpiryDate(expiryDate);

                identityDocumentRepository.save(doc);
                log.info("Đã tự động đồng bộ thông tin CCCD từ số hóa sang Module 05: {}", idNumber);
            }
        }
    }

    private String getUserName(UUID userId) {
        if (userId == null) return null;
        return employeeRepository.findById(userId).map(Employee::getFullName).orElse("Hệ thống");
    }
}
