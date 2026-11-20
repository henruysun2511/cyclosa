package com.cyclosa.leave.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.security.SecurityPermissionEvaluator;
import com.cyclosa.common.enums.DataScope;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.contract.entity.enums.ContractType;
import com.cyclosa.employee.dto.response.EmployeeDetailResponse;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.leave.dto.request.CarryOverLeaveRequest;
import com.cyclosa.leave.dto.request.GenerateLeaveBalancesRequest;
import com.cyclosa.leave.dto.request.LeaveBalanceFilter;
import com.cyclosa.leave.dto.request.RecalculateLeaveBalanceRequest;
import com.cyclosa.leave.dto.response.LeaveBalanceResponse;
import com.cyclosa.leave.entity.LeaveBalance;
import com.cyclosa.leave.entity.LeavePolicy;
import com.cyclosa.leave.entity.LeaveType;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import com.cyclosa.leave.exception.LeaveErrorCode;
import com.cyclosa.leave.repository.LeaveBalanceRepository;
import com.cyclosa.leave.repository.LeaveRequestRepository;
import com.cyclosa.leave.repository.LeaveTypeRepository;
import com.cyclosa.leave.repository.specification.LeaveBalanceSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveBalanceService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("year", "entitledDays", "carriedOverDays", "createdAt");

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveTypeService leaveTypeService;
    private final LeavePolicyService leavePolicyService;
    private final EmployeeService employeeService;
    private final SecurityPermissionEvaluator perm;

    @Transactional(readOnly = true)
    public PageData<LeaveBalanceResponse> getLeaveBalances(LeaveBalanceFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DataScope scope = perm.getDataScope("leave.view").orElse(DataScope.OWN);
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Collection<UUID> allowedEmployeeIds = resolveAllowedEmployeeIds(scope, currentUserId);
        Specification<LeaveBalance> spec = LeaveBalanceSpecification.withFilter(companyId, filter, allowedEmployeeIds);
        Page<LeaveBalance> pageResult = leaveBalanceRepository.findAll(spec, pageable);

        return PageData.of(pageResult, this::toDerivedResponse);
    }

    @Transactional(readOnly = true)
    public List<LeaveBalanceResponse> getMyBalances(Integer year) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản đang đăng nhập"));

        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        return getBalancesByEmployeeAndYear(employee.getId(), targetYear);
    }

    @Transactional(readOnly = true)
    public List<LeaveBalanceResponse> getBalancesByEmployeeAndYear(UUID employeeId, Integer year) {
        int targetYear = (year != null) ? year : LocalDate.now().getYear();
        List<LeaveBalance> balances = leaveBalanceRepository.findByEmployeeIdAndYearWithLeaveType(employeeId, targetYear);
        return balances.stream().map(this::toDerivedResponse).collect(Collectors.toList());
    }

    @Transactional
    @Auditable(action = AuditAction.CREATE, entityType = "LEAVE_BALANCE", description = "Cấp quỹ phép năm cho nhân viên")
    public List<LeaveBalanceResponse> generateBalances(GenerateLeaveBalancesRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        int year = request.getYear();

        // Lấy danh sách loại nghỉ có hạn mức (ANNUAL)
        List<LeaveType> annualTypes = leaveTypeRepository.findByCompanyIdAndLeaveGroup(companyId, LeaveGroup.ANNUAL);
        if (annualTypes.isEmpty()) {
            log.warn("Công ty {} chưa cấu hình loại nghỉ ANNUAL nào", companyId);
            return Collections.emptyList();
        }

        // Lấy danh sách nhân viên cần cấp
        List<Employee> targetEmployees;
        if (request.getEmployeeIds() != null && !request.getEmployeeIds().isEmpty()) {
            targetEmployees = request.getEmployeeIds().stream()
                    .map(employeeService::findEntityById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .filter(e -> e.getCompanyId().equals(companyId))
                    .collect(Collectors.toList());
        } else {
            targetEmployees = employeeService.findAllEntities().stream()
                    .filter(e -> e.getCompanyId().equals(companyId))
                    .collect(Collectors.toList());
        }

        List<LeaveBalance> savedBalances = new ArrayList<>();
        LocalDate yearStart = LocalDate.of(year, 1, 1);

        for (Employee emp : targetEmployees) {
            for (LeaveType leaveType : annualTypes) {
                // Xác định chính sách áp dụng theo loại hợp đồng (nếu có)
                Optional<LeavePolicy> policyOpt = leavePolicyService.resolveApplicablePolicy(
                        companyId, leaveType.getId(), null, yearStart);

                if (policyOpt.isEmpty()) {
                    continue;
                }

                LeavePolicy policy = policyOpt.get();
                BigDecimal entitledDays = calculateEntitledDays(emp, policy, year);

                LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                        emp.getId(), leaveType.getId(), year)
                        .orElseGet(() -> LeaveBalance.builder()
                                .companyId(companyId)
                                .employeeId(emp.getId())
                                .leaveType(leaveType)
                                .year(year)
                                .carriedOverDays(BigDecimal.ZERO)
                                .build());

                balance.setEntitledDays(entitledDays);
                balance.setNotes(request.getNotes());
                savedBalances.add(leaveBalanceRepository.save(balance));
            }
        }

        log.info("Đã cấp quỹ phép năm {} cho {} bản ghi nhân viên", year, savedBalances.size());
        return savedBalances.stream().map(this::toDerivedResponse).collect(Collectors.toList());
    }

    @Transactional
    @Auditable(action = AuditAction.UPDATE, entityType = "LEAVE_BALANCE", description = "Tính lại quỹ phép năm cho nhân viên")
    public LeaveBalanceResponse recalculateBalance(UUID employeeId, RecalculateLeaveBalanceRequest request) {
        Employee employee = employeeService.findEmployeeOrThrow(employeeId);
        LeaveType leaveType = leaveTypeService.findEntityById(request.getLeaveTypeId());
        int year = request.getYear();

        LocalDate yearStart = LocalDate.of(year, 1, 1);
        LeavePolicy policy = leavePolicyService.resolveApplicablePolicy(
                employee.getCompanyId(), leaveType.getId(), null, yearStart)
                .orElseThrow(() -> new AppException(LeaveErrorCode.NO_APPLICABLE_LEAVE_POLICY));

        BigDecimal entitledDays = calculateEntitledDays(employee, policy, year);

        LeaveBalance balance = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                employeeId, leaveType.getId(), year)
                .orElseGet(() -> LeaveBalance.builder()
                        .companyId(employee.getCompanyId())
                        .employeeId(employeeId)
                        .leaveType(leaveType)
                        .year(year)
                        .carriedOverDays(BigDecimal.ZERO)
                        .build());

        balance.setEntitledDays(entitledDays);
        LeaveBalance saved = leaveBalanceRepository.save(balance);
        log.info("Đã tính lại quỹ phép năm {} cho nhân viên {}: {} ngày", year, employee.getEmployeeCode(), entitledDays);

        return toDerivedResponse(saved);
    }

    @Transactional
    @Auditable(action = AuditAction.UPDATE, entityType = "LEAVE_BALANCE", description = "Chuyển phép tồn sang năm sau")
    public List<LeaveBalanceResponse> carryOverLeave(CarryOverLeaveRequest request) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        int fromYear = request.getFromYear();
        int toYear = fromYear + 1;

        List<LeaveBalance> fromBalances = leaveBalanceRepository.findByCompanyIdAndYear(companyId, fromYear);
        List<LeaveBalance> updatedToBalances = new ArrayList<>();

        for (LeaveBalance fromBal : fromBalances) {
            // Tính số dư còn lại của năm trước
            BigDecimal remainingDays = computeRemainingDays(fromBal);
            if (remainingDays.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            // Lấy chính sách để giới hạn maxCarryoverDays
            LocalDate targetYearDate = LocalDate.of(toYear, 1, 1);
            Optional<LeavePolicy> policyOpt = leavePolicyService.resolveApplicablePolicy(
                    companyId, fromBal.getLeaveType().getId(), null, targetYearDate);

            BigDecimal maxCarry = policyOpt.map(LeavePolicy::getMaxCarryoverDays).orElse(BigDecimal.ZERO);
            BigDecimal carriedDays = remainingDays.min(maxCarry);

            if (carriedDays.compareTo(BigDecimal.ZERO) > 0) {
                LeaveBalance toBal = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                        fromBal.getEmployeeId(), fromBal.getLeaveType().getId(), toYear)
                        .orElseGet(() -> LeaveBalance.builder()
                                .companyId(companyId)
                                .employeeId(fromBal.getEmployeeId())
                                .leaveType(fromBal.getLeaveType())
                                .year(toYear)
                                .entitledDays(BigDecimal.ZERO)
                                .build());

                toBal.setCarriedOverDays(carriedDays);
                updatedToBalances.add(leaveBalanceRepository.save(toBal));
            }
        }

        log.info("Đã kết chuyển phép tồn từ năm {} sang năm {} cho {} nhân viên", fromYear, toYear, updatedToBalances.size());
        return updatedToBalances.stream().map(this::toDerivedResponse).collect(Collectors.toList());
    }

    public BigDecimal computeRemainingDays(LeaveBalance balance) {
        LocalDate yearStart = LocalDate.of(balance.getYear(), 1, 1);
        LocalDate yearEnd = LocalDate.of(balance.getYear(), 12, 31);

        BigDecimal usedDays = leaveRequestRepository.sumDaysByEmployeeAndLeaveTypeAndYearAndStatus(
                balance.getEmployeeId(), balance.getLeaveType().getId(), yearStart, yearEnd, LeaveRequestStatus.APPROVED);

        BigDecimal pendingDays = leaveRequestRepository.sumDaysByEmployeeAndLeaveTypeAndYearAndStatus(
                balance.getEmployeeId(), balance.getLeaveType().getId(), yearStart, yearEnd, LeaveRequestStatus.PENDING_APPROVAL);

        return balance.getEntitledDays()
                .add(balance.getCarriedOverDays())
                .subtract(usedDays)
                .subtract(pendingDays);
    }

    public LeaveBalanceResponse toDerivedResponse(LeaveBalance balance) {
        LocalDate yearStart = LocalDate.of(balance.getYear(), 1, 1);
        LocalDate yearEnd = LocalDate.of(balance.getYear(), 12, 31);

        BigDecimal usedDays = leaveRequestRepository.sumDaysByEmployeeAndLeaveTypeAndYearAndStatus(
                balance.getEmployeeId(), balance.getLeaveType().getId(), yearStart, yearEnd, LeaveRequestStatus.APPROVED);

        BigDecimal pendingDays = leaveRequestRepository.sumDaysByEmployeeAndLeaveTypeAndYearAndStatus(
                balance.getEmployeeId(), balance.getLeaveType().getId(), yearStart, yearEnd, LeaveRequestStatus.PENDING_APPROVAL);

        BigDecimal totalEntitled = balance.getEntitledDays().add(balance.getCarriedOverDays());
        BigDecimal remainingDays = totalEntitled.subtract(usedDays).subtract(pendingDays);

        // Lấy thông tin nhân viên từ EmployeeService
        String empCode = "";
        String fullName = "";
        String deptName = "";
        String jobTitle = "";

        try {
            EmployeeDetailResponse empDetail = employeeService.getEmployeeById(balance.getEmployeeId());
            if (empDetail != null) {
                empCode = empDetail.getEmployeeCode();
                fullName = empDetail.getFullName();
                if (empDetail.getCurrentAssignment() != null) {
                    deptName = empDetail.getCurrentAssignment().getDepartmentName();
                    jobTitle = empDetail.getCurrentAssignment().getJobTitleName();
                }
            }
        } catch (Exception e) {
            log.debug("Không thể lấy thông tin chi tiết nhân viên {}: {}", balance.getEmployeeId(), e.getMessage());
        }

        return LeaveBalanceResponse.builder()
                .id(balance.getId())
                .companyId(balance.getCompanyId())
                .employeeId(balance.getEmployeeId())
                .employeeCode(empCode)
                .employeeFullName(fullName)
                .departmentName(deptName)
                .jobTitleName(jobTitle)
                .leaveTypeId(balance.getLeaveType().getId())
                .leaveTypeCode(balance.getLeaveType().getCode())
                .leaveTypeName(balance.getLeaveType().getName())
                .leaveGroup(balance.getLeaveType().getLeaveGroup())
                .year(balance.getYear())
                .entitledDays(balance.getEntitledDays())
                .carriedOverDays(balance.getCarriedOverDays())
                .totalEntitledDays(totalEntitled)
                .usedDays(usedDays)
                .pendingDays(pendingDays)
                .remainingDays(remainingDays)
                .notes(balance.getNotes())
                .updatedAt(balance.getUpdatedAt())
                .build();
    }

    private BigDecimal calculateEntitledDays(Employee emp, LeavePolicy policy, int year) {
        BigDecimal base = policy.getAnnualEntitlementDays();
        LocalDate hireDate = emp.getStartDate();

        // 1. Tính tỷ lệ thời gian (pro-rata) nếu vào làm trong năm xét duyệt
        BigDecimal proRata = base;
        if (hireDate != null && hireDate.getYear() == year) {
            int workedMonths = 12 - hireDate.getMonthValue() + 1;
            if (hireDate.getDayOfMonth() > 15) {
                workedMonths = Math.max(0, workedMonths - 1);
            }
            proRata = base.multiply(BigDecimal.valueOf(workedMonths))
                    .divide(BigDecimal.valueOf(12), 1, RoundingMode.HALF_UP);
        } else if (hireDate != null && hireDate.getYear() > year) {
            return BigDecimal.ZERO;
        }

        // 2. Tính thâm niên (seniority bonus): Cứ N năm thâm niên được cộng thêm M ngày
        BigDecimal bonus = BigDecimal.ZERO;
        if (hireDate != null && policy.getSeniorityStepYears() != null && policy.getSeniorityStepYears() > 0
                && policy.getSeniorityBonusDays() != null) {
            LocalDate yearStart = LocalDate.of(year, 1, 1);
            if (hireDate.isBefore(yearStart)) {
                int yearsOfService = Period.between(hireDate, yearStart).getYears();
                int steps = yearsOfService / policy.getSeniorityStepYears();
                bonus = policy.getSeniorityBonusDays().multiply(BigDecimal.valueOf(steps));
            }
        }

        return proRata.add(bonus);
    }

    private Collection<UUID> resolveAllowedEmployeeIds(DataScope scope, UUID currentUserId) {
        if (scope == DataScope.ALL || scope == DataScope.COMPANY) {
            return null; // Không giới hạn nhân viên
        }

        Optional<Employee> currentEmpOpt = employeeService.findByUserId(currentUserId);
        if (currentEmpOpt.isEmpty()) {
            return Collections.emptyList();
        }

        UUID empId = currentEmpOpt.get().getId();
        if (scope == DataScope.OWN) {
            return List.of(empId);
        }

        // Với TEAM hoặc DEPARTMENT: lấy các nhân viên cùng phòng ban qua EmployeeService
        try {
            EmployeeDetailResponse detail = employeeService.getEmployeeById(empId);
            if (detail != null && detail.getCurrentAssignment() != null && detail.getCurrentAssignment().getDepartmentId() != null) {
                UUID deptId = detail.getCurrentAssignment().getDepartmentId();
                return employeeService.findAllEntities().stream()
                        .filter(e -> {
                            try {
                                EmployeeDetailResponse d = employeeService.getEmployeeById(e.getId());
                                return d != null && d.getCurrentAssignment() != null
                                        && deptId.equals(d.getCurrentAssignment().getDepartmentId());
                            } catch (Exception ex) {
                                return false;
                            }
                        })
                        .map(Employee::getId)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Lỗi khi xác định phạm vi phòng ban của user {}: {}", currentUserId, e.getMessage());
        }

        return List.of(empId);
    }
}
