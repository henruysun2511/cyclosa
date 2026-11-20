"use client";

import React from "react";
import { Users, CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaveBalanceDto } from "../../types/leave.types";

interface LeaveBalanceKpiCardsProps {
  items: LeaveBalanceDto[];
  selectedGroup?: string;
  onSelectGroup?: (group: string) => void;
}

export function LeaveBalanceKpiCards({
  items,
  selectedGroup,
  onSelectGroup,
}: LeaveBalanceKpiCardsProps) {
  const totalEmployees = new Set(items.map((i) => i.employeeId)).size;
  const totalEntitled = items.reduce((acc, i) => acc + (i.totalEntitledDays || 0), 0);
  const totalUsed = items.reduce((acc, i) => acc + (i.usedDays || 0), 0);
  const totalRemaining = items.reduce((acc, i) => acc + (i.remainingDays || 0), 0);

  const cards = [
    {
      key: "ALL",
      label: "Nhân sự đã cấp quỹ",
      count: totalEmployees,
      icon: Users,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "ENTITLED",
      label: "Tổng ngày cấp & tồn",
      count: Number(totalEntitled.toFixed(1)),
      icon: CalendarDays,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#3B82F6",
      sparkPath: "M0,25 Q30,35 60,15 T100,20",
    },
    {
      key: "USED",
      label: "Tổng ngày đã dùng",
      count: Number(totalUsed.toFixed(1)),
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
    },
    {
      key: "REMAINING",
      label: "Số dư khả dụng",
      count: Number(totalRemaining.toFixed(1)),
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
        const isSelected = selectedGroup === item.key;

        return (
          <div
            key={item.key}
            onClick={() => onSelectGroup?.(item.key)}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all group bg-card",
              onSelectGroup ? "cursor-pointer" : "cursor-default",
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
