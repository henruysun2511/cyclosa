"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Users,
  Search,
  Plus,
  Save,
  Check,
  CheckSquare,
  Square,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RouteGuard } from "@/features/authorization/components/route-guard";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import {
  PERMISSIONS,
  DATA_SCOPE,
  DATA_SCOPE_LABELS,
  type DataScope,
} from "@/features/authorization/constants/permission.constants";
import {
  useGetRolesQuery,
  useGetGroupedPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
  useCreateRoleMutation,
  type RoleResponse,
  type PermissionScopeItem,
  type PermissionResponse,
} from "@/features/authorization";

// ── Resource Metadata & Category Mapping (Matching static-ui) ─────────────────
interface ResourceMeta {
  code: string;
  resourceName: string;
  category: string;
}

const RESOURCE_META_MAP: Record<string, ResourceMeta> = {
  ORG: {
    code: "ORG_STRUCTURE",
    resourceName: "Sơ đồ tổ chức & Phòng ban",
    category: "Cơ cấu & Tổ chức",
  },
  EMPLOYEE: {
    code: "HR_EMPLOYEE",
    resourceName: "Hồ sơ nhân viên & Lý lịch",
    category: "Hồ sơ & Nhân sự",
  },
  CONTRACT: {
    code: "HR_CONTRACT",
    resourceName: "Hợp đồng lao động & Phụ lục",
    category: "Hồ sơ & Nhân sự",
  },
  ATTENDANCE: {
    code: "TIME_ATTENDANCE",
    resourceName: "Bảng chấm công & Ca kíp",
    category: "Chấm công & Ca kíp",
  },
  LEAVE: {
    code: "TIME_LEAVE",
    resourceName: "Đơn xin nghỉ phép & Tăng ca",
    category: "Chấm công & Ca kíp",
  },
  PAYROLL: {
    code: "PAYROLL_SHEET",
    resourceName: "Bảng tính lương & Thu nhập",
    category: "Tiền lương & Đãi ngộ",
  },
  RECRUITMENT: {
    code: "REC_PIPELINE",
    resourceName: "Tuyển dụng & Ứng viên",
    category: "Tuyển dụng & Đào tạo",
  },
  PERFORMANCE: {
    code: "KPI_EVALUATION",
    resourceName: "Đánh giá Hiệu suất & KPI",
    category: "Đánh giá & Hiệu suất",
  },
  ROLE: {
    code: "ROLE_MANAGEMENT",
    resourceName: "Quản trị Vai trò & Phân quyền",
    category: "Hệ thống & Cấu hình",
  },
  USER: {
    code: "USER_ACCOUNTS",
    resourceName: "Quản trị Tài khoản Người dùng",
    category: "Hệ thống & Cấu hình",
  },
  WORKPLACE: {
    code: "WORKPLACE_ASSETS",
    resourceName: "Không gian làm việc & Tài sản",
    category: "Hệ thống & Cấu hình",
  },
  AUDIT: {
    code: "AUDIT_LOGS",
    resourceName: "Nhật ký Kiểm toán & Tuân thủ",
    category: "Hệ thống & Cấu hình",
  },
};

// ── Resource Matrix Row Interface ─────────────────────────────────────────────
interface ResourceRowState {
  resourceKey: string;
  resourceName: string;
  code: string;
  category: string;
  viewPerm?: PermissionResponse;
  createPerm?: PermissionResponse;
  editPerm?: PermissionResponse;
  deletePerm?: PermissionResponse;
  approvePerm?: PermissionResponse;
  exportPerm?: PermissionResponse;
  view: boolean;
  viewScope: DataScope;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
}

