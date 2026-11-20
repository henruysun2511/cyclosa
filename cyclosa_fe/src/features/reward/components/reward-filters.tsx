"use client";

import { Search, Filter, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REWARD_TYPE_OPTIONS } from "../constants/reward.constants";
import type { RewardType } from "../types/reward.types";

interface RewardFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  rewardType?: RewardType;
  onRewardTypeChange: (value: string) => void;
  from: string;
  onFromChange: (value: string) => void;
  to: string;
  onToChange: (value: string) => void;
  onReset: () => void;
}

export function RewardFilters({
  search,
  onSearchChange,
  rewardType,
  onRewardTypeChange,
  from,
  onFromChange,
  to,
  onToChange,
  onReset,
}: RewardFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo mã nhân viên, họ tên, danh hiệu khen thưởng..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Các Dropdown lọc + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Hình thức khen thưởng */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Hình thức:
          </span>
          <Select
            value={rewardType || "ALL"}
            onValueChange={(val) => onRewardTypeChange(val || "ALL")}
          >
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả hình thức" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hình thức</SelectItem>
              {REWARD_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Từ ngày */}
        <div className="flex items-center gap-1.5 min-w-[170px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Từ ngày:
          </span>
          <Input
            type="date"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="h-8 text-xs bg-background flex-1"
          />
        </div>

        {/* Đến ngày */}
        <div className="flex items-center gap-1.5 min-w-[170px]">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">
            Đến ngày:
          </span>
          <Input
            type="date"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="h-8 text-xs bg-background flex-1"
          />
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
