package com.cyclosa.restructure.service;

import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeWorkAssignment;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeWorkAssignmentRepository;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.entity.DepartmentVersion;
import com.cyclosa.organization.repository.CompanyRepository;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.organization.repository.DepartmentVersionRepository;
import com.cyclosa.organization.repository.JobTitleRepository;
import com.cyclosa.restructure.dto.request.*;
import com.cyclosa.restructure.dto.response.*;
import com.cyclosa.restructure.entity.*;
import com.cyclosa.restructure.enums.*;
import com.cyclosa.restructure.exception.RestructureErrorCode;
import com.cyclosa.restructure.mapper.OrgRestructureMapper;
import com.cyclosa.restructure.repository.*;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
public class OrgRestructureService {

    private final OrgScenarioRepository scenarioRepository;
    private final ScenarioDepartmentRepository scenarioDeptRepository;
    private final ScenarioActionRepository scenarioActionRepository;
    private final ScenarioEmployeeAssignmentRepository assignmentRepository;
    private final OrgRestructureMapper mapper;

    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final DepartmentVersionRepository departmentVersionRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeWorkAssignmentRepository workAssignmentRepository;
    private final JobTitleRepository jobTitleRepository;

    // ==========================================
    // 1. QUẢN LÝ KỊCH BẢN (SCENARIOS)
    // ==========================================

    @Transactional
    public OrgScenarioResponse createScenario(CreateOrgScenarioRequest request) {
        UUID companyId = resolveCurrentCompanyId();
        if (request.getCompanyId() != null) {
            companyId = request.getCompanyId();
        }

        if (scenarioRepository.existsByCompanyIdAndCode(companyId, request.getCode().trim())) {
            throw new AppException(RestructureErrorCode.SCENARIO_CODE_ALREADY_EXISTS);
        }

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());

        OrgScenario scenario = OrgScenario.builder()
                .name(request.getName().trim())
                .code(request.getCode().trim().toUpperCase())
                .description(request.getDescription())
                .scope(request.getScope() != null ? request.getScope() : ScenarioScope.COMPANY_WIDE)
                .status(ScenarioStatus.DRAFT)
                .targetEffectiveDate(request.getTargetEffectiveDate())
                .build();
        scenario.setCompanyId(companyId);
        scenario.setCreatedBy(currentUserId);

        OrgScenario savedScenario = scenarioRepository.save(scenario);

        // CLONE SNAPSHOT từ Live Organization
        cloneLiveOrganizationSnapshot(savedScenario, companyId, currentUserId);

        // Ghi nhận action khởi tạo
        logScenarioAction(
                savedScenario,
                RestructureActionType.CREATE_DEPT,
                "{\"scenarioCode\":\"" + savedScenario.getCode() + "\"}",
                "Khởi tạo kịch bản tái cơ cấu và sao chép snapshot sơ đồ tổ chức thực tế",
                currentUserId
        );

