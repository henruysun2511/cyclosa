"use client";

import React from "react";
import { Package, Users, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssetStatistics } from "../types/asset.types";

interface AssetStatsCardsProps {
  stats?: AssetStatistics;
  selectedFilter?: string;
  onFilterSelect?: (filter: string | undefined) => void;
  isLoading?: boolean;
}

export function AssetStatsCards({
  stats,
  selectedFilter,
  onFilterSelect,
  isLoading = false,
}: AssetStatsCardsProps) {
  const cards = [
    {
      key: "ALL",
      label: "Tổng tài sản",
      count: stats?.totalAssets ?? 0,
      subtext: "Toàn bộ hiện vật trong công ty",
      icon: Package,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "ASSIGNED",
      label: "Đang cấp phát",
      count: stats?.assignedAssets ?? 0,
      subtext: "Nhân viên đang sử dụng",
      icon: Users,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "AVAILABLE",
      label: "Sẵn sàng trong kho",
      count: stats?.availableAssets ?? 0,
      subtext: "Thiết bị sẵn sàng bàn giao",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#059669",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "IN_REPAIR",
      label: "Bảo dưỡng / Hỏng",
      count: stats?.maintenanceAssets ?? 0,
      subtext: "Đang bảo dưỡng hoặc cần xử lý",
      icon: AlertTriangle,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedFilter && item.key === "ALL") || selectedFilter === item.key;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (!onFilterSelect) return;
              if (item.key === "ALL") {
                onFilterSelect(selectedFilter === "ALL" ? undefined : "ALL");
              } else {
                onFilterSelect(selectedFilter === item.key ? "ALL" : item.key);
              }
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
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
                <Icon className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {isLoading ? "..." : item.count.toLocaleString("vi-VN")}
                </h3>
                <p className="text-[11px] text-muted-foreground/80 line-clamp-1">
                  {item.subtext}
                </p>
              </div>
            </div>

            {/* Cột phải: Sparkline SVG */}
            <div className="hidden sm:block w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <svg
                viewBox="0 0 100 45"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
