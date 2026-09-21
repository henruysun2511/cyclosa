"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useProductFilters } from "../hooks/use-product-filters";
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_CATEGORY_OPTIONS,
} from "../constants/product.constants";
import { useDebouncedCallback } from "use-debounce";

export function ProductFilters() {
  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useProductFilters();

  const handleSearchChange = useDebouncedCallback((value: string) => {
    updateFilters({ search: value || undefined });
  }, 400);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Tìm kiếm sản phẩm..."
        defaultValue={filters.search ?? ""}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-56"
      />

      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) =>
          updateFilters({ status: v === "all" ? undefined : (v as never) })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          {PRODUCT_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.category ?? "all"}
        onValueChange={(v) =>
          updateFilters({ category: v === "all" ? undefined : (v as never) })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {PRODUCT_CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="gap-1.5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
