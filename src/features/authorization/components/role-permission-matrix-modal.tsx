"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShieldCheck,
  Search,
  CheckCheck,
  XSquare,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Shield,
  Layers,
  Sliders,
  Filter,
} from "lucide-react";
import {
  useGetGroupedPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "../api/role-api";
import {
  DATA_SCOPE,
  DATA_SCOPE_LABELS,
  type DataScope,
} from "@/features/authorization/constants/permission.constants";
import { RESOURCE_METADATA } from "../constants/role.constants";
import { toast } from "sonner";
import type { RoleResponse, PermissionScopeItem } from "../types/role.types";

interface RolePermissionMatrixModalProps {
  role: RoleResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MatrixItemState {
  permissionId: string;
  code: string;
  resource: string;
  action: string;
  description: string;
  granted: boolean;
  dataScope: DataScope;
}

export function RolePermissionMatrixModal({
  role,
  open,
  onOpenChange,
}: RolePermissionMatrixModalProps) {
  // 1. Fetch metadata & current permissions
  const { data: groupedData, isLoading: isLoadingGrouped } = useGetGroupedPermissionsQuery(
    undefined,
    { skip: !open }
  );

  const {
    data: rolePermsData,
    isLoading: isLoadingRolePerms,
    refetch: refetchRolePerms,
  } = useGetRolePermissionsQuery(role?.id || "", {
    skip: !role?.id || !open,
  });

  const [assignRolePermissions, { isLoading: isSaving }] =
    useAssignRolePermissionsMutation();

  // 2. Local state for matrix mapping
  const [matrixState, setMatrixState] = useState<Record<string, MatrixItemState>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // 3. Initialize / Sync matrix state when backend data arrives
  useEffect(() => {
    if (!open || !groupedData?.data) return;

    const grouped = groupedData.data;
    const assignedMap = new Map<string, DataScope>();

    if (rolePermsData?.data) {
      rolePermsData.data.forEach((p) => {
        assignedMap.set(p.permissionCode, p.dataScope);
      });
    }

    const nextState: Record<string, MatrixItemState> = {};
    const defaultExpanded: Record<string, boolean> = {};

    Object.entries(grouped).forEach(([resource, perms]) => {
      defaultExpanded[resource] = true;
      perms.forEach((perm) => {
        const isAssigned = assignedMap.has(perm.code);
        const currentScope = assignedMap.get(perm.code) || DATA_SCOPE.COMPANY;

        nextState[perm.code] = {
          permissionId: perm.id,
          code: perm.code,
          resource: perm.resource,
          action: perm.action,
          description: perm.description,
          granted: isAssigned,
          dataScope: currentScope,
        };
      });
    });

    setMatrixState(nextState);
    setExpandedSections(defaultExpanded);
  }, [open, groupedData, rolePermsData]);

  // 4. Counts & Summaries
  const totalPermissions = Object.keys(matrixState).length;
  const grantedCount = useMemo(() => {
    return Object.values(matrixState).filter((item) => item.granted).length;
  }, [matrixState]);

  // 5. Toggle single permission grant
  const handleTogglePermission = (code: string) => {
    setMatrixState((prev) => {
      const item = prev[code];
      if (!item) return prev;
      return {
        ...prev,
        [code]: {
          ...item,
          granted: !item.granted,
        },
      };
    });
  };

  // 6. Change data scope for single permission
  const handleChangeScope = (code: string, newScope: DataScope) => {
    setMatrixState((prev) => {
      const item = prev[code];
      if (!item) return prev;
      return {
        ...prev,
        [code]: {
          ...item,
          dataScope: newScope,
        },
      };
    });
  };

  // 7. Toggle entire resource group
  const handleToggleResource = (resource: string, shouldGrant: boolean) => {
    setMatrixState((prev) => {
      const next = { ...prev };
      Object.entries(next).forEach(([code, item]) => {
        if (item.resource === resource) {
          next[code] = {
            ...item,
            granted: shouldGrant,
          };
        }
      });
      return next;
    });
  };

  // 8. Bulk Actions
  const handleSelectAll = (grantAll: boolean) => {
    setMatrixState((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((code) => {
        next[code] = {
          ...next[code],
          granted: grantAll,
        };
      });
      return next;
    });
  };

  const handleApplyScopeAll = (scope: DataScope) => {
    setMatrixState((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((code) => {
        if (next[code].granted) {
          next[code] = {
            ...next[code],
            dataScope: scope,
          };
        }
      });
      return next;
    });
    toast.info(`Đã áp dụng phạm vi "${DATA_SCOPE_LABELS[scope]}" cho các quyền đang chọn.`);
  };

  const handleToggleExpandAll = (expand: boolean) => {
    if (!groupedData?.data) return;
    const next: Record<string, boolean> = {};
    Object.keys(groupedData.data).forEach((res) => {
      next[res] = expand;
    });
    setExpandedSections(next);
  };

  // 9. Save Changes
  const handleSave = async () => {
    if (!role) return;

    const payloadPermissions: PermissionScopeItem[] = Object.values(matrixState)
      .filter((item) => item.granted)
      .map((item) => ({
        permissionId: item.permissionId,
        dataScope: item.dataScope,
      }));

    try {
      const res = await assignRolePermissions({
        roleId: role.id,
        body: { permissions: payloadPermissions },
      }).unwrap();

      if (res.success) {
        toast.success(
          `Đã lưu cấu hình ma trận phân quyền cho vai trò "${role.name}" (${payloadPermissions.length} quyền).`
        );
        refetchRolePerms();
        onOpenChange(false);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error.data?.message || "Không thể lưu thiết lập phân quyền. Vui lòng thử lại."
      );
    }
  };

  // 10. Filtered Resources by search query
  const groupedResources = useMemo(() => {
    if (!groupedData?.data) return {};
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groupedData.data;

    const filtered: Record<string, typeof groupedData.data[string]> = {};
    Object.entries(groupedData.data).forEach(([res, perms]) => {
      const matched = perms.filter(
        (p) =>
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          res.toLowerCase().includes(query)
      );
      if (matched.length > 0) {
        filtered[res] = matched;
      }
    });
    return filtered;
  }, [groupedData, searchQuery]);

  const isLoading = isLoadingGrouped || isLoadingRolePerms;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-card shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span>Thiết lập Ma trận Phân quyền</span>
                    {role && (
                      <Badge
                        variant="secondary"
                        className="font-mono text-xs font-semibold px-2"
                      >
                        {role.code}
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Cấu hình quyền hạn và phạm vi truy cập dữ liệu (Data Scope) cho vai trò{" "}
                    <span className="font-semibold text-foreground">
                      {role?.name || "..."}
                    </span>
                  </DialogDescription>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {role?.isSystemRole ? (
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 gap-1 text-xs"
                >
                  <Layers className="h-3 w-3" />
                  Vai trò Hệ thống
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 gap-1 text-xs"
                >
                  <Sliders className="h-3 w-3" />
                  Vai trò Tùy chỉnh
                </Badge>
              )}

              <Badge
                variant="outline"
                className="font-medium text-xs bg-muted/50 border-primary/30 text-primary"
              >
                Đã cấp: {grantedCount} / {totalPermissions || 36}
              </Badge>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t mt-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Tìm mã quyền, tên thao tác..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            {/* Bulk actions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(true)}
                className="h-8 px-2 text-xs gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Chọn tất cả</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(false)}
                className="h-8 px-2 text-xs gap-1"
              >
                <XSquare className="h-3.5 w-3.5 text-rose-500" />
                <span>Bỏ chọn</span>
              </Button>

              <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleToggleExpandAll(true)}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                Mở rộng
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleToggleExpandAll(false)}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                Thu gọn
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Body Content - Scrollable Accordion */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : Object.keys(groupedResources).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Filter className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">Không tìm thấy quyền nào phù hợp với bộ lọc</p>
            </div>
          ) : (
            Object.entries(groupedResources).map(([resourceKey, perms]) => {
              const meta = RESOURCE_METADATA[resourceKey] || {
                label: resourceKey,
                description: `Phân hệ ${resourceKey}`,
              };

              const isExpanded = !!expandedSections[resourceKey];
              const grantedInResource = perms.filter(
                (p) => matrixState[p.code]?.granted
              ).length;
              const allGrantedInResource =
                perms.length > 0 && grantedInResource === perms.length;

              return (
                <div
                  key={resourceKey}
                  className="rounded-xl border bg-card shadow-2xs overflow-hidden transition-all"
                >
                  {/* Group Header */}
                  <div className="flex items-center justify-between p-3.5 bg-muted/30 hover:bg-muted/50 transition-colors border-b">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={allGrantedInResource}
                        onCheckedChange={(checked) =>
                          handleToggleResource(resourceKey, !!checked)
                        }
                        title="Chọn/Bỏ chọn toàn bộ quyền trong phân hệ này"
                      />

                      <div
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            [resourceKey]: !prev[resourceKey],
                          }))
                        }
                        className="cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {meta.label}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">
                            ({resourceKey})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {meta.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-normal ${
                          grantedInResource > 0
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {grantedInResource}/{perms.length} đã cấp
                      </Badge>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSections((prev) => ({
                            ...prev,
                            [resourceKey]: !prev[resourceKey],
                          }))
                        }
                        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Permissions List */}
                  {isExpanded && (
                    <div className="divide-y divide-border/60">
                      {perms.map((perm) => {
                        const itemState = matrixState[perm.code] || {
                          granted: false,
                          dataScope: DATA_SCOPE.COMPANY,
                        };

                        return (
                          <div
                            key={perm.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 transition-colors ${
                              itemState.granted
                                ? "bg-primary/5 hover:bg-primary/10"
                                : "hover:bg-muted/30 opacity-75 hover:opacity-100"
                            }`}
                          >
                            {/* Checkbox & Name */}
                            <div className="flex items-start gap-3 flex-1">
                              <Checkbox
                                id={`perm-${perm.id}`}
                                checked={itemState.granted}
                                onCheckedChange={() => handleTogglePermission(perm.code)}
                                className="mt-0.5"
                              />
                              <label
                                htmlFor={`perm-${perm.id}`}
                                className="cursor-pointer space-y-0.5 select-none"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs font-semibold ${
                                      itemState.granted
                                        ? "text-primary font-mono"
                                        : "text-foreground font-mono"
                                    }`}
                                  >
                                    {perm.code}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] uppercase font-mono py-0 px-1"
                                  >
                                    {perm.action}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {perm.description}
                                </p>
                              </label>
                            </div>

                            {/* Data Scope Selector */}
                            <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
                              <span className="text-[11px] text-muted-foreground font-medium">
                                Phạm vi:
                              </span>
                              <select
                                value={itemState.dataScope}
                                onChange={(e) =>
                                  handleChangeScope(
                                    perm.code,
                                    e.target.value as DataScope
                                  )
                                }
                                disabled={!itemState.granted}
                                className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                              >
                                {Object.values(DATA_SCOPE).map((scope) => (
                                  <option key={scope} value={scope}>
                                    {DATA_SCOPE_LABELS[scope]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 px-6 border-t bg-card shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {role?.isSystemRole && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Vai trò hệ thống: Thay đổi ma trận quyền sẽ áp dụng ngay cho toàn bộ tài khoản mang vai trò này.
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="gap-1.5"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>Lưu Ma trận Quyền</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
