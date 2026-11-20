"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, MoreHorizontal, Eye, ShieldAlert, Gavel, ArrowUpRight } from "lucide-react";
import { DisciplineStatusBadge, DisciplineFormBadge } from "./reward-badges";
import { VIOLATION_CATEGORY_LABELS } from "../constants/reward.constants";
import type { DisciplineCase } from "../types/reward.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DisciplineTableProps {
  items: DisciplineCase[];
  isLoading: boolean;
  page: number;
  size: number;
  onDetail: (id: string) => void;
  onDecide: (item: DisciplineCase) => void;
  onSubmitDismissal: (item: DisciplineCase) => void;
}

export function DisciplineTable({
  items,
  isLoading,
  page,
  size,
  onDetail,
  onDecide,
  onSubmitDismissal,
}: DisciplineTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Nhân viên vi phạm
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Nhóm hành vi vi phạm
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Ngày vi phạm
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Hình thức xử lý
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="text-center text-xs font-semibold">
                Thời hiệu còn
              </TableHead>
              <TableHead className="w-16 text-center text-xs font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">
                      Không tìm thấy hồ sơ kỷ luật phù hợp
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {(page - 1) * size + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-xs text-foreground">
                      {item.employeeName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {item.employeeCode}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-foreground max-w-[220px] truncate">
                    {VIOLATION_CATEGORY_LABELS[item.violationCategory] ||
                      item.violationCategory}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.violationDate}
                  </TableCell>
                  <TableCell>
                    <DisciplineFormBadge form={item.disciplineForm} />
                  </TableCell>
                  <TableCell>
                    <DisciplineStatusBadge
                      status={item.status}
                      isExpired={item.isExpired}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {item.remainingLimitationMonths !== undefined && (
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium text-white shadow-2xs",
                          item.remainingLimitationMonths <= 1
                            ? "bg-rose-600"
                            : "bg-slate-600"
                        )}
                      >
                        {item.remainingLimitationMonths > 0
                          ? `${item.remainingLimitationMonths} tháng`
                          : "Hết thời hiệu"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem onClick={() => onDetail(item.id)}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          <span>Xem chi tiết hồ sơ</span>
                        </DropdownMenuItem>

                        {item.status === "DRAFT" && (
                          <>
                            <DropdownMenuItem onClick={() => onDecide(item)}>
                              <Gavel className="h-3.5 w-3.5 mr-2 text-primary" />
                              <span>Ban hành quyết định</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onSubmitDismissal(item)}
                              className="text-purple-600 focus:text-purple-600"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5 mr-2" />
                              <span>Trình duyệt sa thải</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

