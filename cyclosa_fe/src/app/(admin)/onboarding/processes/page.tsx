"use client";

import React from "react";
import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetOnboardingProcessesQuery,
  useOnboardingProcessFilters,
  OnboardingPageHeader,
  ProcessKpiCards,
  ProcessFilters,
  ProcessTable,
  ProcessKanbanBoard,
} from "@/features/onboarding";

export default function OnboardingProcessesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ONBOARDING.MANAGE);

  const {
    filters,
    search,
    status,
    departmentId,
    viewMode,
    setSearch,
    setStatus,
    setDepartmentId,
    setViewMode,
    setPage,
    resetFilters,
  } = useOnboardingProcessFilters();

  const { data, isLoading } = useGetOnboardingProcessesQuery(filters);

  const processes = data?.items || [];
  const pagination = data?.pagination || {
    page: 0,
    size: 10,
    total: 0,
    pages: 1,
  };

  return (
    <div className="space-y-6 pb-12">
      <OnboardingPageHeader
        title="Tiến trình hội nhập"
        icon={UserPlus}
        breadcrumbs={[
          { label: "Hội nhập nhân sự", href: "/onboarding/processes" },
          { label: "Tiến trình hội nhập" },
        ]}
        actions={
          canManage && (
            <Button
              asChild
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Link href="/onboarding/processes/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Tiếp nhận nhân sự mới</span>
              </Link>
            </Button>
          )
        }
      />

      {/* 4 Thẻ KPI Metric */}
      <ProcessKpiCards processes={processes} />

      {/* Thanh bộ lọc & Toggle Chế độ xem */}
      <ProcessFilters
        search={search}
        status={status}
        departmentId={departmentId}
        viewMode={viewMode}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDepartmentChange={setDepartmentId}
        onViewModeChange={setViewMode}
        onReset={resetFilters}
      />

      {/* Bảng Dạng Danh sách hoặc Dạng Thẻ Kanban */}
      {viewMode === "kanban" ? (
        <ProcessKanbanBoard processes={processes} isLoading={isLoading} />
      ) : (
        <ProcessTable
          processes={processes}
          isLoading={isLoading}
          page={pagination.page + 1}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

