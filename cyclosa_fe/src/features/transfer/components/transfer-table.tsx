"use client";

import React from "react";
import {
  ArrowRight,
  MoreHorizontal,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Calendar,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TRANSFER_STATUS_VARIANTS,
  TRANSFER_TYPE_VARIANTS,
} from "../constants/transfer.constants";
import type { TransferSummary } from "../types/transfer.types";

interface TransferTableProps {
  items: TransferSummary[];
  isLoading?: boolean;
  page?: number;
  size?: number;
  onViewDetail: (id: string) => void;
  onSubmit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onApply?: (id: string) => void;
  onExtend?: (id: string) => void;
  onReturn?: (id: string) => void;
  onDelete?: (id: string) => void;
  canManage?: boolean;
  canApprove?: boolean;
}

export function TransferTable({
  items,
  isLoading = false,
  page = 1,
  size = 10,
  onViewDetail,
  onSubmit,
  onApprove,
  onReject,
  onApply,
  onExtend,
  onReturn,
  onDelete,
  canManage = true,
  canApprove = true,
}: TransferTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="w-[230px] text-xs font-semibold">Nhân viên</TableHead>
              <TableHead className="text-xs font-semibold">Hình thức</TableHead>
              <TableHead className="text-xs font-semibold">Đơn vị trước (Nguồn)</TableHead>
              <TableHead className="text-xs font-semibold">Đơn vị tiếp nhận (Đích)</TableHead>
              <TableHead className="text-xs font-semibold">Ngày hiệu lực</TableHead>
              <TableHead className="text-center text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 1. Đang tải dữ liệu (Skeleton Rows) */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-7 w-7 rounded-md mx-auto" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              /* 2. Danh sách rỗng: Table-Embedded Empty State (Rule 04) */
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="h-52 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Không tìm thấy phiếu điều chuyển phù hợp</p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* 3. Render danh sách bản ghi */
              items.map((item, index) => {
                const typeCfg = TRANSFER_TYPE_VARIANTS[item.transferType] || {
                  label: item.transferType,
                  className: "bg-muted text-muted-foreground",
                };
                const statusCfg = TRANSFER_STATUS_VARIANTS[item.status] || {
                  label: item.status,
                  className: "bg-muted text-muted-foreground",
                };

                const initials = item.employeeName
                  ? item.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(-2)
                      .join("")
                      .toUpperCase()
                  : "NV";

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onViewDetail(item.id)}
                  >
                    {/* Cột 1: STT */}
                    <TableCell className="text-center text-xs text-muted-foreground font-mono">
                      {(page - 1) * size + index + 1}
                    </TableCell>

                    {/* Cột 2: Nhân viên */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={() => onViewDetail(item.id)}
                      >
                        <div className="h-9 w-9 rounded-full border border-border bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
                          {item.employeePortraitUrl ? (
                            <img
                              src={item.employeePortraitUrl}
                              alt={item.employeeName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate hover:text-primary transition-colors">
                            {item.employeeName}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {item.employeeCode}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Cột 3: Hình thức */}
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] font-normal ${typeCfg.className}`}>
                        {typeCfg.label}
                      </Badge>
                    </TableCell>

                    {/* Cột 4: Đơn vị trước */}
                    <TableCell>
                      <div>
                        <p className="text-xs font-medium text-foreground">{item.fromDepartmentName}</p>
                        <p className="text-[11px] text-muted-foreground">{item.fromJobTitleName}</p>
                      </div>
                    </TableCell>

                    {/* Cột 5: Đơn vị sau */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-primary">{item.toDepartmentName}</p>
                          <p className="text-[11px] text-muted-foreground">{item.toJobTitleName}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Cột 6: Ngày hiệu lực */}
                    <TableCell>
                      <div>
                        <p className="text-xs font-mono font-medium text-foreground">{item.effectiveDate}</p>
                        {item.endDate && (
                          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
                            Đến: {item.endDate}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Cột 7: Trạng thái */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[11px] font-medium mx-auto ${statusCfg.className}`}>
                        {statusCfg.label}
                      </Badge>
                    </TableCell>

                    {/* Cột 8: Thao tác */}
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 mx-auto">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <DropdownMenuItem onClick={() => onViewDetail(item.id)}>
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>

                          {canManage && item.status === "DRAFT" && (
                            <DropdownMenuItem onClick={() => onSubmit?.(item.id)}>
                              <Send className="w-3.5 h-3.5 mr-2 text-blue-600" />
                              Trình phê duyệt
                            </DropdownMenuItem>
                          )}

                          {canApprove &&
                            (item.status === "PENDING_APPROVAL" || item.status === "SUBMITTED") && (
                              <>
                                <DropdownMenuItem onClick={() => onApprove?.(item.id)}>
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                                  Phê duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onReject?.(item.id)}>
                                  <XCircle className="w-3.5 h-3.5 mr-2 text-rose-600" />
                                  Từ chối
                                </DropdownMenuItem>
                              </>
                            )}

                          {canManage && item.status === "APPROVED" && (
                            <DropdownMenuItem onClick={() => onApply?.(item.id)}>
                              <Play className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                              Áp dụng vào hồ sơ
                            </DropdownMenuItem>
                          )}

                          {canManage &&
                            item.transferType === "TEMPORARY_DISPATCH" &&
                            item.status === "COMPLETED" &&
                            !item.isReturned && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onExtend?.(item.id)}>
                                  <Calendar className="w-3.5 h-3.5 mr-2 text-purple-600" />
                                  Gia hạn biệt phái
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onReturn?.(item.id)}>
                                  <RotateCcw className="w-3.5 h-3.5 mr-2 text-indigo-600" />
                                  Điều chuyển hồi hương
                                </DropdownMenuItem>
                              </>
                            )}

                          {canManage && (item.status === "DRAFT" || item.status === "REJECTED") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete?.(item.id)}
                                className="text-rose-600 dark:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Xóa phiếu
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
