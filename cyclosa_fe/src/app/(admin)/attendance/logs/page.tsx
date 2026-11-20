"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import {
  AttendancePageHeader,
  useGetAllAttendanceLogsQuery,
  type AttendanceLogFilter,
} from "@/features/attendance";
import { AttendanceLogFilters } from "@/features/attendance/components/logs/attendance-log-filters";
import { AttendanceLogTable } from "@/features/attendance/components/logs/attendance-log-table";

export default function AttendanceLogsPage() {
  const [filters, setFilters] = useState<AttendanceLogFilter>({
    page: 0,
    size: 20,
    sortBy: "punchTime",
    sortDir: "desc",
  });

  const { data: logsData, isLoading } = useGetAllAttendanceLogsQuery(filters);

  const handleFilterChange = (newFilters: Partial<AttendanceLogFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      sortBy: "punchTime",
      sortDir: "desc",
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Nhật ký quẹt thẻ"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Nhật ký quẹt thẻ" },
        ]}
        icon={Eye}
      />

      <AttendanceLogFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <AttendanceLogTable
        data={logsData?.data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

