package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.DocumentDto;
import com.cyclosa.document.dto.DossierDto;
import com.cyclosa.document.dto.request.DossierFilter;
import com.cyclosa.document.entity.Document;
import com.cyclosa.document.entity.Dossier;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.DocumentMapper;
import com.cyclosa.document.mapper.DossierMapper;
import com.cyclosa.document.repository.DocumentRepository;
import com.cyclosa.document.repository.DossierRepository;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DossierService {

    private final DossierRepository dossierRepository;
    private final DocumentRepository documentRepository;
    private final EmployeeRepository employeeRepository;
    private final DossierMapper dossierMapper;
    private final DocumentMapper documentMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "name", "dossierCode", "purpose", "status"
    );

    @Transactional(readOnly = true)
    public List<DossierDto.Response> getDossiersByEmployee(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        List<Dossier> list = dossierRepository.findAllByEmployeeId(employeeId);
        return list.stream()
                .map(d -> dossierMapper.toResponse(d, employee.getEmployeeCode(), employee.getFullName()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageData<DossierDto.Response> getDossiers(DossierFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<Dossier> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }

            if (filter.getEmployeeId() != null) {
                predicates.add(cb.equal(root.get("employeeId"), filter.getEmployeeId()));
            }
            if (filter.getPurpose() != null) {
                predicates.add(cb.equal(root.get("purpose"), filter.getPurpose()));
            }
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (kw != null && !kw.isEmpty()) {
                String pattern = "%" + kw.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("dossierCode")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Dossier> page = dossierRepository.findAll(spec, pageable);

        List<DossierDto.Response> content = page.getContent().stream().map(d -> {
            Employee emp = employeeRepository.findById(d.getEmployeeId()).orElse(null);
            String code = emp != null ? emp.getEmployeeCode() : null;
            String name = emp != null ? emp.getFullName() : null;
            return dossierMapper.toResponse(d, code, name);
        }).collect(Collectors.toList());

        return PageData.of(page, content);
    }

    @Transactional(readOnly = true)
    public DossierDto.DetailResponse getById(UUID id, UUID companyId) {
        Dossier dossier = dossierRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOSSIER_NOT_FOUND));

        Employee employee = employeeRepository.findById(dossier.getEmployeeId()).orElse(null);
        String code = employee != null ? employee.getEmployeeCode() : null;
        String name = employee != null ? employee.getFullName() : null;
        String dept = employee != null && employee.getCurrentDepartment() != null ? employee.getCurrentDepartment().getName() : null;
        String pos = employee != null && employee.getCurrentJobTitle() != null ? employee.getCurrentJobTitle().getName() : null;

        List<Document> documents = documentRepository.findAllByDossierId(id);
        List<DocumentDto.Response> docResponses = documents.stream()
                .map(doc -> documentMapper.toResponse(doc, code, name))
                .collect(Collectors.toList());

        return dossierMapper.toDetailResponse(dossier, code, name, dept, pos, docResponses);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "DOSSIER", entityIdExpression = "#result.id", description = "Tạo mới bộ hồ sơ nhân viên")
    @Transactional
    public DossierDto.Response create(DossierDto.CreateRequest request, UUID companyId) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND));

        if (dossierRepository.existsByCompanyIdAndDossierCode(companyId, request.getDossierCode().trim().toUpperCase())) {
            throw new AppException(DocumentErrorCode.DOSSIER_CODE_EXISTS);
        }

        Dossier dossier = dossierMapper.toEntity(request, companyId);
        dossier = dossierRepository.save(dossier);
        log.info("Đã tạo bộ hồ sơ: {} ({}) cho nhân viên: {}", dossier.getTitle(), dossier.getDossierCode(), employee.getFullName());
        return dossierMapper.toResponse(dossier, employee.getEmployeeCode(), employee.getFullName());
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "DOSSIER", entityIdExpression = "#id", description = "Cập nhật bộ hồ sơ nhân viên")
    @Transactional
    public DossierDto.Response update(UUID id, DossierDto.UpdateRequest request, UUID companyId) {
        Dossier dossier = dossierRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOSSIER_NOT_FOUND));

        dossierMapper.updateEntity(dossier, request);
        dossier = dossierRepository.save(dossier);

        Employee employee = employeeRepository.findById(dossier.getEmployeeId()).orElse(null);
        String code = employee != null ? employee.getEmployeeCode() : null;
        String name = employee != null ? employee.getFullName() : null;

        log.info("Đã cập nhật bộ hồ sơ: {} ({})", dossier.getTitle(), id);
        return dossierMapper.toResponse(dossier, code, name);
    }

    @Auditable(action = AuditAction.DELETE, entityType = "DOSSIER", entityIdExpression = "#id", description = "Xóa bộ hồ sơ nhân viên")
    @Transactional
    public void delete(UUID id, UUID companyId) {
        Dossier dossier = dossierRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.DOSSIER_NOT_FOUND));

        List<Document> docs = documentRepository.findAllByDossierId(id);
        if (!docs.isEmpty()) {
            throw new AppException(DocumentErrorCode.DOSSIER_CODE_EXISTS); // không được xóa khi có tài liệu
        }

        dossierRepository.delete(dossier);
        log.info("Đã xóa bộ hồ sơ: {} ({})", dossier.getTitle(), id);
    }
}
