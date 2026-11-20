"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  AttendancePageHeader,
  ShiftStatsCards,
  ShiftFilters,
  ShiftTable,
  ShiftFormDialog,
} from "@/features/attendance";
import {
  useGetShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useToggleShiftActiveMutation,
} from "@/features/attendance/api/attendance-api";
import { useShiftFilters } from "@/features/attendance/hooks/use-shift-filters";
import type { ShiftResponse } from "@/features/attendance/types/attendance.types";
import type { CreateShiftFormData } from "@/features/attendance/schemas/attendance.schema";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ShiftsPage() {
  const { can } = usePermission();
  const canManage = can("attendance.manage") || can("attendance.view");

  // Filters hook sync URL params
  const {
    search,
    isActive,
    isNightShift,
    page,
    setSearch,
    setIsActive,
    setIsNightShift,
    setPage,
    resetFilters,
    hasActiveFilters,
    queryFilters,
  } = useShiftFilters();

  // Queries & Mutations
  const { data, isLoading, isFetching, refetch } = useGetShiftsQuery(queryFilters);
  const { data: allShiftsData } = useGetShiftsQuery({ size: 200 });
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();
  const [deleteShift, { isLoading: isDeleting }] = useDeleteShiftMutation();
  const [toggleActive] = useToggleShiftActiveMutation();

  const shifts = data?.data?.items || [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.pages || 1;
  const totalItems = pagination?.total || shifts.length;

  const allShifts = allShiftsData?.data?.items || shifts;
  const totalShiftElements = allShiftsData?.data?.pagination?.total || totalItems;

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shiftToEdit, setShiftToEdit] = useState<ShiftResponse | null>(null);

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<ShiftResponse | null>(null);

  // Open Create Dialog
  const handleOpenCreate = () => {
    setShiftToEdit(null);
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (shift: ShiftResponse) => {
    setShiftToEdit(shift);
    setDialogOpen(true);
  };

  // Submit Create or Edit Form
  const handleFormSubmit = async (formData: CreateShiftFormData) => {
    let calculatedBreak = 60;
    if (formData.breakStartTime && formData.breakEndTime) {
      const [startH, startM] = formData.breakStartTime.split(":").map(Number);
      const [endH, endM] = formData.breakEndTime.split(":").map(Number);
      const diff = endH * 60 + endM - (startH * 60 + startM);
      if (diff > 0) calculatedBreak = diff;
    }

    try {
      if (shiftToEdit) {
        await updateShift({
          id: shiftToEdit.id,
          body: {
            name: formData.name,
            startTime: formData.startTime,
            endTime: formData.endTime,
            breakStartTime: formData.breakStartTime || undefined,
            breakEndTime: formData.breakEndTime || undefined,
            breakMinutes: calculatedBreak,
            lateGraceMinutes: formData.lateGraceMinutes,
            earlyGraceMinutes: formData.earlyGraceMinutes,
            workCredit: formData.workCredit,
            isActive: formData.isActive,
          },
        }).unwrap();
        toast.success(`Cập nhật ca làm việc "${formData.name}" thành công`);
      } else {
        await createShift({
          code: formData.code,
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
          breakStartTime: formData.breakStartTime || undefined,
          breakEndTime: formData.breakEndTime || undefined,
          breakMinutes: calculatedBreak,
          lateGraceMinutes: formData.lateGraceMinutes,
          earlyGraceMinutes: formData.earlyGraceMinutes,
          workCredit: formData.workCredit,
          isActive: formData.isActive,
        }).unwrap();
        toast.success(`Tạo mới ca làm việc "${formData.name}" thành công`);
      }
      setDialogOpen(false);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi lưu ca làm việc";
      toast.error(errorMsg);
    }
  };

  // Toggle Active
  const handleToggleActive = async (shift: ShiftResponse) => {
    try {
      await toggleActive(shift.id).unwrap();
      toast.success(
        shift.isActive
          ? `Đã ngừng kích hoạt ca "${shift.name}"`
          : `Đã kích hoạt ca "${shift.name}"`
      );
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể thay đổi trạng thái ca";
      toast.error(errorMsg);
    }
  };

  // Open Delete Confirm
  const handleOpenDelete = (shift: ShiftResponse) => {
    setShiftToDelete(shift);
    setDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!shiftToDelete) return;
    try {
      await deleteShift(shiftToDelete.id).unwrap();
      toast.success(`Đã xóa ca làm việc "${shiftToDelete.name}"`);
      setDeleteDialogOpen(false);
      setShiftToDelete(null);
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể xóa ca làm việc (có thể đã được phân cho nhân viên)";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header (Quy chuẩn 02) */}
      <AttendancePageHeader
        title="Danh mục Ca làm việc"
        icon={Clock}
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Ca làm việc" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
            {canManage && (
              <Button size="sm" onClick={handleOpenCreate} className="h-8 text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Thêm ca làm việc
              </Button>
            )}
          </>
        }
      />

      {/* KPI Stats Cards (Quy chuẩn 03) */}
      <ShiftStatsCards
        shifts={allShifts}
        totalElements={totalShiftElements}
        isActive={isActive}
        isNightShift={isNightShift}
        onFilterChange={({ isActive: newActive, isNightShift: newNight }) => {
          if (newActive !== undefined) setIsActive(newActive);
          if (newNight !== undefined) setIsNightShift(newNight);
        }}
        isLoading={isLoading}
      />

      {/* Filter Bar 2 hàng (Quy chuẩn 03) */}
      <ShiftFilters
        search={search}
        isActive={isActive}
        isNightShift={isNightShift}
        onSearchChange={setSearch}
        onIsActiveChange={setIsActive}
        onIsNightShiftChange={setIsNightShift}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Bảng danh sách Ca (Quy chuẩn 04) */}
      <div className="space-y-3">
        <ShiftTable
          shifts={shifts}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onToggleActive={handleToggleActive}
          canManage={canManage}
        />

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
          <div>
            Hiển thị <strong className="text-foreground font-mono">{shifts.length}</strong> /{" "}
            <strong className="text-foreground font-mono">{totalItems}</strong> ca làm việc
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 font-mono text-xs text-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog Thêm / Sửa Ca (Quy chuẩn 05) */}
      <ShiftFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shiftToEdit={shiftToEdit}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa ca làm việc?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa ca <strong>"{shiftToDelete?.name}"</strong> ({shiftToDelete?.code}) khỏi hệ thống.
              Lưu ý: Chỉ ca chưa được phân công cho nhân viên nào mới có thể xóa thành công.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa ca làm việc"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

