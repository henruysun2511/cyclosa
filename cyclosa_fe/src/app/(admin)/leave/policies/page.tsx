"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { LeavePolicyFilters } from "@/features/leave/components/policies/leave-policy-filters";
import { LeavePolicyTable } from "@/features/leave/components/policies/leave-policy-table";
import { LeavePolicyDialog } from "@/features/leave/components/policies/leave-policy-dialog";
import { useLeavePolicyFilters } from "@/features/leave/hooks/use-leave-policy-filters";
import {
  useGetLeavePoliciesQuery,
  useDeleteLeavePolicyMutation,
  useGetActiveLeaveTypesQuery,
} from "@/features/leave/api/leave-api";
import type { LeavePolicyDto } from "@/features/leave/types/leave.types";
import { toast } from "sonner";

export default function LeavePoliciesPage() {
  const {
    search,
    debouncedSearch,
    leaveTypeId,
    contractType,
    page,
    size,
    setSearch,
    setLeaveTypeId,
    setContractType,
    setPage,
    resetFilters,
  } = useLeavePolicyFilters();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicyDto | null>(null);

  const { data: leaveTypesRes } = useGetActiveLeaveTypesQuery();
  const leaveTypes = leaveTypesRes?.data || [];

  const { data, isLoading } = useGetLeavePoliciesQuery({
    keyword: debouncedSearch || undefined,
    leaveTypeId,
    contractType,
    page,
    size,
  });

  const [deletePolicy] = useDeleteLeavePolicyMutation();

  const handleCreate = () => {
    setSelectedPolicy(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: LeavePolicyDto) => {
    setSelectedPolicy(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: LeavePolicyDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa chính sách này?`)) return;

    try {
      await deletePolicy(item.id).unwrap();
      toast.success("Xóa chính sách nghỉ phép thành công");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi xóa chính sách";
      toast.error(msg);
    }
  };

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Chính sách nghỉ phép"
        breadcrumb="Chính sách nghỉ phép"
        icon={FileText}
      >
        <Button onClick={handleCreate} className="gap-2 shadow-xs cursor-pointer">
          <Plus className="h-4 w-4" />
          Thêm chính sách mới
        </Button>
      </LeavePageHeader>

      <LeavePolicyFilters
        search={search}
        onSearchChange={setSearch}
        leaveTypeId={leaveTypeId}
        onLeaveTypeIdChange={setLeaveTypeId}
        contractType={contractType}
        onContractTypeChange={setContractType}
        leaveTypes={leaveTypes}
        onReset={resetFilters}
      />

      <LeavePolicyTable
        items={items}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <div>
            Trang {pagination.page + 1} / {pagination.pages} (Tổng số: {pagination.total} bản ghi)
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

      <LeavePolicyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        policy={selectedPolicy}
      />
    </div>
  );
}

