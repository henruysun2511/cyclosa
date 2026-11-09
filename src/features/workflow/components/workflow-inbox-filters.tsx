"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
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
import { REQUEST_TYPE_OPTIONS } from "../constants/workflow.constants";

interface WorkflowInboxFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
}

export function WorkflowInboxFilters({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  onReset,
}: WorkflowInboxFiltersProps) {
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

  const hasActiveFilters = Boolean(
    searchTerm.trim() || (selectedType && selectedType !== "all")
  );

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-card p-3 rounded-xl border shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tiêu đề yêu cầu hoặc mã hồ sơ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Request Type Select */}
      <div className="w-full sm:w-auto sm:min-w-[200px]">
        <Select value={selectedType || "all"} onValueChange={(val) => onTypeChange(val || "all")}>
          <SelectTrigger className="w-full h-9 text-xs">
            <SelectValue placeholder="Loại chứng từ">
              {selectedType === "all" || !selectedType
                ? "Tất cả loại chứng từ"
                : REQUEST_TYPE_OPTIONS.find((o) => o.value === selectedType)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại chứng từ</SelectItem>
            {REQUEST_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            onReset();
          }}
          className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Xóa lọc
        </Button>
      )}
    </div>
  );
}

