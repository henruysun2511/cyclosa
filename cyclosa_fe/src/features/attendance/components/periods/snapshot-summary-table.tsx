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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileCheck2 } from "lucide-react";
import type { TimesheetSnapshotResponse } from "../../types/attendance.types";
import type { PageData } from "@/types/api.types";

interface SnapshotSummaryTableProps {
  data?: PageData<TimesheetSnapshotResponse>;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export function SnapshotSummaryTable({
  data,
  isLoading,
  onPageChange,
}: SnapshotSummaryTableProps) {
  const items = data?.items || [];
  const totalPages = data?.pagination?.pages || 0;
  const currentPage = data?.pagination?.page || 0;
  const totalElements = data?.pagination?.total || 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Nhân viên</TableHead>
              <TableHead className="text-center">Số công chuẩn</TableHead>
              <TableHead className="text-center">Công thực tế</TableHead>
              <TableHead className="text-center">Giờ làm việc</TableHead>
              <TableHead className="text-center">Tổng giờ OT</TableHead>
              <TableHead className="text-center">Nghỉ phép hưởng lương</TableHead>
              <TableHead className="text-center">Nghỉ không lương</TableHead>
              <TableHead className="text-right">Ngày chốt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileCheck2 className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Chưa có bản ghi Snapshot nào</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &ldquo;Khóa kỳ công&rdquo; để hệ thống chốt snapshot cho toàn bộ nhân sự
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((snap) => (
                <TableRow key={snap.id} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {snap.employeeName || snap.employeeId.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{snap.employeeCode}</div>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <div>
            Hiển thị <span className="font-medium">{items.length}</span> trên{" "}
            <span className="font-medium">{totalElements}</span> bản ghi snapshot
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

