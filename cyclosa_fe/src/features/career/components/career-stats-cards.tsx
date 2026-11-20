"use client";

import React from "react";
import { Compass, AlertOctagon, UserCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CareerStatisticsResponse } from "../types/career.types";

interface CareerStatsCardsProps {
  stats?: CareerStatisticsResponse;
  selectedFilter?: string;
  onFilterSelect?: (filter: string | undefined) => void;
  isLoading?: boolean;
}

export function CareerStatsCards({
  stats,
  selectedFilter,
  onFilterSelect,
  isLoading = false,
}: CareerStatsCardsProps) {
  const cards = [
    {
      key: "ALL",
      label: "Vị trí trọng yếu",
      count: stats?.totalKeyPositions ?? 0,
      subtext: "Vị trí chiến lược cần kế nhiệm",
      icon: Compass,
      boxColor: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      valueColor: "text-foreground",
      sparkColor: "#3B82F6",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "HIGH_RISK",
      label: "Rủi ro cao / Nguy cấp",
      count: stats?.highRiskPositions ?? 0,
      subtext: "Thiếu ứng viên hoặc rủi ro trống vị trí",
      icon: AlertOctagon,
      boxColor: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      valueColor: "text-rose-600 dark:text-rose-400",
      sparkColor: "#E11D48",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "READY_NOW",
      label: "Sẵn sàng kế nhiệm",
      count: stats?.readyNowCandidates ?? 0,
      subtext: "Ứng viên có thể tiếp quản ngay (0-3 tháng)",
      icon: UserCheck,
      boxColor: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
      sparkColor: "#059669",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "TALENTS",
      label: "Kho nhân tài nội bộ",
      count: stats?.totalTalents ?? 0,
      subtext: "Hi-Po, Chuyên gia và nhân tài then chốt",
      icon: Sparkles,
      boxColor: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
      valueColor: "text-purple-600 dark:text-purple-400",
      sparkColor: "#8B5CF6",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedFilter === item.key;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (!onFilterSelect) return;
              onFilterSelect(selectedFilter === item.key ? undefined : item.key);
            }}
            className={cn(
              "relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200",
              onFilterSelect && "cursor-pointer",
              isSelected && "ring-2 ring-primary border-primary bg-primary/5"
            )}
          >
            {/* SVG Sparkline chìm góc dưới */}
            <div className="absolute right-0 bottom-0 w-28 h-12 opacity-15 pointer-events-none">
              <svg viewBox="0 0 100 40" className="w-full h-full preserve-3d">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Cột trái: Label + Value + Subtext */}
            <div className="space-y-1 z-10">
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <h3 className={cn("text-2xl font-bold tracking-tight font-mono", item.valueColor)}>
                {isLoading ? "..." : item.count.toLocaleString("vi-VN")}
              </h3>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.subtext}
                </span>
              </div>
            </div>

            {/* Cột phải: Icon Box chuẩn h-12 w-12 rounded-xl */}
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl z-10 transition-transform duration-200 group-hover:scale-105",
                item.boxColor
              )}
            >
              <Icon className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
