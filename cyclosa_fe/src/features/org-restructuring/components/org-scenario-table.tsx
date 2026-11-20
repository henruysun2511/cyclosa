"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SlidersHorizontal,
  GitCompare,
  Trash2,
  MoreHorizontal,
  Calendar,
  Building2,
  Users,
  AlertTriangle,
  FolderGit2,
} from "lucide-react";
import type { OrgScenarioItem } from "../types/org-restructuring.types";
import {
  SCENARIO_STATUS_CONFIG,
  SCENARIO_SCOPE_CONFIG,
} from "../constants/org-restructuring.constants";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgScenarioTableProps {
  scenarios: OrgScenarioItem[];
  page: number;
  size: number;
  total: number;
  onPageChange: (p: number) => void;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export function OrgScenarioTable({
  scenarios,
  page,
  size,
  total,
  onPageChange,
  isLoading = false,
  onDelete,
}: OrgScenarioTableProps) {
  const totalPages = Math.ceil(total / size);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-transparent">
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="text-xs font-semibold">Mã & Tên kịch bản</TableHead>
              <TableHead className="text-xs font-semibold">Phạm vi</TableHead>
              <TableHead className="text-xs font-semibold">Quy mô giả lập</TableHead>
              <TableHead className="text-xs font-semibold">Ngày hiệu lực</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48 mb-1" /><Skeleton className="h-3 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
        <FolderGit2 className="h-12 w-12 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-semibold text-foreground">Không tìm thấy kịch bản tái cơ cấu</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          Chưa có kịch bản nào phù hợp với bộ lọc hiện tại. Hãy tạo kịch bản mới để bắt đầu mô phỏng tái cấu trúc sơ đồ tổ chức.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-transparent">
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="text-xs font-semibold">Mã & Tên kịch bản</TableHead>
              <TableHead className="text-xs font-semibold">Phạm vi</TableHead>
              <TableHead className="text-xs font-semibold">Quy mô giả lập</TableHead>
              <TableHead className="text-xs font-semibold">Ngày hiệu lực</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((item, index) => {
              const statusConfig = SCENARIO_STATUS_CONFIG[item.status] || {
                label: item.status,
                variant: "secondary" as const,
              };
              const scopeConfig = SCENARIO_SCOPE_CONFIG[item.scope] || { label: item.scope };

              return (
                <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="text-center text-xs font-medium text-muted-foreground">
                    {page * size + index + 1}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <Link
                        href={`/org-restructuring/scenarios/${item.id}/workbench`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        <span>{item.name}</span>
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono font-medium text-primary">{item.code}</span>
                        {item.description && (
                          <>
                            <span>•</span>
                            <span className="line-clamp-1 max-w-md">{item.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-foreground font-medium">{scopeConfig.label}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>{item.departmentCount} Đơn vị</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        <span>{item.employeeCount} Nhân sự</span>
                      </span>
                      {item.criticalConflictCount > 0 && (
                        <span className="flex items-center gap-1 text-rose-600 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>{item.criticalConflictCount} Lỗi</span>
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.targetEffectiveDate}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusConfig.variant} className={`text-xs ${statusConfig.className || ""}`}>
                      {statusConfig.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/org-restructuring/scenarios/${item.id}/workbench`}
                            className="cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                            <span>Bàn làm việc Sandbox</span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/org-restructuring/scenarios/${item.id}/comparison`}
                            className="cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <GitCompare className="h-3.5 w-3.5 text-primary" />
                            <span>So sánh đối chiếu Diff</span>
                          </Link>
                        </DropdownMenuItem>

                        {(item.status === "DRAFT" || item.status === "REJECTED") && onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(item.id)}
                            className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Xóa kịch bản</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <span>
            Hiển thị {page * size + 1} - {Math.min((page + 1) * size, total)} trên tổng số {total} kịch bản
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="h-8 text-xs"
            >
              Trước
            </Button>
            <span className="font-medium">
              Trang {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page + 1 >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 text-xs"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
