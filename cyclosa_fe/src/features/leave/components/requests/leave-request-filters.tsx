"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Filter, Layers, Calendar } from "lucide-react";
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
import { LEAVE_STATUS_OPTIONS } from "../../constants/leave.constants";
import type {
  LeaveTypeDto,
  LeaveRequestStatus,
} from "../../types/leave.types";

interface LeaveRequestFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: LeaveRequestStatus | "ALL";
  onStatusChange: (val: string) => void;
  leaveTypeId: string;
  onLeaveTypeIdChange: (val: string) => void;
  from: string;
  to: string;
  onDateRangeChange: (from: string | null, to: string | null) => void;
  leaveTypes: LeaveTypeDto[];
  onReset: () => void;
}

export function LeaveRequestFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  leaveTypeId,
  onLeaveTypeIdChange,
  from,
  to,
  onDateRangeChange,
  leaveTypes,
  onReset,
}: LeaveRequestFiltersProps) {
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

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã NV, tên nhân viên hoặc lý do xin nghỉ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc các dropdown & Khoảng thời gian */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Trạng thái đơn */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select
            value={status || "ALL"}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loại nghỉ phép */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
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
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Khoảng ngày nghỉ */}
        <div className="flex items-center gap-1.5 min-w-[280px]">
          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Từ ngày:</span>
          <Input
            type="date"
            value={from}
            onChange={(e) => onDateRangeChange(e.target.value || null, to || null)}
            className="w-[125px] h-8 text-xs bg-background"
          />
          <span className="text-xs text-muted-foreground shrink-0">đến:</span>
          <Input
            type="date"
            value={to}
            onChange={(e) => onDateRangeChange(from || null, e.target.value || null)}
            className="w-[125px] h-8 text-xs bg-background"
          />
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
