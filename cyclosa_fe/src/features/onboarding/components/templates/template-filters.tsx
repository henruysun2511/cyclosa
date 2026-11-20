"use client";

import React from "react";
import { Search, RotateCcw, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFiltersProps {
  search: string;
  isActiveParam: string;
  onSearchChange: (val: string) => void;
  onActiveChange: (val: string) => void;
  onReset: () => void;
}

export function TemplateFilters({
  search,
  isActiveParam,
  onSearchChange,
  onActiveChange,
  onReset,
}: TemplateFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên mẫu, mã checklist..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Row 2: Selects + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Trạng thái hoạt động */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select
            value={isActiveParam}
            onValueChange={(val) => onActiveChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang kích hoạt</SelectItem>
              <SelectItem value="false">Tạm ngưng</SelectItem>
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

