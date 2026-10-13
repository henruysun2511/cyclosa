"use client";

import React, { useState } from "react";
import { Monitor, Users, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DeskStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";

export interface DeskNode {
  id: string;
  code: string; // e.g. "D-01"
  zoneName: string;
  x: number; // percentage
  y: number; // percentage
  status: DeskStatus;
  currentAssignee?: string;
  assignedDepartment?: string;
}

export const MOCK_DESKS_SAMPLE: DeskNode[] = [
  // Zone A: Tech Hub
  { id: "d1", code: "A-01", zoneName: "Khu Vực Công Nghệ", x: 15, y: 25, status: "AVAILABLE" },
  { id: "d2", code: "A-02", zoneName: "Khu Vực Công Nghệ", x: 28, y: 25, status: "OCCUPIED", currentAssignee: "Phạm Minh Tuấn", assignedDepartment: "Frontend" },
  { id: "d3", code: "A-03", zoneName: "Khu Vực Công Nghệ", x: 41, y: 25, status: "AVAILABLE" },
  { id: "d4", code: "A-04", zoneName: "Khu Vực Công Nghệ", x: 15, y: 45, status: "OCCUPIED", currentAssignee: "Lê Hoàng Nam", assignedDepartment: "Tech Lead" },
  { id: "d5", code: "A-05", zoneName: "Khu Vực Công Nghệ", x: 28, y: 45, status: "RESERVED", currentAssignee: "Trần Quốc Bảo (Hôm nay)" },
  { id: "d6", code: "A-06", zoneName: "Khu Vực Công Nghệ", x: 41, y: 45, status: "AVAILABLE" },

  // Zone B: Marketing & Sales
  { id: "d7", code: "B-01", zoneName: "Khu Kinh Doanh & MKT", x: 62, y: 25, status: "AVAILABLE" },
  { id: "d8", code: "B-02", zoneName: "Khu Kinh Doanh & MKT", x: 75, y: 25, status: "OCCUPIED", currentAssignee: "Vũ Đức Long", assignedDepartment: "Sales" },
  { id: "d9", code: "B-03", zoneName: "Khu Kinh Doanh & MKT", x: 88, y: 25, status: "AVAILABLE" },
  { id: "d10", code: "B-04", zoneName: "Khu Kinh Doanh & MKT", x: 62, y: 45, status: "AVAILABLE" },
  { id: "d11", code: "B-05", zoneName: "Khu Kinh Doanh & MKT", x: 75, y: 45, status: "MAINTENANCE" },
  { id: "d12", code: "B-06", zoneName: "Khu Kinh Doanh & MKT", x: 88, y: 45, status: "AVAILABLE" },
];

export interface FloorCanvas2DProps {
  floorName?: string;
  desks?: DeskNode[];
  selectedDeskId?: string | null;
  onSelectDesk?: (desk: DeskNode) => void;
  readOnly?: boolean;
  className?: string;
}

export function FloorCanvas2D({
  floorName = "Tầng 8 — Tòa Nhà Trụ Sở FSI",
  desks = MOCK_DESKS_SAMPLE,
  selectedDeskId,
  onSelectDesk,
  readOnly = false,
  className,
}: FloorCanvas2DProps) {
  const [activeDesk, setActiveDesk] = useState<DeskNode | null>(
    desks.find((d) => d.id === selectedDeskId) || null
  );

  const handleDeskClick = (desk: DeskNode) => {
    setActiveDesk(desk);
    onSelectDesk?.(desk);
  };

  const getStatusColor = (status: DeskStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600";
      case "OCCUPIED":
        return "bg-rose-500 border-rose-600 text-white cursor-not-allowed";
      case "RESERVED":
        return "bg-amber-500 border-amber-600 text-white";
      case "MAINTENANCE":
        return "bg-slate-400 border-slate-500 text-white cursor-not-allowed";
      default:
        return "bg-slate-300";
    }
  };

  const getStatusLabel = (status: DeskStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "Trống (Có thể đặt)";
      case "OCCUPIED":
        return "Đang có người";
      case "RESERVED":
        return "Đã đặt trước";
      case "MAINTENANCE":
        return "Bảo trì";
    }
  };

  return (
    <div className={cn("space-y-4 rounded-xl border border-border bg-white p-4 shadow-xs", className)}>
      {/* Header & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">{floorName}</h3>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Còn trống</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-muted-foreground">Đang dùng</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Đã đặt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            <span className="text-muted-foreground">Bảo trì</span>
          </div>
        </div>
      </div>

      {/* 2D Interactive Floor Plan Canvas */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-inner select-none">
        {/* Floor Blueprint Grid Background */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Meeting Rooms Mock Shapes */}
        <div className="absolute left-[10%] bottom-[8%] w-[35%] h-[28%] rounded-md border-2 border-slate-300 bg-white/80 flex items-center justify-center text-xs text-slate-500 font-medium">
          <div className="text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-slate-400" />
            Phòng Họp Mặt Trời (16 chỗ)
          </div>
        </div>

        <div className="absolute right-[10%] bottom-[8%] w-[35%] h-[28%] rounded-md border-2 border-slate-300 bg-white/80 flex items-center justify-center text-xs text-slate-500 font-medium">
          <div className="text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-slate-400" />
            Phòng Họp Sao Băng (8 chỗ)
          </div>
        </div>

        {/* Zone Labels */}
        <div className="absolute left-[15%] top-[8%] text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Zone A — Technology Hub
        </div>
        <div className="absolute right-[15%] top-[8%] text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Zone B — Business & Sales
        </div>

        {/* Desk Nodes */}
        {desks.map((desk) => {
          const isSelected = activeDesk?.id === desk.id;
          return (
            <button
              key={desk.id}
              type="button"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-lg border-2 flex flex-col items-center justify-center shadow-xs transition-all duration-150 cursor-pointer",
                getStatusColor(desk.status),
                isSelected && "ring-4 ring-primary/40 scale-110 z-20"
              )}
              style={{ left: `${desk.x}%`, top: `${desk.y}%` }}
              onClick={() => handleDeskClick(desk)}
              title={`${desk.code} — ${getStatusLabel(desk.status)}`}
            >
              <Monitor className="h-3.5 w-3.5 opacity-90" />
              <span className="text-2xs font-bold font-mono tracking-tight">{desk.code}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Desk Details Card */}
      {activeDesk && (
        <div className="p-3.5 rounded-lg border border-primary/20 bg-primary/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-primary/30 flex items-center justify-center text-primary font-bold font-mono text-sm">
              {activeDesk.code}
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                Bàn làm việc {activeDesk.code}
                <Badge variant="outline" className="text-xs">
                  {getStatusLabel(activeDesk.status)}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {activeDesk.zoneName}
                {activeDesk.currentAssignee && ` • Người ngồi: ${activeDesk.currentAssignee}`}
              </div>
            </div>
          </div>

          {!readOnly && activeDesk.status === "AVAILABLE" && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs">
              Đặt bàn này ngay
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
