"use client";

import React, { useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Users,
  Search,
  Plus,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  isLoading?: boolean;
}

export function RoleListSidebar({
  roles,
  selectedRoleId,
  onSelectRole,
  searchRole,
  onSearchChange,
  onOpenCreateModal,
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
                  <div className="flex items-start justify-between gap-2">
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
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "font-semibold text-xs truncate leading-snug",
                            isSelected ? "text-primary" : "text-foreground"
                          )}
                        >
                          {role.name}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {role.code}
                        </div>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 border",
                        role.isSystemRole
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      )}
                    >
                      {role.isSystemRole ? "Hệ thống" : "Tùy chỉnh"}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal">
                    {role.description || "Chưa có mô tả chi tiết"}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Mã: {role.code}</span>
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-primary flex items-center gap-0.5">
                        Đang chọn <Check className="h-3 w-3 inline" />
                      </span>
                    )}
                  </div>
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
