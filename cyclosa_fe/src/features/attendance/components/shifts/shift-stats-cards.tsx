"use client";

import React from "react";
import { Clock, CheckCircle2, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShiftResponse } from "../../types/attendance.types";

interface ShiftStatsCardsProps {
  shifts?: ShiftResponse[];
  totalElements?: number;
  isActive?: string;
  isNightShift?: string;
  onFilterChange?: (filters: { isActive?: string; isNightShift?: string }) => void;
  isLoading?: boolean;
}

export function ShiftStatsCards({
  shifts = [],
  totalElements,
  isActive = "ALL",
  isNightShift = "ALL",
  onFilterChange,
  isLoading = false,
}: ShiftStatsCardsProps) {
  const total = totalElements ?? shifts.length;
  const activeCount = shifts.filter((s) => s.isActive).length;
  const nightCount = shifts.filter((s) => s.isNightShift).length;
  const dayCount = shifts.filter((s) => !s.isNightShift).length;

  const cards = [
    {
      key: "ALL",
      label: "Tổng ca làm việc",
      count: total,
      subtext: "Toàn bộ danh mục ca",
      icon: Clock,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
      isSelected: isActive === "ALL" && isNightShift === "ALL",
      onClick: () => {
        onFilterChange?.({ isActive: "ALL", isNightShift: "ALL" });
      },
    },
    {
      key: "ACTIVE",
      label: "Đang hoạt động",
      count: activeCount,
      subtext: "Sẵn sàng phân ca",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
      isSelected: isActive === "true",
      onClick: () => {
        onFilterChange?.({
          isActive: isActive === "true" ? "ALL" : "true",
          isNightShift: "ALL",
        });
      },
    },
    {
      key: "DAY_SHIFT",
      label: "Ca ngày chuẩn",
      count: dayCount,
      subtext: "Khung giờ hành chính",
      icon: Sun,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
      isSelected: isNightShift === "false",
      onClick: () => {
        onFilterChange?.({
          isActive: "ALL",
          isNightShift: isNightShift === "false" ? "ALL" : "false",
        });
      },
    },
    {
      key: "NIGHT_SHIFT",
      label: "Ca làm qua đêm",
      count: nightCount,
      subtext: "Phụ trội đêm (22h - 06h)",
      icon: Moon,
      iconBg: "bg-indigo-600 text-white",
      sparkColor: "#6366F1",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
      isSelected: isNightShift === "true",
      onClick: () => {
        onFilterChange?.({
          isActive: "ALL",
          isNightShift: isNightShift === "true" ? "ALL" : "true",
        });
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            onClick={item.onClick}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              item.isSelected
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
