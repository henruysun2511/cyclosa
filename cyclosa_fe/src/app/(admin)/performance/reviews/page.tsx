"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, RefreshCw, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetReviewsQuery,
  useGetCyclesQuery,
  useInitializeReviewsMutation,
  useReviewFilters,
  ReviewStatsCards,
  ReviewFilters,
  ReviewTable,
  InitializeReviewsDialog,
} from "@/features/performance";
import { useGetDepartmentsQuery } from "@/features/organization/api";
import { useGetEmployeesQuery } from "@/features/employee";

export default function PerformanceReviewsPage() {
  const {
    search,
    debouncedSearch,
    cycleIdParam,
    cycleId,
    departmentIdParam,
    departmentId,
    statusParam,
    status,
    page,
    size,
    setSearch,
    setCycleId,
    setDepartmentId,
    setStatus,
    setPage,
    setSize,
    resetFilters,
  } = useReviewFilters();

  const [initDialogOpen, setInitDialogOpen] = useState(false);

  // Queries
  const { data, isLoading, isFetching, refetch } = useGetReviewsQuery({
    search: debouncedSearch.trim() || undefined,
    cycleId,
    departmentId,
    status,
    page,
    size,
  });

  const { data: allReviewsData } = useGetReviewsQuery({
    cycleId,
    size: 200,
  });
  const allReviews = allReviewsData?.data?.items || [];

  const { data: cyclesData } = useGetCyclesQuery({ size: 100 });
  const cycles = cyclesData?.data?.items || [];

  const { data: deptData } = useGetDepartmentsQuery({ size: 100 });
  const departments = (deptData?.items || []).map((d: any) => ({
    id: d.id,
    name: d.name || d.code,
  }));

  const { data: employeesData } = useGetEmployeesQuery({
    size: 200,
    status: "ACTIVE",
  });
  const employees = (employeesData?.items || []).map((e: any) => ({
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: `${e.lastName} ${e.firstName}`,
    departmentName: e.currentDepartmentName,
  }));

  const [initializeReviews, { isLoading: isInitializing }] = useInitializeReviewsMutation();

  const reviews = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const handleInitialize = async (selectedCycleId: string, employeeIds: string[]) => {
    try {
      await initializeReviews({
        cycleId: selectedCycleId,
        body: { employeeIds },
      }).unwrap();
      toast.success(`Đã khởi tạo ${employeeIds.length} phiếu đánh giá thành công`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể khởi tạo phiếu đánh giá");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <span>Phiếu đánh giá hiệu suất</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors">Hiệu suất & KPI</span>
            <span>/</span>
            <span className="text-foreground font-medium">Phiếu đánh giá</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Link href="/performance/cycles">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Kỳ đánh giá</span>
            </Button>
          </Link>

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
            onClick={() => setInitDialogOpen(true)}
            className="h-8 text-xs gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Khởi tạo phiếu</span>
          </Button>
        </div>
      </div>

      {/* 2. Stats Cards chuẩn CYCLOSA (Rule 03) */}
      <ReviewStatsCards
        reviews={allReviews.length > 0 ? allReviews : reviews}
        selectedStatus={statusParam}
        onFilterStatus={(st) => setStatus(st || "ALL")}
        isLoading={isLoading}
      />

      {/* 3. Filter Bar (Rule 03) */}
      <ReviewFilters
        search={search}
        onSearchChange={setSearch}
        cycleId={cycleIdParam}
        onCycleChange={setCycleId}
        departmentId={departmentIdParam}
        onDepartmentChange={setDepartmentId}
        status={statusParam}
        onStatusChange={setStatus}
        cycles={cycles.map((c) => ({ id: c.id, name: c.name }))}
        departments={departments}
        onReset={resetFilters}
      />

      {/* 4. Table (Rule 04) */}
      <ReviewTable
        items={reviews}
        isLoading={isLoading}
        page={page}
        size={size}
      />

      {/* 5. Phân trang */}
      {pagination && pagination.pages > 1 && (
        <DataPagination
          pagination={pagination}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setSize}
        />
      )}

      {/* 6. Initialize Dialog */}
      <InitializeReviewsDialog
        open={initDialogOpen}
        onOpenChange={setInitDialogOpen}
        cycles={cycles}
        defaultCycleId={cycleId}
        employees={employees}
        onSubmit={handleInitialize}
        isLoading={isInitializing}
      />
    </div>
  );
}
