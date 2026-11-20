"use client";

import React, { useState } from "react";
import { TableProperties, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  AttendancePageHeader,
  useGetMonthlySummaryQuery,
  type MonthlyTimesheetSummaryResponse,
} from "@/features/attendance";
import { MonthlySummaryMatrix } from "@/features/attendance/components/monthly/monthly-summary-matrix";

export default function MonthlySummaryPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);

  const { data: summaryData, isLoading } = useGetMonthlySummaryQuery({
    year,
    month,
  });

  const summaries: MonthlyTimesheetSummaryResponse[] = Array.isArray(summaryData?.data)
    ? summaryData.data
    : summaryData?.data
    ? [summaryData.data]
    : [];

  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleExport = () => {
    toast.success(`Đang trích xuất dữ liệu bảng công Tháng ${month}/${year} sang Excel`);
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Bảng công tổng hợp tháng"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Bảng công tổng hợp tháng" },
        ]}
        icon={TableProperties}
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-1.5 h-4 w-4" />
            Xuất Excel
          </Button>
        }
      />

      {/* Bộ lọc Tháng / Năm & Chú thích ký hiệu */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Tháng:
            </span>
            <Select value={String(month)} onValueChange={(val) => setMonth(Number(val))}>
              <SelectTrigger className="w-[110px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    Tháng {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Năm:</span>
            <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    Năm {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chú giải ký hiệu */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">✓</span> Đủ công
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-amber-600 dark:text-amber-400">M</span> Muộn
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-orange-600 dark:text-orange-400">S</span> Sớm
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-blue-600 dark:text-blue-400">½</span> Nửa công
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-rose-600 dark:text-rose-400">V</span> Vắng
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-purple-600 dark:text-purple-400">GT</span> Đã duyệt giải trình
          </span>
        </div>
      </div>

      <MonthlySummaryMatrix
        summaries={summaries}
        year={year}
        month={month}
        isLoading={isLoading}
      />
    </div>
  );
}

