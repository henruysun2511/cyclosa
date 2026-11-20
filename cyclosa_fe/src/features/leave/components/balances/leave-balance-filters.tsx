"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Calendar, Layers } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeaveTypeDto } from "../../types/leave.types";

interface LeaveBalanceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  year: number;
  onYearChange: (val: number) => void;
  leaveTypeId: string;
  onLeaveTypeIdChange: (val: string) => void;
  leaveTypes: LeaveTypeDto[];
  onReset: () => void;
}

export function LeaveBalanceFilters({
  search,
  onSearchChange,
  year,
  onYearChange,
  leaveTypeId,
  onLeaveTypeIdChange,
  leaveTypes,
  onReset,
}: LeaveBalanceFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  const debouncedSearchChange = useDebouncedCallback((val: string) => {
    onSearchChange(val);
  }, 350);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearchChange(val);
  };

  const handleReset = () => {
    setSearchTerm("");
    onReset();
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã hoặc họ tên nhân viên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc các dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Năm */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Năm:</span>
          <Select
            value={year.toString()}
            onValueChange={(val) => {
              if (val) onYearChange(parseInt(val, 10));
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  Năm {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loại nghỉ */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
          <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Loại nghỉ:</span>
          <Select
            value={leaveTypeId || "ALL"}
            onValueChange={(val) => onLeaveTypeIdChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả loại nghỉ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại nghỉ</SelectItem>
              {leaveTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nút Đặt lại */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  );
}
