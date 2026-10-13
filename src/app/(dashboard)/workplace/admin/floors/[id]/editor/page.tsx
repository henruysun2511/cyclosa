"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Save,
  Send,
  ArrowLeft,
  Plus,
  Trash2,
  Copy,
  RotateCw,
  Move,
  Grid,
  ZoomIn,
  ZoomOut,
  Sliders,
  Sparkles,
  Compass,
  Monitor,
  Users,
  Coffee,
  Printer,
  Lock,
  ArrowUpRight,
  ChevronRight,
  Check,
  Building2,
  SlidersHorizontal,
  SquareDashedBottom
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface CanvasObject {
  id: string;
  name: string;
  type: "ZONE" | "CLUSTER" | "SEAT" | "MEETING_ROOM" | "FACILITY";
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number; // 0, 90, 180, 270
  seatType?: "HOT_DESK" | "FIXED_DESK" | "VIP";
  status?: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED";
  zoneId?: string;
  color?: string;
}

export default function FloorPlanCanvasEditorPage() {
  const [selectedObjectId, setSelectedObjectId] = useState<string>("seat_101");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Danh sách các đối tượng trên Canvas
  const [objects, setObjects] = useState<CanvasObject[]>([
    // 1. Phân khu Zone A
    {
      id: "zone_a",
      name: "Zone A - Kỹ thuật & CNTT",
      type: "ZONE",
      x: 60,
      y: 60,
      w: 420,
      h: 240,
      rotation: 0,
      color: "#3B82F6"
    },
    // 2. Phân khu Zone B
    {
      id: "zone_b",
      name: "Zone B - Sản phẩm & UI/UX",
      type: "ZONE",
      x: 520,
      y: 60,
      w: 380,
      h: 240,
      rotation: 0,
      color: "#8B5CF6"
    },
    // 3. Cụm bàn Zone A
    {
      id: "seat_101",
      name: "Bàn A-101",
      type: "SEAT",
      x: 100,
      y: 120,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "HOT_DESK",
      status: "AVAILABLE",
      zoneId: "zone_a"
    },
    {
      id: "seat_102",
      name: "Bàn A-102",
      type: "SEAT",
      x: 180,
      y: 120,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "FIXED_DESK",
      status: "OCCUPIED",
      zoneId: "zone_a"
    },
    {
      id: "seat_103",
      name: "Bàn A-103",
      type: "SEAT",
      x: 260,
      y: 120,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "FIXED_DESK",
      status: "OCCUPIED",
      zoneId: "zone_a"
    },
    {
      id: "seat_104",
      name: "Bàn A-104",
      type: "SEAT",
      x: 340,
      y: 120,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "HOT_DESK",
      status: "AVAILABLE",
      zoneId: "zone_a"
    },
    // Hàng 2 Zone A
    {
      id: "seat_201",
      name: "Bàn A-201",
      type: "SEAT",
      x: 100,
      y: 190,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "HOT_DESK",
      status: "AVAILABLE",
      zoneId: "zone_a"
    },
    {
      id: "seat_202",
      name: "Bàn A-202",
      type: "SEAT",
      x: 180,
      y: 190,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "HOT_DESK",
      status: "MAINTENANCE",
      zoneId: "zone_a"
    },
    {
      id: "seat_203",
      name: "Bàn A-203",
      type: "SEAT",
      x: 260,
      y: 190,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "FIXED_DESK",
      status: "OCCUPIED",
      zoneId: "zone_a"
    },
    {
      id: "seat_204",
      name: "Bàn A-204",
      type: "SEAT",
      x: 340,
      y: 190,
      w: 64,
      h: 48,
      rotation: 0,
      seatType: "HOT_DESK",
      status: "BLOCKED",
      zoneId: "zone_a"
    },

    // 4. Phòng họp
    {
      id: "room_mr01",
      name: "Phòng Họp Ban Lãnh Đạo",
      type: "MEETING_ROOM",
      x: 540,
      y: 100,
      w: 160,
      h: 120,
      rotation: 0,
      status: "AVAILABLE"
    },
    {
      id: "room_pb01",
      name: "Phonebooth #1",
      type: "MEETING_ROOM",
      x: 740,
      y: 100,
      w: 80,
      h: 70,
      rotation: 0,
      status: "AVAILABLE"
    },

    // 5. Vật thể tiện ích
    {
      id: "fac_pantry",
      name: "Pantry & Coffee",
      type: "FACILITY",
      x: 60,
      y: 330,
      w: 120,
      h: 90,
      rotation: 0
    },
    {
      id: "fac_printer",
      name: "Máy in đa năng",
      type: "FACILITY",
      x: 220,
      y: 330,
      w: 70,
      h: 60,
      rotation: 0
    }
  ]);

  const activeObject = objects.find((o) => o.id === selectedObjectId) || null;

  // Cập nhật thuộc tính của đối tượng đang chọn
  const handleUpdateActiveObject = (fields: Partial<CanvasObject>) => {
    if (!activeObject) return;
    setObjects((prev) =>
      prev.map((o) => (o.id === activeObject.id ? { ...o, ...fields } : o))
    );
  };

  // Thêm mới các đối tượng từ Toolbar
  const handleAddObject = (type: CanvasObject["type"], subType?: string) => {
    const newId = `obj_${Date.now()}`;
    let newObj: CanvasObject = {
      id: newId,
      name: "Đối tượng mới",
      type,
      x: 120,
      y: 120,
      w: 80,
      h: 60,
      rotation: 0
    };

    if (type === "SEAT") {
      newObj = {
        ...newObj,
        name: `Bàn ${Math.floor(100 + Math.random() * 900)}`,
        w: 64,
        h: 48,
        seatType: "HOT_DESK",
        status: "AVAILABLE",
        zoneId: "zone_a"
      };
    } else if (type === "ZONE") {
      newObj = {
        ...newObj,
        name: "Phân khu mới (Zone)",
        w: 300,
        h: 200,
        color: "#10B981"
      };
    } else if (type === "MEETING_ROOM") {
      newObj = {
        ...newObj,
        name: subType === "phonebooth" ? "Phonebooth Focus" : "Phòng Họp Mới",
        w: subType === "phonebooth" ? 80 : 160,
        h: subType === "phonebooth" ? 70 : 120,
        status: "AVAILABLE"
      };
    } else if (type === "FACILITY") {
      newObj = {
        ...newObj,
        name: subType || "Tiện ích văn phòng",
        w: 90,
        h: 70
      };
    }

    setObjects((prev) => [...prev, newObj]);
    setSelectedObjectId(newId);
    toast.success(`Đã thêm ${newObj.name} vào Canvas!`);
  };

  // Tạo bàn hàng loạt (Bulk Seats Generator)
  const handleAddBulkSeats = (rows: number, cols: number) => {
    const newSeats: CanvasObject[] = [];
    const startX = 120;
    const startY = 100;
    const spacingX = 80;
    const spacingY = 70;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `seat_bulk_${Date.now()}_${r}_${c}`;
        newSeats.push({
          id,
          name: `Bàn X-${r + 1}0${c + 1}`,
          type: "SEAT",
          x: startX + c * spacingX,
          y: startY + r * spacingY,
          w: 64,
          h: 48,
          rotation: 0,
          seatType: "HOT_DESK",
          status: "AVAILABLE",
          zoneId: "zone_a"
        });
      }
    }
    setObjects((prev) => [...prev, ...newSeats]);
    toast.success(`Đã tạo hàng loạt ${rows * cols} bàn làm việc (Ma trận ${rows}×${cols}) thành công!`);
  };

  // Nhân bản đối tượng
  const handleDuplicate = () => {
    if (!activeObject) return;
    const cloneId = `obj_${Date.now()}`;
    const clone: CanvasObject = {
      ...activeObject,
      id: cloneId,
      name: `${activeObject.name} (Bản sao)`,
      x: activeObject.x + 20,
      y: activeObject.y + 20
    };
    setObjects((prev) => [...prev, clone]);
    setSelectedObjectId(cloneId);
    toast.info(`Đã nhân bản ${activeObject.name}`);
  };

  // Xóa đối tượng
  const handleDelete = () => {
    if (!activeObject) return;
    setObjects((prev) => prev.filter((o) => o.id !== activeObject.id));
    setSelectedObjectId("");
    toast.info("Đã xóa đối tượng khỏi Canvas");
  };

  // Lưu bản nháp & Phát hành
  const handleSave = () => {
    toast.success("Đã lưu bản vẽ Canvas sơ đồ tầng thành công!");
  };

  const handlePublish = () => {
    toast.success("Đã phát hành phiên bản mới của sơ đồ tầng lên hệ thống Live!");
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-10">
      {/* ── 1. Header Toolbar ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Link href="/workplace/admin/floors">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quản lý tầng</span>
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <span>Trình soạn thảo bản đồ / Canvas 2D Editor</span>
              </h1>
              <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
                Tầng 3 (Keangnam)
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Công cụ đồ họa kéo thả: cấu hình phân khu, cụm bàn, phòng họp và xuất bản sơ đồ số.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="h-8 text-xs gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Lưu bản nháp</span>
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Phát hành (Publish)</span>
          </Button>
        </div>
      </div>

      {/* ── 2. LAYOUT 3 CỘT: CÔNG CỤ (Trái) - CANVAS 2D (Giữa) - THUỘC TÍNH (Phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ── CỘT TRÁI: PALETTE CÔNG CỤ THÊM ĐỐI TƯỢNG (2.5 cols) ── */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-primary" />
                <span>Thư viện đối tượng (Tool Palette)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3 space-y-4 text-xs">
              {/* Nhóm 1: Phân khu */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Phân khu không gian
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddObject("ZONE")}
                  className="w-full justify-start text-xs h-8 border-dashed"
                >
                  <SquareDashedBottom className="h-3.5 w-3.5 mr-2 text-blue-600" />
                  <span>+ Thêm Phân khu (Zone)</span>
                </Button>
              </div>

              {/* Nhóm 2: Bàn & Cụm bàn */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Chỗ ngồi & Cụm bàn
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("SEAT")}
                    className="text-xs h-8 justify-start"
                  >
                    <Monitor className="h-3 w-3 mr-1.5 text-primary" />
                    <span>+ Bàn đơn</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddBulkSeats(2, 3)}
                    className="text-xs h-8 justify-start"
                  >
                    <Grid className="h-3 w-3 mr-1.5 text-purple-600" />
                    <span>+ Cụm 2x3</span>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBulkSeats(2, 4)}
                  className="w-full text-xs h-8 justify-start bg-muted/30"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-2 text-amber-600" />
                  <span>+ Tạo ma trận hàng loạt (2x4 = 8 bàn)</span>
                </Button>
              </div>

              {/* Nhóm 3: Phòng họp */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Phòng họp & Focus Box
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("MEETING_ROOM")}
                    className="text-xs h-8 justify-start"
                  >
                    <Users className="h-3 w-3 mr-1.5 text-emerald-600" />
                    <span>+ Phòng họp</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("MEETING_ROOM", "phonebooth")}
                    className="text-xs h-8 justify-start"
                  >
                    <Lock className="h-3 w-3 mr-1.5 text-blue-600" />
                    <span>+ Phonebooth</span>
                  </Button>
                </div>
              </div>

              {/* Nhóm 4: Vật thể tiện ích */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Tiện ích văn phòng
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("FACILITY", "Pantry & Coffee")}
                    className="text-xs h-8 justify-start"
                  >
                    <Coffee className="h-3 w-3 mr-1.5 text-amber-600" />
                    <span>+ Pantry Bar</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("FACILITY", "Máy in đa năng")}
                    className="text-xs h-8 justify-start"
                  >
                    <Printer className="h-3 w-3 mr-1.5 text-purple-600" />
                    <span>+ Máy in</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("FACILITY", "Thang máy")}
                    className="text-xs h-8 justify-start"
                  >
                    <ArrowUpRight className="h-3 w-3 mr-1.5 text-slate-600" />
                    <span>+ Thang máy</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddObject("FACILITY", "Tủ Locker")}
                    className="text-xs h-8 justify-start"
                  >
                    <Lock className="h-3 w-3 mr-1.5 text-indigo-600" />
                    <span>+ Tủ đồ</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── CỘT GIỮA: CANVAS 2D TƯƠNG TÁC (6.5 cols) ───────────── */}
        <div className="lg:col-span-6 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden flex flex-col h-[740px]">
            {/* Header Canvas: Controls & Zoom */}
            <div className="py-2.5 px-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-primary" />
                  <span>Interactive Editor Canvas</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Lưới 10px • Snap: {snapToGrid ? "BẬT" : "TẮT"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] font-mono font-medium px-1 text-muted-foreground">
                  {zoomLevel}%
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 140))}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs ml-1 px-2"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                >
                  <Grid className="h-3 w-3 mr-1" />
                  <span>Snap Grid</span>
                </Button>
              </div>
            </div>

            {/* Vùng Canvas cuộn */}
            <div className="flex-1 overflow-auto bg-slate-100/80 dark:bg-slate-950/50 p-4 relative flex items-center justify-center">
              <div
                className="relative bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md transition-transform duration-150 origin-center"
                style={{
                  width: "1000px",
                  height: "560px",
                  transform: `scale(${zoomLevel / 100})`,
                  backgroundImage:
                    "radial-gradient(circle, rgba(148, 163, 184, 0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              >
                {/* Render tất cả đối tượng trên Canvas */}
                {objects.map((obj) => {
                  const isSelected = selectedObjectId === obj.id;

                  // Render theo Type
                  if (obj.type === "ZONE") {
                    return (
                      <div
                        key={obj.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedObjectId(obj.id);
                        }}
                        className={cn(
                          "absolute border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col justify-between p-2",
                          isSelected
                            ? "border-primary ring-2 ring-primary/40 bg-primary/5 z-10"
                            : "border-blue-400 bg-blue-50/20 hover:border-blue-500"
                        )}
                        style={{
                          left: `${obj.x}px`,
                          top: `${obj.y}px`,
                          width: `${obj.w}px`,
                          height: `${obj.h}px`,
                          transform: `rotate(${obj.rotation}deg)`
                        }}
                      >
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-200 w-fit">
                          {obj.name}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono self-end">
                          {obj.w}×{obj.h} px
                        </span>
                      </div>
                    );
                  }

                  if (obj.type === "SEAT") {
                    let statusBg = "bg-emerald-100 border-emerald-400 text-emerald-950";
                    if (obj.status === "OCCUPIED") {
                      statusBg = "bg-red-100 border-red-400 text-red-950";
                    } else if (obj.status === "MAINTENANCE") {
                      statusBg = "bg-amber-100 border-amber-400 text-amber-950";
                    } else if (obj.status === "BLOCKED") {
                      statusBg = "bg-slate-200 border-slate-400 text-slate-800";
                    }

                    return (
                      <div
                        key={obj.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedObjectId(obj.id);
                        }}
                        className={cn(
                          "absolute rounded-lg border-2 flex flex-col items-center justify-between p-1 cursor-pointer transition-all shadow-2xs z-20",
                          statusBg,
                          isSelected && "ring-2 ring-primary ring-offset-2 scale-105 z-30"
                        )}
                        style={{
                          left: `${obj.x}px`,
                          top: `${obj.y}px`,
                          width: `${obj.w}px`,
                          height: `${obj.h}px`,
                          transform: `rotate(${obj.rotation}deg)`
                        }}
                      >
                        <span className="text-[9px] font-bold font-mono">{obj.name}</span>
                        <span className="text-[8px] text-muted-foreground">{obj.seatType === "HOT_DESK" ? "Hot" : "Fix"}</span>
                      </div>
                    );
                  }

                  if (obj.type === "MEETING_ROOM") {
                    return (
                      <div
                        key={obj.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedObjectId(obj.id);
                        }}
                        className={cn(
                          "absolute rounded-xl border-2 p-2 flex flex-col justify-between cursor-pointer transition-all bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs z-20",
                          isSelected && "ring-2 ring-primary ring-offset-2 z-30"
                        )}
                        style={{
                          left: `${obj.x}px`,
                          top: `${obj.y}px`,
                          width: `${obj.w}px`,
                          height: `${obj.h}px`,
                          transform: `rotate(${obj.rotation}deg)`
                        }}
                      >
                        <span className="text-[10px] font-bold truncate">{obj.name}</span>
                        <div className="h-5 w-3/4 mx-auto rounded-full bg-slate-200/80 border border-slate-300 flex items-center justify-center text-[8px] text-muted-foreground font-mono">
                          Meeting
                        </div>
                      </div>
                    );
                  }

                  // FACILITY
                  return (
                    <div
                      key={obj.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedObjectId(obj.id);
                      }}
                      className={cn(
                        "absolute rounded-lg border flex flex-col items-center justify-center p-1 cursor-pointer transition-all bg-slate-100 text-slate-800 border-slate-300 shadow-2xs z-20",
                        isSelected && "ring-2 ring-primary ring-offset-2 z-30"
                      )}
                      style={{
                        left: `${obj.x}px`,
                        top: `${obj.y}px`,
                        width: `${obj.w}px`,
                        height: `${obj.h}px`,
                        transform: `rotate(${obj.rotation}deg)`
                      }}
                    >
                      <Coffee className="h-4 w-4 mb-0.5 opacity-80" />
                      <span className="text-[9px] font-medium leading-tight text-center">{obj.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Canvas status */}
            <div className="py-2 px-4 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
              <span>Đang có {objects.length} đối tượng trên Canvas</span>
              <span>Click để chọn đối tượng • Nhập tọa độ hoặc kích thước bên cột Phải</span>
            </div>
          </Card>
        </div>

        {/* ── CỘT PHẢI: BẢNG THUỘC TÍNH (INSPECTOR PANEL) (3 cols) ── */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-primary" />
                <span>Thuộc tính đối tượng (Inspector)</span>
              </CardTitle>
              {activeObject && (
                <Badge variant="outline" className="text-[10px]">
                  {activeObject.type}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {activeObject ? (
                <>
                  {/* Tên đối tượng */}
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Tên / Mã hiển thị</Label>
                    <Input
                      value={activeObject.name}
                      onChange={(e) => handleUpdateActiveObject({ name: e.target.value })}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>

                  {/* Vị trí Tọa độ (X, Y) */}
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Vị trí tọa độ (px)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 bg-muted/20">
                        <span className="text-[10px] font-mono text-muted-foreground">X:</span>
                        <input
                          type="number"
                          value={activeObject.x}
                          onChange={(e) =>
                            handleUpdateActiveObject({ x: parseInt(e.target.value) || 0 })
                          }
                          className="w-full bg-transparent border-none py-1 text-xs font-mono focus:outline-hidden"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 bg-muted/20">
                        <span className="text-[10px] font-mono text-muted-foreground">Y:</span>
                        <input
                          type="number"
                          value={activeObject.y}
                          onChange={(e) =>
                            handleUpdateActiveObject({ y: parseInt(e.target.value) || 0 })
                          }
                          className="w-full bg-transparent border-none py-1 text-xs font-mono focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kích thước (W, H) */}
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Kích thước (Rộng × Cao)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 bg-muted/20">
                        <span className="text-[10px] font-mono text-muted-foreground">W:</span>
                        <input
                          type="number"
                          value={activeObject.w}
                          onChange={(e) =>
                            handleUpdateActiveObject({ w: parseInt(e.target.value) || 0 })
                          }
                          className="w-full bg-transparent border-none py-1 text-xs font-mono focus:outline-hidden"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 border border-border rounded-lg px-2 bg-muted/20">
                        <span className="text-[10px] font-mono text-muted-foreground">H:</span>
                        <input
                          type="number"
                          value={activeObject.h}
                          onChange={(e) =>
                            handleUpdateActiveObject({ h: parseInt(e.target.value) || 0 })
                          }
                          className="w-full bg-transparent border-none py-1 text-xs font-mono focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Góc xoay */}
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Góc xoay (Rotation)</Label>
                    <div className="flex items-center gap-1.5">
                      {[0, 90, 180, 270].map((deg) => (
                        <Button
                          key={deg}
                          size="sm"
                          variant={activeObject.rotation === deg ? "default" : "outline"}
                          onClick={() => handleUpdateActiveObject({ rotation: deg })}
                          className={cn(
                            "flex-1 h-7 text-[11px] font-mono",
                            activeObject.rotation === deg && "bg-primary text-primary-foreground"
                          )}
                        >
                          {deg}°
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Nếu là Chỗ ngồi (SEAT) */}
                  {activeObject.type === "SEAT" && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Loại bàn làm việc</Label>
                        <select
                          value={activeObject.seatType || "HOT_DESK"}
                          onChange={(e) =>
                            handleUpdateActiveObject({
                              seatType: e.target.value as CanvasObject["seatType"]
                            })
                          }
                          className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                        >
                          <option value="HOT_DESK">HOT_DESK (Linh hoạt)</option>
                          <option value="FIXED_DESK">FIXED_DESK (Cố định)</option>
                          <option value="VIP">VIP_DESK (Lãnh đạo)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Trạng thái khởi tạo</Label>
                        <select
                          value={activeObject.status || "AVAILABLE"}
                          onChange={(e) =>
                            handleUpdateActiveObject({
                              status: e.target.value as CanvasObject["status"]
                            })
                          }
                          className="w-full h-8 px-2 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                        >
                          <option value="AVAILABLE">AVAILABLE (Trống)</option>
                          <option value="OCCUPIED">OCCUPIED (Đang sử dụng)</option>
                          <option value="MAINTENANCE">MAINTENANCE (Bảo trì)</option>
                          <option value="BLOCKED">BLOCKED (Bị khóa)</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Nút Nhân bản & Xóa */}
                  <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDuplicate}
                      className="h-8 text-xs gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Nhân bản</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDelete}
                      className="h-8 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Xóa bỏ</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sliders className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
                  <p className="text-xs">Chưa chọn đối tượng nào</p>
                  <span className="text-[10px]">Click vào đối tượng trên Canvas để chỉnh sửa thuộc tính</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
