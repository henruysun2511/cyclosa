"use client";

import React from "react";
import { Users, UserCheck, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeStatsCardsProps {
  total: number;
  activeCount: number;
  probationCount: number;
  leaveCount: number;
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
}

export function EmployeeStatsCards({
  total,
  activeCount,
  probationCount,
  leaveCount,
  selectedStatus,
  onSelectStatus,
}: EmployeeStatsCardsProps) {
  const cards = [
    {
      key: "ALL",
      label: "Tổng nhân sự",
      count: total,
      icon: Users,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      key: "ACTIVE",
      label: "Chính thức (Active)",
      count: activeCount,
      icon: UserCheck,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
    {
      key: "PROBATION",
      label: "Thử việc (Probation)",
      count: probationCount,
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
    },
    {
      key: "ON_LEAVE",
      label: "Nghỉ chế độ / Thai sản",
      count: leaveCount,
      icon: CalendarDays,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#3B82F6",
      sparkPath: "M0,25 Q30,35 60,15 T100,20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.key === "ALL") || selectedStatus === item.key;

        return (
          <div
            key={item.key}
            onClick={() => onSelectStatus(item.key)}
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
                  {item.count}
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
