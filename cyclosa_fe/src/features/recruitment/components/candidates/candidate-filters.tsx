"use client";

import React from "react";
import { Search, RotateCcw, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CandidateFiltersProps {
  search: string;
  blacklistParam: string;
  onSearchChange: (val: string) => void;
  onBlacklistChange: (val: string) => void;
  onReset: () => void;
}

export function CandidateFilters({
  search,
  blacklistParam,
  onSearchChange,
  onBlacklistChange,
  onReset,
}: CandidateFiltersProps) {
  const blacklistOptions = [
    { value: "ALL", label: "Tất cả ứng viên" },
    { value: "false", label: "Ứng viên hợp lệ" },
    { value: "true", label: "Danh sách đen (Blacklist)" },
  ];

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo họ tên, email, kỹ năng ứng viên..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Row 2: Selects + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Blacklist */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Phân loại:</span>
          <Select value={blacklistParam} onValueChange={(val) => onBlacklistChange(val || "ALL")}>
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Phân loại ứng viên">
                {blacklistOptions.find((o) => o.value === blacklistParam)?.label || "Tất cả ứng viên"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {blacklistOptions.map((opt) => (
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
