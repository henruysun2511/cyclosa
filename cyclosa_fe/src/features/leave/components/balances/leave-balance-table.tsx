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
import { Calculator } from "lucide-react";
import { LeaveGroupBadge } from "../shared/leave-group-badge";
import type { LeaveBalanceDto } from "../../types/leave.types";

interface LeaveBalanceTableProps {
  items: LeaveBalanceDto[];
  isLoading: boolean;
  onRecalculate: (item: LeaveBalanceDto) => void;
  isRecalculating?: boolean;
}

export function LeaveBalanceTable({
  items,
  isLoading,
  onRecalculate,
  isRecalculating,
}: LeaveBalanceTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="min-w-[180px] text-xs font-semibold">Nhân viên</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Phòng ban / Chức danh</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Loại nghỉ</TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold">Được cấp</TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold">Phép chuyển</TableHead>
            <TableHead className="w-[110px] text-center text-xs font-semibold">Tổng quỹ</TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold text-amber-700 dark:text-amber-400">
              Chờ duyệt
            </TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold text-blue-700 dark:text-blue-400">
              Đã dùng
            </TableHead>
            <TableHead className="w-[110px] text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Khả dụng
            </TableHead>
            <TableHead className="w-[100px] text-right text-xs font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-7 w-16 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy dữ liệu quỹ phép nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                <TableCell>
                  <div className="font-semibold text-xs text-foreground">
                    {item.employeeFullName || "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    {item.employeeCode}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-foreground">
                    {item.departmentName || "—"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.jobTitleName || "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-xs text-foreground">{item.leaveTypeName}</div>
                  <div className="mt-1">
                    <LeaveGroupBadge group={item.leaveGroup} />
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs font-medium text-foreground">
                  {item.entitledDays}
                </TableCell>
                <TableCell className="text-center text-xs text-muted-foreground">
                  {item.carriedOverDays > 0 ? `+${item.carriedOverDays}` : "0"}
                </TableCell>
                <TableCell className="text-center text-xs font-bold text-foreground">
                  {item.totalEntitledDays}
                </TableCell>
                <TableCell className="text-center text-xs font-semibold text-amber-600">
                  {item.pendingDays > 0 ? item.pendingDays : "—"}
                </TableCell>
                <TableCell className="text-center text-xs font-semibold text-blue-600">
                  {item.usedDays > 0 ? item.usedDays : "—"}
                </TableCell>
                <TableCell className="text-center text-xs font-bold text-emerald-600">
                  {item.remainingDays}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRecalculate(item)}
                    disabled={isRecalculating}
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                    title="Tính lại số ngày cấp theo thâm niên & thời gian"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    Tính lại
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
