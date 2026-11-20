"use client";

import React, { useState, useRef } from "react";
import {
  Armchair,
  Layers,
  Users,
  Compass,
  Info,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Video,
  Coffee,
  PhoneCall,
  Building2,
  Grid,
  ChevronRight,
  Sparkles,
  Move,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  FloorMapData,
  FloorMapSeat,
  FloorMapObject,
  FloorMapZone,
  SeatStatus,
} from "../../types/workplace.types";

interface InteractiveFloorCanvasProps {
  mapData: FloorMapData;
  selectedSeatId?: string | null;
  onSelectSeat?: (seat: FloorMapSeat) => void;
  selectedObjectId?: string | null;
  onSelectObject?: (object: FloorMapObject) => void;
  selectedZoneId?: string | null;
  onSelectZone?: (zone: FloorMapZone) => void;
  highlightedSeatId?: string | null;
  readOnly?: boolean;
  className?: string;
}

export function InteractiveFloorCanvas({
  mapData,
  selectedSeatId,
  onSelectSeat,
  selectedObjectId,
  onSelectObject,
  selectedZoneId,
  onSelectZone,
  highlightedSeatId,
  readOnly = false,
  className,
}: InteractiveFloorCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [activeSeat, setActiveSeat] = useState<FloorMapSeat | null>(
    mapData.seats.find((s) => s.id === selectedSeatId) || null
  );
  const [activeObjectId, setActiveObjectId] = useState<string | null>(selectedObjectId || null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(selectedZoneId || null);

  // Xử lý kéo rê chuột (Pan) và thanh cuộn
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".cursor-pointer") ||
      target.closest("[role='button']")
    ) {
      return;
    }
    if (!scrollContainerRef.current) return;
    setIsPanning(true);
    setPanStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scrollContainerRef.current.scrollLeft,
      scrollTop: scrollContainerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !scrollContainerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    scrollContainerRef.current.scrollLeft = panStart.scrollLeft - dx;
    scrollContainerRef.current.scrollTop = panStart.scrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Fallback 2 phòng họp & tiện ích chuẩn nếu sơ đồ tầng chưa cấu hình vật thể kiến trúc
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
    mapData.objects && mapData.objects.length > 0 ? mapData.objects : fallbackObjects;

  const handleSeatClick = (seat: FloorMapSeat) => {
    setActiveSeat(seat);
    setActiveObjectId(null);
    setActiveZoneId(null);
    onSelectSeat?.(seat);
  };

  const handleObjectClick = (obj: FloorMapObject) => {
    setActiveObjectId(obj.id);
    setActiveSeat(null);
    setActiveZoneId(null);
    onSelectObject?.(obj);
  };

  const handleZoneClick = (zone: FloorMapZone) => {
    setActiveZoneId(zone.id);
    setActiveSeat(null);
    setActiveObjectId(null);
    onSelectZone?.(zone);
  };

  const getSeatStatusBadge = (status: SeatStatus, occupantName?: string) => {
    if (occupantName) {
      return {
        bg: "bg-blue-600 border-blue-700 text-white",
        label: "Đang sử dụng",
      };
    }
    switch (status) {
      case "IN_SERVICE":
        return {
          bg: "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600",
          label: "Bàn trống sẵn sàng",
        };
      case "MAINTENANCE":
        return {
          bg: "bg-amber-500 border-amber-600 text-white",
          label: "Bảo trì",
        };
      case "BLOCKED":
        return {
          bg: "bg-rose-500 border-rose-600 text-white",
          label: "Đang bị khóa",
        };
      default:
        return {
          bg: "bg-slate-400 border-slate-500 text-white",
          label: "Không rõ",
        };
    }
  };

  // Tính toán hộp bao vị trí cho từng Phân khu (Zone) tránh bị đè chữ tại (20, 20)
  const getZoneBoundingBox = (zone: any, index: number) => {
    // 1. Nếu có tọa độ ranh giới boundaryPoints đầy đủ (>= 2 điểm)
    if (zone.boundaryPoints && zone.boundaryPoints.length >= 2) {
      const xs = zone.boundaryPoints.map((p: any) => p.x);
      const ys = zone.boundaryPoints.map((p: any) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return {
        x: minX,
        y: minY,
        width: Math.max(160, maxX - minX),
        height: Math.max(100, maxY - minY),
      };
    }

    // 2. Tự động tính hộp bao ôm các bàn làm việc thuộc Zone
    const zoneRowIds = new Set(
      mapData.seatRows.filter((r) => r.zoneId === zone.id).map((r) => r.id)
    );
    const zoneSeats = mapData.seats.filter(
      (s) => zoneRowIds.has(s.seatRowId) || (s as any).zoneId === zone.id
    );

    if (zoneSeats.length > 0) {
      const minX = Math.max(15, Math.min(...zoneSeats.map((s) => s.x)) - 25);
      const minY = Math.max(15, Math.min(...zoneSeats.map((s) => s.y)) - 45);
      const maxX = Math.max(...zoneSeats.map((s) => s.x + s.width)) + 25;
      const maxY = Math.max(...zoneSeats.map((s) => s.y + s.height)) + 25;
      return {
        x: minX,
        y: minY,
        width: Math.max(160, maxX - minX),
        height: Math.max(100, maxY - minY),
      };
    }

    // 3. Nếu có 1 điểm duy nhất
    if (zone.boundaryPoints && zone.boundaryPoints.length === 1) {
      return {
        x: zone.boundaryPoints[0].x,
        y: zone.boundaryPoints[0].y,
        width: 260,
        height: 240,
      };
    }

    // 4. Fallback thông minh dàn các phân khu theo vị trí riêng biệt, không đè lên nhau
    return {
      x: 35 + index * 300,
      y: 35,
      width: 270,
      height: 380,
    };
  };

  return (
    <div className={cn("relative flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{mapData.floorName}</span>
          <Badge variant="outline" className="font-mono text-xs">
            Tầng {mapData.floorNumber}
          </Badge>
          {mapData.activePlan && (
            <Badge variant="secondary" className="text-xs">
              Phiên bản: v{mapData.activePlan.versionNo}
            </Badge>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500 border border-emerald-600" />
            <span>Trống sẵn sàng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-blue-600 border border-blue-700" />
            <span>Đang sử dụng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-amber-500 border border-amber-600" />
            <span>Bảo trì</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-rose-500 border border-rose-600" />
            <span>Bị khóa sự cố</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            title="Thu nhỏ"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="font-mono text-xs text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
            title="Phóng to"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setZoom(1)}
            title="Khôi phục 100%"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Area với Thanh cuộn ngang & dọc rõ nét + Hỗ trợ Kéo rê chuột (Pan) */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "relative h-[560px] w-full overflow-x-auto overflow-y-auto bg-slate-100/90 dark:bg-slate-950 p-6 select-none",
          isPanning ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          scrollbarWidth: "auto",
          scrollbarColor: "#64748b #e2e8f0",
        }}
      >
        <div className="min-w-fit min-h-fit flex items-center justify-center p-4">
          <div
            className="relative transition-transform duration-150 ease-out border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden shrink-0"
            style={{
              width: `${1100 * zoom}px`,
              height: `${620 * zoom}px`,
              backgroundImage: "radial-gradient(#94a3b8 1.2px, transparent 1.2px)",
              backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            }}
          >
          {/* 1. Zones Render */}
          {mapData.zones.map((zone, idx) => {
            const bbox = getZoneBoundingBox(zone, idx);
            const isZoneSelected = selectedZoneId ? selectedZoneId === zone.id : activeZoneId === zone.id;

            return (
              <div
                key={zone.id}
                className={cn(
                  "absolute rounded-xl border border-dashed flex flex-col p-2.5 transition-all overflow-hidden",
                  isZoneSelected && "ring-2 ring-primary ring-offset-2 bg-primary/10"
                )}
                style={{
                  left: `${bbox.x * zoom}px`,
                  top: `${bbox.y * zoom}px`,
                  width: `${bbox.width * zoom}px`,
                  height: `${bbox.height * zoom}px`,
                  borderColor: zone.colorHex || "#3b82f6",
                  backgroundColor: `${zone.colorHex || "#3b82f6"}10`,
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoneClick(zone);
                  }}
                  className="flex items-center gap-1.5 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity w-fit bg-card/80 px-1.5 py-0.5 rounded shadow-2xs"
                  title="Nhấn để xem thông tin phân khu"
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: zone.colorHex || "#3b82f6" }}
                  />
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {zone.name}
                  </span>
                </div>
                {zone.departmentName && (
                  <span className="text-[9px] text-muted-foreground ml-3.5 truncate">
                    Phòng ban: {zone.departmentName}
                  </span>
                )}
              </div>
            );
          })}

          {/* 2. Architectural Objects (Meeting Rooms, Pantry, Phonebooth...) */}
          {allObjects.map((obj) => {
            const isSelected = selectedObjectId ? selectedObjectId === obj.id : activeObjectId === obj.id;
            const isMeeting = obj.objectType === "MEETING_ROOM";
            const isPantry = obj.objectType === "PANTRY";
            const isPhonebooth = obj.objectType === "PHONEBOOTH";

            return (
              <div
                key={obj.id}
                onClick={() => handleObjectClick(obj)}
                className={cn(
                  "absolute rounded-xl border p-2.5 shadow-xs flex flex-col justify-between transition-all duration-150 cursor-pointer select-none",
                  isMeeting
                    ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50/90 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-500"
                    : isPantry
                    ? "border-amber-300 dark:border-amber-700 bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-500"
                    : isPhonebooth
                    ? "border-teal-300 dark:border-teal-700 bg-teal-50/90 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:border-teal-500"
                    : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 hover:border-slate-400",
                  isSelected && "ring-4 ring-primary ring-offset-2 z-20 shadow-lg scale-[1.02] border-primary"
                )}
                style={{
                  left: `${obj.x * zoom}px`,
                  top: `${obj.y * zoom}px`,
                  width: `${obj.width * zoom}px`,
                  height: `${obj.height * zoom}px`,
                  transform: obj.rotationDegrees ? `rotate(${obj.rotationDegrees}deg)` : undefined,
                }}
                title={`Nhấn để xem thông tin chi tiết: ${obj.name}`}
              >
                <div className="flex items-center justify-between gap-1 overflow-hidden">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isMeeting ? (
                      <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : isPantry ? (
                      <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    ) : isPhonebooth ? (
                      <PhoneCall className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
                    )}
                    <span className="text-[11px] font-bold text-foreground truncate">
                      {obj.name}
                    </span>
                  </div>
                  {obj.capacity && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-mono shrink-0 bg-background/80">
                      {obj.capacity} chỗ
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-1 border-t border-border/30">
                  <span className="truncate">
                    {isMeeting
                      ? "Phòng họp thông minh"
                      : isPantry
                      ? "Pantry / Nghỉ ngơi"
                      : isPhonebooth
                      ? "Phonebooth Focus"
                      : obj.objectType}
                  </span>
                  <span className="text-[8.5px] font-semibold text-primary hover:underline shrink-0 flex items-center gap-0.5">
                    Chi tiết &rarr;
                  </span>
                </div>
              </div>
            );
          })}

          {/* 3. Desks Render */}
          {mapData.seats.map((seat) => {
            const isSelected = activeSeat?.id === seat.id;
            const isHighlighted = highlightedSeatId === seat.id;
            const badge = getSeatStatusBadge(seat.status, seat.currentOccupantName);

            return (
              <button
                key={seat.id}
                type="button"
                onClick={() => handleSeatClick(seat)}
                className={cn(
                  "absolute rounded-lg border flex flex-col items-center justify-center p-1 text-center transition-all duration-150 shadow-sm cursor-pointer",
                  badge.bg,
                  isSelected && "ring-4 ring-primary ring-offset-2 scale-105 z-20",
                  isHighlighted && "animate-bounce ring-4 ring-yellow-400 z-30"
                )}
                style={{
                  left: `${seat.x * zoom}px`,
                  top: `${seat.y * zoom}px`,
                  width: `${seat.width * zoom}px`,
                  height: `${seat.height * zoom}px`,
                  transform: `rotate(${seat.rotationDegrees}deg)`,
                }}
              >
                <div className="flex items-center gap-1">
                  <Armchair className="h-3 w-3 opacity-90 shrink-0" />
                  <span className="font-mono text-[10px] font-bold leading-none truncate">
                    {seat.seatCode}
                  </span>
                </div>
                {seat.currentOccupantName ? (
                  <span
                    className="text-[8.5px] leading-tight truncate w-full mt-0.5 opacity-95 px-0.5 font-medium"
                    title={seat.currentOccupantName}
                  >
                    {seat.currentOccupantName}
                  </span>
                ) : (
                  <span className="text-[8px] opacity-80 uppercase mt-0.5">
                    {seat.seatType === "HOT_DESK" ? "Hot-desk" : "Cố định"}
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Canvas Bottom Helper Bar */}
      <div className="flex flex-wrap items-center justify-between border-t border-border bg-muted/20 px-4 py-2 text-xs text-muted-foreground gap-2">
        <span className="flex items-center gap-1.5 text-[11px]">
          <Move className="w-3.5 h-3.5 text-primary" />
          <span>Giữ và kéo chuột để di chuyển (Pan) • Dùng thanh cuộn ngang/dọc bên dưới</span>
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span>Kích thước: {Math.round(1100 * zoom)}×{Math.round(620 * zoom)}px</span>
        </div>
      </div>

      {/* Selected Desk Preview Drawer */}
      {activeSeat && (
        <div className="border-t border-border bg-card p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Armchair className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-foreground">
                  Bàn {activeSeat.seatCode}
                </span>
                <Badge variant={activeSeat.seatType === "HOT_DESK" ? "secondary" : "outline"} className="text-xs">
                  {activeSeat.seatType === "HOT_DESK" ? "Bàn linh hoạt (Hot-desk)" : "Bàn cố định"}
                </Badge>
                <Badge className={getSeatStatusBadge(activeSeat.status, activeSeat.currentOccupantName).bg}>
                  {getSeatStatusBadge(activeSeat.status, activeSeat.currentOccupantName).label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activeSeat.currentOccupantName
                  ? `Đang được sử dụng bởi: ${activeSeat.currentOccupantName}`
                  : "Vị trí bàn làm việc đang trống và khả dụng"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSeat.amenities.map((am, i) => (
              <Badge key={i} variant="outline" className="text-[11px]">
                {am}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
