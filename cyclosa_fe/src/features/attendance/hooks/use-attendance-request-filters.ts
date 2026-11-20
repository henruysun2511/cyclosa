"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { AttendanceRequestStatus, AttendanceRequestType } from "../types/attendance.types";

export function useAttendanceRequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const status = (searchParams.get("status") as AttendanceRequestStatus | "ALL") || "ALL";
  const requestType = (searchParams.get("requestType") as AttendanceRequestType | "ALL") || "ALL";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
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

  const setRequestType = useCallback(
    (val: string) => updateFilters({ requestType: val, page: "1" }),
    [updateFilters]
  );

  const setDateRange = useCallback(
    (newFrom?: string, newTo?: string) =>
      updateFilters({ from: newFrom, to: newTo, page: "1" }),
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
    search !== "" || status !== "ALL" || requestType !== "ALL" || from !== "" || to !== "";

  return {
    search,
    debouncedSearch,
    status,
    requestType,
    from,
    to,
    page,
    size,
    setSearch,
    setStatus,
    setRequestType,
    setDateRange,
    setPage,
    setSize,
    resetFilters,
    hasActiveFilters,
    filters: {
      search: debouncedSearch || undefined,
      keyword: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      requestType: requestType === "ALL" ? undefined : requestType,
      attendanceDate: from || undefined,
      from: from || undefined,
      to: to || undefined,
      page: page - 1,
      size,
    },
    setAttendanceDate: (date?: string) => setDateRange(date, date),
    queryFilters: {
      keyword: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      requestType: requestType === "ALL" ? undefined : requestType,
      from: from || undefined,
      to: to || undefined,
      page: page - 1,
      size,
    },
  };
}

