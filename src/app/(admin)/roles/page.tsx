"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { RouteGuard } from "@/features/authorization/components/route-guard";
import {
  PERMISSIONS,
  DATA_SCOPE,
  type DataScope,
} from "@/features/authorization/constants/permission.constants";
import {
  useGetRolesQuery,
  useGetGroupedPermissionsQuery,
  useGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
  useRoleFilters,
  RoleListSidebar,
  RolePermissionChecklist,
  RoleFormDialog,
  RoleDeleteDialog,
  type PermissionScopeItem,
  type RoleResponse,
} from "@/features/authorization";

function RolesPageContent() {
  // ── 1. URL Search Params Filter Hook (Đồng bộ URL params) ───────────────────
  const { roleId, search, debouncedSearch, setRoleId, setSearch } = useRoleFilters();

  // ── 2. Load Roles from Backend ─────────────────────────────────────────────
  const { data: rolesData, isLoading: isLoadingRoles, refetch: refetchRoles } = useGetRolesQuery({
    size: 100,
    sortBy: "createdAt",
    direction: "asc",
    keyword: debouncedSearch.trim() || undefined,
  });

  const roles = useMemo(() => rolesData?.data?.items || [], [rolesData]);

  // Sync active role with URL param
  useEffect(() => {
    if (roles.length > 0) {
      if (!roleId || !roles.some((r) => r.id === roleId)) {
        setRoleId(roles[0].id);
      }
    }
  }, [roles, roleId, setRoleId]);

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === roleId) || roles[0] || null;
  }, [roles, roleId]);

  // ── 3. Load Permissions & Role Assignments ─────────────────────────────────
  const { data: groupedData } = useGetGroupedPermissionsQuery();
  const {
    data: rolePermsData,
    isLoading: isLoadingRolePerms,
    refetch: refetchRolePerms,
  } = useGetRolePermissionsQuery(selectedRole?.id || "", {
    skip: !selectedRole?.id,
  });

  const [assignRolePermissions, { isLoading: isSaving }] = useAssignRolePermissionsMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRole, setFormRole] = useState<RoleResponse | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleResponse | null>(null);

  const handleOpenCreate = () => {
    setFormRole(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (role: RoleResponse) => {
    setFormRole(role);
    setIsFormOpen(true);
  };

  // ── 4. Local Matrix Permission State ───────────────────────────────────────
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
  }, [groupedData, rolePermsData, selectedRole?.id]);

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

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Vai trò & Phân quyền Hệ thống
        </h1>
      </div>

      {/* ── 2. Two-Column Master-Detail Layout ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái: Danh sách Vai trò */}
        <RoleListSidebar
          roles={roles}
          selectedRoleId={selectedRole?.id || ""}
          onSelectRole={setRoleId}
          searchRole={search}
          onSearchChange={setSearch}
          onOpenCreateModal={handleOpenCreate}
          onEditRole={handleOpenEdit}
          onDeleteRole={setDeletingRole}
          isLoading={isLoadingRoles}
        />

        {/* Cột phải: Ma trận Thẻ phân cấp checklist */}
        <RolePermissionChecklist
          selectedRole={selectedRole}
          groupedData={groupedData?.data}
          permissionState={permissionState}
          onTogglePermission={handleTogglePermission}
          onScopeChange={handleScopeChange}
          onToggleResource={handleToggleResource}
          onToggleGroup={handleToggleGroup}
          onSelectAll={handleSelectAll}
          onSaveMatrix={handleSaveMatrix}
          isSaving={isSaving}
          isLoadingRolePerms={isLoadingRolePerms}
        />
      </div>

      {/* ── 3. Dialogs Tạo/Sửa và Xóa Vai Trò ─────────────────────────── */}
      <RoleFormDialog
        role={formRole}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        roles={roles}
        defaultCloneRoleId={selectedRole?.id}
        onSuccess={(roleId) => {
          refetchRoles();
          if (roleId) setRoleId(roleId);
        }}
      />

      <RoleDeleteDialog
        role={deletingRole}
        open={Boolean(deletingRole)}
        onOpenChange={(open) => !open && setDeletingRole(null)}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
            Đang tải dữ liệu phân quyền...
          </div>
        }
      >
        <RolesPageContent />
      </Suspense>
    </RouteGuard>
  );
}
