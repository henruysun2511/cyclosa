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
import { Badge } from "@/components/ui/badge";
import { Ban, Eye } from "lucide-react";
import Link from "next/link";
import { LeaveStatusBadge } from "../shared/leave-status-badge";
import { DAY_PORTION_LABELS } from "../../constants/leave.constants";
import type { LeaveRequestDto } from "../../types/leave.types";

interface MyLeaveRequestTableProps {
  items: LeaveRequestDto[];
  isLoading: boolean;
  onCancel: (item: LeaveRequestDto) => void;
  isCancelling?: boolean;
}

export function MyLeaveRequestTable({
  items,
  isLoading,
  onCancel,
  isCancelling,
}: MyLeaveRequestTableProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[180px] text-xs font-semibold">Loại nghỉ</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Thời gian nghỉ</TableHead>
            <TableHead className="w-[90px] text-center text-xs font-semibold">Buổi nghỉ</TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold">Số ngày</TableHead>
            <TableHead className="min-w-[180px] text-xs font-semibold">Lý do</TableHead>
            <TableHead className="w-[130px] text-center text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Thời điểm nộp</TableHead>
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
                    <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-7 w-16 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-xs text-muted-foreground">
                Bạn chưa có đơn xin nghỉ phép nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const canCancel =
                (item.status === "PENDING_APPROVAL" || item.status === "APPROVED") &&
                item.startDate >= today;

              return (
                <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-xs text-foreground">
                      {item.leaveTypeName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {item.leaveTypeCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-foreground">
                      {new Date(item.startDate).toLocaleDateString("vi-VN")}
                      {item.startDate !== item.endDate &&
                        ` → ${new Date(item.endDate).toLocaleDateString("vi-VN")}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {DAY_PORTION_LABELS[item.dayPortion]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold text-xs text-foreground">
                    {item.daysCount} ngày
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={item.reason || ""}>
                      {item.reason || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <LeaveStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.submittedAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 cursor-pointer"
                        title="Xem chi tiết & tiến trình"
                      >
                        <Link href={`/leave/requests/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canCancel && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCancel(item)}
                          disabled={isCancelling}
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Hủy đơn xin nghỉ"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
