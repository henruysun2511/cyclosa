"use client";

import React from "react";
import { Search, X, Tags, Activity, CheckCircle, RotateCcw } from "lucide-react";
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
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_LABELS,
} from "../constants/asset.constants";
import type {
  AssetCategory,
  AssetCondition,
  AssetStatus,
} from "../types/asset.types";

interface AssetFiltersProps {
  search: string;
  categoryId: string;
  status: AssetStatus | "ALL";
  conditionStatus: AssetCondition | "ALL";
  categories: AssetCategory[];
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStatusChange: (val: AssetStatus | "ALL") => void;
  onConditionChange: (val: AssetCondition | "ALL") => void;
  onReset: () => void;
}

export function AssetFilters({
  search,
  categoryId,
  status,
  conditionStatus,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onConditionChange,
  onReset,
}: AssetFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" ||
    categoryId !== "ALL" ||
    status !== "ALL" ||
    conditionStatus !== "ALL";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      {/* Hàng 1: Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã tài sản, tên thiết bị, số serial, model, nhà sản xuất..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 w-full bg-background/50 h-9.5 text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Hàng 2: Dropdown Filters & Reset */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Lọc theo Loại tài sản */}
        <div className="w-full sm:w-[220px]">
          <Select value={categoryId} onValueChange={(val) => onCategoryChange(val || "ALL")}>
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Tags className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Loại:</span>
                <SelectValue placeholder="Tất cả loại tài sản">
                  {(val: string) => {
                    if (!val || val === "ALL") return "Tất cả loại tài sản";
                    const c = categories.find((item) => item.id === val);
                    return c ? `${c.name} (${c.code})` : val;
                  }}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại tài sản</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Trạng thái vận hành */}
        <div className="w-full sm:w-[200px]">
          <Select
            value={status}
            onValueChange={(val) => onStatusChange((val as AssetStatus | "ALL") || "ALL")}
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Activity className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Trạng thái:</span>
                <SelectValue placeholder="Tất cả trạng thái" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              {Object.entries(ASSET_STATUS_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Tình trạng hiện vật */}
        <div className="w-full sm:w-[200px]">
          <Select
            value={conditionStatus}
            onValueChange={(val) =>
              onConditionChange((val as AssetCondition | "ALL") || "ALL")
            }
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <CheckCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Tình trạng:</span>
                <SelectValue placeholder="Tất cả tình trạng" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả tình trạng</SelectItem>
              {Object.entries(ASSET_CONDITION_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nút đặt lại bộ lọc */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
}
