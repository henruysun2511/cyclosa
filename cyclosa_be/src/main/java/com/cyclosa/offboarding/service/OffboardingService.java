package com.cyclosa.offboarding.service;

import com.cyclosa.auth.entity.User;
import com.cyclosa.auth.enums.UserStatus;
import com.cyclosa.auth.repository.UserRepository;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.exception.AppException;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.entity.EmployeeStatusHistory;
import com.cyclosa.employee.entity.enums.EmployeeStatus;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.employee.repository.EmployeeStatusHistoryRepository;
import com.cyclosa.offboarding.dto.request.*;
import com.cyclosa.offboarding.dto.response.*;
import com.cyclosa.offboarding.entity.ExitInterview;
import com.cyclosa.offboarding.entity.OffboardingClearanceItem;
import com.cyclosa.offboarding.entity.OffboardingRequest;
import com.cyclosa.offboarding.enums.ClearanceStatus;
import com.cyclosa.offboarding.enums.ClearanceType;
import com.cyclosa.offboarding.enums.OffboardingStatus;
import com.cyclosa.offboarding.enums.OffboardingType;
import com.cyclosa.offboarding.exception.OffboardingErrorCode;
import com.cyclosa.offboarding.mapper.OffboardingMapper;
import com.cyclosa.offboarding.repository.ExitInterviewRepository;
import com.cyclosa.offboarding.repository.OffboardingClearanceItemRepository;
import com.cyclosa.offboarding.repository.OffboardingRequestRepository;
import com.cyclosa.workplace.repository.WorkplaceSeatAssignmentRepository;
import com.cyclosa.workplace.repository.WorkplaceDeskBookingRepository;
import com.cyclosa.workplace.entity.WorkplaceSeatAssignment;
import com.cyclosa.workplace.entity.WorkplaceDeskBooking;
import com.cyclosa.workplace.enums.BookingStatus;
import com.cyclosa.asset.repository.AssetAssignmentRepository;
import com.cyclosa.asset.repository.AssetRepository;
import com.cyclosa.asset.entity.AssetAssignment;
import com.cyclosa.asset.entity.Asset;
import com.cyclosa.asset.enums.AssetStatus;
import com.cyclosa.asset.enums.AssetCondition;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OffboardingService {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "createdAt", "actualLastWorkingDate", "status", "type", "updatedAt"
    );

    private final OffboardingRequestRepository requestRepository;
    private final OffboardingClearanceItemRepository clearanceItemRepository;
    private final ExitInterviewRepository exitInterviewRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final OffboardingMapper mapper;
    private final WorkplaceSeatAssignmentRepository seatAssignmentRepository;
    private final WorkplaceDeskBookingRepository deskBookingRepository;
    private final AssetAssignmentRepository assetAssignmentRepository;
    private final AssetRepository assetRepository;

    public PageData<OffboardingRequestResponse> getRequests(OffboardingFilter filter) {
        Pageable pageable = filter.toPageable("createdAt", ALLOWED_SORT_FIELDS);

        Specification<OffboardingRequest> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(filter.getSearch())) {
                String searchLike = "%" + filter.getSearch().trim().toLowerCase() + "%";
                Predicate employeeName = cb.like(cb.lower(cb.concat(cb.concat(root.get("employee").get("lastName"), " "), root.get("employee").get("firstName"))), searchLike);
                Predicate employeeCode = cb.like(cb.lower(root.get("employee").get("employeeCode")), searchLike);
                Predicate decisionNumber = cb.like(cb.lower(root.get("decisionNumber")), searchLike);
                predicates.add(cb.or(employeeName, employeeCode, decisionNumber));
            }

            if (filter.getType() != null) {
                predicates.add(cb.equal(root.get("type"), filter.getType()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (filter.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("actualLastWorkingDate"), filter.getFromDate()));
            }

            if (filter.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("actualLastWorkingDate"), filter.getToDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<OffboardingRequest> page = requestRepository.findAll(spec, pageable);
        List<OffboardingRequestResponse> content = mapper.toResponseList(page.getContent());

        return PageData.of(page, content);
    }

    public OffboardingStatisticsResponse getStatistics() {
        long total = requestRepository.count();
        long pending = requestRepository.countByStatus(OffboardingStatus.PENDING);
        long processing = requestRepository.countByStatus(OffboardingStatus.PROCESSING)
                + requestRepository.countByStatus(OffboardingStatus.APPROVED);
        long completed = requestRepository.countByStatus(OffboardingStatus.COMPLETED);
        long resignations = requestRepository.countByType(OffboardingType.RESIGNATION);
        long terminations = requestRepository.countByType(OffboardingType.TERMINATION);

        return OffboardingStatisticsResponse.builder()
                .totalRequests(total)
                .pendingApproval(pending)
                .processingClearance(processing)
                .completed(completed)
                .resignations(resignations)
                .terminations(terminations)
                .build();
    }

    public OffboardingRequestResponse getRequestById(UUID id) {
        OffboardingRequest request = requestRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));
        return mapper.toResponse(request);
    }

    @Transactional
    public OffboardingRequestResponse createResignation(CreateResignationRequest requestDto) {
        log.info("HR/Admin tiếp nhận đơn xin thôi việc cho nhân viên ID: {}", requestDto.getEmployeeId());

        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(() -> new AppException(OffboardingErrorCode.EMPLOYEE_NOT_FOUND));

        // Kiểm tra xem đã có hồ sơ đang xử lý chưa
        boolean hasActiveRequest = requestRepository.existsByEmployeeIdAndStatusIn(
                employee.getId(),
                List.of(OffboardingStatus.PENDING, OffboardingStatus.APPROVED, OffboardingStatus.PROCESSING)
        );
        if (hasActiveRequest) {
            throw new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_ALREADY_EXISTS);
        }

        Employee successor = null;
        if (requestDto.getSuccessorId() != null) {
            successor = employeeRepository.findById(requestDto.getSuccessorId()).orElse(null);
        }

        OffboardingRequest request = OffboardingRequest.builder()
                .employee(employee)
                .type(OffboardingType.RESIGNATION)
                .status(OffboardingStatus.PENDING)
                .resignationReason(requestDto.getResignationReason())
                .noticeDate(requestDto.getNoticeDate())
                .desiredLastWorkingDate(requestDto.getDesiredLastWorkingDate())
                .actualLastWorkingDate(requestDto.getActualLastWorkingDate())
                .successor(successor)
                .reasonDetail(requestDto.getReasonDetail())
                .notes(requestDto.getNotes())
                .build();

        OffboardingRequest saved = requestRepository.save(request);

        // Tự động giải phóng chỗ ngồi trên sơ đồ tầng & liên kết danh mục tài sản bàn giao
        autoReleaseWorkplaceAndLinkAssets(saved);

        return mapper.toResponse(saved);
    }

    @Transactional
    public OffboardingRequestResponse createTermination(CreateTerminationRequest requestDto) {
        log.info("Ban hành quyết định chấm dứt HĐLĐ cho nhân viên ID: {}", requestDto.getEmployeeId());

        Employee employee = employeeRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(() -> new AppException(OffboardingErrorCode.EMPLOYEE_NOT_FOUND));

        boolean hasActiveRequest = requestRepository.existsByEmployeeIdAndStatusIn(
                employee.getId(),
                List.of(OffboardingStatus.PENDING, OffboardingStatus.APPROVED, OffboardingStatus.PROCESSING)
        );
        if (hasActiveRequest) {
            throw new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_ALREADY_EXISTS);
        }

        Employee successor = null;
        if (requestDto.getSuccessorId() != null) {
            successor = employeeRepository.findById(requestDto.getSuccessorId()).orElse(null);
        }

        Employee currentEmployee = getCurrentEmployee();

        OffboardingRequest request = OffboardingRequest.builder()
                .employee(employee)
                .type(OffboardingType.TERMINATION)
                .status(OffboardingStatus.PROCESSING)
                .terminationReason(requestDto.getTerminationReason())
                .disciplineId(requestDto.getDisciplineId())
                .decisionNumber(requestDto.getDecisionNumber())
                .decisionDate(requestDto.getDecisionDate())
                .actualLastWorkingDate(requestDto.getActualLastWorkingDate())
                .successor(successor)
                .reasonDetail(requestDto.getReasonDetail())
                .notes(requestDto.getNotes())
                .approver(currentEmployee)
                .approvedAt(LocalDateTime.now())
                .build();

        OffboardingRequest saved = requestRepository.save(request);

        // Tự động khởi tạo 5 hạng mục bàn giao
        initClearanceItems(saved);

        // Tự động giải phóng chỗ ngồi trên sơ đồ tầng & liên kết danh mục tài sản bàn giao
        autoReleaseWorkplaceAndLinkAssets(saved);

        return mapper.toResponse(saved);
    }

    @Transactional
    public OffboardingRequestResponse approveResignation(UUID id, ApproveResignationRequest requestDto) {
        log.info("Phê duyệt đơn xin thôi việc ID: {}", id);

        OffboardingRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        if (request.getStatus() != OffboardingStatus.PENDING) {
            throw new AppException(OffboardingErrorCode.INVALID_OFFBOARDING_STATUS);
        }

        Employee currentEmployee = getCurrentEmployee();

        request.setStatus(OffboardingStatus.PROCESSING);
        request.setApprover(currentEmployee);
        request.setApprovedAt(LocalDateTime.now());

        if (requestDto.getActualLastWorkingDate() != null) {
            request.setActualLastWorkingDate(requestDto.getActualLastWorkingDate());
        }
        if (StringUtils.hasText(requestDto.getNotes())) {
            request.setNotes(requestDto.getNotes());
        }

        // Tự động khởi tạo 5 hạng mục bàn giao nếu chưa có
        if (request.getClearanceItems().isEmpty()) {
            initClearanceItems(request);
        }

        OffboardingRequest saved = requestRepository.save(request);

        // Tự động giải phóng chỗ ngồi trên sơ đồ tầng & liên kết danh mục tài sản bàn giao
        autoReleaseWorkplaceAndLinkAssets(saved);

        return mapper.toResponse(saved);
    }

    @Transactional
    public OffboardingRequestResponse rejectResignation(UUID id, RejectResignationRequest requestDto) {
        log.info("Từ chối đơn xin thôi việc ID: {}", id);

        OffboardingRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        if (request.getStatus() != OffboardingStatus.PENDING) {
            throw new AppException(OffboardingErrorCode.INVALID_OFFBOARDING_STATUS);
        }

        Employee currentEmployee = getCurrentEmployee();

        request.setStatus(OffboardingStatus.REJECTED);
        request.setApprover(currentEmployee);
        request.setApprovedAt(LocalDateTime.now());
        request.setRejectionReason(requestDto.getRejectionReason());

        OffboardingRequest saved = requestRepository.save(request);

        // Tự động giải phóng chỗ ngồi trên sơ đồ tầng & liên kết danh mục tài sản bàn giao
        autoReleaseWorkplaceAndLinkAssets(saved);

        return mapper.toResponse(saved);
    }

    public List<OffboardingClearanceItemResponse> getClearanceItems(UUID requestId) {
        if (!requestRepository.existsById(requestId)) {
            throw new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND);
        }
        List<OffboardingClearanceItem> items = clearanceItemRepository.findByOffboardingRequestIdWithClearedBy(requestId);
        return mapper.toClearanceItemResponseList(items);
    }

    @Transactional
    public OffboardingClearanceItemResponse updateClearanceItem(UUID requestId, UUID itemId, UpdateClearanceItemRequest requestDto) {
        log.info("Cập nhật trạng thái hạng mục bàn giao ID: {} cho hồ sơ: {}", itemId, requestId);

        OffboardingClearanceItem item = clearanceItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.CLEARANCE_ITEM_NOT_FOUND));

        if (!item.getOffboardingRequest().getId().equals(requestId)) {
            throw new AppException(OffboardingErrorCode.CLEARANCE_ITEM_NOT_FOUND);
        }

        Employee currentEmployee = getCurrentEmployee();

        item.setStatus(requestDto.getStatus());
        item.setClearedBy(currentEmployee);
        item.setClearedAt(LocalDateTime.now());
        if (requestDto.getNotes() != null) {
            item.setNotes(requestDto.getNotes());
        }

        OffboardingClearanceItem saved = clearanceItemRepository.save(item);
        return mapper.toClearanceItemResponse(saved);
    }

    public ExitInterviewResponse getExitInterview(UUID requestId) {
        ExitInterview interview = exitInterviewRepository.findByOffboardingRequestIdWithInterviewer(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.EXIT_INTERVIEW_NOT_FOUND));
        return mapper.toExitInterviewResponse(interview);
    }

    @Transactional
    public ExitInterviewResponse saveExitInterview(UUID requestId, SaveExitInterviewRequest requestDto) {
        log.info("Ghi nhận khảo sát phỏng vấn thôi việc cho hồ sơ: {}", requestId);

        OffboardingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        Employee interviewer = employeeRepository.findById(requestDto.getInterviewerId())
                .orElseThrow(() -> new AppException(OffboardingErrorCode.EMPLOYEE_NOT_FOUND));

        ExitInterview interview = exitInterviewRepository.findByOffboardingRequestId(requestId)
                .orElse(ExitInterview.builder().offboardingRequest(request).build());

        interview.setInterviewer(interviewer);
        interview.setInterviewDate(requestDto.getInterviewDate());
        interview.setPrimaryReason(requestDto.getPrimaryReason());
        interview.setWorkingEnvironmentFeedback(requestDto.getWorkingEnvironmentFeedback());
        interview.setManagementFeedback(requestDto.getManagementFeedback());
        interview.setCompensationFeedback(requestDto.getCompensationFeedback());
        interview.setImprovementSuggestions(requestDto.getImprovementSuggestions());
        interview.setWillingToRecommend(Boolean.TRUE.equals(requestDto.getWillingToRecommend()));
        interview.setNotes(requestDto.getNotes());

        ExitInterview saved = exitInterviewRepository.save(interview);
        return mapper.toExitInterviewResponse(saved);
    }

    public OffboardingSummaryResponse getSummary(UUID requestId) {
        OffboardingRequest request = requestRepository.findByIdWithDetails(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        List<OffboardingClearanceItem> items = clearanceItemRepository.findByOffboardingRequestIdWithClearedBy(requestId);
        Optional<ExitInterview> interviewOpt = exitInterviewRepository.findByOffboardingRequestIdWithInterviewer(requestId);

        List<String> missingPrerequisites = new ArrayList<>();

        // Điều kiện 1: Trạng thái hồ sơ
        if (request.getStatus() != OffboardingStatus.APPROVED && request.getStatus() != OffboardingStatus.PROCESSING) {
            missingPrerequisites.add("Hồ sơ thôi việc phải ở trạng thái Đã phê duyệt hoặc Đang bàn giao");
        }

        // Điều kiện 2: 5 hạng mục bàn giao
        long clearedCount = items.stream().filter(i -> i.getStatus() == ClearanceStatus.CLEARED).count();
        if (items.isEmpty() || clearedCount < 5) {
            missingPrerequisites.add("Tất cả 5 hạng mục bàn giao (Công việc, Tài sản, Hệ thống IT, Tài chính, Giấy tờ) phải được xác nhận hoàn tất");
        }

        // Điều kiện 3: Thu hồi tài sản
        boolean assetCleared = items.stream()
                .anyMatch(i -> i.getClearanceType() == ClearanceType.ASSET && i.getStatus() == ClearanceStatus.CLEARED);
        int unreturnedAssets = assetCleared ? 0 : 1;
        if (!assetCleared) {
            missingPrerequisites.add("Chưa hoàn tất thu hồi trang thiết bị và tài sản công ty");
        }

        boolean canComplete = missingPrerequisites.isEmpty() && request.getStatus() != OffboardingStatus.COMPLETED;

        return OffboardingSummaryResponse.builder()
                .request(mapper.toResponse(request))
                .clearanceItems(mapper.toClearanceItemResponseList(items))
                .exitInterview(interviewOpt.map(mapper::toExitInterviewResponse).orElse(null))
                .unreturnedAssetsCount(unreturnedAssets)
                .canComplete(canComplete)
                .missingPrerequisites(missingPrerequisites)
                .build();
    }

    @Transactional
    public OffboardingRequestResponse completeOffboarding(UUID requestId) {
        log.info("Thực thi hoàn tất thủ tục thôi việc cho hồ sơ: {}", requestId);

        OffboardingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        if (request.getStatus() == OffboardingStatus.COMPLETED) {
            return mapper.toResponse(request);
        }

        OffboardingSummaryResponse summary = getSummary(requestId);
        if (!summary.isCanComplete()) {
            throw new AppException(OffboardingErrorCode.CANNOT_COMPLETE_OFFBOARDING);
        }

        // Cập nhật trạng thái hồ sơ sang COMPLETED
        request.setStatus(OffboardingStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());
        OffboardingRequest saved = requestRepository.save(request);

        // Cập nhật lịch sử trạng thái Nhân viên (EmployeeStatusHistory)
        Employee employee = request.getEmployee();
        EmployeeStatus newStatus = request.getType() == OffboardingType.RESIGNATION
                ? EmployeeStatus.RESIGNED
                : EmployeeStatus.TERMINATED;

        EmployeeStatusHistory history = EmployeeStatusHistory.builder()
                .employee(employee)
                .status(newStatus)
                .effectiveFrom(request.getActualLastWorkingDate() != null ? request.getActualLastWorkingDate() : java.time.LocalDate.now())
                .note("Hoàn tất thủ tục " + (request.getType() == OffboardingType.RESIGNATION ? "thôi việc tự nguyện" : "chấm dứt HĐLĐ"))
                .build();
        statusHistoryRepository.save(history);

        // Khóa tài khoản User liên kết nếu có
        if (employee.getUserId() != null) {
            userRepository.findById(employee.getUserId()).ifPresent(user -> {
                log.info("Khóa tài khoản User ID: {} cho nhân sự thôi việc: {}", user.getId(), employee.getEmployeeCode());
                user.setStatus(UserStatus.LOCKED);
                userRepository.save(user);
            });
        }

        return mapper.toResponse(saved);
    }

    @Transactional
    public void deleteRequest(UUID id) {
        OffboardingRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        if (request.getStatus() != OffboardingStatus.PENDING && request.getStatus() != OffboardingStatus.REJECTED) {
            throw new AppException(OffboardingErrorCode.CANNOT_DELETE_ACTIVE_REQUEST);
        }

        requestRepository.delete(request);
    }

    private void initClearanceItems(OffboardingRequest request) {
        for (ClearanceType type : ClearanceType.values()) {
            OffboardingClearanceItem item = OffboardingClearanceItem.builder()
                    .offboardingRequest(request)
                    .clearanceType(type)
                    .status(ClearanceStatus.PENDING)
                    .build();
            request.getClearanceItems().add(item);
        }
    }

    private Employee getCurrentEmployee() {
        return SecurityUtils.getCurrentUserIdOptional()
                .flatMap(employeeRepository::findByUserId)
                .orElse(null);
    }

    private void autoReleaseWorkplaceAndLinkAssets(OffboardingRequest request) {
        Employee employee = request.getEmployee();
        if (employee == null) return;

        // 1. Tự động giải phóng chỗ ngồi cố định trên sơ đồ tầng nếu nhân viên đang có chỗ ngồi
        seatAssignmentRepository.findByEmployeeIdAndReleasedAtIsNull(employee.getId())
                .ifPresent(seatAssign -> {
                    seatAssign.setReleasedAt(LocalDateTime.now());
                    String existingNote = StringUtils.hasText(seatAssign.getNote()) ? seatAssign.getNote() + " | " : "";
                    seatAssign.setNote(existingNote + "Tự động giải phóng chỗ ngồi do duyệt thôi việc (Hồ sơ #" + request.getId() + ")");
                    seatAssignmentRepository.save(seatAssign);
                    log.info("Offboarding [{}]: Đã tự động giải phóng chỗ ngồi bàn {} cho nhân sự {}",
                            request.getId(), seatAssign.getSeat().getSeatCode(), employee.getEmployeeCode());
                });

        // 2. Hủy các lượt đặt bàn làm việc Hot-desk trong tương lai
        try {
            List<WorkplaceDeskBooking> bookings = deskBookingRepository.findByEmployeeIdOrderByBookingDateDesc(employee.getId());
            for (WorkplaceDeskBooking b : bookings) {
                if (b.getBookingDate().isAfter(java.time.LocalDate.now().minusDays(1)) && b.getStatus() == BookingStatus.CONFIRMED) {
                    b.setStatus(BookingStatus.CANCELLED);
                    deskBookingRepository.save(b);
                    log.info("Offboarding [{}]: Đã tự động hủy lượt đặt bàn ngày {} cho nhân sự thôi việc {}",
                            request.getId(), b.getBookingDate(), employee.getEmployeeCode());
                }
            }
        } catch (Exception e) {
            log.warn("Lỗi khi hủy lịch đặt bàn Hot-desk tương lai: {}", e.getMessage());
        }

        // 3. Tự động liên kết danh sách tài sản đang bàn giao vào hạng mục ASSET
        List<AssetAssignment> activeAssets = assetAssignmentRepository.findAllByEmployeeIdAndReturnedAtIsNullOrderByAssignedAtDesc(employee.getId());
        if (!activeAssets.isEmpty()) {
            for (OffboardingClearanceItem item : request.getClearanceItems()) {
                if (item.getClearanceType() == ClearanceType.ASSET && !StringUtils.hasText(item.getNotes())) {
                    StringBuilder sb = new StringBuilder();
                    sb.append("Cần thu hồi ").append(activeAssets.size()).append(" tài sản đang cấp phát: ");
                    for (int i = 0; i < activeAssets.size(); i++) {
                        Asset a = activeAssets.get(i).getAsset();
                        sb.append(a.getName()).append(" [").append(a.getAssetCode()).append("]");
                        if (i < activeAssets.size() - 1) sb.append(", ");
                    }
                    item.setNotes(sb.toString());
                    clearanceItemRepository.save(item);
                    break;
                }
            }
        }
    }

    @Transactional
    public OffboardingHandoverProtocolResponse returnOffboardingAssets(UUID requestId, ReturnOffboardingAssetsRequest requestDto) {
        log.info("Thực hiện thu hồi tài sản bàn giao cho hồ sơ thôi việc: {}", requestId);

        OffboardingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        Employee employee = request.getEmployee();
        List<AssetAssignment> activeAssets = assetAssignmentRepository.findAllByEmployeeIdAndReturnedAtIsNullOrderByAssignedAtDesc(employee.getId());

        Set<UUID> targetAssignmentIds = (requestDto != null && requestDto.getSpecificAssignmentIds() != null && !requestDto.getSpecificAssignmentIds().isEmpty())
                ? new HashSet<>(requestDto.getSpecificAssignmentIds())
                : null;

        int returnedCount = 0;
        AssetCondition condition = (requestDto != null && requestDto.getConditionOnReturn() != null)
                ? requestDto.getConditionOnReturn()
                : AssetCondition.GOOD;
        LocalDateTime now = LocalDateTime.now();

        for (AssetAssignment assignment : activeAssets) {
            if (targetAssignmentIds == null || targetAssignmentIds.contains(assignment.getId())) {
                assignment.setReturnedAt(now);
                assignment.setConditionOnReturn(condition);
                String note = (requestDto != null && StringUtils.hasText(requestDto.getNotes()))
                        ? requestDto.getNotes()
                        : "Thu hồi tài sản theo thủ tục thôi việc #" + requestId;
                assignment.setNotes(note);
                assetAssignmentRepository.save(assignment);

                Asset asset = assignment.getAsset();
                asset.setStatus(AssetStatus.AVAILABLE);
                assetRepository.save(asset);
                returnedCount++;
            }
        }

        // Tự động cập nhật hạng mục bàn giao ASSET
        long remaining = assetAssignmentRepository.countByEmployeeIdAndReturnedAtIsNull(employee.getId());
        if (remaining == 0) {
            for (OffboardingClearanceItem item : request.getClearanceItems()) {
                if (item.getClearanceType() == ClearanceType.ASSET) {
                    item.setStatus(ClearanceStatus.CLEARED);
                    item.setClearedAt(now);
                    item.setClearedBy(getCurrentEmployee());
                    item.setNotes("Đã hoàn tất thu hồi toàn bộ tài sản về kho (" + returnedCount + " thiết bị).");
                    clearanceItemRepository.save(item);
                    break;
                }
            }
        }

        return getHandoverProtocol(requestId);
    }

    @Transactional(readOnly = true)
    public OffboardingHandoverProtocolResponse getHandoverProtocol(UUID requestId) {
        OffboardingRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(OffboardingErrorCode.OFFBOARDING_REQUEST_NOT_FOUND));

        Employee employee = request.getEmployee();

        // 1. Chỗ ngồi làm việc
        Optional<WorkplaceSeatAssignment> seatAssignOpt = seatAssignmentRepository.findTopByEmployeeIdOrderByAssignedAtDesc(employee.getId());
        OffboardingHandoverProtocolResponse.ReleasedSeatDto seatDto = null;
        if (seatAssignOpt.isPresent()) {
            WorkplaceSeatAssignment sa = seatAssignOpt.get();
            var seat = sa.getSeat();
            String floorName = (seat.getSeatRow() != null && seat.getSeatRow().getZone() != null && seat.getSeatRow().getZone().getFloor() != null)
                    ? seat.getSeatRow().getZone().getFloor().getName() : "Mặt bằng";
            String siteName = (seat.getSeatRow() != null && seat.getSeatRow().getZone() != null && seat.getSeatRow().getZone().getFloor() != null && seat.getSeatRow().getZone().getFloor().getSite() != null)
                    ? seat.getSeatRow().getZone().getFloor().getSite().getName() : "Cơ sở";
            String zoneName = (seat.getSeatRow() != null && seat.getSeatRow().getZone() != null)
                    ? seat.getSeatRow().getZone().getName() : "Phân khu";

            seatDto = OffboardingHandoverProtocolResponse.ReleasedSeatDto.builder()
                    .seatId(seat.getId())
                    .seatCode(seat.getSeatCode())
                    .floorName(floorName)
                    .siteName(siteName)
                    .zoneName(zoneName)
                    .assignedAt(sa.getAssignedAt())
                    .releasedAt(sa.getReleasedAt())
                    .isReleased(sa.getReleasedAt() != null)
                    .note(sa.getNote())
                    .build();
        }

        // 2. Tài sản bàn giao
        List<AssetAssignment> allAssignments = assetAssignmentRepository.findAllByEmployeeIdOrderByAssignedAtDesc(employee.getId());
        List<OffboardingHandoverProtocolResponse.HandoverAssetDto> assetDtos = allAssignments.stream().map(aa -> {
            Asset a = aa.getAsset();
            return OffboardingHandoverProtocolResponse.HandoverAssetDto.builder()
                    .assignmentId(aa.getId())
                    .assetId(a.getId())
                    .assetCode(a.getAssetCode())
                    .assetName(a.getName())
                    .categoryName(a.getCategory() != null ? a.getCategory().getName() : "Thiết bị")
                    .serialNumber(a.getSerialNumber())
                    .assignedAt(aa.getAssignedAt())
                    .returnedAt(aa.getReturnedAt())
                    .conditionOnAssign(aa.getConditionOnAssign() != null ? aa.getConditionOnAssign().name() : null)
                    .conditionOnReturn(aa.getConditionOnReturn() != null ? aa.getConditionOnReturn().name() : null)
                    .isReturned(aa.getReturnedAt() != null)
                    .build();
        }).collect(Collectors.toList());

        int total = assetDtos.size();
        int returned = (int) assetDtos.stream().filter(OffboardingHandoverProtocolResponse.HandoverAssetDto::isReturned).count();

        return OffboardingHandoverProtocolResponse.builder()
                .requestId(request.getId())
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(employee.getFullName())
                .departmentName(employee.getCurrentDepartment() != null ? employee.getCurrentDepartment().getName() : null)
                .actualLastWorkingDate(request.getActualLastWorkingDate())
                .offboardingType(request.getType() != null ? request.getType().name() : null)
                .status(request.getStatus() != null ? request.getStatus().name() : null)
                .releasedSeat(seatDto)
                .assets(assetDtos)
                .totalAssets(total)
                .returnedAssets(returned)
                .allAssetsReturned(total == returned)
                .approverName(request.getApprover() != null ? request.getApprover().getFullName() : null)
                .approvedAt(request.getApprovedAt())
                .successorName(request.getSuccessor() != null ? request.getSuccessor().getFullName() : null)
                .build();
    }
}
