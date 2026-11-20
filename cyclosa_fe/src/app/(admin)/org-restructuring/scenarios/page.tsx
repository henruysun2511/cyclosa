"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { OrgScenarioStatsCards } from "@/features/org-restructuring/components/org-scenario-stats-cards";
import { OrgScenarioFilters } from "@/features/org-restructuring/components/org-scenario-filters";
import { OrgScenarioTable } from "@/features/org-restructuring/components/org-scenario-table";
import { OrgScenarioDialog } from "@/features/org-restructuring/components/org-scenario-dialog";
import { useOrgScenariosFilters } from "@/features/org-restructuring/hooks/use-org-scenarios-filters";
import {
  useGetScenariosQuery,
  useGetScenarioStatisticsQuery,
  useCreateScenarioMutation,
  useDeleteScenarioMutation,
} from "@/features/org-restructuring/api/org-restructuring-api";
import type { CreateOrgScenarioFormValues } from "@/features/org-restructuring/schemas/org-restructuring.schemas";

export default function OrgScenariosPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const {
    keyword,
    setKeyword,
    status,
    setStatus,
    scope,
    setScope,
    page,
    setPage,
    size,
    queryParams,
    handleReset,
  } = useOrgScenariosFilters(0, 10);

  const { data: scenariosData, isLoading } = useGetScenariosQuery(queryParams);
  const { data: statsData, isLoading: isLoadingStats } = useGetScenarioStatisticsQuery();
  const [createScenario, { isLoading: isCreating }] = useCreateScenarioMutation();
  const [deleteScenario] = useDeleteScenarioMutation();

  const handleCreateScenario = async (values: CreateOrgScenarioFormValues) => {
    try {
      await createScenario(values).unwrap();
      toast.success("Tạo mới kịch bản tái cơ cấu thành công!");
      setOpenDialog(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể tạo kịch bản tái cơ cấu. Vui lòng kiểm tra lại!");
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kịch bản tái cơ cấu này?")) {
      try {
        await deleteScenario(id).unwrap();
        toast.success("Xóa kịch bản tái cơ cấu thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa kịch bản tái cơ cấu. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Breadcrumbs chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <SlidersHorizontal className="w-6 h-6 text-primary shrink-0" />
            <span>Kịch bản Tái cơ cấu Tổ chức</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/organization" className="hover:text-primary transition-colors">
              Quản lý tổ chức
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Kịch bản tái cơ cấu</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button onClick={() => setOpenDialog(true)} size="sm" className="h-9 text-xs">
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Tạo kịch bản mới</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI Stats Cards */}
      <OrgScenarioStatsCards
        stats={statsData}
        selectedStatus={status}
        onFilterStatus={(st) => {
          setStatus(st || "ALL");
          setPage(0);
        }}
        isLoading={isLoadingStats}
      />

      {/* 3. Filter Bar 2 hàng */}
      <OrgScenarioFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        status={status}
        onStatusChange={setStatus}
        scope={scope}
        onScopeChange={setScope}
        onReset={handleReset}
      />

      {/* 4. Data Table */}
      <OrgScenarioTable
        scenarios={scenariosData?.items || []}
        page={page}
        size={size}
        total={scenariosData?.pagination?.total || 0}
        onPageChange={setPage}
        isLoading={isLoading}
        onDelete={handleDeleteScenario}
      />

      {/* 5. Dialog tạo kịch bản */}
      <OrgScenarioDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleCreateScenario}
        isLoading={isCreating}
      />
    </div>
  );
}
