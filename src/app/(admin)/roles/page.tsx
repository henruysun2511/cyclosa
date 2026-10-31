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
  Minus,
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
  type PermissionScopeItem,
  type PermissionResponse,
} from "@/features/authorization";

// ── Checkbox Helper matching User Screenshot (Check, Minus, Empty) ────────────
function HierarchicalCheckbox({
  checked,
  indeterminate,
  onChange,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "h-4 w-4 rounded flex items-center justify-center transition-colors shrink-0 outline-none",
        checked || indeterminate
          ? "bg-primary text-primary-foreground border border-primary shadow-2xs"
          : "border border-input bg-background hover:border-primary/50",
        className
      )}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3 stroke-[3]" />
      ) : checked ? (
        <Check className="h-3 w-3 stroke-[3]" />
      ) : null}
    </button>
  );
}

// ── 6 Nhóm Phân Hệ Lớn (Level 1: Groups) & Tài nguyên con (Level 2) ──────────
const PERMISSION_GROUPS = [
  {
    key: "HR_GROUP",
    title: "HỒ SƠ & NHÂN SỰ",
    resources: [
      { key: "EMPLOYEE", name: "Hồ sơ nhân viên & Lý lịch" },
      { key: "CONTRACT", name: "Hợp đồng lao động & Ký số" },
    ],
  },
  {
    key: "TIME_GROUP",
    title: "CHẤM CÔNG & NGHỈ PHÉP",
    resources: [
      { key: "ATTENDANCE", name: "Chấm công & Ca làm việc" },
      { key: "LEAVE", name: "Đơn xin nghỉ phép & Phê duyệt" },
    ],
  },
  {
    key: "PAYROLL_GROUP",
    title: "TIỀN LƯƠNG & ĐÃI NGỘ",
    resources: [
      { key: "PAYROLL", name: "Bảng tính lương & Phiếu lương" },
    ],
  },
  {
    key: "ORG_GROUP",
    title: "CƠ CẤU & TỔ CHỨC",
    resources: [
      { key: "ORG", name: "Sơ đồ tổ chức & Phòng ban" },
    ],
  },
  {
    key: "TALENT_GROUP",
    title: "TUYỂN DỤNG & HIỆU SUẤT",
    resources: [
      { key: "RECRUITMENT", name: "Kế hoạch & Tuyển dụng" },
      { key: "PERFORMANCE", name: "Đánh giá hiệu suất & KPI" },
    ],
  },
  {
    key: "SYSTEM_GROUP",
    title: "HỆ THỐNG & BẢO MẬT",
    resources: [
      { key: "ROLE", name: "Quản lý vai trò & Ma trận phân quyền" },
      { key: "USER", name: "Tài khoản người dùng" },
      { key: "WORKPLACE", name: "Không gian số & Tài sản" },
      { key: "AUDIT", name: "Nhật ký kiểm toán & Tuân thủ" },
    ],
  },
];

// Helper sinh tiêu đề tự nhiên giống hình (Xem..., Tạo..., Sửa..., Xóa...)
function getPermissionTitle(perm: PermissionResponse, resourceName: string): string {
  const action = perm.action.toUpperCase();
  const rawName = resourceName.toLowerCase().replace("quản lý ", "").replace("quản trị ", "");
  switch (action) {
    case "VIEW":
      return `Xem ${rawName}`;
    case "CREATE":
    case "APPLY":
      return `Tạo ${rawName}`;
    case "UPDATE":
    case "EDIT":
    case "PROCESS":
      return `Sửa ${rawName}`;
    case "DELETE":
      return `Xóa ${rawName}`;
    case "APPROVE":
      return `Phê duyệt ${rawName}`;
    case "SIGN":
      return `Ký duyệt ${rawName}`;
    case "CHECKIN":
      return `Điểm danh trực tuyến`;
    case "EVALUATE":
      return `Đánh giá ${rawName}`;
    case "ACTIVATE":
      return `Kích hoạt / Khóa tài khoản`;
    case "ASSIGN":
      return `Phân bổ vai trò`;
    case "SIMULATE":
      return `Mô phỏng cơ cấu tổ chức`;
    case "VIEW_SALARY":
      return `Xem chi tiết phiếu lương`;
    case "MANAGE":
      return `Quản lý ${rawName}`;
    default:
      return `${perm.action} ${rawName}`;
  }
}

