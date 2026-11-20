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
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceStatusBadge } from "../shared/attendance-status-badge";
import type { DailyAttendanceRecordResponse } from "../../types/attendance.types";
import type { PageData } from "@/types/api.types";

interface DailyRecordTableProps {
  data?: PageData<DailyAttendanceRecordResponse>;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export function DailyRecordTable({
  data,
  isLoading,
  onPageChange,
}: DailyRecordTableProps) {
  const items = data?.items || [];
  const totalPages = data?.pagination?.pages || 0;
  const currentPage = data?.pagination?.page || 0;
  const totalElements = data?.pagination?.total || 0;

  const formatTime = (iso?: string | null) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Nhân viên</TableHead>
              <TableHead>Ca làm việc</TableHead>
              <TableHead className="text-center">Giờ vào (In)</TableHead>
              <TableHead className="text-center">Giờ ra (Out)</TableHead>
              <TableHead className="text-center">Giờ làm việc</TableHead>
              <TableHead className="text-center">Đi muộn / Về sớm</TableHead>
              <TableHead className="text-center">Tăng ca (OT)</TableHead>
              <TableHead className="text-center">Trạng thái công</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CalendarX2 className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Không có dữ liệu công nhật trong ngày đã chọn</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((r) => (
                <TableRow key={`${r.employeeId}-${r.attendanceDate}`} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {r.employeeName || r.employeeId.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.employeeCode || r.employeeId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-foreground">{r.shiftName}</span>
                    <span className="text-muted-foreground ml-1 text-[11px]">({r.shiftCode})</span>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatTime(r.firstInTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {formatTime(r.lastOutTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-medium">
                    {r.actualWorkHours ? `${r.actualWorkHours}h` : "0h"}
                  </TableCell>
                  <TableCell className="text-center">
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
                  <TableCell className="text-center font-mono">
                    {(r.overtimeMinutes || 0) > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-medium">
                        {((r.overtimeMinutes || 0) / 60).toFixed(1)}h
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <AttendanceStatusBadge status={r.dailyStatus || r.status || "ON_TIME"} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <div>
            Hiển thị <span className="font-medium">{items.length}</span> trên{" "}
            <span className="font-medium">{totalElements}</span> bản ghi công
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 0 || isLoading}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trang trước
            </Button>
            <span className="font-medium">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="h-8"
            >
              Trang sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

