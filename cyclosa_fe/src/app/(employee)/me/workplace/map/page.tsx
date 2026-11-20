"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Users,
  MapPin,
  Building2,
  Layers,
  Sparkles,
  UserCheck,
  Navigation,
  Info,
  Calendar,
  Wrench,
  Armchair,
  Video,
  Coffee,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Loader2,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { InteractiveFloorCanvas } from "@/features/workplace/components/canvas/interactive-floor-canvas";
import {
  useGetFloorMapQuery,
  useGetEmployeeLocationQuery,
  useGetMySeatQuery,
  useGetSitesQuery,
  useGetFloorsBySiteIdQuery,
  useBookDeskMutation,
  useBookRoomMutation,
  useReportIssueMutation,
} from "@/features/workplace/api/workplace-api";
import type {
  FloorMapData,
  FloorMapSeat,
  FloorMapObject,
  FloorMapZone,
} from "@/features/workplace/types/workplace.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function WorkplaceMapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetEmployeeId, setTargetEmployeeId] = useState("");

  // Đối tượng được chọn trên Map
  const [selectedSeat, setSelectedSeat] = useState<FloorMapSeat | null>(null);
  const [selectedObject, setSelectedObject] = useState<FloorMapObject | null>(null);

  // Modal điều khiển hành động tại chỗ
  const [isDeskBookingOpen, setIsDeskBookingOpen] = useState(false);
  const [isRoomBookingOpen, setIsRoomBookingOpen] = useState(false);
  const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);

  // Form states cho Đặt bàn (Desk Booking)
  const [deskBookingDate, setDeskBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deskBookingNote, setDeskBookingNote] = useState("");

  // Form states cho Đặt phòng họp (Room Booking)
  const [roomBookingTitle, setRoomBookingTitle] = useState("");
  const [roomBookingAttendees, setRoomBookingAttendees] = useState<number>(4);
  const [roomBookingDate, setRoomBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [roomBookingStartTime, setRoomBookingStartTime] = useState("09:00");
  const [roomBookingEndTime, setRoomBookingEndTime] = useState("10:00");
  const [roomBookingDesc, setRoomBookingDesc] = useState("");

  // Form states cho Báo hỏng sự cố (Workplace Issue)
  const [issueTitle, setIssueTitle] = useState("");
  const [issueType, setIssueType] = useState<string>("FURNITURE");
  const [issueSeverity, setIssueSeverity] = useState<string>("MEDIUM");
  const [issueDescription, setIssueDescription] = useState("");

  // RTK Mutations
  const [bookDesk, { isLoading: isBookingDesk }] = useBookDeskMutation();
  const [bookRoom, { isLoading: isBookingRoom }] = useBookRoomMutation();
  const [reportIssue, { isLoading: isReportingIssue }] = useReportIssueMutation();

  // 1. Tự động truy vấn chỗ ngồi của Current User
  const { data: mySeat, isLoading: isLoadingMySeat } = useGetMySeatQuery();

  // 2. Danh sách cơ sở / tòa nhà
  const { data: sitesData } = useGetSitesQuery({ size: 100 });
  const sites = sitesData?.items || [];

  // Tầng mặc định fallback nếu user chưa có chỗ: Tầng 12 Keangnam Landmark 72
  const fallbackFloorId = "00000000-0000-0000-0000-000000000012";
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedFloorId, setSelectedFloorId] = useState<string>(fallbackFloorId);

  // Đồng bộ cơ sở ban đầu theo vị trí của user (hoặc cơ sở đầu tiên)
  useEffect(() => {
    if (mySeat?.siteId) {
      setSelectedSiteId(mySeat.siteId);
    } else if (sites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(sites[0].id);
    }
  }, [mySeat?.siteId, sites, selectedSiteId]);

  // Đồng bộ tầng ban đầu theo tầng của current user (nếu có)
  useEffect(() => {
    if (mySeat?.floorId) {
      setSelectedFloorId(mySeat.floorId);
    }
  }, [mySeat?.floorId]);

  // 3. Danh sách tầng thuộc cơ sở đã chọn
  const { data: floors = [] } = useGetFloorsBySiteIdQuery(selectedSiteId, {
    skip: !selectedSiteId,
  });

  // Tự động chọn tầng đầu tiên của cơ sở nếu tầng hiện tại không thuộc cơ sở đó
  useEffect(() => {
    if (floors.length > 0 && !floors.some((f) => f.id === selectedFloorId)) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  // 4. Lấy dữ liệu bản đồ tầng được chọn
  const { data: mapData, isLoading: isLoadingMap } = useGetFloorMapQuery(selectedFloorId, {
    skip: !selectedFloorId,
  });

  const { data: employeeLoc } = useGetEmployeeLocationQuery(targetEmployeeId, {
    skip: !targetEmployeeId,
  });

  // Dữ liệu bản đồ hiển thị
  const activeMapData: FloorMapData = mapData || {
    floorId: selectedFloorId,
    floorName: "Tầng 12 — Trụ sở Keangnam Landmark 72",
    floorNumber: 12,
    activePlan: {
      id: "p1",
      floorId: selectedFloorId,
      versionNo: 2,
      canvasWidth: 1000,
      canvasHeight: 560,
      scaleMetersPerPx: 0.05,
      status: "PUBLISHED",
      createdAt: "",
    },
    zones: [
      {
        id: "z1",
        name: "Khu vực R&D Công nghệ Phần mềm",
        departmentName: "Khối Kỹ thuật & R&D",
        colorHex: "#3b82f6",
        boundaryPoints: [{ pointOrder: 1, x: 40, y: 40 }],
      },
      {
        id: "z2",
        name: "Khu vực Bàn Làm việc Linh hoạt (Hot-desking)",
        departmentName: "Khu làm việc chung",
        colorHex: "#10b981",
        boundaryPoints: [{ pointOrder: 1, x: 600, y: 40 }],
      },
    ],
    seatRows: [],
    seats: [
      {
        id: "s1",
        seatRowId: "r1",
        seatCode: "DEV-A01",
        seatType: "DEDICATED",
        status: "IN_SERVICE",
        x: 60,
        y: 80,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s1",
        currentOccupantName: "Nguyễn Văn An",
        amenities: ["Màn hình 27 inch 4K", "Cổng LAN 1Gbps", "Bàn nâng hạ SmartDesk"],
      },
      {
        id: "s2",
        seatRowId: "r1",
        seatCode: "DEV-A02",
        seatType: "DEDICATED",
        status: "IN_SERVICE",
        x: 145,
        y: 80,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s2",
        currentOccupantName: "Lê Hoàng Long",
        amenities: ["Bàn nâng hạ", "Màn hình 27 inch"],
      },
      {
        id: "s3",
        seatRowId: "r1",
        seatCode: "DEV-A03",
        seatType: "DEDICATED",
        status: "IN_SERVICE",
        x: 60,
        y: 140,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s3",
        currentOccupantName: "Trần Thị Mai Cúc",
        amenities: ["Màn hình 27 inch"],
      },
      {
        id: "s4",
        seatRowId: "r2",
        seatCode: "HOT-01",
        seatType: "HOT_DESK",
        status: "IN_SERVICE",
        x: 620,
        y: 80,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s4",
        amenities: ["Màn hình phụ 24 inch", "Cổng sạc Type-C 100W", "Ổ cắm đa năng"],
      },
      {
        id: "s5",
        seatRowId: "r2",
        seatCode: "HOT-02",
        seatType: "HOT_DESK",
        status: "IN_SERVICE",
        x: 705,
        y: 80,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s5",
        amenities: ["Gần cửa sổ view Landmark", "Ổ cắm điện thoại"],
      },
      {
        id: "s6",
        seatRowId: "r2",
        seatCode: "HOT-03",
        seatType: "HOT_DESK",
        status: "MAINTENANCE",
        x: 790,
        y: 80,
        shape: "RECTANGLE",
        width: 70,
        height: 45,
        rotationDegrees: 0,
        qrToken: "qr-s6",
        amenities: ["Đang thay màn hình"],
      },
    ],
    objects: [
      {
        id: "o1",
        objectType: "MEETING_ROOM",
        name: "Phòng họp Innovation",
        x: 350,
        y: 350,
        width: 280,
        height: 160,
        rotationDegrees: 0,
        capacity: 16,
        description: "Trang bị màn hình TV 85 inch, Video Conference Logitech Rally Plus, 2 bảng trắng và điều hòa trung tâm.",
      },
      {
        id: "o2",
        objectType: "PANTRY",
        name: "Khu vực Pantry & Coffee Lounge",
        x: 720,
        y: 350,
        width: 220,
        height: 160,
        rotationDegrees: 0,
        capacity: 20,
        description: "Máy pha cà phê DeLonghi, tủ lạnh Panasonic, lò vi sóng, quầy trà thảo mộc và ghế sofa thư giãn.",
      },
      {
        id: "o3",
        objectType: "PHONE_BOOTH",
        name: "Phonebooth Focus 01",
        x: 230,
        y: 350,
        width: 90,
        height: 90,
        rotationDegrees: 0,
        capacity: 1,
        description: "Buồng cách âm tiêu chuẩn 35dB, bàn làm việc cá nhân, đèn LED trợ sáng và cổng sạc nhanh.",
      },
    ],
  };

  // Thống kê nhanh mặt bằng
  const stats = useMemo(() => {
    const seats = activeMapData.seats || [];
    const available = seats.filter(
      (s) => s.status === "IN_SERVICE" && !s.currentOccupantName
    ).length;
    const occupied = seats.filter((s) => Boolean(s.currentOccupantName)).length;
    const maintenance = seats.filter((s) => s.status === "MAINTENANCE").length;
    const meetingRooms = (activeMapData.objects || []).filter(
      (o) => o.objectType === "MEETING_ROOM" || o.objectType === "CONFERENCE_ROOM"
    ).length;

    return { total: seats.length, available, occupied, maintenance, meetingRooms };
  }, [activeMapData]);

  // Nút chuyển nhanh về chỗ ngồi của Current User
  const handleFocusMySeat = () => {
    if (!mySeat) return;
    if (mySeat.siteId && mySeat.siteId !== selectedSiteId) {
      setSelectedSiteId(mySeat.siteId);
    }
    if (mySeat.floorId && mySeat.floorId !== selectedFloorId) {
      setSelectedFloorId(mySeat.floorId);
    }
    const foundSeat = activeMapData.seats.find(
      (s) => s.id === mySeat.id || s.seatCode === mySeat.seatCode
    );
    if (foundSeat) {
      setSelectedSeat(foundSeat);
      setSelectedObject(null);
    }
  };

  // Tìm kiếm đồng nghiệp trên mặt bằng
  const handleSearchColleague = () => {
    if (!searchTerm.trim()) return;
    const term = searchTerm.toLowerCase();
    const matchedSeat = activeMapData.seats.find(
      (s) =>
        s.seatCode.toLowerCase().includes(term) ||
        (s.currentOccupantName && s.currentOccupantName.toLowerCase().includes(term))
    );
    if (matchedSeat) {
      setSelectedSeat(matchedSeat);
      setSelectedObject(null);
      toast.info(`Đã tìm thấy vị trí của: ${matchedSeat.currentOccupantName || matchedSeat.seatCode}`);
    } else {
      toast.error(`Không tìm thấy nhân sự hoặc mã bàn phù hợp với "${searchTerm}"`);
    }
  };

  // ── Xử lý Hành động Đặt bàn (Hot-desk Booking) ───────────────────────────
  const handleConfirmBookDesk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) return;

    try {
      await bookDesk({
        seatId: selectedSeat.id,
        bookingDate: deskBookingDate,
        note: deskBookingNote.trim() || undefined,
      }).unwrap();

      toast.success(`Đặt bàn ${selectedSeat.seatCode} cho ngày ${deskBookingDate} thành công!`);
      setIsDeskBookingOpen(false);
      setDeskBookingNote("");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể hoàn tất đặt bàn. Vui lòng thử lại sau.";
      toast.error(msg);
    }
  };

  // ── Xử lý Hành động Đặt phòng họp (Meeting Room Booking) ───────────────────
  const handleConfirmBookRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedObject) return;

    if (!roomBookingTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề cuộc họp");
      return;
    }

    const startIso = `${roomBookingDate}T${roomBookingStartTime}:00`;
    const endIso = `${roomBookingDate}T${roomBookingEndTime}:00`;

    if (startIso >= endIso) {
      toast.error("Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
      return;
    }

    try {
      await bookRoom({
        meetingRoomId: selectedObject.id,
        title: roomBookingTitle.trim(),
        attendeeCount: Number(roomBookingAttendees) || 1,
        startTime: startIso,
        endTime: endIso,
        description: roomBookingDesc.trim() || undefined,
      }).unwrap();

      toast.success(`Đặt phòng họp "${selectedObject.name}" thành công!`);
      setIsRoomBookingOpen(false);
      setRoomBookingTitle("");
      setRoomBookingDesc("");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể đặt phòng họp. Vui lòng kiểm tra lại khung giờ.";
      toast.error(msg);
    }
  };

  // ── Xử lý Hành động Báo hỏng sự cố cơ sở vật chất (Workplace Issue) ──────────
  const handleConfirmReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueTitle.trim()) {
      toast.error("Vui lòng nhập tiêu đề sự cố");
      return;
    }
    if (!issueDescription.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết sự cố");
      return;
    }

    try {
      await reportIssue({
        title: issueTitle.trim(),
        issueType,
        severity: issueSeverity,
        description: issueDescription.trim(),
        seatId: selectedSeat?.id,
        floorObjectId: selectedObject?.id,
        floorId: selectedFloorId,
        locationX: selectedSeat?.x ?? selectedObject?.x,
        locationY: selectedSeat?.y ?? selectedObject?.y,
      }).unwrap();

      toast.success("Báo cáo sự cố cơ sở vật chất đã được gửi thành công!");
      setIsReportIssueOpen(false);
      setIssueTitle("");
      setIssueDescription("");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể gửi báo cáo sự cố. Vui lòng thử lại.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Page Header Chuẩn Rule 02 ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Compass className="w-6 h-6 text-primary shrink-0" />
            <span>Sơ đồ mặt bằng & Chỗ ngồi làm việc</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <Link href="/me/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sơ đồ 2D trực quan</span>
          </nav>
        </div>

        {/* Chỗ ngồi của Current User Pill */}
        {mySeat ? (
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-2 rounded-xl text-xs sm:text-sm">
            <UserCheck className="h-4 w-4 text-primary shrink-0" />
            <span>
              Chỗ ngồi của bạn:{" "}
              <strong className="text-primary font-bold">{mySeat.seatCode}</strong>{" "}
              ({mySeat.floorName || "Tầng làm việc"})
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFocusMySeat}
              className="ml-2 h-7 text-xs bg-background hover:bg-muted"
            >
              <Navigation className="h-3 w-3 mr-1 text-primary" />
              Định vị bàn
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-muted/60 border border-border px-3.5 py-2 rounded-xl text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>Bạn chưa được gán bàn cố định. Đang hiển thị tầng trụ sở mặc định.</span>
          </div>
        )}
      </div>

      {/* ── 2. Control Bar: Bộ chọn Tòa nhà & Tầng + Tìm kiếm đồng nghiệp ───── */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Bộ chọn Tòa nhà */}
          <div className="w-64">
            <Select
              value={selectedSiteId}
              onValueChange={(val) => {
                if (val) setSelectedSiteId(val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Chọn Tòa nhà / Cơ sở">
                  {(val: string) => {
                    if (!val) return "Chọn Tòa nhà / Cơ sở";
                    const site = sites.find((s) => s.id === val);
                    return site ? site.name : "Chọn Tòa nhà / Cơ sở";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id} label={site.name}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bộ chọn Tầng */}
          <div className="w-56">
            <Select
              value={selectedFloorId}
              onValueChange={(val) => {
                if (val) setSelectedFloorId(val);
              }}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <Layers className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Chọn Tầng làm việc">
                  {(val: string) => {
                    if (!val) return "Chọn Tầng làm việc";
                    const floor = floors.find((f) => f.id === val);
                    return floor ? floor.name : "Chọn Tầng làm việc";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {floors.map((floor) => (
                  <SelectItem key={floor.id} value={floor.id} label={floor.name}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tìm kiếm đồng nghiệp */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm đồng nghiệp (VD: Nguyễn Văn An, Lê Hoàng Long, DEV-A01)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchColleague();
              }}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button onClick={handleSearchColleague} size="sm" className="h-9 gap-1.5 text-xs">
            <Search className="h-3.5 w-3.5" />
            Tìm vị trí
          </Button>
        </div>
      </div>

      {/* ── 3. Main Workplace Map Layout (Sơ đồ bản đồ phía trên, Thông tin & Thao tác phía dưới) ── */}
      <div className="space-y-6">
        {/* PHẦN TRÊN (100% Rộng): Sơ đồ mặt bằng 2D tương tác */}
        <div className="w-full space-y-3">
          <InteractiveFloorCanvas
            mapData={activeMapData}
            selectedSeatId={selectedSeat?.id}
            selectedObjectId={selectedObject?.id}
            highlightedSeatId={mySeat?.id}
            onSelectSeat={(seat) => {
              setSelectedSeat(seat);
              setSelectedObject(null);
            }}
            onSelectObject={(obj) => {
              setSelectedObject(obj);
              setSelectedSeat(null);
            }}
          />

          {/* Thanh chú giải dưới chân bản đồ */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl border bg-card text-xs text-muted-foreground shadow-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
                Trạng thái bàn:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-emerald-100 border border-emerald-400" />
                <span className="text-foreground">Trống ({stats.available})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-red-100 border border-red-400" />
                <span className="text-foreground font-medium text-primary">
                  Đang ngồi ({stats.occupied})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-amber-100 border border-amber-400" />
                <span className="text-foreground">Bảo trì ({stats.maintenance})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-indigo-100 border border-indigo-400" />
                <span className="text-foreground">Phòng họp ({stats.meetingRooms})</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Bấm vào bàn hoặc phòng trên sơ đồ để xem thông tin và thao tác đặt chỗ / báo hỏng</span>
            </div>
          </div>
        </div>

        {/* PHẦN DƯỚI (100% Rộng): Bảng Chi tiết Đối tượng & Thao tác Hành động */}
        <div className="w-full">
          {/* TRƯỜNG HỢP 1: ĐANG CHỌN BÀN LÀM VIỆC (SEAT) */}
          {selectedSeat ? (
            <Card className="border border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-5 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Armchair className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-foreground">
                        Bàn {selectedSeat.seatCode}
                      </CardTitle>
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {selectedSeat.seatType === "HOT_DESK" ? "Bàn linh hoạt (Hot-desk)" : "Bàn chuyên dụng"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Vị trí tại {activeMapData.floorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-2.5 py-1 border",
                      selectedSeat.status === "IN_SERVICE" && !selectedSeat.currentOccupantName
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : selectedSeat.currentOccupantName
                        ? "bg-red-50 text-primary border-red-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    )}
                  >
                    {selectedSeat.status === "MAINTENANCE"
                      ? "● ĐANG BẢO TRÌ"
                      : selectedSeat.currentOccupantName
                      ? "● ĐANG SỬ DỤNG"
                      : "● SẴN SÀNG"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedSeat(null)}
                    title="Đóng chi tiết"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Cột 1: Thông tin nhân viên được gán */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Nhân sự sử dụng hiện tại
                    </span>
                    {selectedSeat.currentOccupantName ? (
                      <div className="p-3.5 rounded-xl border bg-muted/30 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                          {selectedSeat.currentOccupantName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <strong className="text-sm font-semibold text-foreground block truncate">
                            {selectedSeat.currentOccupantName}
                          </strong>
                          <span className="text-xs text-muted-foreground">
                            Nhân sự đã được gán vị trí này
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl border border-dashed text-center text-muted-foreground bg-muted/10">
                        <p className="font-medium text-xs text-foreground">Bàn đang trống</p>
                        <p className="text-[11px] mt-0.5">Sẵn sàng để nhân viên đặt chỗ làm việc linh hoạt</p>
                      </div>
                    )}
                  </div>

                  {/* Cột 2: Tiện ích và Trang thiết bị tại bàn */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Tiện ích & Thiết bị tại bàn
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeat.amenities && selectedSeat.amenities.length > 0 ? (
                        selectedSeat.amenities.map((am, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-normal py-1 px-2.5">
                            {am}
                          </Badge>
                        ))
                      ) : (
                        <div className="p-3.5 rounded-xl border bg-muted/20 text-muted-foreground text-xs w-full">
                          Bàn văn phòng tiêu chuẩn: Màn hình phụ, Nguồn điện, Cổng LAN, Ghế công thái học.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cột 3: Bộ nút thao tác nhanh ngay tại trang Map */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Thao tác khả dụng
                    </span>
                    <div className="space-y-2">
                      {/* Nút đặt bàn (Hot-desk) */}
                      {selectedSeat.seatType === "HOT_DESK" &&
                        selectedSeat.status === "IN_SERVICE" &&
                        !selectedSeat.currentOccupantName && (
                          <Button
                            size="sm"
                            onClick={() => setIsDeskBookingOpen(true)}
                            className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-xs"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Đặt bàn này (Hot-desk)</span>
                          </Button>
                        )}

                      {/* Nút báo hỏng sự cố */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIssueTitle(`Sự cố tại bàn ${selectedSeat.seatCode}`);
                          setIsReportIssueOpen(true);
                        }}
                        className="w-full h-9 text-xs gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Báo hỏng / Sự cố tại bàn này</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedObject ? (
            /* TRƯỜNG HỢP 2: ĐANG CHỌN PHÒNG HỌP HOẶC TIỆN ÍCH KHÁC (OBJECT) */
            <Card className="border border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-5 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {selectedObject.objectType === "MEETING_ROOM" ||
                    selectedObject.objectType === "CONFERENCE_ROOM" ? (
                      <Video className="h-5 w-5" />
                    ) : selectedObject.objectType === "PANTRY" ? (
                      <Coffee className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-foreground">
                        {selectedObject.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {selectedObject.objectType === "MEETING_ROOM"
                          ? "Phòng họp thông minh"
                          : selectedObject.objectType === "PANTRY"
                          ? "Khu vực Pantry / Cafe"
                          : selectedObject.objectType}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Khu vực tại {activeMapData.floorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedObject.capacity && (
                    <Badge variant="outline" className="text-xs px-2.5 py-1 font-mono font-medium">
                      Sức chứa: {selectedObject.capacity} chỗ
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedObject(null)}
                    title="Đóng chi tiết"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Cột 1 & 2: Mô tả & Trang thiết bị */}
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Mô tả & Trang thiết bị khu vực
                    </span>
                    <div className="p-3.5 rounded-xl border bg-muted/20 text-xs text-muted-foreground leading-relaxed">
                      {selectedObject.description || "Khu vực không gian chung văn phòng, phục vụ nhu cầu họp nhóm và làm việc linh hoạt."}
                    </div>
                  </div>

                  {/* Cột 3: Bộ nút thao tác nhanh */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Thao tác khả dụng
                    </span>
                    <div className="space-y-2">
                      {(selectedObject.objectType === "MEETING_ROOM" ||
                        selectedObject.objectType === "CONFERENCE_ROOM") && (
                        <Button
                          size="sm"
                          onClick={() => setIsRoomBookingOpen(true)}
                          className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs gap-1.5 shadow-xs"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Đặt phòng họp này</span>
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIssueTitle(`Sự cố cơ sở vật chất tại ${selectedObject.name}`);
                          setIsReportIssueOpen(true);
                        }}
                        className="w-full h-9 text-xs gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Báo hỏng / Sự cố tại khu vực này</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* TRƯỜNG HỢP 3: CHƯA CHỌN ĐỐI TƯỢNG NÀO (TỔNG QUAN TẦNG) */
            <Card className="border border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-5 border-b bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Tổng quan tầng & Thông tin thao tác — {activeMapData.floorName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="p-3.5 rounded-xl border bg-muted/20 text-center">
                    <span className="text-xs text-muted-foreground block">Tổng số bàn</span>
                    <strong className="text-base font-bold text-foreground mt-0.5 block">{stats.total} bàn</strong>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 block">Bàn còn trống</span>
                    <strong className="text-base font-bold text-emerald-600 mt-0.5 block">{stats.available} bàn</strong>
                  </div>
                  <div className="p-3.5 rounded-xl border bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 text-center">
                    <span className="text-xs text-indigo-700 dark:text-indigo-400 block">Phòng họp</span>
                    <strong className="text-base font-bold text-indigo-600 mt-0.5 block">{stats.meetingRooms} phòng</strong>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIssueTitle(`Sự cố cơ sở vật chất tại ${activeMapData.floorName}`);
                        setIsReportIssueOpen(true);
                      }}
                      className="w-full h-12 text-xs gap-2 border-dashed border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Wrench className="h-4 w-4" />
                      <span>Báo hỏng sự cố chung của tầng</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border/80 text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    <strong>Mẹo:</strong> Nhấp trực tiếp vào bất kỳ <strong>Bàn làm việc</strong> hoặc <strong>Phòng họp</strong> trên sơ đồ bên trên để xem thông tin chi tiết và thực hiện đặt chỗ / báo hỏng tức thì.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── DIALOG 1: ĐẶT BÀN LÀM VIỆC (DESK BOOKING) ────────────────────────── */}
      <Dialog open={isDeskBookingOpen} onOpenChange={setIsDeskBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Đặt bàn làm việc (Hot-desking)</span>
            </DialogTitle>
            <DialogDescription>
              Xác nhận thông tin đặt chỗ ngồi linh hoạt tại bàn{" "}
              <strong>{selectedSeat?.seatCode}</strong> ({activeMapData.floorName}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBookDesk} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="desk-date">Ngày sử dụng bàn</Label>
              <Input
                id="desk-date"
                type="date"
                value={deskBookingDate}
                onChange={(e) => setDeskBookingDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desk-note">Ghi chú (Tùy chọn)</Label>
              <Textarea
                id="desk-note"
                placeholder="VD: Dự án Alpha, cần bàn có màn hình phụ..."
                value={deskBookingNote}
                onChange={(e) => setDeskBookingNote(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDeskBookingOpen(false)}
                disabled={isBookingDesk}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isBookingDesk}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                {isBookingDesk ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Xác nhận đặt bàn</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG 2: ĐẶT PHÒNG HỌP (MEETING ROOM BOOKING) ───────────────────── */}
      <Dialog open={isRoomBookingOpen} onOpenChange={setIsRoomBookingOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Video className="h-5 w-5 text-indigo-600" />
              <span>Đặt phòng họp — {selectedObject?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Sức chứa tối đa: <strong>{selectedObject?.capacity || 10} người</strong> • Tầng: {activeMapData.floorName}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBookRoom} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="room-title">
                Tiêu đề cuộc họp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="room-title"
                placeholder="VD: Họp Sprint Review Quý 4, Họp Ban Dự Án..."
                value={roomBookingTitle}
                onChange={(e) => setRoomBookingTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="room-date">Ngày họp</Label>
                <Input
                  id="room-date"
                  type="date"
                  value={roomBookingDate}
                  onChange={(e) => setRoomBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="room-attendees">Số người tham dự</Label>
                <Input
                  id="room-attendees"
                  type="number"
                  min={1}
                  max={selectedObject?.capacity || 30}
                  value={roomBookingAttendees}
                  onChange={(e) => setRoomBookingAttendees(Number(e.target.value))}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="room-start">Giờ bắt đầu</Label>
                <Input
                  id="room-start"
                  type="time"
                  value={roomBookingStartTime}
                  onChange={(e) => setRoomBookingStartTime(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="room-end">Giờ kết thúc</Label>
                <Input
                  id="room-end"
                  type="time"
                  value={roomBookingEndTime}
                  onChange={(e) => setRoomBookingEndTime(e.target.value)}
                  required
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="room-desc">Nội dung / Yêu cầu chuẩn bị (Tùy chọn)</Label>
              <Textarea
                id="room-desc"
                placeholder="VD: Cần máy chiếu, micro không dây, nước uống cho khách..."
                value={roomBookingDesc}
                onChange={(e) => setRoomBookingDesc(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRoomBookingOpen(false)}
                disabled={isBookingRoom}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isBookingRoom}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                {isBookingRoom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Xác nhận đặt phòng</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG 3: BÁO HỎNG SỰ CỐ CƠ SỞ VẬT CHẤT (WORKPLACE ISSUE) ──────── */}
      <Dialog open={isReportIssueOpen} onOpenChange={setIsReportIssueOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Wrench className="h-5 w-5 text-rose-600" />
              <span>Báo hỏng & Sự cố cơ sở vật chất</span>
            </DialogTitle>
            <DialogDescription>
              Gửi yêu cầu bảo trì, sửa chữa kỹ thuật gắn liền với vị trí:{" "}
              <strong>
                {selectedSeat
                  ? `Bàn ${selectedSeat.seatCode}`
                  : selectedObject
                  ? selectedObject.name
                  : activeMapData.floorName}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReportIssue} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="issue-title">
                Tiêu đề sự cố <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issue-title"
                placeholder="VD: Hỏng cổng cắm HDMI màn hình, Điều hòa không mát, Ghế gãy chốt nâng..."
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="issue-type">Loại sự cố / Hạng mục</Label>
                <Select value={issueType} onValueChange={(val) => { if (val) setIssueType(val); }}>
                  <SelectTrigger id="issue-type" className="h-9 text-xs">
                    <SelectValue placeholder="Chọn loại sự cố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FURNITURE">Bàn ghế / Nội thất</SelectItem>
                    <SelectItem value="HARDWARE">Thiết bị IT / Màn hình</SelectItem>
                    <SelectItem value="ELECTRICAL">Điện / Điều hòa / Chiếu sáng</SelectItem>
                    <SelectItem value="NETWORK">Mạng Internet / Wifi / LAN</SelectItem>
                    <SelectItem value="CLEANLINESS">Vệ sinh / Nước uống</SelectItem>
                    <SelectItem value="OTHER">Hạng mục khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="issue-severity">Mức độ ưu tiên</Label>
                <Select value={issueSeverity} onValueChange={(val) => { if (val) setIssueSeverity(val); }}>
                  <SelectTrigger id="issue-severity" className="h-9 text-xs">
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Thấp (Không gấp)</SelectItem>
                    <SelectItem value="MEDIUM">Bình thường</SelectItem>
                    <SelectItem value="HIGH">Cao (Ảnh hưởng công việc)</SelectItem>
                    <SelectItem value="CRITICAL">Khẩn cấp (Cháy/chập điện)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issue-desc">
                Mô tả chi tiết hiện trạng <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="issue-desc"
                placeholder="Vui lòng mô tả chi tiết biểu hiện sự cố để đội ngũ kỹ thuật tòa nhà xử lý nhanh nhất..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={3}
                required
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReportIssueOpen(false)}
                disabled={isReportingIssue}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isReportingIssue}
                className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5"
              >
                {isReportingIssue ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Gửi báo cáo sự cố</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
