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
import { Eye, Check, X } from "lucide-react";
import Link from "next/link";
import { LeaveStatusBadge } from "../shared/leave-status-badge";
import { LeaveGroupBadge } from "../shared/leave-group-badge";
import { DAY_PORTION_LABELS } from "../../constants/leave.constants";
import type { LeaveRequestDto } from "../../types/leave.types";

interface LeaveRequestTableProps {
  items: LeaveRequestDto[];
  isLoading: boolean;
  onApprove?: (item: LeaveRequestDto) => void;
  onReject?: (item: LeaveRequestDto) => void;
  isProcessing?: boolean;
}

export function LeaveRequestTable({
  items,
  isLoading,
  onApprove,
  onReject,
  isProcessing,
}: LeaveRequestTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="min-w-[180px] text-xs font-semibold">Nhân viên</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Phòng ban / Vị trí</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Loại nghỉ</TableHead>
            <TableHead className="w-[170px] text-xs font-semibold">Thời gian nghỉ</TableHead>
            <TableHead className="w-[90px] text-center text-xs font-semibold">Buổi</TableHead>
            <TableHead className="w-[100px] text-center text-xs font-semibold">Số ngày</TableHead>
            <TableHead className="w-[130px] text-center text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[120px] text-xs font-semibold">Thời điểm nộp</TableHead>
            <TableHead className="w-[120px] text-right text-xs font-semibold">Thao tác</TableHead>
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
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-7 w-16 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy đơn xin nghỉ phép nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const isPending = item.status === "PENDING_APPROVAL";

              return (
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
                    <div className="mt-0.5">
                      <LeaveGroupBadge group={item.leaveGroup} />
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
                  <TableCell className="text-center">
                    <LeaveStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.submittedAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8 cursor-pointer"
                        title="Xem chi tiết & tiến trình phê duyệt"
                      >
                        <Link href={`/leave/requests/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {isPending && onApprove && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove(item)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer"
                          title="Phê duyệt nhanh"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {isPending && onReject && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReject(item)}
                          disabled={isProcessing}
                          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Từ chối đơn nghỉ"
                        >
                          <X className="h-4 w-4" />
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
