package com.cyclosa.document.service;

import com.cyclosa.common.exception.AppException;
import com.cyclosa.document.client.DocumentAiClient;
import com.cyclosa.document.client.dto.DocumentAiDto;
import com.cyclosa.document.dto.DocumentSourceFileDto;
import com.cyclosa.document.entity.DocumentSourceFile;
import com.cyclosa.document.enums.OcrStatus;
import com.cyclosa.document.enums.SourceQualityStatus;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DocumentSourceFileMapper;
import com.cyclosa.document.repository.DocumentSourceFileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentSourceFileService {

    private final DocumentSourceFileRepository sourceFileRepository;
    private final DocumentSourceFileMapper sourceFileMapper;
    private final DocumentAiClient documentAiClient;

    @Transactional
    public DocumentSourceFileDto.Response uploadSourceFile(
            MultipartFile file,
            Integer dpi,
            Integer totalPages,
            UUID companyId,
            UUID userId) {

        if (file == null || file.isEmpty()) {
            throw new AppException(DocumentErrorCode.SOURCE_FILE_NOT_FOUND);
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
        String mimeType = file.getContentType() != null ? file.getContentType() : "application/pdf";
        long size = file.getSize();

        // 1. Thẩm định kỹ thuật tự động qua Cyclosa AI Microservice (TT 05/2025/TT-BNV)
        int effectiveDpi = (dpi != null && dpi > 0) ? dpi : 300;
        SourceQualityStatus qualityStatus = effectiveDpi >= 300 ? SourceQualityStatus.ACCEPTED : SourceQualityStatus.PENDING_CHECK;
        String rejectionReason = null;

        try {
            String b64 = Base64.getEncoder().encodeToString(file.getBytes());
            DocumentAiDto.QualityCheckRequest qcReq = DocumentAiDto.QualityCheckRequest.builder()
                    .fileName(originalFilename)
                    .fileBase64(b64)
                    .build();

            var qcOpt = documentAiClient.checkQuality(qcReq);
            if (qcOpt.isPresent()) {
                DocumentAiDto.QualityCheckResponse qcRes = qcOpt.get();
                effectiveDpi = qcRes.getDpi();
                if (qcRes.isDpiValid() && !qcRes.isBlurry()) {
                    qualityStatus = SourceQualityStatus.ACCEPTED;
                    rejectionReason = null;
                } else {
                    qualityStatus = SourceQualityStatus.PENDING_CHECK;
                    rejectionReason = qcRes.getDetails();
                }
                log.info("Kết quả kiểm định TT 05 từ Cyclosa AI: DPI={}, Valid={}, Blurry={}, Status={}",
                        qcRes.getDpi(), qcRes.isDpiValid(), qcRes.isBlurry(), qualityStatus);
            }
        } catch (Exception e) {
            log.warn("Không thể thẩm định chất lượng tệp qua AI, dùng mặc định: {}", e.getMessage());
            if (effectiveDpi < 300) {
                rejectionReason = "Độ phân giải " + effectiveDpi + " DPI chưa đạt ngưỡng tối thiểu 300 DPI theo Thông tư 05/2025/TT-BNV";
            }
        }

        // Mô phỏng đường dẫn lưu trữ an toàn (MinIO / S3)
        String storedPath = "/storage/documents/" + companyId + "/" + UUID.randomUUID() + "_" + originalFilename;

        DocumentSourceFile sourceFile = DocumentSourceFile.builder()
                .companyId(companyId)
                .fileName(originalFilename)
                .filePath(storedPath)
                .fileSize(size)
                .mimeType(mimeType)
                .dpi(effectiveDpi)
                .totalPages(totalPages != null && totalPages > 0 ? totalPages : 1)
                .qualityStatus(qualityStatus)
                .rejectionReason(rejectionReason)
                .ocrStatus(OcrStatus.PENDING)
                .uploadedByUserId(userId)
                .uploadedAt(LocalDateTime.now())
                .build();

        sourceFile = sourceFileRepository.save(sourceFile);
        log.info("Đã tiếp nhận tệp số hóa SIP: {} ({}) DPI: {} Trạng thái: {}", originalFilename, sourceFile.getId(), effectiveDpi, qualityStatus);

        return sourceFileMapper.toResponse(sourceFile);
    }

    @Transactional(readOnly = true)
    public DocumentSourceFileDto.Response getById(UUID id, UUID companyId) {
        DocumentSourceFile entity = sourceFileRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.SOURCE_FILE_NOT_FOUND));
        return sourceFileMapper.toResponse(entity);
    }

    public static String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Không tìm thấy thuật toán SHA-256", e);
        }
    }
}
