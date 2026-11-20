"use client";

import React from "react";
import { Users, Clock, Calendar, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransferStatistics } from "../types/transfer.types";

interface TransferStatsCardsProps {
  stats?: TransferStatistics;
  selectedFilter?: string;
  onFilterSelect?: (filter: string | undefined) => void;
  isLoading?: boolean;
}

export function TransferStatsCards({
  stats,
  selectedFilter,
  onFilterSelect,
  isLoading = false,
}: TransferStatsCardsProps) {
  const cards = [
    {
      key: "ALL",
      label: "Tổng phiếu điều chuyển",
      count: stats?.total ?? 0,
      subtext: "Toàn bộ biến động công tác",
      icon: Users,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "PENDING_APPROVAL",
      label: "Chờ phê duyệt",
      count: stats?.pendingApprovalCount ?? 0,
      subtext: "Cần thẩm định phê duyệt",
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "APPROVED",
      label: "Đã duyệt chờ hiệu lực",
      count: stats?.approvedCount ?? 0,
      subtext: "Sẵn sàng áp dụng hồ sơ",
      icon: Calendar,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "TEMPORARY_DISPATCH",
      label: "Điều chuyển tạm thời",
      count: stats?.temporaryDispatchCount ?? 0,
      subtext: "Biệt phái & dự án ngắn hạn",
      icon: Shuffle,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
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
