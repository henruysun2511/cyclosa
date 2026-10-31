"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  Save,
  CheckSquare,
  Square,
  Loader2,
  Edit3,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import {
  PERMISSIONS,
  DATA_SCOPE,
  DATA_SCOPE_LABELS,
  type DataScope,
} from "@/features/authorization/constants/permission.constants";
import {
  PERMISSION_GROUPS,
  getPermissionTitle,
} from "../constants/role.constants";
import { HierarchicalCheckbox } from "./hierarchical-checkbox";
import { cn } from "@/lib/utils";
import type { RoleResponse, GroupedPermissionsResponse } from "../types/role.types";

export interface RolePermissionChecklistProps {
  selectedRole: RoleResponse | null;
  groupedData: GroupedPermissionsResponse | undefined;
  permissionState: Record<
    string,
    { granted: boolean; dataScope: DataScope; permissionId: string }
  >;
  onTogglePermission: (code: string) => void;
  onScopeChange: (code: string, scope: DataScope) => void;
  onToggleResource: (resourceKey: string, nextVal: boolean) => void;
  onToggleGroup: (groupResources: { key: string }[], nextVal: boolean) => void;
  onSelectAll: (selectAll: boolean) => void;
  onSaveMatrix: () => void;
  onEditRole?: (role: RoleResponse) => void;
  onDeleteRole?: (role: RoleResponse) => void;
  isSaving?: boolean;
  isLoadingRolePerms?: boolean;
}

