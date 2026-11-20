"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Plus, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetKpisQuery,
  useCreateKpiMutation,
  useUpdateKpiMutation,
  useDeleteKpiMutation,
  useKpiFilters,
  KpiStatsCards,
  KpiFilterBar,
  KpiTable,
  KpiFormDialog,
  type KpiDto,
  type KpiFormValues,
} from "@/features/performance";
import { useGetDepartmentsQuery } from "@/features/organization/api";

export default function PerformanceKpisPage() {
  const {
    search,
    debouncedSearch,
    departmentIdParam,
    departmentId,
    isActiveParam,
    isActive,
    page,
    size,
    setSearch,
    setDepartmentId,
    setIsActive,
    setPage,
    setSize,
    resetFilters,
  } = useKpiFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KpiDto | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetKpisQuery({
    search: debouncedSearch.trim() || undefined,
    departmentId,
    isActive,
    page,
    size,
  });

  const { data: allKpisData } = useGetKpisQuery({ size: 200 });
  const allKpis = allKpisData?.data?.items || [];

  const { data: deptData } = useGetDepartmentsQuery({ size: 100 });
  const departments = (deptData?.items || []).map((d: any) => ({
    id: d.id,
    name: d.name || d.code,
  }));

  const [createKpi, { isLoading: isCreating }] = useCreateKpiMutation();
  const [updateKpi, { isLoading: isUpdating }] = useUpdateKpiMutation();
  const [deleteKpi] = useDeleteKpiMutation();

  const kpis = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const handleOpenCreate = () => {
    setSelectedKpi(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (kpi: KpiDto) => {
    setSelectedKpi(kpi);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: KpiFormValues) => {
    try {
      if (selectedKpi) {
        await updateKpi({
          id: selectedKpi.id,
          body: {
            name: values.name,
            description: values.description || undefined,
            unit: values.unit,
            defaultTarget: values.defaultTarget,
            departmentId: values.departmentId || undefined,
            isActive: values.isActive,
          },
        }).unwrap();
        toast.success("Cập nhật chỉ số KPI thành công");
      } else {
        await createKpi({
          code: values.code,
          name: values.name,
          description: values.description || undefined,
          unit: values.unit,
          defaultTarget: values.defaultTarget,
          departmentId: values.departmentId || undefined,
          isActive: values.isActive,
        }).unwrap();
        toast.success("Tạo chỉ số KPI mới thành công");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi khi lưu chỉ số KPI");
    }
  };

  const handleDelete = async (kpi: KpiDto) => {
    if (!confirm(`Bạn có chắc muốn xóa chỉ số KPI "${kpi.name}"?`)) return;
    try {
      await deleteKpi(kpi.id).unwrap();
      toast.success("Xóa chỉ số KPI thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa chỉ số KPI");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Layers className="w-6 h-6 text-primary shrink-0" />
            <span>Danh mục chỉ số KPI</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors">Hiệu suất & KPI</span>
            <span>/</span>
            <span className="text-foreground font-medium">Danh mục KPI</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Link href="/performance/cycles">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Kỳ đánh giá</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm KPI mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Stats Cards chuẩn CYCLOSA (Rule 03) */}
      <KpiStatsCards
        kpis={allKpis.length > 0 ? allKpis : kpis}
        selectedActive={isActiveParam}
        onFilterActive={(act) => setIsActive(act)}
        isLoading={isLoading}
      />

      {/* 3. Filter Bar (Rule 03) */}
      <KpiFilterBar
        search={search}
        onSearchChange={setSearch}
        departmentId={departmentIdParam}
        onDepartmentChange={setDepartmentId}
        isActive={isActiveParam}
        onIsActiveChange={setIsActive}
        departments={departments}
        onReset={resetFilters}
      />

      {/* 3. Table (Rule 04) */}
      <KpiTable
        items={kpis}
        isLoading={isLoading}
        page={page}
        size={size}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* 4. Phân trang */}
      {pagination && pagination.pages > 1 && (
        <DataPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setSize}
        />
      )}

      {/* 5. Form Dialog (Rule 05) */}
      <KpiFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entity={selectedKpi}
        departments={departments}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
