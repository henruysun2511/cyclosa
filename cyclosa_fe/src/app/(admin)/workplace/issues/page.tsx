"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetIssuesQuery,
  useStartIssueMutation,
  useResolveIssueMutation,
  useWorkplaceFilters,
  WorkplaceStatsCards,
  WorkplaceFilters,
  WorkplaceIssueTable,
  IssueResolveDialog,
  type WorkplaceIssue,
} from "@/features/workplace";

export default function WorkplaceIssuesPage() {
  const router = useRouter();

  const {
    search,
    debouncedSearch,
    floorId,
    status,
    statusParam,
    page,
    size,
    setSearch,
    setStatus,
    setPage,
    resetFilters,
  } = useWorkplaceFilters();

  const [selectedIssueForResolve, setSelectedIssueForResolve] = useState<WorkplaceIssue | null>(null);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

  const {
    data: issuesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetIssuesQuery({
    floorId: floorId || undefined,
    status: status || undefined,
    search: debouncedSearch.trim() || undefined,
    page,
    size,
  });

  const [startIssue] = useStartIssueMutation();
  const [resolveIssue, { isLoading: isResolving }] = useResolveIssueMutation();

  const issues = issuesData?.items || [];
  const pagination = issuesData?.pagination;
  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.pages || 1;

  const handleViewDetail = (id: string) => {
    router.push(`/workplace/issues/${id}`);
  };

  const handleAssign = (issue: WorkplaceIssue) => {
    router.push(`/workplace/issues/${issue.id}`);
  };

  const handleStart = async (issueId: string) => {
    try {
      await startIssue(issueId).unwrap();
      toast.success("Đã tiếp nhận và bắt đầu xử lý sự cố!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật tiến trình xử lý sự cố.");
    }
  };

  const handleOpenResolve = (issue: WorkplaceIssue) => {
    setSelectedIssueForResolve(issue);
    setIsResolveDialogOpen(true);
  };

  const handleConfirmResolve = async (issueId: string, resolutionNote: string) => {
    try {
      await resolveIssue({ issueId, resolutionNote }).unwrap();
      toast.success("Nghiệm thu và đóng hồ sơ sự cố thành công!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể nghiệm thu sự cố.");
      throw err;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý & Điều phối Sự cố Kỹ thuật</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Sự cố kỹ thuật</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={() => router.push("/workplace/issues/new")}
            className="h-9 gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Báo cáo sự cố mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê chuẩn Rule 03 */}
      <WorkplaceStatsCards
        openIssues={totalItems}
        selectedKey={statusParam}
        onFilterKey={(k) => setStatus(k === "ALL" ? "" : k)}
        isLoading={isLoading}
      />

      {/* 3. Thanh Lọc 2 hàng chuẩn Rule 03 */}
      <WorkplaceFilters
        search={search}
        onSearchChange={setSearch}
        status={statusParam}
        onStatusChange={setStatus}
        onReset={resetFilters}
        showIssueFilters
      />

      {/* 4. Bảng Dữ liệu Chuẩn Rule 04 (Table-Embedded Empty State) */}
      <WorkplaceIssueTable
        issues={issues}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onViewDetail={handleViewDetail}
        onAssign={handleAssign}
        onStart={handleStart}
        onResolve={handleOpenResolve}
      />

      {/* 5. Dialog Nghiệm thu Sự cố Chuẩn Rule 05 */}
      <IssueResolveDialog
        open={isResolveDialogOpen}
        onOpenChange={setIsResolveDialogOpen}
        issue={selectedIssueForResolve}
        onSubmit={handleConfirmResolve}
        isLoading={isResolving}
      />
    </div>
  );
}
