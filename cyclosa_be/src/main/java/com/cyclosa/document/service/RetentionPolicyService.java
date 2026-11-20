package com.cyclosa.document.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.PageableUtils;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.document.dto.RetentionPolicyDto;
import com.cyclosa.document.dto.request.RetentionPolicyFilter;
import com.cyclosa.document.entity.RetentionPolicy;
import com.cyclosa.document.exception.DocumentErrorCode;
import com.cyclosa.document.mapper.RetentionPolicyMapper;
import com.cyclosa.document.repository.DocumentTypeRepository;
import com.cyclosa.document.repository.RetentionPolicyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RetentionPolicyService {

    private final RetentionPolicyRepository retentionPolicyRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final RetentionPolicyMapper retentionPolicyMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "name", "retentionMonths", "startEvent", "isActive"
    );

    @Transactional(readOnly = true)
    public List<RetentionPolicyDto.Response> getActivePolicies(UUID companyId) {
        UUID effectiveCompanyId = companyId != null ? companyId : SecurityUtils.getCurrentUserCompanyId();
        List<RetentionPolicy> list = effectiveCompanyId != null
                ? retentionPolicyRepository.findAllByCompanyIdAndIsActiveTrue(effectiveCompanyId)
                : retentionPolicyRepository.findAll().stream().filter(RetentionPolicy::getIsActive).toList();
        return retentionPolicyMapper.toResponseList(list);
    }

    @Transactional(readOnly = true)
    public PageData<RetentionPolicyDto.Response> getPolicies(RetentionPolicyFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        String kw = PageableUtils.normalizeKeyword(filter.getKeyword());
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<RetentionPolicy> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (companyId != null) {
                predicates.add(cb.equal(root.get("companyId"), companyId));
            }

            if (filter.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), filter.getIsActive()));
            }
            if (kw != null && !kw.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + kw.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<RetentionPolicy> page = retentionPolicyRepository.findAll(spec, pageable);
        List<RetentionPolicyDto.Response> content = retentionPolicyMapper.toResponseList(page.getContent());
        return PageData.of(page, content);
    }

    @Transactional(readOnly = true)
    public RetentionPolicyDto.Response getById(UUID id, UUID companyId) {
        RetentionPolicy policy = retentionPolicyRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.RETENTION_POLICY_NOT_FOUND));
        return retentionPolicyMapper.toResponse(policy);
    }

    @Auditable(action = AuditAction.CREATE, entityType = "RETENTION_POLICY", entityIdExpression = "#result.id", description = "Tạo mới chính sách lưu trữ")
    @Transactional
    public RetentionPolicyDto.Response create(RetentionPolicyDto.CreateRequest request, UUID companyId) {
        if (retentionPolicyRepository.existsByCompanyIdAndName(companyId, request.getName().trim())) {
            throw new AppException(DocumentErrorCode.RETENTION_POLICY_NAME_EXISTS);
        }
        RetentionPolicy policy = retentionPolicyMapper.toEntity(request, companyId);
        policy = retentionPolicyRepository.save(policy);
        log.info("Đã tạo chính sách lưu trữ: {} ({}) cho công ty: {}", policy.getName(), policy.getId(), companyId);
        return retentionPolicyMapper.toResponse(policy);
    }

    @Auditable(action = AuditAction.UPDATE, entityType = "RETENTION_POLICY", entityIdExpression = "#id", description = "Cập nhật chính sách lưu trữ")
    @Transactional
    public RetentionPolicyDto.Response update(UUID id, RetentionPolicyDto.UpdateRequest request, UUID companyId) {
        RetentionPolicy policy = retentionPolicyRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.RETENTION_POLICY_NOT_FOUND));

        if (retentionPolicyRepository.existsByCompanyIdAndNameAndIdNot(companyId, request.getName().trim(), id)) {
            throw new AppException(DocumentErrorCode.RETENTION_POLICY_NAME_EXISTS);
        }

        retentionPolicyMapper.updateEntity(policy, request);
        policy = retentionPolicyRepository.save(policy);
        log.info("Đã cập nhật chính sách lưu trữ: {} ({})", policy.getName(), policy.getId());
        return retentionPolicyMapper.toResponse(policy);
    }

    @Auditable(action = AuditAction.DELETE, entityType = "RETENTION_POLICY", entityIdExpression = "#id", description = "Xóa chính sách lưu trữ")
    @Transactional
    public void delete(UUID id, UUID companyId) {
        RetentionPolicy policy = retentionPolicyRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(DocumentErrorCode.RETENTION_POLICY_NOT_FOUND));

        if (documentTypeRepository.existsByRetentionPolicyId(id)) {
            throw new AppException(DocumentErrorCode.RETENTION_POLICY_IN_USE);
        }

        retentionPolicyRepository.delete(policy);
        log.info("Đã xóa chính sách lưu trữ: {} ({})", policy.getName(), id);
    }
}
