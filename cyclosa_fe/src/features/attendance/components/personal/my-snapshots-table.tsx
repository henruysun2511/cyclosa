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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, FileCheck2 } from "lucide-react";
import type { TimesheetSnapshotResponse } from "../../types/attendance.types";

interface MySnapshotsTableProps {
  snapshots: TimesheetSnapshotResponse[];
  isLoading: boolean;
}

export function MySnapshotsTable({ snapshots, isLoading }: MySnapshotsTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Kỳ công</TableHead>
            <TableHead className="text-center">Số công chuẩn</TableHead>
            <TableHead className="text-center">Công thực tế</TableHead>
            <TableHead className="text-center">Giờ làm việc</TableHead>
            <TableHead className="text-center">Giờ OT</TableHead>
            <TableHead className="text-center">Nghỉ phép có lương</TableHead>
            <TableHead className="text-center">Nghỉ không lương</TableHead>
            <TableHead className="text-right">Ngày chốt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : snapshots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileCheck2 className="h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Chưa có kỳ công nào được chốt sổ cho bạn</p>
                  <p className="text-xs text-muted-foreground">
                    Dữ liệu công sẽ hiển thị sau khi phòng Nhân sự khóa snapshot kỳ công tháng
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            snapshots.map((snap) => (
              <TableRow key={snap.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                    {snap.periodName || "Kỳ công"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{snap.periodCode}</div>
                </TableCell>
                <TableCell className="text-center font-mono font-medium">
                  {snap.standardWorkDays} ngày
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {snap.actualWorkDays} ngày
                </TableCell>
                <TableCell className="text-center font-mono">
                  {snap.totalWorkHours}h
                </TableCell>
                <TableCell className="text-center font-mono text-rose-600 dark:text-rose-400 font-semibold">
                  {snap.totalOvertimeHours}h
                </TableCell>
                <TableCell className="text-center font-mono">
                  {snap.paidLeaveDays} ngày
                </TableCell>
                <TableCell className="text-center font-mono text-muted-foreground">
                  {snap.unpaidLeaveDays} ngày
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {snap.lockedAt ? new Date(snap.lockedAt).toLocaleDateString("vi-VN") : "--"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

