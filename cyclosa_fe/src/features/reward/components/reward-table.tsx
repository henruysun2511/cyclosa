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
import { FolderOpen, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { RewardTypeBadge } from "./reward-badges";
import type { RewardDecision } from "../types/reward.types";
import { Badge } from "@/components/ui/badge";

interface RewardTableProps {
  items: RewardDecision[];
  isLoading: boolean;
  page: number;
  size: number;
  onDetail: (id: string) => void;
  onEdit: (item: RewardDecision) => void;
  onDelete: (item: RewardDecision) => void;
}

export function RewardTable({
  items,
  isLoading,
  page,
  size,
  onDetail,
  onEdit,
  onDelete,
}: RewardTableProps) {
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
                Nhân viên khen thưởng
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Danh hiệu / Nội dung
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Hình thức
              </TableHead>
              <TableHead className="text-right text-xs font-semibold">
                Số tiền thưởng
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Ngày quyết định
              </TableHead>
              <TableHead className="text-center text-xs font-semibold">
                Kỳ lương
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
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto rounded-full" />
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
                      Không tìm thấy dữ liệu khen thưởng phù hợp
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
                  <TableCell className="text-xs font-medium text-foreground max-w-[260px] truncate">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <RewardTypeBadge type={item.rewardType} />
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-foreground">
                    {item.amount
                      ? `${Number(item.amount).toLocaleString("vi-VN")} đ`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.decisionDate}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.pushedToPayroll ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-600 text-white shadow-2xs">
                        Đã chuyển lương
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-600 text-white shadow-2xs">
                        Chưa chuyển
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
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        {!item.pushedToPayroll && (
                          <>
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              <span>Chỉnh sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(item)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              <span>Xóa quyết định</span>
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