export default function AdminRolesPage() {
  // ── 1. Query Roles list from Backend ───────────────────────────────────────
  const { data: rolesData, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetRolesQuery({
    size: 100,
    sortBy: "createdAt",
    direction: "asc",
  });

  const roles = useMemo(() => rolesData?.data?.items || [], [rolesData]);

  // Selected Role ID
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // ── 2. Query Permissions Meta & Selected Role Permissions ───────────────────
  const { data: groupedData, isLoading: isLoadingGrouped } = useGetGroupedPermissionsQuery();
  const {
    data: rolePermsData,
    isLoading: isLoadingRolePerms,
    refetch: refetchRolePerms,
  } = useGetRolePermissionsQuery(selectedRoleId, {
    skip: !selectedRoleId,
  });

  const [assignRolePermissions, { isLoading: isSaving }] = useAssignRolePermissionsMutation();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();

  // ── 3. Filters State ───────────────────────────────────────────────────────
  const [searchRole, setSearchRole] = useState("");
  const [searchResource, setSearchResource] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Create Role Dialog State
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRoleId, setCloneFromRoleId] = useState("");

  // ── 4. Build Dynamic Matrix State from Backend Grouped Permissions ──────────
  const [matrixRows, setMatrixRows] = useState<ResourceRowState[]>([]);

  useEffect(() => {
    if (!groupedData?.data) return;

    const grouped = groupedData.data;
    const assignedMap = new Map<string, DataScope>();

    if (rolePermsData?.data) {
      rolePermsData.data.forEach((p) => {
        assignedMap.set(p.permissionCode, p.dataScope);
      });
    }

    const rows: ResourceRowState[] = Object.entries(grouped).map(([resourceKey, perms]) => {
      const meta = RESOURCE_META_MAP[resourceKey] || {
        code: resourceKey,
        resourceName: `Phân hệ ${resourceKey}`,
        category: "Khác",
      };

      const viewPerm = perms.find((p) => p.action.toUpperCase() === "VIEW");
      const createPerm = perms.find(
        (p) =>
          p.action.toUpperCase() === "CREATE" ||
          p.action.toUpperCase() === "APPLY" ||
          p.action.toUpperCase() === "CHECKIN"
      );
      const editPerm = perms.find(
        (p) =>
          p.action.toUpperCase() === "UPDATE" ||
          p.action.toUpperCase() === "PROCESS" ||
          p.action.toUpperCase() === "EDIT"
      );
      const deletePerm = perms.find((p) => p.action.toUpperCase() === "DELETE");
      const approvePerm = perms.find(
        (p) =>
          p.action.toUpperCase() === "APPROVE" ||
          p.action.toUpperCase() === "SIGN" ||
          p.action.toUpperCase() === "EVALUATE" ||
          p.action.toUpperCase() === "ACTIVATE"
      );
      const exportPerm = perms.find(
        (p) =>
          p.action.toUpperCase() === "MANAGE" ||
          p.action.toUpperCase() === "ASSIGN" ||
          p.action.toUpperCase() === "SIMULATE" ||
          p.action.toUpperCase() === "VIEW_SALARY"
      );

      const hasView = viewPerm ? assignedMap.has(viewPerm.code) : false;
      const viewScope = viewPerm ? (assignedMap.get(viewPerm.code) || DATA_SCOPE.COMPANY) : DATA_SCOPE.COMPANY;

      return {
        resourceKey,
        resourceName: meta.resourceName,
        code: meta.code,
        category: meta.category,
        viewPerm,
        createPerm,
        editPerm,
        deletePerm,
        approvePerm,
        exportPerm,
        view: hasView,
        viewScope,
        create: createPerm ? assignedMap.has(createPerm.code) : false,
        edit: editPerm ? assignedMap.has(editPerm.code) : false,
        delete: deletePerm ? assignedMap.has(deletePerm.code) : false,
        approve: approvePerm ? assignedMap.has(approvePerm.code) : false,
        export: exportPerm ? assignedMap.has(exportPerm.code) : false,
      };
    });

    setMatrixRows(rows);
  }, [groupedData, rolePermsData, selectedRoleId]);

  // ── 5. Categories List ─────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const set = new Set<string>();
    matrixRows.forEach((r) => set.add(r.category));
    return Array.from(set);
  }, [matrixRows]);

  // ── 6. Filtered Lists ──────────────────────────────────────────────────────
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
        r.code.toLowerCase().includes(searchRole.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchRole.toLowerCase()))
    );
  }, [roles, searchRole]);

  const filteredPermissions = useMemo(() => {
    return matrixRows.filter((p) => {
      const matchText =
        p.resourceName.toLowerCase().includes(searchResource.toLowerCase()) ||
        p.code.toLowerCase().includes(searchResource.toLowerCase()) ||
        p.category.toLowerCase().includes(searchResource.toLowerCase());
      const matchCategory = selectedCategory === "ALL" || p.category === selectedCategory;
      return matchText && matchCategory;
    });
  }, [matrixRows, searchResource, selectedCategory]);

  // ── 7. Matrix Interactions Handlers ─────────────────────────────────────────
  const handleToggleAction = (
    resourceKey: string,
    action: "view" | "create" | "edit" | "delete" | "approve" | "export"
  ) => {
    setMatrixRows((prev) =>
      prev.map((row) => {
        if (row.resourceKey !== resourceKey) return row;
        return {
          ...row,
          [action]: !row[action],
        };
      })
    );
  };

  const handleScopeChange = (resourceKey: string, scope: DataScope) => {
    setMatrixRows((prev) =>
      prev.map((row) => {
        if (row.resourceKey !== resourceKey) return row;
        return {
          ...row,
          viewScope: scope,
          view: true,
        };
      })
    );
  };

  const handleToggleColumn = (action: "view" | "create" | "edit" | "delete" | "approve" | "export") => {
    const targetRows = filteredPermissions.filter((r) => r[`${action}Perm`]);
    if (targetRows.length === 0) return;

    const allChecked = targetRows.every((r) => r[action]);
    const nextVal = !allChecked;

    const targetKeys = new Set(targetRows.map((r) => r.resourceKey));

    setMatrixRows((prev) =>
      prev.map((row) => {
        if (!targetKeys.has(row.resourceKey)) return row;
        return {
          ...row,
          [action]: nextVal,
        };
      })
    );
    toast.success(nextVal ? `Đã bật cột [${action.toUpperCase()}]` : `Đã tắt cột [${action.toUpperCase()}]`);
  };

  const handleToggleRow = (resourceKey: string) => {
    const row = matrixRows.find((r) => r.resourceKey === resourceKey);
    if (!row) return;

    const availableActions: ("view" | "create" | "edit" | "delete" | "approve" | "export")[] = [];
    if (row.viewPerm) availableActions.push("view");
    if (row.createPerm) availableActions.push("create");
    if (row.editPerm) availableActions.push("edit");
    if (row.deletePerm) availableActions.push("delete");
    if (row.approvePerm) availableActions.push("approve");
    if (row.exportPerm) availableActions.push("export");

    const allActive = availableActions.every((act) => row[act]);
    const nextVal = !allActive;

    setMatrixRows((prev) =>
      prev.map((r) => {
        if (r.resourceKey !== resourceKey) return r;
        const updated = { ...r };
        availableActions.forEach((act) => {
          updated[act] = nextVal;
        });
        return updated;
      })
    );
  };

  const handleSelectAll = (selectAll: boolean) => {
    setMatrixRows((prev) =>
      prev.map((row) => ({
        ...row,
        view: row.viewPerm ? selectAll : false,
        create: row.createPerm ? selectAll : false,
        edit: row.editPerm ? selectAll : false,
        delete: row.deletePerm ? selectAll : false,
        approve: row.approvePerm ? selectAll : false,
        export: row.exportPerm ? selectAll : false,
      }))
    );
    toast.success(selectAll ? "Đã chọn toàn bộ quyền hạn" : "Đã bỏ chọn toàn bộ quyền hạn");
  };

  const handleResetPermissions = () => {
    refetchRolePerms();
    toast.info("Đã khôi phục ma trận phân quyền từ máy chủ.");
  };

  // ── 8. Save Matrix to Backend ──────────────────────────────────────────────
  const handleSaveMatrix = async () => {
    if (!selectedRole) return;

    const permissionsPayload: PermissionScopeItem[] = [];

    matrixRows.forEach((row) => {
      if (row.view && row.viewPerm) {
        permissionsPayload.push({
          permissionId: row.viewPerm.id,
          dataScope: row.viewScope,
        });
      }
      if (row.create && row.createPerm) {
        permissionsPayload.push({
          permissionId: row.createPerm.id,
          dataScope: DATA_SCOPE.COMPANY,
        });
      }
      if (row.edit && row.editPerm) {
        permissionsPayload.push({
          permissionId: row.editPerm.id,
          dataScope: DATA_SCOPE.COMPANY,
        });
      }
      if (row.delete && row.deletePerm) {
        permissionsPayload.push({
          permissionId: row.deletePerm.id,
          dataScope: DATA_SCOPE.COMPANY,
        });
      }
      if (row.approve && row.approvePerm) {
        permissionsPayload.push({
          permissionId: row.approvePerm.id,
          dataScope: DATA_SCOPE.COMPANY,
        });
      }
      if (row.export && row.exportPerm) {
        permissionsPayload.push({
          permissionId: row.exportPerm.id,
          dataScope: DATA_SCOPE.COMPANY,
        });
      }
    });

    try {
      const res = await assignRolePermissions({
        roleId: selectedRole.id,
        body: { permissions: permissionsPayload },
      }).unwrap();

      if (res.success) {
        toast.success(
          `Đã lưu cấu hình ma trận phân quyền cho vai trò [${selectedRole.name}] thành công! (${permissionsPayload.length} quyền)`
        );
        refetchRolePerms();
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể lưu phân quyền. Vui lòng thử lại.");
    }
  };

  // ── 9. Create New Role ─────────────────────────────────────────────────────
  const handleCreateRole = async () => {
    if (!newRoleName.trim() || !newRoleCode.trim()) {
      toast.error("Vui lòng nhập tên và mã vai trò");
      return;
    }

    try {
      const createdRes = await createRole({
        code: newRoleCode.trim().toUpperCase(),
        name: newRoleName.trim(),
        description: newRoleDesc.trim() || undefined,
      }).unwrap();

      if (createdRes.success && createdRes.data) {
        const newRoleId = createdRes.data.id;

        // If clone selected, copy permissions from template role
        if (cloneFromRoleId && cloneFromRoleId !== "none") {
          const currentPayload: PermissionScopeItem[] = [];
          matrixRows.forEach((row) => {
            if (row.view && row.viewPerm) {
              currentPayload.push({ permissionId: row.viewPerm.id, dataScope: row.viewScope });
            }
            if (row.create && row.createPerm) {
              currentPayload.push({ permissionId: row.createPerm.id, dataScope: DATA_SCOPE.COMPANY });
            }
            if (row.edit && row.editPerm) {
              currentPayload.push({ permissionId: row.editPerm.id, dataScope: DATA_SCOPE.COMPANY });
            }
            if (row.delete && row.deletePerm) {
              currentPayload.push({ permissionId: row.deletePerm.id, dataScope: DATA_SCOPE.COMPANY });
            }
            if (row.approve && row.approvePerm) {
              currentPayload.push({ permissionId: row.approvePerm.id, dataScope: DATA_SCOPE.COMPANY });
            }
            if (row.export && row.exportPerm) {
              currentPayload.push({ permissionId: row.exportPerm.id, dataScope: DATA_SCOPE.COMPANY });
            }
          });

          if (currentPayload.length > 0) {
            await assignRolePermissions({
              roleId: newRoleId,
              body: { permissions: currentPayload },
            }).unwrap();
          }
        }

        toast.success(`Đã tạo vai trò mới: ${createdRes.data.name}`);
        setCreateRoleModalOpen(false);
        setNewRoleName("");
        setNewRoleCode("");
        setNewRoleDesc("");
        refetchRoles();
        setSelectedRoleId(newRoleId);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể tạo vai trò mới.");
    }
  };

  const isLoading = isLoadingRoles || isLoadingGrouped;

  return (
    <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
      <div className="space-y-6 pb-12">
        {/* ── 1. Page Header & Breadcrumb (Exact static-ui style) ──────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Vai trò & Phân quyền Hệ thống
              </h1>
              <Badge variant="outline" className="text-xs font-mono">
                RBAC MATRIX
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1"
              onClick={handleResetPermissions}
              disabled={isSaving || isLoadingRolePerms}
            >
              <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Reset quyền</span>
            </Button>

            <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
              <Button
                size="sm"
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-xs"
                onClick={handleSaveMatrix}
                disabled={isSaving || !selectedRole}
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

        {/* ── 2. Two-Column Layout (Left: Roles List, Right: Permission Matrix) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── 2.1. CỘT TRÁI: DANH SÁCH VAI TRÒ (4 Cols) ────────────────── */}
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

                {/* Search Roles */}
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm vai trò, mã code..."
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
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
                        onClick={() => setSelectedRoleId(role.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-all cursor-pointer relative flex flex-col gap-1.5",
                          isSelected
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-2xs ring-1 ring-primary"
                            : "border-border bg-card hover:bg-muted/50 hover:border-border/80"
                        )}
                      >
                        {/* Top Row: Icon + Name + Badge */}
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

                        {/* Middle: Short Description */}
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-normal">
                          {role.description || "Chưa có mô tả chi tiết"}
                        </p>

                        {/* Bottom: Indicator */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>ID: {role.code}</span>
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
                    onClick={() => {
                      setCloneFromRoleId(selectedRoleId || roles[0]?.id || "");
                      setCreateRoleModalOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    <span>Thêm vai trò mới</span>
                  </Button>
                </div>
              </PermissionGuard>
            </Card>
          </div>

          {/* ── 2.2. CỘT PHẢI: MA TRẬN PHÂN QUYỀN TƯƠNG ỨNG (8 Cols) ──────── */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            {selectedRole ? (
              <Card className="border-border bg-card shadow-xs">
                <CardHeader className="p-4 sm:p-5 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground">
                              {selectedRole.name}
                            </h2>
                            <Badge variant="outline" className="font-mono text-[11px]">
                              {selectedRole.code}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedRole.description || "Ma trận quyền hạn phân quyền chức năng cho vai trò này."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleSelectAll(true)}
                      >
                        <CheckSquare className="h-3 w-3 mr-1 text-primary" />
                        <span>Chọn tất cả</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => handleSelectAll(false)}
                      >
                        <Square className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>Bỏ tất cả</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filter Row: Category Tabs + Search input */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border mt-3">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <Button
                        size="sm"
                        variant={selectedCategory === "ALL" ? "default" : "outline"}
                        className={cn(
                          "h-7 text-xs px-2.5",
                          selectedCategory === "ALL" && "bg-primary text-white hover:bg-primary/90"
                        )}
                        onClick={() => setSelectedCategory("ALL")}
                      >
                        Tất cả ({matrixRows.length})
                      </Button>
                      {categories.map((cat) => {
                        const count = matrixRows.filter((p) => p.category === cat).length;
                        const isCurrent = selectedCategory === cat;
                        return (
                          <Button
                            key={cat}
                            size="sm"
                            variant={isCurrent ? "default" : "outline"}
                            className={cn(
                              "h-7 text-xs px-2.5",
                              isCurrent && "bg-primary text-white hover:bg-primary/90"
                            )}
                            onClick={() => setSelectedCategory(cat)}
                          >
                            {cat} ({count})
                          </Button>
                        );
                      })}
                    </div>

                    <div className="relative w-full sm:w-56 shrink-0">
                      <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Lọc tài nguyên, mã..."
                        value={searchResource}
                        onChange={(e) => setSearchResource(e.target.value)}
                        className="h-8 pl-8 text-xs"
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* Permission Matrix Table */}
                <CardContent className="p-0 overflow-x-auto">
                  {isLoadingRolePerms ? (
                    <div className="p-8 flex items-center justify-center gap-2 text-muted-foreground text-xs">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span>Đang tải ma trận phân quyền...</span>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          <th className="py-2.5 px-4 font-semibold text-foreground w-[30%]">
                            Chức năng / Nghiệp vụ
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("view")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Xem"
                            >
                              <span>Xem (View)</span>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("create")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Tạo mới"
                            >
                              <span>Tạo mới</span>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("edit")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Sửa"
                            >
                              <span>Sửa</span>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("delete")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Xóa"
                            >
                              <span>Xóa</span>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("approve")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Phê duyệt"
                            >
                              <span>Phê duyệt</span>
                            </div>
                          </th>
                          <th className="py-2.5 px-3 text-center font-semibold text-foreground">
                            <div
                              onClick={() => handleToggleColumn("export")}
                              className="cursor-pointer hover:text-primary transition-colors inline-flex items-center gap-1"
                              title="Nhấp để bật/tắt toàn bộ cột Quản lý nâng cao"
                            >
                              <span>Quản trị/Xử lý</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredPermissions.map((row) => {
                          const anyChecked =
                            row.view || row.create || row.edit || row.delete || row.approve || row.export;
                          return (
                            <tr
                              key={row.resourceKey}
                              className={cn(
                                "hover:bg-muted/50 transition-colors",
                                anyChecked ? "bg-card" : "bg-muted/10 opacity-70"
                              )}
                            >
                              {/* Resource Column */}
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <div className="font-semibold text-foreground text-xs leading-snug">
                                      {row.resourceName}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                      <span className="font-mono text-primary font-medium">{row.code}</span>
                                      <span>•</span>
                                      <span>{row.category}</span>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-primary"
                                    onClick={() => handleToggleRow(row.resourceKey)}
                                    title="Bật/Tắt tất cả quyền cho mục này"
                                  >
                                    Cả dòng
                                  </Button>
                                </div>
                              </td>

                              {/* 1. View Checkbox + Scope Selector */}
                              <td className="py-3 px-3 text-center">
                                {row.viewPerm ? (
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    <input
                                      type="checkbox"
                                      checked={row.view}
                                      onChange={() => handleToggleAction(row.resourceKey, "view")}
                                      style={{ accentColor: "#DC2626" }}
                                      className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                    />
                                    {row.view && (
                                      <select
                                        value={row.viewScope}
                                        onChange={(e) => handleScopeChange(row.resourceKey, e.target.value as DataScope)}
                                        className="h-5 px-1 text-[10px] font-mono rounded border border-border bg-background text-foreground focus:border-primary focus:outline-none"
                                      >
                                        {Object.values(DATA_SCOPE).map((scope) => (
                                          <option key={scope} value={scope}>
                                            {DATA_SCOPE_LABELS[scope]}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>

                              {/* 2. Create Checkbox (Red) */}
                              <td className="py-3 px-3 text-center">
                                {row.createPerm ? (
                                  <input
                                    type="checkbox"
                                    checked={row.create}
                                    onChange={() => handleToggleAction(row.resourceKey, "create")}
                                    style={{ accentColor: "#DC2626" }}
                                    className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>

                              {/* 3. Edit Checkbox (Red) */}
                              <td className="py-3 px-3 text-center">
                                {row.editPerm ? (
                                  <input
                                    type="checkbox"
                                    checked={row.edit}
                                    onChange={() => handleToggleAction(row.resourceKey, "edit")}
                                    style={{ accentColor: "#DC2626" }}
                                    className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>

                              {/* 4. Delete Checkbox (Red) */}
                              <td className="py-3 px-3 text-center">
                                {row.deletePerm ? (
                                  <input
                                    type="checkbox"
                                    checked={row.delete}
                                    onChange={() => handleToggleAction(row.resourceKey, "delete")}
                                    style={{ accentColor: "#DC2626" }}
                                    className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>

                              {/* 5. Approve Checkbox (Red) */}
                              <td className="py-3 px-3 text-center">
                                {row.approvePerm ? (
                                  <input
                                    type="checkbox"
                                    checked={row.approve}
                                    onChange={() => handleToggleAction(row.resourceKey, "approve")}
                                    style={{ accentColor: "#DC2626" }}
                                    className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>

                              {/* 6. Export / Advanced Manage Checkbox (Red) */}
                              <td className="py-3 px-3 text-center">
                                {row.exportPerm ? (
                                  <input
                                    type="checkbox"
                                    checked={row.export}
                                    onChange={() => handleToggleAction(row.resourceKey, "export")}
                                    style={{ accentColor: "#DC2626" }}
                                    className="h-4 w-4 rounded border-input text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer transition-transform hover:scale-105"
                                  />
                                ) : (
                                  <span className="text-muted-foreground/40 font-mono">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {filteredPermissions.length === 0 && !isLoadingRolePerms && (
                    <div className="text-center py-10 text-xs text-muted-foreground">
                      Không tìm thấy tài nguyên nào phù hợp bộ lọc
                    </div>
                  )}
                </CardContent>

                {/* Footer Summary & Save */}
                <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-muted/20">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    <span>
                      Đang hiển thị <strong className="text-foreground">{filteredPermissions.length}</strong> chức năng phân quyền cho vai trò{" "}
                      <strong className="text-foreground">{selectedRole.name}</strong>
                    </span>
                  </div>

                  <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-xs"
                        onClick={handleSaveMatrix}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        <span>Lưu cấu hình quyền</span>
                      </Button>
                    </div>
                  </PermissionGuard>
                </div>
              </Card>
            ) : (
              <div className="p-12 text-center text-muted-foreground border rounded-xl bg-card">
                Vui lòng chọn một vai trò từ danh sách bên trái để cấu hình ma trận quyền.
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Dialog Thêm Vai Trò Mới (Matching static-ui) ─────────────── */}
        <Dialog open={createRoleModalOpen} onOpenChange={setCreateRoleModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                Thêm Vai trò Mới vào Hệ thống
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground block">
                  Tên vai trò <span className="text-destructive">*</span>
                </label>
                <Input
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground block">
                  Mã định danh vai trò (Role Code) <span className="text-destructive">*</span>
                </label>
                <Input
                  value={newRoleCode}
                  onChange={(e) => setNewRoleCode(e.target.value.toUpperCase())}
                  placeholder="VD: TECH_LEAD"
                  className="h-8 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground block">
                  Kế thừa cấu hình quyền ban đầu từ
                </label>
                <select
                  value={cloneFromRoleId}
                  onChange={(e) => setCloneFromRoleId(e.target.value)}
                  className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="none">-- Không sao chép (để trống) --</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground block">
                  Mô tả trách nhiệm & phạm vi
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Ghi chú tóm tắt trách nhiệm của vai trò này..."
                  className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setCreateRoleModalOpen(false)}
                disabled={isCreating}
              >
                Hủy
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1.5"
                onClick={handleCreateRole}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                <span>Khởi tạo vai trò</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RouteGuard>
  );
}
