"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisciplineCase } from "../types/reward.types";

interface DisciplineStatsCardsProps {
  items: DisciplineCase[];
  totalElements?: number;
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
  isLoading?: boolean;
}

export function DisciplineStatsCards({
  items,
  totalElements,
  selectedStatus,
  onFilterStatus,
  isLoading,
}: DisciplineStatsCardsProps) {
  const total = totalElements ?? items.length;
  const draftCount = items.filter((i) => i.status === "DRAFT").length;
  const decidedCount = items.filter((i) => i.status === "DECIDED").length;
  const pendingDismissalCount = items.filter(
    (i) => i.status === "PENDING_DISMISSAL_APPROVAL"
  ).length;

  const stats = [
    {
      key: "ALL",
      label: "Tổng số vụ việc",
      count: total,
      icon: ShieldAlert,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "DRAFT",
      label: "Đang thụ lý / Dự thảo",
      count: draftCount,
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "PENDING_DISMISSAL_APPROVAL",
      label: "Chờ duyệt sa thải",
      count: pendingDismissalCount,
      icon: AlertCircle,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "DECIDED",
      label: "Đã ban hành quyết định",
      count: decidedCount,
      icon: CheckCircle2,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.key === "ALL") ||
          selectedStatus === item.key;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterStatus) return;
              if (item.key === "ALL") {
                onFilterStatus(selectedStatus === "ALL" ? undefined : "ALL");
              } else {
                onFilterStatus(selectedStatus === item.key ? "ALL" : item.key);
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
