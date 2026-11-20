"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetTransfersQuery,
  useGetTransferStatisticsQuery,
  useSubmitTransferMutation,
  useApplyTransferMutation,
  useReturnTemporaryTransferMutation,
  useDeleteTransferMutation,
  useTransferFilters,
  TransferStatsCards,
  TransferFilters,
  TransferTable,
  TransferFormDialog,
  ApproveTransferDialog,
  RejectTransferDialog,
  ExtendTransferDialog,
} from "@/features/transfer";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { DataPagination } from "@/components/common/data-pagination";

export default function TransfersPage() {
  const router = useRouter();
  const { can } = usePermission();
  const canManage = can("transfer.manage") || can("transfer.create");
  const canApprove = can("transfer.approve") || can("transfer.manage");

  // Filter States đồng bộ URL Search Params theo Rule 06
  const {
    keyword,
    debouncedKeyword,
    transferType,
    status,
    departmentId,
    page,
    size,
    hasActiveFilters,
    setKeyword,
    setTransferType,
    setStatus,
    setDepartmentId,
    setPage,
    setSize,
    resetFilters,
  } = useTransferFilters();

  // Queries & Mutations
  const { data: statsData, isLoading: isStatsLoading } = useGetTransferStatisticsQuery();
  const { data: deptsData } = useGetDepartmentsQuery({ size: 200 });
  const departments = deptsData?.items || [];

  const {
    data: transfersData,
    isLoading: isTableLoading,
    isFetching,
    refetch,
  } = useGetTransfersQuery({
    keyword: debouncedKeyword || undefined,
    transferType: transferType !== "ALL" ? transferType : undefined,
    status: status !== "ALL" ? status : undefined,
    departmentId: departmentId !== "ALL" ? departmentId : undefined,
    page,
    size,
  });

  const [submitTransfer] = useSubmitTransferMutation();
  const [applyTransfer] = useApplyTransferMutation();
  const [returnTransfer] = useReturnTemporaryTransferMutation();
  const [deleteTransfer] = useDeleteTransferMutation();

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);

  const items = transfersData?.data?.items || [];
  const pagination = transfersData?.data?.pagination;

  const handleViewDetail = (id: string) => {
    router.push(`/transfers/${id}`);
  };

  const handleSubmit = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn trình phê duyệt phiếu điều chuyển này?")) {
      try {
        await submitTransfer(id).unwrap();
        toast.success("Đã trình phê duyệt phiếu điều chuyển sang Workflow");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể trình phê duyệt");
      }
    }
  };

  const handleApply = async (id: string) => {
    if (
      confirm(
        "Xác nhận áp dụng quyết định điều chuyển vào hồ sơ nhân sự? Thông tin công tác mới sẽ có hiệu lực ngay lập tức."
      )
    ) {
      try {
        await applyTransfer(id).unwrap();
        toast.success("Đã áp dụng quyết định điều chuyển vào hồ sơ nhân sự thành công");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể áp dụng quyết định điều chuyển");
      }
    }
  };

  const handleReturn = async (id: string) => {
    if (
      confirm(
        "Xác nhận thực hiện điều chuyển hồi hương nhân sự về lại đơn vị công tác ban đầu?"
      )
    ) {
      try {
        await returnTransfer(id).unwrap();
        toast.success("Đã điều chuyển nhân sự hồi hương về đơn vị ban đầu thành công");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể thực hiện điều chuyển hồi hương");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn phiếu điều chuyển này?")) {
      try {
        await deleteTransfer(id).unwrap();
        toast.success("Đã xóa phiếu điều chuyển");
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể xóa phiếu điều chuyển");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Breadcrumbs chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ArrowLeftRight className="w-6 h-6 text-primary shrink-0" />
            <span>Điều chuyển nhân sự</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/employees" className="hover:text-primary transition-colors">
              Hồ sơ nhân sự
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Điều chuyển nhân sự</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
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

          {canManage && (
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="h-8 text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lập phiếu điều chuyển</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thẻ Thống kê KPI 4 cột theo Rule 03 (Icon Box + Sparkline + Click Filter) */}
      <TransferStatsCards
        stats={statsData?.data}
        selectedFilter={
          status !== "ALL"
            ? status
            : transferType === "TEMPORARY_DISPATCH"
            ? "TEMPORARY_DISPATCH"
            : undefined
        }
        onFilterSelect={(st) => {
          if (!st || st === "ALL") {
            setStatus("ALL");
            setTransferType("ALL");
          } else if (st === "TEMPORARY_DISPATCH") {
            setTransferType("TEMPORARY_DISPATCH");
            setStatus("ALL");
          } else {
            setStatus(st);
            setTransferType("ALL");
          }
        }}
        isLoading={isStatsLoading}
      />

      {/* 3. Thanh Bộ lọc 2 hàng theo Rule 03 */}
      <TransferFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        transferType={transferType}
        onTransferTypeChange={setTransferType}
        status={status}
        onStatusChange={setStatus}
        departmentId={departmentId}
        onDepartmentIdChange={setDepartmentId}
        onReset={resetFilters}
        departments={departments}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn theo Rule 04 (Có STT + Embedded Empty State) */}
      <div className="space-y-4">
        <TransferTable
          items={items}
          isLoading={isTableLoading}
          page={page}
          size={size}
          onViewDetail={handleViewDetail}
          onSubmit={handleSubmit}
          onApprove={(id) => {
            setSelectedTransferId(id);
            setApproveDialogOpen(true);
          }}
          onReject={(id) => {
            setSelectedTransferId(id);
            setRejectDialogOpen(true);
          }}
          onApply={handleApply}
          onExtend={(id) => {
            setSelectedTransferId(id);
            setExtendDialogOpen(true);
          }}
          onReturn={handleReturn}
          onDelete={handleDelete}
          canManage={canManage}
          canApprove={canApprove}
        />

        {/* 5. Phân trang Chuẩn Rule 04 sử dụng DataPagination */}
        <DataPagination
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={setSize}
        />
      </div>

      {/* Dialogs */}
      <TransferFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <ApproveTransferDialog
        transferId={selectedTransferId}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
      />

      <RejectTransferDialog
        transferId={selectedTransferId}
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      />

      <ExtendTransferDialog
        transferId={selectedTransferId}
        open={extendDialogOpen}
        onOpenChange={setExtendDialogOpen}
      />
    </div>
  );
}
