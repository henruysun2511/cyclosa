"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DailyRecordFilter, DailyAttendanceStatus } from "../../types/attendance.types";

interface DailyRecordFiltersProps {
  filters: DailyRecordFilter;
  onFilterChange: (newFilters: Partial<DailyRecordFilter>) => void;
  onReset: () => void;
}

export function DailyRecordFilters({
  filters,
  onFilterChange,
  onReset,
}: DailyRecordFiltersProps) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Tìm theo mã hoặc tên nhân viên */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã NV hoặc ID..."
            value={filters.employeeId || ""}
            onChange={(e) => onFilterChange({ employeeId: e.target.value || undefined, page: 0 })}
            className="pl-9 h-9"
          />
        </div>

        {/* Lọc theo Ngày */}
        <Input
          type="date"
          value={filters.date || new Date().toISOString().split("T")[0]}
          onChange={(e) => onFilterChange({ date: e.target.value, page: 0 })}
          className="h-9"
        />

        {/* Lọc theo Trạng thái công */}
        <div className="flex items-center gap-2 sm:col-span-2">
          <Select
            value={filters.status || "ALL"}
            onValueChange={(val) =>
              onFilterChange({
                status: val === "ALL" ? undefined : (val as DailyAttendanceStatus),
                page: 0,
              })
            }
          >
            <SelectTrigger className="h-9 flex-1">
              <SelectValue placeholder="Trạng thái công nhật" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="ON_TIME">Đúng giờ (Chuẩn công)</SelectItem>
              <SelectItem value="LATE">Đi muộn</SelectItem>
              <SelectItem value="EARLY">Về sớm</SelectItem>
              <SelectItem value="HALF_DAY">Nửa ngày công</SelectItem>
              <SelectItem value="ABSENT">Vắng mặt không phép</SelectItem>
              <SelectItem value="EXPLAINED">Đã giải trình hợp lệ</SelectItem>
              <SelectItem value="MISSING_OUT">Thiếu quẹt ra</SelectItem>
              <SelectItem value="MISSING_IN">Thiếu quẹt vào</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

