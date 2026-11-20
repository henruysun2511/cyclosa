"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { PerformanceCycleStatus } from "../types/performance.types";

export function useCycleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status =
    statusParam === "ALL" ? undefined : (statusParam as PerformanceCycleStatus);

  const yearParam = searchParams.get("year") || "ALL";
  const year = yearParam === "ALL" ? undefined : parseInt(yearParam, 10);

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
          val === "all" ||
          val === "ALL"
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
    (term: string) => {
      updateFilters({ search: term, page: null });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: null });
    },
    [updateFilters]
  );

  const setYear = useCallback(
    (newYear: string) => {
      updateFilters({ year: newYear, page: null });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage > 1 ? newPage.toString() : null });
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: number) => {
      updateFilters({ size: newSize.toString(), page: null });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

  return {
    search,
    debouncedSearch,
    statusParam,
    status,
    yearParam,
    year,
    page,
    size,
    isPending,
    setSearch,
    setStatus,
    setYear,
    setPage,
    setSize,
    resetFilters,
  };
}
