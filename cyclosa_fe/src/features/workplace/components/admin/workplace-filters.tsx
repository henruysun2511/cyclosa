"use client";

import React from "react";
import { Search, Building2, Layers, Filter, RotateCcw, X } from "lucide-react";
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
  SEAT_STATUS_OPTIONS,
  SEAT_TYPE_OPTIONS,
  ISSUE_STATUS_OPTIONS,
} from "../../constants/workplace.constants";

interface WorkplaceFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  seatType?: string;
  onSeatTypeChange?: (value: string) => void;
  floors?: { id: string; name: string }[];
  floorId?: string;
  onFloorChange?: (value: string) => void;
  branches?: { id: string; name: string }[];
  branchId?: string;
  onBranchChange?: (value: string) => void;
  onReset: () => void;
  showSeatFilters?: boolean;
  showIssueFilters?: boolean;
}

export function WorkplaceFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  seatType,
  onSeatTypeChange,
  floors,
  floorId,
  onFloorChange,
  branches,
  branchId,
  onBranchChange,
  onReset,
  showSeatFilters = false,
  showIssueFilters = false,
}: WorkplaceFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Tìm kiếm toàn văn */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo mã, tên, vị trí..."
          className="pl-9 pr-9 text-sm h-9 bg-background"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Hàng 2: Dropdown bộ lọc + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {branches && onBranchChange && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Chi nhánh:</span>
            <Select value={branchId || "ALL"} onValueChange={(val: string | null) => val && onBranchChange(val)}>
              <SelectTrigger className="h-8 text-xs bg-background flex-1">
                <SelectValue placeholder="Tất cả chi nhánh">
                  {(val: string) => {
                    if (!val || val === "ALL") return "Tất cả chi nhánh";
                    const b = branches.find((item) => item.id === val);
                    return b ? b.name : "Tất cả chi nhánh";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" label="Tất cả chi nhánh">Tất cả chi nhánh</SelectItem>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id} label={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {floors && onFloorChange && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Tầng:</span>
            <Select value={floorId || "ALL"} onValueChange={(val: string | null) => val && onFloorChange(val)}>
              <SelectTrigger className="h-8 text-xs bg-background flex-1">
                <SelectValue placeholder="Tất cả tầng">
                  {(val: string) => {
                    if (!val || val === "ALL") return "Tất cả tầng";
                    const f = floors.find((item) => item.id === val);
                    return f ? f.name : "Tất cả tầng";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" label="Tất cả tầng">Tất cả tầng</SelectItem>
                {floors.map((f) => (
                  <SelectItem key={f.id} value={f.id} label={f.name}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showSeatFilters && onSeatTypeChange && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Loại chỗ:</span>
            <Select value={seatType || "ALL"} onValueChange={(val: string | null) => val && onSeatTypeChange(val)}>
              <SelectTrigger className="h-8 text-xs bg-background flex-1">
                <SelectValue placeholder="Tất cả loại bàn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại bàn</SelectItem>
                {SEAT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {onStatusChange && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
            <Select value={status || "ALL"} onValueChange={(val: string | null) => val && onStatusChange(val)}>
              <SelectTrigger className="h-8 text-xs bg-background flex-1">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                {showIssueFilters
                  ? ISSUE_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  : SEAT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Nút Đặt lại (Reset) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}
