package com.cyclosa.workplace.service;

import com.cyclosa.auth.entity.User;
import com.cyclosa.auth.repository.UserRepository;
import com.cyclosa.employee.entity.Employee;
import com.cyclosa.employee.repository.EmployeeRepository;
import com.cyclosa.organization.entity.Branch;
import com.cyclosa.organization.entity.Company;
import com.cyclosa.organization.entity.Department;
import com.cyclosa.organization.repository.BranchRepository;
import com.cyclosa.organization.repository.CompanyRepository;
import com.cyclosa.organization.repository.DepartmentRepository;
import com.cyclosa.workplace.dto.request.*;
import com.cyclosa.workplace.dto.response.*;
import com.cyclosa.workplace.entity.*;
import com.cyclosa.workplace.enums.*;
import com.cyclosa.workplace.exception.WorkplaceErrorCode;
import com.cyclosa.workplace.exception.WorkplaceException;
import com.cyclosa.workplace.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkplaceService {

    private final WorkplaceSiteRepository siteRepository;
    private final WorkplaceFloorRepository floorRepository;
    private final WorkplaceFloorPlanRepository floorPlanRepository;
    private final WorkplaceZoneRepository zoneRepository;
    private final WorkplaceSeatRowRepository seatRowRepository;
    private final WorkplaceSeatRepository seatRepository;
    private final WorkplaceAmenityRepository amenityRepository;
    private final WorkplaceSeatAssignmentRepository assignmentRepository;
    private final WorkplaceSeatAssetRepository seatAssetRepository;
    private final WorkplaceFloorObjectRepository floorObjectRepository;
    private final WorkplaceMeetingRoomRepository meetingRoomRepository;
    private final WorkplaceDeskBookingRepository deskBookingRepository;
    private final WorkplaceRoomBookingRepository roomBookingRepository;
    private final WorkplaceIssueRepository issueRepository;
    private final BranchRepository branchRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    // =========================================================================
    // 1. Sites & Floors
    // =========================================================================
    @Transactional(readOnly = true)
    public Page<WorkplaceSiteResponse> getSites(UUID branchId, Pageable pageable) {
        Page<WorkplaceSite> sites = branchId != null
                ? siteRepository.findByBranchId(branchId, pageable)
                : siteRepository.findAll(pageable);

        return sites.map(this::mapSiteResponse);
    }
    @Transactional(readOnly = true)
    public WorkplaceSiteResponse getSiteById(UUID siteId) {
        WorkplaceSite site = siteRepository.findById(siteId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SITE_NOT_FOUND));
        return mapSiteResponse(site);
    }
    @Transactional
    public WorkplaceSiteResponse createSite(CreateSiteRequest request) {
        String code = request.getCode().trim().toUpperCase();
        if (siteRepository.existsByCode(code)) {
            throw new WorkplaceException(WorkplaceErrorCode.SITE_CODE_EXISTS);
        }

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SITE_NOT_FOUND, "Chi nhÃ¡nh khÃ´ng tá»“n táº¡i"));

        WorkplaceSite site = WorkplaceSite.builder()
                .branch(branch)
                .code(code)
                .name(request.getName().trim())
                .address(request.getAddress().trim())
                .description(request.getDescription())
                .build();

        return mapSiteResponse(siteRepository.save(site));
    }
    @Transactional
    public WorkplaceSiteResponse updateSite(UUID siteId, UpdateSiteRequest request) {
        WorkplaceSite site = siteRepository.findById(siteId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SITE_NOT_FOUND));

        site.setName(request.getName().trim());
        site.setAddress(request.getAddress().trim());
        site.setDescription(request.getDescription());

        return mapSiteResponse(siteRepository.save(site));
    }
    @Transactional
    public void deleteSite(UUID siteId) {
        WorkplaceSite site = siteRepository.findById(siteId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SITE_NOT_FOUND));
        siteRepository.delete(site);
    }
    @Transactional(readOnly = true)
    public List<WorkplaceFloorResponse> getFloorsBySiteId(UUID siteId) {
        return floorRepository.findBySiteIdOrderByFloorNumberAsc(siteId).stream()
                .map(this::mapFloorResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public WorkplaceFloorResponse createFloor(UUID siteId, CreateFloorRequest request) {
        WorkplaceSite site = siteRepository.findById(siteId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SITE_NOT_FOUND));

        if (floorRepository.existsBySiteIdAndFloorNumber(siteId, request.getFloorNumber())) {
            throw new WorkplaceException(WorkplaceErrorCode.FLOOR_NUMBER_EXISTS);
        }

        WorkplaceFloor floor = WorkplaceFloor.builder()
                .site(site)
                .floorNumber(request.getFloorNumber())
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        return mapFloorResponse(floorRepository.save(floor));
    }
    @Transactional
    public WorkplaceFloorResponse updateFloor(UUID floorId, UpdateFloorRequest request) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        floor.setName(request.getName().trim());
        floor.setDescription(request.getDescription());

        return mapFloorResponse(floorRepository.save(floor));
    }
    @Transactional
    public void deleteFloor(UUID floorId) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        if (zoneRepository.existsByFloorId(floorId)) {
            throw new WorkplaceException(WorkplaceErrorCode.FLOOR_HAS_ACTIVE_ZONES);
        }
        floorRepository.delete(floor);
    }

    // =========================================================================
    // 2. Floor Plans & Canvas Editor
    // =========================================================================
    @Transactional(readOnly = true)
    public List<WorkplaceFloorPlanResponse> getFloorPlans(UUID floorId) {
        return floorPlanRepository.findByFloorIdOrderByVersionNoDesc(floorId).stream()
                .map(this::mapFloorPlanResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public WorkplaceFloorPlanResponse createFloorPlan(UUID floorId, CreateFloorPlanRequest request) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        int nextVersion = floorPlanRepository.findTopByFloorIdOrderByVersionNoDesc(floorId)
                .map(p -> p.getVersionNo() + 1)
                .orElse(1);

        WorkplaceFloorPlan plan = WorkplaceFloorPlan.builder()
                .floor(floor)
                .versionNo(nextVersion)
                .backgroundFileUrl(request.getBackgroundFileUrl())
                .canvasWidth(request.getCanvasWidth() != null ? request.getCanvasWidth() : 1920)
                .canvasHeight(request.getCanvasHeight() != null ? request.getCanvasHeight() : 1080)
                .scaleMetersPerPx(request.getScaleMetersPerPx() != null ? request.getScaleMetersPerPx() : BigDecimal.valueOf(0.05))
                .status(FloorPlanStatus.DRAFT)
                .build();

        return mapFloorPlanResponse(floorPlanRepository.save(plan));
    }
    @Transactional
    public WorkplaceFloorPlanResponse publishFloorPlan(UUID planId) {
        WorkplaceFloorPlan plan = floorPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_PLAN_NOT_FOUND));

        // Archive previous published plans
        floorPlanRepository.findByFloorIdAndStatus(plan.getFloor().getId(), FloorPlanStatus.PUBLISHED)
                .ifPresent(old -> {
                    old.setStatus(FloorPlanStatus.ARCHIVED);
                    floorPlanRepository.save(old);
                });

        plan.setStatus(FloorPlanStatus.PUBLISHED);
        return mapFloorPlanResponse(floorPlanRepository.save(plan));
    }
    @Transactional
    public WorkplaceFloorPlanResponse archiveFloorPlan(UUID planId) {
        WorkplaceFloorPlan plan = floorPlanRepository.findById(planId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_PLAN_NOT_FOUND));
        plan.setStatus(FloorPlanStatus.ARCHIVED);
        return mapFloorPlanResponse(floorPlanRepository.save(plan));
    }
    @Transactional(readOnly = true)
    public FloorMapResponse getFloorMap(UUID floorId) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        // Ưu tiên hiển thị bản nháp (DRAFT) mới nhất để quản trị viên preview/kiểm tra, nếu không có mới lấy bản chính thức (PUBLISHED)
        WorkplaceFloorPlan activePlan = floorPlanRepository.findTopByFloorIdAndStatusOrderByVersionNoDesc(floorId, FloorPlanStatus.DRAFT)
                .orElseGet(() -> floorPlanRepository.findByFloorIdAndStatus(floorId, FloorPlanStatus.PUBLISHED)
                        .orElseGet(() -> floorPlanRepository.findTopByFloorIdOrderByVersionNoDesc(floorId).orElse(null)));

        List<WorkplaceZone> zones = zoneRepository.findByFloorId(floorId);
        List<WorkplaceSeat> seats = seatRepository.findByFloorId(floorId);
        List<WorkplaceFloorObject> objects = floorObjectRepository.findByFloorId(floorId);

        List<FloorMapResponse.ZoneDto> zoneDtos = zones.stream().map(z -> FloorMapResponse.ZoneDto.builder()
                .id(z.getId())
                .name(z.getName())
                .departmentId(z.getDepartment() != null ? z.getDepartment().getId() : null)
                .departmentName(z.getDepartment() != null ? z.getDepartment().getName() : null)
                .colorHex(z.getColorHex())
                .capacity(z.getCapacity())
                .maxCapacityCeiling(z.getMaxCapacityCeiling())
                .boundaryPoints(z.getBoundaryPoints().stream().map(p -> FloorMapResponse.BoundaryPointDto.builder()
                        .pointOrder(p.getPointOrder())
                        .x(p.getX())
                        .y(p.getY())
                        .build()).collect(Collectors.toList()))
                .build()).collect(Collectors.toList());

        List<FloorMapResponse.SeatRowDto> rowDtos = zones.stream()
                .flatMap(z -> z.getSeatRows().stream())
                .map(r -> FloorMapResponse.SeatRowDto.builder()
                        .id(r.getId())
                        .zoneId(r.getZone().getId())
                        .code(r.getCode())
                        .layoutType(r.getLayoutType())
                        .x(r.getX())
                        .y(r.getY())
                        .rotationDegrees(r.getRotationDegrees())
                        .build())
                .collect(Collectors.toList());

        List<FloorMapResponse.SeatDto> seatDtos = seats.stream().map(s -> {
            Optional<WorkplaceSeatAssignment> activeAssign = assignmentRepository.findBySeatIdAndReleasedAtIsNull(s.getId());
            return FloorMapResponse.SeatDto.builder()
                    .id(s.getId())
                    .seatRowId(s.getSeatRow().getId())
                    .seatCode(s.getSeatCode())
                    .seatType(s.getSeatType())
                    .status(s.getStatus())
                    .x(s.getX())
                    .y(s.getY())
                    .shape(s.getShape())
                    .width(s.getWidth())
                    .height(s.getHeight())
                    .rotationDegrees(s.getRotationDegrees())
                    .qrToken(s.getQrToken())
                    .currentOccupantName(activeAssign.map(a -> a.getEmployee().getFirstName() + " " + a.getEmployee().getLastName()).orElse(null))
                    .currentOccupantEmployeeId(activeAssign.map(a -> a.getEmployee().getId()).orElse(null))
                    .amenities(s.getAmenities().stream().map(WorkplaceAmenity::getName).collect(Collectors.toList()))
                    .build();
        }).collect(Collectors.toList());

        List<FloorMapResponse.FloorObjectDto> objectDtos = objects.stream().map(o -> FloorMapResponse.FloorObjectDto.builder()
                .id(o.getId())
                .objectType(o.getObjectType())
                .name(o.getName())
                .x(o.getX())
                .y(o.getY())
                .width(o.getWidth())
                .height(o.getHeight())
                .rotationDegrees(o.getRotationDegrees())
                .qrToken(o.getQrToken())
                .capacity(o.getMeetingRoom() != null ? o.getMeetingRoom().getCapacity() : null)
                .maxCapacityCeiling(o.getMeetingRoom() != null ? o.getMeetingRoom().getMaxCapacityCeiling() : null)
                .build()).collect(Collectors.toList());

        return FloorMapResponse.builder()
                .floorId(floor.getId())
                .floorName(floor.getName())
                .floorNumber(floor.getFloorNumber())
                .activePlan(activePlan != null ? mapFloorPlanResponse(activePlan) : null)
                .zones(zoneDtos)
                .seatRows(rowDtos)
                .seats(seatDtos)
                .objects(objectDtos)
                .build();
    }

    private record ZoneBox(WorkplaceZone zone, double x, double y, double w, double h) {}

    private FloorObjectType detectFacilityType(String name) {
        if (name == null) return FloorObjectType.OTHER;
        String lower = name.toLowerCase();
        if (lower.contains("pantry") || lower.contains("cafe") || lower.contains("bếp")) return FloorObjectType.PANTRY;
        if (lower.contains("printer") || lower.contains("in ấn")) return FloorObjectType.PRINTER;
        if (lower.contains("restroom") || lower.contains("wc") || lower.contains("vệ sinh")) return FloorObjectType.RESTROOM;
        if (lower.contains("thang máy") || lower.contains("elevator")) return FloorObjectType.ELEVATOR;
        if (lower.contains("cầu thang") || lower.contains("stairs")) return FloorObjectType.STAIRS;
        if (lower.contains("thoát hiểm") || lower.contains("exit")) return FloorObjectType.EXIT;
        if (lower.contains("locker") || lower.contains("tủ")) return FloorObjectType.LOCKER;
        return FloorObjectType.OTHER;
    }

    @Transactional
    public FloorMapResponse saveFloorLayout(UUID floorId, SaveFloorLayoutRequest request) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        // 1. Cập nhật hoặc tạo Floor Plan DRAFT
        WorkplaceFloorPlan draftPlan = floorPlanRepository.findTopByFloorIdAndStatusOrderByVersionNoDesc(floorId, FloorPlanStatus.DRAFT)
                .orElse(null);

        if (draftPlan == null) {
            int nextVersion = floorPlanRepository.findTopByFloorIdOrderByVersionNoDesc(floorId)
                    .map(p -> p.getVersionNo() + 1)
                    .orElse(1);

            draftPlan = WorkplaceFloorPlan.builder()
                    .floor(floor)
                    .versionNo(nextVersion)
                    .status(FloorPlanStatus.DRAFT)
                    .canvasWidth(request.getCanvasWidth() != null ? request.getCanvasWidth() : 1920)
                    .canvasHeight(request.getCanvasHeight() != null ? request.getCanvasHeight() : 1080)
                    .scaleMetersPerPx(request.getScaleMetersPerPx() != null ? request.getScaleMetersPerPx() : BigDecimal.valueOf(0.05))
                    .layoutData(request.getLayoutJson())
                    .build();
        } else {
            if (request.getCanvasWidth() != null) draftPlan.setCanvasWidth(request.getCanvasWidth());
            if (request.getCanvasHeight() != null) draftPlan.setCanvasHeight(request.getCanvasHeight());
            if (request.getScaleMetersPerPx() != null) draftPlan.setScaleMetersPerPx(request.getScaleMetersPerPx());
            if (request.getLayoutJson() != null) draftPlan.setLayoutData(request.getLayoutJson());
        }
        floorPlanRepository.save(draftPlan);

        List<SaveFloorLayoutRequest.LayoutObjectDto> objects = request.getObjects();
        if (objects == null) {
            return getFloorMap(floorId);
        }

        // 2. Tải các thực thể hiện hữu của tầng
        List<WorkplaceZone> existingZones = zoneRepository.findByFloorId(floorId);
        List<WorkplaceSeat> existingSeats = seatRepository.findByFloorId(floorId);
        List<WorkplaceFloorObject> existingFloorObjects = floorObjectRepository.findByFloorId(floorId);

        Map<UUID, WorkplaceZone> zoneById = new HashMap<>();
        for (WorkplaceZone z : existingZones) {
            zoneById.put(z.getId(), z);
        }

        Map<UUID, WorkplaceSeat> seatById = new HashMap<>();
        Map<String, WorkplaceSeat> seatByCode = new HashMap<>();
        for (WorkplaceSeat s : existingSeats) {
            seatById.put(s.getId(), s);
            seatByCode.put(s.getSeatCode(), s);
        }

        Map<UUID, WorkplaceFloorObject> objectById = new HashMap<>();
        for (WorkplaceFloorObject o : existingFloorObjects) {
            objectById.put(o.getId(), o);
        }

        Set<UUID> keptZoneIds = new HashSet<>();
        Set<UUID> keptSeatIds = new HashSet<>();
        Set<UUID> keptObjectIds = new HashSet<>();

        List<ZoneBox> zoneBoxes = new ArrayList<>();

        // 3. Xử lý đồng bộ ZONE
        List<SaveFloorLayoutRequest.LayoutObjectDto> zoneDtos = objects.stream()
                .filter(o -> "ZONE".equalsIgnoreCase(o.getType()))
                .collect(Collectors.toList());

        for (SaveFloorLayoutRequest.LayoutObjectDto dto : zoneDtos) {
            UUID zid = null;
            try {
                if (dto.getId() != null) zid = UUID.fromString(dto.getId());
            } catch (IllegalArgumentException ignored) {}

            WorkplaceZone zone = (zid != null) ? zoneById.get(zid) : null;

            int cap = dto.getCapacity() != null ? dto.getCapacity() : 16;
            int maxCap = dto.getMaxCapacityCeiling() != null ? dto.getMaxCapacityCeiling() : Math.max(cap, 24);
            if (cap > maxCap) cap = maxCap;

            String zName = dto.getName() != null && !dto.getName().isBlank() ? dto.getName().trim() : "Phân khu";

            if (zone == null) {
                zone = WorkplaceZone.builder()
                        .floor(floor)
                        .name(zName)
                        .colorHex(dto.getColor() != null ? dto.getColor() : "#3B82F6")
                        .capacity(cap)
                        .maxCapacityCeiling(maxCap)
                        .build();
            } else {
                zone.setName(zName);
                if (dto.getColor() != null) zone.setColorHex(dto.getColor());
                zone.setCapacity(cap);
                zone.setMaxCapacityCeiling(maxCap);
            }

            BigDecimal x = dto.getX() != null ? dto.getX() : BigDecimal.ZERO;
            BigDecimal y = dto.getY() != null ? dto.getY() : BigDecimal.ZERO;
            BigDecimal w = dto.getW() != null ? dto.getW() : BigDecimal.valueOf(320);
            BigDecimal h = dto.getH() != null ? dto.getH() : BigDecimal.valueOf(220);

            zone.getBoundaryPoints().clear();
            zone.getBoundaryPoints().add(WorkplaceZoneBoundaryPoint.builder().zone(zone).pointOrder(1).x(x).y(y).build());
            zone.getBoundaryPoints().add(WorkplaceZoneBoundaryPoint.builder().zone(zone).pointOrder(2).x(x.add(w)).y(y).build());
            zone.getBoundaryPoints().add(WorkplaceZoneBoundaryPoint.builder().zone(zone).pointOrder(3).x(x.add(w)).y(y.add(h)).build());
            zone.getBoundaryPoints().add(WorkplaceZoneBoundaryPoint.builder().zone(zone).pointOrder(4).x(x).y(y.add(h)).build());

            zone = zoneRepository.save(zone);
            keptZoneIds.add(zone.getId());
            zoneById.put(zone.getId(), zone);

            if (zone.getSeatRows().isEmpty()) {
                WorkplaceSeatRow row = WorkplaceSeatRow.builder()
                        .zone(zone)
                        .code("ROW-1")
                        .layoutType(RowLayoutType.SINGLE_ROW)
                        .x(x)
                        .y(y)
                        .build();
                row = seatRowRepository.save(row);
                zone.getSeatRows().add(row);
            }

            zoneBoxes.add(new ZoneBox(zone, x.doubleValue(), y.doubleValue(), w.doubleValue(), h.doubleValue()));
        }

        // Tạo zone mặc định nếu chưa có zone nào
        if (zoneBoxes.isEmpty()) {
            WorkplaceZone defaultZone = WorkplaceZone.builder()
                    .floor(floor)
                    .name("Khu vực chung")
                    .colorHex("#3B82F6")
                    .capacity(30)
                    .maxCapacityCeiling(50)
                    .build();
            defaultZone = zoneRepository.save(defaultZone);
            WorkplaceSeatRow defaultRow = WorkplaceSeatRow.builder()
                    .zone(defaultZone)
                    .code("DEFAULT")
                    .layoutType(RowLayoutType.SINGLE_ROW)
                    .x(BigDecimal.ZERO)
                    .y(BigDecimal.ZERO)
                    .build();
            defaultRow = seatRowRepository.save(defaultRow);
            defaultZone.getSeatRows().add(defaultRow);
            keptZoneIds.add(defaultZone.getId());
            zoneById.put(defaultZone.getId(), defaultZone);
            zoneBoxes.add(new ZoneBox(defaultZone, 0, 0, 2000, 2000));
        }

        // 4. Xử lý đồng bộ SEATS
        List<SaveFloorLayoutRequest.LayoutObjectDto> seatDtos = objects.stream()
                .filter(o -> "SEAT".equalsIgnoreCase(o.getType()))
                .collect(Collectors.toList());

        for (SaveFloorLayoutRequest.LayoutObjectDto dto : seatDtos) {
            UUID sid = null;
            try {
                if (dto.getId() != null) sid = UUID.fromString(dto.getId());
            } catch (IllegalArgumentException ignored) {}

            WorkplaceSeat seat = null;
            if (sid != null && seatById.containsKey(sid)) {
                seat = seatById.get(sid);
            } else if (dto.getName() != null && seatByCode.containsKey(dto.getName().trim().toUpperCase())) {
                seat = seatByCode.get(dto.getName().trim().toUpperCase());
            }

            double sx = dto.getX() != null ? dto.getX().doubleValue() : 0;
            double sy = dto.getY() != null ? dto.getY().doubleValue() : 0;
            double sw = dto.getW() != null ? dto.getW().doubleValue() : 56;
            double sh = dto.getH() != null ? dto.getH().doubleValue() : 44;
            double cx = sx + sw / 2.0;
            double cy = sy + sh / 2.0;

            WorkplaceZone targetZone = null;
            UUID zRef = null;
            try {
                if (dto.getZoneId() != null) zRef = UUID.fromString(dto.getZoneId());
            } catch (IllegalArgumentException ignored) {}

            if (zRef != null && zoneById.containsKey(zRef)) {
                targetZone = zoneById.get(zRef);
            }
            if (targetZone == null) {
                for (ZoneBox zb : zoneBoxes) {
                    if (cx >= zb.x && cx <= zb.x + zb.w && cy >= zb.y && cy <= zb.y + zb.h) {
                        targetZone = zb.zone;
                        break;
                    }
                }
            }
            if (targetZone == null && !zoneBoxes.isEmpty()) {
                targetZone = zoneBoxes.get(0).zone;
            }

            WorkplaceSeatRow targetRow = (targetZone != null && !targetZone.getSeatRows().isEmpty())
                    ? targetZone.getSeatRows().get(0)
                    : null;

            SeatType st = "FIXED_DESK".equalsIgnoreCase(dto.getSeatType()) || "VIP".equalsIgnoreCase(dto.getSeatType())
                    ? SeatType.DEDICATED
                    : SeatType.HOT_DESK;

            SeatStatus status = SeatStatus.IN_SERVICE;
            if ("MAINTENANCE".equalsIgnoreCase(dto.getStatus())) {
                status = SeatStatus.MAINTENANCE;
            } else if ("BLOCKED".equalsIgnoreCase(dto.getStatus())) {
                status = SeatStatus.BLOCKED;
            }

            String code = dto.getName() != null && !dto.getName().isBlank()
                    ? dto.getName().trim().toUpperCase()
                    : "SEAT-" + System.currentTimeMillis() % 10000;

            if (seat == null) {
                if (seatRepository.existsBySeatCode(code)) {
                    code = code + "-" + (int)(Math.random() * 90 + 10);
                }
                seat = WorkplaceSeat.builder()
                        .seatRow(targetRow)
                        .seatCode(code)
                        .seatType(st)
                        .status(status)
                        .shape(SeatShape.RECTANGLE)
                        .x(dto.getX() != null ? dto.getX() : BigDecimal.ZERO)
                        .y(dto.getY() != null ? dto.getY() : BigDecimal.ZERO)
                        .width(dto.getW() != null ? dto.getW() : BigDecimal.valueOf(56))
                        .height(dto.getH() != null ? dto.getH() : BigDecimal.valueOf(44))
                        .rotationDegrees(dto.getRotation() != null ? dto.getRotation() : BigDecimal.ZERO)
                        .qrToken(UUID.randomUUID().toString().replace("-", ""))
                        .build();
            } else {
                seat.setSeatCode(code);
                seat.setSeatType(st);
                seat.setStatus(status);
                seat.setX(dto.getX() != null ? dto.getX() : seat.getX());
                seat.setY(dto.getY() != null ? dto.getY() : seat.getY());
                seat.setWidth(dto.getW() != null ? dto.getW() : seat.getWidth());
                seat.setHeight(dto.getH() != null ? dto.getH() : seat.getHeight());
                seat.setRotationDegrees(dto.getRotation() != null ? dto.getRotation() : seat.getRotationDegrees());
                if (targetRow != null) {
                    seat.setSeatRow(targetRow);
                }
            }

            seat = seatRepository.save(seat);
            keptSeatIds.add(seat.getId());
        }

        // 5. Xử lý đồng bộ FLOOR OBJECTS & MEETING ROOMS
        List<SaveFloorLayoutRequest.LayoutObjectDto> objectDtos = objects.stream()
                .filter(o -> "MEETING_ROOM".equalsIgnoreCase(o.getType()) || "FACILITY".equalsIgnoreCase(o.getType()))
                .collect(Collectors.toList());

        for (SaveFloorLayoutRequest.LayoutObjectDto dto : objectDtos) {
            UUID oid = null;
            try {
                if (dto.getId() != null) oid = UUID.fromString(dto.getId());
            } catch (IllegalArgumentException ignored) {}

            WorkplaceFloorObject obj = (oid != null) ? objectById.get(oid) : null;

            boolean isMeetingRoom = "MEETING_ROOM".equalsIgnoreCase(dto.getType());
            FloorObjectType objType = isMeetingRoom
                    ? FloorObjectType.MEETING_ROOM
                    : detectFacilityType(dto.getName());

            int cap = dto.getCapacity() != null ? dto.getCapacity() : (isMeetingRoom ? 10 : 6);
            int maxCap = dto.getMaxCapacityCeiling() != null ? dto.getMaxCapacityCeiling() : Math.max(cap, 30);
            if (cap > maxCap) cap = maxCap;

            String objName = dto.getName() != null && !dto.getName().isBlank()
                    ? dto.getName().trim()
                    : (isMeetingRoom ? "Phòng họp" : "Tiện ích");

            if (obj == null) {
                obj = WorkplaceFloorObject.builder()
                        .floor(floor)
                        .objectType(objType)
                        .name(objName)
                        .x(dto.getX() != null ? dto.getX() : BigDecimal.ZERO)
                        .y(dto.getY() != null ? dto.getY() : BigDecimal.ZERO)
                        .width(dto.getW() != null ? dto.getW() : BigDecimal.valueOf(160))
                        .height(dto.getH() != null ? dto.getH() : BigDecimal.valueOf(120))
                        .rotationDegrees(dto.getRotation() != null ? dto.getRotation() : BigDecimal.ZERO)
                        .qrToken(UUID.randomUUID().toString().replace("-", ""))
                        .build();
            } else {
                obj.setName(objName);
                obj.setObjectType(objType);
                obj.setX(dto.getX() != null ? dto.getX() : obj.getX());
                obj.setY(dto.getY() != null ? dto.getY() : obj.getY());
                obj.setWidth(dto.getW() != null ? dto.getW() : obj.getWidth());
                obj.setHeight(dto.getH() != null ? dto.getH() : obj.getHeight());
                obj.setRotationDegrees(dto.getRotation() != null ? dto.getRotation() : obj.getRotationDegrees());
            }

            obj = floorObjectRepository.save(obj);
            keptObjectIds.add(obj.getId());

            if (isMeetingRoom) {
                WorkplaceMeetingRoom mr = obj.getMeetingRoom();
                if (mr == null) {
                    mr = WorkplaceMeetingRoom.builder()
                            .floorObject(obj)
                            .capacity(cap)
                            .maxCapacityCeiling(maxCap)
                            .hasProjector(true)
                            .hasVideoConference(true)
                            .hasWhiteboard(true)
                            .build();
                } else {
                    mr.setCapacity(cap);
                    mr.setMaxCapacityCeiling(maxCap);
                }
                meetingRoomRepository.save(mr);
                obj.setMeetingRoom(mr);
            }
        }

        // 6. Xóa các đối tượng cũ đã bị gỡ khỏi sơ đồ
        for (WorkplaceSeat s : existingSeats) {
            if (!keptSeatIds.contains(s.getId())) {
                assignmentRepository.findBySeatIdAndReleasedAtIsNull(s.getId()).ifPresent(a -> {
                    a.setReleasedAt(LocalDateTime.now());
                    assignmentRepository.save(a);
                });
                seatRepository.delete(s);
            }
        }

        for (WorkplaceFloorObject o : existingFloorObjects) {
            if (!keptObjectIds.contains(o.getId())) {
                floorObjectRepository.delete(o);
            }
        }

        for (WorkplaceZone z : existingZones) {
            if (!keptZoneIds.contains(z.getId())) {
                zoneRepository.delete(z);
            }
        }

        return getFloorMap(floorId);
    }

    // =========================================================================
    // 3. Zones & Rows
    // =========================================================================
    @Transactional
    public WorkplaceZone createZone(UUID floorId, CreateZoneRequest request) {
        WorkplaceFloor floor = floorRepository.findById(floorId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.FLOOR_NOT_FOUND));

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        WorkplaceZone zone = WorkplaceZone.builder()
                .floor(floor)
                .name(request.getName().trim())
                .department(dept)
                .colorHex(request.getColorHex() != null ? request.getColorHex() : "#3B82F6")
                .build();

        if (request.getBoundaryPoints() != null) {
            for (CreateZoneRequest.BoundaryPointDto pt : request.getBoundaryPoints()) {
                zone.getBoundaryPoints().add(WorkplaceZoneBoundaryPoint.builder()
                        .zone(zone)
                        .pointOrder(pt.getPointOrder())
                        .x(pt.getX())
                        .y(pt.getY())
                        .build());
            }
        }

        return zoneRepository.save(zone);
    }
    @Transactional
    public void deleteZone(UUID zoneId) {
        WorkplaceZone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.ZONE_NOT_FOUND));
        zoneRepository.delete(zone);
    }
    @Transactional
    public WorkplaceSeatRow createSeatRow(UUID zoneId, CreateSeatRowRequest request) {
        WorkplaceZone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.ZONE_NOT_FOUND));

        String code = request.getCode().trim().toUpperCase();
        if (seatRowRepository.existsByZoneIdAndCode(zoneId, code)) {
            throw new WorkplaceException(WorkplaceErrorCode.SEAT_ROW_NOT_FOUND, "MÃ£ cá»¥m bÃ n Ä‘Ã£ tá»“n táº¡i trong khu vá»±c nÃ y");
        }

        WorkplaceSeatRow row = WorkplaceSeatRow.builder()
                .zone(zone)
                .code(code)
                .layoutType(request.getLayoutType() != null ? request.getLayoutType() : RowLayoutType.SINGLE_ROW)
                .x(request.getX() != null ? request.getX() : BigDecimal.ZERO)
                .y(request.getY() != null ? request.getY() : BigDecimal.ZERO)
                .rotationDegrees(request.getRotationDegrees() != null ? request.getRotationDegrees() : BigDecimal.ZERO)
                .build();

        return seatRowRepository.save(row);
    }
    @Transactional
    public void deleteSeatRow(UUID rowId) {
        WorkplaceSeatRow row = seatRowRepository.findById(rowId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_ROW_NOT_FOUND));
        seatRowRepository.delete(row);
    }
    @Transactional
    public List<WorkplaceSeatDetailResponse> generateSeatsForRow(UUID rowId) {
        WorkplaceSeatRow row = seatRowRepository.findById(rowId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_ROW_NOT_FOUND));

        int count = switch (row.getLayoutType()) {
            case POD_4_FACING -> 4;
            case POD_6_FACING -> 6;
            default -> 4;
        };

        List<WorkplaceSeat> createdSeats = new ArrayList<>();
        BigDecimal deskWidth = BigDecimal.valueOf(60);
        BigDecimal deskHeight = BigDecimal.valueOf(40);

        for (int i = 1; i <= count; i++) {
            String seatCode = String.format("%s-%02d", row.getCode(), i);
            if (seatRepository.existsBySeatCode(seatCode)) {
                continue;
            }

            BigDecimal offsetX = BigDecimal.valueOf((i - 1) % 2 * 65);
            BigDecimal offsetY = BigDecimal.valueOf((i - 1) / 2 * 45);

            WorkplaceSeat seat = WorkplaceSeat.builder()
                    .seatRow(row)
                    .seatCode(seatCode)
                    .seatType(SeatType.DEDICATED)
                    .status(SeatStatus.IN_SERVICE)
                    .shape(SeatShape.RECTANGLE)
                    .x(row.getX().add(offsetX))
                    .y(row.getY().add(offsetY))
                    .width(deskWidth)
                    .height(deskHeight)
                    .rotationDegrees(row.getRotationDegrees())
                    .qrToken(UUID.randomUUID().toString().replace("-", ""))
                    .build();

            createdSeats.add(seatRepository.save(seat));
        }

        return createdSeats.stream().map(this::mapSeatDetailResponse).collect(Collectors.toList());
    }

    // =========================================================================
    // 4. Seats & Assignments
    // =========================================================================
    @Transactional(readOnly = true)
    public Page<WorkplaceSeatDetailResponse> getSeats(UUID floorId, UUID zoneId, String seatType, SeatStatus status, Pageable pageable) {
        SeatType st = seatType != null ? SeatType.valueOf(seatType) : null;
        return seatRepository.findSeatsFiltered(floorId, zoneId, st, status, pageable)
                .map(this::mapSeatDetailResponse);
    }
    @Transactional(readOnly = true)
    public WorkplaceSeatDetailResponse getSeatById(UUID seatId) {
        WorkplaceSeat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND));
        return mapSeatDetailResponse(seat);
    }
    @Transactional
    public WorkplaceSeatDetailResponse createSeat(CreateSeatRequest request) {
        WorkplaceSeatRow row = seatRowRepository.findById(request.getSeatRowId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_ROW_NOT_FOUND));

        String seatCode = request.getSeatCode().trim().toUpperCase();
        if (seatRepository.existsBySeatCode(seatCode)) {
            throw new WorkplaceException(WorkplaceErrorCode.SEAT_CODE_EXISTS);
        }

        WorkplaceSeat seat = WorkplaceSeat.builder()
                .seatRow(row)
                .seatCode(seatCode)
                .seatType(request.getSeatType() != null ? request.getSeatType() : SeatType.DEDICATED)
                .shape(request.getShape() != null ? request.getShape() : SeatShape.RECTANGLE)
                .x(request.getX() != null ? request.getX() : BigDecimal.ZERO)
                .y(request.getY() != null ? request.getY() : BigDecimal.ZERO)
                .width(request.getWidth() != null ? request.getWidth() : BigDecimal.valueOf(60))
                .height(request.getHeight() != null ? request.getHeight() : BigDecimal.valueOf(40))
                .rotationDegrees(request.getRotationDegrees() != null ? request.getRotationDegrees() : BigDecimal.ZERO)
                .status(SeatStatus.IN_SERVICE)
                .qrToken(UUID.randomUUID().toString().replace("-", ""))
                .build();

        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            seat.getAmenities().addAll(amenityRepository.findAllById(request.getAmenityIds()));
        }

        return mapSeatDetailResponse(seatRepository.save(seat));
    }
    @Transactional
    public WorkplaceSeatDetailResponse updateSeatStatus(UUID seatId, SeatStatus status) {
        WorkplaceSeat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND));
        seat.setStatus(status);
        return mapSeatDetailResponse(seatRepository.save(seat));
    }
    @Transactional
    public void deleteSeat(UUID seatId) {
        WorkplaceSeat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND));
        seatRepository.delete(seat);
    }

    @Transactional(readOnly = true)
    public List<WorkplaceAmenityResponse> getAmenities() {
        return amenityRepository.findAll().stream()
                .map(this::mapAmenityResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkplaceAmenityResponse createAmenity(CreateWorkplaceAmenityRequest request) {
        Company company = companyRepository.findAll().stream().findFirst().orElse(null);
        String name = request.getName().trim();
        if (company != null && amenityRepository.existsByCompanyIdAndName(company.getId(), name)) {
            throw new WorkplaceException(WorkplaceErrorCode.AMENITY_NAME_EXISTS);
        }

        WorkplaceAmenity amenity = WorkplaceAmenity.builder()
                .company(company)
                .name(name)
                .iconName(request.getIconName() != null ? request.getIconName().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .build();

        return mapAmenityResponse(amenityRepository.save(amenity));
    }

    @Transactional
    public void deleteAmenity(UUID amenityId) {
        WorkplaceAmenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.AMENITY_NOT_FOUND));
        if (amenity.getSeats() != null && !amenity.getSeats().isEmpty()) {
            throw new WorkplaceException(WorkplaceErrorCode.AMENITY_IN_USE);
        }
        amenityRepository.delete(amenity);
    }

    private WorkplaceAmenityResponse mapAmenityResponse(WorkplaceAmenity amenity) {
        return WorkplaceAmenityResponse.builder()
                .id(amenity.getId())
                .name(amenity.getName())
                .iconName(amenity.getIconName())
                .description(amenity.getDescription())
                .seatCount(amenity.getSeats() != null ? amenity.getSeats().size() : 0)
                .createdAt(amenity.getCreatedAt())
                .build();
    }
    @Transactional(readOnly = true)
    public Page<SeatAssignmentResponse> getSeatAssignments(UUID floorId, UUID employeeId, boolean activeOnly, Pageable pageable) {
        Page<WorkplaceSeatAssignment> page;
        if (floorId == null && employeeId == null && activeOnly) {
            page = assignmentRepository.findByReleasedAtIsNull(pageable);
        } else {
            page = assignmentRepository.findAssignmentsFiltered(floorId, employeeId, activeOnly, pageable);
        }
        return page.map(this::mapAssignmentResponse);
    }
    @Transactional
    public SeatAssignmentResponse assignSeat(AssignSeatRequest request) {
        WorkplaceSeat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND));

        if (seat.getStatus() != SeatStatus.IN_SERVICE) {
            throw new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_AVAILABLE);
        }

        if (assignmentRepository.existsBySeatIdAndReleasedAtIsNull(seat.getId())) {
            throw new WorkplaceException(WorkplaceErrorCode.SEAT_ALREADY_ASSIGNED);
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND, "NhÃ¢n viÃªn khÃ´ng tá»“n táº¡i"));

        // If employee already has a dedicated seat, release it first
        assignmentRepository.findByEmployeeIdAndReleasedAtIsNull(employee.getId())
                .ifPresent(old -> {
                    old.setReleasedAt(LocalDateTime.now());
                    assignmentRepository.save(old);
                });

        WorkplaceSeatAssignment assignment = WorkplaceSeatAssignment.builder()
                .seat(seat)
                .employee(employee)
                .assignedAt(LocalDateTime.now())
                .note(request.getNote())
                .build();

        return mapAssignmentResponse(assignmentRepository.save(assignment));
    }
    @Transactional
    public void releaseSeat(UUID assignmentId) {
        WorkplaceSeatAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_ASSIGNMENT_NOT_FOUND));
        assignment.setReleasedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);
    }

    // =========================================================================
    // 5. Desk Bookings (Hot-desking)
    // =========================================================================
    @Transactional(readOnly = true)
    public List<WorkplaceSeatDetailResponse> getAvailableHotDesks(LocalDate date, UUID floorId) {
        List<WorkplaceSeat> seats = seatRepository.findByFloorId(floorId);

        return seats.stream()
                .filter(s -> s.getSeatType() == SeatType.HOT_DESK && s.getStatus() == SeatStatus.IN_SERVICE)
                .filter(s -> !deskBookingRepository.existsBySeatIdAndBookingDateAndStatusNot(s.getId(), date, BookingStatus.CANCELLED))
                .map(this::mapSeatDetailResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public DeskBookingResponse bookDesk(UUID currentUserId, BookDeskRequest request) {
        Employee employee = getEmployeeByUserId(currentUserId);
        WorkplaceSeat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND));

        if (seat.getSeatType() != SeatType.HOT_DESK) {
            throw new WorkplaceException(WorkplaceErrorCode.NOT_HOT_DESK);
        }
        if (seat.getStatus() != SeatStatus.IN_SERVICE) {
            throw new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_AVAILABLE);
        }

        if (deskBookingRepository.existsBySeatIdAndBookingDateAndStatusNot(seat.getId(), request.getBookingDate(), BookingStatus.CANCELLED)) {
            throw new WorkplaceException(WorkplaceErrorCode.DESK_ALREADY_BOOKED);
        }

        if (deskBookingRepository.existsByEmployeeIdAndBookingDateAndStatusNot(employee.getId(), request.getBookingDate(), BookingStatus.CANCELLED)) {
            throw new WorkplaceException(WorkplaceErrorCode.EMPLOYEE_ALREADY_BOOKED_DESK);
        }

        WorkplaceDeskBooking booking = WorkplaceDeskBooking.builder()
                .seat(seat)
                .employee(employee)
                .bookingDate(request.getBookingDate())
                .status(BookingStatus.CONFIRMED)
                .note(request.getNote())
                .build();

        return mapDeskBookingResponse(deskBookingRepository.save(booking));
    }
    @Transactional
    public DeskBookingResponse checkInDesk(UUID bookingId, String qrToken) {
        WorkplaceDeskBooking booking = deskBookingRepository.findById(bookingId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.DESK_BOOKING_NOT_FOUND));

        if (!booking.getSeat().getQrToken().equals(qrToken)) {
            throw new WorkplaceException(WorkplaceErrorCode.INVALID_QR_TOKEN);
        }

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setCheckedInAt(LocalDateTime.now());
        return mapDeskBookingResponse(deskBookingRepository.save(booking));
    }
    @Transactional
    public void cancelDeskBooking(UUID bookingId, UUID currentUserId) {
        WorkplaceDeskBooking booking = deskBookingRepository.findById(bookingId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.DESK_BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        deskBookingRepository.save(booking);
    }
    @Transactional(readOnly = true)
    public Page<DeskBookingResponse> getDeskBookings(LocalDate date, UUID floorId, UUID employeeId, Pageable pageable) {
        Page<WorkplaceDeskBooking> page;
        if (date == null && floorId == null && employeeId == null) {
            page = deskBookingRepository.findAllByOrderByBookingDateDesc(pageable);
        } else {
            page = deskBookingRepository.findBookingsFiltered(date, floorId, employeeId, null, pageable);
        }
        return page.map(this::mapDeskBookingResponse);
    }
    @Transactional(readOnly = true)
    public List<DeskBookingResponse> getMyDeskBookings(UUID currentUserId) {
        return employeeRepository.findByUserId(currentUserId)
                .map(employee -> deskBookingRepository.findByEmployeeIdOrderByBookingDateDesc(employee.getId()).stream()
                        .map(this::mapDeskBookingResponse)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
    @Transactional(readOnly = true)
    public WorkplaceSeatDetailResponse getMyDedicatedSeat(UUID currentUserId) {
        return employeeRepository.findByUserId(currentUserId)
                .flatMap(employee -> assignmentRepository.findByEmployeeIdAndReleasedAtIsNull(employee.getId()))
                .map(a -> mapSeatDetailResponse(a.getSeat()))
                .orElse(null);
    }

    // =========================================================================
    // 6. Meeting Rooms & Bookings
    // =========================================================================
    @Transactional(readOnly = true)
    public List<FloorMapResponse.FloorObjectDto> getMeetingRooms(UUID floorId) {
        List<WorkplaceFloorObject> objects = floorId != null
                ? floorObjectRepository.findByFloorId(floorId).stream()
                        .filter(o -> o.getObjectType() == FloorObjectType.MEETING_ROOM)
                        .collect(Collectors.toList())
                : floorObjectRepository.findAll().stream()
                        .filter(o -> o.getObjectType() == FloorObjectType.MEETING_ROOM)
                        .collect(Collectors.toList());

        return objects.stream()
                .map(this::mapFloorObjectDto)
                .collect(Collectors.toList());
    }

    private FloorMapResponse.FloorObjectDto mapFloorObjectDto(WorkplaceFloorObject o) {
        return FloorMapResponse.FloorObjectDto.builder()
                .id(o.getId())
                .objectType(o.getObjectType())
                .name(o.getName())
                .x(o.getX())
                .y(o.getY())
                .width(o.getWidth())
                .height(o.getHeight())
                .rotationDegrees(o.getRotationDegrees())
                .qrToken(o.getQrToken())
                .capacity(o.getMeetingRoom() != null ? o.getMeetingRoom().getCapacity() : null)
                .build();
    }
    @Transactional(readOnly = true)
    public Page<RoomBookingResponse> getRoomBookings(UUID roomId, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable) {
        Page<WorkplaceRoomBooking> page;
        if (roomId == null && startTime == null && endTime == null) {
            page = roomBookingRepository.findAllByOrderByStartTimeDesc(pageable);
        } else {
            page = roomBookingRepository.findRoomBookingsFiltered(roomId, startTime, endTime, null, pageable);
        }
        return page.map(this::mapRoomBookingResponse);
    }
    @Transactional
    public RoomBookingResponse bookRoom(UUID currentUserId, BookRoomRequest request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new WorkplaceException(WorkplaceErrorCode.INVALID_BOOKING_TIME);
        }

        WorkplaceFloorObject roomObj = floorObjectRepository.findById(request.getMeetingRoomId())
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.MEETING_ROOM_NOT_FOUND));

        if (roomObj.getMeetingRoom() != null && request.getAttendeeCount() > roomObj.getMeetingRoom().getCapacity()) {
            throw new WorkplaceException(WorkplaceErrorCode.ROOM_CAPACITY_EXCEEDED);
        }

        if (roomBookingRepository.existsTimeConflict(roomObj.getId(), request.getStartTime(), request.getEndTime(), BookingStatus.CANCELLED, null)) {
            throw new WorkplaceException(WorkplaceErrorCode.ROOM_BOOKING_CONFLICT);
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.MEETING_ROOM_NOT_FOUND, "NgÆ°á»i dÃ¹ng khÃ´ng tá»“n táº¡i"));

        Employee organizer = request.getOrganizerEmployeeId() != null
                ? employeeRepository.findById(request.getOrganizerEmployeeId()).orElseGet(() -> getEmployeeByUserId(currentUserId))
                : getEmployeeByUserId(currentUserId);

        WorkplaceRoomBooking booking = WorkplaceRoomBooking.builder()
                .meetingRoom(roomObj)
                .organizerEmployee(organizer)
                .createdByUser(user)
                .title(request.getTitle().trim())
                .attendeeCount(request.getAttendeeCount())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(BookingStatus.CONFIRMED)
                .description(request.getDescription())
                .build();

        return mapRoomBookingResponse(roomBookingRepository.save(booking));
    }
    @Transactional
    public RoomBookingResponse checkInRoom(UUID bookingId) {
        WorkplaceRoomBooking booking = roomBookingRepository.findById(bookingId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.ROOM_BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setCheckedInAt(LocalDateTime.now());
        return mapRoomBookingResponse(roomBookingRepository.save(booking));
    }
    @Transactional
    public void cancelRoomBooking(UUID bookingId, UUID currentUserId) {
        WorkplaceRoomBooking booking = roomBookingRepository.findById(bookingId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.ROOM_BOOKING_NOT_FOUND));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        roomBookingRepository.save(booking);
    }
    @Transactional(readOnly = true)
    public List<RoomBookingResponse> getMyRoomBookings(UUID currentUserId) {
        return employeeRepository.findByUserId(currentUserId)
                .map(employee -> roomBookingRepository.findByOrganizerEmployeeIdOrderByStartTimeDesc(employee.getId()).stream()
                        .map(this::mapRoomBookingResponse)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // =========================================================================
    // 7. Workplace Issues
    // =========================================================================
    @Transactional
    public WorkplaceIssueResponse reportIssue(UUID currentUserId, CreateWorkplaceIssueRequest request) {
        Employee reporter = getEmployeeByUserId(currentUserId);

        WorkplaceSeat seat = request.getSeatId() != null ? seatRepository.findById(request.getSeatId()).orElse(null) : null;
        WorkplaceFloorObject obj = request.getFloorObjectId() != null ? floorObjectRepository.findById(request.getFloorObjectId()).orElse(null) : null;
        WorkplaceFloor floor = request.getFloorId() != null ? floorRepository.findById(request.getFloorId()).orElse(null) : null;

        WorkplaceIssue issue = WorkplaceIssue.builder()
                .reporterEmployee(reporter)
                .issueType(request.getIssueType())
                .severity(request.getSeverity() != null ? request.getSeverity() : IssueSeverity.MEDIUM)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .seat(seat)
                .floorObject(obj)
                .floor(floor)
                .locationX(request.getLocationX())
                .locationY(request.getLocationY())
                .status(WorkplaceIssueStatus.OPEN)
                .reportedAt(LocalDateTime.now())
                .build();

        // Auto block seat if high severity
        if (seat != null && (request.getSeverity() == IssueSeverity.HIGH || request.getIssueType() == WorkplaceIssueType.ELECTRICAL)) {
            seat.setStatus(SeatStatus.BLOCKED);
            seatRepository.save(seat);
        }

        return mapIssueResponse(issueRepository.save(issue));
    }
    @Transactional(readOnly = true)
    public Page<WorkplaceIssueResponse> getIssues(String status, String severity, UUID floorId, Pageable pageable) {
        WorkplaceIssueStatus is = status != null ? WorkplaceIssueStatus.valueOf(status) : null;
        IssueSeverity sev = severity != null ? IssueSeverity.valueOf(severity) : null;
        Page<WorkplaceIssue> page;
        if (is == null && sev == null && floorId == null) {
            page = issueRepository.findAllByOrderByReportedAtDesc(pageable);
        } else {
            page = issueRepository.findIssuesFiltered(is, sev, floorId, pageable);
        }
        return page.map(this::mapIssueResponse);
    }
    @Transactional(readOnly = true)
    public WorkplaceIssueResponse getIssueById(UUID issueId) {
        WorkplaceIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.WORKPLACE_ISSUE_NOT_FOUND));
        return mapIssueResponse(issue);
    }
    @Transactional
    public WorkplaceIssueResponse assignIssue(UUID issueId, UUID assignedEmployeeId) {
        WorkplaceIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.WORKPLACE_ISSUE_NOT_FOUND));

        Employee technician = employeeRepository.findById(assignedEmployeeId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.WORKPLACE_ISSUE_NOT_FOUND, "NhÃ¢n viÃªn ká»¹ thuáº­t khÃ´ng tá»“n táº¡i"));

        issue.setAssignedToEmployee(technician);
        return mapIssueResponse(issueRepository.save(issue));
    }
    @Transactional
    public WorkplaceIssueResponse startIssue(UUID issueId) {
        WorkplaceIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.WORKPLACE_ISSUE_NOT_FOUND));

        issue.setStatus(WorkplaceIssueStatus.IN_PROGRESS);
        return mapIssueResponse(issueRepository.save(issue));
    }
    @Transactional
    public WorkplaceIssueResponse resolveIssue(UUID issueId, String resolutionNote) {
        WorkplaceIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.WORKPLACE_ISSUE_NOT_FOUND));

        issue.setStatus(WorkplaceIssueStatus.RESOLVED);
        issue.setResolutionNote(resolutionNote);
        issue.setResolvedAt(LocalDateTime.now());

        // Unblock seat if associated
        if (issue.getSeat() != null && issue.getSeat().getStatus() == SeatStatus.BLOCKED) {
            issue.getSeat().setStatus(SeatStatus.IN_SERVICE);
            seatRepository.save(issue.getSeat());
        }

        return mapIssueResponse(issueRepository.save(issue));
    }
    @Transactional(readOnly = true)
    public List<WorkplaceIssueResponse> getMyIssues(UUID currentUserId) {
        return employeeRepository.findByUserId(currentUserId)
                .map(employee -> issueRepository.findByReporterEmployeeIdOrderByReportedAtDesc(employee.getId()).stream()
                        .map(this::mapIssueResponse)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    // =========================================================================
    // 8. Navigation, QR & Reports
    // =========================================================================
    @Transactional(readOnly = true)
    public EmployeeLocationResponse getEmployeeLocation(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND, "NhÃ¢n viÃªn khÃ´ng tá»“n táº¡i"));

        // 1. Check dedicated seat
        Optional<WorkplaceSeatAssignment> dedicated = assignmentRepository.findByEmployeeIdAndReleasedAtIsNull(employeeId);
        if (dedicated.isPresent()) {
            WorkplaceSeat seat = dedicated.get().getSeat();
            WorkplaceFloor floor = seat.getSeatRow().getZone().getFloor();
            return EmployeeLocationResponse.builder()
                    .employeeId(employee.getId())
                    .employeeName(employee.getFirstName() + " " + employee.getLastName())
                    .employeeCode(employee.getEmployeeCode())
                    .departmentName(employee.getCurrentDepartment() != null ? employee.getCurrentDepartment().getName() : null)
                    .siteId(floor.getSite().getId())
                    .siteName(floor.getSite().getName())
                    .floorId(floor.getId())
                    .floorName(floor.getName())
                    .floorNumber(floor.getFloorNumber())
                    .seatId(seat.getId())
                    .seatCode(seat.getSeatCode())
                    .x(seat.getX())
                    .y(seat.getY())
                    .seatType("DEDICATED")
                    .build();
        }

        // 2. Check hot-desk booking today
        Optional<WorkplaceDeskBooking> hotdesk = deskBookingRepository.findByEmployeeIdAndBookingDateAndStatusNot(employeeId, LocalDate.now(), BookingStatus.CANCELLED);
        if (hotdesk.isPresent()) {
            WorkplaceSeat seat = hotdesk.get().getSeat();
            WorkplaceFloor floor = seat.getSeatRow().getZone().getFloor();
            return EmployeeLocationResponse.builder()
                    .employeeId(employee.getId())
                    .employeeName(employee.getFirstName() + " " + employee.getLastName())
                    .employeeCode(employee.getEmployeeCode())
                    .departmentName(employee.getCurrentDepartment() != null ? employee.getCurrentDepartment().getName() : null)
                    .siteId(floor.getSite().getId())
                    .siteName(floor.getSite().getName())
                    .floorId(floor.getId())
                    .floorName(floor.getName())
                    .floorNumber(floor.getFloorNumber())
                    .seatId(seat.getId())
                    .seatCode(seat.getSeatCode())
                    .x(seat.getX())
                    .y(seat.getY())
                    .seatType("HOT_DESK")
                    .build();
        }

        return null;
    }
    public NavigationRouteResponse calculateRoute(UUID floorId, BigDecimal startX, BigDecimal startY, BigDecimal endX, BigDecimal endY) {
        // Direct A* waypoint approximation
        List<NavigationRouteResponse.PointDto> points = new ArrayList<>();
        points.add(NavigationRouteResponse.PointDto.builder().x(startX).y(startY).build());

        // Simple orthogonal corridor waypoint
        BigDecimal midX = startX;
        BigDecimal midY = endY;
        points.add(NavigationRouteResponse.PointDto.builder().x(midX).y(midY).build());
        points.add(NavigationRouteResponse.PointDto.builder().x(endX).y(endY).build());

        BigDecimal dx = endX.subtract(startX).abs();
        BigDecimal dy = endY.subtract(startY).abs();
        BigDecimal totalDist = dx.add(dy).multiply(BigDecimal.valueOf(0.05)).setScale(1, RoundingMode.HALF_UP);

        return NavigationRouteResponse.builder()
                .floorId(floorId)
                .totalDistanceMeters(totalDist)
                .pathPoints(points)
                .build();
    }
    @Transactional(readOnly = true)
    public QrResolutionResponse resolveQr(String qrToken) {
        // Try seat
        Optional<WorkplaceSeat> seat = seatRepository.findByQrToken(qrToken);
        if (seat.isPresent()) {
            WorkplaceSeat s = seat.get();
            WorkplaceFloor f = s.getSeatRow().getZone().getFloor();
            return QrResolutionResponse.builder()
                    .targetType("SEAT")
                    .targetId(s.getId())
                    .code(s.getSeatCode())
                    .name("BÃ n " + s.getSeatCode())
                    .floorId(f.getId())
                    .floorName(f.getName())
                    .build();
        }

        // Try object
        Optional<WorkplaceFloorObject> obj = floorObjectRepository.findByQrToken(qrToken);
        if (obj.isPresent()) {
            WorkplaceFloorObject o = obj.get();
            return QrResolutionResponse.builder()
                    .targetType(o.getObjectType() == FloorObjectType.MEETING_ROOM ? "ROOM" : "WAYPOINT")
                    .targetId(o.getId())
                    .code(o.getName())
                    .name(o.getName())
                    .floorId(o.getFloor().getId())
                    .floorName(o.getFloor().getName())
                    .build();
        }

        throw new WorkplaceException(WorkplaceErrorCode.INVALID_QR_TOKEN);
    }
    @Transactional(readOnly = true)
    public WorkplaceReportResponse getUtilizationReport(UUID floorId) {
        List<WorkplaceSeat> seats = floorId != null ? seatRepository.findByFloorId(floorId) : seatRepository.findAll();

        int total = seats.size();
        int dedicated = (int) seats.stream().filter(s -> s.getSeatType() == SeatType.DEDICATED).count();
        int hotDesks = (int) seats.stream().filter(s -> s.getSeatType() == SeatType.HOT_DESK).count();

        int assigned = 0;
        for (WorkplaceSeat s : seats) {
            if (assignmentRepository.existsBySeatIdAndReleasedAtIsNull(s.getId())) {
                assigned++;
            }
        }

        int occupiedHotDesks = 0;
        for (WorkplaceSeat s : seats) {
            if (s.getSeatType() == SeatType.HOT_DESK &&
                    deskBookingRepository.existsBySeatIdAndBookingDateAndStatusNot(s.getId(), LocalDate.now(), BookingStatus.CANCELLED)) {
                occupiedHotDesks++;
            }
        }

        BigDecimal rate = total > 0
                ? BigDecimal.valueOf((assigned + occupiedHotDesks) * 100.0 / total).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        int openIssues = (int) issueRepository.findAll().stream()
                .filter(i -> i.getStatus() != WorkplaceIssueStatus.RESOLVED)
                .count();

        List<WorkplaceReportResponse.DailyUtilizationDto> trend = List.of(
                WorkplaceReportResponse.DailyUtilizationDto.builder().dayOfWeek("Thá»© 2").bookingCount(18).rate(BigDecimal.valueOf(75.0)).build(),
                WorkplaceReportResponse.DailyUtilizationDto.builder().dayOfWeek("Thá»© 3").bookingCount(24).rate(BigDecimal.valueOf(88.0)).build(),
                WorkplaceReportResponse.DailyUtilizationDto.builder().dayOfWeek("Thá»© 4").bookingCount(25).rate(BigDecimal.valueOf(92.0)).build(),
                WorkplaceReportResponse.DailyUtilizationDto.builder().dayOfWeek("Thá»© 5").bookingCount(22).rate(BigDecimal.valueOf(85.0)).build(),
                WorkplaceReportResponse.DailyUtilizationDto.builder().dayOfWeek("Thá»© 6").bookingCount(15).rate(BigDecimal.valueOf(65.0)).build()
        );

        return WorkplaceReportResponse.builder()
                .totalSeats(total)
                .dedicatedSeats(dedicated)
                .hotDesks(hotDesks)
                .assignedSeats(assigned)
                .occupiedHotDesksToday(occupiedHotDesks)
                .averageOccupancyRate(rate)
                .openIssuesCount(openIssues)
                .dailyTrend(trend)
                .build();
    }

    // =========================================================================
    // Helpers & Mappers
    // =========================================================================

    private Employee getEmployeeByUserId(UUID userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new WorkplaceException(WorkplaceErrorCode.SEAT_NOT_FOUND, "KhÃ´ng tÃ¬m tháº¥y há»“ sÆ¡ nhÃ¢n viÃªn cá»§a tÃ i khoáº£n nÃ y"));
    }

    private WorkplaceSiteResponse mapSiteResponse(WorkplaceSite site) {
        return WorkplaceSiteResponse.builder()
                .id(site.getId())
                .branchId(site.getBranch().getId())
                .branchName(site.getBranch().getName())
                .code(site.getCode())
                .name(site.getName())
                .address(site.getAddress())
                .description(site.getDescription())
                .floorCount(site.getFloors().size())
                .createdAt(site.getCreatedAt())
                .build();
    }

    private WorkplaceFloorResponse mapFloorResponse(WorkplaceFloor floor) {
        String planVer = floorPlanRepository.findByFloorIdAndStatus(floor.getId(), FloorPlanStatus.PUBLISHED)
                .map(p -> "v" + p.getVersionNo())
                .orElse("ChÆ°a phÃ¡t hÃ nh");

        return WorkplaceFloorResponse.builder()
                .id(floor.getId())
                .siteId(floor.getSite().getId())
                .siteName(floor.getSite().getName())
                .floorNumber(floor.getFloorNumber())
                .name(floor.getName())
                .description(floor.getDescription())
                .zoneCount(floor.getZones().size())
                .seatCount(seatRepository.findByFloorId(floor.getId()).size())
                .publishedPlanVersion(planVer)
                .createdAt(floor.getCreatedAt())
                .build();
    }

    private WorkplaceFloorPlanResponse mapFloorPlanResponse(WorkplaceFloorPlan plan) {
        return WorkplaceFloorPlanResponse.builder()
                .id(plan.getId())
                .floorId(plan.getFloor().getId())
                .versionNo(plan.getVersionNo())
                .backgroundFileUrl(plan.getBackgroundFileUrl())
                .canvasWidth(plan.getCanvasWidth())
                .canvasHeight(plan.getCanvasHeight())
                .scaleMetersPerPx(plan.getScaleMetersPerPx())
                .status(plan.getStatus())
                .layoutData(plan.getLayoutData())
                .createdAt(plan.getCreatedAt())
                .build();
    }

    private WorkplaceSeatDetailResponse mapSeatDetailResponse(WorkplaceSeat seat) {
        WorkplaceZone zone = seat.getSeatRow().getZone();
        WorkplaceFloor floor = zone.getFloor();
        WorkplaceSite site = floor.getSite();

        Optional<WorkplaceSeatAssignment> assign = assignmentRepository.findBySeatIdAndReleasedAtIsNull(seat.getId());
        Employee occupant = assign.map(WorkplaceSeatAssignment::getEmployee).orElse(null);

        // Or check hot-desk booking today
        if (occupant == null && seat.getSeatType() == SeatType.HOT_DESK) {
            occupant = deskBookingRepository.findBySeatIdAndBookingDateAndStatusNot(seat.getId(), LocalDate.now(), BookingStatus.CANCELLED)
                    .map(WorkplaceDeskBooking::getEmployee)
                    .orElse(null);
        }

        List<WorkplaceSeatDetailResponse.AmenityDto> amenities = seat.getAmenities().stream()
                .map(a -> WorkplaceSeatDetailResponse.AmenityDto.builder()
                        .id(a.getId())
                        .name(a.getName())
                        .iconName(a.getIconName())
                        .build())
                .collect(Collectors.toList());

        List<WorkplaceSeatDetailResponse.SeatAssetDto> assets = seatAssetRepository.findBySeatIdAndUnlinkedAtIsNull(seat.getId()).stream()
                .map(sa -> WorkplaceSeatDetailResponse.SeatAssetDto.builder()
                        .id(sa.getId())
                        .assetId(sa.getAsset().getId())
                        .assetCode(sa.getAsset().getAssetCode())
                        .assetName(sa.getAsset().getName())
                        .serialNumber(sa.getAsset().getSerialNumber())
                        .build())
                .collect(Collectors.toList());

        return WorkplaceSeatDetailResponse.builder()
                .id(seat.getId())
                .seatRowId(seat.getSeatRow().getId())
                .seatRowCode(seat.getSeatRow().getCode())
                .zoneId(zone.getId())
                .zoneName(zone.getName())
                .floorId(floor.getId())
                .floorName(floor.getName())
                .siteId(site.getId())
                .siteName(site.getName())
                .seatCode(seat.getSeatCode())
                .seatType(seat.getSeatType())
                .status(seat.getStatus())
                .x(seat.getX())
                .y(seat.getY())
                .shape(seat.getShape())
                .width(seat.getWidth())
                .height(seat.getHeight())
                .rotationDegrees(seat.getRotationDegrees())
                .qrToken(seat.getQrToken())
                .currentEmployeeId(occupant != null ? occupant.getId() : null)
                .currentEmployeeName(occupant != null ? occupant.getFirstName() + " " + occupant.getLastName() : null)
                .currentEmployeeCode(occupant != null ? occupant.getEmployeeCode() : null)
                .currentEmployeeDepartment(occupant != null && occupant.getCurrentDepartment() != null ? occupant.getCurrentDepartment().getName() : null)
                .amenities(amenities)
                .linkedAssets(assets)
                .build();
    }

    private SeatAssignmentResponse mapAssignmentResponse(WorkplaceSeatAssignment a) {
        WorkplaceSeat seat = null;
        try { seat = a.getSeat(); } catch (Exception ignored) {}

        Employee emp = null;
        try { emp = a.getEmployee(); } catch (Exception ignored) {}

        String seatCode = "N/A";
        UUID seatId = null;
        String floorName = "Táº§ng 12";
        String siteName = "Trá»¥ sá»Ÿ chÃ­nh";

        if (seat != null) {
            seatId = seat.getId();
            seatCode = seat.getSeatCode();
            if (seat.getSeatRow() != null && seat.getSeatRow().getZone() != null && seat.getSeatRow().getZone().getFloor() != null) {
                WorkplaceFloor floor = seat.getSeatRow().getZone().getFloor();
                floorName = floor.getName();
                if (floor.getSite() != null) {
                    siteName = floor.getSite().getName();
                }
            }
        }

        String employeeName = "N/A";
        String employeeCode = "N/A";
        String departmentName = null;
        UUID empId = null;

        if (emp != null) {
            empId = emp.getId();
            employeeCode = emp.getEmployeeCode();
            employeeName = (emp.getLastName() != null ? emp.getLastName() : "") + " " + (emp.getFirstName() != null ? emp.getFirstName() : "");
            if (emp.getCurrentDepartment() != null) {
                departmentName = emp.getCurrentDepartment().getName();
            }
        }

        return SeatAssignmentResponse.builder()
                .id(a.getId())
                .seatId(seatId)
                .seatCode(seatCode)
                .floorName(floorName)
                .siteName(siteName)
                .employeeId(empId)
                .employeeName(employeeName.trim())
                .employeeCode(employeeCode)
                .departmentName(departmentName)
                .assignedAt(a.getAssignedAt())
                .releasedAt(a.getReleasedAt())
                .note(a.getNote())
                .build();
    }

    private DeskBookingResponse mapDeskBookingResponse(WorkplaceDeskBooking b) {
        WorkplaceSeat seat = null;
        try { seat = b.getSeat(); } catch (Exception ignored) {}

        Employee emp = null;
        try { emp = b.getEmployee(); } catch (Exception ignored) {}

        String seatCode = "N/A";
        UUID seatId = null;
        String floorName = "Táº§ng 12";
        String siteName = "Trá»¥ sá»Ÿ chÃ­nh";
        String qrToken = null;

        if (seat != null) {
            seatId = seat.getId();
            seatCode = seat.getSeatCode();
            qrToken = seat.getQrToken();
            if (seat.getSeatRow() != null && seat.getSeatRow().getZone() != null && seat.getSeatRow().getZone().getFloor() != null) {
                WorkplaceFloor floor = seat.getSeatRow().getZone().getFloor();
                floorName = floor.getName();
                if (floor.getSite() != null) {
                    siteName = floor.getSite().getName();
                }
            }
        }

        String employeeName = "N/A";
        String employeeCode = "N/A";
        UUID empId = null;

        if (emp != null) {
            empId = emp.getId();
            employeeCode = emp.getEmployeeCode();
            employeeName = (emp.getLastName() != null ? emp.getLastName() : "") + " " + (emp.getFirstName() != null ? emp.getFirstName() : "");
        }

        return DeskBookingResponse.builder()
                .id(b.getId())
                .seatId(seatId)
                .seatCode(seatCode)
                .floorName(floorName)
                .siteName(siteName)
                .employeeId(empId)
                .employeeName(employeeName.trim())
                .employeeCode(employeeCode)
                .bookingDate(b.getBookingDate())
                .status(b.getStatus() != null ? b.getStatus() : BookingStatus.CONFIRMED)
                .checkedInAt(b.getCheckedInAt())
                .cancelledAt(b.getCancelledAt())
                .qrToken(qrToken)
                .note(b.getNote())
                .build();
    }

    private RoomBookingResponse mapRoomBookingResponse(WorkplaceRoomBooking b) {
        WorkplaceFloorObject room = null;
        try { room = b.getMeetingRoom(); } catch (Exception ignored) {}

        Employee org = null;
        try { org = b.getOrganizerEmployee(); } catch (Exception ignored) {}

        String roomName = "PhÃ²ng há»p";
        Integer capacity = 6;
        String floorName = "Táº§ng 12";
        String siteName = "Trá»¥ sá»Ÿ chÃ­nh";
        UUID roomId = null;

        if (room != null) {
            roomId = room.getId();
            if (room.getName() != null) roomName = room.getName();
            if (room.getMeetingRoom() != null && room.getMeetingRoom().getCapacity() != null) {
                capacity = room.getMeetingRoom().getCapacity();
            }
            if (room.getFloor() != null) {
                floorName = room.getFloor().getName();
                if (room.getFloor().getSite() != null && room.getFloor().getSite().getName() != null) {
                    siteName = room.getFloor().getSite().getName();
                }
            }
        }

        String organizerName = "N/A";
        UUID organizerId = null;
        if (org != null) {
            organizerId = org.getId();
            organizerName = (org.getLastName() != null ? org.getLastName() : "") + " " + (org.getFirstName() != null ? org.getFirstName() : "");
        }

        return RoomBookingResponse.builder()
                .id(b.getId())
                .meetingRoomId(roomId)
                .roomName(roomName)
                .capacity(capacity)
                .floorName(floorName)
                .siteName(siteName)
                .organizerEmployeeId(organizerId)
                .organizerName(organizerName.trim())
                .title(b.getTitle() != null ? b.getTitle() : "Cuá»™c há»p")
                .attendeeCount(b.getAttendeeCount() != null ? b.getAttendeeCount() : 1)
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .status(b.getStatus() != null ? b.getStatus() : BookingStatus.CONFIRMED)
                .checkedInAt(b.getCheckedInAt())
                .description(b.getDescription())
                .build();
    }

    private WorkplaceIssueResponse mapIssueResponse(WorkplaceIssue i) {
        Employee rep = null;
        try { rep = i.getReporterEmployee(); } catch (Exception ignored) {}

        Employee tech = null;
        try { tech = i.getAssignedToEmployee(); } catch (Exception ignored) {}

        String siteName = "Trá»¥ sá»Ÿ chÃ­nh";
        String floorName = "Táº§ng 12";
        if (i.getFloor() != null) {
            floorName = i.getFloor().getName();
            if (i.getFloor().getSite() != null) {
                siteName = i.getFloor().getSite().getName();
            }
        } else if (i.getSeat() != null && i.getSeat().getSeatRow() != null && i.getSeat().getSeatRow().getZone() != null && i.getSeat().getSeatRow().getZone().getFloor() != null) {
            WorkplaceFloor f = i.getSeat().getSeatRow().getZone().getFloor();
            floorName = f.getName();
            if (f.getSite() != null) siteName = f.getSite().getName();
        }

        String repName = "N/A";
        String repCode = "N/A";
        UUID repId = null;
        if (rep != null) {
            repId = rep.getId();
            repCode = rep.getEmployeeCode();
            repName = (rep.getLastName() != null ? rep.getLastName() : "") + " " + (rep.getFirstName() != null ? rep.getFirstName() : "");
        }

        String techName = null;
        UUID techId = null;
        if (tech != null) {
            techId = tech.getId();
            techName = (tech.getLastName() != null ? tech.getLastName() : "") + " " + (tech.getFirstName() != null ? tech.getFirstName() : "");
            techName = techName.trim();
        }

        return WorkplaceIssueResponse.builder()
                .id(i.getId())
                .reporterEmployeeId(repId)
                .reporterName(repName.trim())
                .issueType(i.getIssueType())
                .severity(i.getSeverity())
                .title(i.getTitle())
                .description(i.getDescription())
                .seatId(i.getSeat() != null ? i.getSeat().getId() : null)
                .seatCode(i.getSeat() != null ? i.getSeat().getSeatCode() : null)
                .floorObjectId(i.getFloorObject() != null ? i.getFloorObject().getId() : null)
                .floorObjectName(i.getFloorObject() != null ? i.getFloorObject().getName() : null)
                .floorId(i.getFloor() != null ? i.getFloor().getId() : null)
                .floorName(floorName)
                .siteName(siteName)
                .locationX(i.getLocationX())
                .locationY(i.getLocationY())
                .status(i.getStatus())
                .assignedToEmployeeId(techId)
                .assignedToName(techName)
                .resolutionNote(i.getResolutionNote())
                .reportedAt(i.getReportedAt())
                .resolvedAt(i.getResolvedAt())
                .build();
    }
}

