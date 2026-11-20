"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, FileText } from "lucide-react";
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

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tiêu đề yêu cầu hoặc mã hồ sơ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Row 2: Selects + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Request Type Select */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Loại chứng từ:</span>
          <Select value={selectedType || "all"} onValueChange={(val) => onTypeChange(val || "all")}>
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả loại chứng từ">
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            onReset();
          }}
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại
        </Button>
      </div>
    </div>
  );
}

