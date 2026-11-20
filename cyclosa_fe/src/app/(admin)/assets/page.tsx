"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Tags,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetAssetsQuery,
  useGetAssetStatisticsQuery,
  useGetAssetCategoriesQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useDeleteAssetMutation,
  useAssignAssetMutation,
  useReturnAssetMutation,
} from "@/features/asset/api/asset-api";
import { useAssetFilters } from "@/features/asset/hooks/use-asset-filters";
import { AssetStatsCards } from "@/features/asset/components/asset-stats-cards";
import { AssetFilters } from "@/features/asset/components/asset-filters";
import { AssetTable } from "@/features/asset/components/asset-table";
import { AssetFormDialog } from "@/features/asset/components/asset-form-dialog";
import { AssignAssetDialog } from "@/features/asset/components/assign-asset-dialog";
import { ReturnAssetDialog } from "@/features/asset/components/return-asset-dialog";
import { AssetCategoryDialog } from "@/features/asset/components/asset-category-dialog";
import type {
  AssetSummary,
  AssetDetail,
  AssetStatus,
} from "@/features/asset/types/asset.types";
import type {
  AssetFormValues,
  AssignAssetFormValues,
  ReturnAssetFormValues,
} from "@/features/asset/schemas/asset.schema";

export default function AssetsPage() {
  const {
    filters,
    queryParams,
    setSearch,
    setCategoryId,
    setStatus,
    setConditionStatus,
    setPage,
    setPageSize,
    resetFilters,
  } = useAssetFilters();

  // Queries
  const {
    data: assetsData,
    isLoading: isAssetsLoading,
    isFetching: isAssetsFetching,
    refetch,
  } = useGetAssetsQuery(queryParams);

  const { data: statsData, isLoading: isStatsLoading } =
    useGetAssetStatisticsQuery();

  const { data: categoriesData } = useGetAssetCategoriesQuery();
  const categories = categoriesData ?? [];

  // Mutations
  const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAssetMutation();
  const [deleteAsset] = useDeleteAssetMutation();
  const [assignAsset, { isLoading: isAssigning }] = useAssignAssetMutation();
  const [returnAsset, { isLoading: isReturning }] = useReturnAssetMutation();

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<
    AssetSummary | null
  >(null);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAssetForAssign, setSelectedAssetForAssign] =
    useState<AssetSummary | null>(null);

  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedAssetForReturn, setSelectedAssetForReturn] =
    useState<AssetSummary | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Handlers
  const handleOpenCreate = () => {
    setSelectedAssetForEdit(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (asset: AssetSummary) => {
    setSelectedAssetForEdit(asset);
    setFormOpen(true);
  };

  const handleOpenAssign = (asset: AssetSummary) => {
    setSelectedAssetForAssign(asset);
    setAssignDialogOpen(true);
  };

  const handleOpenReturn = (asset: AssetSummary) => {
    setSelectedAssetForReturn(asset);
    setReturnDialogOpen(true);
  };

  const handleDelete = async (asset: AssetSummary) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa tài sản "${asset.name}" (${asset.assetCode}) khỏi hệ thống?`
      )
    ) {
      try {
        await deleteAsset(asset.id).unwrap();
        toast.success(`Đã xóa tài sản "${asset.name}" thành công!`);
      } catch (err) {
        showApiErrorToast(err, "Không thể xóa tài sản. Vui lòng thử lại!");
      }
    }
  };

  const handleFormSubmit = async (values: AssetFormValues) => {
    try {
      if (selectedAssetForEdit) {
        await updateAsset({
          id: selectedAssetForEdit.id,
          body: values,
        }).unwrap();
        toast.success("Cập nhật thông tin tài sản thành công!");
      } else {
        await createAsset(values as any).unwrap();
        toast.success("Thêm mới tài sản thành công!");
      }
      setFormOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể lưu thông tin tài sản. Vui lòng kiểm tra lại!");
    }
  };

  const handleAssignSubmit = async (values: AssignAssetFormValues) => {
    if (!selectedAssetForAssign) return;
    try {
      await assignAsset({
        assetId: selectedAssetForAssign.id,
        body: values,
      }).unwrap();
      toast.success("Cấp phát tài sản cho nhân viên thành công!");
      setAssignDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể cấp phát tài sản. Vui lòng thử lại!");
    }
  };

  const handleReturnSubmit = async (values: ReturnAssetFormValues) => {
    if (!selectedAssetForReturn) return;
    try {
      // Find assignmentId
      const assignmentId = (selectedAssetForReturn as any).currentAssignmentId;
      await returnAsset({
        assignmentId:
          assignmentId ||
          (selectedAssetForReturn as any).currentAssignmentId ||
          selectedAssetForReturn.id,
        assetId: selectedAssetForReturn.id,
        body: values,
      }).unwrap();
      toast.success("Thu hồi tài sản thành công!");
      setReturnDialogOpen(false);
    } catch (err) {
      showApiErrorToast(err, "Không thể thu hồi tài sản. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Rule 02: Header trang & Breadcrumbs chuẩn 100% */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Package className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý tài sản</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Quản lý tài sản</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isAssetsFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isAssetsFetching ? "animate-spin" : ""
              }`}
            />
            <span>Làm mới</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCategoryDialogOpen(true)}
            className="h-9 gap-1.5"
          >
            <Tags className="w-4 h-4 text-primary" />
            <span>Loại tài sản</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="h-9 gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nhập tài sản mới</span>
          </Button>
        </div>
      </div>

      {/* Rule 03: KPI Stats Cards */}
      <AssetStatsCards
        stats={statsData}
        selectedFilter={filters.status}
        onFilterSelect={(statusKey) =>
          setStatus((statusKey as AssetStatus | "ALL") || "ALL")
        }
        isLoading={isStatsLoading}
      />

      {/* Rule 03: Filter Bar 2 hàng */}
      <AssetFilters
        search={filters.search}
        categoryId={filters.categoryId}
        status={filters.status}
        conditionStatus={filters.conditionStatus}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
        onStatusChange={setStatus}
        onConditionChange={setConditionStatus}
        onReset={resetFilters}
      />

      {/* Rule 04: Table & Empty state */}
      <AssetTable
        assets={assetsData?.items ?? []}
        page={filters.page}
        size={filters.size}
        isLoading={isAssetsLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onAssign={handleOpenAssign}
        onReturn={handleOpenReturn}
      />

      {/* Rule 04: DataPagination */}
      {assetsData?.pagination && (
        <DataPagination
          pagination={assetsData.pagination}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Rule 05: Single Form Dialog */}
      <AssetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        asset={selectedAssetForEdit}
        categories={categories}
        onSubmit={handleFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      {/* Dialog Cấp phát máy */}
      <AssignAssetDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        asset={selectedAssetForAssign}
        onSubmit={handleAssignSubmit}
        isLoading={isAssigning}
      />

      {/* Dialog Thu hồi máy */}
      <ReturnAssetDialog
        open={returnDialogOpen}
        onOpenChange={setReturnDialogOpen}
        asset={selectedAssetForReturn}
        onSubmit={handleReturnSubmit}
        isLoading={isReturning}
      />

      {/* Dialog Quản lý loại tài sản */}
      <AssetCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
      />
    </div>
  );
}
