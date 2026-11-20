package com.cyclosa.asset.service;

import com.cyclosa.asset.dto.request.AssetCategoryFilter;
import com.cyclosa.asset.dto.request.CreateAssetCategoryRequest;
import com.cyclosa.asset.dto.request.UpdateAssetCategoryRequest;
import com.cyclosa.asset.dto.response.AssetCategoryResponse;
import com.cyclosa.asset.entity.AssetCategory;
import com.cyclosa.asset.exception.AssetErrorCode;
import com.cyclosa.asset.mapper.AssetCategoryMapper;
import com.cyclosa.asset.repository.AssetCategoryRepository;
import com.cyclosa.asset.repository.AssetRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.organization.repository.CompanyRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Concrete Service trực tiếp theo Quy chuẩn 01 CYCLOSA Backend (Không tạo interface + impl thừa thãi).
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetCategoryService {

    private final AssetCategoryRepository assetCategoryRepository;
    private final AssetRepository assetRepository;
    private final CompanyRepository companyRepository;
    private final AssetCategoryMapper mapper;

    public PageData<AssetCategoryResponse> getCategories(AssetCategoryFilter filter) {
        UUID companyId = resolveCompanyId();
        int page = Math.max(0, filter.getPage());
        int size = filter.getSize() <= 0 ? 10 : filter.getSize();

        Specification<AssetCategory> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (StringUtils.hasText(filter.getKeyword())) {
                String kw = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), kw);
                Predicate codeMatch = cb.like(cb.lower(root.get("code")), kw);
                predicates.add(cb.or(nameMatch, codeMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<AssetCategory> pageResult = assetCategoryRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        List<AssetCategoryResponse> items = pageResult.getContent().stream()
                .map(mapper::toResponse)
                .toList();

        return PageData.of(pageResult, items);
    }

    public List<AssetCategoryResponse> getAllCategories() {
        UUID companyId = resolveCompanyId();
        return assetCategoryRepository.findAllByCompanyIdOrderByNameAsc(companyId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    public AssetCategoryResponse getCategoryById(UUID id) {
        AssetCategory category = assetCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND));
        return mapper.toResponse(category);
    }

    @Transactional
    public AssetCategoryResponse createCategory(CreateAssetCategoryRequest request) {
        UUID companyId = resolveCompanyId();

        if (assetCategoryRepository.existsByCompanyIdAndCode(companyId, request.getCode().trim().toUpperCase())) {
            throw new AppException(AssetErrorCode.CATEGORY_CODE_DUPLICATED);
        }
        if (assetCategoryRepository.existsByCompanyIdAndName(companyId, request.getName().trim())) {
            throw new AppException(AssetErrorCode.CATEGORY_NAME_DUPLICATED);
        }

        AssetCategory entity = mapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setCode(request.getCode().trim().toUpperCase());
        entity.setName(request.getName().trim());

        AssetCategory saved = assetCategoryRepository.save(entity);
        log.info("Created asset category: {} - {}", saved.getCode(), saved.getName());
        return mapper.toResponse(saved);
    }

    @Transactional
    public AssetCategoryResponse updateCategory(UUID id, UpdateAssetCategoryRequest request) {
        UUID companyId = resolveCompanyId();
        AssetCategory entity = assetCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND));

        String newCode = request.getCode().trim().toUpperCase();
        String newName = request.getName().trim();

        if (assetCategoryRepository.existsByCompanyIdAndCodeAndIdNot(companyId, newCode, id)) {
            throw new AppException(AssetErrorCode.CATEGORY_CODE_DUPLICATED);
        }
        if (assetCategoryRepository.existsByCompanyIdAndNameAndIdNot(companyId, newName, id)) {
            throw new AppException(AssetErrorCode.CATEGORY_NAME_DUPLICATED);
        }

        mapper.updateEntityFromRequest(request, entity);
        entity.setCode(newCode);
        entity.setName(newName);

        AssetCategory saved = assetCategoryRepository.save(entity);
        log.info("Updated asset category: {} - {}", saved.getCode(), saved.getName());
        return mapper.toResponse(saved);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        AssetCategory entity = assetCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND));

        if (assetRepository.existsByCategoryId(id)) {
            throw new AppException(AssetErrorCode.CANNOT_DELETE_CATEGORY_WITH_ASSETS);
        }

        assetCategoryRepository.delete(entity);
        log.info("Deleted asset category: {}", entity.getName());
    }

    private UUID resolveCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(com.cyclosa.organization.entity.Company::getId)
                        .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND)));
    }
}
