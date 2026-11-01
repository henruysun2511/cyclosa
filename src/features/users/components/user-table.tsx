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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Shield,
  Mail,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { UserStatusBadge } from "./user-status-badge";
import type { UserResponse } from "../types/user.types";
import { PermissionGuard } from "@/features/authorization";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";

export interface UserTableProps {
  users: UserResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onManageRoles: (user: UserResponse) => void;
  onResendActivation: (user: UserResponse) => void;
  onLockUser: (user: UserResponse) => void;
  onUnlockUser: (user: UserResponse) => void;
}

export function UserTable({
  users,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onManageRoles,
  onResendActivation,
  onLockUser,
  onUnlockUser,
}: UserTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Chưa từng đăng nhập";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[300px] text-xs font-semibold">Tài khoản & Email</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[200px] text-xs font-semibold">Đăng nhập lần cuối</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Ngày tạo</TableHead>
              <TableHead className="w-[80px] text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-44 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                  Không tìm thấy tài khoản người dùng nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/25 transition-colors">
                  {/* Email & Info */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {user.email}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell>
                    <UserStatusBadge status={user.status} />
                  </TableCell>

                  {/* Đăng nhập cuối */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(user.lastLoginAt)}
                  </TableCell>

                  {/* Ngày tạo */}
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  {/* Hành động */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu thao tác</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        {/* Gán / Quản lý vai trò */}
                        <PermissionGuard permission={PERMISSIONS.ROLE.VIEW} fallback={null}>
                          <DropdownMenuItem
                            onClick={() => onManageRoles(user)}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Shield className="h-3.5 w-3.5 text-primary" />
                            <span>Phân quyền vai trò</span>
                          </DropdownMenuItem>
                        </PermissionGuard>

                        {/* Gửi lại email kích hoạt */}
                        {user.status === "PENDING_ACTIVATION" && (
                          <PermissionGuard permission={PERMISSIONS.USER.ACTIVATE} fallback={null}>
                            <DropdownMenuItem
                              onClick={() => onResendActivation(user)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Mail className="h-3.5 w-3.5 text-amber-600" />
                              <span>Gửi lại mã kích hoạt</span>
                            </DropdownMenuItem>
                          </PermissionGuard>
                        )}

                        <DropdownMenuSeparator />

                        {/* Khóa / Mở khóa tài khoản */}
                        <PermissionGuard permission={PERMISSIONS.USER.UPDATE} fallback={null}>
                          {user.status === "LOCKED" ? (
                            <DropdownMenuItem
                              onClick={() => onUnlockUser(user)}
                              className="gap-2 text-xs text-emerald-600 focus:text-emerald-600 cursor-pointer"
                            >
                              <Unlock className="h-3.5 w-3.5" />
                              <span>Mở khóa tài khoản</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onLockUser(user)}
                              className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              <span>Khóa tài khoản</span>
                            </DropdownMenuItem>
                          )}
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div>
          Tổng số <span className="font-semibold text-foreground">{totalItems}</span> tài khoản
          người dùng
        </div>

        <div className="flex items-center gap-2">
          <span>
            Trang {page} / {Math.max(totalPages, 1)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              className="h-7 w-7 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
              className="h-7 w-7 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

