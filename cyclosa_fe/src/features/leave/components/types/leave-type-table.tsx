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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { LeaveGroupBadge } from "../shared/leave-group-badge";
import { LeavePayerBadge } from "../shared/leave-payer-badge";
import type { LeaveTypeDto } from "../../types/leave.types";

interface LeaveTypeTableProps {
  items: LeaveTypeDto[];
  isLoading: boolean;
  onEdit: (item: LeaveTypeDto) => void;
  onDelete: (item: LeaveTypeDto) => void;
}

export function LeaveTypeTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: LeaveTypeTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[120px] text-xs font-semibold">Mã loại</TableHead>
            <TableHead className="min-w-[180px] text-xs font-semibold">Tên loại nghỉ</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Nhóm nghỉ</TableHead>
            <TableHead className="w-[140px] text-xs font-semibold">Nguồn chi trả</TableHead>
            <TableHead className="w-[130px] text-center text-xs font-semibold">Số ngày cố định</TableHead>
            <TableHead className="w-[120px] text-center text-xs font-semibold">Phê duyệt</TableHead>
            <TableHead className="w-[120px] text-center text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[80px] text-right text-xs font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy loại nghỉ phép nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {item.code}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-xs text-foreground">{item.name}</div>
                  {item.description && (
                    <div className="text-[11px] text-muted-foreground truncate max-w-[240px]">
                      {item.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <LeaveGroupBadge group={item.leaveGroup} />
                </TableCell>
                <TableCell>
                  <LeavePayerBadge payer={item.payer} />
                </TableCell>
                <TableCell className="text-center text-xs">
                  {item.fixedDays != null ? (
                    <span className="font-semibold text-foreground">{item.fixedDays} ngày</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Theo quy định</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {item.requiresApproval ? (
                    <Badge variant="outline" className="text-[11px] font-normal border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/20">
                      Cần duyệt
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[11px] font-normal border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20">
                      Tự động
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {item.isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Kích hoạt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <XCircle className="h-3.5 w-3.5" />
                      Tạm khóa
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4 text-blue-600" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(item)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
