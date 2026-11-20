"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GitBranch, Plus, RefreshCw, Network, List, Award, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetCareerPathsQuery,
  useGetCareerGraphQuery,
  useCreateCareerPathMutation,
  useUpdateCareerPathMutation,
  useDeleteCareerPathMutation,
  useCareerPathFilters,
  CareerPathFilters,
  CareerPathTable,
  CareerGraphView,
  CareerPathDialog,
  type CareerPathItem,
  type CareerPathFormValues,
} from "@/features/career";
import { useGetAllJobTitlesQuery } from "@/features/organization/api/job-title-api";

export default function CareerPathsPage() {
  const [activeTab, setActiveTab] = useState<string>("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<CareerPathItem | null>(null);

  const {
    filters,
    setSearch,
    setPage,
    setSize,
    resetFilters,
  } = useCareerPathFilters();

  const {
    data: careerPathsData,
    isLoading: isPathsLoading,
    isFetching: isPathsFetching,
    refetch: refetchPaths,
  } = useGetCareerPathsQuery({
    page: filters.page - 1,
    size: filters.size,
  });

  const {
    data: graphData,
    isLoading: isGraphLoading,
    isFetching: isGraphFetching,
    refetch: refetchGraph,
  } = useGetCareerGraphQuery({});

  const { data: jobTitlesData } = useGetAllJobTitlesQuery();

  const [createCareerPath, { isLoading: isCreating }] = useCreateCareerPathMutation();
  const [updateCareerPath, { isLoading: isUpdating }] = useUpdateCareerPathMutation();
  const [deleteCareerPath] = useDeleteCareerPathMutation();

  const isRefreshing = isPathsFetching || isGraphFetching;

  const jobTitlesList = (jobTitlesData || []).map((jt: any) => ({
    id: jt.id,
    name: jt.name,
    code: jt.code,
  }));

  const allItems = careerPathsData?.items || [];
  const filteredItems = allItems.filter((item) => {
    if (!filters.debouncedSearch) return true;
    const s = filters.debouncedSearch.toLowerCase();
    return (
      item.fromJobTitleName?.toLowerCase().includes(s) ||
      item.fromJobTitleCode?.toLowerCase().includes(s) ||
      item.toJobTitleName?.toLowerCase().includes(s) ||
      item.toJobTitleCode?.toLowerCase().includes(s) ||
      item.requirements?.toLowerCase().includes(s)
    );
  });

  // KPI Metrics
  const totalPaths = careerPathsData?.pagination?.total ?? allItems.length;
  const fastTrackCount = allItems.filter((p) => p.minExperienceYears <= 2).length;
  const uniqueJobTitles = new Set(
    allItems.flatMap((p) => [p.fromJobTitleId, p.toJobTitleId].filter(Boolean))
  ).size;
  const graphConnections = graphData?.edges?.length ?? totalPaths;

  const handleOpenCreate = () => {
    setDialogMode("create");
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: CareerPathItem) => {
    setDialogMode("edit");
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: CareerPathItem) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tuyến thăng tiến từ "${item.fromJobTitleName}" đến "${item.toJobTitleName}"?`)) {
      try {
        await deleteCareerPath(item.id).unwrap();
        toast.success("Xóa tuyến thăng tiến thành công!");
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa tuyến thăng tiến. Vui lòng thử lại!");
      }
    }
  };

  const handleDialogSubmit = async (values: CareerPathFormValues) => {
    try {
      if (dialogMode === "create") {
        await createCareerPath({
          fromJobTitleId: values.fromJobTitleId,
          toJobTitleId: values.toJobTitleId,
          minExperienceYears: values.minExperienceYears,
          requirements: values.requirements,
        }).unwrap();
        toast.success("Tạo mới tuyến thăng tiến thành công!");
      } else if (selectedItem) {
        await updateCareerPath({
          id: selectedItem.id,
          minExperienceYears: values.minExperienceYears,
          requirements: values.requirements,
        }).unwrap();
        toast.success("Cập nhật tuyến thăng tiến thành công!");
      }
      setDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể lưu tuyến thăng tiến. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Rule 02: Header trang & Breadcrumbs chuẩn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <GitBranch className="w-6 h-6 text-primary shrink-0" />
            <span>Lộ trình thăng tiến</span>
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
            <span className="text-foreground font-medium">Lộ trình thăng tiến</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchPaths();
              refetchGraph();
            }}
            disabled={isRefreshing}
            className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tuyến thăng tiến</span>
          </Button>
        </div>
      </div>

      {/* Rule 03: 4 Thẻ KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng tuyến thăng tiến */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Tổng tuyến thăng tiến</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{totalPaths}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Lộ trình đã chuẩn hóa</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shrink-0 z-10">
            <GitBranch className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Thăng tiến nhanh */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Tuyến thăng tiến nhanh</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{fastTrackCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-emerald-600">&le; 2 năm kinh nghiệm</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0 z-10">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Chức danh liên kết */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Chức danh tham gia</p>
            <p className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">{uniqueJobTitles}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-purple-600">Vị trí trong lộ trình</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 shrink-0 z-10">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Mạng lưới kết nối */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Liên kết mạng lưới</p>
            <p className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{graphConnections}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-indigo-600">Nút chuyển dịch đa chiều</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shrink-0 z-10">
            <Network className="h-6 w-6" />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/70 p-1">
          <TabsTrigger value="list" className="flex items-center gap-1.5 text-xs">
            <List className="h-3.5 w-3.5" />
            <span>Danh sách tuyến</span>
          </TabsTrigger>
          <TabsTrigger value="graph" className="flex items-center gap-1.5 text-xs">
            <Network className="h-3.5 w-3.5" />
            <span>Sơ đồ mạng lưới đa chiều</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 m-0">
          <CareerPathFilters
            search={filters.search}
            onSearchChange={setSearch}
            onReset={resetFilters}
          />

          <CareerPathTable
            items={filteredItems}
            page={filters.page}
            pageSize={filters.size}
            isLoading={isPathsLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />

          {careerPathsData && (
            <DataPagination
              pagination={careerPathsData.pagination}
              onPageChange={setPage}
              onPageSizeChange={setSize}
            />
          )}
        </TabsContent>

        <TabsContent value="graph" className="m-0">
          <CareerGraphView
            graphData={graphData}
            isLoading={isGraphLoading}
          />
        </TabsContent>
      </Tabs>

      <CareerPathDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        initialData={selectedItem}
        jobTitles={jobTitlesList}
        onSubmit={handleDialogSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
