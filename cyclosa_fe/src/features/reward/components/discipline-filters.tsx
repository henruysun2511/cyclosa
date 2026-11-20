"use client";

import { Search, Filter, ShieldAlert, X } from "lucide-react";
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
  DISCIPLINE_STATUS_OPTIONS,
  DISCIPLINE_FORM_OPTIONS,
} from "../constants/reward.constants";
import type {
  DisciplineStatus,
  DisciplineForm,
} from "../types/reward.types";

interface DisciplineFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status?: DisciplineStatus;
  onStatusChange: (value: string) => void;
  disciplineForm?: DisciplineForm;
  onDisciplineFormChange: (value: string) => void;
  onReset: () => void;
}

export function DisciplineFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  disciplineForm,
  onDisciplineFormChange,
  onReset,
}: DisciplineFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo mã nhân viên, họ tên, hành vi vi phạm..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Các Dropdown bộ lọc + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Trạng thái hồ sơ */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Trạng thái:
          </span>
          <Select
            value={status || "ALL"}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {DISCIPLINE_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hình thức kỷ luật */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <ShieldAlert className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Hình thức:
          </span>
          <Select
            value={disciplineForm || "ALL"}
            onValueChange={(val) => onDisciplineFormChange(val || "ALL")}
          >
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả hình thức" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hình thức</SelectItem>
              {DISCIPLINE_FORM_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nút Đặt lại */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}
