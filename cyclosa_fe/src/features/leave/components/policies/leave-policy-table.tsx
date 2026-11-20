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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { CONTRACT_TYPE_LABELS } from "../../constants/leave.constants";
import type { LeavePolicyDto } from "../../types/leave.types";

interface LeavePolicyTableProps {
  items: LeavePolicyDto[];
  isLoading: boolean;
  onEdit: (item: LeavePolicyDto) => void;
  onDelete: (item: LeavePolicyDto) => void;
}

export function LeavePolicyTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: LeavePolicyTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[200px] text-xs font-semibold">Loại nghỉ áp dụng</TableHead>
            <TableHead className="w-[180px] text-xs font-semibold">Loại hợp đồng</TableHead>
            <TableHead className="w-[130px] text-xs font-semibold">Hiệu lực từ</TableHead>
            <TableHead className="w-[130px] text-center text-xs font-semibold">Định mức/năm</TableHead>
            <TableHead className="w-[160px] text-center text-xs font-semibold">Tăng theo thâm niên</TableHead>
            <TableHead className="w-[170px] text-center text-xs font-semibold">Chuyển phép tồn</TableHead>
            <TableHead className="w-[80px] text-right text-xs font-semibold">Thao tác</TableHead>
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
                  <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-14 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : !items || items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy chính sách nghỉ phép nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
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
                  {item.contractType ? (
                    <Badge variant="secondary" className="font-normal text-[11px]">
                      {CONTRACT_TYPE_LABELS[item.contractType]}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="font-normal text-[11px] border-dashed">
                      Tất cả hợp đồng
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs font-medium text-foreground">
                  {new Date(item.effectiveFrom).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-center font-bold text-xs text-foreground">
                  {item.annualEntitlementDays} ngày
                </TableCell>
                <TableCell className="text-center text-xs">
                  {item.seniorityStepYears && item.seniorityBonusDays ? (
                    <span className="font-medium">
                      +{item.seniorityBonusDays} ngày / {item.seniorityStepYears} năm
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Không áp dụng</span>
                  )}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {item.maxCarryoverDays > 0 ? (
                    <span>
                      Tối đa {item.maxCarryoverDays} ngày
                      {item.carryoverDeadlineMonth && (
                        <span className="text-muted-foreground block text-[11px]">
                          (hạn T{item.carryoverDeadlineMonth})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Không cho chuyển</span>
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
