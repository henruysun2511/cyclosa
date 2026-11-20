"use client";

import { Search, X } from "lucide-react";
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
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from "../constants/product.constants";
import { useProductFilters } from "../hooks/use-product-filters";

export function ProductFilters() {
  const { filters, updateFilters, setKeywordDebounced, resetFilters } =
    useProductFilters();

  const hasActiveFilters = Boolean(
    filters.keyword ||
      filters.status ||
      filters.category ||
      filters.minPrice ||
      filters.maxPrice
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* ── Ô tìm kiếm từ khóa (SKU / Tên) ────────────────────────────── */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã SKU hoặc tên..."
            defaultValue={filters.keyword ?? ""}
            onChange={(e) => setKeywordDebounced(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* ── Lọc theo danh mục ─────────────────────────────────────────── */}
        <Select
          value={filters.category ?? "all"}
          onValueChange={(val) =>
            updateFilters({ category: val === "all" ? undefined : val })
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {PRODUCT_CATEGORY_OPTIONS.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* ── Lọc theo trạng thái ───────────────────────────────────────── */}
        <Select
          value={filters.status || "all"}
          onValueChange={(val) =>
            updateFilters({
              status:
                val === "all"
                  ? undefined
                  : (val as (typeof PRODUCT_STATUS_OPTIONS)[number]["value"]),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {PRODUCT_STATUS_OPTIONS.map((st) => (
              <SelectItem key={st.value} value={st.value}>
                {st.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Nút Xóa bộ lọc ────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground self-start sm:self-auto"
        >
          <X className="mr-1.5 h-4 w-4" />
          Xóa lọc
        </Button>
      )}
    </div>
  );
}
