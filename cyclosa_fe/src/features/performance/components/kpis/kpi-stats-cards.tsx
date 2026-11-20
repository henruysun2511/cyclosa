"use client";

import React from "react";
import { Layers, CheckCircle2, XCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiDto } from "../../types/performance.types";

interface KpiStatsCardsProps {
  kpis: KpiDto[];
  selectedActive?: string;
  onFilterActive?: (active: string) => void;
  isLoading?: boolean;
}

export function KpiStatsCards({
  kpis,
  selectedActive,
  onFilterActive,
  isLoading,
}: KpiStatsCardsProps) {
  const total = kpis.length;
  const activeCount = kpis.filter((k) => k.isActive).length;
  const inactiveCount = kpis.filter((k) => !k.isActive).length;
  const companyWideCount = kpis.filter((k) => !k.departmentId).length;

  const stats = [
    {
      label: "Tổng chỉ số KPI",
      count: total,
      icon: Layers,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
      key: "ALL",
    },
    {
      label: "Đang áp dụng",
      count: activeCount,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
      key: "true",
    },
    {
      label: "Ngừng áp dụng",
      count: inactiveCount,
      icon: XCircle,
      iconBg: "bg-slate-600 text-white",
      sparkColor: "#64748B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
      key: "false",
    },
    {
      label: "Áp dụng toàn công ty",
      count: companyWideCount,
      icon: Building2,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
      key: "COMPANY_WIDE",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedActive && item.key === "ALL") ||
          selectedActive === item.key;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterActive) return;
              if (item.key === "ALL" || item.key === "COMPANY_WIDE") {
                onFilterActive("ALL");
              } else {
                onFilterActive(selectedActive === item.key ? "ALL" : item.key);
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
