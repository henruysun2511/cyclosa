"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { productFilterSchema } from "../schemas/product.schema";
import type { ProductFilterParams } from "../types/product.types";

type FilterKey = keyof ProductFilterParams;
type FilterValue = string | number | undefined;

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse + validate URL params through Zod (with defaults)
  const filters = productFilterSchema.parse(
    Object.fromEntries(searchParams.entries())
  );

  const updateFilters = useCallback(
    (updates: Partial<Record<FilterKey, FilterValue>>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset to page 1 whenever filters change (except page itself)
      const isPageChange = "page" in updates;
      if (!isPageChange) {
        params.set("page", "1");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status ||
      filters.category ||
      filters.minPrice ||
      filters.maxPrice
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  } as const;
}
