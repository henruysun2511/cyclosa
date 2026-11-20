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
import type { AttendanceLogFilter, AttendanceEventType, VerificationResult } from "../../types/attendance.types";

interface AttendanceLogFiltersProps {
  filters: AttendanceLogFilter;
  onFilterChange: (newFilters: Partial<AttendanceLogFilter>) => void;
  onReset: () => void;
}

export function AttendanceLogFilters({
  filters,
  onFilterChange,
  onReset,
}: AttendanceLogFiltersProps) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Tìm kiếm mã hoặc tên nhân viên */}
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
          value={filters.date || ""}
          onChange={(e) => onFilterChange({ date: e.target.value || undefined, page: 0 })}
          className="h-9"
        />

        {/* Lọc theo Loại sự kiện */}
        <Select
          value={filters.eventType || "ALL"}
          onValueChange={(val) =>
            onFilterChange({
              eventType: val === "ALL" ? undefined : (val as AttendanceEventType),
              page: 0,
            })
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Loại sự kiện (Vào/Ra)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả sự kiện</SelectItem>
            <SelectItem value="CHECK_IN">Vào ca</SelectItem>
            <SelectItem value="CHECK_OUT">Tan ca</SelectItem>
          </SelectContent>
        </Select>

        {/* Lọc theo Kết quả xác thực */}
        <div className="flex items-center gap-2">
          <Select
            value={filters.verificationResult || "ALL"}
            onValueChange={(val) =>
              onFilterChange({
                verificationResult: val === "ALL" ? undefined : (val as VerificationResult),
                page: 0,
              })
            }
          >
            <SelectTrigger className="h-9 flex-1">
              <SelectValue placeholder="Kết quả AI & GPS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả kết quả</SelectItem>
              <SelectItem value="SUCCESS">Thành công (Hợp lệ)</SelectItem>
              <SelectItem value="OUT_OF_RANGE">Ngoài phạm vi Geofence</SelectItem>
              <SelectItem value="FACE_MISMATCH">Không khớp khuôn mặt</SelectItem>
              <SelectItem value="LIVENESS_FAILED">Chống giả mạo thất bại</SelectItem>
              <SelectItem value="LOW_IMAGE_QUALITY">Chất lượng ảnh kém</SelectItem>
              <SelectItem value="NO_FACE_DETECTED">Không tìm thấy mặt</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2 text-muted-foreground hover:text-foreground"
            title="Đặt lại"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

