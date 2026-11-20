"use client";

import React from "react";
import { CalendarDays, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaveBalanceDto } from "../../types/leave.types";

interface MyLeaveKpiCardsProps {
  balances: LeaveBalanceDto[];
}

export function MyLeaveKpiCards({ balances }: MyLeaveKpiCardsProps) {
  // Tìm quỹ phép năm chính (ANNUAL)
  const annualBalance =
    balances.find((b) => b.leaveGroup === "ANNUAL") || balances[0];

  const totalEntitled = annualBalance?.totalEntitledDays || 0;
  const usedDays = annualBalance?.usedDays || 0;
  const pendingDays = annualBalance?.pendingDays || 0;
  const remainingDays = annualBalance?.remainingDays || 0;

  const cards = [
    {
      key: "REMAINING",
      label: "Phép năm khả dụng",
      count: Number(remainingDays.toFixed(1)),
      icon: Sparkles,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
    {
      key: "ENTITLED",
      label: "Tổng quỹ phép năm",
      count: Number(totalEntitled.toFixed(1)),
      icon: CalendarDays,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#3B82F6",
      sparkPath: "M0,25 Q30,35 60,15 T100,20",
    },
    {
      key: "USED",
      label: "Đã sử dụng",
      count: Number(usedDays.toFixed(1)),
      icon: CheckCircle2,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "PENDING",
      label: "Đang chờ phê duyệt",
      count: Number(pendingDays.toFixed(1)),
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all group bg-card border-border hover:border-primary/40 hover:shadow-md"
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
                  {item.count}
                </h3>
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 100 40">
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
