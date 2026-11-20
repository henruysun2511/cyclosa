"use client";

import React, { useState } from "react";
import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AttendancePageHeader,
  useShiftAssignmentFilters,
  AssignmentFilters,
  ShiftScheduleMatrix,
  BulkAssignmentDialog,
  useGetShiftAssignmentsQuery,
  useGetShiftsQuery,
} from "@/features/attendance";

export default function ShiftAssignmentsPage() {
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const { filters, setYear, setMonth, setShiftId, resetFilters } = useShiftAssignmentFilters();

  const { data: shiftsData } = useGetShiftsQuery({ activeOnly: true, size: 50 });
  const shifts = shiftsData?.data?.items || [];

  const {
    data: assignmentsData,
    isLoading,
    refetch,
  } = useGetShiftAssignmentsQuery(filters);

  const assignments = assignmentsData?.data || [];

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Lịch phân ca làm việc"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Phân ca làm việc" },
        ]}
        icon={CalendarDays}
        actions={
          <Button onClick={() => setIsBulkDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" />
            Phân ca hàng loạt
          </Button>
        }
      />

      <AssignmentFilters
        filters={filters}
        shifts={shifts}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onShiftChange={setShiftId}
        onReset={resetFilters}
      />

      <ShiftScheduleMatrix
        assignments={assignments}
        year={Number(filters.year) || new Date().getFullYear()}
        month={Number(filters.month) || new Date().getMonth() + 1}
        isLoading={isLoading}
      />

      <BulkAssignmentDialog
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
        shifts={shifts}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

