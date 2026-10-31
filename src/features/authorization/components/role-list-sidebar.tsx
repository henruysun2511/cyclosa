"use client";

import React, { useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Search,
  Plus,
  Check,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { cn } from "@/lib/utils";
import type { RoleResponse } from "../types/role.types";

export interface RoleListSidebarProps {
  roles: RoleResponse[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
  searchRole: string;
  onSearchChange: (val: string) => void;
  onOpenCreateModal: () => void;
  onEditRole?: (role: RoleResponse) => void;
  onDeleteRole?: (role: RoleResponse) => void;
  isLoading?: boolean;
}

export function RoleListSidebar({
  roles,
  selectedRoleId,
  onSelectRole,
  searchRole,
  onSearchChange,
  onOpenCreateModal,
  onEditRole,
  onDeleteRole,
  isLoading = false,
}: RoleListSidebarProps) {
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
        r.code.toLowerCase().includes(searchRole.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchRole.toLowerCase()))
    );
  }, [roles, searchRole]);

  return (
    <div className="lg:col-span-4 xl:col-span-4 space-y-4">
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Danh sách Vai trò</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs font-mono font-medium">
              {filteredRoles.length} vai trò
            </Badge>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm vai trò, mã code..."
              value={searchRole}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-2 space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-14 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-3 w-40 bg-muted animate-pulse rounded" />
              </div>
            ))
          ) : (
            filteredRoles.map((role) => {
              const isSelected = role.id === selectedRoleId;
              return (
                <div
                  key={role.id}
                  onClick={() => onSelectRole(role.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all cursor-pointer relative flex flex-col gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xs ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted/50 hover:border-border/80"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {role.isSystemRole ? (
                          <Lock className="h-3.5 w-3.5" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "font-semibold text-xs truncate leading-snug",
                          isSelected ? "text-primary font-bold" : "text-foreground"
                        )}
                      >
                        {role.name}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-primary flex items-center gap-0.5">
                          Đang chọn <Check className="h-3 w-3 inline" />
                        </span>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                            <span className="sr-only">Tùy chọn vai trò</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onEditRole && (
                            <DropdownMenuItem
                              onClick={() => onEditRole(role)}
                              className="gap-2 text-xs cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Sửa thông tin</span>
                            </DropdownMenuItem>
                          )}
                          {onDeleteRole && (
                            <DropdownMenuItem
                              onClick={() => {
                                if (role.isSystemRole) return;
                                onDeleteRole(role);
                              }}
                              disabled={role.isSystemRole}
                              className={cn(
                                "gap-2 text-xs cursor-pointer",
                                role.isSystemRole
                                  ? "opacity-40 cursor-not-allowed"
                                  : "text-destructive focus:text-destructive"
                              )}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>{role.isSystemRole ? "Không thể xóa (Hệ thống)" : "Xóa vai trò"}</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {role.description ? (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-normal">
                      {role.description}
                    </p>
                  ) : null}
                </div>
              );
            })
          )}

          {filteredRoles.length === 0 && !isLoading && (
            <div className="text-center py-8 text-xs text-muted-foreground">
              Không tìm thấy vai trò phù hợp
            </div>
          )}
        </CardContent>

        <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
          <div className="p-3 border-t border-border bg-muted/20">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs border-dashed"
              onClick={onOpenCreateModal}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              <span>Thêm vai trò mới</span>
            </Button>
          </div>
        </PermissionGuard>
      </Card>
    </div>
  );
}

