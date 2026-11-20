"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { LeaveRequestFilters } from "@/features/leave/components/requests/leave-request-filters";
import { LeaveRequestTable } from "@/features/leave/components/requests/leave-request-table";
import { RejectDialog } from "@/features/leave/components/requests/reject-dialog";
import { useLeaveRequestFilters } from "@/features/leave/hooks/use-leave-request-filters";
import {
  useGetLeaveRequestsQuery,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useGetActiveLeaveTypesQuery,
} from "@/features/leave/api/leave-api";
import type { LeaveRequestDto } from "@/features/leave/types/leave.types";
import { toast } from "sonner";

export default function LeaveRequestsDirectoryPage() {
  const {
    search,
    debouncedSearch,
    status,
    leaveTypeId,
    from,
    to,
    page,
    size,
    setSearch,
    setStatus,
    setLeaveTypeId,
    setDateRange,
    setPage,
    resetFilters,
  } = useLeaveRequestFilters();

  const [rejectingItem, setRejectingItem] = useState<LeaveRequestDto | null>(null);

  const { data: leaveTypesRes } = useGetActiveLeaveTypesQuery();
  const leaveTypes = leaveTypesRes?.data || [];

  const { data, isLoading } = useGetLeaveRequestsQuery({
    keyword: debouncedSearch || undefined,
    status,
    leaveTypeId,
    from: from || undefined,
    to: to || undefined,
    page,
    size,
  });

  const [approveRequest, { isLoading: isApproving }] = useApproveLeaveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectLeaveRequestMutation();

  const handleApprove = async (item: LeaveRequestDto) => {
    if (!confirm(`Phê duyệt đơn nghỉ phép của ${item.employeeFullName}?`)) return;

    try {
      await approveRequest(item.id).unwrap();
      toast.success("Phê duyệt đơn xin nghỉ phép thành công");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi duyệt đơn";
      toast.error(msg);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingItem) return;

    try {
      await rejectRequest({
        requestId: rejectingItem.id,
        reason,
      }).unwrap();
      toast.success("Đã từ chối đơn xin nghỉ phép");
      setRejectingItem(null);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi từ chối đơn";
      toast.error(msg);
    }
  };

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Quản lý đơn xin nghỉ phép"
        breadcrumb="Đơn xin nghỉ phép"
        icon={Calendar}
      >
        <Button asChild className="gap-2 shadow-xs cursor-pointer">
          <Link href="/leave/requests/new">
            <Plus className="h-4 w-4" />
            Tạo đơn thay nhân viên
          </Link>
        </Button>
      </LeavePageHeader>

      <LeaveRequestFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        leaveTypeId={leaveTypeId}
        onLeaveTypeIdChange={setLeaveTypeId}
        from={from}
        to={to}
        onDateRangeChange={setDateRange}
        leaveTypes={leaveTypes}
        onReset={resetFilters}
      />

      <LeaveRequestTable
        items={items}
        isLoading={isLoading}
        onApprove={handleApprove}
        onReject={(item) => setRejectingItem(item)}
        isProcessing={isApproving || isRejecting}
      />

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <div>
            Trang {pagination.page + 1} / {pagination.pages} (Tổng số: {pagination.total} đơn)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      <RejectDialog
        open={!!rejectingItem}
        onOpenChange={(open) => !open && setRejectingItem(null)}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />
    </div>
  );
}

