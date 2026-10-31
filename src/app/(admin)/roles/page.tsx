"use client";

import React, { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { ShieldPlus, Shield } from "lucide-react";
import {
  RouteGuard,
  PermissionGuard,
  PERMISSIONS,
  useGetRolesQuery,
  RoleKpiCards,
  RoleFilters,
  RoleTable,
  RoleFormDialog,
  RolePermissionMatrixModal,
  RoleDeleteDialog,
  ROLE_FILTER_TABS,
  type RoleFilterTab,
  type RoleResponse,
} from "@/features/authorization";

export default function RolesManagementPage() {
  // ── 1. Filter & Pagination State ───────────────────────────────────────────
  const [keywordInput, setKeywordInput] = useState("");
  const [debouncedKeyword] = useDebounce(keywordInput, 400);
  const [activeTab, setActiveTab] = useState<RoleFilterTab>(ROLE_FILTER_TABS.ALL);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Compute boolean isSystemRole filter based on activeTab
  const isSystemRoleFilter = useMemo(() => {
    if (activeTab === ROLE_FILTER_TABS.SYSTEM) return true;
    if (activeTab === ROLE_FILTER_TABS.CUSTOM) return false;
    return undefined;
  }, [activeTab]);

  // ── 2. Query Data from Backend ─────────────────────────────────────────────
  const {
    data: rolesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetRolesQuery({
    keyword: debouncedKeyword.trim() || undefined,
    page,
    size: pageSize,
    sortBy: "createdAt",
    direction: "desc",
    isSystemRole: isSystemRoleFilter,
  });

  const roles = rolesData?.data?.items || [];
  const pagination = rolesData?.data?.pagination;

  // ── 3. KPI Statistics ──────────────────────────────────────────────────────
  const { systemCount, customCount } = useMemo(() => {
    let sys = 0;
    let custom = 0;
    roles.forEach((r) => {
      if (r.isSystemRole) sys++;
      else custom++;
    });
    return { systemCount: sys, customCount: custom };
  }, [roles]);

  // ── 4. Modals State ────────────────────────────────────────────────────────
  // Modal Thêm / Sửa
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);

  // Modal Ma trận Quyền
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [matrixRole, setMatrixRole] = useState<RoleResponse | null>(null);

  // Dialog Xóa
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleResponse | null>(null);

  // ── 5. Action Handlers ─────────────────────────────────────────────────────
  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditModal = (role: RoleResponse) => {
    setEditingRole(role);
    setFormDialogOpen(true);
  };

  const handleOpenMatrixModal = (role: RoleResponse) => {
    setMatrixRole(role);
    setMatrixModalOpen(true);
  };

  const handleOpenDeleteDialog = (role: RoleResponse) => {
    setDeletingRole(role);
    setDeleteDialogOpen(true);
  };

  const handleTabChange = (tab: RoleFilterTab) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleKeywordChange = (val: string) => {
    setKeywordInput(val);
    setPage(0);
  };

  return (
    <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
      <div className="space-y-6 p-1 md:p-2 pb-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Quản trị Vai trò & Ma trận Phân quyền
              </h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Thiết lập danh mục vai trò hệ thống, vai trò tùy chỉnh và phân bổ ma trận quyền hạn cho nhân sự.
            </p>
          </div>

          <PermissionGuard permission={PERMISSIONS.ROLE.MANAGE} fallback={null}>
            <Button
              onClick={handleOpenCreateModal}
              className="gap-2 shrink-0 shadow-xs self-start sm:self-auto"
            >
              <ShieldPlus className="h-4 w-4" />
              <span>Tạo vai trò mới</span>
            </Button>
          </PermissionGuard>
        </div>

        {/* KPI Cards */}
        <RoleKpiCards
          totalRoles={pagination?.total ?? roles.length}
          systemRolesCount={systemCount}
          customRolesCount={customCount}
          isLoading={isLoading}
        />

        {/* Filters & Search */}
        <RoleFilters
          keyword={keywordInput}
          onKeywordChange={handleKeywordChange}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRefresh={refetch}
          isRefreshing={isFetching}
        />

        {/* Role Table */}
        <RoleTable
          roles={roles}
          isLoading={isLoading}
          pagination={pagination}
          currentPage={page}
          onPageChange={setPage}
          onOpenMatrix={handleOpenMatrixModal}
          onEditRole={handleOpenEditModal}
          onDeleteRole={handleOpenDeleteDialog}
        />

        {/* Modals & Dialogs */}
        <RoleFormDialog
          role={editingRole}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
        />

        <RolePermissionMatrixModal
          role={matrixRole}
          open={matrixModalOpen}
          onOpenChange={setMatrixModalOpen}
        />

        <RoleDeleteDialog
          role={deletingRole}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </div>
    </RouteGuard>
  );
}
