"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Layers,
  Search,
  Users,
  CheckCircle2,
  Calendar,
  Coffee,
  Monitor,
  Printer,
  ChevronRight,
  Sparkles,
  Info,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  Plus,
  ShieldAlert,
  ArrowRight,
  User,
  Wrench,
  Lock,
  Compass,
  ArrowUpRight,
  Filter,
  Check,
  X,
  PhoneCall,
  Laptop,
  Wifi,
  Zap,
  Eye,
  Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Định nghĩa types chuẩn nghiệp vụ
export type SeatStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED";
export type SeatType = "HOT_DESK" | "FIXED_DESK" | "VIP_DESK";

export interface SeatItem {
  id: string;
  code: string;
  zoneId: string;
  zoneName: string;
  row: string;
  col: number;
  type: SeatType;
  status: SeatStatus;
  x: number;
  y: number;
  occupant?: {
    id: string;
    name: string;
    role: string;
    department: string;
    avatar: string;
    email: string;
    phone: string;
  };
  assets: string[];
  amenities: string[];
  lastMaintenance?: string;
}

export interface MeetingRoomItem {
  id: string;
  code: string;
  name: string;
  capacity: number;
  status: "FREE" | "OCCUPIED";
  x: number;
  y: number;
  w: number;
  h: number;
  currentBooking?: {
    title: string;
    host: string;
    time: string;
  };
  amenities: string[];
}

