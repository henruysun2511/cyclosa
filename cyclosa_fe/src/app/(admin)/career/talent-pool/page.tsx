"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, RefreshCw, Grid, List, Star, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetTalentPoolQuery,
  useGetNineBoxGridQuery,
  useAddTalentPoolEntryMutation,
  useRemoveTalentPoolEntryMutation,
  useTalentPoolFilters,
  TalentPoolFilters,
  TalentPoolTable,
  NineBoxGridView,
  AddTalentDialog,
  type TalentPoolItem,
  type AddTalentPoolFormValues,
} from "@/features/career";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";

export default function TalentPoolPage() {
  const [activeTab, setActiveTab] = useState<string>("grid");
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    filters,
    setSearch,
    setDepartmentId,
    setTag,
    setPage,
    setSize,
    resetFilters,
  } = useTalentPoolFilters();

  const {
    data: talentPoolData,
    isLoading: isPoolLoading,
    isFetching: isPoolFetching,
    refetch: refetchPool,
  } = useGetTalentPoolQuery({
    page: filters.page - 1,
    size: filters.size,
    departmentId: filters.departmentId === "ALL" ? undefined : filters.departmentId,
    tag: filters.tag,
  });

  const {
    data: nineBoxData,
    isLoading: isGridLoading,
    isFetching: isGridFetching,
    refetch: refetchGrid,
  } = useGetNineBoxGridQuery();

  const { data: departmentsData } = useGetDepartmentsQuery({ size: 100 });
  const { data: employeesData } = useGetEmployeesQuery({ size: 100 });

  const [addTalentPoolEntry, { isLoading: isAdding }] = useAddTalentPoolEntryMutation();
  const [removeTalentPoolEntry] = useRemoveTalentPoolEntryMutation();

  const isRefreshing = isPoolFetching || isGridFetching;

  const departmentsList = (departmentsData?.items || []).map((d: any) => ({
    id: d.id,
    name: d.name || d.code,
  }));

  const employeesList = (employeesData?.items || []).map((e: any) => ({
    id: e.id,
    fullName: e.fullName || `${e.lastName} ${e.firstName}`,
    employeeCode: e.employeeCode,
  }));

  const poolItems = talentPoolData?.items || [];
  const filteredItems = poolItems.filter((item) => {
    if (!filters.debouncedSearch) return true;
    const s = filters.debouncedSearch.toLowerCase();
    return (
      item.employeeName?.toLowerCase().includes(s) ||
      item.employeeCode?.toLowerCase().includes(s) ||
      item.reason?.toLowerCase().includes(s) ||
      item.departmentName?.toLowerCase().includes(s)
    );
  });

  // KPI Calculations
  const totalTalents = talentPoolData?.pagination?.total ?? poolItems.length;
  const hipoCount = poolItems.filter((i) => i.tag === "HI_PO").length;
  const topTalentCount = poolItems.filter((i) => i.tag === "TOP_TALENT" || i.tag === "CRITICAL_SKILL").length;
  const gridMappedCount = nineBoxData?.cells
    ? Object.values(nineBoxData.cells).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0)
    : totalTalents;

  const handleRemove = async (item: TalentPoolItem) => {
    if (confirm(`Bạn có chắc chắn muốn thu hồi thẻ nhân tài của nhân sự "${item.employeeName}"?`)) {
      try {
        await removeTalentPoolEntry(item.id).unwrap();
        toast.success(`Đã thu hồi thẻ nhân tài của "${item.employeeName}" thành công!`);
      } catch (err) {
        showApiErrorToast(err, "Không thể thu hồi thẻ nhân tài. Vui lòng thử lại!");
      }
    }
  };

  const handleDialogSubmit = async (values: AddTalentPoolFormValues) => {
    try {
      await addTalentPoolEntry({
        employeeId: values.employeeId,
        tag: values.tag,
        reason: values.reason,
      }).unwrap();
      toast.success("Gắn thẻ nhân tài thành công!");
      setDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể gắn thẻ nhân tài. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Rule 02: Header trang & Breadcrumbs chuẩn 100% */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Sparkles className="w-6 h-6 text-primary shrink-0" />
            <span>Kho nhân tài & Ma trận 9 ô</span>
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
            <span className="text-foreground font-medium">Kho nhân tài & 9-Box</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchPool();
              refetchGrid();
            }}
            disabled={isRefreshing}
            className="h-8 text-xs gap-1.5 border-border hover:bg-muted font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gắn thẻ nhân tài</span>
          </Button>
        </div>
      </div>

      {/* Rule 03: 4 Thẻ KPI Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng nhân tài nội bộ */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Tổng nhân tài nội bộ</p>
            <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{totalTalents}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Kho nhân sự then chốt</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs shrink-0 z-10">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Hi-Po (Tiềm năng cao) */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Hi-Po (Tiềm năng cao)</p>
            <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{hipoCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Lãnh đạo tương lai</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shrink-0 z-10">
            <Zap className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Top Talent & Core Skilled */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Chuyên gia cốt lõi</p>
            <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{topTalentCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Năng lực vượt trội</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0 z-10">
            <Star className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Đã định vị trên 9-Box */}
        <div className="relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/20 transition-all duration-200">
          <div className="space-y-1 z-10">
            <p className="text-xs font-medium text-muted-foreground">Định vị ma trận 9 ô</p>
            <p className="text-2xl font-bold tracking-tight text-foreground font-mono">{gridMappedCount}</p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Đánh giá Hiệu suất & Tiềm năng</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0 z-10">
            <Grid className="h-6 w-6" />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/70 p-1">
          <TabsTrigger value="grid" className="flex items-center gap-1.5 text-xs">
            <Grid className="h-3.5 w-3.5" />
            <span>Ma trận 9-Box Grid</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1.5 text-xs">
            <List className="h-3.5 w-3.5" />
            <span>Danh sách nhân tài nội bộ</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="m-0">
          <NineBoxGridView
            gridData={nineBoxData}
            isLoading={isGridLoading}
          />
        </TabsContent>

        <TabsContent value="list" className="space-y-4 m-0">
          <TalentPoolFilters
            search={filters.search}
            tag={filters.tag}
            departmentId={filters.departmentId}
            departments={departmentsList}
            onSearchChange={setSearch}
            onTagChange={setTag}
            onDepartmentChange={setDepartmentId}
            onReset={resetFilters}
          />

          <TalentPoolTable
            items={filteredItems}
            page={filters.page}
            pageSize={filters.size}
            isLoading={isPoolLoading}
            onRemove={handleRemove}
          />

          {talentPoolData && (
            <DataPagination
              pagination={talentPoolData.pagination}
              onPageChange={setPage}
              onPageSizeChange={setSize}
            />
          )}
        </TabsContent>
      </Tabs>

      <AddTalentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employees={employeesList}
        onSubmit={handleDialogSubmit}
        isSubmitting={isAdding}
      />
    </div>
  );
}