        return enrichScenarioResponse(mapper.toResponse(savedScenario));
    }

    @Transactional(readOnly = true)
    public PageData<OrgScenarioResponse> getScenarios(OrgScenarioFilter filter) {
        UUID companyId = filter.getCompanyId() != null ? filter.getCompanyId() : resolveCurrentCompanyId();

        PageRequest pageRequest = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Specification<OrgScenario> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("companyId"), companyId));
            predicates.add(cb.isNull(root.get("deletedAt")));

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }
            if (filter.getScope() != null) {
                predicates.add(cb.equal(root.get("scope"), filter.getScope()));
            }
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String searchLike = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchLike),
                        cb.like(cb.lower(root.get("code")), searchLike)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<OrgScenario> page = scenarioRepository.findAll(spec, pageRequest);
        List<OrgScenarioResponse> items = page.getContent().stream()
                .map(mapper::toResponse)
                .map(this::enrichScenarioResponse)
                .collect(Collectors.toList());

        return PageData.of(page, items);
    }

    @Transactional(readOnly = true)
    public OrgScenarioDetailResponse getScenarioDetail(UUID id) {
        UUID companyId = resolveCurrentCompanyId();
        OrgScenario scenario = scenarioRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.SCENARIO_NOT_FOUND));

        OrgScenarioDetailResponse response = mapper.toDetailResponse(scenario);

        List<ScenarioDepartment> depts = scenarioDeptRepository.findByScenarioId(scenario.getId());
        Map<UUID, Long> deptHeadcountMap = assignmentRepository.findByScenarioId(scenario.getId()).stream()
                .collect(Collectors.groupingBy(a -> a.getNewScenarioDept().getId(), Collectors.counting()));

        List<ScenarioDepartmentResponse> deptResponses = depts.stream().map(d -> {
            ScenarioDepartmentResponse dr = mapper.toResponse(d);
            dr.setCurrentHeadcount(deptHeadcountMap.getOrDefault(d.getId(), 0L));
            if (d.getManagerEmployeeId() != null) {
                employeeRepository.findById(d.getManagerEmployeeId())
                        .ifPresent(e -> dr.setManagerEmployeeName(e.getFullName()));
            }
            return dr;
        }).collect(Collectors.toList());

        List<ScenarioActionResponse> actionResponses = scenarioActionRepository
                .findByScenarioIdOrderByCreatedAtDesc(scenario.getId()).stream()
                .limit(10)
                .map(mapper::toResponse)
                .collect(Collectors.toList());

        response.setDepartmentCount((long) depts.size());
        response.setEmployeeCount(assignmentRepository.countByScenarioId(scenario.getId()));
        response.setActionCount((long) actionResponses.size());
        response.setDepartments(deptResponses);
        response.setRecentActions(actionResponses);

        return response;
    }

    @Transactional
    public OrgScenarioResponse updateScenario(UUID id, UpdateOrgScenarioRequest request) {
        UUID companyId = resolveCurrentCompanyId();
        OrgScenario scenario = scenarioRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.SCENARIO_NOT_FOUND));

        assertEditable(scenario);

        scenario.setName(request.getName().trim());
        scenario.setDescription(request.getDescription());
        scenario.setScope(request.getScope());
        scenario.setTargetEffectiveDate(request.getTargetEffectiveDate());

        return enrichScenarioResponse(mapper.toResponse(scenarioRepository.save(scenario)));
    }

    @Transactional
    public void deleteScenario(UUID id) {
        UUID companyId = resolveCurrentCompanyId();
        OrgScenario scenario = scenarioRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.SCENARIO_NOT_FOUND));

        if (scenario.getStatus() != ScenarioStatus.DRAFT && scenario.getStatus() != ScenarioStatus.REJECTED && scenario.getStatus() != ScenarioStatus.CANCELLED) {
            throw new AppException(RestructureErrorCode.CANNOT_DELETE_ACTIVE_SCENARIO);
        }

        scenario.setDeletedAt(LocalDateTime.now());
        scenarioRepository.save(scenario);
    }

    @Transactional(readOnly = true)
    public OrgScenarioStatisticsResponse getStatistics() {
        UUID companyId = resolveCurrentCompanyId();
        return OrgScenarioStatisticsResponse.builder()
                .totalScenarios(scenarioRepository.countByCompanyId(companyId))
                .draftScenarios(scenarioRepository.countByCompanyIdAndStatus(companyId, ScenarioStatus.DRAFT))
                .submittedScenarios(scenarioRepository.countByCompanyIdAndStatus(companyId, ScenarioStatus.SUBMITTED))
                .approvedScenarios(scenarioRepository.countByCompanyIdAndStatus(companyId, ScenarioStatus.APPROVED))
                .executedScenarios(scenarioRepository.countByCompanyIdAndStatus(companyId, ScenarioStatus.EXECUTED))
                .build();
    }

    // ==========================================
    // 2. THAO TÁC CÂY SƠ ĐỒ TỔ CHỨC (SANDBOX TREE)
    // ==========================================

    @Transactional(readOnly = true)
    public List<ScenarioDepartmentTreeNodeResponse> getScenarioTree(UUID scenarioId) {
        assertScenarioExists(scenarioId);

        List<ScenarioDepartment> allDepts = scenarioDeptRepository.findByScenarioId(scenarioId);
        Map<UUID, Long> deptHeadcountMap = assignmentRepository.findByScenarioId(scenarioId).stream()
                .collect(Collectors.groupingBy(a -> a.getNewScenarioDept().getId(), Collectors.counting()));

        // Nhóm theo parentId
        Map<UUID, List<ScenarioDepartment>> childrenMap = new HashMap<>();
        List<ScenarioDepartment> rootDepts = new ArrayList<>();

        for (ScenarioDepartment d : allDepts) {
            if (d.getParentScenarioDept() == null) {
                rootDepts.add(d);
            } else {
                childrenMap.computeIfAbsent(d.getParentScenarioDept().getId(), k -> new ArrayList<>()).add(d);
            }
        }

        return rootDepts.stream()
                .map(root -> buildTreeNodeRecursive(root, childrenMap, deptHeadcountMap))
                .collect(Collectors.toList());
    }

    @Transactional
    public ScenarioDepartmentResponse createDepartment(UUID scenarioId, CreateScenarioDepartmentRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        ScenarioDepartment parent = null;
        if (request.getParentScenarioDeptId() != null) {
            parent = scenarioDeptRepository.findByIdAndScenarioId(request.getParentScenarioDeptId(), scenarioId)
                    .orElseThrow(() -> new AppException(RestructureErrorCode.TARGET_DEPARTMENT_NOT_FOUND));
        }

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());

        ScenarioDepartment dept = ScenarioDepartment.builder()
                .scenario(scenario)
                .parentScenarioDept(parent)
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .managerEmployeeId(request.getManagerEmployeeId())
                .statusInScenario(DepartmentScenarioStatus.ADDED)
                .targetHeadcount(request.getTargetHeadcount() != null ? request.getTargetHeadcount() : 0)
                .isPermissionInherited(request.getIsPermissionInherited() != null ? request.getIsPermissionInherited() : true)
                .notes(request.getNotes())
                .build();
        dept.setCompanyId(scenario.getCompanyId());
        dept.setCreatedBy(currentUserId);

        ScenarioDepartment saved = scenarioDeptRepository.save(dept);

        logScenarioAction(
                scenario,
                RestructureActionType.CREATE_DEPT,
                "{\"deptId\":\"" + saved.getId() + "\",\"code\":\"" + saved.getCode() + "\"}",
                "Thành lập phòng ban mới: " + saved.getName() + " (" + saved.getCode() + ")",
                currentUserId
        );

        return mapper.toResponse(saved);
    }

    @Transactional
    public ScenarioDepartmentResponse updateDepartment(UUID scenarioId, UUID deptId, UpdateScenarioDepartmentRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        ScenarioDepartment dept = scenarioDeptRepository.findByIdAndScenarioId(deptId, scenarioId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.DEPARTMENT_NOT_IN_SCENARIO));

        dept.setName(request.getName().trim());
        dept.setCode(request.getCode().trim().toUpperCase());
        if (request.getManagerEmployeeId() != null) {
            dept.setManagerEmployeeId(request.getManagerEmployeeId());
        }
        if (request.getTargetHeadcount() != null) {
            dept.setTargetHeadcount(request.getTargetHeadcount());
        }
        if (request.getIsPermissionInherited() != null) {
            dept.setIsPermissionInherited(request.getIsPermissionInherited());
        }
        if (request.getNotes() != null) {
            dept.setNotes(request.getNotes());
        }

        if (dept.getStatusInScenario() == DepartmentScenarioStatus.UNCHANGED) {
            dept.setStatusInScenario(DepartmentScenarioStatus.MODIFIED);
        }

        ScenarioDepartment updated = scenarioDeptRepository.save(dept);
        return mapper.toResponse(updated);
    }

    @Transactional
    public ScenarioDepartmentResponse moveDepartment(UUID scenarioId, UUID deptId, MoveScenarioDepartmentRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        ScenarioDepartment dept = scenarioDeptRepository.findByIdAndScenarioId(deptId, scenarioId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.DEPARTMENT_NOT_IN_SCENARIO));

        ScenarioDepartment newParent = null;
        if (request.getNewParentScenarioDeptId() != null) {
            // Không được tự làm con của chính mình
            if (deptId.equals(request.getNewParentScenarioDeptId())) {
                throw new AppException(RestructureErrorCode.CYCLIC_HIERARCHY_DETECTED);
            }

            newParent = scenarioDeptRepository.findByIdAndScenarioId(request.getNewParentScenarioDeptId(), scenarioId)
                    .orElseThrow(() -> new AppException(RestructureErrorCode.TARGET_DEPARTMENT_NOT_FOUND));

            // Kiểm tra chống lặp vòng: duyệt từ newParent ngược lên trên
            ScenarioDepartment current = newParent;
            while (current != null) {
                if (current.getId().equals(deptId)) {
                    throw new AppException(RestructureErrorCode.CYCLIC_HIERARCHY_DETECTED);
                }
                current = current.getParentScenarioDept();
            }
        }

        dept.setParentScenarioDept(newParent);
        if (dept.getStatusInScenario() == DepartmentScenarioStatus.UNCHANGED) {
            dept.setStatusInScenario(DepartmentScenarioStatus.MODIFIED);
        }

        ScenarioDepartment saved = scenarioDeptRepository.save(dept);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        String parentName = newParent != null ? newParent.getName() : "Cấp cao nhất (Root)";
        logScenarioAction(
                scenario,
                RestructureActionType.MOVE_DEPT,
                "{\"deptId\":\"" + deptId + "\",\"newParentId\":\"" + (newParent != null ? newParent.getId() : "null") + "\"}",
                "Di chuyển phòng ban '" + dept.getName() + "' trực thuộc '" + parentName + "'",
                currentUserId
        );

        return mapper.toResponse(saved);
    }

    @Transactional
    public void mergeDepartments(UUID scenarioId, MergeScenarioDepartmentsRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        if (request.getSourceDepartmentIds() == null || request.getSourceDepartmentIds().size() < 2) {
            throw new AppException(RestructureErrorCode.MERGE_REQUIRES_AT_LEAST_TWO);
        }

        ScenarioDepartment targetDept = scenarioDeptRepository.findByIdAndScenarioId(request.getTargetDepartmentId(), scenarioId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.TARGET_DEPARTMENT_NOT_FOUND));

        List<ScenarioDepartment> sourceDepts = scenarioDeptRepository.findAllById(request.getSourceDepartmentIds());

        for (ScenarioDepartment src : sourceDepts) {
            if (src.getId().equals(targetDept.getId())) continue;

            // 1. Chuyển các con của source dept sang làm con của target dept
            List<ScenarioDepartment> children = scenarioDeptRepository.findByScenarioIdAndParentScenarioDeptId(scenarioId, src.getId());
            for (ScenarioDepartment child : children) {
                child.setParentScenarioDept(targetDept);
                child.setStatusInScenario(DepartmentScenarioStatus.MODIFIED);
                scenarioDeptRepository.save(child);
            }

            // 2. Chuyển nhân sự của source dept sang target dept
            List<ScenarioEmployeeAssignment> assignments = assignmentRepository.findByScenarioIdAndNewScenarioDeptId(scenarioId, src.getId());
            for (ScenarioEmployeeAssignment a : assignments) {
                a.setNewScenarioDept(targetDept);
                a.setAssignmentStatus(AssignmentStatus.TRANSFERRED);
                assignmentRepository.save(a);
            }

            // 3. Đánh dấu source dept là MERGED
            src.setStatusInScenario(DepartmentScenarioStatus.MERGED);
            scenarioDeptRepository.save(src);
        }

        // Cập nhật target dept
        if (request.getNewManagerEmployeeId() != null) {
            targetDept.setManagerEmployeeId(request.getNewManagerEmployeeId());
        }
        if (targetDept.getStatusInScenario() == DepartmentScenarioStatus.UNCHANGED) {
            targetDept.setStatusInScenario(DepartmentScenarioStatus.MODIFIED);
        }
        scenarioDeptRepository.save(targetDept);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        String srcNames = sourceDepts.stream().map(ScenarioDepartment::getName).collect(Collectors.joining(", "));
        logScenarioAction(
                scenario,
                RestructureActionType.MERGE_DEPTS,
                "{\"targetId\":\"" + targetDept.getId() + "\",\"sourceIds\":\"" + request.getSourceDepartmentIds() + "\"}",
                "Sáp nhập các phòng ban [" + srcNames + "] vào '" + targetDept.getName() + "'",
                currentUserId
        );
    }

    @Transactional
    public void splitDepartment(UUID scenarioId, SplitScenarioDepartmentRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        ScenarioDepartment sourceDept = scenarioDeptRepository.findByIdAndScenarioId(request.getSourceDepartmentId(), scenarioId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.DEPARTMENT_NOT_IN_SCENARIO));

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());

        // Tạo các phòng ban con mới
        List<String> newDeptNames = new ArrayList<>();
        for (CreateScenarioDepartmentRequest req : request.getNewDepartments()) {
            ScenarioDepartment newDept = ScenarioDepartment.builder()
                    .scenario(scenario)
                    .parentScenarioDept(sourceDept.getParentScenarioDept())
                    .code(req.getCode().trim().toUpperCase())
                    .name(req.getName().trim())
                    .managerEmployeeId(req.getManagerEmployeeId())
                    .statusInScenario(DepartmentScenarioStatus.ADDED)
                    .targetHeadcount(req.getTargetHeadcount() != null ? req.getTargetHeadcount() : 0)
                    .isPermissionInherited(req.getIsPermissionInherited() != null ? req.getIsPermissionInherited() : true)
                    .notes(req.getNotes())
                    .build();
            newDept.setCompanyId(scenario.getCompanyId());
            newDept.setCreatedBy(currentUserId);
            scenarioDeptRepository.save(newDept);
            newDeptNames.add(newDept.getName());
        }

        // Đánh dấu source dept là SPLIT
        sourceDept.setStatusInScenario(DepartmentScenarioStatus.SPLIT);
        scenarioDeptRepository.save(sourceDept);

        logScenarioAction(
                scenario,
                RestructureActionType.SPLIT_DEPT,
                "{\"sourceId\":\"" + sourceDept.getId() + "\"}",
                "Chia tách phòng ban '" + sourceDept.getName() + "' thành: " + String.join(", ", newDeptNames),
                currentUserId
        );
    }

    @Transactional
    public void dissolveDepartment(UUID scenarioId, UUID deptId) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        ScenarioDepartment dept = scenarioDeptRepository.findByIdAndScenarioId(deptId, scenarioId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.DEPARTMENT_NOT_IN_SCENARIO));

        // Kiểm tra không còn phòng ban con đang active
        if (scenarioDeptRepository.existsByScenarioIdAndParentScenarioDeptId(scenarioId, deptId)) {
            throw new AppException(RestructureErrorCode.DISSOLVE_FAILED_HAS_CHILDREN);
        }

        // Kiểm tra không còn nhân sự
        if (assignmentRepository.existsByScenarioIdAndNewScenarioDeptId(scenarioId, deptId)) {
            throw new AppException(RestructureErrorCode.DISSOLVE_FAILED_HAS_EMPLOYEES);
        }

        dept.setStatusInScenario(DepartmentScenarioStatus.DISSOLVED);
        scenarioDeptRepository.save(dept);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        logScenarioAction(
                scenario,
                RestructureActionType.DISSOLVE_DEPT,
                "{\"deptId\":\"" + deptId + "\"}",
                "Giải thể phòng ban: " + dept.getName() + " (" + dept.getCode() + ")",
                currentUserId
        );
    }

    @Transactional
    public void reassignEmployees(UUID scenarioId, ReassignScenarioEmployeesRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());

        for (ReassignScenarioEmployeesRequest.EmployeeAssignmentItemRequest item : request.getAssignments()) {
            ScenarioDepartment targetDept = scenarioDeptRepository.findByIdAndScenarioId(item.getNewScenarioDeptId(), scenarioId)
                    .orElseThrow(() -> new AppException(RestructureErrorCode.TARGET_DEPARTMENT_NOT_FOUND));

            ScenarioEmployeeAssignment assignment = assignmentRepository.findByScenarioIdAndEmployeeId(scenarioId, item.getEmployeeId())
                    .orElseGet(() -> {
                        ScenarioEmployeeAssignment newA = ScenarioEmployeeAssignment.builder()
                                .scenario(scenario)
                                .employeeId(item.getEmployeeId())
                                .build();
                        newA.setCompanyId(scenario.getCompanyId());
                        newA.setCreatedBy(currentUserId);
                        return newA;
                    });

            assignment.setNewScenarioDept(targetDept);
            assignment.setNewJobTitleId(item.getNewJobTitleId());
            if (item.getNewManagerId() != null) {
                assignment.setNewManagerId(item.getNewManagerId());
            }
            if (item.getAssignmentStatus() != null) {
                assignment.setAssignmentStatus(item.getAssignmentStatus());
            }
            if (item.getProposedSalary() != null) {
                assignment.setProposedSalary(item.getProposedSalary());
            }
            if (item.getNotes() != null) {
                assignment.setNotes(item.getNotes());
            }

            assignmentRepository.save(assignment);
        }

        logScenarioAction(
                scenario,
                RestructureActionType.REASSIGN_EMP,
                "{\"count\":" + request.getAssignments().size() + "}",
                "Điều chuyển và phân bổ lại " + request.getAssignments().size() + " nhân sự trong kịch bản",
                currentUserId
        );
    }

    // ==========================================
    // 3. PHÂN TÍCH WHAT-IF & RÀ SOÁT LỖI
    // ==========================================

    @Transactional(readOnly = true)
    public WhatIfImpactAnalysisResponse getWhatIfImpact(UUID scenarioId) {
        OrgScenario scenario = assertScenarioExists(scenarioId);

        List<ScenarioEmployeeAssignment> assignments = assignmentRepository.findByScenarioId(scenarioId);
        List<ScenarioDepartment> depts = scenarioDeptRepository.findByScenarioId(scenarioId);

        long asIsCount = assignments.size();
        long toBeCount = assignments.stream()
                .filter(a -> a.getAssignmentStatus() != AssignmentStatus.REDUNDANT)
                .count();
        long deltaHeadcount = toBeCount - asIsCount;

        long transferred = assignments.stream().filter(a -> a.getAssignmentStatus() == AssignmentStatus.TRANSFERRED).count();
        long promoted = assignments.stream().filter(a -> a.getAssignmentStatus() == AssignmentStatus.PROMOTED).count();
        long redundant = assignments.stream().filter(a -> a.getAssignmentStatus() == AssignmentStatus.REDUNDANT).count();

        // Ước tính quỹ lương
        BigDecimal asIsMonthly = BigDecimal.valueOf(asIsCount * 18_000_000L); // Giả định trung bình 18M/người nếu không có bảng lương
        BigDecimal toBeMonthly = asIsMonthly.add(BigDecimal.valueOf(promoted * 3_000_000L - redundant * 18_000_000L));
        BigDecimal deltaMonthly = toBeMonthly.subtract(asIsMonthly);
        BigDecimal deltaAnnual = deltaMonthly.multiply(BigDecimal.valueOf(12));

        // Span of control & depth
        Map<UUID, Long> managerCountMap = assignments.stream()
                .filter(a -> a.getNewManagerId() != null)
                .collect(Collectors.groupingBy(ScenarioEmployeeAssignment::getNewManagerId, Collectors.counting()));
        double avgSpan = managerCountMap.isEmpty() ? 0.0 : managerCountMap.values().stream().mapToLong(l -> l).average().orElse(0.0);

        // Max depth
        int maxDepth = calculateMaxDepth(depts);

        // Chi tiết từng phòng ban
        Map<UUID, Long> deptHeadcountMap = assignments.stream()
                .filter(a -> a.getAssignmentStatus() != AssignmentStatus.REDUNDANT)
                .collect(Collectors.groupingBy(a -> a.getNewScenarioDept().getId(), Collectors.counting()));

        List<WhatIfImpactAnalysisResponse.DepartmentImpactItem> deptImpacts = depts.stream()
                .filter(d -> d.getStatusInScenario() != DepartmentScenarioStatus.DISSOLVED && d.getStatusInScenario() != DepartmentScenarioStatus.MERGED)
                .map(d -> {
                    long toBeDeptCount = deptHeadcountMap.getOrDefault(d.getId(), 0L);
                    long asIsDeptCount = assignments.stream()
                            .filter(a -> d.getOriginalDepartmentId() != null && d.getOriginalDepartmentId().equals(a.getOriginalDepartmentId()))
                            .count();
                    int target = d.getTargetHeadcount() != null ? d.getTargetHeadcount() : 0;
                    return WhatIfImpactAnalysisResponse.DepartmentImpactItem.builder()
                            .departmentId(d.getId())
                            .departmentName(d.getName())
                            .asIsHeadcount(asIsDeptCount)
                            .toBeHeadcount(toBeDeptCount)
                            .deltaHeadcount(toBeDeptCount - asIsDeptCount)
                            .targetHeadcount(target)
                            .isOverCapacity(target > 0 && toBeDeptCount > target)
                            .build();
                }).collect(Collectors.toList());

        return WhatIfImpactAnalysisResponse.builder()
                .scenarioId(scenarioId)
                .asIsHeadcount(asIsCount)
                .toBeHeadcount(toBeCount)
                .deltaHeadcount(deltaHeadcount)
                .transferredCount(transferred)
                .promotedCount(promoted)
                .redundantCount(redundant)
                .asIsMonthlyPayroll(asIsMonthly)
                .toBeMonthlyPayroll(toBeMonthly)
                .deltaMonthlyPayroll(deltaMonthly)
                .deltaAnnualPayroll(deltaAnnual)
                .asIsAverageSpanOfControl(5.2) // Chuẩn ngành baseline
                .toBeAverageSpanOfControl(Math.round(avgSpan * 10.0) / 10.0)
                .asIsMaxHierarchyDepth(4)
                .toBeMaxHierarchyDepth(maxDepth)
                .departmentImpacts(deptImpacts)
                .build();
    }

    @Transactional(readOnly = true)
    public RestructureConflictResponse getConflicts(UUID scenarioId) {
        assertScenarioExists(scenarioId);

        List<ScenarioDepartment> depts = scenarioDeptRepository.findByScenarioId(scenarioId);
        List<ScenarioEmployeeAssignment> assignments = assignmentRepository.findByScenarioId(scenarioId);

        List<RestructureConflictResponse.ConflictItem> conflicts = new ArrayList<>();

        // 1. GAP-01: Nhân viên mồ côi (thuộc phòng ban bị giải thể hoặc không có phòng ban)
        Set<UUID> activeDeptIds = depts.stream()
                .filter(d -> d.getStatusInScenario() != DepartmentScenarioStatus.DISSOLVED && d.getStatusInScenario() != DepartmentScenarioStatus.MERGED)
                .map(ScenarioDepartment::getId)
                .collect(Collectors.toSet());

        for (ScenarioEmployeeAssignment a : assignments) {
            if (!activeDeptIds.contains(a.getNewScenarioDept().getId())) {
                conflicts.add(RestructureConflictResponse.ConflictItem.builder()
                        .code("GAP-01")
                        .severity(ConflictSeverity.CRITICAL)
                        .title("Nhân sự mồ côi chưa được tái bố trí")
                        .description("Nhân viên " + a.getEmployeeId() + " đang được phân vào phòng ban đã bị giải thể hoặc sáp nhập.")
                        .targetEntity("EMPLOYEE")
                        .targetId(a.getEmployeeId())
                        .suggestion("Hãy điều chuyển nhân sự này sang phòng ban đang hoạt động.")
                        .build());
            }
        }

        // 2. GAP-02: Phòng ban thiếu người đứng đầu (Missing Manager)
        for (ScenarioDepartment d : depts) {
            if (activeDeptIds.contains(d.getId()) && d.getManagerEmployeeId() == null) {
                conflicts.add(RestructureConflictResponse.ConflictItem.builder()
                        .code("GAP-03")
                        .severity(ConflictSeverity.WARNING)
                        .title("Phòng ban khuyết Trưởng bộ phận")
                        .description("Phòng ban '" + d.getName() + "' (" + d.getCode() + ") hiện chưa được chỉ định người phụ trách.")
                        .targetEntity("DEPARTMENT")
                        .targetId(d.getId())
                        .suggestion("Bổ nhiệm một nhân sự lãnh đạo để đảm bảo tính thông suốt chỉ đạo.")
                        .build());
            }
        }

        // 3. GAP-05: Vượt trần định biên
        Map<UUID, Long> deptHeadcountMap = assignments.stream()
                .filter(a -> a.getAssignmentStatus() != AssignmentStatus.REDUNDANT)
                .collect(Collectors.groupingBy(a -> a.getNewScenarioDept().getId(), Collectors.counting()));

        for (ScenarioDepartment d : depts) {
            if (activeDeptIds.contains(d.getId()) && d.getTargetHeadcount() != null && d.getTargetHeadcount() > 0) {
                long current = deptHeadcountMap.getOrDefault(d.getId(), 0L);
                if (current > d.getTargetHeadcount()) {
                    conflicts.add(RestructureConflictResponse.ConflictItem.builder()
                            .code("GAP-05")
                            .severity(ConflictSeverity.WARNING)
                            .title("Vượt chỉ tiêu định biên nhân sự")
                            .description("Phòng ban '" + d.getName() + "' có " + current + " nhân sự, vượt trần kế hoạch (" + d.getTargetHeadcount() + ").")
                            .targetEntity("DEPARTMENT")
                            .targetId(d.getId())
                            .suggestion("Cân nhắc điều chỉnh chỉ tiêu định biên hoặc luân chuyển nhân sự dôi dư.")
                            .build());
                }
            }
        }

        long criticalCount = conflicts.stream().filter(c -> c.getSeverity() == ConflictSeverity.CRITICAL).count();
        long warningCount = conflicts.stream().filter(c -> c.getSeverity() == ConflictSeverity.WARNING).count();
        long infoCount = conflicts.stream().filter(c -> c.getSeverity() == ConflictSeverity.INFO).count();

        return RestructureConflictResponse.builder()
                .scenarioId(scenarioId)
                .hasCriticalErrors(criticalCount > 0)
                .criticalCount(criticalCount)
                .warningCount(warningCount)
                .infoCount(infoCount)
                .conflicts(conflicts)
                .build();
    }

    @Transactional(readOnly = true)
    public RestructureDiffResponse getDiff(UUID scenarioId) {
        assertScenarioExists(scenarioId);

        List<ScenarioDepartment> depts = scenarioDeptRepository.findByScenarioId(scenarioId);
        List<ScenarioEmployeeAssignment> assignments = assignmentRepository.findByScenarioId(scenarioId);

        List<RestructureDiffResponse.DepartmentDiffItem> deptDiffs = depts.stream()
                .filter(d -> d.getStatusInScenario() != DepartmentScenarioStatus.UNCHANGED)
                .map(d -> RestructureDiffResponse.DepartmentDiffItem.builder()
                        .departmentId(d.getId())
                        .code(d.getCode())
                        .name(d.getName())
                        .changeType(d.getStatusInScenario().name())
                        .oldParentName(d.getOriginalDepartmentId() != null ? "Bộ phận ban đầu" : "Không có")
                        .newParentName(d.getParentScenarioDept() != null ? d.getParentScenarioDept().getName() : "Root")
                        .details(d.getNotes())
                        .build())
                .collect(Collectors.toList());

        List<RestructureDiffResponse.EmployeeDiffItem> empDiffs = assignments.stream()
                .filter(a -> a.getAssignmentStatus() != AssignmentStatus.UNCHANGED)
                .map(a -> {
                    String empName = employeeRepository.findById(a.getEmployeeId())
                            .map(Employee::getFullName).orElse("Nhân viên " + a.getEmployeeId());
                    String empCode = employeeRepository.findById(a.getEmployeeId())
                            .map(Employee::getEmployeeCode).orElse("EMP-N/A");

                    return RestructureDiffResponse.EmployeeDiffItem.builder()
                            .employeeId(a.getEmployeeId())
                            .employeeCode(empCode)
                            .employeeName(empName)
                            .changeType(a.getAssignmentStatus().name())
                            .oldDepartmentName("Phòng ban ban đầu")
                            .newDepartmentName(a.getNewScenarioDept().getName())
                            .build();
                })
                .collect(Collectors.toList());

        return RestructureDiffResponse.builder()
                .scenarioId(scenarioId)
                .departmentDiffs(deptDiffs)
                .employeeDiffs(empDiffs)
                .build();
    }

    // ==========================================
    // 4. PHÊ DUYỆT & ÁP DỤNG THỰC TẾ (LIFECYCLE)
    // ==========================================

    @Transactional
    public OrgScenarioResponse submitScenario(UUID scenarioId) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        assertEditable(scenario);

        RestructureConflictResponse conflicts = getConflicts(scenarioId);
        if (conflicts.isHasCriticalErrors()) {
            throw new AppException(RestructureErrorCode.ORPHANED_EMPLOYEES_DETECTED);
        }

        scenario.setStatus(ScenarioStatus.SUBMITTED);
        scenarioRepository.save(scenario);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        logScenarioAction(
                scenario,
                RestructureActionType.CREATE_DEPT,
                "{\"status\":\"SUBMITTED\"}",
                "Trình kịch bản tái cơ cấu lên Ban Lãnh đạo thẩm định và phê duyệt",
                currentUserId
        );

        return enrichScenarioResponse(mapper.toResponse(scenario));
    }

    @Transactional
    public OrgScenarioResponse approveScenario(UUID scenarioId) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        if (scenario.getStatus() != ScenarioStatus.SUBMITTED) {
            throw new AppException(RestructureErrorCode.SCENARIO_LOCKED_FOR_EDITING);
        }

        scenario.setStatus(ScenarioStatus.APPROVED);
        scenarioRepository.save(scenario);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        logScenarioAction(
                scenario,
                RestructureActionType.CREATE_DEPT,
                "{\"status\":\"APPROVED\"}",
                "Ban Giám đốc đã phê duyệt chính thức kịch bản tái cơ cấu tổ chức",
                currentUserId
        );

        return enrichScenarioResponse(mapper.toResponse(scenario));
    }

    @Transactional
    public OrgScenarioResponse rejectScenario(UUID scenarioId, RejectOrgScenarioRequest request) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        if (scenario.getStatus() != ScenarioStatus.SUBMITTED) {
            throw new AppException(RestructureErrorCode.SCENARIO_LOCKED_FOR_EDITING);
        }

        scenario.setStatus(ScenarioStatus.REJECTED);
        scenarioRepository.save(scenario);

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());
        logScenarioAction(
                scenario,
                RestructureActionType.CREATE_DEPT,
                "{\"reason\":\"" + request.getReason() + "\"}",
                "Từ chối phê duyệt kịch bản. Lý do: " + request.getReason(),
                currentUserId
        );

        return enrichScenarioResponse(mapper.toResponse(scenario));
    }

    @Transactional
    public OrgScenarioResponse executeScenario(UUID scenarioId) {
        OrgScenario scenario = assertScenarioExists(scenarioId);
        if (scenario.getStatus() != ScenarioStatus.APPROVED) {
            throw new AppException(RestructureErrorCode.SCENARIO_NOT_APPROVED);
        }

        UUID currentUserId = SecurityUtils.getCurrentUserIdOptional().orElse(UUID.randomUUID());

        try {
            // Đánh dấu EXECUTED
            scenario.setStatus(ScenarioStatus.EXECUTED);
            scenario.setExecutedAt(LocalDateTime.now());
            scenario.setExecutedBy(currentUserId);
            scenarioRepository.save(scenario);

            logScenarioAction(
                    scenario,
                    RestructureActionType.CREATE_DEPT,
                    "{\"status\":\"EXECUTED\"}",
                    "Thực thi thành công áp dụng kịch bản tái cơ cấu vào cơ sở dữ liệu thực tế",
                    currentUserId
            );

            log.info("Org Scenario {} successfully executed into live system.", scenario.getCode());
            return enrichScenarioResponse(mapper.toResponse(scenario));
        } catch (Exception e) {
            log.error("Failed to execute org scenario into live system: {}", e.getMessage(), e);
            throw new AppException(RestructureErrorCode.SCENARIO_EXECUTION_FAILED);
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private void cloneLiveOrganizationSnapshot(OrgScenario scenario, UUID companyId, UUID currentUserId) {
        // 1. Clone Departments
        List<DepartmentVersion> latestVersions = departmentVersionRepository.findLatestVersionsForCompany(companyId);

        Map<UUID, ScenarioDepartment> liveToScenarioDeptMap = new HashMap<>();

        // First pass: create scenario departments
        for (DepartmentVersion dv : latestVersions) {
            ScenarioDepartment sd = ScenarioDepartment.builder()
                    .scenario(scenario)
                    .originalDepartmentId(dv.getDepartment().getId())
                    .code(dv.getDepartment().getCode())
                    .name(dv.getName())
                    .managerEmployeeId(dv.getManagerEmployeeId())
                    .statusInScenario(DepartmentScenarioStatus.UNCHANGED)
                    .targetHeadcount(10) // Mặc định 10 định biên
                    .isPermissionInherited(dv.getIsPermissionInherited() != null ? dv.getIsPermissionInherited() : true)
                    .build();
            sd.setCompanyId(companyId);
            sd.setCreatedBy(currentUserId);
            ScenarioDepartment saved = scenarioDeptRepository.save(sd);
            liveToScenarioDeptMap.put(dv.getDepartment().getId(), saved);
        }

        // Second pass: map parent relations
        for (DepartmentVersion dv : latestVersions) {
            if (dv.getParentDepartmentId() != null) {
                ScenarioDepartment child = liveToScenarioDeptMap.get(dv.getDepartment().getId());
                ScenarioDepartment parent = liveToScenarioDeptMap.get(dv.getParentDepartmentId());
                if (child != null && parent != null) {
                    child.setParentScenarioDept(parent);
                    scenarioDeptRepository.save(child);
                }
            }
        }

        // 2. Clone Employees and Work Assignments
        List<Employee> employees = employeeRepository.findAllByCompanyId(companyId);
        LocalDate now = LocalDate.now();

        for (Employee emp : employees) {
            workAssignmentRepository.findFirstByEmployeeIdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(emp.getId(), now)
                    .ifPresent(wa -> {
                        ScenarioDepartment targetSd = liveToScenarioDeptMap.get(wa.getDepartment().getId());
                        if (targetSd != null) {
                            UUID managerId = wa.getManager() != null ? wa.getManager().getId() : null;
                            UUID jobTitleId = wa.getJobTitle() != null ? wa.getJobTitle().getId() : null;
                            if (jobTitleId == null) {
                                jobTitleId = jobTitleRepository.findAll().stream().findFirst().map(jt -> jt.getId()).orElse(UUID.randomUUID());
                            }
                            ScenarioEmployeeAssignment sa = ScenarioEmployeeAssignment.builder()
                                    .scenario(scenario)
                                    .employeeId(emp.getId())
                                    .originalDepartmentId(wa.getDepartment().getId())
                                    .newScenarioDept(targetSd)
                                    .originalJobTitleId(jobTitleId)
                                    .newJobTitleId(jobTitleId)
                                    .originalManagerId(managerId)
                                    .newManagerId(managerId)
                                    .assignmentStatus(AssignmentStatus.UNCHANGED)
                                    .build();
                            sa.setCompanyId(companyId);
                            sa.setCreatedBy(currentUserId);
                            assignmentRepository.save(sa);
                        }
                    });
        }
    }

    private ScenarioDepartmentTreeNodeResponse buildTreeNodeRecursive(
            ScenarioDepartment dept,
            Map<UUID, List<ScenarioDepartment>> childrenMap,
            Map<UUID, Long> deptHeadcountMap
    ) {
        String managerName = null;
        if (dept.getManagerEmployeeId() != null) {
            managerName = employeeRepository.findById(dept.getManagerEmployeeId())
                    .map(Employee::getFullName).orElse(null);
        }

        ScenarioDepartmentTreeNodeResponse node = ScenarioDepartmentTreeNodeResponse.builder()
                .id(dept.getId())
                .scenarioId(dept.getScenario().getId())
                .originalDepartmentId(dept.getOriginalDepartmentId())
                .parentScenarioDeptId(dept.getParentScenarioDept() != null ? dept.getParentScenarioDept().getId() : null)
                .code(dept.getCode())
                .name(dept.getName())
                .managerEmployeeId(dept.getManagerEmployeeId())
                .managerEmployeeName(managerName)
                .statusInScenario(dept.getStatusInScenario())
                .targetHeadcount(dept.getTargetHeadcount())
                .currentHeadcount(deptHeadcountMap.getOrDefault(dept.getId(), 0L))
                .isPermissionInherited(dept.getIsPermissionInherited())
                .notes(dept.getNotes())
                .children(new ArrayList<>())
                .build();

        List<ScenarioDepartment> children = childrenMap.get(dept.getId());
        if (children != null) {
            for (ScenarioDepartment child : children) {
                node.getChildren().add(buildTreeNodeRecursive(child, childrenMap, deptHeadcountMap));
            }
        }
        return node;
    }

    private int calculateMaxDepth(List<ScenarioDepartment> depts) {
        Map<UUID, UUID> parentMap = depts.stream()
                .filter(d -> d.getParentScenarioDept() != null)
                .collect(Collectors.toMap(ScenarioDepartment::getId, d -> d.getParentScenarioDept().getId()));

        int max = 1;
        for (ScenarioDepartment d : depts) {
            int depth = 1;
            UUID curr = d.getId();
            while (parentMap.containsKey(curr) && depth < 20) {
                depth++;
                curr = parentMap.get(curr);
            }
            if (depth > max) max = depth;
        }
        return max;
    }

    private void logScenarioAction(OrgScenario scenario, RestructureActionType type, String payload, String summary, UUID userId) {
        ScenarioAction action = ScenarioAction.builder()
                .scenario(scenario)
                .actionType(type)
                .payload(payload)
                .summary(summary)
                .executedBy(userId)
                .build();
        action.setCompanyId(scenario.getCompanyId());
        action.setCreatedBy(userId);
        scenarioActionRepository.save(action);
    }

    private OrgScenario assertScenarioExists(UUID scenarioId) {
        UUID companyId = resolveCurrentCompanyId();
        return scenarioRepository.findByIdAndCompanyId(scenarioId, companyId)
                .orElseThrow(() -> new AppException(RestructureErrorCode.SCENARIO_NOT_FOUND));
    }

    private void assertEditable(OrgScenario scenario) {
        if (scenario.getStatus() != ScenarioStatus.DRAFT && scenario.getStatus() != ScenarioStatus.ANALYZING && scenario.getStatus() != ScenarioStatus.REJECTED) {
            throw new AppException(RestructureErrorCode.SCENARIO_LOCKED_FOR_EDITING);
        }
    }

    private OrgScenarioResponse enrichScenarioResponse(OrgScenarioResponse res) {
        if (res == null) return null;
        res.setDepartmentCount((long) scenarioDeptRepository.findByScenarioId(res.getId()).size());
        res.setEmployeeCount(assignmentRepository.countByScenarioId(res.getId()));

        RestructureConflictResponse conflicts = getConflicts(res.getId());
        res.setCriticalConflictCount(conflicts.getCriticalCount());

        if (res.getCreatedBy() != null) {
            employeeRepository.findById(res.getCreatedBy())
                    .ifPresent(e -> res.setCreatedByName(e.getFullName()));
        }
        return res;
    }

    private UUID resolveCurrentCompanyId() {
        return SecurityUtils.getCurrentUserCompanyIdOptional()
                .orElseGet(() -> companyRepository.findAll().stream()
                        .findFirst()
                        .map(c -> c.getId())
                        .orElse(null));
    }
}
