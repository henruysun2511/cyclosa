"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Filter, Calendar, X } from "lucide-react";
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
  AUDIT_ENTITY_TYPE_OPTIONS,
  AUDIT_DATE_RANGE_PRESETS,
  AUDIT_ACTION_CONFIG,
  AUDIT_ENTITY_LABEL,
} from "../constants/audit.constants";
import { getDateRangeFromPreset } from "../utils/audit-utils";
import type { AuditAction } from "../types/audit.types";

interface AuditFiltersProps {
  search: string;
  action: string;
  entityType: string;
  from: string;
  to: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
}

/**
 * Thanh bộ lọc đa chiều cho màn hình Nhật ký kiểm toán.
 * Tuân thủ Quy tắc 11.8: Chuẩn hóa Select & Định dạng Nhãn Hiển thị tiếng Việt 100%,
 * không để lộ ID hoặc mã tiếng Anh thô khi select.
 */
export function AuditFilters({
  search,
  action,
  entityType,
  from,
  to,
  hasActiveFilters,
  onSearchChange,
  onActionChange,
  onEntityTypeChange,
  onDateRangeChange,
  onReset,
}: AuditFiltersProps) {
  // Quản lý local state cho search input để khi reset bộ lọc, ô input được xóa sạch
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearchChange(val);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearchChange("");
  };

  // Trích xuất YYYY-MM-DD từ chuỗi ISO để hiển thị trên input type="date"
  const fromDateValue = from ? from.slice(0, 10) : "";
  const toDateValue = to ? to.slice(0, 10) : "";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      {/* ── Row 1: Tìm kiếm từ khóa ────────────────────────────────────── */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm theo người thao tác, email, mã tham chiếu, địa chỉ IP..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-9 pr-8 h-9 text-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            title="Xóa từ khóa"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Row 2: Bộ lọc phân loại & Thời gian ────────────────────────── */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* 1. Lọc theo Hành động (Action) - Bắt buộc hiển thị nhãn tiếng Việt */}
        <Select
          value={action || "_all"}
          onValueChange={(v) => onActionChange(!v || v === "_all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[160px] text-xs">
            <Filter className="h-3 w-3 mr-1.5 text-muted-foreground shrink-0" />
            <SelectValue placeholder="Tất cả hành động">
              {(val: string | null) => {
                if (!val || val === "_all" || val === "all")
                  return "Tất cả hành động";
                const cfg = AUDIT_ACTION_CONFIG[val as AuditAction];
                return cfg ? cfg.label : val;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all" label="Tất cả hành động">
              Tất cả hành động
            </SelectItem>
            {(
              Object.entries(AUDIT_ACTION_CONFIG) as [
                AuditAction,
                { label: string; className: string; dotClassName: string }
              ][]
            ).map(([code, cfg]) => (
              <SelectItem key={code} value={code} label={cfg.label}>
                <span className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${cfg.dotClassName}`}
                  />
                  {cfg.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 2. Lọc theo Phân hệ (Entity Type) - Bắt buộc hiển thị nhãn tiếng Việt */}
        <Select
          value={entityType || "_all"}
          onValueChange={(v) => onEntityTypeChange(!v || v === "_all" ? "" : v)}
        >
          <SelectTrigger className="h-8 w-auto min-w-[180px] text-xs">
            <SelectValue placeholder="Tất cả phân hệ">
              {(val: string | null) => {
                if (!val || val === "_all" || val === "all")
                  return "Tất cả phân hệ";
                const found = AUDIT_ENTITY_TYPE_OPTIONS.find(
                  (opt) => opt.value === val
                );
                return found ? found.label : AUDIT_ENTITY_LABEL[val] || val;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {AUDIT_ENTITY_TYPE_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value || "_all"}
                value={opt.value || "_all"}
                label={opt.label}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 3. Khoảng ngày tùy chọn (Từ ngày - Đến ngày) */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1">
            <input
              type="date"
              aria-label="Từ ngày"
              value={fromDateValue}
              onChange={(e) => {
                const val = e.target.value;
                onDateRangeChange(val ? `${val}T00:00:00` : "", to);
              }}
              className="h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <span>đến</span>
            <input
              type="date"
              aria-label="Đến ngày"
              value={toDateValue}
              onChange={(e) => {
                const val = e.target.value;
                onDateRangeChange(from, val ? `${val}T23:59:59` : "");
              }}
              className="h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* 4. Khoảng thời gian nhanh (Presets) */}
        <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden bg-muted/30">
          {AUDIT_DATE_RANGE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                const range = getDateRangeFromPreset(preset.value);
                onDateRangeChange(range.from, range.to);
              }}
              className="px-2.5 h-8 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* 5. Nút đặt lại bộ lọc */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive ml-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
}
