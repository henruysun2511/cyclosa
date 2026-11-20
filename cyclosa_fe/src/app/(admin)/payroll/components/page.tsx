"use client";

import { useState } from "react";
import { SlidersHorizontal, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayrollPageHeader } from "@/features/payroll/components/shared/payroll-page-header";
import { SalaryComponentList } from "@/features/payroll/components/components/salary-component-list";
import { useGetSalaryComponentsQuery } from "@/features/payroll/api/payroll-api";

export default function SalaryComponentsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { isFetching, refetch } = useGetSalaryComponentsQuery();

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn Rule 02 */}
      <PayrollPageHeader
        title="Cấu phần lương & Phụ cấp"
        icon={SlidersHorizontal}
        breadcrumb="Cấu phần & Phụ cấp"
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
              <span>Thêm cấu phần mới</span>
            </Button>
          </>
        }
      />

      {/* 2. Danh sách cấu phần lương kèm Bộ lọc 2 hàng & Bảng dữ liệu */}
      <SalaryComponentList
        formOpen={formOpen}
        onFormOpenChange={setFormOpen}
      />
    </div>
  );
}
