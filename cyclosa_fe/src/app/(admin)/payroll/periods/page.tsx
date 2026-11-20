"use client";

import { useState } from "react";
import { Banknote, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollPageHeader } from "@/features/payroll/components/shared/payroll-page-header";
import { PeriodStatsCards } from "@/features/payroll/components/periods/period-stats-cards";
import { PeriodList } from "@/features/payroll/components/periods/period-list";
import { useGetPayrollPeriodsQuery } from "@/features/payroll/api/payroll-api";

export default function PayrollPeriodsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data, isFetching, refetch } = useGetPayrollPeriodsQuery();
  const periods = data?.data || [];

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn Rule 02 */}
      <PayrollPageHeader
        title="Kỳ tính lương"
        icon={Banknote}
        breadcrumb="Kỳ tính lương"
        actions={
          <>
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

            <Button
              size="sm"
              onClick={() => setFormOpen(true)}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mở kỳ lương</span>
            </Button>
          </>
        }
      />

      {/* 2. Thẻ thống kê KPI chuẩn Rule 03 */}
      <PeriodStatsCards
        periods={periods}
        selectedStatus={statusFilter}
        onFilterStatus={(st) => setStatusFilter(st || "ALL")}
      />

      {/* 3. Danh sách kỳ lương kèm Bộ lọc 2 hàng & Bảng dữ liệu */}
      <PeriodList
        formOpen={formOpen}
        onFormOpenChange={setFormOpen}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
