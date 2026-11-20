"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function useShiftFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const isActive = searchParams.get("isActive") || "ALL";
  const isNightShift = searchParams.get("isNightShift") || "ALL";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (
          val === null ||
          val === undefined ||
          val === "" ||
          val === "ALL" ||
          val === "all"
        ) {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const setSearch = useCallback(
    (val: string) => updateFilters({ search: val, page: "1" }),
    [updateFilters]
  );

  const setIsActive = useCallback(
    (val: string) => updateFilters({ isActive: val, page: "1" }),
    [updateFilters]
  );

  const setIsNightShift = useCallback(
    (val: string) => updateFilters({ isNightShift: val, page: "1" }),
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => updateFilters({ page: newPage.toString() }),
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: number) => updateFilters({ size: newSize.toString(), page: "1" }),
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

  const hasActiveFilters =
    search !== "" || isActive !== "ALL" || isNightShift !== "ALL";

  return {
    search,
    debouncedSearch,
    isActive,
    isNightShift,
    page,
    size,
    setSearch,
    setIsActive,
    setIsNightShift,
    setPage,
    setSize,
    resetFilters,
    hasActiveFilters,
    queryFilters: {
      keyword: debouncedSearch || undefined,
      isActive: isActive === "ALL" ? undefined : isActive === "true",
      isNightShift: isNightShift === "ALL" ? undefined : isNightShift === "true",
      page: page - 1, // 0-based cho backend Spring Boot
      size,
    },
  };
}

