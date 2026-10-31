"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Sliders,
  Calendar,
} from "lucide-react";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import type { RoleResponse } from "../types/role.types";
import type { PaginationData } from "@/types/api.types";

interface RoleTableProps {
  roles: RoleResponse[];
  isLoading: boolean;
  pagination?: PaginationData;
  currentPage: number; // 0-based
  onPageChange: (newPage: number) => void;
  onOpenMatrix: (role: RoleResponse) => void;
  onEditRole: (role: RoleResponse) => void;
  onDeleteRole: (role: RoleResponse) => void;
}

export function RoleTable({
  roles,
  isLoading,
  pagination,
  currentPage,
  onPageChange,
  onOpenMatrix,
  onEditRole,
  onDeleteRole,
}: RoleTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(d);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-14 text-center font-semibold text-xs">STT</TableHead>
            <TableHead className="w-44 font-semibold text-xs">Mã Vai trò</TableHead>
            <TableHead className="font-semibold text-xs">Tên Vai trò & Mô tả</TableHead>
            <TableHead className="w-36 font-semibold text-xs">Loại Vai trò</TableHead>
            <TableHead className="w-32 font-semibold text-xs">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Ngày tạo
              </span>
            </TableHead>
            <TableHead className="w-48 text-right font-semibold text-xs pr-6">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="h-8 w-28 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-44 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Không tìm thấy vai trò nào</p>
                  <p className="text-xs max-w-sm">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc làm mới lại danh sách.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role, idx) => {
              const rowNumber = currentPage * (pagination?.size || 20) + idx + 1;
              return (
                <TableRow
                  key={role.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* STT */}
                  <TableCell className="text-center font-mono text-xs text-muted-foreground">
                    {rowNumber}
                  </TableCell>

                  {/* Mã vai trò */}
                  <TableCell>
                    <code className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-foreground font-mono text-xs font-semibold border">
                      {role.code}
                    </code>
                  </TableCell>

                  {/* Tên & Mô tả */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {role.name}
                      </p>
                      {role.description ? (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                          {role.description}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 italic">
                          Chưa có mô tả chi tiết
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Loại vai trò */}
                  <TableCell>
                    {role.isSystemRole ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 gap-1 font-normal text-[11px]"
                      >
                        <Layers className="h-3 w-3" />
                        Hệ thống
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 gap-1 font-normal text-[11px]"
                      >
                        <Sliders className="h-3 w-3" />
                        Tùy chỉnh
                      </Badge>
                    )}
                  </TableCell>

                  {/* Ngày tạo */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(role.createdAt)}
                  </TableCell>

                  {/* Hành động */}
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Nút Phân quyền */}
                      <PermissionGuard
                        permission={PERMISSIONS.ROLE.VIEW}
                        fallback={null}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenMatrix(role)}
                          className="h-8 px-2.5 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-colors"
                          title="Cấu hình ma trận phân quyền"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Phân quyền</span>
                        </Button>
                      </PermissionGuard>

                      {/* Nút Sửa vai trò */}
                      <PermissionGuard
                        permission={PERMISSIONS.ROLE.MANAGE}
                        fallback={null}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRole(role)}
                          disabled={role.isSystemRole}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                          title={
                            role.isSystemRole
                              ? "Không thể sửa vai trò hệ thống cốt lõi"
                              : "Chỉnh sửa tên và mô tả vai trò"
                          }
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      </PermissionGuard>

                      {/* Nút Xóa vai trò */}
                      <PermissionGuard
                        permission={PERMISSIONS.ROLE.MANAGE}
                        fallback={null}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteRole(role)}
                          disabled={role.isSystemRole}
                          className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:pointer-events-none"
                          title={
                            role.isSystemRole
                              ? "Không thể xóa vai trò hệ thống cốt lõi"
                              : "Xóa vai trò tùy chỉnh"
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          <div>
            Hiển thị{" "}
            <span className="font-semibold text-foreground">
              {roles.length}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-foreground">
              {pagination.total}
            </span>{" "}
            vai trò (Trang {pagination.page + 1}/{Math.max(1, pagination.pages)})
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPrev || isLoading}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNext || isLoading}
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
