"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Upload,
  Edit,
  Eye,
  CheckCircle2,
  Archive,
  History,
  Building2,
  Maximize2,
  SlidersHorizontal,
  Compass,
  FileCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FloorPlanRecord {
  id: string;
  floorCode: string;
  floorName: string;
  siteName: string;
  version: string;
  scale: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  canvasWidth: number;
  canvasHeight: number;
  totalSeats: number;
  availableSeats: number;
  meetingRooms: number;
  publishedAt: string;
  publishedBy: string;
  backgroundImageUrl?: string;
}

export default function FloorPlanManagementPage() {
  const [selectedFloorId, setSelectedFloorId] = useState<string>("fl_03");

  // Dữ liệu danh sách tầng
  const [floorPlans, setFloorPlans] = useState<FloorPlanRecord[]>([
    {
      id: "fl_01",
      floorCode: "T1",
      floorName: "Tầng 1 - Sảnh & Reception",
      siteName: "Trụ sở Keangnam Hà Nội",
      version: "v1.2",
      scale: "1:100 (10cm/px)",
      status: "PUBLISHED",
      canvasWidth: 1400,
      canvasHeight: 700,
      totalSeats: 24,
      availableSeats: 8,
      meetingRooms: 2,
      publishedAt: "10/08/2026",
      publishedBy: "Nguyễn Văn An (Office Admin)"
    },
    {
      id: "fl_02",
      floorCode: "T2",
      floorName: "Tầng 2 - Vận Hành & CSKH",
      siteName: "Trụ sở Keangnam Hà Nội",
      version: "v1.8",
      scale: "1:100 (10cm/px)",
      status: "PUBLISHED",
      canvasWidth: 1600,
      canvasHeight: 800,
      totalSeats: 64,
      availableSeats: 14,
      meetingRooms: 3,
      publishedAt: "22/08/2026",
      publishedBy: "Trần Mai Phương (Office Admin)"
    },
    {
      id: "fl_03",
      floorCode: "T3",
      floorName: "Tầng 3 - Công Nghệ & R&D",
      siteName: "Trụ sở Keangnam Hà Nội",
      version: "v2.0",
      scale: "1:100 (10cm/px)",
      status: "PUBLISHED",
      canvasWidth: 1600,
      canvasHeight: 900,
      totalSeats: 84,
      availableSeats: 28,
      meetingRooms: 4,
      publishedAt: "15/09/2026",
      publishedBy: "Nguyễn Văn An (Office Admin)"
    },
    {
      id: "fl_04",
      floorCode: "T4",
      floorName: "Tầng 4 - Ban Lãnh Đạo & Đối Ngoại",
      siteName: "Trụ sở Keangnam Hà Nội",
      version: "v1.0 (Draft)",
      scale: "1:80 (8cm/px)",
      status: "DRAFT",
      canvasWidth: 1200,
      canvasHeight: 650,
      totalSeats: 32,
      availableSeats: 32,
      meetingRooms: 3,
      publishedAt: "Chưa phát hành",
      publishedBy: "Lê Hoàng Nam (Office Admin)"
    }
  ]);

  const currentFloor = floorPlans.find((f) => f.id === selectedFloorId) || floorPlans[2];

  const handlePublish = (floorId: string) => {
    setFloorPlans((prev) =>
      prev.map((f) =>
        f.id === floorId
          ? {
              ...f,
              status: "PUBLISHED",
              publishedAt: "07/10/2026",
              publishedBy: "Nguyễn Văn An (Office Admin)"
            }
          : f
      )
    );
    toast.success(`Đã phát hành sơ đồ ${currentFloor.floorName} phiên bản chính thức!`);
  };

  const handleArchive = (floorId: string) => {
    setFloorPlans((prev) =>
      prev.map((f) => (f.id === floorId ? { ...f, status: "ARCHIVED" } : f))
    );
    toast.info(`Đã chuyển sơ đồ ${currentFloor.floorName} vào kho lưu trữ.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              <span>Quản lý sơ đồ tầng</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Office Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị bản vẽ mặt bằng số, tỷ lệ thực tế, cấu hình ảnh nền và vòng đời phiên bản phát hành.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-8.5 text-xs gap-1.5" onClick={() => toast.info("Tính năng tải ảnh nền CAD/DWG/SVG sẽ mở hộp thoại tải tệp.")}>
            <Upload className="h-3.5 w-3.5" />
            <span>Tải ảnh nền bản vẽ</span>
          </Button>

          <Button asChild size="sm" className="h-8.5 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Link href={`/workplace/admin/floors/${currentFloor.id}/editor`}>
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo bản vẽ mới</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. Bộ chọn danh sách các tầng (Tabs Ngang) ──────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {floorPlans.map((floor) => {
          const isSelected = floor.id === selectedFloorId;
          return (
            <button
              key={floor.id}
              onClick={() => setSelectedFloorId(floor.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition-all shrink-0 border-t border-x",
                isSelected
                  ? "bg-card border-border text-primary shadow-xs -mb-px"
                  : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "h-6 w-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {floor.floorCode}
              </span>
              <span>{floor.floorName.split(" - ")[0]}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 border",
                  floor.status === "PUBLISHED" && "bg-emerald-50 text-emerald-700 border-emerald-300",
                  floor.status === "DRAFT" && "bg-amber-50 text-amber-700 border-amber-300",
                  floor.status === "ARCHIVED" && "bg-slate-100 text-slate-700 border-slate-300"
                )}
              >
                {floor.status === "PUBLISHED" && "Đang phát hành"}
                {floor.status === "DRAFT" && "Bản nháp"}
                {floor.status === "ARCHIVED" && "Lưu trữ"}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* ── 3. Khung Preview Floor Plan & Canvas Thông Tin ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Preview Bản đồ (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Xem trước mặt bằng: {currentFloor.floorName}</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentFloor.siteName} • Kích thước Canvas: {currentFloor.canvasWidth} × {currentFloor.canvasHeight} px
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Link href="/workplace/map">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Mở bản đồ Live</span>
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-center">
              {/* Sơ đồ thu nhỏ trực quan */}
              <div
                className="w-full max-w-[700px] h-[340px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl shadow-xs relative p-4 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(148, 163, 184, 0.25) 1px, transparent 1px)",
                  backgroundSize: "16px 16px"
                }}
              >
                {/* Zones mô phỏng */}
                <div className="flex justify-between items-start">
                  <div className="w-[45%] h-24 border border-dashed border-blue-400 bg-blue-50/40 rounded-lg p-2 text-[10px] font-bold text-blue-700">
                    ZONE A • R&D & TECH (32 BÀN)
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-3 rounded bg-blue-200 border border-blue-400" />
                      ))}
                    </div>
                  </div>

                  <div className="w-[45%] h-24 border border-dashed border-purple-400 bg-purple-50/40 rounded-lg p-2 text-[10px] font-bold text-purple-700">
                    ZONE B • PRODUCT & DESIGN (24 BÀN)
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-3 rounded bg-purple-200 border border-purple-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hành lang chính & Tiện ích */}
                <div className="w-full py-1 text-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-y border-dashed border-slate-300 dark:border-slate-700">
                  ── LỐI ĐI TRUNG TÂM (MAIN WALKWAY) ──
                </div>

                <div className="flex justify-between items-end">
                  <div className="w-[45%] h-24 border border-dashed border-emerald-400 bg-emerald-50/40 rounded-lg p-2 text-[10px] font-bold text-emerald-700">
                    ZONE C • SALES & OPERATIONS (28 BÀN)
                    <div className="grid grid-cols-4 gap-1 mt-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-3 rounded bg-emerald-200 border border-emerald-400" />
                      ))}
                    </div>
                  </div>

                  <div className="w-[45%] h-24 border-2 border-red-300 bg-red-50/40 rounded-lg p-2 text-[10px] font-bold text-primary flex flex-col justify-between">
                    <div>
                      <span>BOARD ROOM & MEETING PODS</span>
                      <p className="text-[9px] font-normal text-muted-foreground mt-0.5">4 Phòng họp tiện nghi</p>
                    </div>
                    <div className="h-4 bg-red-200/60 rounded flex items-center justify-center text-[9px] font-mono text-primary">
                      85\" Screen • Polycom 4K
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lịch sử các phiên bản */}
          <Card className="border-border bg-card shadow-xs rounded-xl">
            <CardHeader className="py-3 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <span>Lịch sử các phiên bản sơ đồ tầng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">v2.0</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                    Hiện hành
                  </Badge>
                  <span className="text-muted-foreground">Tối ưu lại cụm bàn Zone A và mở rộng thêm 2 Phonebooth</span>
                </div>
                <span className="text-muted-foreground font-mono">15/09/2026</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/5 opacity-80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-muted-foreground">v1.5</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Lưu trữ
                  </Badge>
                  <span className="text-muted-foreground">Bổ sung khu vực Pantry và máy in tầng 3</span>
                </div>
                <span className="text-muted-foreground font-mono">01/07/2026</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/5 opacity-80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-muted-foreground">v1.0</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Lưu trữ
                  </Badge>
                  <span className="text-muted-foreground">Bản vẽ thiết kế bàn giao khi tiếp nhận mặt bằng</span>
                </div>
                <span className="text-muted-foreground font-mono">15/01/2026</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Thuộc tính Kỹ thuật & Thao tác (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span>Cấu hình & Thuộc tính bản vẽ</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-3 pb-3 border-b border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phiên bản bản vẽ:</span>
                  <strong className="font-mono text-sm text-foreground">{currentFloor.version}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tỷ lệ thực tế:</span>
                  <span className="font-mono font-medium text-foreground">{currentFloor.scale}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 border",
                      currentFloor.status === "PUBLISHED" && "bg-emerald-50 text-emerald-700 border-emerald-300",
                      currentFloor.status === "DRAFT" && "bg-amber-50 text-amber-700 border-amber-300",
                      currentFloor.status === "ARCHIVED" && "bg-slate-100 text-slate-700 border-slate-300"
                    )}
                  >
                    {currentFloor.status === "PUBLISHED" && "● ĐANG PHÁT HÀNH"}
                    {currentFloor.status === "DRAFT" && "● BẢN NHÁP"}
                    {currentFloor.status === "ARCHIVED" && "● LƯU TRỮ"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Kích thước Canvas:</span>
                  <span className="font-mono text-foreground font-medium">
                    {currentFloor.canvasWidth} × {currentFloor.canvasHeight} px
                  </span>
                </div>
              </div>

              {/* Thông số công suất chỗ ngồi */}
              <div className="space-y-2 pb-3 border-b border-border">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Công suất thiết kế
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Tổng số bàn</span>
                    <strong className="text-base font-bold font-mono text-foreground">
                      {currentFloor.totalSeats}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border">
                    <span className="text-[10px] text-muted-foreground block">Đang trống</span>
                    <strong className="text-base font-bold font-mono text-emerald-600">
                      {currentFloor.availableSeats}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Người phụ trách phát hành */}
              <div className="space-y-1 text-muted-foreground pb-2">
                <p>
                  <strong>Người phát hành:</strong> {currentFloor.publishedBy}
                </p>
                <p>
                  <strong>Ngày phát hành:</strong> {currentFloor.publishedAt}
                </p>
              </div>

              {/* Bộ nút Hành động */}
              <div className="pt-2 space-y-2">
                <Button
                  asChild
                  className="w-full text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5"
                >
                  <Link href={`/workplace/admin/floors/${currentFloor.id}/editor`}>
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Chỉnh sửa trên Canvas 2D Editor</span>
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublish(currentFloor.id)}
                    className="h-8 text-xs gap-1 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border-emerald-200"
                  >
                    <FileCheck className="h-3 w-3" />
                    <span>Phát hành</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleArchive(currentFloor.id)}
                    className="h-8 text-xs gap-1 text-slate-700 hover:text-slate-900 border-slate-300"
                  >
                    <Archive className="h-3 w-3" />
                    <span>Lưu trữ</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
