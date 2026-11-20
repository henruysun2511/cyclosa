"use client";

import React, { useState, Suspense } from "react";
import { History, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import { RouteGuard } from "@/features/authorization/components/route-guard";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetAuditLogsQuery,
  useAuditFilters,
  AuditFilters,
  AuditDetailDialog,
  AuditExportDialog,
  getAuditColumns,
} from "@/features/audit";
import type { AuditLog } from "@/features/audit";

/**
 * Trang Nhật ký Kiểm toán & Truy vết Hệ thống — Page Container (Quy chuẩn §1.1 & §11.5)
 *
 * - Trực tiếp orchestrate URL Search Params (useAuditFilters)
 * - Trực tiếp gọi RTK Query hooks (useGetAuditLogsQuery)
 * - Trực tiếp quản lý state cấp trang (dialog, selectedLog)
 * - KHÔNG tạo wrapper component trung gian AuditManagementView
 */
export default function AuditLogsPage() {
  // ── State cấp trang ────────────────────────────────────────────────────────
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // ── Hook đồng bộ bộ lọc qua URL Search Params ─────────────────────────────
  const {
    search,
    action,
    entityType,
    from,
    to,
    page,
    size,
    hasActiveFilters,
    isPending,
    handleSearchChange,
    setAction,
    setEntityType,
    setDateRange,
    setPage,
    setSize,
    resetFilters,
    queryParams,
  } = useAuditFilters();

  // ── RTK Query: Danh sách nhật ký kiểm toán ────────────────────────────────
  const {
    data: logsRes,
    isLoading,
    isFetching,
  } = useGetAuditLogsQuery(queryParams);

  const logs = logsRes?.data?.items ?? [];
  const pagination = logsRes?.data?.pagination;

  // ── Handler mở modal chi tiết ──────────────────────────────────────────────
  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  // ── Cột bảng (memoized giữ reference ổn định) ─────────────────────────────
  const columns = React.useMemo(
    () => getAuditColumns({ onViewDetail: handleViewDetail }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <RouteGuard permission={PERMISSIONS.AUDIT.VIEW}>
      <div className="space-y-5">
        {/* ── Header & Breadcrumbs ─────────────────────────────────────────── */}
        <PageHeader
          title="Nhật ký Kiểm toán & Truy vết Hệ thống"
          icon={<History className="h-5 w-5 text-primary" />}
          breadcrumbs={[
            { label: "Hệ thống & Phân quyền" },
            { label: "Nhật ký kiểm toán" },
          ]}
          action={
            <PermissionGuard permission={PERMISSIONS.AUDIT.EXPORT}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setExportDialogOpen(true)}
              >
                <Download className="h-3.5 w-3.5" />
                Xuất file kiểm toán
              </Button>
            </PermissionGuard>
          }
        />

        {/* ── Bộ lọc đa chiều ─────────────────────────────────────────────── */}
        <AuditFilters
          search={search}
          action={action}
          entityType={entityType}
          from={from}
          to={to}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={handleSearchChange}
          onActionChange={setAction}
          onEntityTypeChange={setEntityType}
          onDateRangeChange={setDateRange}
          onReset={resetFilters}
        />

        {/* ── Bảng dữ liệu TanStack Table ─────────────────────────────────── */}
        <div className="space-y-3">
          <DataTable
            columns={columns}
            data={logs}
            isLoading={isLoading || isFetching || isPending}
            skeletonRows={8}
            emptyTitle="Không tìm thấy bản ghi nhật ký kiểm toán"
            emptyDescription={
              hasActiveFilters
                ? "Thử thay đổi điều kiện lọc để tìm kiếm kết quả phù hợp hơn."
                : "Chưa có thao tác nghiệp vụ nào được ghi nhận."
            }
          />

          {/* ── Phân trang ─────────────────────────────────────────────────── */}
          {pagination && pagination.total > 0 && (
            <DataPagination
              pagination={pagination}
              onPageChange={(newPage) => {
                // DataPagination trả về 0-based, useAuditFilters nhận 1-based
                setPage(newPage + 1);
              }}
              onPageSizeChange={setSize}
            />
          )}
        </div>

        {/* ── Dialog Chi tiết & So sánh Diff ──────────────────────────────── */}
        <AuditDetailDialog
          log={selectedLog}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />

        {/* ── Dialog Xuất dữ liệu ─────────────────────────────────────────── */}
        <AuditExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          currentFilters={queryParams}
        />
      </div>
    </RouteGuard>
  );
}

