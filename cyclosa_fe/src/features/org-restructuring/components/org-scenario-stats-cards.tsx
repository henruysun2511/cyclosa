"use client";

import React from "react";
import { FolderGit2, Edit3, Clock, CheckCircle2 } from "lucide-react";
import type { OrgScenarioStatistics } from "../types/org-restructuring.types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OrgScenarioStatsCardsProps {
  stats?: OrgScenarioStatistics;
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
  isLoading?: boolean;
}

export function OrgScenarioStatsCards({
  stats,
  selectedStatus,
  onFilterStatus,
  isLoading = false,
}: OrgScenarioStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs bg-card">
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      key: "ALL",
      label: "Tổng số Kịch bản",
      count: stats?.totalScenarios || 0,
      icon: FolderGit2,
      iconBg: "bg-primary text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "DRAFT",
      label: "Bản nháp đang dựng",
      count: stats?.draftScenarios || 0,
      icon: Edit3,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q30,12 60,25 T100,10",
    },
    {
      key: "SUBMITTED",
      label: "Chờ thẩm định",
      count: stats?.submittedScenarios || 0,
      icon: Clock,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
      sparkPath: "M0,28 Q35,15 70,28 T100,12",
    },
    {
      key: "EXECUTED",
      label: "Đã áp dụng thực tế",
      count: stats?.executedScenarios || 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.key === "ALL") ||
          selectedStatus === item.key;

        return (
          <div
            key={item.key}
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
            {/* Cột trái: Icon Box lớn + Label + Số đếm font mono */}
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
                  {item.count}
                </h3>
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
