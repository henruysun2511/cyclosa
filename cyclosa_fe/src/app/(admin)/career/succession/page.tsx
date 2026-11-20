"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetSuccessionPlansQuery,
  useGetCareerStatisticsQuery,
  useCreateSuccessionPlanMutation,
  useUpdateSuccessionPlanMutation,
  useDeleteSuccessionPlanMutation,
  useSuccessionPlanFilters,
  CareerStatsCards,
  SuccessionFilters,
  SuccessionPlanTable,
  SuccessionPlanDialog,
  type SuccessionPlanItem,
  type SuccessionPlanFormValues,
} from "@/features/career";
import { useGetAllJobTitlesQuery } from "@/features/organization/api/job-title-api";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";

export default function SuccessionPlansPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedPlan, setSelectedPlan] = useState<SuccessionPlanItem | null>(null);

  const {
    filters,
    setSearch,
    setDepartmentId,
    setRiskLevel,
    setPage,
    setSize,
    resetFilters,
  } = useSuccessionPlanFilters();

  const {
    data: plansData,
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useGetSuccessionPlansQuery({
    page: filters.page - 1,
    size: filters.size,
    departmentId: filters.departmentId === "ALL" ? undefined : filters.departmentId,
    riskLevel: filters.riskLevel,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetCareerStatisticsQuery();

  const { data: jobTitlesData } = useGetAllJobTitlesQuery();
  const { data: departmentsData } = useGetDepartmentsQuery({ size: 100 });

  const [createPlan, { isLoading: isCreating }] = useCreateSuccessionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSuccessionPlanMutation();
  const [deletePlan] = useDeleteSuccessionPlanMutation();

  const jobTitlesList = (jobTitlesData || []).map((jt: any) => ({
    id: jt.id,
    name: jt.name,
    code: jt.code,
  }));

  const departmentsList = (departmentsData?.items || []).map((d: any) => ({
    id: d.id,
    name: d.name || d.code,
  }));

  const filteredItems = (plansData?.items || []).filter((item) => {
    if (!filters.debouncedSearch) return true;
    const s = filters.debouncedSearch.toLowerCase();
    return (
      item.jobTitleName?.toLowerCase().includes(s) ||
      item.departmentName?.toLowerCase().includes(s) ||
      item.currentHolderName?.toLowerCase().includes(s) ||
      item.currentHolderCode?.toLowerCase().includes(s)
    );
  });

  const handleOpenCreate = () => {
    setDialogMode("create");
    setSelectedPlan(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (plan: SuccessionPlanItem) => {
    setDialogMode("edit");
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const handleDelete = async (plan: SuccessionPlanItem) => {
    if (confirm(`Bạn có chắc chắn muốn xóa kế hoạch kế nhiệm chức danh "${plan.jobTitleName}" tại "${plan.departmentName}"?`)) {
      try {
        await deletePlan(plan.id).unwrap();
        toast.success("Xóa kế hoạch kế nhiệm thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa kế hoạch kế nhiệm. Vui lòng thử lại!");
      }
    }
  };

  const handleDialogSubmit = async (values: SuccessionPlanFormValues) => {
    try {
      if (dialogMode === "create") {
        await createPlan({
          departmentId: values.departmentId,
          jobTitleId: values.jobTitleId,
          riskLevel: values.riskLevel,
          reviewDate: values.reviewDate,
        }).unwrap();
        toast.success("Tạo mới kế hoạch kế nhiệm thành công!");
      } else if (selectedPlan) {
        await updatePlan({
          id: selectedPlan.id,
          riskLevel: values.riskLevel,
          reviewDate: values.reviewDate,
        }).unwrap();
        toast.success("Cập nhật kế hoạch kế nhiệm thành công!");
      }
      setDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể lưu kế hoạch kế nhiệm. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Rule 02: Header trang & Breadcrumbs chuẩn 100% */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Compass className="w-6 h-6 text-primary shrink-0" />
            <span>Kế hoạch kế nhiệm</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors">
              Phát triển & Kế nhiệm
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Kế hoạch kế nhiệm</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchPlans();
              refetchStats();
            }}
            disabled={isPlansLoading || isStatsLoading}
            className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPlansLoading || isStatsLoading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lập kế hoạch kế nhiệm</span>
          </Button>
        </div>
      </div>

      {/* Rule 03: 4 KPI Cards */}
      <CareerStatsCards
        stats={statsData}
        isLoading={isStatsLoading}
        selectedFilter={filters.riskLevel}
        onFilterSelect={(val) => {
          if (val === "HIGH_RISK") setRiskLevel("HIGH");
          else if (val === "ALL" || !val) setRiskLevel("ALL");
        }}
      />

      {/* Rule 03: Filter bar 2 hàng */}
      <SuccessionFilters
        search={filters.search}
        riskLevel={filters.riskLevel}
        departmentId={filters.departmentId}
        departments={departmentsList}
        onSearchChange={setSearch}
        onRiskChange={setRiskLevel}
        onDepartmentChange={setDepartmentId}
        onReset={resetFilters}
      />

      {/* Bảng kế hoạch kế nhiệm */}
      <SuccessionPlanTable
        items={filteredItems}
        page={filters.page}
        pageSize={filters.size}
        isLoading={isPlansLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {plansData && (
        <DataPagination
          pagination={plansData.pagination}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />
      )}

      {/* Single Form Dialog Create / Edit */}
      <SuccessionPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedPlan}
        departments={departmentsList}
        jobTitles={jobTitlesList}
        onSubmit={handleDialogSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
