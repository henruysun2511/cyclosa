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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileEdit, CalendarX2 } from "lucide-react";
import { AttendanceStatusBadge } from "../shared/attendance-status-badge";
import type { DailyAttendanceRecordResponse } from "../../types/attendance.types";

interface MyDailyRecordsTableProps {
  records: DailyAttendanceRecordResponse[];
  isLoading: boolean;
  onRequestExplanation?: (record: DailyAttendanceRecordResponse) => void;
}

export function MyDailyRecordsTable({
  records,
  isLoading,
  onRequestExplanation,
}: MyDailyRecordsTableProps) {
  const formatTime = (iso?: string | null) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[120px]">Ngày</TableHead>
            <TableHead>Ca làm việc</TableHead>
            <TableHead className="text-center">Giờ vào</TableHead>
            <TableHead className="text-center">Giờ ra</TableHead>
            <TableHead className="text-center">Giờ làm việc</TableHead>
            <TableHead className="text-center">Đi muộn / Về sớm</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <CalendarX2 className="h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Chưa có bản ghi chấm công trong khoảng thời gian này</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            records.map((r, rIdx) => {
              const hasAnomaly =
                r.lateMinutes > 0 ||
                (r.earlyDepartureMinutes || r.earlyMinutes || 0) > 0 ||
                r.dailyStatus === "ABSENT" ||
                r.status === "ABSENT" ||
                r.dailyStatus === "MISSING_CHECK_OUT" ||
                r.status === "MISSING_CHECK_OUT";

              return (
                <TableRow key={r.attendanceDate || r.workDate || rIdx} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-xs">
                    {new Date(r.attendanceDate || r.workDate || "").toLocaleDateString("vi-VN", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-foreground">{r.shiftName}</span>
                    <span className="text-muted-foreground ml-1 text-[11px]">({r.shiftCode || r.shiftHours})</span>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {formatTime(r.firstInTime || r.checkInTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {formatTime(r.lastOutTime || r.checkOutTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs font-medium">
                    {r.actualWorkHours ? `${r.actualWorkHours}h` : r.workCredit ? `${r.workCredit} công` : "0h"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    {r.lateMinutes > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium mr-1.5">
                        +{r.lateMinutes}p muộn
                      </span>
                    )}
                    {(r.earlyDepartureMinutes || r.earlyMinutes || 0) > 0 && (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        +{(r.earlyDepartureMinutes || r.earlyMinutes)}p sớm
                      </span>
                    )}
                    {!r.lateMinutes && !(r.earlyDepartureMinutes || r.earlyMinutes) && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <AttendanceStatusBadge status={r.dailyStatus || r.status || "ON_TIME"} />
                  </TableCell>
                  <TableCell className="text-right">
                    {hasAnomaly && onRequestExplanation && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onRequestExplanation(r)}
                      >
                        <FileEdit className="mr-1 h-3.5 w-3.5" />
                        Giải trình
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

