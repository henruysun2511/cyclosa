"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetCyclesQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useDeleteCycleMutation,
  useActivateCycleMutation,
  useCloseCycleMutation,
  useCycleFilters,
  CycleStatsCards,
  CycleFilters,
  CycleTable,
  CycleFormDialog,
  type PerformanceCycleDto,
  type CycleFormValues,
} from "@/features/performance";

export default function PerformanceCyclesPage() {
  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    yearParam,
    year,
    page,
    size,
    setSearch,
    setStatus,
    setYear,
    setPage,
    setSize,
    resetFilters,
  } = useCycleFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<PerformanceCycleDto | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetCyclesQuery({
    search: debouncedSearch.trim() || undefined,
    status,
    year,
    page,
    size,
  });

  const { data: allCyclesData } = useGetCyclesQuery({ size: 100 });
  const allCycles = allCyclesData?.data?.items || [];

  const [createCycle, { isLoading: isCreating }] = useCreateCycleMutation();
  const [updateCycle, { isLoading: isUpdating }] = useUpdateCycleMutation();
  const [deleteCycle] = useDeleteCycleMutation();
  const [activateCycle] = useActivateCycleMutation();
  const [closeCycle] = useCloseCycleMutation();

  const cycles = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const handleOpenCreate = () => {
    setSelectedCycle(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (cycle: PerformanceCycleDto) => {
    setSelectedCycle(cycle);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: CycleFormValues) => {
    try {
      if (selectedCycle) {
        await updateCycle({
          id: selectedCycle.id,
          body: {
            name: values.name,
            startDate: values.startDate,
            endDate: values.endDate,
            selfReviewDeadline: values.selfReviewDeadline || undefined,
            managerReviewDeadline: values.managerReviewDeadline || undefined,
            description: values.description || undefined,
          },
        }).unwrap();
        toast.success("Cập nhật kỳ đánh giá thành công");
      } else {
        await createCycle({
          name: values.name,
          cycleType: values.cycleType,
          year: values.year,
          startDate: values.startDate,
          endDate: values.endDate,
          selfReviewDeadline: values.selfReviewDeadline || undefined,
          managerReviewDeadline: values.managerReviewDeadline || undefined,
          description: values.description || undefined,
        }).unwrap();
        toast.success("Tạo kỳ đánh giá mới thành công");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi khi lưu kỳ đánh giá");
    }
  };

  const handleDelete = async (cycle: PerformanceCycleDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa kỳ đánh giá "${cycle.name}"?`)) return;
    try {
      await deleteCycle(cycle.id).unwrap();
      toast.success("Xóa kỳ đánh giá thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa kỳ đánh giá");
    }
  };

  const handleActivate = async (cycle: PerformanceCycleDto) => {
    if (!confirm(`Kích hoạt mở kỳ "${cycle.name}" cho toàn bộ nhân viên tham gia đánh giá?`)) return;
    try {
      await activateCycle(cycle.id).unwrap();
      toast.success("Kích hoạt kỳ đánh giá thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể kích hoạt kỳ đánh giá");
    }
  };

  const handleClose = async (cycle: PerformanceCycleDto) => {
    if (!confirm(`Đóng kỳ đánh giá "${cycle.name}"? Sau khi đóng sẽ ngừng nhận đánh giá mới.`)) return;
    try {
      await closeCycle(cycle.id).unwrap();
      toast.success("Đóng kỳ đánh giá thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể đóng kỳ đánh giá");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Actions (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Calendar className="w-6 h-6 text-primary shrink-0" />
            <span>Kỳ đánh giá hiệu suất</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors">Hiệu suất & KPI</span>
            <span>/</span>
            <span className="text-foreground font-medium">Kỳ đánh giá</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Link href="/performance/kpis">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Danh mục KPI</span>
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
            <span>Tạo kỳ đánh giá</span>
          </Button>
        </div>
      </div>

      {/* 2. Stats Cards chuẩn CYCLOSA (Rule 03) */}
      <CycleStatsCards
        cycles={allCycles.length > 0 ? allCycles : cycles}
        selectedStatus={statusParam}
        onFilterStatus={(st) => setStatus(st || "ALL")}
        isLoading={isLoading}
      />

      {/* 3. Filter Bar (Rule 03) */}
      <CycleFilters
        search={search}
        onSearchChange={setSearch}
        status={statusParam}
        onStatusChange={setStatus}
        year={yearParam}
        onYearChange={setYear}
        onReset={resetFilters}
      />

      {/* 4. Table (Rule 04) */}
      <CycleTable
        items={cycles}
        isLoading={isLoading}
        page={page}
        size={size}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onActivate={handleActivate}
        onClose={handleClose}
      />

      {/* 5. Phân trang */}
      {pagination && pagination.pages > 1 && (
        <DataPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setSize}
        />
      )}

      {/* 6. Form Dialog (Rule 05) */}
      <CycleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        entity={selectedCycle}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