export interface FacilityItem {
  id: string;
  name: string;
  type: "ELEVATOR" | "STAIRS" | "WC" | "PANTRY" | "PRINTER" | "LOCKER";
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function SeatMap2DPage() {
  // Bộ lọc không gian
  const [selectedSite, setSelectedSite] = useState("hn_keangnam");
  const [selectedFloor, setSelectedFloor] = useState("floor_3");
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Điều khiển Canvas
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<"2D" | "OCCUPANCY" | "HEATMAP">("2D");

  // Đối tượng được chọn (để hiển thị Drawer/Panel bên phải)
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>({
    id: "seat_a101",
    code: "Bàn A-101",
    zoneId: "zone_a",
    zoneName: "Zone A - Kỹ thuật & CNTT",
    row: "A",
    col: 1,
    type: "HOT_DESK",
    status: "AVAILABLE",
    x: 180,
    y: 140,
    assets: ["Màn hình 27\" Dell 4K", "Bàn nâng hạ thông minh SmartDesk", "Cổng sạc Type-C 100W"],
    amenities: ["Gần cửa sổ đón nắng", "Cổng LAN 1Gbps", "Ổ cắm chuẩn Quốc tế"]
  });

  const [selectedRoom, setSelectedRoom] = useState<MeetingRoomItem | null>(null);

  // Dữ liệu Phân khu Zones
  const zones = [
    { id: "zone_a", name: "Zone A - Kỹ thuật & CNTT", code: "TECH", color: "#3B82F6", deskCount: 16 },
    { id: "zone_b", name: "Zone B - Sản phẩm & UI/UX", code: "PROD", color: "#8B5CF6", deskCount: 12 },
    { id: "zone_c", name: "Zone C - Kinh doanh & Marketing", code: "SALES", color: "#10B981", deskCount: 12 },
    { id: "zone_d", name: "Zone D - Ban Lãnh đạo & Nhân sự", code: "EXEC", color: "#F59E0B", deskCount: 8 },
  ];

  // Danh sách bàn làm việc mô phỏng
  const [seats, setSeats] = useState<SeatItem[]>([
    // Zone A - Cụm bàn 1 & 2
    {
      id: "seat_a101",
      code: "Bàn A-101",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 1,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 160,
      y: 140,
      assets: ["Màn hình 27\" Dell 4K", "Bàn nâng hạ thông minh SmartDesk", "Cổng sạc Type-C 100W"],
      amenities: ["Gần cửa sổ đón nắng", "Cổng LAN 1Gbps", "Ổ cắm chuẩn Quốc tế"]
    },
    {
      id: "seat_a102",
      code: "Bàn A-102",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 2,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 230,
      y: 140,
      occupant: {
        id: "emp_01",
        name: "Phạm Minh Tuấn",
        role: "Senior Fullstack Lead",
        department: "Ban Công nghệ (FSI R&D)",
        avatar: "/avatars/emp_1.jpg",
        email: "tuan.pham@cyclosa.vn",
        phone: "0974 567 890"
      },
      assets: ["2 Màn hình Dell 27\"", "Ghế Herman Miller Aeron", "Bàn phím cơ Keychron Q1"],
      amenities: ["Đường truyền ưu tiên", "View Landmark 72", "Cổng LAN 1Gbps"]
    },
    {
      id: "seat_a103",
      code: "Bàn A-103",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 3,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 300,
      y: 140,
      occupant: {
        id: "emp_02",
        name: "Trần Bảo Ngọc",
        role: "DevOps & Cloud Engineer",
        department: "Ban Hạ tầng Cloud",
        avatar: "",
        email: "ngoc.tran@cyclosa.vn",
        phone: "0982 111 222"
      },
      assets: ["Màn hình LG 34\" Ultrawide", "Ghế Ergonomic", "Laptop Stand"],
      amenities: ["Cổng LAN 10Gbps", "Trạm sạc nhanh đa năng"]
    },
    {
      id: "seat_a104",
      code: "Bàn A-104",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 4,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 370,
      y: 140,
      assets: ["Màn hình 24\" FHD", "Bàn phím không dây"],
      amenities: ["Cổng cắm Type-C"]
    },
    // Row 2 Zone A
    {
      id: "seat_a201",
      code: "Bàn A-201",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 5,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 160,
      y: 200,
      assets: ["Màn hình 27\" Dell 4K"],
      amenities: ["Cổng LAN 1Gbps"]
    },
    {
      id: "seat_a202",
      code: "Bàn A-202",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 6,
      type: "HOT_DESK",
      status: "MAINTENANCE",
      x: 230,
      y: 200,
      assets: ["Màn hình Dell (Lỗi cáp nguồn)", "Bàn nâng hạ (Cần cân chỉnh)"],
      amenities: ["Đang chờ bộ phận IT xử lý"],
      lastMaintenance: "07/10/2026 - Sự cố chập nguồn sạc"
    },
    {
      id: "seat_a203",
      code: "Bàn A-203",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 7,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 300,
      y: 200,
      occupant: {
        id: "emp_03",
        name: "Lê Hoàng Long",
        role: "Frontend Developer",
        department: "Ban Công nghệ (FSI R&D)",
        avatar: "",
        email: "long.le@cyclosa.vn",
        phone: "0912 345 678"
      },
      assets: ["Màn hình 27\" Asus ProArt", "Ghế Ergonomic"],
      amenities: ["Cổng LAN 1Gbps"]
    },
    {
      id: "seat_a204",
      code: "Bàn A-204",
      zoneId: "zone_a",
      zoneName: "Zone A - Kỹ thuật & CNTT",
      row: "A",
      col: 8,
      type: "HOT_DESK",
      status: "BLOCKED",
      x: 370,
      y: 200,
      assets: ["Bàn làm việc", "Màn hình 24\""],
      amenities: ["Khu vực dự trữ đợt Onboarding mới"]
    },

    // Zone B - Sản phẩm & UI/UX
    {
      id: "seat_b101",
      code: "Bàn B-101",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 1,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 520,
      y: 140,
      occupant: {
        id: "emp_04",
        name: "Nguyễn Thu Hà",
        role: "Lead Product Designer",
        department: "Ban Thiết kế Trải nghiệm",
        avatar: "",
        email: "ha.nguyen@cyclosa.vn",
        phone: "0904 999 888"
      },
      assets: ["Apple Studio Display 27\" 5K", "Bảng vẽ Wacom Cintiq 16", "Ghế Ergonomic"],
      amenities: ["Đèn chiếu sáng màu chuẩn D65", "Cổng kết nối Thunderbolt 4"]
    },
    {
      id: "seat_b102",
      code: "Bàn B-102",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 2,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 590,
      y: 140,
      assets: ["Màn hình 27\" 4K DCI-P3 98%"],
      amenities: ["Gần bảng thảo luận Brainstorm"]
    },
    {
      id: "seat_b103",
      code: "Bàn B-103",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 3,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 660,
      y: 140,
      assets: ["Màn hình 27\" Dell 4K"],
      amenities: ["Cổng sạc Type-C 90W"]
    },
    {
      id: "seat_b104",
      code: "Bàn B-104",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 4,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 730,
      y: 140,
      assets: ["Màn hình 27\" Dell 4K"],
      amenities: ["Gần cửa sổ"]
    },
    {
      id: "seat_b201",
      code: "Bàn B-201",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 5,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 520,
      y: 200,
      occupant: {
        id: "emp_05",
        name: "Vũ Đình Trọng",
        role: "Senior Product Owner",
        department: "Khối Quản trị Sản phẩm",
        avatar: "",
        email: "trong.vu@cyclosa.vn",
        phone: "0936 123 789"
      },
      assets: ["Màn hình 27\" UltraSharp", "Micro hội nghị chống ồn"],
      amenities: ["Gần phòng họp Quick Sync"]
    },
    {
      id: "seat_b202",
      code: "Bàn B-202",
      zoneId: "zone_b",
      zoneName: "Zone B - Sản phẩm & UI/UX",
      row: "B",
      col: 6,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 590,
      y: 200,
      assets: ["Màn hình 27\""],
      amenities: ["Ổ cắm sạc đa năng"]
    },

    // Zone C - Kinh doanh & Marketing
    {
      id: "seat_c101",
      code: "Bàn C-101",
      zoneId: "zone_c",
      zoneName: "Zone C - Kinh doanh & Marketing",
      row: "C",
      col: 1,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 160,
      y: 330,
      occupant: {
        id: "emp_06",
        name: "Đỗ Kim Oanh",
        role: "Head of Enterprise Sales",
        department: "Ban Khách hàng Doanh nghiệp",
        avatar: "",
        email: "oanh.do@cyclosa.vn",
        phone: "0968 888 666"
      },
      assets: ["Màn hình 27\" Dell", "Điện thoại bàn IP Phone"],
      amenities: ["Khu vực đàm thoại cách âm tiêu chuẩn"]
    },
    {
      id: "seat_c102",
      code: "Bàn C-102",
      zoneId: "zone_c",
      zoneName: "Zone C - Kinh doanh & Marketing",
      row: "C",
      col: 2,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 230,
      y: 330,
      assets: ["Màn hình 24\" FHD"],
      amenities: ["Wifi Roaming siêu tốc"]
    },
    {
      id: "seat_c103",
      code: "Bàn C-103",
      zoneId: "zone_c",
      zoneName: "Zone C - Kinh doanh & Marketing",
      row: "C",
      col: 3,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 300,
      y: 330,
      assets: ["Màn hình 24\" FHD"],
      amenities: ["Gần máy in tài liệu"]
    },
    {
      id: "seat_c104",
      code: "Bàn C-104",
      zoneId: "zone_c",
      zoneName: "Zone C - Kinh doanh & Marketing",
      row: "C",
      col: 4,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 370,
      y: 330,
      assets: ["Màn hình 24\" FHD"],
      amenities: ["Ổ cắm điện thoại"]
    },

    // Zone D - Lãnh đạo & Nhân sự
    {
      id: "seat_d101",
      code: "Bàn D-101",
      zoneId: "zone_d",
      zoneName: "Zone D - Ban Lãnh đạo & Nhân sự",
      row: "D",
      col: 1,
      type: "VIP_DESK",
      status: "OCCUPIED",
      x: 520,
      y: 330,
      occupant: {
        id: "emp_07",
        name: "Hoàng Gia Bách",
        role: "Giám đốc Vận hành (COO)",
        department: "Ban Tổng Giám đốc",
        avatar: "",
        email: "bach.hoang@cyclosa.vn",
        phone: "0903 000 111"
      },
      assets: ["Bàn Giám đốc Gỗ sồi 2m", "Màn hình Dell 32\" 4K", "Tủ hồ sơ bảo mật điện tử"],
      amenities: ["Phòng nhìn toàn cảnh phía Tây", "Cửa kính điện đổi màu"]
    },
    {
      id: "seat_d102",
      code: "Bàn D-102",
      zoneId: "zone_d",
      zoneName: "Zone D - Ban Lãnh đạo & Nhân sự",
      row: "D",
      col: 2,
      type: "FIXED_DESK",
      status: "OCCUPIED",
      x: 590,
      y: 330,
      occupant: {
        id: "emp_08",
        name: "Ngô Mỹ Linh",
        role: "Trưởng phòng Nhân sự (HRD)",
        department: "Ban Quản trị Nguồn nhân lực",
        avatar: "",
        email: "linh.ngo@cyclosa.vn",
        phone: "0915 222 333"
      },
      assets: ["Màn hình 27\" Dell", "Máy hủy tài liệu cá nhân"],
      amenities: ["Gần phòng phỏng vấn riêng"]
    },
    {
      id: "seat_d103",
      code: "Bàn D-103",
      zoneId: "zone_d",
      zoneName: "Zone D - Ban Lãnh đạo & Nhân sự",
      row: "D",
      col: 3,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 660,
      y: 330,
      assets: ["Màn hình 24\" FHD"],
      amenities: ["Gần tủ locker nhân sự"]
    },
    {
      id: "seat_d104",
      code: "Bàn D-104",
      zoneId: "zone_d",
      zoneName: "Zone D - Ban Lãnh đạo & Nhân sự",
      row: "D",
      col: 4,
      type: "HOT_DESK",
      status: "AVAILABLE",
      x: 730,
      y: 330,
      assets: ["Màn hình 24\" FHD"],
      amenities: ["Cổng sạc Type-C"]
    }
  ]);

  // Phòng họp mô phỏng
  const meetingRooms: MeetingRoomItem[] = [
    {
      id: "room_board",
      code: "MR-01",
      name: "Phòng Họp Hội Đồng (Board Room)",
      capacity: 18,
      status: "OCCUPIED",
      x: 820,
      y: 90,
      w: 190,
      h: 150,
      currentBooking: {
        title: "Họp Chiến lược Kinh doanh Q4",
        host: "Nguyễn Văn An (Tổng Giám Đốc)",
        time: "14:00 - 16:30"
      },
      amenities: ["Hệ thống Cisco Webex 4K", "Màn hình tương tác 85\"", "Bảng kính từ tính", "Hệ thống loa đa vùng âm trần"]
    },
    {
      id: "room_innovation",
      code: "MR-02",
      name: "Phòng Họp Sáng Tạo (Innovation)",
      capacity: 8,
      status: "FREE",
      x: 820,
      y: 260,
      w: 190,
      h: 120,
      amenities: ["TV Samsung 65\" 4K", "Micro định hướng Shure", "Whiteboard 3m", "Cáp kết nối HDMI/Type-C"]
    },
    {
      id: "room_booth_1",
      code: "PB-01",
      name: "Phonebooth #1 (Focus Box)",
      capacity: 1,
      status: "FREE",
      x: 820,
      y: 400,
      w: 90,
      h: 70,
      amenities: ["Vách cách âm chuẩn -35dB", "Ghế Bar nâng hạ", "Đèn chiếu sáng chuyên đàm thoại"]
    },
    {
      id: "room_booth_2",
      code: "PB-02",
      name: "Phonebooth #2 (Focus Box)",
      capacity: 1,
      status: "OCCUPIED",
      x: 920,
      y: 400,
      w: 90,
      h: 70,
      currentBooking: {
        title: "Cuộc gọi phỏng vấn ứng viên",
        host: "Trần Mai Phương (Recruiter)",
        time: "14:15 - 14:45"
      },
      amenities: ["Vách cách âm chuẩn -35dB", "Cổng sạc đa năng"]
    }
  ];

  // Các tiện ích văn phòng (Thang máy, WC, Pantry, Máy in...)
  const facilities: FacilityItem[] = [
    { id: "fac_lift_1", name: "Thang Máy Trung Tâm (4 Cabin)", type: "ELEVATOR", x: 20, y: 110, w: 90, h: 100 },
    { id: "fac_stairs", name: "Cầu Thang Bộ Thoát Hiểm", type: "STAIRS", x: 20, y: 220, w: 90, h: 70 },
    { id: "fac_pantry", name: "Pantry & Coffee Corner", type: "PANTRY", x: 20, y: 310, w: 90, h: 160 },
    { id: "fac_wc_m", name: "Nhà Vệ Sinh Nam", type: "WC", x: 160, y: 410, w: 100, h: 60 },
    { id: "fac_wc_f", name: "Nhà Vệ Sinh Nữ", type: "WC", x: 280, y: 410, w: 100, h: 60 },
    { id: "fac_printer", name: "Cụm Máy In & Số Hóa", type: "PRINTER", x: 440, y: 240, w: 50, h: 45 },
    { id: "fac_locker", name: "Tủ Đồ Cá Nhân Thông Minh", type: "LOCKER", x: 400, y: 410, w: 100, h: 60 },
  ];

  // Lọc danh sách bàn
  const filteredSeats = useMemo(() => {
    return seats.filter((seat) => {
      // Lọc theo Zone
      if (selectedZoneFilter !== "ALL" && seat.zoneId !== selectedZoneFilter) {
        return false;
      }
      // Lọc theo Trạng thái
      if (selectedStatusFilter !== "ALL" && seat.status !== selectedStatusFilter) {
        return false;
      }
      // Lọc theo Từ khóa tìm kiếm
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchCode = seat.code.toLowerCase().includes(term);
        const matchOccupant = seat.occupant?.name.toLowerCase().includes(term);
        const matchDept = seat.occupant?.department.toLowerCase().includes(term);
        return matchCode || matchOccupant || matchDept;
      }
      return true;
    });
  }, [seats, selectedZoneFilter, selectedStatusFilter, searchTerm]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = seats.length;
    const available = seats.filter((s) => s.status === "AVAILABLE").length;
    const occupied = seats.filter((s) => s.status === "OCCUPIED").length;
    const maintenance = seats.filter((s) => s.status === "MAINTENANCE").length;
    const blocked = seats.filter((s) => s.status === "BLOCKED").length;
    const occupancyRate = Math.round((occupied / total) * 100);
    return { total, available, occupied, maintenance, blocked, occupancyRate };
  }, [seats]);

  // Thao tác với Chỗ ngồi
  const handleSelectSeat = (seat: SeatItem) => {
    setSelectedSeat(seat);
    setSelectedRoom(null);
  };

  const handleSelectRoom = (room: MeetingRoomItem) => {
    setSelectedRoom(room);
    setSelectedSeat(null);
  };

  const handleBookHotdesk = () => {
    if (!selectedSeat) return;
    if (selectedSeat.status !== "AVAILABLE") {
      toast.error("Bàn này hiện không thể đặt linh hoạt.");
      return;
    }
    setSeats((prev) =>
      prev.map((s) =>
        s.id === selectedSeat.id
          ? {
              ...s,
              status: "OCCUPIED",
              occupant: {
                id: "emp_me",
                name: "Nguyễn Văn An (Bạn)",
                role: "Product Strategy & Management",
                department: "Ban Điều Hành",
                avatar: "",
                email: "an.nguyen@cyclosa.vn",
                phone: "0901 234 567"
              }
            }
          : s
      )
    );
    setSelectedSeat((prev) =>
      prev
        ? {
            ...prev,
            status: "OCCUPIED",
            occupant: {
              id: "emp_me",
              name: "Nguyễn Văn An (Bạn)",
              role: "Product Strategy & Management",
              department: "Ban Điều Hành",
              avatar: "",
              email: "an.nguyen@cyclosa.vn",
              phone: "0901 234 567"
            }
          }
        : null
    );
    toast.success(`Đặt bàn thành công! Đã cấp quyền sử dụng ${selectedSeat.code} cho hôm nay.`);
  };

  const handleToggleMaintenance = () => {
    if (!selectedSeat) return;
    const newStatus: SeatStatus = selectedSeat.status === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeat.id ? { ...s, status: newStatus } : s))
    );
    setSelectedSeat((prev) => (prev ? { ...prev, status: newStatus } : null));
    toast.info(
      newStatus === "MAINTENANCE"
        ? `Đã chuyển ${selectedSeat.code} sang chế độ BẢO TRÌ cơ sở vật chất.`
        : `Đã kết thúc bảo trì, ${selectedSeat.code} đã sẵn sàng sử dụng.`
    );
  };

  const handleToggleBlock = () => {
    if (!selectedSeat) return;
    const newStatus: SeatStatus = selectedSeat.status === "BLOCKED" ? "AVAILABLE" : "BLOCKED";
    setSeats((prev) =>
      prev.map((s) => (s.id === selectedSeat.id ? { ...s, status: newStatus } : s))
    );
    setSelectedSeat((prev) => (prev ? { ...prev, status: newStatus } : null));
    toast.info(
      newStatus === "BLOCKED"
        ? `Đã KHÓA ${selectedSeat.code} cho mục đích nội bộ.`
        : `Đã MỞ KHÓA ${selectedSeat.code}.`
    );
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-10">
      {/* ── 1. Thanh Trên: Tiêu đề & Điều khiển Không gian ────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span>Sơ đồ chỗ ngồi & Bản đồ số 2D</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Floor Plan 2D Live
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Bản đồ tương tác thời gian thực: phân khu, cụm bàn, phòng họp và hiện trạng cơ sở vật chất.
          </p>
        </div>

        {/* Thanh công cụ chọn cơ sở, chọn tầng & tìm kiếm */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Chọn Cơ sở */}
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1 border border-border text-xs">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="bg-transparent border-none text-foreground font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="hn_keangnam">Trụ sở Hà Nội (Keangnam Landmark 72)</option>
              <option value="hcm_bitexco">Chi nhánh TP.HCM (Bitexco Tower)</option>
              <option value="dn_indochina">Văn phòng Đà Nẵng (Indochina Riverside)</option>
            </select>
          </div>

          {/* Chọn Tầng */}
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1 border border-border text-xs">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="bg-transparent border-none text-foreground font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="floor_1">Tầng 1 - Sảnh & Reception</option>
              <option value="floor_2">Tầng 2 - Khối Vận Hành & Khách Hàng</option>
              <option value="floor_3">Tầng 3 - Khối Công Nghệ & R&D</option>
              <option value="floor_4">Tầng 4 - Khối Ban Lãnh Đạo</option>
            </select>
          </div>

          {/* Ô tìm kiếm nhanh */}
          <div className="relative w-48 sm:w-60">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm mã bàn, nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-card"
            />
          </div>

          {/* Nút Chỉnh sửa Editor (dành cho Admin) */}
          <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1">
            <Link href="/workplace/admin/floors/fl_01/editor">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Chỉnh sửa bản đồ</span>
            </Link>
          </Button>

          {/* Nút Đặt bàn Hotdesk */}
          <Button asChild size="sm" className="h-8 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Link href="/workplace/desk-booking">
              <Calendar className="h-3.5 w-3.5" />
              <span>Đặt bàn Hotdesk</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. Thẻ KPI Tổng Quan Nhanh ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Tổng chỗ ngồi</span>
            <div className="text-xl font-bold font-mono text-foreground mt-0.5">{stats.total} bàn</div>
            <span className="text-[10px] text-muted-foreground">Thiết kế chuẩn</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đang trống</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{stats.available}</div>
            <span className="text-[10px] text-muted-foreground">Sẵn sàng đặt</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Đang sử dụng</span>
            </div>
            <div className="text-xl font-bold font-mono text-primary mt-0.5">{stats.occupied}</div>
            <span className="text-[10px] text-muted-foreground">Cố định & Hotdesk</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Đang bảo trì</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{stats.maintenance}</div>
            <span className="text-[10px] text-muted-foreground">Cần sửa chữa</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span>Bị khóa / Dự phòng</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-600 mt-0.5">{stats.blocked}</div>
            <span className="text-[10px] text-muted-foreground">Dành cho Onboarding</span>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs py-1">
          <CardContent className="p-3">
            <span className="text-[11px] text-muted-foreground font-medium">Tỷ lệ lấp đầy</span>
            <div className="text-xl font-bold font-mono text-primary mt-0.5">{stats.occupancyRate}%</div>
            {/* Progress bar đỏ CYCLOSA */}
            <div className="w-full bg-red-100 dark:bg-red-950/40 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${stats.occupancyRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. KHUNG CHÍNH 3 CỘT (Sidebar Trái - Canvas 2D Trung Tâm - Panel Phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── CỘT 1: SIDEBAR TRÁI: CƠ CẤU KHÔNG GIAN (2.5 cols) ───── */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/30">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary" />
                  <span>Cơ cấu không gian (Hierarchy)</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Tầng 3</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3 space-y-3 text-xs">
              {/* Cây phân cấp không gian */}
              <div className="space-y-1 font-sans">
                {/* Cơ sở */}
                <div className="flex items-center gap-1.5 text-foreground font-semibold px-2 py-1 rounded bg-muted/40">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Trụ sở Keangnam Hà Nội</span>
                </div>

                {/* Tầng */}
                <div className="pl-4 pt-1 space-y-1 border-l-2 border-border ml-3">
                  <div className="flex items-center justify-between text-foreground font-medium px-2 py-1 rounded bg-red-50/60 dark:bg-red-950/30 text-primary">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3 w-3" />
                      <span>Tầng 3 (Công nghệ & R&D)</span>
                    </span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1 border-red-200 text-primary">
                      {seats.length} bàn
                    </Badge>
                  </div>

                  {/* Danh sách các Phân khu (Zones) */}
                  <div className="pl-4 space-y-1 border-l border-border ml-2 pt-1">
                    <button
                      onClick={() => setSelectedZoneFilter("ALL")}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1 rounded text-left text-xs transition-colors",
                        selectedZoneFilter === "ALL"
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>Tất cả phân khu</span>
                      <span className="text-[10px]">{seats.length}</span>
                    </button>

                    {zones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZoneFilter(zone.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2 py-1 rounded text-left text-xs transition-colors",
                          selectedZoneFilter === zone.id
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="truncate">{zone.name}</span>
                        </span>
                        <span className="text-[10px] shrink-0 font-mono">
                          {seats.filter((s) => s.zoneId === zone.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bộ lọc trạng thái nhanh */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Lọc theo trạng thái
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    variant={selectedStatusFilter === "ALL" ? "default" : "outline"}
                    onClick={() => setSelectedStatusFilter("ALL")}
                    className={cn(
                      "h-7 text-[11px] px-2",
                      selectedStatusFilter === "ALL" && "bg-primary text-primary-foreground"
                    )}
                  >
                    Tất cả ({seats.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedStatusFilter === "AVAILABLE" ? "default" : "outline"}
                    onClick={() => setSelectedStatusFilter("AVAILABLE")}
                    className={cn(
                      "h-7 text-[11px] px-2 text-emerald-700 hover:text-emerald-800 border-emerald-200",
                      selectedStatusFilter === "AVAILABLE" && "bg-emerald-600 text-white"
                    )}
                  >
                    Trống ({stats.available})
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedStatusFilter === "OCCUPIED" ? "default" : "outline"}
                    onClick={() => setSelectedStatusFilter("OCCUPIED")}
                    className={cn(
                      "h-7 text-[11px] px-2 text-red-600 hover:text-red-700 border-red-200",
                      selectedStatusFilter === "OCCUPIED" && "bg-primary text-white"
                    )}
                  >
                    Đang ngồi ({stats.occupied})
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedStatusFilter === "MAINTENANCE" ? "default" : "outline"}
                    onClick={() => setSelectedStatusFilter("MAINTENANCE")}
                    className={cn(
                      "h-7 text-[11px] px-2 text-amber-700 hover:text-amber-800 border-amber-200",
                      selectedStatusFilter === "MAINTENANCE" && "bg-amber-600 text-white"
                    )}
                  >
                    Bảo trì ({stats.maintenance})
                  </Button>
                </div>
              </div>

              {/* Tiện ích trên tầng */}
              <div className="pt-2 border-t border-border space-y-1 text-[11px] text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider block">Tiện ích tầng 3</span>
                <div className="flex items-center gap-1.5 py-0.5">
                  <Coffee className="h-3.5 w-3.5 text-amber-600" />
                  <span>1 Pantry & Coffee Bar</span>
                </div>
                <div className="flex items-center gap-1.5 py-0.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" />
                  <span>2 Phòng họp & 2 Phonebooth</span>
                </div>
                <div className="flex items-center gap-1.5 py-0.5">
                  <Printer className="h-3.5 w-3.5 text-purple-600" />
                  <span>1 Cụm máy in đa năng</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── CỘT 2: KHU VỰC TRUNG TÂM: CANVAS FLOOR PLAN 2D (6 cols) ── */}
        <div className="lg:col-span-6 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden flex flex-col h-[740px]">
            {/* Header Canvas: Chế độ xem & Điều khiển Zoom */}
            <div className="py-2.5 px-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  <span>Floor Plan Canvas 2D</span>
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                  Tỷ lệ 1:100 • 1050 × 520 px
                </span>
              </div>

              {/* Bộ điều khiển thu phóng & reset */}
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
                  title="Thu nhỏ"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] font-mono font-medium px-1.5 text-muted-foreground">
                  {zoomLevel}%
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
                  title="Phóng to"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 ml-1"
                  onClick={() => setZoomLevel(100)}
                  title="Reset 100%"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Vùng Canvas cuộn tương tác (Interactive Canvas Area) */}
            <div className="flex-1 overflow-auto bg-slate-50/70 dark:bg-slate-950/40 p-4 relative flex items-center justify-center">
              {/* BẢN VẼ FLOOR PLAN 2D */}
              <div
                className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md transition-transform duration-200 origin-center"
                style={{
                  width: "1050px",
                  height: "520px",
                  transform: `scale(${zoomLevel / 100})`,
                  backgroundImage:
                    "radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              >
                {/* 1. Viền phân khu (Zone Boundaries) */}
                {/* Zone A: Tech Hub */}
                <div
                  className={cn(
                    "absolute border-2 border-dashed rounded-xl pointer-events-none transition-all",
                    selectedZoneFilter === "zone_a"
                      ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/30"
                      : "border-blue-200 dark:border-blue-900/40 bg-blue-50/15"
                  )}
                  style={{ left: "140px", top: "80px", width: "320px", height: "180px" }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-200">
                    Zone A • Kỹ thuật & CNTT
                  </span>
                </div>

                {/* Zone B: Product & Design */}
                <div
                  className={cn(
                    "absolute border-2 border-dashed rounded-xl pointer-events-none transition-all",
                    selectedZoneFilter === "zone_b"
                      ? "border-purple-500 bg-purple-50/40 dark:bg-purple-950/30"
                      : "border-purple-200 dark:border-purple-900/40 bg-purple-50/15"
                  )}
                  style={{ left: "500px", top: "80px", width: "290px", height: "180px" }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-purple-200">
                    Zone B • Sản phẩm & UI/UX
                  </span>
                </div>

                {/* Zone C: Sales & Marketing */}
                <div
                  className={cn(
                    "absolute border-2 border-dashed rounded-xl pointer-events-none transition-all",
                    selectedZoneFilter === "zone_c"
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30"
                      : "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/15"
                  )}
                  style={{ left: "140px", top: "290px", width: "320px", height: "100px" }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-emerald-200">
                    Zone C • Kinh doanh & MKT
                  </span>
                </div>

                {/* Zone D: Executive & HR */}
                <div
                  className={cn(
                    "absolute border-2 border-dashed rounded-xl pointer-events-none transition-all",
                    selectedZoneFilter === "zone_d"
                      ? "border-amber-500 bg-amber-50/40 dark:bg-amber-950/30"
                      : "border-amber-200 dark:border-amber-900/40 bg-amber-50/15"
                  )}
                  style={{ left: "500px", top: "290px", width: "290px", height: "100px" }}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-bold text-amber-600 uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-200">
                    Zone D • Ban Giám Đốc & HR
                  </span>
                </div>

                {/* 2. Tiện ích văn phòng (Facilities: Elevator, WC, Pantry...) */}
                {facilities.map((fac) => {
                  let Icon = Info;
                  let colorClass = "bg-slate-100 text-slate-700 border-slate-300";
                  if (fac.type === "ELEVATOR") {
                    Icon = ArrowUpRight;
                    colorClass = "bg-slate-100 text-slate-800 border-slate-300 font-semibold";
                  } else if (fac.type === "STAIRS") {
                    Icon = Layers;
                    colorClass = "bg-slate-100 text-slate-700 border-slate-300";
                  } else if (fac.type === "PANTRY") {
                    Icon = Coffee;
                    colorClass = "bg-amber-50 text-amber-800 border-amber-300";
                  } else if (fac.type === "PRINTER") {
                    Icon = Printer;
                    colorClass = "bg-purple-50 text-purple-700 border-purple-300";
                  } else if (fac.type === "LOCKER") {
                    Icon = Lock;
                    colorClass = "bg-blue-50 text-blue-700 border-blue-300";
                  }

                  return (
                    <div
                      key={fac.id}
                      className={cn(
                        "absolute rounded-lg border flex flex-col items-center justify-center p-1.5 text-center transition-all shadow-2xs",
                        colorClass
                      )}
                      style={{
                        left: `${fac.x}px`,
                        top: `${fac.y}px`,
                        width: `${fac.w}px`,
                        height: `${fac.h}px`
                      }}
                    >
                      <Icon className="h-4 w-4 mb-1 opacity-80" />
                      <span className="text-[10px] font-medium leading-tight">{fac.name}</span>
                    </div>
                  );
                })}

                {/* 3. Phòng Họp (Meeting Rooms) */}
                {meetingRooms.map((room) => {
                  const isSelected = selectedRoom?.id === room.id;
                  const isOccupied = room.status === "OCCUPIED";

                  return (
                    <div
                      key={room.id}
                      onClick={() => handleSelectRoom(room)}
                      className={cn(
                        "absolute rounded-xl border-2 p-2.5 flex flex-col justify-between cursor-pointer transition-all shadow-xs",
                        isSelected && "ring-2 ring-primary ring-offset-2",
                        isOccupied
                          ? "bg-red-50/70 border-red-300 text-red-950 dark:bg-red-950/30 dark:border-red-800"
                          : "bg-emerald-50/70 border-emerald-300 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800"
                      )}
                      style={{
                        left: `${room.x}px`,
                        top: `${room.y}px`,
                        width: `${room.w}px`,
                        height: `${room.h}px`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold truncate">{room.name}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 py-0 h-4 border",
                            isOccupied
                              ? "bg-primary text-white border-primary"
                              : "bg-emerald-600 text-white border-emerald-600"
                          )}
                        >
                          {isOccupied ? "ĐANG HỌP" : "TRỐNG"}
                        </Badge>
                      </div>

                      {/* Bàn họp bầu dục mô phỏng ở giữa */}
                      <div className="h-6 w-3/4 mx-auto rounded-full bg-slate-200/80 dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[9px] text-muted-foreground font-mono">
                        {room.capacity} chỗ ngồi
                      </div>

                      <div className="text-[10px] text-muted-foreground truncate">
                        {room.currentBooking ? (
                          <span className="text-red-700 font-medium">
                            {room.currentBooking.time} • {room.currentBooking.title}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">Sẵn sàng đặt lịch</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* 4. Chỗ ngồi làm việc (Seats & Desks) */}
                {seats.map((seat) => {
                  const isSelected = selectedSeat?.id === seat.id;
                  const isFiltered = filteredSeats.some((s) => s.id === seat.id);

                  // Màu sắc theo trạng thái
                  let statusBg = "bg-emerald-100 border-emerald-400 text-emerald-900"; // AVAILABLE
                  let dotColor = "bg-emerald-500";
                  if (seat.status === "OCCUPIED") {
                    statusBg = "bg-red-100 border-red-400 text-red-950"; // OCCUPIED (Đỏ CYCLOSA)
                    dotColor = "bg-primary";
                  } else if (seat.status === "MAINTENANCE") {
                    statusBg = "bg-amber-100 border-amber-400 text-amber-950"; // MAINTENANCE
                    dotColor = "bg-amber-500";
                  } else if (seat.status === "BLOCKED") {
                    statusBg = "bg-slate-200 border-slate-400 text-slate-800"; // BLOCKED
                    dotColor = "bg-slate-500";
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSelectSeat(seat)}
                      className={cn(
                        "absolute h-12 w-14 rounded-lg border-2 flex flex-col items-center justify-between p-1 transition-all duration-150 cursor-pointer shadow-2xs group",
                        statusBg,
                        isSelected && "ring-2 ring-primary ring-offset-2 scale-105 z-20",
                        !isFiltered && "opacity-25 grayscale"
                      )}
                      style={{
                        left: `${seat.x}px`,
                        top: `${seat.y}px`
                      }}
                      title={`${seat.code} - ${seat.status} - ${seat.occupant?.name || "Chưa có người"}`}
                    >
                      {/* Mã bàn & chấm trạng thái */}
                      <div className="w-full flex items-center justify-between">
                        <span className="text-[9px] font-bold font-mono leading-none">
                          {seat.code.replace("Bàn ", "")}
                        </span>
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
                      </div>

                      {/* Icon hoặc Tên rút gọn */}
                      <div className="w-full text-center truncate">
                        {seat.occupant ? (
                          <span className="text-[9px] font-medium block truncate max-w-full">
                            {seat.occupant.name.split(" ").slice(-1)[0]}
                          </span>
                        ) : (
                          <span className="text-[8px] text-muted-foreground block">
                            {seat.type === "HOT_DESK" ? "Hotdesk" : "Cố định"}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Lối đi chính (Main Corridors label) */}
                <div className="absolute top-[260px] left-[150px] right-[250px] h-6 flex items-center justify-center text-[10px] text-muted-foreground/60 tracking-widest uppercase pointer-events-none">
                  ── LỐI ĐI CHÍNH (MAIN CORRIDOR) ──
                </div>
              </div>
            </div>

            {/* ── THANH TRẠNG THÁI & CHÚ THÍCH DƯỚI CHÂN CANVAS (Legend) ── */}
            <div className="py-2.5 px-4 border-t border-border bg-card flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Chú thích:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-400" />
                  <span className="text-foreground">Trống ({stats.available})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-red-100 border border-red-400" />
                  <span className="text-foreground font-medium text-primary">Đang sử dụng ({stats.occupied})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-amber-100 border border-amber-400" />
                  <span className="text-foreground">Bảo trì ({stats.maintenance})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-slate-200 border border-slate-400" />
                  <span className="text-foreground">Bị khóa ({stats.blocked})</span>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Nhấp chuột vào bất kỳ bàn hoặc phòng họp để xem chi tiết đối soát</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ── CỘT 3: PANEL PHẢI: THÔNG TIN CHỖ NGỒI CHI TIẾT (3 cols) ── */}
        <div className="lg:col-span-3 space-y-3">
          {/* Card Thông tin Chỗ ngồi hoặc Phòng họp */}
          {selectedSeat ? (
            <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Monitor className="h-4 w-4 text-primary" />
                    <span>Chi tiết chỗ ngồi</span>
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">{selectedSeat.zoneName}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 border",
                    selectedSeat.status === "AVAILABLE" && "bg-emerald-50 text-emerald-700 border-emerald-300",
                    selectedSeat.status === "OCCUPIED" && "bg-red-50 text-primary border-red-300",
                    selectedSeat.status === "MAINTENANCE" && "bg-amber-50 text-amber-700 border-amber-300",
                    selectedSeat.status === "BLOCKED" && "bg-slate-100 text-slate-700 border-slate-300"
                  )}
                >
                  {selectedSeat.status === "AVAILABLE" && "● TRỐNG"}
                  {selectedSeat.status === "OCCUPIED" && "● ĐANG SỬ DỤNG"}
                  {selectedSeat.status === "MAINTENANCE" && "● ĐANG BẢO TRÌ"}
                  {selectedSeat.status === "BLOCKED" && "● BỊ KHÓA"}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* 1. Header Bàn */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Mã định danh bàn</span>
                    <strong className="text-lg font-bold font-mono text-foreground">
                      {selectedSeat.code}
                    </strong>
                  </div>
                  <Badge variant="secondary" className="text-[11px]">
                    {selectedSeat.type === "HOT_DESK" && "Hotdesk linh hoạt"}
                    {selectedSeat.type === "FIXED_DESK" && "Bàn cố định"}
                    {selectedSeat.type === "VIP_DESK" && "Bàn Lãnh đạo"}
                  </Badge>
                </div>

                {/* 2. Thông tin Nhân viên được phân bổ */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Nhân viên được phân bổ
                  </span>

                  {selectedSeat.occupant ? (
                    <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                          {selectedSeat.occupant.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <strong className="text-xs font-semibold text-foreground block truncate">
                            {selectedSeat.occupant.name}
                          </strong>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {selectedSeat.occupant.role}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/60 text-[11px] space-y-1 text-muted-foreground">
                        <p>
                          <strong>Phòng ban:</strong> {selectedSeat.occupant.department}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedSeat.occupant.email}
                        </p>
                        <p>
                          <strong>SĐT:</strong> {selectedSeat.occupant.phone}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border border-dashed border-border text-center text-muted-foreground">
                      <User className="h-5 w-5 mx-auto mb-1 opacity-50" />
                      <p className="text-xs font-medium">Chưa phân bổ nhân sự cố định</p>
                      <span className="text-[10px]">Bàn sẵn sàng cho nhân viên đặt Hotdesk</span>
                    </div>
                  )}
                </div>

                {/* 3. Danh mục Tài sản liên kết */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Tài sản liên kết (Hardware)
                  </span>
                  <div className="space-y-1">
                    {selectedSeat.assets.map((asset, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/40 text-[11px] text-foreground"
                      >
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Tiện ích vị trí */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Tiện ích vị trí
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedSeat.amenities.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] font-normal">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 5. Bộ nút Thao tác hành động */}
                <div className="pt-3 border-t border-border space-y-2">
                  {selectedSeat.status === "AVAILABLE" && (
                    <Button
                      onClick={handleBookHotdesk}
                      className="w-full text-xs h-8.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Xác nhận đặt bàn hôm nay</span>
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleMaintenance}
                      className="h-8 text-xs gap-1 text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-200"
                    >
                      <Wrench className="h-3 w-3" />
                      <span>{selectedSeat.status === "MAINTENANCE" ? "Xong bảo trì" : "Báo bảo trì"}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleBlock}
                      className="h-8 text-xs gap-1 text-slate-700 hover:text-slate-900 border-slate-300"
                    >
                      <Lock className="h-3 w-3" />
                      <span>{selectedSeat.status === "BLOCKED" ? "Mở khóa" : "Khóa bàn"}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedRoom ? (
            /* Chi tiết Phòng Họp nếu click vào Phòng họp */
            <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Chi tiết phòng họp</span>
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">{selectedRoom.code}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 border",
                    selectedRoom.status === "FREE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-red-50 text-primary border-red-300"
                  )}
                >
                  {selectedRoom.status === "FREE" ? "● ĐANG TRỐNG" : "● ĐANG HỌP"}
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                <div>
                  <strong className="text-base font-bold text-foreground block">
                    {selectedRoom.name}
                  </strong>
                  <span className="text-xs text-muted-foreground">
                    Sức chứa tối đa: {selectedRoom.capacity} người
                  </span>
                </div>

                {selectedRoom.currentBooking ? (
                  <div className="p-3 rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 space-y-1">
                    <span className="text-[11px] font-bold text-primary block">
                      Cuộc họp đang diễn ra:
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {selectedRoom.currentBooking.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Chủ trì: {selectedRoom.currentBooking.host}
                    </p>
                    <p className="text-[11px] text-primary font-mono">
                      Khung giờ: {selectedRoom.currentBooking.time}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800">
                    Phòng họp đang trống và có thể đặt lịch ngay.
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Trang thiết bị phòng họp
                  </span>
                  <div className="space-y-1">
                    {selectedRoom.amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <Button asChild className="w-full text-xs h-8.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/workplace/admin/room-bookings">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Quản lý lịch phòng họp</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border bg-card shadow-xs rounded-xl p-8 text-center text-muted-foreground">
              <Compass className="h-8 w-8 mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-xs font-medium">Chưa chọn đối tượng</p>
              <span className="text-[11px]">Nhấp vào bất kỳ bàn làm việc hoặc phòng họp trên sơ đồ 2D</span>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
