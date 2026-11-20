"use client";

import React, { useState } from "react";
import { Plus, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AttendancePageHeader,
  useGetTimesheetPeriodsQuery,
} from "@/features/attendance";
import { PeriodTable } from "@/features/attendance/components/periods/period-table";
import { CreatePeriodDialog } from "@/features/attendance/components/periods/create-period-dialog";

export default function TimesheetPeriodsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: periodsData, isLoading, refetch } = useGetTimesheetPeriodsQuery();
  const periods = periodsData?.data?.items || [];

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Kỳ công tháng"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Kỳ công tháng" },
        ]}
        icon={CalendarRange}
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Tạo kỳ công mới
          </Button>
        }
      />

      <PeriodTable periods={periods} isLoading={isLoading} />

      <CreatePeriodDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