export default function AdminRolesPage() {
  // ── 1. Load Roles from Backend ─────────────────────────────────────────────
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

  // ── 2. Load Permissions & Role Assignments ─────────────────────────────────
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

  // ── 3. Filters & Modal State ───────────────────────────────────────────────
  const [searchRole, setSearchRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [cloneFromRoleId, setCloneFromRoleId] = useState("");

  // ── 4. Local Matrix Permission State: Map<PermissionCode, { granted, dataScope, permId }> ──
  const [permissionState, setPermissionState] = useState<
    Record<string, { granted: boolean; dataScope: DataScope; permissionId: string }>
  >({});

  useEffect(() => {
    if (!groupedData?.data) return;

    const assignedMap = new Map<string, DataScope>();
    if (rolePermsData?.data) {
      rolePermsData.data.forEach((p) => {
        assignedMap.set(p.permissionCode, p.dataScope);
      });
    }

    const nextState: Record<string, { granted: boolean; dataScope: DataScope; permissionId: string }> = {};

    Object.values(groupedData.data).forEach((perms) => {
      perms.forEach((perm) => {
        const isAssigned = assignedMap.has(perm.code);
        const scope = assignedMap.get(perm.code) || DATA_SCOPE.COMPANY;
        nextState[perm.code] = {
          granted: isAssigned,
          dataScope: scope,
          permissionId: perm.id,
        };
      });
    });

    setPermissionState(nextState);
  }, [groupedData, rolePermsData, selectedRoleId]);

  // ── 5. Permission Toggle Handlers ──────────────────────────────────────────
  const handleTogglePermission = (code: string) => {
    setPermissionState((prev) => {
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

  const handleScopeChange = (code: string, scope: DataScope) => {
    setPermissionState((prev) => {
      const item = prev[code];
      if (!item) return prev;
      return {
        ...prev,
        [code]: {
          ...item,
          dataScope: scope,
        },
      };
    });
  };

  const handleToggleResource = (resourceKey: string, nextVal: boolean) => {
    if (!groupedData?.data) return;
    const perms = groupedData.data[resourceKey] || [];
    setPermissionState((prev) => {
      const next = { ...prev };
      perms.forEach((p) => {
        if (next[p.code]) {
          next[p.code] = { ...next[p.code], granted: nextVal };
        }
      });
      return next;
    });
  };

  const handleToggleGroup = (groupResources: { key: string }[], nextVal: boolean) => {
    if (!groupedData?.data) return;
    setPermissionState((prev) => {
      const next = { ...prev };
      groupResources.forEach((res) => {
        const perms = groupedData.data[res.key] || [];
        perms.forEach((p) => {
          if (next[p.code]) {
            next[p.code] = { ...next[p.code], granted: nextVal };
          }
        });
      });
      return next;
    });
  };

  const handleSelectAll = (selectAll: boolean) => {
    setPermissionState((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((code) => {
        next[code] = { ...next[code], granted: selectAll };
      });
      return next;
    });
    toast.success(selectAll ? "Đã chọn toàn bộ quyền hạn" : "Đã bỏ chọn toàn bộ quyền hạn");
  };

  const handleResetPermissions = () => {
    refetchRolePerms();
    toast.info("Đã khôi phục ma trận phân quyền từ máy chủ.");
  };

  // ── 6. Save Matrix to Backend ──────────────────────────────────────────────
  const handleSaveMatrix = async () => {
    if (!selectedRole) return;

    const payload: PermissionScopeItem[] = Object.values(permissionState)
      .filter((p) => p.granted)
      .map((p) => ({
        permissionId: p.permissionId,
        dataScope: p.dataScope,
      }));

    try {
      const res = await assignRolePermissions({
        roleId: selectedRole.id,
        body: { permissions: payload },
      }).unwrap();

      if (res.success) {
        toast.success(
          `Đã lưu cấu hình ma trận phân quyền cho vai trò [${selectedRole.name}] thành công! (${payload.length} quyền)`
        );
        refetchRolePerms();
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể lưu phân quyền. Vui lòng thử lại.");
    }
  };

  // ── 7. Create New Role ─────────────────────────────────────────────────────
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

        // If cloning, copy permissions
        if (cloneFromRoleId && cloneFromRoleId !== "none") {
          const payload: PermissionScopeItem[] = Object.values(permissionState)
            .filter((p) => p.granted)
            .map((p) => ({
              permissionId: p.permissionId,
              dataScope: p.dataScope,
            }));

          if (payload.length > 0) {
            await assignRolePermissions({
              roleId: newRoleId,
              body: { permissions: payload },
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

  // ── 8. Filter Roles list ───────────────────────────────────────────────────
  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(searchRole.toLowerCase()) ||
        r.code.toLowerCase().includes(searchRole.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchRole.toLowerCase()))
    );
  }, [roles, searchRole]);

  // Overall Count
  const totalGrantedOverall = useMemo(() => {
    return Object.values(permissionState).filter((p) => p.granted).length;
  }, [permissionState]);

  const totalPermissionsOverall = Object.keys(permissionState).length || 36;

  const isLoading = isLoadingRoles || isLoadingGrouped;

  return (
    <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
      <div className="space-y-6 pb-12">
        {/* ── 1. Header (Clean, No Breadcrumbs) ────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Vai trò & Phân quyền Hệ thống
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              RBAC MATRIX
            </Badge>
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

        {/* ── 2. Two-Column Layout ─────────────────────────────────────── */}
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

          {/* ── 2.2. CỘT PHẢI: HIỂN THỊ DẠNG DANH MỤC THẺ GIỐNG HÌNH (8 Cols) ── */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-5">
            {selectedRole ? (
              <>
                {/* Header Role Summary & Action Bar */}
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
                          <Badge variant="outline" className="font-mono text-[11px]">
                            {selectedRole.code}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20 text-[11px] font-medium"
                          >
                            Đã cấp: {totalGrantedOverall} / {totalPermissionsOverall} quyền
                          </Badge>
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
                        onClick={() => handleSelectAll(true)}
                      >
                        <CheckSquare className="h-3.5 w-3.5 mr-1 text-primary" />
                        <span>Chọn tất cả</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleSelectAll(false)}
                      >
                        <Square className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>Bỏ tất cả</span>
                      </Button>
                    </div>
                  </div>

                  {/* Filter search box for permissions */}
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

                {/* ── DANH SÁCH THẺ PHÂN HỆ GIỐNG HỆT HÌNH ────────────────── */}
                {isLoadingRolePerms ? (
                  <div className="p-12 text-center text-muted-foreground border rounded-xl bg-card flex items-center justify-center gap-2 text-xs">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Đang tải ma trận phân quyền...</span>
                  </div>
                ) : (
                  PERMISSION_GROUPS.map((group) => {
                    // Lọc permissions của cả group
                    const allPermsInGroup = group.resources.flatMap((res) => {
                      return groupedData?.data?.[res.key] || [];
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
                        {/* Header Cấp 1 (Giống hình: [-] SỐ HÓA      10 / 31 quyền được gán) */}
                        <div className="p-4 bg-muted/25 border-b border-border flex items-center justify-between select-none">
                          <div className="flex items-center gap-3">
                            <HierarchicalCheckbox
                              checked={groupAllChecked}
                              indeterminate={groupIndeterminate}
                              onChange={() => handleToggleGroup(group.resources, !groupAllChecked)}
                            />
                            <span className="font-bold text-sm tracking-wide text-foreground">
                              {group.title}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {groupGrantedCount} / {groupTotalCount} quyền được gán
                          </span>
                        </div>

                        {/* Nội dung Cấp 2 (Từng tài nguyên: [-] Quản lý dự án, [ ] Kế hoạch dự án...) */}
                        <div className="p-5 space-y-6">
                          {group.resources.map((res, resIdx) => {
                            const resPerms = groupedData?.data?.[res.key] || [];
                            if (resPerms.length === 0) return null;

                            const resGrantedCount = resPerms.filter(
                              (p) => permissionState[p.code]?.granted
                            ).length;
                            const resTotalCount = resPerms.length;
                            const resAllChecked = resGrantedCount === resTotalCount && resTotalCount > 0;
                            const resIndeterminate = resGrantedCount > 0 && resGrantedCount < resTotalCount;

                            // Search filter on resource level
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
                                    onChange={() => handleToggleResource(res.key, !resAllChecked)}
                                  />
                                  <span className="font-semibold text-sm text-foreground">
                                    {res.name}
                                  </span>
                                </div>

                                {/* Lưới 2 cột các quyền con Cấp 3 (Giống hình) */}
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
                                          onChange={() => handleTogglePermission(perm.code)}
                                          className="mt-0.5"
                                        />

                                        <div className="space-y-0.5 flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                              onClick={() => handleTogglePermission(perm.code)}
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
                                                  handleScopeChange(perm.code, e.target.value as DataScope)
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

                                {/* Đường kẻ phân cách giữa các tài nguyên (Giống hình) */}
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

                {/* Footer Save Button */}
                <div className="p-4 border border-border rounded-xl bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground shadow-xs">
                  <div>
                    Đang thiết lập ma trận phân quyền cho vai trò:{" "}
                    <strong className="text-foreground">{selectedRole.name}</strong> (Mã: {selectedRole.code})
                  </div>

                  <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
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
                  </PermissionGuard>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-muted-foreground border rounded-xl bg-card">
                Vui lòng chọn một vai trò từ danh sách bên trái để cấu hình ma trận quyền.
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Dialog Thêm Vai Trò Mới ───────────────────────────────── */}
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
