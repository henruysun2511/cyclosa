"use client";

import React from "react";
import { Search, RotateCcw, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RECRUITMENT_REQUEST_STATUS_OPTIONS } from "../../constants/recruitment.constants";

interface RequestFiltersProps {
  search: string;
  statusParam: string;
  departmentId?: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onDepartmentChange?: (val: string) => void;
  onReset: () => void;
}

export function RequestFilters({
  search,
  statusParam,
  onSearchChange,
  onStatusChange,
  onReset,
}: RequestFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo mã đề xuất, tiêu đề vị trí..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Row 2: Selects + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Trạng thái đề xuất */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select value={statusParam} onValueChange={(val) => onStatusChange(val || "ALL")}>
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Chọn trạng thái">
                {RECRUITMENT_REQUEST_STATUS_OPTIONS.find((o) => o.value === statusParam)?.label ||
                  "Tất cả trạng thái"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {RECRUITMENT_REQUEST_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nút đặt lại */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}
