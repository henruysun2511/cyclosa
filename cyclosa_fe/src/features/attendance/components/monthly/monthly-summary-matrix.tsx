"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarX2 } from "lucide-react";
import type { MonthlyTimesheetSummaryResponse, DailyAttendanceStatus } from "../../types/attendance.types";

interface MonthlySummaryMatrixProps {
  summaries: MonthlyTimesheetSummaryResponse[];
  year: number;
  month: number;
  isLoading: boolean;
}

export function MonthlySummaryMatrix({
  summaries,
  year,
  month,
  isLoading,
}: MonthlySummaryMatrixProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getDayOfWeekLabel = (day: number) => {
    const d = new Date(year, month - 1, day);
    const dayIndex = d.getDay();
    const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return {
      label: labels[dayIndex],
      isWeekend: dayIndex === 0 || dayIndex === 6,
    };
  };

  const getStatusSymbol = (status?: DailyAttendanceStatus) => {
    switch (status) {
      case "ON_TIME":
        return <span className="font-bold text-emerald-600 dark:text-emerald-400" title="Đủ công">✓</span>;
      case "LATE":
        return <span className="font-bold text-amber-600 dark:text-amber-400" title="Đi muộn">M</span>;
      case "EARLY":
        return <span className="font-bold text-orange-600 dark:text-orange-400" title="Về sớm">S</span>;
      case "LATE_AND_EARLY":
        return <span className="font-bold text-amber-700 dark:text-amber-300" title="Muộn & Sớm">MS</span>;
      case "MISSING_CHECK_OUT":
        return <span className="font-bold text-rose-500" title="Thiếu ra">!</span>;
      case "ABSENT":
        return <span className="font-bold text-rose-600 dark:text-rose-400" title="Vắng">V</span>;
      case "EXPLAINED":
        return <span className="font-bold text-purple-600 dark:text-purple-400" title="Giải trình">GT</span>;
      case "LEAVE_PAID":
      case "LEAVE_UNPAID":
        return <span className="font-bold text-muted-foreground" title="Nghỉ phép">P</span>;
      default:
        return <span className="text-muted-foreground/30">-</span>;
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[1400px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px] sticky left-0 z-20 bg-muted/50 font-semibold border-r">
                Nhân viên
              </TableHead>
              {dayNumbers.map((day) => {
                const { label, isWeekend } = getDayOfWeekLabel(day);
                return (
                  <TableHead
                    key={day}
                    className={`text-center p-1 min-w-[34px] text-xs font-semibold ${
                      isWeekend ? "bg-muted/80 text-amber-600 dark:text-amber-400" : ""
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px] font-normal text-muted-foreground">{label}</div>
                  </TableHead>
                );
              })}
              <TableHead className="w-[80px] text-center font-semibold border-l">Tổng công</TableHead>
              <TableHead className="w-[80px] text-center font-semibold">Tổng giờ</TableHead>
              <TableHead className="w-[70px] text-center font-semibold">Muộn/Sớm</TableHead>
              <TableHead className="w-[70px] text-center font-semibold">Giờ OT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="sticky left-0 bg-card border-r">
                    <Skeleton className="h-4 w-28 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </TableCell>
                  {dayNumbers.map((d) => (
                    <TableCell key={d} className="p-1 text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                  ))}
                  <TableCell className="text-center border-l"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : summaries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={daysInMonth + 5}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CalendarX2 className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Chưa có bảng công tổng hợp trong Tháng {month}/{year}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              summaries.map((s, sIdx) => {
                // Tạo map day -> record
                const dayMap = new Map<number, DailyAttendanceStatus>();
                s.dailyRecords?.forEach((r) => {
                  const d = new Date(r.workDate || r.attendanceDate || "").getDate();
                  const st = r.dailyStatus || r.status;
                  if (st) {
                    dayMap.set(d, st);
                  }
                });

                return (
                  <TableRow key={s.employeeId || s.employeeCode || sIdx} className="hover:bg-muted/30 text-xs">
                    <TableCell className="sticky left-0 z-10 bg-card border-r py-2">
                      <div className="font-medium text-foreground truncate max-w-[160px]">
                        {s.employeeName || (s.employeeId ? s.employeeId.slice(0, 8) : "--")}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{s.employeeCode || "--"}</div>
                    </TableCell>
                    {dayNumbers.map((day) => {
                      const { isWeekend } = getDayOfWeekLabel(day);
                      return (
                        <TableCell
                          key={day}
                          className={`p-1 text-center text-[11px] ${
                            isWeekend ? "bg-muted/20" : ""
                          }`}
                        >
                          {getStatusSymbol(dayMap.get(day))}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 border-l">
                      {s.totalWorkDays ?? 0}
                    </TableCell>
                    <TableCell className="text-center font-mono font-medium">
                      {s.totalWorkHours ?? 0}h
                    </TableCell>
                    <TableCell className="text-center font-mono text-amber-600 dark:text-amber-400">
                      {(s.lateTimes || 0) + (s.earlyTimes || 0)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-rose-600 dark:text-rose-400">
                      {s.totalOvertimeHours ?? 0}h
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

