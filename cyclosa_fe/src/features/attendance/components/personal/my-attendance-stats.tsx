"use client";

import React from "react";
import { Clock, CalendarCheck, AlertTriangle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DailyAttendanceRecordResponse } from "../../types/attendance.types";

interface MyAttendanceStatsProps {
  records: DailyAttendanceRecordResponse[];
  isLoading: boolean;
}

export function MyAttendanceStats({ records, isLoading }: MyAttendanceStatsProps) {
  const stats = React.useMemo(() => {
    let totalWorkHours = 0;
    let lateOrEarlyCount = 0;
    let otHours = 0;
    let standardDays = 0;

    records.forEach((r) => {
      totalWorkHours += r.actualWorkHours || r.workCredit || 0;
      if (r.lateMinutes > 0 || (r.earlyDepartureMinutes || r.earlyMinutes || 0) > 0) {
        lateOrEarlyCount++;
      }
      otHours += (r.overtimeMinutes || 0) / 60;
      if (
        r.dailyStatus === "ON_TIME" ||
        r.status === "ON_TIME" ||
        r.dailyStatus === "EXPLAINED" ||
        r.status === "EXPLAINED"
      ) {
        standardDays += 1;
      }
    });

    return {
      totalWorkHours: totalWorkHours.toFixed(1),
      lateOrEarlyCount,
      otHours: otHours.toFixed(1),
      standardDays,
    };
  }, [records]);

  const cards = [
    {
      label: "Công chuẩn tích lũy",
      value: `${stats.standardDays} ngày`,
      subtext: "Đủ giờ & đúng quy định",
      icon: CalendarCheck,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q30,15 60,28 T100,10",
    },
    {
      label: "Tổng giờ làm việc",
      value: `${stats.totalWorkHours}h`,
      subtext: "Thời gian làm thực tế",
      icon: Clock,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      label: "Đi muộn / Về sớm",
      value: `${stats.lateOrEarlyCount} lần`,
      subtext: "Cần chú ý tuân thủ giờ",
      icon: AlertTriangle,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q35,12 70,25 T100,15",
    },
    {
      label: "Tăng ca (OT)",
      value: `${stats.otHours}h`,
      subtext: "Đã được ghi nhận",
      icon: Flame,
      iconBg: "bg-rose-600 text-white",
      sparkColor: "#E11D48",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group"
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
                  {isLoading ? "..." : item.value}
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
