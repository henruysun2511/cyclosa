"use client";

import { Search, Filter, HelpCircle, X } from "lucide-react";
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
  COMPLAINT_STATUS_OPTIONS,
  COMPLAINT_CATEGORY_OPTIONS,
} from "../constants/reward.constants";
import type {
  ComplaintStatus,
  ComplaintCategory,
} from "../types/reward.types";

interface ComplaintFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status?: ComplaintStatus;
  onStatusChange: (value: string) => void;
  category?: ComplaintCategory;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function ComplaintFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  onReset,
}: ComplaintFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo tiêu đề, nội dung, người khiếu nại..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Các Dropdown bộ lọc + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Trạng thái khiếu nại */}
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
              <SelectValue placeholder="Tất cả trạng thái">
                {status && (status as string) !== "ALL"
                  ? COMPLAINT_STATUS_OPTIONS.find((o) => o.value === status)?.label || status
                  : "Tất cả trạng thái"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {COMPLAINT_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhóm khiếu nại */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Phân loại:
          </span>
          <Select
            value={category || "ALL"}
            onValueChange={(val) => onCategoryChange(val || "ALL")}
          >
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả phân loại">
                {category && (category as string) !== "ALL"
                  ? COMPLAINT_CATEGORY_OPTIONS.find((o) => o.value === category)?.label || category
                  : "Tất cả phân loại"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả phân loại</SelectItem>
              {COMPLAINT_CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
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
