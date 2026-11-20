package com.cyclosa.workplace.controller;

import com.cyclosa.common.annotation.RequirePermission;
import com.cyclosa.common.response.ApiResponse;
import com.cyclosa.common.response.PageData;
import com.cyclosa.common.util.SecurityUtils;
import com.cyclosa.workplace.dto.request.*;
import com.cyclosa.workplace.dto.response.*;
import com.cyclosa.workplace.entity.WorkplaceSeatRow;
import com.cyclosa.workplace.entity.WorkplaceZone;
import com.cyclosa.workplace.enums.SeatStatus;
import com.cyclosa.workplace.service.WorkplaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workplace")
@RequiredArgsConstructor
@Tag(name = "Workplace", description = "Quản lý cơ sở vật chất, sơ đồ mặt bằng và vị trí làm việc")
public class WorkplaceController {

    private final WorkplaceService workplaceService;

    // =========================================================================
    // 1. Sites & Floors
    // =========================================================================

    @GetMapping("/sites")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách các cơ sở / tòa nhà làm việc")
    public ResponseEntity<ApiResponse<PageData<WorkplaceSiteResponse>>> getSites(
            @RequestParam(required = false) UUID branchId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<WorkplaceSiteResponse> page = workplaceService.getSites(branchId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy danh sách cơ sở tòa nhà thành công"));
    }

    @GetMapping("/sites/{siteId}")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy thông tin chi tiết cơ sở / tòa nhà")
    public ResponseEntity<ApiResponse<WorkplaceSiteResponse>> getSiteById(@PathVariable UUID siteId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getSiteById(siteId), "Lấy thông tin cơ sở thành công"));
    }

    @PostMapping("/sites")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tạo mới cơ sở / tòa nhà làm việc")
    public ResponseEntity<ApiResponse<WorkplaceSiteResponse>> createSite(@Valid @RequestBody CreateSiteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createSite(request), "Tạo cơ sở tòa nhà thành công"));
    }

    @PutMapping("/sites/{siteId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Cập nhật thông tin cơ sở / tòa nhà")
    public ResponseEntity<ApiResponse<WorkplaceSiteResponse>> updateSite(
            @PathVariable UUID siteId,
            @Valid @RequestBody UpdateSiteRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.updateSite(siteId, request), "Cập nhật cơ sở thành công"));
    }

    @DeleteMapping("/sites/{siteId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa cơ sở / tòa nhà làm việc")
    public ResponseEntity<ApiResponse<Void>> deleteSite(@PathVariable UUID siteId) {
        workplaceService.deleteSite(siteId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa cơ sở thành công"));
    }

    @GetMapping("/sites/{siteId}/floors")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách tầng làm việc theo cơ sở")
    public ResponseEntity<ApiResponse<List<WorkplaceFloorResponse>>> getFloorsBySiteId(@PathVariable UUID siteId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getFloorsBySiteId(siteId), "Lấy danh sách tầng làm việc thành công"));
    }

    @PostMapping("/sites/{siteId}/floors")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Thêm mới tầng làm việc cho cơ sở")
    public ResponseEntity<ApiResponse<WorkplaceFloorResponse>> createFloor(
            @PathVariable UUID siteId,
            @Valid @RequestBody CreateFloorRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createFloor(siteId, request), "Thêm tầng làm việc thành công"));
    }

    @PutMapping("/floors/{floorId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Cập nhật thông tin tầng làm việc")
    public ResponseEntity<ApiResponse<WorkplaceFloorResponse>> updateFloor(
            @PathVariable UUID floorId,
            @Valid @RequestBody UpdateFloorRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.updateFloor(floorId, request), "Cập nhật tầng thành công"));
    }

    @DeleteMapping("/floors/{floorId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa tầng làm việc")
    public ResponseEntity<ApiResponse<Void>> deleteFloor(@PathVariable UUID floorId) {
        workplaceService.deleteFloor(floorId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa tầng thành công"));
    }

    // =========================================================================
    // 2. Floor Plans & Canvas Map
    // =========================================================================

    @GetMapping("/floors/{floorId}/plans")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách các phiên bản sơ đồ mặt bằng của tầng")
    public ResponseEntity<ApiResponse<List<WorkplaceFloorPlanResponse>>> getFloorPlans(@PathVariable UUID floorId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getFloorPlans(floorId), "Lấy danh sách bản vẽ thành công"));
    }

    @PostMapping("/floors/{floorId}/plans")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tạo bản vẽ mặt bằng mới cho tầng")
    public ResponseEntity<ApiResponse<WorkplaceFloorPlanResponse>> createFloorPlan(
            @PathVariable UUID floorId,
            @Valid @RequestBody CreateFloorPlanRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createFloorPlan(floorId, request), "Tạo bản vẽ mặt bằng mới thành công"));
    }

    @PostMapping("/floor-plans/{planId}/publish")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xuất bản chính thức bản vẽ mặt bằng")
    public ResponseEntity<ApiResponse<WorkplaceFloorPlanResponse>> publishFloorPlan(@PathVariable UUID planId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.publishFloorPlan(planId), "Phát hành bản vẽ thành công"));
    }

    @PostMapping("/floor-plans/{planId}/archive")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Lưu trữ bản vẽ mặt bằng")
    public ResponseEntity<ApiResponse<WorkplaceFloorPlanResponse>> archiveFloorPlan(@PathVariable UUID planId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.archiveFloorPlan(planId), "Lưu trữ bản vẽ thành công"));
    }

    @GetMapping("/floors/{floorId}/map")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy toàn bộ dữ liệu đối tượng bản đồ mặt bằng tầng (sơ đồ canvas)")
    public ResponseEntity<ApiResponse<FloorMapResponse>> getFloorMap(@PathVariable UUID floorId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getFloorMap(floorId), "Lấy sơ đồ mặt bằng tầng thành công"));
    }

    @PutMapping("/floors/{floorId}/layout")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Lưu và đồng bộ sơ đồ mặt bằng tầng vào database")
    public ResponseEntity<ApiResponse<FloorMapResponse>> saveFloorLayout(
            @PathVariable UUID floorId,
            @Valid @RequestBody SaveFloorLayoutRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.saveFloorLayout(floorId, request), "Lưu sơ đồ mặt bằng vào cơ sở dữ liệu thành công"));
    }

    // =========================================================================
    // 3. Zones & Rows
    // =========================================================================

    @PostMapping("/floors/{floorId}/zones")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tạo mới phân khu chức năng trên tầng")
    public ResponseEntity<ApiResponse<WorkplaceZone>> createZone(
            @PathVariable UUID floorId,
            @Valid @RequestBody CreateZoneRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createZone(floorId, request), "Tạo phân khu thành công"));
    }

    @DeleteMapping("/zones/{zoneId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa phân khu chức năng")
    public ResponseEntity<ApiResponse<Void>> deleteZone(@PathVariable UUID zoneId) {
        workplaceService.deleteZone(zoneId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa phân khu thành công"));
    }

    @PostMapping("/zones/{zoneId}/seat-rows")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tạo cụm / dãy bàn làm việc")
    public ResponseEntity<ApiResponse<WorkplaceSeatRow>> createSeatRow(
            @PathVariable UUID zoneId,
            @Valid @RequestBody CreateSeatRowRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createSeatRow(zoneId, request), "Tạo cụm bàn thành công"));
    }

    @DeleteMapping("/seat-rows/{rowId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa cụm / dãy bàn làm việc")
    public ResponseEntity<ApiResponse<Void>> deleteSeatRow(@PathVariable UUID rowId) {
        workplaceService.deleteSeatRow(rowId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa cụm bàn thành công"));
    }

    @PostMapping("/seat-rows/{rowId}/generate-seats")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tự động sinh các vị trí bàn làm việc cho cụm bàn")
    public ResponseEntity<ApiResponse<List<WorkplaceSeatDetailResponse>>> generateSeatsForRow(@PathVariable UUID rowId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.generateSeatsForRow(rowId), "Sinh bàn làm việc tự động thành công"));
    }

    // =========================================================================
    // 4. Seats & Assignments
    // =========================================================================

    @GetMapping("/seats")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách bàn làm việc theo bộ lọc có phân trang")
    public ResponseEntity<ApiResponse<PageData<WorkplaceSeatDetailResponse>>> getSeats(
            @RequestParam(required = false) UUID floorId,
            @RequestParam(required = false) UUID zoneId,
            @RequestParam(required = false) String seatType,
            @RequestParam(required = false) SeatStatus status,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<WorkplaceSeatDetailResponse> page = workplaceService.getSeats(floorId, zoneId, seatType, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy danh sách bàn làm việc thành công"));
    }

    @GetMapping("/seats/{seatId}")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy thông tin chi tiết bàn làm việc")
    public ResponseEntity<ApiResponse<WorkplaceSeatDetailResponse>> getSeatById(@PathVariable UUID seatId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getSeatById(seatId), "Lấy chi tiết bàn làm việc thành công"));
    }

    @PostMapping("/seats")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Tạo bàn làm việc mới")
    public ResponseEntity<ApiResponse<WorkplaceSeatDetailResponse>> createSeat(@Valid @RequestBody CreateSeatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createSeat(request), "Tạo bàn làm việc thành công"));
    }

    @PatchMapping("/seats/{seatId}/status")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Cập nhật trạng thái sử dụng của bàn làm việc")
    public ResponseEntity<ApiResponse<WorkplaceSeatDetailResponse>> updateSeatStatus(
            @PathVariable UUID seatId,
            @RequestParam SeatStatus status
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.updateSeatStatus(seatId, status), "Cập nhật trạng thái bàn thành công"));
    }

    @DeleteMapping("/seats/{seatId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa bàn làm việc")
    public ResponseEntity<ApiResponse<Void>> deleteSeat(@PathVariable UUID seatId) {
        workplaceService.deleteSeat(seatId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa bàn làm việc thành công"));
    }

    @GetMapping("/amenities")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh mục tiện ích bàn làm việc")
    public ResponseEntity<ApiResponse<List<WorkplaceAmenityResponse>>> getAmenities() {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getAmenities(), "Lấy danh mục tiện ích thành công"));
    }

    @PostMapping("/amenities")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Thêm mới tiện ích bàn làm việc")
    public ResponseEntity<ApiResponse<WorkplaceAmenityResponse>> createAmenity(@Valid @RequestBody CreateWorkplaceAmenityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.createAmenity(request), "Thêm tiện ích thành công"));
    }

    @DeleteMapping("/amenities/{amenityId}")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Xóa tiện ích bàn làm việc")
    public ResponseEntity<ApiResponse<Void>> deleteAmenity(@PathVariable UUID amenityId) {
        workplaceService.deleteAmenity(amenityId);
        return ResponseEntity.ok(ApiResponse.noContent("Xóa tiện ích thành công"));
    }

    @GetMapping("/seat-assignments")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách phân bổ chỗ ngồi cố định có phân trang")
    public ResponseEntity<ApiResponse<PageData<SeatAssignmentResponse>>> getSeatAssignments(
            @RequestParam(required = false) UUID floorId,
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(defaultValue = "false") boolean activeOnly,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<SeatAssignmentResponse> page = workplaceService.getSeatAssignments(floorId, employeeId, activeOnly, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy danh sách phân bổ chỗ ngồi thành công"));
    }

    @GetMapping({"/seat-assignments/my-seat", "/my-seat"})
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Xem thông tin chỗ ngồi làm việc cố định của tài khoản hiện tại")
    public ResponseEntity<ApiResponse<WorkplaceSeatDetailResponse>> getMySeat() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyDedicatedSeat(currentUserId), "Lấy thông tin chỗ ngồi thành công"));
    }

    @PostMapping("/seat-assignments")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Phân bổ chỗ ngồi cố định cho nhân viên")
    public ResponseEntity<ApiResponse<SeatAssignmentResponse>> assignSeat(@Valid @RequestBody AssignSeatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.assignSeat(request), "Phân bổ bàn làm việc cố định thành công"));
    }

    @PostMapping("/seat-assignments/{assignmentId}/release")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Thu hồi chỗ ngồi cố định của nhân viên")
    public ResponseEntity<ApiResponse<Void>> releaseSeat(@PathVariable UUID assignmentId) {
        workplaceService.releaseSeat(assignmentId);
        return ResponseEntity.ok(ApiResponse.noContent("Thu hồi chỗ ngồi thành công"));
    }

    // =========================================================================
    // 5. Desk Bookings (Hot-desking)
    // =========================================================================

    @GetMapping("/desk-bookings/availability")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Kiểm tra danh sách bàn làm việc linh hoạt (hot-desk) còn trống theo ngày")
    public ResponseEntity<ApiResponse<List<WorkplaceSeatDetailResponse>>> getAvailableHotDesks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam UUID floorId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getAvailableHotDesks(date, floorId), "Lấy danh sách bàn linh hoạt khả dụng thành công"));
    }

    @PostMapping("/desk-bookings")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Đặt chỗ ngồi làm việc linh hoạt (hot-desking)")
    public ResponseEntity<ApiResponse<DeskBookingResponse>> bookDesk(@Valid @RequestBody BookDeskRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.bookDesk(currentUserId, request), "Đặt chỗ ngồi linh hoạt thành công"));
    }

    @PostMapping("/desk-bookings/{bookingId}/check-in")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Check-in nhận bàn làm việc linh hoạt bằng mã QR")
    public ResponseEntity<ApiResponse<DeskBookingResponse>> checkInDesk(
            @PathVariable UUID bookingId,
            @RequestParam String qrToken
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.checkInDesk(bookingId, qrToken), "Check-in bàn làm việc thành công"));
    }

    @PostMapping("/desk-bookings/{bookingId}/cancel")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Hủy lượt đặt bàn làm việc linh hoạt")
    public ResponseEntity<ApiResponse<Void>> cancelDeskBooking(@PathVariable UUID bookingId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        workplaceService.cancelDeskBooking(bookingId, currentUserId);
        return ResponseEntity.ok(ApiResponse.noContent("Hủy đặt bàn thành công"));
    }

    @GetMapping("/desk-bookings")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách các lượt đặt bàn làm việc linh hoạt")
    public ResponseEntity<ApiResponse<PageData<DeskBookingResponse>>> getDeskBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) UUID floorId,
            @RequestParam(required = false) UUID employeeId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<DeskBookingResponse> page = workplaceService.getDeskBookings(date, floorId, employeeId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy danh sách đặt bàn thành công"));
    }

    @GetMapping({"/desk-bookings/my-bookings", "/my-desk-bookings"})
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách các lượt đặt bàn làm việc của bản thân")
    public ResponseEntity<ApiResponse<List<DeskBookingResponse>>> getMyDeskBookings() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyDeskBookings(currentUserId), "Lấy danh sách đặt bàn cá nhân thành công"));
    }

    // =========================================================================
    // 6. Meeting Rooms & Bookings
    // =========================================================================

    @GetMapping("/room-bookings")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy lịch đặt phòng họp có phân trang và bộ lọc")
    public ResponseEntity<ApiResponse<PageData<RoomBookingResponse>>> getRoomBookings(
            @RequestParam(required = false) UUID roomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<RoomBookingResponse> page = workplaceService.getRoomBookings(roomId, startTime, endTime, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy lịch đặt phòng họp thành công"));
    }

    @PostMapping("/room-bookings")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Đặt phòng họp")
    public ResponseEntity<ApiResponse<RoomBookingResponse>> bookRoom(@Valid @RequestBody BookRoomRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.bookRoom(currentUserId, request), "Đặt phòng họp thành công"));
    }

    @PostMapping("/room-bookings/{bookingId}/check-in")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Check-in sử dụng phòng họp")
    public ResponseEntity<ApiResponse<RoomBookingResponse>> checkInRoom(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.checkInRoom(bookingId), "Check-in nhận phòng họp thành công"));
    }

    @PostMapping("/room-bookings/{bookingId}/cancel")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Hủy lịch đặt phòng họp")
    public ResponseEntity<ApiResponse<Void>> cancelRoomBooking(@PathVariable UUID bookingId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        workplaceService.cancelRoomBooking(bookingId, currentUserId);
        return ResponseEntity.ok(ApiResponse.noContent("Hủy đặt phòng họp thành công"));
    }

    @GetMapping({"/meeting-rooms", "/floors/{floorId}/meeting-rooms"})
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách phòng họp theo tầng")
    public ResponseEntity<ApiResponse<List<FloorMapResponse.FloorObjectDto>>> getMeetingRooms(
            @PathVariable(required = false) UUID floorId,
            @RequestParam(required = false) UUID floorIdParam
    ) {
        UUID fId = floorId != null ? floorId : floorIdParam;
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMeetingRooms(fId), "Lấy danh sách phòng họp thành công"));
    }

    @GetMapping({"/room-bookings/my-bookings", "/my-room-bookings"})
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách lịch đặt phòng họp của bản thân")
    public ResponseEntity<ApiResponse<List<RoomBookingResponse>>> getMyRoomBookings() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyRoomBookings(currentUserId), "Lấy danh sách đặt phòng họp cá nhân thành công"));
    }

    // =========================================================================
    // 7. Workplace Issues
    // =========================================================================

    @PostMapping("/issues")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Báo cáo sự cố cơ sở vật chất / chỗ ngồi")
    public ResponseEntity<ApiResponse<WorkplaceIssueResponse>> reportIssue(@Valid @RequestBody CreateWorkplaceIssueRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(workplaceService.reportIssue(currentUserId, request), "Gửi báo cáo sự cố thành công"));
    }

    @GetMapping("/issues")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Lấy danh sách sự cố cơ sở vật chất")
    public ResponseEntity<ApiResponse<PageData<WorkplaceIssueResponse>>> getIssues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) UUID floorId,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<WorkplaceIssueResponse> page = workplaceService.getIssues(status, severity, floorId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageData.from(page), "Lấy danh sách sự cố thành công"));
    }

    @GetMapping("/issues/{issueId}")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Xem chi tiết sự cố cơ sở vật chất")
    public ResponseEntity<ApiResponse<WorkplaceIssueResponse>> getIssueById(@PathVariable UUID issueId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getIssueById(issueId), "Lấy thông tin sự cố thành công"));
    }

    @PutMapping("/issues/{issueId}/assign")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Phân công kỹ thuật viên / nhân sự xử lý sự cố")
    public ResponseEntity<ApiResponse<WorkplaceIssueResponse>> assignIssue(
            @PathVariable UUID issueId,
            @RequestParam UUID assignedEmployeeId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.assignIssue(issueId, assignedEmployeeId), "Phân công xử lý thành công"));
    }

    @PostMapping("/issues/{issueId}/start")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Bắt đầu tiến trình xử lý sự cố")
    public ResponseEntity<ApiResponse<WorkplaceIssueResponse>> startIssue(@PathVariable UUID issueId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.startIssue(issueId), "Bắt đầu xử lý sự cố thành công"));
    }

    @PostMapping("/issues/{issueId}/resolve")
    @PreAuthorize("@perm.has('workplace.manage') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'ADMIN')")
    @RequirePermission("workplace.manage")
    @Operation(summary = "Nghiệm thu và đóng sự cố cơ sở vật chất")
    public ResponseEntity<ApiResponse<WorkplaceIssueResponse>> resolveIssue(
            @PathVariable UUID issueId,
            @RequestParam(required = false) String resolutionNote
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.resolveIssue(issueId, resolutionNote), "Nghiệm thu sự cố thành công"));
    }

    @GetMapping({"/issues/my-issues", "/my-issues"})
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Xem danh sách các sự cố do bản thân gửi báo cáo")
    public ResponseEntity<ApiResponse<List<WorkplaceIssueResponse>>> getMyIssues() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getMyIssues(currentUserId), "Lấy danh sách sự cố cá nhân thành công"));
    }

    // =========================================================================
    // 8. Navigation, Reports & QR
    // =========================================================================

    @GetMapping("/employees/{employeeId}/location")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Tra cứu vị trí bàn làm việc của nhân viên trên sơ đồ")
    public ResponseEntity<ApiResponse<EmployeeLocationResponse>> getEmployeeLocation(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.getEmployeeLocation(employeeId), "Tra cứu vị trí nhân viên thành công"));
    }

    @GetMapping("/navigation/route")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Tìm đường đi ngắn nhất giữa hai điểm trên sơ đồ mặt bằng")
    public ResponseEntity<ApiResponse<NavigationRouteResponse>> calculateRoute(
            @RequestParam UUID floorId,
            @RequestParam BigDecimal startX,
            @RequestParam BigDecimal startY,
            @RequestParam BigDecimal endX,
            @RequestParam BigDecimal endY
    ) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.calculateRoute(floorId, startX, startY, endX, endY), "Tìm lộ trình di chuyển thành công"));
    }

    @GetMapping("/qr/resolve")
    @PreAuthorize("@perm.has('workplace.view') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'MANAGER', 'EMPLOYEE', 'ADMIN')")
    @RequirePermission("workplace.view")
    @Operation(summary = "Giải mã token mã QR vị trí bàn hoặc phòng họp")
    public ResponseEntity<ApiResponse<QrResolutionResponse>> resolveQr(@RequestParam String token) {
        return ResponseEntity.ok(ApiResponse.ok(workplaceService.resolveQr(token), "Giải mã token QR thành công"));
    }

    // Tạm thời vô hiệu hóa API Báo cáo & Tối ưu không gian
    // @GetMapping("/reports/utilization")
    // @PreAuthorize("@perm.has('workplace.report') or hasAnyRole('SUPER_ADMIN', 'HR_ADMIN', 'OFFICE_ADMIN', 'EXECUTIVE', 'ADMIN')")
    // @RequirePermission("workplace.report")
    // @Operation(summary = "Xem báo cáo thống kê tỷ lệ lấp đầy và sử dụng không gian làm việc")
    // public ResponseEntity<ApiResponse<WorkplaceReportResponse>> getUtilizationReport(@RequestParam(required = false) UUID floorId) {
    //     return ResponseEntity.ok(ApiResponse.ok(workplaceService.getUtilizationReport(floorId), "Lấy báo cáo tỷ lệ lấp đầy thành công"));
    // }
}
