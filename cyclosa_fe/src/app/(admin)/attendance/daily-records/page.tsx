"use client";

import React, { useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import {
  AttendancePageHeader,
  useGetDailyRecordsQuery,
  type DailyRecordFilter,
} from "@/features/attendance";
import { DailyRecordFilters } from "@/features/attendance/components/daily/daily-record-filters";
import { DailyRecordTable } from "@/features/attendance/components/daily/daily-record-table";

export default function DailyRecordsPage() {
  const [filters, setFilters] = useState<DailyRecordFilter>({
    date: new Date().toISOString().split("T")[0],
    page: 0,
    size: 20,
  });

  const { data: recordsData, isLoading } = useGetDailyRecordsQuery(filters);

  const handleFilterChange = (newFilters: Partial<DailyRecordFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters({
      date: new Date().toISOString().split("T")[0],
      page: 0,
      size: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Bảng công nhật"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Bảng công nhật" },
        ]}
        icon={CalendarCheck2}
      />

      <DailyRecordFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <DailyRecordTable
        data={recordsData?.data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

