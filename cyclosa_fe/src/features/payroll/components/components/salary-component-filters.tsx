"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Layers } from "lucide-react";
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
import { SALARY_COMPONENT_CATEGORY_LABELS } from "../../constants/payroll.constants";

interface SalaryComponentFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  onReset: () => void;
}

/**
 * Thanh lọc cấu phần lương chuẩn Rule 03 (Filter Bar 2 hàng)
 */
export function SalaryComponentFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onReset,
}: SalaryComponentFiltersProps) {
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
      {/* Hàng 1: Ô tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo mã, tên cấu phần lương..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Dropdown phân loại + Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Phân nhóm:
          </span>
          <Select
            value={category || "ALL"}
            onValueChange={(val) => onCategoryChange(val || "ALL")}
          >
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả phân nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phân nhóm</SelectItem>
              {Object.entries(SALARY_COMPONENT_CATEGORY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}

