"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
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
import { UNANSWERED_STATUS_LABELS } from "../../constants/ai.constants";

interface GapsFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedStatus?: string;
  onStatusChange: (st: string) => void;
  onReset: () => void;
}

export function GapsFilters({
  search,
  onSearchChange,
  selectedStatus = "ALL",
  onStatusChange,
  onReset,
}: GapsFiltersProps) {
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
      {/* Hàng 1: Tìm kiếm câu hỏi */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo nội dung câu hỏi nhân viên đặt ra cho Trợ lý AI..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Bộ lọc trạng thái + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Trạng thái xử lý:
          </span>
          <Select
            value={selectedStatus}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                Tất cả trạng thái
              </SelectItem>
              {Object.entries(UNANSWERED_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-xs">
                  {label}
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
