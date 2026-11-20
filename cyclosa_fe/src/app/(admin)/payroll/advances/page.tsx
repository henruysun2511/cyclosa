"use client";

import { useState } from "react";
import { HandCoins, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollPageHeader } from "@/features/payroll/components/shared/payroll-page-header";
import { AdvanceStatsCards } from "@/features/payroll/components/advances/advance-stats-cards";
import { AdvanceList } from "@/features/payroll/components/advances/advance-list";
import { useGetSalaryAdvancesQuery } from "@/features/payroll/api/payroll-api";

export default function SalaryAdvancesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data, isFetching, refetch } = useGetSalaryAdvancesQuery();
  const advances = data?.data || [];

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn Rule 02 */}
      <PayrollPageHeader
        title="Quản lý tạm ứng lương"
        icon={HandCoins}
        breadcrumb="Quản lý tạm ứng"
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
              <span>Tạo đề nghị tạm ứng</span>
            </Button>
          </>
        }
      />

      {/* 2. Thẻ thống kê KPI chuẩn Rule 03 */}
      <AdvanceStatsCards
        advances={advances}
        selectedStatus={statusFilter}
        onFilterStatus={(st) => setStatusFilter(st || "ALL")}
      />

      {/* 3. Danh sách tạm ứng kèm Bộ lọc 2 hàng & Bảng dữ liệu */}
      <AdvanceList
        formOpen={formOpen}
        onFormOpenChange={setFormOpen}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}
