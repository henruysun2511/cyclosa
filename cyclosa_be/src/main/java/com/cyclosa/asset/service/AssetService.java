package com.cyclosa.asset.service;

import com.cyclosa.asset.dto.request.AssetFilter;
import com.cyclosa.asset.dto.request.AssignAssetRequest;
import com.cyclosa.asset.dto.request.CreateAssetRequest;
import com.cyclosa.asset.dto.request.ReturnAssetRequest;
import com.cyclosa.asset.dto.request.UpdateAssetRequest;
import com.cyclosa.asset.dto.response.AssetAssignmentResponse;
import com.cyclosa.asset.dto.response.AssetDetailResponse;
import com.cyclosa.asset.dto.response.AssetStatisticsResponse;
import com.cyclosa.asset.dto.response.AssetSummaryResponse;
import com.cyclosa.asset.entity.Asset;
import com.cyclosa.asset.entity.AssetAssignment;
import com.cyclosa.asset.entity.AssetCategory;
import com.cyclosa.asset.enums.AssetCondition;
import com.cyclosa.asset.enums.AssetStatus;
import com.cyclosa.asset.exception.AssetErrorCode;
import com.cyclosa.asset.mapper.AssetAssignmentMapper;
import com.cyclosa.asset.mapper.AssetMapper;
import com.cyclosa.asset.repository.AssetAssignmentRepository;
import com.cyclosa.asset.repository.AssetCategoryRepository;
import com.cyclosa.asset.repository.AssetRepository;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.repository.CompanyRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetCategoryRepository assetCategoryRepository;
    private final AssetAssignmentRepository assetAssignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final CompanyRepository companyRepository;
    private final AssetMapper assetMapper;
    private final AssetAssignmentMapper assignmentMapper;

    public PageData<AssetSummaryResponse> getAssets(AssetFilter filter) {
        UUID companyId = resolveCompanyId();
        int page = Math.max(0, filter.getPage());
        int size = filter.getSize() <= 0 ? 10 : filter.getSize();

        Specification<Asset> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));

            if (StringUtils.hasText(filter.getKeyword())) {
                String kw = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Predicate codeMatch = cb.like(cb.lower(root.get("assetCode")), kw);
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), kw);
                Predicate serialMatch = cb.like(cb.lower(root.get("serialNumber")), kw);
                Predicate modelMatch = cb.like(cb.lower(root.get("model")), kw);
                Predicate makerMatch = cb.like(cb.lower(root.get("manufacturer")), kw);
                predicates.add(cb.or(codeMatch, nameMatch, serialMatch, modelMatch, makerMatch));
            }

            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getConditionStatus() != null) {
                predicates.add(cb.equal(root.get("conditionStatus"), filter.getConditionStatus()));
            }

            if (filter.getAssigned() != null) {
                if (Boolean.TRUE.equals(filter.getAssigned())) {
                    predicates.add(cb.equal(root.get("status"), AssetStatus.ASSIGNED));
                } else {
                    predicates.add(cb.notEqual(root.get("status"), AssetStatus.ASSIGNED));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Asset> pageResult = assetRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        List<AssetSummaryResponse> items = pageResult.getContent().stream()
                .map(assetMapper::toSummaryResponse)
                .toList();

        return PageData.of(pageResult, items);
    }

    public AssetStatisticsResponse getStatistics() {
        UUID companyId = resolveCompanyId();
        long total = assetRepository.countByCompanyId(companyId);
        long assigned = assetRepository.countByCompanyIdAndStatus(companyId, AssetStatus.ASSIGNED);
        long available = assetRepository.countByCompanyIdAndStatus(companyId, AssetStatus.AVAILABLE);
        long inRepair = assetRepository.countByCompanyIdAndStatus(companyId, AssetStatus.IN_REPAIR);
        long damaged = assetRepository.countByCompanyIdAndStatus(companyId, AssetStatus.DAMAGED);
        BigDecimal totalValue = assetRepository.sumPurchasePriceByCompanyId(companyId);

        return AssetStatisticsResponse.builder()
                .totalAssets(total)
                .assignedAssets(assigned)
                .availableAssets(available)
                .maintenanceAssets(inRepair + damaged)
                .totalValue(totalValue != null ? totalValue : BigDecimal.ZERO)
                .build();
    }

    public AssetDetailResponse getAssetById(UUID id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_NOT_FOUND));

        AssetDetailResponse response = assetMapper.toDetailResponse(asset);
        List<AssetAssignment> history = assetAssignmentRepository.findHistoryByAssetIdWithDetails(id);
        response.setAssignments(assignmentMapper.toResponseList(history));
        return response;
    }

    @Transactional
    public AssetDetailResponse createAsset(CreateAssetRequest request) {
        UUID companyId = resolveCompanyId();
        String code = request.getAssetCode().trim().toUpperCase();

        if (assetRepository.existsByCompanyIdAndAssetCode(companyId, code)) {
            throw new AppException(AssetErrorCode.ASSET_CODE_ALREADY_EXISTS);
        }

        AssetCategory category = assetCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND));

        Asset entity = assetMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setAssetCode(code);
        entity.setCategory(category);
        entity.setStatus(AssetStatus.AVAILABLE);
        if (request.getConditionStatus() != null) {
            entity.setConditionStatus(request.getConditionStatus());
        }

        Asset saved = assetRepository.save(entity);
        log.info("Created new asset: {} - {}", saved.getAssetCode(), saved.getName());
        return assetMapper.toDetailResponse(saved);
    }

    @Transactional
    public AssetDetailResponse updateAsset(UUID id, UpdateAssetRequest request) {
        Asset entity = assetRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_NOT_FOUND));

        AssetCategory category = assetCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_CATEGORY_NOT_FOUND));

        assetMapper.updateEntityFromRequest(request, entity);
        entity.setCategory(category);
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
        if (request.getConditionStatus() != null) {
            entity.setConditionStatus(request.getConditionStatus());
        }

        Asset saved = assetRepository.save(entity);
        log.info("Updated asset: {} - {}", saved.getAssetCode(), saved.getName());
        return assetMapper.toDetailResponse(saved);
    }

    @Transactional
    public void deleteAsset(UUID id) {
        Asset entity = assetRepository.findById(id)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_NOT_FOUND));

        if (entity.getStatus() == AssetStatus.ASSIGNED) {
            throw new AppException(AssetErrorCode.CANNOT_DELETE_ASSIGNED_ASSET);
        }

        assetRepository.delete(entity);
        log.info("Deleted asset: {} - {}", entity.getAssetCode(), entity.getName());
    }

    @Transactional
    public AssetAssignmentResponse assignAsset(UUID assetId, AssignAssetRequest request) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_NOT_FOUND));

        if (asset.getStatus() == AssetStatus.ASSIGNED) {
            throw new AppException(AssetErrorCode.ASSET_ALREADY_ASSIGNED);
        }
        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new AppException(AssetErrorCode.ASSET_NOT_AVAILABLE_FOR_ASSIGN);
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new AppException(AssetErrorCode.EMPLOYEE_NOT_FOUND));

        LocalDateTime assignedAt = request.getAssignedAt() != null ? request.getAssignedAt() : LocalDateTime.now();

        AssetAssignment assignment = AssetAssignment.builder()
                .asset(asset)
                .employee(employee)
                .assignedAt(assignedAt)
                .conditionOnAssign(request.getConditionOnAssign() != null ? request.getConditionOnAssign() : asset.getConditionStatus())
                .notes(request.getNotes())
                .build();

        AssetAssignment saved = assetAssignmentRepository.save(assignment);

        asset.setStatus(AssetStatus.ASSIGNED);
        assetRepository.save(asset);

        log.info("Assigned asset {} ({}) to employee {} ({})", asset.getAssetCode(), asset.getName(), employee.getEmployeeCode(), employee.getFullName());
        return assignmentMapper.toResponse(saved);
    }

    @Transactional
    public AssetAssignmentResponse returnAsset(UUID assignmentId, ReturnAssetRequest request) {
        AssetAssignment assignment = assetAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new AppException(AssetErrorCode.ASSIGNMENT_NOT_FOUND));

        if (assignment.getReturnedAt() != null) {
            throw new AppException(AssetErrorCode.ASSIGNMENT_ALREADY_RETURNED);
        }

        LocalDateTime returnedAt = request.getReturnedAt() != null ? request.getReturnedAt() : LocalDateTime.now();
        if (returnedAt.isBefore(assignment.getAssignedAt())) {
            throw new AppException(AssetErrorCode.INVALID_RETURN_DATE);
        }

        assignment.setReturnedAt(returnedAt);
        if (request.getConditionOnReturn() != null) {
            assignment.setConditionOnReturn(request.getConditionOnReturn());
        }
        if (StringUtils.hasText(request.getNotes())) {
            assignment.setNotes(request.getNotes());
        }

        AssetAssignment saved = assetAssignmentRepository.save(assignment);

        Asset asset = assignment.getAsset();
        if (request.getConditionOnReturn() != null) {
            asset.setConditionStatus(request.getConditionOnReturn());
            if (request.getConditionOnReturn() == AssetCondition.DAMAGED) {
                asset.setStatus(AssetStatus.DAMAGED);
            } else if (request.getConditionOnReturn() == AssetCondition.MAINTENANCE_REQUIRED) {
                asset.setStatus(AssetStatus.IN_REPAIR);
            } else {
                asset.setStatus(AssetStatus.AVAILABLE);
            }
        } else {
            asset.setStatus(AssetStatus.AVAILABLE);
        }

        assetRepository.save(asset);

        log.info("Returned asset {} from employee {}", asset.getAssetCode(), assignment.getEmployee().getEmployeeCode());
        return assignmentMapper.toResponse(saved);
    }

    public List<AssetAssignmentResponse> getAssetHistory(UUID assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new AppException(AssetErrorCode.ASSET_NOT_FOUND);
        }
        List<AssetAssignment> list = assetAssignmentRepository.findHistoryByAssetIdWithDetails(assetId);
        return assignmentMapper.toResponseList(list);
    }

    public List<AssetAssignmentResponse> getEmployeeAssets(UUID employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new AppException(AssetErrorCode.EMPLOYEE_NOT_FOUND);
        }
        List<AssetAssignment> list = assetAssignmentRepository.findHistoryByEmployeeIdWithDetails(employeeId);
        return assignmentMapper.toResponseList(list);
    }

    public List<AssetAssignmentResponse> getMyAssets() {
        UUID userId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(AssetErrorCode.EMPLOYEE_NOT_FOUND));

        List<AssetAssignment> list = assetAssignmentRepository.findHistoryByEmployeeIdWithDetails(employee.getId());
        return assignmentMapper.toResponseList(list);
    }

    public int getUnreturnedAssetCount(UUID employeeId) {
        return (int) assetAssignmentRepository.countByEmployeeIdAndReturnedAtIsNull(employeeId);
    }

    private UUID resolveCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(com.cyclosa.organization.entity.Company::getId)
                        .orElseThrow(() -> new AppException(AssetErrorCode.ASSET_NOT_FOUND)));
    }
}
