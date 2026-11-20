"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRightLeft, Users } from "lucide-react";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { LeaveBalanceKpiCards } from "@/features/leave/components/balances/leave-balance-kpi-cards";
import { LeaveBalanceFilters } from "@/features/leave/components/balances/leave-balance-filters";
import { LeaveBalanceTable } from "@/features/leave/components/balances/leave-balance-table";
import { GenerateBalancesDialog } from "@/features/leave/components/balances/generate-balances-dialog";
import { CarryOverDialog } from "@/features/leave/components/balances/carry-over-dialog";
import { useLeaveBalanceFilters } from "@/features/leave/hooks/use-leave-balance-filters";
import {
  useGetLeaveBalancesQuery,
  useRecalculateLeaveBalanceMutation,
  useGetActiveLeaveTypesQuery,
} from "@/features/leave/api/leave-api";
import type { LeaveBalanceDto } from "@/features/leave/types/leave.types";
import { toast } from "sonner";

export default function LeaveBalancesPage() {
  const {
    search,
    debouncedSearch,
    year,
    leaveTypeId,
    page,
    size,
    setSearch,
    setYear,
    setLeaveTypeId,
    setPage,
    resetFilters,
  } = useLeaveBalanceFilters();

  const [generateOpen, setGenerateOpen] = useState(false);
  const [carryOverOpen, setCarryOverOpen] = useState(false);

  const { data: leaveTypesRes } = useGetActiveLeaveTypesQuery();
  const leaveTypes = leaveTypesRes?.data || [];

  const { data, isLoading } = useGetLeaveBalancesQuery({
    keyword: debouncedSearch || undefined,
    year,
    leaveTypeId,
    page,
    size,
  });

  const [recalculate, { isLoading: isRecalculating }] = useRecalculateLeaveBalanceMutation();

  const handleRecalculate = async (item: LeaveBalanceDto) => {
    try {
      await recalculate({
        employeeId: item.employeeId,
        body: {
          year: item.year,
          leaveTypeId: item.leaveTypeId,
        },
      }).unwrap();
      toast.success(`Đã tính lại quỹ phép năm ${item.year} cho ${item.employeeFullName}`);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi tính lại quỹ phép";
      toast.error(msg);
    }
  };

  const items = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Quản lý quỹ phép nhân viên"
        breadcrumb="Quản lý quỹ phép"
        icon={Users}
      >
        <Button
          variant="outline"
          onClick={() => setCarryOverOpen(true)}
          className="gap-2 cursor-pointer shadow-xs"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Chuyển phép tồn
        </Button>
        <Button onClick={() => setGenerateOpen(true)} className="gap-2 cursor-pointer shadow-xs">
          <Sparkles className="h-4 w-4" />
          Cấp quỹ phép năm
        </Button>
      </LeavePageHeader>

      <LeaveBalanceKpiCards items={items} />

      <LeaveBalanceFilters
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        leaveTypeId={leaveTypeId}
        onLeaveTypeIdChange={setLeaveTypeId}
        leaveTypes={leaveTypes}
        onReset={resetFilters}
      />

      <LeaveBalanceTable
        items={items}
        isLoading={isLoading}
        onRecalculate={handleRecalculate}
        isRecalculating={isRecalculating}
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

      <GenerateBalancesDialog
        open={generateOpen}
        onOpenChange={setGenerateOpen}
        defaultYear={year}
      />

      <CarryOverDialog
        open={carryOverOpen}
        onOpenChange={setCarryOverOpen}
        defaultFromYear={year - 1}
      />
    </div>
  );
}

