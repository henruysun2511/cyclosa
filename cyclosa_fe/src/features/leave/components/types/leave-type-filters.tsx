"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Layers, CreditCard, Filter } from "lucide-react";
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
import {
  LEAVE_GROUP_OPTIONS,
  LEAVE_PAYER_OPTIONS,
} from "../../constants/leave.constants";
import type { LeaveGroup, LeavePayer } from "../../types/leave.types";

interface LeaveTypeFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  leaveGroup: LeaveGroup | "ALL";
  onLeaveGroupChange: (val: string) => void;
  payer: LeavePayer | "ALL";
  onPayerChange: (val: string) => void;
  isActive: boolean | undefined;
  onIsActiveChange: (val: string) => void;
  onReset: () => void;
}

export function LeaveTypeFilters({
  search,
  onSearchChange,
  leaveGroup,
  onLeaveGroupChange,
  payer,
  onPayerChange,
  isActive,
  onIsActiveChange,
  onReset,
}: LeaveTypeFiltersProps) {
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

  const activeValue =
    isActive === true ? "true" : isActive === false ? "false" : "ALL";

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã hoặc tên loại nghỉ phép..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc chuẩn Design System */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Nhóm nghỉ */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Nhóm:</span>
          <Select
            value={leaveGroup}
            onValueChange={(val) => onLeaveGroupChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả nhóm" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_GROUP_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nguồn chi trả */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Nguồn chi:</span>
          <Select
            value={payer}
            onValueChange={(val) => onPayerChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả nguồn" />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_PAYER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trạng thái */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select
            value={activeValue}
            onValueChange={(val) => onIsActiveChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang kích hoạt</SelectItem>
              <SelectItem value="false">Tạm khóa</SelectItem>
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
