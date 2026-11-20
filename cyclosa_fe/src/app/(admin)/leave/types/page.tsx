"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays } from "lucide-react";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { LeaveTypeFilters } from "@/features/leave/components/types/leave-type-filters";
import { LeaveTypeTable } from "@/features/leave/components/types/leave-type-table";
import { LeaveTypeDialog } from "@/features/leave/components/types/leave-type-dialog";
import { useLeaveTypeFilters } from "@/features/leave/hooks/use-leave-type-filters";
import {
  useGetLeaveTypesQuery,
  useDeleteLeaveTypeMutation,
} from "@/features/leave/api/leave-api";
import type { LeaveTypeDto } from "@/features/leave/types/leave.types";
import { toast } from "sonner";

export default function LeaveTypesPage() {
  const {
    search,
    debouncedSearch,
    leaveGroup,
    payer,
    isActive,
    page,
    size,
    setSearch,
    setLeaveGroup,
    setPayer,
    setIsActive,
    setPage,
    resetFilters,
  } = useLeaveTypeFilters();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<LeaveTypeDto | null>(null);

  const { data, isLoading } = useGetLeaveTypesQuery({
    keyword: debouncedSearch || undefined,
    leaveGroup,
    payer,
    isActive,
    page,
    size,
  });

  const [deleteLeaveType] = useDeleteLeaveTypeMutation();

  const handleCreate = () => {
    setSelectedType(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: LeaveTypeDto) => {
    setSelectedType(item);
    setDialogOpen(true);
  };

  const handleDelete = async (item: LeaveTypeDto) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa loại nghỉ "${item.name}"?`)) return;

    try {
      await deleteLeaveType(item.id).unwrap();
      toast.success("Xóa loại nghỉ phép thành công");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể xóa loại nghỉ đang được sử dụng";
      toast.error(msg);
    }
  };

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Danh mục loại nghỉ phép"
        breadcrumb="Loại nghỉ phép"
        icon={CalendarDays}
      >
        <Button onClick={handleCreate} className="gap-2 shadow-xs cursor-pointer">
          <Plus className="h-4 w-4" />
          Thêm loại nghỉ mới
        </Button>
      </LeavePageHeader>

      <LeaveTypeFilters
        search={search}
        onSearchChange={setSearch}
        leaveGroup={leaveGroup}
        onLeaveGroupChange={setLeaveGroup}
        payer={payer}
        onPayerChange={setPayer}
        isActive={isActive}
        onIsActiveChange={setIsActive}
        onReset={resetFilters}
      />

      <LeaveTypeTable
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

      <LeaveTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leaveType={selectedType}
      />
    </div>
  );
}

