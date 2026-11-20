"useclient";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { ShiftAssignmentFilter, ShiftResponse } from "../../types/attendance.types";

interface AssignmentFiltersProps {
  filters: ShiftAssignmentFilter;
  shifts?: ShiftResponse[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onShiftChange: (shiftId: string | undefined) => void;
  onReset: () => void;
}

export function AssignmentFilters({
  filters,
  shifts = [],
  onYearChange,
  onMonthChange,
  onShiftChange,
  onReset,
}: AssignmentFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Chọn Tháng */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Tháng:</span>
          <Select
            value={String(filters.month || new Date().getMonth() + 1)}
            onValueChange={(val) => val && onMonthChange(Number(val))}
          >
            <SelectTrigger className="w-[110px] h-9">
              <SelectValue placeholder="Chọn tháng" />
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

        {/* Chọn Năm */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Năm:</span>
          <Select
            value={String(filters.year || currentYear)}
            onValueChange={(val) => val && onYearChange(Number(val))}
          >
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="Chọn năm" />
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

        {/* Lọc theo Ca làm việc */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Ca làm việc:</span>
          <Select
            value={filters.shiftId || "ALL"}
            onValueChange={(val) => onShiftChange(!val || val === "ALL" ? undefined : val)}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tất cả ca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả ca</SelectItem>
              {shifts.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.shiftName} ({s.shiftCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="h-9 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
        Đặt lại bộ lọc
      </Button>
    </div>
  );
}