export function RolePermissionChecklist({
  selectedRole,
  groupedData,
  permissionState,
  onTogglePermission,
  onScopeChange,
  onToggleResource,
  onToggleGroup,
  onSelectAll,
  onSaveMatrix,
  onEditRole,
  onDeleteRole,
  isSaving = false,
  isLoadingRolePerms = false,
}: RolePermissionChecklistProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const totalGrantedOverall = useMemo(() => {
    return Object.values(permissionState).filter((p) => p.granted).length;
  }, [permissionState]);

  const totalPermissionsOverall = Object.keys(permissionState).length || 36;

  if (!selectedRole) {
    return (
      <div className="lg:col-span-8 xl:col-span-8 p-12 text-center text-muted-foreground border rounded-xl bg-card">
        Vui lòng chọn một vai trò từ danh sách bên trái để cấu hình ma trận quyền.
      </div>
    );
  }

  return (
    <div className="lg:col-span-8 xl:col-span-8 space-y-5">
      {/* ── 1. Header Role Summary & Action Bar ─────────────────────── */}
      <Card className="border-border bg-card shadow-xs">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">
                  {selectedRole.name}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium"
                >
                  Đã cấp: {totalGrantedOverall} / {totalPermissionsOverall} quyền
                </Badge>
                {!selectedRole.isSystemRole && (
                  <div className="flex items-center gap-0.5 ml-1">
                    {onEditRole && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditRole(selectedRole)}
                        title="Sửa tên & mô tả vai trò"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span className="sr-only">Sửa vai trò</span>
                      </Button>
                    )}
                    {onDeleteRole && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteRole(selectedRole)}
                        title="Xóa vai trò"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Xóa vai trò</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedRole.description || "Cấu hình quyền hạn và phạm vi dữ liệu cho vai trò này."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onSelectAll(true)}
            >
              <CheckSquare className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>Chọn tất cả</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onSelectAll(false)}
            >
              <Square className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>Bỏ tất cả</span>
            </Button>

            <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
              <Button
                size="sm"
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-xs"
                onClick={onSaveMatrix}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Lưu phân quyền</span>
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Filter search box */}
        <div className="px-5 pb-4 pt-1">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm quyền chức năng, mô tả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </Card>

      {/* ── 2. Danh sách Thẻ Nhóm Phân Hệ Giống Hình ────────────────── */}
      {isLoadingRolePerms ? (
        <div className="p-12 text-center text-muted-foreground border rounded-xl bg-card flex items-center justify-center gap-2 text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Đang tải ma trận phân quyền...</span>
        </div>
      ) : (
        PERMISSION_GROUPS.map((group) => {
          const allPermsInGroup = group.resources.flatMap((res) => {
            return groupedData?.[res.key] || [];
          });

          if (allPermsInGroup.length === 0) return null;

          const groupGrantedCount = allPermsInGroup.filter(
            (p) => permissionState[p.code]?.granted
          ).length;
          const groupTotalCount = allPermsInGroup.length;
          const groupAllChecked = groupGrantedCount === groupTotalCount && groupTotalCount > 0;
          const groupIndeterminate = groupGrantedCount > 0 && groupGrantedCount < groupTotalCount;

          // Search filter matching
          const isGroupVisible = allPermsInGroup.some((p) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
              p.code.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              group.title.toLowerCase().includes(q)
            );
          });

          if (!isGroupVisible) return null;

          return (
            <div
              key={group.key}
              className="rounded-xl border border-border bg-card shadow-xs overflow-hidden transition-all"
            >
              {/* Header Cấp 1 ([-] SỐ HÓA      10 / 31 quyền được gán) */}
              <div className="p-4 bg-muted/25 border-b border-border flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <HierarchicalCheckbox
                    checked={groupAllChecked}
                    indeterminate={groupIndeterminate}
                    onChange={() => onToggleGroup(group.resources as any, !groupAllChecked)}
                  />
                  <span className="font-bold text-sm tracking-wide text-foreground">
                    {group.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {groupGrantedCount} / {groupTotalCount} quyền được gán
                </span>
              </div>

              {/* Nội dung Cấp 2 (Từng tài nguyên: [-] Quản lý dự án...) */}
              <div className="p-5 space-y-6">
                {group.resources.map((res, resIdx) => {
                  const resPerms = groupedData?.[res.key] || [];
                  if (resPerms.length === 0) return null;

                  const resGrantedCount = resPerms.filter(
                    (p) => permissionState[p.code]?.granted
                  ).length;
                  const resTotalCount = resPerms.length;
                  const resAllChecked = resGrantedCount === resTotalCount && resTotalCount > 0;
                  const resIndeterminate = resGrantedCount > 0 && resGrantedCount < resTotalCount;

                  const filteredResPerms = resPerms.filter((p) => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      p.code.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      res.name.toLowerCase().includes(q)
                    );
                  });

                  if (filteredResPerms.length === 0) return null;

                  return (
                    <div key={res.key}>
                      {/* Tiêu đề Tài nguyên Cấp 2 */}
                      <div className="flex items-center gap-3 mb-3.5 select-none">
                        <HierarchicalCheckbox
                          checked={resAllChecked}
                          indeterminate={resIndeterminate}
                          onChange={() => onToggleResource(res.key, !resAllChecked)}
                        />
                        <span className="font-semibold text-sm text-foreground">
                          {res.name}
                        </span>
                      </div>

                      {/* Lưới 2 cột các quyền con Cấp 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pl-7">
                        {filteredResPerms.map((perm) => {
                          const state = permissionState[perm.code] || {
                            granted: false,
                            dataScope: DATA_SCOPE.COMPANY,
                          };
                          const isViewAction = perm.action.toUpperCase() === "VIEW";

                          return (
                            <div
                              key={perm.id}
                              className={cn(
                                "flex items-start gap-3 p-2 rounded-lg transition-colors",
                                state.granted ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"
                              )}
                            >
                              <HierarchicalCheckbox
                                checked={state.granted}
                                onChange={() => onTogglePermission(perm.code)}
                                className="mt-0.5"
                              />

                              <div className="space-y-0.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    onClick={() => onTogglePermission(perm.code)}
                                    className={cn(
                                      "font-medium text-xs sm:text-sm cursor-pointer select-none transition-colors",
                                      state.granted ? "text-primary font-semibold" : "text-foreground"
                                    )}
                                  >
                                    {getPermissionTitle(perm, res.name)}
                                  </span>

                                  {/* Selector DataScope cho quyền Xem khi được tích chọn */}
                                  {isViewAction && state.granted && (
                                    <select
                                      value={state.dataScope}
                                      onChange={(e) =>
                                        onScopeChange(perm.code, e.target.value as DataScope)
                                      }
                                      className="h-5 px-1 text-[10px] font-mono rounded border border-border bg-background text-foreground focus:border-primary focus:outline-none shadow-2xs"
                                      title="Chọn phạm vi dữ liệu"
                                    >
                                      {Object.values(DATA_SCOPE).map((scope) => (
                                        <option key={scope} value={scope}>
                                          {DATA_SCOPE_LABELS[scope]}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground leading-normal">
                                  {perm.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Đường kẻ phân cách giữa các tài nguyên */}
                      {resIdx < group.resources.length - 1 && (
                        <div className="border-t border-border/60 my-5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

