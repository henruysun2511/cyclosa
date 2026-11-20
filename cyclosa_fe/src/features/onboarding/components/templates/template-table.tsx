"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Building2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { OnboardingTemplateDto } from "../../types/onboarding.types";

export interface TemplateTableProps {
  templates: OnboardingTemplateDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
}

export function TemplateTable({
  templates,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onDelete,
  canManage,
}: TemplateTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[140px] text-xs font-semibold">Mã mẫu</TableHead>
              <TableHead className="min-w-[240px] text-xs font-semibold">Tên mẫu checklist</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Phòng ban áp dụng</TableHead>
              <TableHead className="w-[120px] text-center text-xs font-semibold">Số đầu việc</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Ngày tạo</TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-36 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="h-8 w-8 text-muted-foreground/40" />
                    <p>Không tìm thấy mẫu checklist hội nhập nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              templates.map((tpl) => (
                <TableRow
                  key={tpl.id}
                  className="hover:bg-muted/25 transition-colors"
                >
                  {/* Mã mẫu */}
                  <TableCell className="font-mono text-xs font-bold text-foreground">
                    {tpl.code}
                  </TableCell>

                  {/* Tên mẫu & Mô tả */}
                  <TableCell>
                    <Link
                      href={`/onboarding/templates/${tpl.id}`}
                      className="font-bold text-xs text-foreground hover:text-primary transition-colors block"
                    >
                      {tpl.name}
                    </Link>
                    {tpl.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {tpl.description}
                      </p>
                    )}
                  </TableCell>

                  {/* Phòng ban */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {tpl.departmentName || "Toàn công ty"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Số đầu việc */}
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs font-semibold px-2 py-0.5 bg-muted/40"
                    >
                      {tpl.itemCount || 0} việc
                    </Badge>
                  </TableCell>

                  {/* Trạng thái hoạt động */}
                  <TableCell>
                    {tpl.isActive ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium dark:bg-emerald-950/40 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Đang kích hoạt
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200 text-xs font-medium dark:bg-slate-800 dark:text-slate-400"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Tạm ngưng
                      </Badge>
                    )}
                  </TableCell>

                  {/* Ngày tạo */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {tpl.createdAt
                      ? new Date(tpl.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </TableCell>

                  {/* Menu thao tác */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/onboarding/templates/${tpl.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Chỉnh sửa mẫu</span>
                          </Link>
                        </DropdownMenuItem>
                        {canManage && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(tpl.id)}
                              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Xóa mẫu checklist</span>
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

      {/* Thanh phân trang Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Hiển thị {templates.length} trên tổng số {totalItems} mẫu checklist
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <span className="font-mono text-xs px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

