"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { LeaveRequestStatus } from "../types/leave.types";

export function useLeaveRequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const status = (searchParams.get("status") as LeaveRequestStatus) || "ALL";
  const leaveTypeId = searchParams.get("leaveTypeId") || "ALL";
  const departmentId = searchParams.get("departmentId") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const yearParam = searchParams.get("year");
  const year = yearParam ? parseInt(yearParam, 10) : undefined;

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

  const setStatus = useCallback(
    (val: string) => updateFilters({ status: val, page: "1" }),
    [updateFilters]
  );

  const setLeaveTypeId = useCallback(
    (val: string) => updateFilters({ leaveTypeId: val, page: "1" }),
    [updateFilters]
  );

  const setDepartmentId = useCallback(
    (val: string) => updateFilters({ departmentId: val, page: "1" }),
    [updateFilters]
  );

  const setDateRange = useCallback(
    (fromVal: string | null, toVal: string | null) =>
      updateFilters({ from: fromVal, to: toVal, page: "1" }),
    [updateFilters]
  );

  const setYear = useCallback(
    (y: number | null) => updateFilters({ year: y ? y.toString() : null, page: "1" }),
    [updateFilters]
  );

  const setPage = useCallback(
    (p: number) => updateFilters({ page: p.toString() }),
    [updateFilters]
  );

  const setPageSize = useCallback(
    (s: number) => updateFilters({ size: s.toString(), page: "1" }),
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
    status,
    leaveTypeId,
    departmentId,
    from,
    to,
    year,
    page,
    size,
    setSearch,
    setStatus,
    setLeaveTypeId,
    setDepartmentId,
    setDateRange,
    setYear,
    setPage,
    setPageSize,
    resetFilters,
  };
}

