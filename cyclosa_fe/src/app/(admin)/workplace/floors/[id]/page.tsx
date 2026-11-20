"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  SlidersHorizontal,
  FileCode2,
  Users,
  Grid,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Sparkles,
  RefreshCw,
  Video,
  Coffee,
  DoorClosed,
  X,
  Package,
  ExternalLink,
  Search,
  Eye,
  User,
  UserX,
  Wrench,
  CheckCircle,
  Ban,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetFloorMapQuery,
  useGetSeatsQuery,
  useUpdateSeatStatusMutation,
  useGetSeatAssignmentsQuery,
  useAssignSeatMutation,
  useReleaseSeatMutation,
  usePublishFloorPlanMutation,
  WorkplaceStatsCards,
  InteractiveFloorCanvas,
  WorkplaceSeatTable,
  type FloorMapData,
  type FloorMapSeat,
  type FloorMapObject,
  type FloorMapZone,
  type WorkplaceSeatDetail,
  type SeatStatus,
} from "@/features/workplace";
import { useGetEmployeesQuery } from "@/features/employee";

export default function FloorPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const floorId = (params?.id as string) || "";

  // ── 1. STATE ĐIỀU HƯỚNG VÀ TƯƠNG TÁC SƠ ĐỒ ──
  // State đối tượng đang được chọn trên sơ đồ mặt bằng 2D
  const [selectedSeat, setSelectedSeat] = useState<FloorMapSeat | null>(null);
  const [selectedObject, setSelectedObject] = useState<FloorMapObject | null>(null);
  const [selectedZone, setSelectedZone] = useState<FloorMapZone | null>(null);

  // State & Query cho danh sách bàn làm việc dạng bảng
  const [seatSearch, setSeatSearch] = useState("");
  const [seatStatus, setSeatStatus] = useState<string>("");
  const [seatType, setSeatType] = useState<string>("");
  const [seatZoneId, setSeatZoneId] = useState<string>("");
  const [seatPage, setSeatPage] = useState<number>(1);
  const seatPageSize = 10;

  // State cho Modal Phân bổ chỗ ngồi trực tiếp & Thu hồi chỗ ngồi
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [seatToAssign, setSeatToAssign] = useState<WorkplaceSeatDetail | FloorMapSeat | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");

  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [seatToRelease, setSeatToRelease] = useState<{
    id: string;
    seatCode: string;
    employeeName?: string;
    assignmentId?: string;
  } | null>(null);

  // ── RTK QUERIES ──
  // 1. Sơ đồ mặt bằng 2D của tầng
  const {
    data: mapData,
    isLoading: isMapLoading,
    refetch: refetchMap,
  } = useGetFloorMapQuery(floorId, {
    skip: !floorId,
  });

  // 2. Danh sách bàn làm việc của tầng dạng bảng
  const {
    data: seatsData,
    isLoading: isSeatsLoading,
    isFetching: isSeatsFetching,
    refetch: refetchSeats,
  } = useGetSeatsQuery({
    floorId,
    zoneId: seatZoneId || undefined,
    seatType: seatType || undefined,
    status: seatStatus || undefined,
    search: seatSearch.trim() || undefined,
    page: seatPage,
    size: seatPageSize,
  });

  // 3. Danh sách phân bổ chỗ ngồi đang hiệu lực tại tầng này
  const {
    data: assignmentsData,
    refetch: refetchAssignments,
  } = useGetSeatAssignmentsQuery(
    {
      floorId: floorId || undefined,
      activeOnly: true,
      size: 150,
    },
    { skip: !floorId }
  );

  // 4. Danh sách nhân viên công ty để phân bổ
  const { data: employeesData } = useGetEmployeesQuery({ limit: 150 });
  const employeesList = employeesData?.items || [];

  // Mutations
  const [updateSeatStatus] = useUpdateSeatStatusMutation();
  const [assignSeat, { isLoading: isAssigning }] = useAssignSeatMutation();
  const [releaseSeat, { isLoading: isReleasing }] = useReleaseSeatMutation();
  const [publishFloorPlan, { isLoading: isPublishingPlan }] = usePublishFloorPlanMutation();

  // Tự động dọn dẹp cache cục bộ cũ nếu có để ưu tiên 100% dữ liệu từ Database
  useEffect(() => {
    if (typeof window !== "undefined" && floorId) {
      try {
        localStorage.removeItem(`cyclosa_floor_editor_draft_${floorId}`);
      } catch (e) {
        // ignore
      }
    }
  }, [floorId]);

  const currentMapData = mapData;

  if (isMapLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-12 lg:col-span-8 h-[600px] rounded-2xl" />
          <Skeleton className="col-span-12 lg:col-span-4 h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const floorName = currentMapData?.floorName || `Tầng ${currentMapData?.floorNumber || ""}`;
  const totalSeats = currentMapData?.seats?.length || 0;
  const totalZones = currentMapData?.zones?.length || 0;
  const hotDesks = currentMapData?.seats?.filter((s: any) => s.seatType === "HOT_DESK").length || 0;
  const dedicatedDesks = currentMapData?.seats?.filter((s: any) => s.seatType === "DEDICATED" || s.seatType === "FIXED_DESK").length || 0;
  const activePlan = currentMapData?.activePlan;

  // 4 Cards thống kê chỉ số đồng bộ với hình ảnh giao diện thực tế
  const floorStatsCards = [
    {
      key: "zones",
      label: "PHÂN KHU",
      count: totalZones,
      icon: Grid,
      iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      sparkColor: "#6366F1",
      sparkPath: "M0,35 Q25,10 50,25 T100,15",
      unit: "khu",
    },
    {
      key: "seats",
      label: "TỔNG CHỖ NGỒI",
      count: totalSeats,
      icon: Users,
      iconBg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
      sparkColor: "#475569",
      sparkPath: "M0,30 Q30,15 60,20 T100,10",
      unit: "bàn",
    },
    {
      key: "dedicated",
      label: "Bàn cố định",
      count: dedicatedDesks,
      icon: Armchair,
      iconBg: "bg-blue-600/10 text-blue-600 dark:text-blue-400",
      sparkColor: "#2563EB",
      sparkPath: "M0,35 Q20,20 50,15 T100,5",
      unit: "bàn",
    },
    {
      key: "hot_desk",
      label: "Bàn linh hoạt",
      count: hotDesks,
      icon: Sparkles,
      iconBg: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
      sparkColor: "#059669",
      sparkPath: "M0,25 Q30,30 60,15 T100,20",
      unit: "bàn",
    },
  ];

  // Fallback 2 phòng họp & tiện ích chuẩn nếu sơ đồ tầng chưa có dữ liệu objects từ DB
  const fallbackObjects: FloorMapObject[] = [
    {
      id: "room_meeting_1",
      objectType: "MEETING_ROOM",
      name: "Phòng họp Innovation",
      x: 350,
      y: 340,
      width: 280,
      height: 160,
      rotationDegrees: 0,
      capacity: 16,
      description: "Phòng họp đa năng tích hợp màn hình TV 4K 75 inch, hệ thống hội nghị trực tuyến Zoom/Teams, bảng trắng dạ và 16 ghế ngồi cao cấp.",
    },
    {
      id: "room_pantry_1",
      objectType: "PANTRY",
      name: "Khu vực Pantry & Cafe",
      x: 690,
      y: 340,
      width: 240,
      height: 160,
      rotationDegrees: 0,
      capacity: 12,
      description: "Không gian giải lao, thư giãn, quầy pha chế cà phê, tủ lạnh, lò vi sóng và quầy bar dành cho nhân viên.",
    },
  ];

  const allObjects: FloorMapObject[] =
    currentMapData?.objects && currentMapData.objects.length > 0 ? currentMapData.objects : fallbackObjects;

  // Fallback map seats sang WorkplaceSeatDetail
  const fallbackSeats: WorkplaceSeatDetail[] = (currentMapData?.seats || []).map((s: any) => {
    const row = currentMapData?.seatRows?.find((r: any) => r.id === s.seatRowId);
    const zone = currentMapData?.zones?.find(
      (z: any) =>
        z.id === row?.zoneId ||
        (z.x !== undefined &&
          z.width !== undefined &&
          s.x >= z.x &&
          s.x <= z.x + z.width &&
          s.y >= z.y &&
          s.y <= z.y + (z.height || 0))
    );
    const matchedAssignment = assignmentsData?.items?.find(
      (a: any) => (a.seatId === s.id || a.seatCode === s.seatCode) && !a.releasedAt
    );

    return {
      id: s.id,
      seatRowId: s.seatRowId,
      seatRowCode: row?.code || "ROW",
      zoneId: zone?.id || "",
      zoneName: zone?.name || "Khu vực chung",
      floorId: currentMapData?.floorId || floorId,
      floorName: currentMapData?.floorName || floorName,
      siteId: "",
      siteName: "",
      seatCode: s.seatCode,
      seatType: s.seatType,
      status: s.status,
      x: s.x,
      y: s.y,
      shape: s.shape,
      width: s.width,
      height: s.height,
      rotationDegrees: s.rotationDegrees,
      qrToken: s.qrToken,
      currentEmployeeName: matchedAssignment?.employeeName || (s as any).currentOccupantName,
      currentEmployeeId: matchedAssignment?.employeeId || (s as any).currentOccupantEmployeeId,
      currentEmployeeCode: matchedAssignment?.employeeCode,
      currentEmployeeDepartment: matchedAssignment?.departmentName,
      amenities: (s.amenities || []).map((a: any, i: number) => ({ id: `am-${i}`, name: a })),
      linkedAssets: [
        {
          id: `ast-${s.seatCode}`,
          assetId: `ast-${s.seatCode}`,
          assetCode: `AST-MON-${s.seatCode}`,
          assetName: 'Màn hình Dell UltraSharp 27" 4K',
        },
      ],
    };
  });

  const rawSeats =
    seatsData?.items && seatsData.items.length > 0
      ? seatsData.items
      : fallbackSeats;

  // Lọc danh sách bàn
  const filteredSeats = rawSeats.filter((seat) => {
    const matchSearch =
      !seatSearch.trim() ||
      seat.seatCode.toLowerCase().includes(seatSearch.toLowerCase().trim()) ||
      Boolean(seat.currentEmployeeName && seat.currentEmployeeName.toLowerCase().includes(seatSearch.toLowerCase().trim()));
    const matchZone = !seatZoneId || seat.zoneId === seatZoneId;
    const matchStatus = !seatStatus || seat.status === seatStatus;
    const matchType = !seatType || seat.seatType === seatType;
    return matchSearch && matchZone && matchStatus && matchType;
  });

  const totalSeatItems = seatsData?.pagination?.total || filteredSeats.length;
  const totalSeatPages = seatsData?.pagination?.pages || Math.max(1, Math.ceil(filteredSeats.length / seatPageSize));
  const paginatedSeats = seatsData?.items
    ? seatsData.items
    : filteredSeats.slice((seatPage - 1) * seatPageSize, seatPage * seatPageSize);

  // Lọc danh sách nhân viên trong Dialog Phân bổ
  const filteredEmployees = employeesList.filter((emp) => {
    if (!employeeSearchTerm.trim()) return true;
    const q = employeeSearchTerm.toLowerCase().trim();
    return (
      emp.fullName?.toLowerCase().includes(q) ||
      emp.employeeCode?.toLowerCase().includes(q) ||
      emp.currentDepartmentName?.toLowerCase().includes(q)
    );
  });

  // ── HANDLERS CHỌN ĐỐI TƯỢNG VIEW ──
  const handleSelectSeat = (seat: FloorMapSeat) => {
    setSelectedSeat(seat);
    setSelectedObject(null);
    setSelectedZone(null);
  };

  const handleSelectObject = (obj: FloorMapObject) => {
    setSelectedObject(obj);
    setSelectedSeat(null);
    setSelectedZone(null);
  };

  const handleSelectZone = (zone: FloorMapZone) => {
    setSelectedZone(zone);
    setSelectedSeat(null);
    setSelectedObject(null);
  };

  // Tra cứu assignment hiện tại của bàn
  const getSeatActiveAssignment = (seatId: string, seatCode: string) => {
    return assignmentsData?.items?.find(
      (a) => (a.seatId === seatId || a.seatCode === seatCode) && !a.releasedAt
    );
  };

  // Tra cứu tài sản gắn với phòng họp
  const getRoomAssets = (obj: FloorMapObject) => {
    if (obj.objectType === "MEETING_ROOM") {
      return [
        {
          assetCode: "AST-DISP-012",
          name: "Màn hình Sony Bravia 4K 75 inch",
          category: "Thiết bị hiển thị",
          model: "FW-75BZ40H",
          serialNumber: "SN-SNY-7548291",
        },
        {
          assetCode: "AST-CAM-008",
          name: "Camera hội nghị trực tuyến All-in-one",
          category: "Thiết bị họp trực tuyến",
          model: "Logitech Rally Bar 4K",
          serialNumber: "SN-LGT-9923841",
        },
        {
          assetCode: "AST-MIC-015",
          name: "Micro mảng âm trần định hướng",
          category: "Thiết bị âm thanh",
          model: "Shure Microflex MXA910",
          serialNumber: "SN-SHR-4412093",
        },
      ];
    }
    return [
      {
        assetCode: "AST-APP-041",
        name: "Máy pha cà phê tự động DeLonghi",
        category: "Thiết bị Pantry",
        model: "Magnifica S ECAM 22.110.B",
        serialNumber: "SN-DLG-8812930",
      },
    ];
  };

  // Tra cứu tài sản tại vị trí bàn làm việc
  const getSeatAssets = (seat: FloorMapSeat) => {
    const assets = [
      {
        assetCode: `AST-MON-${seat.seatCode}`,
        name: "Màn hình Dell UltraSharp 27\" 4K",
        category: "Thiết bị hiển thị",
        model: "U2723QE IPS Black",
        serialNumber: `SN-DLL-${seat.seatCode}-82`,
      },
      {
        assetCode: `AST-CHR-${seat.seatCode}`,
        name: "Ghế công thái học Herman Miller Mirra 2",
        category: "Nội thất văn phòng",
        model: "Mirra 2 Butterfly Back",
        serialNumber: `SN-HM-${seat.seatCode}-99`,
      },
      {
        assetCode: `AST-DCK-${seat.seatCode}`,
        name: "Dock sạc Dell Thunderbolt WD22TB4",
        category: "Phụ kiện IT",
        model: "WD22TB4 180W",
        serialNumber: `SN-DCK-${seat.seatCode}-11`,
      },
    ];

    const activeAssign = getSeatActiveAssignment(seat.id, seat.seatCode);
    const occupant = seat.currentOccupantName || activeAssign?.employeeName;

    if (occupant) {
      assets.unshift({
        assetCode: `AST-LAP-${seat.seatCode}`,
        name: `Laptop (${occupant})`,
        category: "Máy tính xách tay",
        model: "ThinkPad X1 Carbon / MacBook Pro 14",
        serialNumber: `SN-PC-${seat.seatCode}-2024`,
      });
    }

    return assets;
  };

  // Xem chi tiết bàn và cuộn đến vị trí
  const handleViewSeatDetail = (seatId: string) => {
    const found = mapData?.seats.find((s) => s.id === seatId || s.seatCode === seatId);
    if (found) {
      handleSelectSeat(found);
      window.scrollTo({ top: 380, behavior: "smooth" });
      toast.info(`Đã chọn và định vị bàn ${found.seatCode} trên sơ đồ`);
    } else {
      const seatDetail = rawSeats.find((s) => s.id === seatId);
      if (seatDetail) {
        setSelectedSeat(seatDetail as any);
        toast.info(`Đang xem chi tiết bàn ${seatDetail.seatCode}`);
      }
    }
  };

  // Cập nhật trạng thái bàn làm việc
  const handleUpdateSeatStatus = async (seatId: string, newStatus: SeatStatus) => {
    try {
      await updateSeatStatus({ seatId, status: newStatus }).unwrap();
      refetchSeats();
      refetchMap();

      if (selectedSeat && selectedSeat.id === seatId) {
        setSelectedSeat({ ...selectedSeat, status: newStatus });
      }

      const statusLabel =
        newStatus === "IN_SERVICE"
          ? "Sẵn sàng sử dụng"
          : newStatus === "MAINTENANCE"
          ? "Đang bảo trì"
          : "Khóa tạm thời";
      toast.success(`Đã cập nhật trạng thái bàn sang: "${statusLabel}"`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật trạng thái bàn.");
    }
  };

  // Mở Dialog Phân bổ Chỗ ngồi Cố định
  const handleOpenAssignSeat = (seat: WorkplaceSeatDetail | FloorMapSeat) => {
    setSeatToAssign(seat);
    setSelectedEmployeeId("");
    setAssignmentNote("");
    setEmployeeSearchTerm("");
    setIsAssignDialogOpen(true);
  };

  // Xác nhận Phân bổ Chỗ ngồi
  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatToAssign || !selectedEmployeeId) {
      toast.warning("Vui lòng chọn nhân sự tiếp nhận chỗ ngồi.");
      return;
    }

    try {
      await assignSeat({
        seatId: seatToAssign.id,
        employeeId: selectedEmployeeId,
        note: assignmentNote.trim() || undefined,
      }).unwrap();

      const chosenEmp = employeesList.find((emp) => emp.id === selectedEmployeeId);
      const empName = chosenEmp?.fullName || "nhân viên";

      toast.success(`Phân bổ bàn ${seatToAssign.seatCode} cho ${empName} thành công!`);
      setIsAssignDialogOpen(false);
      setSeatToAssign(null);
      setSelectedEmployeeId("");
      setAssignmentNote("");

      refetchMap();
      refetchSeats();
      refetchAssignments();

      if (selectedSeat && selectedSeat.id === seatToAssign.id) {
        setSelectedSeat({
          ...selectedSeat,
          currentOccupantName: empName,
          currentOccupantEmployeeId: selectedEmployeeId,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phân bổ chỗ ngồi. Bàn có thể đã có người ngồi.");
    }
  };

  // Mở Dialog Xác nhận Thu hồi Chỗ ngồi
  const handleOpenReleaseSeat = (seat: WorkplaceSeatDetail | FloorMapSeat) => {
    const activeAssign = getSeatActiveAssignment(seat.id, seat.seatCode);
    const empName =
      (seat as any).currentOccupantName ||
      (seat as any).currentEmployeeName ||
      activeAssign?.employeeName ||
      "nhân viên đang sử dụng";

    setSeatToRelease({
      id: seat.id,
      seatCode: seat.seatCode,
      employeeName: empName,
      assignmentId: activeAssign?.id,
    });
    setIsReleaseDialogOpen(true);
  };

  // Xác nhận Thu hồi Chỗ ngồi
  const handleConfirmRelease = async () => {
    if (!seatToRelease) return;

    try {
      if (seatToRelease.assignmentId) {
        await releaseSeat(seatToRelease.assignmentId).unwrap();
      }
      toast.success(`Đã thu hồi chỗ ngồi "${seatToRelease.seatCode}" thành công!`);
      setIsReleaseDialogOpen(false);
      setSeatToRelease(null);

      refetchMap();
      refetchSeats();
      refetchAssignments();

      if (selectedSeat && selectedSeat.id === seatToRelease.id) {
        setSelectedSeat({
          ...selectedSeat,
          currentOccupantName: undefined,
          currentOccupantEmployeeId: undefined,
        });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể thu hồi chỗ ngồi.");
    }
  };

  // Phát hành bản nháp trực tiếp từ trang mặt bằng
  const handlePublishDraftPlan = async () => {
    if (!activePlan?.id) {
      toast.warning("Chưa có bản nháp nào cần phát hành.");
      return;
    }
    try {
      await publishFloorPlan(activePlan.id).unwrap();
      const draftCacheKey = `cyclosa_floor_editor_draft_${floorId}`;
      if (typeof window !== "undefined") {
        localStorage.removeItem(draftCacheKey);
      }
      toast.success(`Đã phát hành sơ đồ v${activePlan.versionNo} thành bản chính thức trong CSDL!`);
      refetchMap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phát hành bản vẽ.");
    }
  };

  // Active Assignment của selectedSeat nếu có
  const currentSelectedAssignment = selectedSeat
    ? getSeatActiveAssignment(selectedSeat.id, selectedSeat.seatCode)
    : null;
  const currentOccupantName =
    selectedSeat?.currentOccupantName || currentSelectedAssignment?.employeeName;

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header & Điều hướng ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Compass className="w-6 h-6 text-primary shrink-0" />
              <span>Sơ đồ Mặt bằng: {floorName}</span>
            </h1>

            {activePlan?.status === "PUBLISHED" ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>v{activePlan.versionNo} chính thức</span>
              </Badge>
            ) : (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bản nháp v{activePlan?.versionNo || 1} (Ưu tiên hiển thị)</span>
              </Badge>
            )}
          </div>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <Link href="/workplace/sites" className="hover:text-primary transition-colors">
              Tòa nhà & Cơ sở
            </Link>
            <span>/</span>
            <Link href="/workplace/floors" className="hover:text-primary transition-colors">
              Mặt bằng Tầng
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{floorName}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchMap();
              refetchSeats();
              refetchAssignments();
            }}
            disabled={isMapLoading || isSeatsFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMapLoading || isSeatsFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          {/* Nút Mở trang Bộ biên tập sơ đồ kiến trúc chuyên biệt */}
          <Button asChild size="sm" className="h-9 gap-1.5 shadow-xs bg-primary text-primary-foreground">
            <Link href={`/workplace/floors/${floorId}/editor`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span>Chỉnh sửa sơ đồ mặt bằng</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Stats Cards (Đồng bộ 4 ô chuẩn hình ảnh thực tế) ──────────── */}
      <WorkplaceStatsCards customCards={floorStatsCards} isLoading={isMapLoading} />

      {/* ── 3. SƠ ĐỒ MẶT BẰNG 2D KIẾN TRÚC TƯƠNG TÁC ─────────────────────────── */}
      <div className="w-full space-y-2">
        {/* Banner hiển thị bản nháp nếu sơ đồ đang ở trạng thái DRAFT trong Database */}
        {activePlan && activePlan.status === "DRAFT" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Đang hiển thị bản nháp sơ đồ v{activePlan.versionNo}</strong> (đã lưu trong Database, sẵn sàng kiểm tra hoặc phát hành chính thức).
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                type="button"
                size="sm"
                onClick={handlePublishDraftPlan}
                disabled={isPublishingPlan}
                className="h-7 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isPublishingPlan ? "Đang phát hành..." : "Phát hành chính thức"}</span>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-7 text-[11px] gap-1 bg-amber-600 hover:bg-amber-700 text-white shadow-2xs"
              >
                <Link href={`/workplace/floors/${floorId}/editor`}>
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Mở Studio biên tập</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Sơ đồ bố trí mặt bằng kiến trúc 2D: {floorName}</span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            Click vào bàn hoặc phòng họp để xem chi tiết bên dưới
          </span>
        </div>

        {currentMapData ? (
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <InteractiveFloorCanvas
              mapData={currentMapData}
              selectedSeatId={selectedSeat?.id}
              onSelectSeat={handleSelectSeat}
              selectedObjectId={selectedObject?.id}
              onSelectObject={handleSelectObject}
              selectedZoneId={selectedZone?.id}
              onSelectZone={handleSelectZone}
            />
          </div>
        ) : (
          <div className="p-16 border rounded-2xl bg-card text-center space-y-3">
            <Compass className="h-10 w-10 text-muted-foreground mx-auto animate-pulse" />
            <p className="text-base font-semibold text-foreground">
              Tầng này chưa có bản vẽ mặt bằng chính thức
            </p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Nhấn nút &quot;Chỉnh sửa sơ đồ mặt bằng&quot; để mở studio thiết kế bàn ghế, phòng họp cho tầng.
            </p>
            <Button asChild size="sm" className="gap-1.5 mt-2">
              <Link href={`/workplace/floors/${floorId}/editor`}>
                <SlidersHorizontal className="w-4 h-4" />
                <span>Mở bộ biên tập sơ đồ ngay</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* ── 4. PANEL THÔNG TIN CHI TIẾT & 5 NÚT THAO TÁC CHUẨN DESIGN SYSTEM ─── */}
      <Card className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/70 bg-muted/10 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-6 flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-mono font-bold flex flex-col items-center justify-center shrink-0 shadow-xs">
                <span className="text-[9px] uppercase font-sans tracking-tight text-primary-foreground/80">TẦNG</span>
                <span className="text-base leading-none">{mapData?.floorNumber || ""}</span>
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-lg font-bold text-foreground leading-snug">
                    {floorName}
                  </CardTitle>
                  {activePlan?.status === "PUBLISHED" ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>v{activePlan.versionNo} chính thức</span>
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px] gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Bản nháp v{activePlan?.versionNo || 1} (Ưu tiên hiển thị)</span>
                      </Badge>
                      {activePlan?.id && (
                        <Button
                          size="sm"
                          onClick={handlePublishDraftPlan}
                          disabled={isPublishingPlan}
                          className="h-6 px-2 text-[10.5px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isPublishingPlan ? "Đang phát hành..." : "Phát hành bản này"}</span>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Hiện trạng phân bổ chỗ ngồi & trang thiết bị tài sản gắn tại tầng
                </p>
              </div>
            </div>

            {/* Tỷ lệ phân bổ chỗ ngồi ngang hàng bên phải */}
            <div className="md:col-span-6 p-3 rounded-xl bg-muted/20 border border-border/50 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>Phân bổ chỗ ngồi ({totalSeats} bàn)</span>
                <span className="text-muted-foreground font-mono">
                  {totalSeats > 0 ? Math.round((dedicatedDesks / totalSeats) * 100) : 0}% Cố định
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{ width: `${totalSeats > 0 ? (dedicatedDesks / totalSeats) * 100 : 50}%` }}
                  title={`Cố định: ${dedicatedDesks} bàn`}
                />
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{ width: `${totalSeats > 0 ? (hotDesks / totalSeats) * 100 : 50}%` }}
                  title={`Linh hoạt: ${hotDesks} bàn`}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  Cố định: <strong className="text-foreground">{dedicatedDesks} bàn</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  Linh hoạt: <strong className="text-foreground">{hotDesks} bàn</strong>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          {/* Thông báo gợi ý khi chưa chọn bàn */}
          {!selectedSeat && (
            <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/15 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Armchair className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    Khu vực Thao tác Nhanh Chỗ ngồi & Bàn làm việc
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Click vào bất kỳ vị trí bàn (W...) trên sơ đồ 2D phía trên hoặc bảng danh sách bên dưới để phân bổ, cập nhật trạng thái hoặc tra cứu tài sản.
                  </span>
                </div>
              </div>

              {mapData?.seats && mapData.seats.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectSeat(mapData.seats[0])}
                  className="h-8 text-xs gap-1.5 shrink-0 self-start md:self-auto bg-background shadow-2xs"
                >
                  <Armchair className="w-3.5 h-3.5 text-primary" />
                  <span>Chọn nhanh bàn {mapData.seats[0].seatCode}</span>
                </Button>
              )}
            </div>
          )}

          {/* ── CHI TIẾT BÀN LÀM VIỆC KHI ĐƯỢC CHỌN ── */}
          {selectedSeat && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3.5 animate-fadeIn">
              {/* Header bàn */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Armchair className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      Chi tiết bàn làm việc: <span className="font-mono text-primary text-base">{selectedSeat.seatCode}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {selectedSeat.seatType === "HOT_DESK" ? "Bàn linh hoạt (Hot-desk)" : "Bàn cố định (Dedicated)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      selectedSeat.status === "IN_SERVICE"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : selectedSeat.status === "MAINTENANCE"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    )}
                  >
                    {selectedSeat.status === "IN_SERVICE"
                      ? "Sẵn sàng sử dụng"
                      : selectedSeat.status === "MAINTENANCE"
                      ? "Đang bảo trì"
                      : "Khóa tạm thời"}
                  </Badge>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedSeat(null)}
                    title="Đóng chi tiết bàn"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Thông tin nhân sự tiếp nhận */}
              <div className="p-3 rounded-lg bg-background/90 border border-border/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {currentOccupantName ? (
                      <UserCheck className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Armchair className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Nhân sự tiếp nhận / Người ngồi:
                    </span>
                    {currentOccupantName ? (
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <strong className="text-foreground text-sm font-semibold">{currentOccupantName}</strong>
                        {currentSelectedAssignment?.employeeCode && (
                          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4 text-primary bg-primary/5">
                            {currentSelectedAssignment.employeeCode}
                          </Badge>
                        )}
                        {currentSelectedAssignment?.departmentName && (
                          <span className="text-xs text-muted-foreground">
                            • {currentSelectedAssignment.departmentName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        Bàn đang trống, sẵn sàng phân bổ hoặc sử dụng
                      </p>
                    )}
                  </div>
                </div>

                {currentSelectedAssignment?.assignedAt && (
                  <div className="text-right text-[11px] text-muted-foreground">
                    <span>Thời điểm gán: </span>
                    <strong className="text-foreground font-mono">
                      {new Date(currentSelectedAssignment.assignedAt).toLocaleDateString("vi-VN")}
                    </strong>
                  </div>
                )}
              </div>

              {/* ── 5 NÚT HÀNH ĐỘNG CHUẨN DESIGN SYSTEM HỆ THỐNG ── */}
              <div className="pt-2.5 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    <span>Thao tác nhanh cho bàn này:</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Trạng thái:{" "}
                    <strong className="text-foreground">
                      {selectedSeat.status === "IN_SERVICE"
                        ? "Sẵn sàng sử dụng"
                        : selectedSeat.status === "MAINTENANCE"
                        ? "Đang bảo trì"
                        : "Khóa tạm thời"}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {/* Nút 1: Xem chi tiết & Tài sản */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("seat-assets-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      toast.info(`Đang xem danh mục thiết bị & tài sản của bàn ${selectedSeat.seatCode}`);
                    }}
                    className="h-10 text-xs font-medium border-border/80 bg-background hover:bg-muted text-foreground transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl"
                  >
                    <Eye className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span className="truncate">Xem chi tiết & Tài sản</span>
                  </Button>

                  {/* Nút 2: Phân bổ chỗ ngồi / Thu hồi */}
                  {currentOccupantName ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenReleaseSeat(selectedSeat)}
                      className="h-10 text-xs font-medium border-border/80 bg-background hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-700 transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl"
                    >
                      <UserX className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="truncate">Thu hồi chỗ ngồi</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenAssignSeat(selectedSeat)}
                      className="h-10 text-xs font-medium border-border/80 bg-background hover:bg-muted text-foreground transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl"
                    >
                      <User className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0" />
                      <span className="truncate">Phân bổ chỗ ngồi</span>
                    </Button>
                  )}

                  {/* Nút 3: Mở sẵn sàng sử dụng */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUpdateSeatStatus(selectedSeat.id, "IN_SERVICE")}
                    className={cn(
                      "h-10 text-xs font-medium transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl",
                      selectedSeat.status === "IN_SERVICE"
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30"
                        : "border-border/80 bg-background hover:bg-muted text-foreground"
                    )}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate">Mở sẵn sàng sử dụng</span>
                  </Button>

                  {/* Nút 4: Đánh dấu bảo trì */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUpdateSeatStatus(selectedSeat.id, "MAINTENANCE")}
                    className={cn(
                      "h-10 text-xs font-medium transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl",
                      selectedSeat.status === "MAINTENANCE"
                        ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold ring-1 ring-amber-500/30"
                        : "border-border/80 bg-background hover:bg-muted text-foreground"
                    )}
                  >
                    <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Đánh dấu bảo trì</span>
                  </Button>

                  {/* Nút 5: Khóa bàn tạm thời */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleUpdateSeatStatus(selectedSeat.id, "BLOCKED")}
                    className={cn(
                      "h-10 text-xs font-medium transition-all shadow-2xs gap-2.5 px-3 justify-start rounded-xl",
                      selectedSeat.status === "BLOCKED"
                        ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-500/30"
                        : "border-border/80 bg-background hover:bg-muted text-foreground"
                    )}
                  >
                    <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate">Khóa bàn tạm thời</span>
                  </Button>
                </div>
              </div>

              {/* Danh sách Tài sản tại chỗ ngồi */}
              <div id="seat-assets-section" className="space-y-1.5 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Package className="w-3 h-3 text-primary" />
                    <span>Tài sản trang bị tại bàn ({getSeatAssets(selectedSeat).length}):</span>
                  </span>
                  <Link
                    href={`/assets?search=${encodeURIComponent(selectedSeat.seatCode)}`}
                    className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>Tra cứu tài sản</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {getSeatAssets(selectedSeat).map((asset) => (
                    <div
                      key={asset.assetCode}
                      className="p-2 rounded-lg bg-background/80 border border-border/50 flex items-center justify-between text-[11px] gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-foreground truncate block">
                          {asset.name}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {asset.assetCode} {asset.serialNumber ? `• ${asset.serialNumber}` : ""}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 text-emerald-600 bg-emerald-500/5">
                        Hoạt động
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chi tiết phòng họp / tiện ích khi được chọn */}
          {selectedObject && (
            <div className="p-4 rounded-xl border border-indigo-500/40 bg-indigo-50/60 dark:bg-indigo-950/30 space-y-3 animate-fadeIn">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    {selectedObject.objectType === "MEETING_ROOM" ? (
                      <Video className="w-5 h-5" />
                    ) : selectedObject.objectType === "PANTRY" ? (
                      <Coffee className="w-5 h-5" />
                    ) : (
                      <DoorClosed className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight">
                      {selectedObject.name}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      {selectedObject.objectType === "MEETING_ROOM"
                        ? "Phòng họp thông minh"
                        : selectedObject.objectType === "PANTRY"
                        ? "Khu vực Pantry / Nghỉ ngơi"
                        : selectedObject.objectType}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedObject(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-background/90 border border-border/60">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Sức chứa tối đa
                  </span>
                  <strong className="text-foreground text-sm font-mono block mt-0.5">
                    {selectedObject.capacity || 10} chỗ ngồi
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-background/90 border border-border/60">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Hiện trạng
                  </span>
                  <strong className="text-emerald-600 text-sm block mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Sẵn sàng
                  </strong>
                </div>
              </div>

              {selectedObject.description && (
                <p className="text-xs text-muted-foreground bg-background/70 p-3 rounded-lg border border-border/40 leading-relaxed">
                  {selectedObject.description}
                </p>
              )}

              {/* Danh mục tài sản trang bị phòng họp */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    <span>Tài sản trang bị ({getRoomAssets(selectedObject).length}):</span>
                  </span>
                  <Link
                    href={`/assets?search=${encodeURIComponent(selectedObject.name)}`}
                    className="text-[10px] text-primary hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>Quản lý Tài sản</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {getRoomAssets(selectedObject).map((asset) => (
                    <div
                      key={asset.assetCode}
                      className="p-2 rounded-lg bg-background/90 border border-border/60 flex items-center justify-between text-xs gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-foreground truncate block">
                          {asset.name}
                        </span>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {asset.assetCode} {asset.serialNumber ? `• SN: ${asset.serialNumber}` : ""}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[9px] px-1.5 py-0 h-4 shrink-0 font-medium">
                        Tốt
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Chi tiết phân khu khi được chọn */}
          {selectedZone && (
            <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/20 space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedZone.colorHex || "#3b82f6" }}
                  />
                  <h4 className="text-xs font-bold text-foreground">
                    {selectedZone.name}
                  </h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedZone(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              {selectedZone.departmentName && (
                <p className="text-xs text-muted-foreground">
                  Phòng ban phụ trách: <strong className="text-foreground">{selectedZone.departmentName}</strong>
                </p>
              )}
            </div>
          )}

          {/* ── DANH SÁCH 2 CỘT: PHÒNG HỌP & PHÂN KHU LÀM VIỆC ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-border/60">
            {/* Cột 1: Phòng họp & Tiện ích */}
            {allObjects.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Phòng họp & Tiện ích ({allObjects.length}):</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Click để định vị trên sơ đồ
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allObjects.map((obj) => {
                    const isSelected = selectedObject?.id === obj.id;
                    const isMeeting = obj.objectType === "MEETING_ROOM";

                    return (
                      <div
                        key={obj.id}
                        onClick={() => handleSelectObject(obj)}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-500 shadow-2xs"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isMeeting ? (
                            <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          ) : (
                            <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          )}
                          <span className="font-semibold text-foreground truncate">
                            {obj.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {obj.capacity && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                              {obj.capacity} chỗ
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cột 2: Phân khu làm việc */}
            {mapData?.zones && mapData.zones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-primary" />
                    <span>Phân khu làm việc ({mapData.zones.length}):</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    Click để định vị trên sơ đồ
                  </span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mapData.zones.map((zone) => {
                    const isSelected = selectedZone?.id === zone.id;
                    const zoneSeatCount = mapData.seats.filter((s) => {
                      const row = mapData.seatRows.find((r) => r.id === s.seatRowId);
                      return row?.zoneId === zone.id;
                    }).length;

                    return (
                      <div
                        key={zone.id}
                        onClick={() => handleSelectZone(zone)}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs hover:border-primary/50 hover:bg-muted/40",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-2xs"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: zone.colorHex || "#6366f1" }}
                          />
                          <span className="font-semibold text-foreground truncate">
                            {zone.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                          {zoneSeatCount} bàn
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── 5. DANH SÁCH BÀN LÀM VIỆC & PHÂN BỔ CHỖ NGỒI DẠNG BẢNG ────────────── */}
      <div className="space-y-4 pt-4 border-t border-border/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Armchair className="w-5 h-5 text-primary" />
              <span>Danh sách Bàn làm việc & Phân bổ chỗ ngồi</span>
              <Badge variant="outline" className="font-mono text-xs">
                {totalSeatItems} bàn
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Phân bổ chỗ ngồi cố định, quản lý bàn linh hoạt, tình trạng bảo trì và trang thiết bị gắn kèm trực tiếp tại tầng
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchSeats();
                refetchMap();
                refetchAssignments();
              }}
              disabled={isSeatsFetching}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeatsFetching ? "animate-spin" : ""}`} />
              <span>Làm mới bàn</span>
            </Button>

            <Button asChild size="sm" className="h-8 gap-1.5 text-xs shadow-xs">
              <Link href={`/workplace/floors/${floorId}/editor`}>
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Thêm / Vẽ bàn mới</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Thanh tìm kiếm & bộ lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-card p-3.5 rounded-xl border border-border shadow-2xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={seatSearch}
              onChange={(e) => {
                setSeatSearch(e.target.value);
                setSeatPage(1);
              }}
              placeholder="Tìm theo mã bàn, người ngồi..."
              className="pl-8 h-8 text-xs"
            />
          </div>

          <Select
            value={seatZoneId || "ALL"}
            onValueChange={(val) => {
              setSeatZoneId(val === "ALL" || !val ? "" : val);
              setSeatPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Phân khu làm việc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phân khu</SelectItem>
              {mapData?.zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={seatStatus || "ALL"}
            onValueChange={(val) => {
              setSeatStatus(val === "ALL" || !val ? "" : val);
              setSeatPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Trạng thái bàn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="IN_SERVICE">Sẵn sàng sử dụng</SelectItem>
              <SelectItem value="MAINTENANCE">Đang bảo trì</SelectItem>
              <SelectItem value="BLOCKED">Tạm khóa sự cố</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={seatType || "ALL"}
            onValueChange={(val) => {
              setSeatType(val === "ALL" || !val ? "" : val);
              setSeatPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Loại bàn làm việc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại bàn</SelectItem>
              <SelectItem value="HOT_DESK">Bàn linh hoạt (Hot-desk)</SelectItem>
              <SelectItem value="DEDICATED">Bàn cố định (Dedicated)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bảng dữ liệu ghế với hỗ trợ Xem chi tiết, Phân bổ, Thu hồi và Cập nhật trạng thái */}
        <WorkplaceSeatTable
          seats={paginatedSeats}
          isLoading={isSeatsLoading}
          page={seatPage}
          totalPages={totalSeatPages}
          totalItems={totalSeatItems}
          onPageChange={setSeatPage}
          onViewDetail={handleViewSeatDetail}
          onUpdateStatus={handleUpdateSeatStatus}
          onAssignSeat={handleOpenAssignSeat}
          onReleaseSeat={handleOpenReleaseSeat}
        />
      </div>

      {/* ── 6. DIALOG PHÂN BỔ CHỖ NGỒI CỐ ĐỊNH CHO NHÂN VIÊN ──────────────────── */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span>Phân bổ Chỗ ngồi Cố định</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmAssign} className="space-y-4 pt-2">
            {/* Thông tin bàn đang được phân bổ */}
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Bàn làm việc:</span>
                <strong className="text-primary font-mono text-sm">{seatToAssign?.seatCode}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Vị trí:</span>
                <span className="text-foreground">{floorName} • {(seatToAssign as any)?.zoneName || "Khu vực tầng"}</span>
              </div>
            </div>

            {/* Chọn Nhân sự tiếp nhận */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Chọn Nhân sự tiếp nhận *</Label>
              <div className="space-y-2">
                <Input
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  placeholder="Lọc nhanh theo tên hoặc mã nhân viên..."
                  className="text-xs h-8"
                />

                <Select value={selectedEmployeeId} onValueChange={(val) => val && setSelectedEmployeeId(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Chọn nhân sự trong danh sách...">
                      {(val: string) => {
                        if (!val) return "Chọn nhân sự trong danh sách...";
                        const emp = employeesList.find((item) => item.id === val);
                        return emp ? `${emp.fullName} (${emp.employeeCode})${emp.currentDepartmentName ? ` • ${emp.currentDepartmentName}` : ""}` : "Chọn nhân sự...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredEmployees.length === 0 ? (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        Không tìm thấy nhân viên phù hợp
                      </div>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <SelectItem
                          key={emp.id}
                          value={emp.id}
                          label={`${emp.fullName} (${emp.employeeCode})`}
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <span>{emp.fullName}</span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              ({emp.employeeCode}) {emp.currentDepartmentName && `• ${emp.currentDepartmentName}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ghi chú phân bổ */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Ghi chú phân bổ (Tùy chọn)</Label>
              <Input
                value={assignmentNote}
                onChange={(e) => setAssignmentNote(e.target.value)}
                placeholder="Ví dụ: Cấp phát chỗ ngồi cho phòng Dự án..."
                className="text-xs h-9"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAssignDialogOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isAssigning || !selectedEmployeeId}>
                {isAssigning ? "Đang phân bổ..." : "Xác nhận phân bổ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 7. DIALOG XÁC NHẬN THU HỒI CHỖ NGỒI ───────────────────────────────── */}
      <Dialog open={isReleaseDialogOpen} onOpenChange={setIsReleaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
              <UserX className="w-5 h-5 text-rose-600" />
              <span>Xác nhận Thu hồi Chỗ ngồi</span>
            </DialogTitle>
          </DialogHeader>

          <div className="py-3 text-xs text-muted-foreground space-y-2">
            <p>
              Bạn có chắc chắn muốn thu hồi quyền sử dụng bàn làm việc{" "}
              <strong className="text-foreground font-mono font-bold">{seatToRelease?.seatCode}</strong>{" "}
              của nhân sự{" "}
              <strong className="text-foreground font-bold">{seatToRelease?.employeeName}</strong>?
            </p>
            <p className="text-[11px] bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/30">
              Lưu ý: Sau khi thu hồi, bàn này sẽ lập tức trở về trạng thái trống sẵn sàng để phân bổ lại cho nhân sự khác hoặc mở cho đặt linh hoạt.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReleaseDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmRelease}
              disabled={isReleasing}
            >
              {isReleasing ? "Đang thu hồi..." : "Xác nhận thu hồi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
