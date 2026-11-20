"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { OffboardingStatus, OffboardingType } from "../types/offboarding.types";

export function useOffboardingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const typeParam = searchParams.get("type") || "ALL";
  const type = typeParam === "ALL" ? undefined : (typeParam as OffboardingType);

  const statusParam = searchParams.get("status") || "ALL";
  const status = statusParam === "ALL" ? undefined : (statusParam as OffboardingStatus);

  const departmentIdParam = searchParams.get("departmentId") || "ALL";
  const departmentId = departmentIdParam === "ALL" ? undefined : departmentIdParam;

  const fromDate = searchParams.get("fromDate") || undefined;
  const toDate = searchParams.get("toDate") || undefined;

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
    [searchParams, pathname, router]
  );

  const setSearch = useCallback(
    (val: string) => {
      updateFilters({ search: val, page: "1" });
    },
    [updateFilters]
  );

  const setType = useCallback(
    (val: string) => {
      updateFilters({ type: val, page: "1" });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (val: string) => {
      updateFilters({ status: val, page: "1" });
    },
    [updateFilters]
  );

  const setDepartmentId = useCallback(
    (val: string) => {
      updateFilters({ departmentId: val, page: "1" });
    },
    [updateFilters]
  );

  const setDateRange = useCallback(
    (from?: string, to?: string) => {
      updateFilters({ fromDate: from, toDate: to, page: "1" });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (p: number) => {
      updateFilters({ page: p.toString() });
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (s: number) => {
      updateFilters({ size: s.toString(), page: "1" });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    filters: {
      search,
      debouncedSearch,
      type,
      status,
      departmentId,
      fromDate,
      toDate,
      page,
      size,
    },
    isPending,
    setSearch,
    setType,
    setStatus,
    setDepartmentId,
    setDateRange,
    setPage,
    setSize,
    resetFilters,
  };
}
