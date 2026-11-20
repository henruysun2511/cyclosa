"use client";

import React from "react";
import { Search, Filter, Layers, X } from "lucide-react";
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
  SCENARIO_STATUS_CONFIG,
  SCENARIO_SCOPE_CONFIG,
} from "../constants/org-restructuring.constants";
import type { ScenarioStatus, ScenarioScope } from "../types/org-restructuring.types";

interface OrgScenarioFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  scope: string;
  onScopeChange: (val: string) => void;
  onReset: () => void;
}

export function OrgScenarioFilters({
  keyword,
  onKeywordChange,
  status,
  onStatusChange,
  scope,
  onScopeChange,
  onReset,
}: OrgScenarioFiltersProps) {
  const hasFilter = keyword.trim() !== "" || status !== "ALL" || scope !== "ALL";

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm kiếm theo mã kịch bản, tên phương án tái cơ cấu..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Các Dropdown lọc theo trường + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Nhóm Filter 1: Trạng thái */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select value={status} onValueChange={(val) => onStatusChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {Object.entries(SCENARIO_STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhóm Filter 2: Phạm vi */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Phạm vi:</span>
          <Select value={scope} onValueChange={(val) => onScopeChange(val || "ALL")}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả phạm vi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phạm vi</SelectItem>
              {Object.entries(SCENARIO_SCOPE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nút Đặt lại */}
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>
    </div>
  );
}
