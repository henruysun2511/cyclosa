"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, RotateCcw } from "lucide-react";

interface ShiftFiltersProps {
  search: string;
  isActive: string;
  isNightShift: string;
  onSearchChange: (val: string) => void;
  onIsActiveChange: (val: string) => void;
  onIsNightShiftChange: (val: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ShiftFilters({
  search,
  isActive,
  isNightShift,
  onSearchChange,
  onIsActiveChange,
  onIsNightShiftChange,
  onReset,
  hasActiveFilters,
}: ShiftFiltersProps) {
  return (
    <div className="space-y-3 bg-card p-3 rounded-lg border shadow-xs">
      {/* Hàng 1: Ô tìm kiếm toàn văn */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã ca, tên ca làm việc..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 h-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hàng 2: Dropdowns lọc & Nút reset */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={isActive} onValueChange={(val) => val && onIsActiveChange(val)}>
          <SelectTrigger className="w-[170px] h-8 text-xs">
            <SelectValue placeholder="Trạng thái ca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="true">Đang kích hoạt</SelectItem>
            <SelectItem value="false">Ngừng kích hoạt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={isNightShift} onValueChange={(val) => val && onIsNightShiftChange(val)}>
          <SelectTrigger className="w-[160px] h-8 text-xs">
            <SelectValue placeholder="Phân loại ca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả phân loại</SelectItem>
            <SelectItem value="false">Ca ngày chuẩn</SelectItem>
            <SelectItem value="true">Ca làm qua đêm</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}

