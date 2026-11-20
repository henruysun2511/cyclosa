"use client";

import React from "react";
import { AlertTriangle, MapPinOff, ScanFace, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttendanceExceptionSummaryResponse } from "../../types/attendance.types";

interface ExceptionKpiCardsProps {
  summary?: AttendanceExceptionSummaryResponse | AttendanceExceptionSummaryResponse[];
  selectedType?: string;
  onFilterType?: (type: string | undefined) => void;
  isLoading?: boolean;
}

export function ExceptionKpiCards({
  summary,
  selectedType,
  onFilterType,
  isLoading = false,
}: ExceptionKpiCardsProps) {
  const list = Array.isArray(summary) ? summary : summary ? [summary] : [];
  const single = !Array.isArray(summary) ? summary : undefined;

  const missingPunchCount =
    single?.missingPunchInCount !== undefined
      ? (single.missingPunchInCount || 0) + (single.missingPunchOutCount || 0)
      : list.filter((e) => e.exceptionType?.includes("MISSING")).length;

  const outOfRangeCount =
    single?.outOfRangeCount !== undefined
      ? single.outOfRangeCount
      : list.filter((e) => e.exceptionType?.includes("OUT_OF_RANGE")).length;

  const faceMismatchCount =
    single?.faceMismatchCount !== undefined
      ? single.faceMismatchCount
      : list.filter((e) => e.exceptionType?.includes("FACE")).length;

  const pendingCount =
    single?.pendingRequestCount !== undefined
      ? single.pendingRequestCount
      : list.filter((e) => e.hasPendingRequest).length;

  const cards = [
    {
      key: "MISSING",
      label: "Thiếu quẹt vào / ra",
      count: missingPunchCount,
      subtext: "Chưa đủ cặp quẹt",
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "OUT_OF_RANGE",
      label: "Quẹt ngoài Geofence",
      count: outOfRangeCount,
      subtext: "Vượt bán kính cho phép",
      icon: MapPinOff,
      iconBg: "bg-rose-600 text-white",
      sparkColor: "#E11D48",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "FACE",
      label: "Lệch khuôn mặt",
      count: faceMismatchCount,
      subtext: "Độ khớp AI dưới 80%",
      icon: ScanFace,
      iconBg: "bg-orange-500 text-white",
      sparkColor: "#F97316",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "PENDING",
      label: "Đơn chờ phê duyệt",
      count: pendingCount,
      subtext: "Cần quản lý xử lý",
      icon: AlertTriangle,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedType === item.key;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (!onFilterType) return;
              onFilterType(isSelected ? undefined : item.key);
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all bg-card",
              onFilterType ? "cursor-pointer group" : "",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            {/* Cột trái: Icon Box lớn + Label + Số đếm */}
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {isLoading ? "..." : item.count}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.subtext}</p>
              </div>
            </div>

            {/* Cột phải: Sparkline SVG */}
            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
