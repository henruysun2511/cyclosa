package com.cyclosa.document.service;

import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.document.dto.DossierExportRequestDto;
import com.cyclosa.document.entity.Dossier;
import com.cyclosa.document.entity.DossierExportRequest;
import com.cyclosa.document.enums.ExportStatus;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DossierExportRequestMapper;
import com.cyclosa.document.repository.DossierExportRequestRepository;
import com.cyclosa.document.repository.DossierRepository;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.exception.EmployeeErrorCode;
import com.cyclosa.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DossierExportService {

    private final DossierExportRequestRepository exportRequestRepository;
    private final DossierRepository dossierRepository;
    private final EmployeeRepository employeeRepository;
    private final DossierExportRequestMapper exportRequestMapper;

    @Transactional
    public DossierExportRequestDto.Response requestExport(
            DossierExportRequestDto.CreateRequest request,
            UUID companyId,
            UUID currentUserId) {

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        Dossier dossier = null;
        if (request.getDossierId() != null) {
            dossier = dossierRepository.findByIdAndCompanyId(request.getDossierId(), companyId)
                    .orElseThrow(() -> new AppException(DocumentErrorCode.DOSSIER_NOT_FOUND));
        }

        // Tự động tạo Watermark Text nếu người dùng không chỉ định
        String watermark = request.getWatermarkText();
        if (watermark == null || watermark.trim().isEmpty()) {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            watermark = "CYCLOSA CONFIDENTIAL - " + employee.getFullName() + " (" + employee.getEmployeeCode() + ") - " + timestamp;
        }

        DossierExportRequest exportReq = exportRequestMapper.toEntity(request, companyId, currentUserId, dossier);
        exportReq.setWatermarkText(watermark);
        exportReq.setStatus(ExportStatus.READY); // Giả lập đóng gói sẵn sàng
        exportReq.setDownloadUrl("/api/v1/dossier-exports/download/" + exportReq.getId());
        exportReq = exportRequestRepository.save(exportReq);

        log.info("Đã tạo yêu cầu trích xuất hồ sơ DIP (Watermark: '{}') cho nhân viên: {}", watermark, employee.getFullName());
        return exportRequestMapper.toResponse(exportReq, employee.getEmployeeCode(), employee.getFullName());
    }

    @Transactional(readOnly = true)
    public List<DossierExportRequestDto.Response> getMyExportRequests(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElse(null);
        String code = employee != null ? employee.getEmployeeCode() : null;
        String name = employee != null ? employee.getFullName() : null;

        List<DossierExportRequest> list = exportRequestRepository.findAllByEmployeeIdOrderByCreatedAtDesc(employeeId);
        return list.stream().map(e -> exportRequestMapper.toResponse(e, code, name)).collect(Collectors.toList());
    }
}
