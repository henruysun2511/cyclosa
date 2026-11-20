"use client";

import React from "react";
import { Award, DollarSign, CalendarCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RewardDecision } from "../types/reward.types";

interface RewardStatsCardsProps {
  items: RewardDecision[];
  totalElements?: number;
  selectedType?: string;
  onFilterType?: (type: string | undefined) => void;
  isLoading?: boolean;
}

export function RewardStatsCards({
  items,
  totalElements,
  selectedType,
  onFilterType,
  isLoading,
}: RewardStatsCardsProps) {
  const total = totalElements ?? items.length;
  const monetaryItems = items.filter((i) => i.rewardType === "MONETARY_BONUS");
  const monetaryCount = monetaryItems.length;
  const pushedCount = items.filter((i) => i.pushedToPayroll).length;
  const nonMonetaryCount = items.filter((i) => i.rewardType !== "MONETARY_BONUS").length;

  const stats = [
    {
      key: "ALL",
      label: "Tổng số quyết định",
      count: total,
      icon: Award,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "MONETARY_BONUS",
      label: "Thưởng tiền mặt (Bonus)",
      count: monetaryCount,
      icon: DollarSign,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      key: "PUSHED",
      label: "Đã chuyển vào lương",
      count: pushedCount,
      icon: CheckCircle2,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      key: "NON_MONETARY",
      label: "Khen thưởng danh hiệu",
      count: nonMonetaryCount,
      icon: CalendarCheck,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedType && item.key === "ALL") ||
          selectedType === item.key;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterType) return;
              if (item.key === "ALL") {
                onFilterType(selectedType === "ALL" ? undefined : "ALL");
              } else if (item.key === "MONETARY_BONUS") {
                onFilterType(selectedType === "MONETARY_BONUS" ? "ALL" : "MONETARY_BONUS");
              } else if (item.key === "NON_MONETARY") {
                onFilterType(selectedType === "TITLE_RECOGNITION" ? "ALL" : "TITLE_RECOGNITION");
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
