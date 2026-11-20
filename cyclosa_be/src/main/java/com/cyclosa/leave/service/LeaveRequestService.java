package com.cyclosa.leave.service;

import com.cyclosa.audit.aop.Auditable;
import com.cyclosa.audit.enums.AuditAction;
import com.cyclosa.common.security.SecurityPermissionEvaluator;
import com.cyclosa.common.enums.DataScope;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.dto.response.EmployeeDetailResponse;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.service.EmployeeService;
import com.cyclosa.leave.dto.request.CreateLeaveRequest;
import com.cyclosa.leave.dto.request.LeaveCalendarFilter;
import com.cyclosa.leave.dto.request.LeavePreviewRequest;
import com.cyclosa.leave.dto.request.LeaveRequestFilter;
import com.cyclosa.leave.dto.response.LeaveCalendarEventResponse;
import com.cyclosa.leave.dto.response.LeavePreviewResponse;
import com.cyclosa.leave.dto.response.LeaveRequestResponse;
import com.cyclosa.leave.entity.LeaveBalance;
import com.cyclosa.leave.entity.LeaveRequest;
import com.cyclosa.leave.entity.LeaveType;
import com.cyclosa.leave.enums.DayPortion;
import com.cyclosa.leave.enums.LeaveGroup;
import com.cyclosa.leave.enums.LeaveRequestStatus;
import com.cyclosa.leave.exception.LeaveErrorCode;
import com.cyclosa.leave.mapper.LeaveRequestMapper;
import com.cyclosa.leave.repository.LeaveBalanceRepository;
import com.cyclosa.leave.repository.LeaveRequestRepository;
import com.cyclosa.leave.repository.specification.LeaveRequestSpecification;
import com.cyclosa.notification.enums.NotificationType;
import com.cyclosa.notification.event.SendNotificationEvent;
import com.cyclosa.workflow.dto.request.CancelWorkflowRequest;
import com.cyclosa.workflow.dto.request.SubmitWorkflowRequest;
import com.cyclosa.workflow.dto.response.WorkflowRequestDetailResponse;
import com.cyclosa.workflow.enums.RequestType;
import com.cyclosa.workflow.service.WorkflowExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
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
public class LeaveRequestService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("startDate", "endDate", "submittedAt", "status", "daysCount");

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveTypeService leaveTypeService;
    private final LeaveBalanceService leaveBalanceService;
    private final LeaveCalculationHelper leaveCalculationHelper;
    private final EmployeeService employeeService;
    private final WorkflowExecutionService workflowExecutionService;
    private final ApplicationEventPublisher eventPublisher;
    private final SecurityPermissionEvaluator perm;
    private final LeaveRequestMapper leaveRequestMapper;

    @Transactional(readOnly = true)
    public LeavePreviewResponse previewLeaveRequest(LeavePreviewRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = resolveTargetEmployee(request.getEmployeeId(), currentUserId);
        LeaveType leaveType = leaveTypeService.findEntityById(request.getLeaveTypeId());

        LeaveCalculationHelper.CalculationResult calc = leaveCalculationHelper.calculateLeaveDays(
                request.getStartDate(), request.getEndDate(), request.getDayPortion());

        BigDecimal currentRemaining = BigDecimal.ZERO;
        BigDecimal projectedRemaining = BigDecimal.ZERO;
        boolean isSufficient = true;

        if (leaveType.getLeaveGroup() == LeaveGroup.ANNUAL) {
            int year = request.getStartDate().getYear();
            Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                    employee.getId(), leaveType.getId(), year);

            if (balanceOpt.isPresent()) {
                currentRemaining = leaveBalanceService.computeRemainingDays(balanceOpt.get());
            } else {
                currentRemaining = BigDecimal.ZERO;
            }

            projectedRemaining = currentRemaining.subtract(calc.daysCount());
            isSufficient = projectedRemaining.compareTo(BigDecimal.ZERO) >= 0;
        }

        return LeavePreviewResponse.builder()
                .daysCount(calc.daysCount())
                .weekendDays(calc.weekendDays())
                .holidayDays(calc.holidayDays())
                .holidayDates(calc.holidayDates())
                .currentRemainingDays(currentRemaining)
                .projectedRemainingDays(projectedRemaining)
                .isBalanceSufficient(isSufficient)
                .requiresApproval(leaveType.isRequiresApproval())
                .build();
    }

    @Transactional
    @Auditable(action = AuditAction.CREATE, entityType = "LEAVE_REQUEST", entityIdExpression = "#result.id", description = "Tạo đơn xin nghỉ phép")
    public LeaveRequestResponse createLeaveRequest(CreateLeaveRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Employee employee = resolveTargetEmployee(request.getEmployeeId(), currentUserId);
        LeaveType leaveType = leaveTypeService.findEntityById(request.getLeaveTypeId());

        // 1. Kiểm tra tính hợp lệ của ngày và buổi nghỉ
        LeaveCalculationHelper.CalculationResult calc = leaveCalculationHelper.calculateLeaveDays(
                request.getStartDate(), request.getEndDate(), request.getDayPortion());

        if (calc.daysCount().compareTo(BigDecimal.ZERO) <= 0) {
            throw AppException.badRequest("Khoảng thời gian chọn toàn bộ rơi vào ngày nghỉ hoặc ngày lễ");
        }

        // 2. Chặn đơn trùng ngày với các đơn PENDING_APPROVAL hoặc APPROVED
        List<LeaveRequest> overlapping = leaveRequestRepository.findOverlappingRequests(
                employee.getId(), request.getStartDate(), request.getEndDate(),
                List.of(LeaveRequestStatus.PENDING_APPROVAL, LeaveRequestStatus.APPROVED));

        for (LeaveRequest existing : overlapping) {
            // Nếu cùng ngày và đều là nửa ngày khác buổi nhau thì cho phép
            if (existing.getStartDate().equals(request.getStartDate()) && existing.getEndDate().equals(request.getEndDate())) {
                if (existing.getDayPortion() == DayPortion.MORNING && request.getDayPortion() == DayPortion.AFTERNOON) {
                    continue;
                }
                if (existing.getDayPortion() == DayPortion.AFTERNOON && request.getDayPortion() == DayPortion.MORNING) {
                    continue;
                }
            }
            throw new AppException(LeaveErrorCode.OVERLAPPING_LEAVE_REQUEST);
        }

        // 3. Nếu là phép năm (ANNUAL), kiểm tra số dư khả dụng
        if (leaveType.getLeaveGroup() == LeaveGroup.ANNUAL) {
            int year = request.getStartDate().getYear();
            Optional<LeaveBalance> balanceOpt = leaveBalanceRepository.findByEmployeeIdAndLeaveTypeIdAndYear(
                    employee.getId(), leaveType.getId(), year);

            BigDecimal currentRemaining = balanceOpt.map(leaveBalanceService::computeRemainingDays).orElse(BigDecimal.ZERO);
            if (currentRemaining.compareTo(calc.daysCount()) < 0) {
                throw new AppException(LeaveErrorCode.INSUFFICIENT_LEAVE_BALANCE);
            }
        }

        // 4. Khởi tạo đối tượng LeaveRequest
        LeaveRequest leaveReq = LeaveRequest.builder()
                .companyId(companyId)
                .employeeId(employee.getId())
                .requestedByUserId(currentUserId)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .dayPortion(request.getDayPortion())
                .daysCount(calc.daysCount())
                .reason(request.getReason())
                .submittedAt(LocalDateTime.now())
                .status(leaveType.isRequiresApproval() ? LeaveRequestStatus.PENDING_APPROVAL : LeaveRequestStatus.APPROVED)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveReq);

        // 5. Nếu cần phê duyệt, đẩy vào WorkflowExecutionService
        if (leaveType.isRequiresApproval()) {
            try {
                SubmitWorkflowRequest wfRequest = SubmitWorkflowRequest.builder()
                        .companyId(companyId)
                        .requestType(RequestType.LEAVE_REQUEST)
                        .referenceId(saved.getId())
                        .referenceCode("LR-" + saved.getId().toString().substring(0, 8).toUpperCase())
                        .title("Đơn nghỉ phép: " + employee.getLastName() + " " + employee.getFirstName() + " (" + calc.daysCount() + " ngày)")
                        .requesterEmployeeId(employee.getId())
                        .requestAmount(calc.daysCount())
                        .metadata(leaveType.getName() + " từ " + saved.getStartDate() + " đến " + saved.getEndDate())
                        .build();

                WorkflowRequestDetailResponse wfResponse = workflowExecutionService.submit(wfRequest);
                if (wfResponse != null) {
                    saved.setWorkflowRequestId(wfResponse.getId());
                    saved = leaveRequestRepository.save(saved);
                }
            } catch (Exception e) {
                log.warn("Không thể kích hoạt quy trình phê duyệt tự động cho đơn nghỉ {}: {}", saved.getId(), e.getMessage());
            }
        }

        // 6. Phát sự kiện thông báo
        if (employee.getUserId() != null) {
            String title = leaveType.isRequiresApproval() ? "Đơn xin nghỉ phép đã nộp" : "Đơn xin nghỉ phép đã được duyệt tự động";
            String content = "Đơn nghỉ " + leaveType.getName() + " (" + calc.daysCount() + " ngày) từ "
                    + saved.getStartDate() + " đến " + saved.getEndDate() + (leaveType.isRequiresApproval() ? " đang chờ phê duyệt." : " đã được duyệt.");
            eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                    employee.getUserId(),
                    NotificationType.LEAVE,
                    title,
                    content,
                    "/me/leave"
            ));
        }

        log.info("Đã tạo đơn xin nghỉ phép: id={}, employee={}, days={}", saved.getId(), employee.getEmployeeCode(), saved.getDaysCount());
        return enrichResponse(saved);
    }

    @Transactional
    @Auditable(action = AuditAction.UPDATE, entityType = "LEAVE_REQUEST", entityIdExpression = "#requestId", description = "Hủy đơn xin nghỉ phép")
    public void cancelLeaveRequest(UUID requestId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        LeaveRequest leaveReq = leaveRequestRepository.findByIdWithLeaveType(requestId)
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_REQUEST_NOT_FOUND));

        // Kiểm tra quyền hủy: chỉ người tạo hoặc nhân viên của đơn
        Employee currentEmp = employeeService.findByUserId(currentUserId).orElse(null);
        boolean isOwner = leaveReq.getRequestedByUserId().equals(currentUserId)
                || (currentEmp != null && leaveReq.getEmployeeId().equals(currentEmp.getId()));

        if (!isOwner && !perm.has("leave.manage")) {
            throw AppException.forbidden("Bạn không có quyền hủy đơn xin nghỉ phép này");
        }

        if (leaveReq.getStatus() == LeaveRequestStatus.CANCELLED || leaveReq.getStatus() == LeaveRequestStatus.REJECTED) {
            throw new AppException(LeaveErrorCode.LEAVE_REQUEST_ALREADY_PROCESSED);
        }

        // Không cho phép hủy đơn đã diễn ra trong quá khứ
        if (leaveReq.getStartDate().isBefore(LocalDate.now())) {
            throw new AppException(LeaveErrorCode.CANNOT_CANCEL_PAST_LEAVE_REQUEST);
        }

        // Hủy workflow nếu đang chờ duyệt
        if (leaveReq.getWorkflowRequestId() != null && leaveReq.getStatus() == LeaveRequestStatus.PENDING_APPROVAL) {
            try {
                workflowExecutionService.cancel(leaveReq.getWorkflowRequestId(),
                        CancelWorkflowRequest.builder().reason("Người tạo tự hủy đơn nghỉ").build());
            } catch (Exception e) {
                log.warn("Không thể hủy workflow request {}: {}", leaveReq.getWorkflowRequestId(), e.getMessage());
            }
        }

        leaveReq.setStatus(LeaveRequestStatus.CANCELLED);
        leaveReq.setCancelledAt(LocalDateTime.now());
        leaveReq.setCancelledBy(currentUserId);
        leaveRequestRepository.save(leaveReq);

        log.info("Đã hủy đơn xin nghỉ phép: id={}", requestId);
    }

    @Transactional(readOnly = true)
    public PageData<LeaveRequestResponse> getLeaveRequests(LeaveRequestFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DataScope scope = perm.getDataScope("leave.view").orElse(DataScope.OWN);
        Pageable pageable = filter.toPageable("submittedAt", ALLOWED_SORT_FIELDS);

        Collection<UUID> allowedEmployeeIds = resolveAllowedEmployeeIds(scope, currentUserId, filter.getDepartmentId());
        Specification<LeaveRequest> spec = LeaveRequestSpecification.withFilter(companyId, filter, allowedEmployeeIds);
        Page<LeaveRequest> pageResult = leaveRequestRepository.findAll(spec, pageable);

        return PageData.of(pageResult, this::enrichResponse);
    }

    @Transactional(readOnly = true)
    public PageData<LeaveRequestResponse> getMyLeaveRequests(LeaveRequestFilter filter) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản"));

        filter.setEmployeeId(employee.getId());
        if (filter.getYear() != null) {
            filter.setFrom(LocalDate.of(filter.getYear(), 1, 1));
            filter.setTo(LocalDate.of(filter.getYear(), 12, 31));
        }

        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        Pageable pageable = filter.toPageable("submittedAt", ALLOWED_SORT_FIELDS);

        Specification<LeaveRequest> spec = LeaveRequestSpecification.withFilter(companyId, filter, List.of(employee.getId()));
        Page<LeaveRequest> pageResult = leaveRequestRepository.findAll(spec, pageable);

        return PageData.of(pageResult, this::enrichResponse);
    }

    @Transactional(readOnly = true)
    public LeaveRequestResponse getLeaveRequestById(UUID id) {
        LeaveRequest entity = leaveRequestRepository.findByIdWithLeaveType(id)
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_REQUEST_NOT_FOUND));
        return enrichResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<LeaveCalendarEventResponse> getLeaveCalendar(LeaveCalendarFilter filter) {
        UUID companyId = SecurityUtils.getCurrentUserCompanyId();
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        DataScope scope = perm.getDataScope("leave.view").orElse(DataScope.OWN);

        Collection<UUID> allowedEmployeeIds = resolveAllowedEmployeeIds(scope, currentUserId, filter.getDepartmentId());
        if (allowedEmployeeIds != null && allowedEmployeeIds.isEmpty()) {
            return Collections.emptyList();
        }

        Collection<UUID> queryEmployeeIds = allowedEmployeeIds;
        if (queryEmployeeIds == null) {
            queryEmployeeIds = employeeService.findAllEntities().stream()
                    .filter(e -> e.getCompanyId().equals(companyId))
                    .map(Employee::getId)
                    .collect(Collectors.toList());
        }

        List<LeaveRequest> requests = leaveRequestRepository.findCalendarRequests(
                companyId,
                queryEmployeeIds,
                List.of(LeaveRequestStatus.APPROVED, LeaveRequestStatus.PENDING_APPROVAL),
                filter.getFrom(),
                filter.getTo()
        );

        return requests.stream().map(this::enrichCalendarEvent).collect(Collectors.toList());
    }

    @Transactional
    @Auditable(action = AuditAction.APPROVE, entityType = "LEAVE_REQUEST", entityIdExpression = "#id", description = "Trực tiếp duyệt đơn xin nghỉ phép")
    public LeaveRequestResponse approveDirect(UUID id) {
        LeaveRequest req = leaveRequestRepository.findByIdWithLeaveType(id)
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_REQUEST_NOT_FOUND));

        if (req.getStatus() != LeaveRequestStatus.PENDING_APPROVAL) {
            throw new AppException(LeaveErrorCode.LEAVE_REQUEST_ALREADY_PROCESSED);
        }

        req.setStatus(LeaveRequestStatus.APPROVED);
        LeaveRequest saved = leaveRequestRepository.save(req);

        // Gửi thông báo cho nhân viên
        notifyEmployeeOfDecision(saved, true, null);

        log.info("Đã duyệt trực tiếp đơn xin nghỉ phép: id={}", id);
        return enrichResponse(saved);
    }

    @Transactional
    @Auditable(action = AuditAction.REJECT, entityType = "LEAVE_REQUEST", entityIdExpression = "#id", description = "Trực tiếp từ chối đơn xin nghỉ phép")
    public LeaveRequestResponse rejectDirect(UUID id, String reason) {
        LeaveRequest req = leaveRequestRepository.findByIdWithLeaveType(id)
                .orElseThrow(() -> new AppException(LeaveErrorCode.LEAVE_REQUEST_NOT_FOUND));

        if (req.getStatus() != LeaveRequestStatus.PENDING_APPROVAL) {
            throw new AppException(LeaveErrorCode.LEAVE_REQUEST_ALREADY_PROCESSED);
        }

        req.setStatus(LeaveRequestStatus.REJECTED);
        req.setRejectionReason(reason);
        LeaveRequest saved = leaveRequestRepository.save(req);

        // Gửi thông báo cho nhân viên
        notifyEmployeeOfDecision(saved, false, reason);

        log.info("Đã từ chối trực tiếp đơn xin nghỉ phép: id={}", id);
        return enrichResponse(saved);
    }

    public void updateStatusFromWorkflow(UUID requestId, LeaveRequestStatus newStatus, String comment) {
        leaveRequestRepository.findById(requestId).ifPresent(req -> {
            req.setStatus(newStatus);
            if (newStatus == LeaveRequestStatus.REJECTED) {
                req.setRejectionReason(comment);
            }
            leaveRequestRepository.save(req);
            notifyEmployeeOfDecision(req, newStatus == LeaveRequestStatus.APPROVED, comment);
            log.info("Cập nhật trạng thái đơn nghỉ phép từ Workflow: id={}, status={}", requestId, newStatus);
        });
    }

    private void notifyEmployeeOfDecision(LeaveRequest req, boolean isApproved, String comment) {
        try {
            EmployeeDetailResponse emp = employeeService.getEmployeeById(req.getEmployeeId());
            if (emp != null && emp.getUserId() != null) {
                String title = isApproved ? "Đơn xin nghỉ phép đã được phê duyệt" : "Đơn xin nghỉ phép đã bị từ chối";
                String content = "Đơn nghỉ phép (" + req.getDaysCount() + " ngày) từ " + req.getStartDate()
                        + " đến " + req.getEndDate() + (isApproved ? " đã được phê duyệt." : " bị từ chối. Lý do: " + (comment != null ? comment : "Không nêu"));
                eventPublisher.publishEvent(SendNotificationEvent.ofSingle(
                        emp.getUserId(),
                        NotificationType.LEAVE,
                        title,
                        content,
                        "/me/leave"
                ));
            }
        } catch (Exception e) {
            log.warn("Không thể gửi thông báo kết quả duyệt đơn {}: {}", req.getId(), e.getMessage());
        }
    }

    private LeaveRequestResponse enrichResponse(LeaveRequest request) {
        LeaveRequestResponse resp = leaveRequestMapper.toResponse(request);
        try {
            EmployeeDetailResponse emp = employeeService.getEmployeeById(request.getEmployeeId());
            if (emp != null) {
                resp.setEmployeeCode(emp.getEmployeeCode());
                resp.setEmployeeFullName(emp.getFullName());
                if (emp.getCurrentAssignment() != null) {
                    resp.setDepartmentName(emp.getCurrentAssignment().getDepartmentName());
                    resp.setJobTitleName(emp.getCurrentAssignment().getJobTitleName());
                }
            }
        } catch (Exception e) {
            log.debug("Không thể lấy thông tin nhân viên {}: {}", request.getEmployeeId(), e.getMessage());
        }
        return resp;
    }

    private LeaveCalendarEventResponse enrichCalendarEvent(LeaveRequest request) {
        LeaveCalendarEventResponse event = leaveRequestMapper.toCalendarEvent(request);
        try {
            EmployeeDetailResponse emp = employeeService.getEmployeeById(request.getEmployeeId());
            if (emp != null) {
                event.setEmployeeCode(emp.getEmployeeCode());
                event.setEmployeeFullName(emp.getFullName());
                if (emp.getCurrentAssignment() != null) {
                    event.setDepartmentName(emp.getCurrentAssignment().getDepartmentName());
                }
            }
        } catch (Exception e) {
            log.debug("Không thể lấy thông tin nhân viên {}: {}", request.getEmployeeId(), e.getMessage());
        }
        return event;
    }

    private Employee resolveTargetEmployee(UUID requestedEmployeeId, UUID currentUserId) {
        if (requestedEmployeeId != null) {
            return employeeService.findEmployeeOrThrow(requestedEmployeeId);
        }
        return employeeService.findByUserId(currentUserId)
                .orElseThrow(() -> AppException.notFound("Không tìm thấy hồ sơ nhân viên của tài khoản đang đăng nhập"));
    }

    private Collection<UUID> resolveAllowedEmployeeIds(DataScope scope, UUID currentUserId, UUID departmentIdFilter) {
        if (scope == DataScope.ALL || scope == DataScope.COMPANY) {
            if (departmentIdFilter == null) {
                return null;
            }
            return employeeService.findAllEntities().stream()
                    .filter(e -> {
                        try {
                            EmployeeDetailResponse d = employeeService.getEmployeeById(e.getId());
                            return d != null && d.getCurrentAssignment() != null
                                    && departmentIdFilter.equals(d.getCurrentAssignment().getDepartmentId());
                        } catch (Exception ex) {
                            return false;
                        }
                    })
                    .map(Employee::getId)
                    .collect(Collectors.toList());
        }

        Optional<Employee> currentEmpOpt = employeeService.findByUserId(currentUserId);
        if (currentEmpOpt.isEmpty()) {
            return Collections.emptyList();
        }

        UUID currentEmpId = currentEmpOpt.get().getId();
        if (scope == DataScope.OWN) {
            return List.of(currentEmpId);
        }

        try {
            EmployeeDetailResponse detail = employeeService.getEmployeeById(currentEmpId);
            if (detail != null && detail.getCurrentAssignment() != null && detail.getCurrentAssignment().getDepartmentId() != null) {
                UUID userDeptId = detail.getCurrentAssignment().getDepartmentId();
                UUID targetDeptId = (departmentIdFilter != null) ? departmentIdFilter : userDeptId;

                return employeeService.findAllEntities().stream()
                        .filter(e -> {
                            try {
                                EmployeeDetailResponse d = employeeService.getEmployeeById(e.getId());
                                return d != null && d.getCurrentAssignment() != null
                                        && targetDeptId.equals(d.getCurrentAssignment().getDepartmentId());
                            } catch (Exception ex) {
                                return false;
                            }
                        })
                        .map(Employee::getId)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.warn("Lỗi khi xác định phạm vi phòng ban: {}", e.getMessage());
        }

        return List.of(currentEmpId);
    }
}
