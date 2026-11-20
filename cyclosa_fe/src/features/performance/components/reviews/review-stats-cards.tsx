"use client";

import React from "react";
import { FileText, UserCheck, ShieldCheck, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PerformanceReviewDto } from "../../types/performance.types";

interface ReviewStatsCardsProps {
  reviews: PerformanceReviewDto[];
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
  isLoading?: boolean;
}

export function ReviewStatsCards({
  reviews,
  selectedStatus,
  onFilterStatus,
  isLoading,
}: ReviewStatsCardsProps) {
  const total = reviews.length;
  const selfEvaluated = reviews.filter((r) => r.status === "SELF_REVIEWED").length;
  const managerEvaluated = reviews.filter((r) => r.status === "MANAGER_REVIEWED").length;
  const finalized = reviews.filter((r) => r.status === "FINALIZED").length;

  const stats = [
    {
      label: "Tổng số phiếu đánh giá",
      count: total,
      icon: FileText,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
      statusKey: "ALL",
    },
    {
      label: "Đã tự đánh giá",
      count: selfEvaluated,
      icon: UserCheck,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
      statusKey: "SELF_REVIEWED",
    },
    {
      label: "Quản lý đã chấm điểm",
      count: managerEvaluated,
      icon: ShieldCheck,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
      statusKey: "MANAGER_REVIEWED",
    },
    {
      label: "Đã chốt kết quả",
      count: finalized,
      icon: Award,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
      statusKey: "FINALIZED",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.statusKey === "ALL") ||
          selectedStatus === item.statusKey;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterStatus) return;
              if (item.statusKey === "ALL") {
                onFilterStatus(selectedStatus === "ALL" ? undefined : "ALL");
              } else {
                onFilterStatus(selectedStatus === item.statusKey ? "ALL" : item.statusKey);
              }
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
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
              </div>
            </div>

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
