"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { productFilterSchema } from "../schemas/product.schema";
import type { ProductFilterParams } from "../types/product.types";

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 1. Parse params từ URL qua Zod schema
  const rawParams = Object.fromEntries(searchParams.entries());
  const parsed = productFilterSchema.safeParse(rawParams);
  const filters: ProductFilterParams = parsed.success
    ? parsed.data
    : productFilterSchema.parse({});

  // 2. Cập nhật URL params
  const updateFilters = useCallback(
    (updates: Partial<ProductFilterParams>) => {
      const next: Record<string, string> = {
        ...Object.fromEntries(searchParams.entries()),
      };

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          delete next[key];
        } else {
          next[key] = String(value);
        }
      });

      // Nếu không phải đang đổi page thì tự động reset về page 0
      if (!("page" in updates) && Object.keys(updates).length > 0) {
        next.page = "0";
      }

      const queryString = new URLSearchParams(next).toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  // 3. Debounce cho ô tìm kiếm từ khóa
  const setKeywordDebounced = useDebouncedCallback((keyword: string) => {
    updateFilters({ keyword: keyword.trim() || undefined });
  }, 400);

  // 4. Xóa toàn bộ bộ lọc
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    filters,
    updateFilters,
    setKeywordDebounced,
    resetFilters,
  };
}
