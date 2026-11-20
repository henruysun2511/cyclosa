"use client";

import React, { useState } from "react";
import { History, Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AttendancePageHeader,
  useGetAttendanceAdjustmentsQuery,
} from "@/features/attendance";

export default function AttendanceAdjustmentsPage() {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const { data: adjustmentsData, isLoading } = useGetAttendanceAdjustmentsQuery({
    employeeId: employeeId || undefined,
    date: date || undefined,
    page: 0,
    size: 50,
  });

  const adjustments = adjustmentsData?.data?.items || [];

  const formatTime = (iso?: string | null) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Lịch sử hiệu chỉnh công"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Lịch sử hiệu chỉnh" },
        ]}
        icon={History}
      />

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 shadow-xs">
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã NV hoặc ID..."
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-[160px] h-9"
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEmployeeId("");
            setDate("");
          }}
          className="h-9 px-2 text-muted-foreground hover:text-foreground"
          title="Đặt lại"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Bảng hiệu chỉnh */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Nhân viên</TableHead>
              <TableHead>Ngày áp dụng</TableHead>
              <TableHead className="text-center">Giờ gốc (Vào - Ra)</TableHead>
              <TableHead className="text-center">Giờ điều chỉnh (Vào - Ra)</TableHead>
              <TableHead className="text-center">Công nhận (Giờ)</TableHead>
              <TableHead>Lý do hiệu chỉnh</TableHead>
              <TableHead className="text-right">Người điều chỉnh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : adjustments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <History className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Chưa có bản ghi hiệu chỉnh công nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              adjustments.map((adj) => (
                <TableRow key={adj.id} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {adj.employeeName || (adj.employeeId ? adj.employeeId.slice(0, 8) : "--")}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{adj.employeeCode || "--"}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {adj.attendanceDate ? new Date(adj.attendanceDate).toLocaleDateString("vi-VN") : "--"}
                  </TableCell>
                  <TableCell className="text-center font-mono text-muted-foreground">
                    {formatTime(adj.originalInTime)} - {formatTime(adj.originalOutTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatTime(adj.adjustedInTime)} - {formatTime(adj.adjustedOutTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {adj.adjustedWorkHours ? `${adj.adjustedWorkHours}h` : "--"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={adj.reason}>
                    {adj.reason}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-foreground">{adj.adjustedByName || "Hệ thống"}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(adj.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

