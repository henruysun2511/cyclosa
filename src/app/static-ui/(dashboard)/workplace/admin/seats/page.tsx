"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Monitor,
  Search,
  Plus,
  Compass,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  Lock,
  User,
  SlidersHorizontal,
  Building2,
  Layers,
  Sparkles,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SeatRecord {
  id: string;
  code: string;
  floor: string;
  zone: string;
  type: "HOT_DESK" | "FIXED_DESK" | "VIP";
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED";
  occupantName?: string;
  occupantRole?: string;
  hardware: string;
  updatedAt: string;
}

export default function SeatsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFloor, setFilterFloor] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  const [seats, setSeats] = useState<SeatRecord[]>([
    {
      id: "s_01",
      code: "Bàn A-101",
      floor: "Tầng 3",
      zone: "Zone A - Kỹ thuật & CNTT",
      type: "HOT_DESK",
      status: "AVAILABLE",
      hardware: "Dell 27\" 4K, SmartDesk, Type-C 100W",
      updatedAt: "Hôm nay, 08:00"
    },
    {
      id: "s_02",
      code: "Bàn A-102",
      floor: "Tầng 3",
      zone: "Zone A - Kỹ thuật & CNTT",
      type: "FIXED_DESK",
      status: "OCCUPIED",
      occupantName: "Phạm Minh Tuấn",
      occupantRole: "Senior Fullstack Lead",
      hardware: "2 Dell 27\", Herman Miller, Keychron",
      updatedAt: "01/10/2026"
    },
    {
      id: "s_03",
      code: "Bàn A-103",
      floor: "Tầng 3",
      zone: "Zone A - Kỹ thuật & CNTT",
      type: "FIXED_DESK",
      status: "OCCUPIED",
      occupantName: "Trần Bảo Ngọc",
      occupantRole: "DevOps Engineer",
      hardware: "LG 34\" Ultrawide, Ergo Chair",
      updatedAt: "02/10/2026"
    },
    {
      id: "s_04",
      code: "Bàn A-202",
      floor: "Tầng 3",
      zone: "Zone A - Kỹ thuật & CNTT",
      type: "HOT_DESK",
      status: "MAINTENANCE",
      hardware: "Lỗi nguồn sạc Type-C",
      updatedAt: "Hôm nay, 09:15"
    },
    {
      id: "s_05",
      code: "Bàn A-204",
      floor: "Tầng 3",
      zone: "Zone A - Kỹ thuật & CNTT",
      type: "HOT_DESK",
      status: "BLOCKED",
      hardware: "Bàn làm việc dự phòng Onboarding",
      updatedAt: "05/10/2026"
    },
    {
      id: "s_06",
      code: "Bàn B-101",
      floor: "Tầng 3",
      zone: "Zone B - Sản phẩm & UI/UX",
      type: "FIXED_DESK",
      status: "OCCUPIED",
      occupantName: "Nguyễn Thu Hà",
      occupantRole: "Lead Product Designer",
      hardware: "Apple Studio Display 27\", Wacom",
      updatedAt: "15/09/2026"
    },
    {
      id: "s_07",
      code: "Bàn B-102",
      floor: "Tầng 3",
      zone: "Zone B - Sản phẩm & UI/UX",
      type: "HOT_DESK",
      status: "AVAILABLE",
      hardware: "Màn hình 27\" 4K DCI-P3 98%",
      updatedAt: "Hôm nay, 08:30"
    },
    {
      id: "s_08",
      code: "Bàn D-101",
      floor: "Tầng 3",
      zone: "Zone D - Lãnh đạo & Nhân sự",
      type: "VIP",
      status: "OCCUPIED",
      occupantName: "Hoàng Gia Bách",
      occupantRole: "Giám đốc Vận hành (COO)",
      hardware: "Bàn Gỗ sồi 2m, Dell 32\" 4K, Tủ hồ sơ",
      updatedAt: "01/01/2026"
    }
  ]);

  const filteredSeats = useMemo(() => {
    return seats.filter((s) => {
      if (filterFloor !== "ALL" && s.floor !== filterFloor) return false;
      if (filterStatus !== "ALL" && s.status !== filterStatus) return false;
      if (filterType !== "ALL" && s.type !== filterType) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          s.code.toLowerCase().includes(term) ||
          s.zone.toLowerCase().includes(term) ||
          (s.occupantName && s.occupantName.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [seats, filterFloor, filterStatus, filterType, searchTerm]);

  const handleToggleStatus = (seatId: string, newStatus: SeatRecord["status"]) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === seatId ? { ...s, status: newStatus } : s))
    );
    toast.success("Đã cập nhật trạng thái bàn làm việc!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Monitor className="h-6 w-6 text-primary" />
              <span>Quản lý Bàn làm việc</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Office Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị danh mục bàn, phân bổ nhân sự cố định, cấu hình Hotdesk và trạng thái kỹ thuật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8.5 text-xs gap-1.5">
            <Link href="/workplace/map">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Xem trên Bản đồ 2D</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs">
            <Link href="/workplace/admin/floors/fl_03/editor">
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm bàn trên Editor</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Tổng số bàn</span>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">84</div>
              <span className="text-[11px] text-muted-foreground">Toàn bộ tòa nhà</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <Monitor className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Bàn đang trống</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">28</div>
              <span className="text-[11px] text-muted-foreground">Sẵn sàng đặt Hotdesk</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Đang sử dụng</span>
              <div className="text-2xl font-bold font-mono text-primary mt-0.5">48</div>
              <span className="text-[11px] text-muted-foreground">Tỷ lệ lấp đầy: 57%</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-primary flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Bảo trì & Khóa</span>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-0.5">8</div>
              <span className="text-[11px] text-muted-foreground">4 bảo trì • 4 dự phòng</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Bộ lọc & Bảng danh sách ─────────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm kiếm mã bàn, nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Lọc Tầng */}
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả tầng</option>
              <option value="Tầng 1">Tầng 1</option>
              <option value="Tầng 2">Tầng 2</option>
              <option value="Tầng 3">Tầng 3</option>
            </select>

            {/* Lọc Trạng thái */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="AVAILABLE">Trống</option>
              <option value="OCCUPIED">Đang ngồi</option>
              <option value="MAINTENANCE">Bảo trì</option>
              <option value="BLOCKED">Bị khóa</option>
            </select>

            {/* Lọc Loại bàn */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-medium focus:outline-hidden"
            >
              <option value="ALL">Tất cả loại bàn</option>
              <option value="HOT_DESK">Hotdesk</option>
              <option value="FIXED_DESK">Cố định</option>
              <option value="VIP">Lãnh đạo</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Mã bàn</th>
                  <th className="py-3 px-4">Vị trí & Phân khu</th>
                  <th className="py-3 px-4">Loại bàn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Người sử dụng</th>
                  <th className="py-3 px-4">Phần cứng & Tiện ích</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSeats.map((seat) => (
                  <tr key={seat.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {seat.code}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-foreground font-medium block">{seat.floor}</span>
                      <span className="text-[11px] text-muted-foreground">{seat.zone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px]">
                        {seat.type === "HOT_DESK" && "Hotdesk"}
                        {seat.type === "FIXED_DESK" && "Cố định"}
                        {seat.type === "VIP" && "Lãnh đạo"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5 border font-semibold",
                          seat.status === "AVAILABLE" && "bg-emerald-50 text-emerald-700 border-emerald-300",
                          seat.status === "OCCUPIED" && "bg-red-50 text-primary border-red-300",
                          seat.status === "MAINTENANCE" && "bg-amber-50 text-amber-700 border-amber-300",
                          seat.status === "BLOCKED" && "bg-slate-100 text-slate-700 border-slate-300"
                        )}
                      >
                        {seat.status === "AVAILABLE" && "● Trống"}
                        {seat.status === "OCCUPIED" && "● Đang ngồi"}
                        {seat.status === "MAINTENANCE" && "● Bảo trì"}
                        {seat.status === "BLOCKED" && "● Bị khóa"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {seat.occupantName ? (
                        <div>
                          <strong className="text-foreground block">{seat.occupantName}</strong>
                          <span className="text-[11px] text-muted-foreground">{seat.occupantRole}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Chưa phân bổ</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-[240px] truncate text-muted-foreground">
                      {seat.hardware}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-primary"
                          onClick={() => handleToggleStatus(seat.id, seat.status === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE")}
                        >
                          {seat.status === "MAINTENANCE" ? "Xong bảo trì" : "Bảo trì"}
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                          <Link href="/workplace/map">Xem bản đồ</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
