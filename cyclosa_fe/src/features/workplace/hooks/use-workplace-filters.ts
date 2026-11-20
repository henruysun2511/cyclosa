"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { SeatStatus, SeatType, WorkplaceIssueStatus } from "../types/workplace.types";

export function useWorkplaceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const branchId = searchParams.get("branchId") || "";
  const floorId = searchParams.get("floorId") || "";
  const zoneId = searchParams.get("zoneId") || "";

  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" || statusParam === "all" ? undefined : statusParam) as
    | SeatStatus
    | WorkplaceIssueStatus
    | undefined;

  const seatTypeParam = searchParams.get("seatType") || "ALL";
  const seatType = (seatTypeParam === "ALL" || seatTypeParam === "all" ? undefined : seatTypeParam) as
    | SeatType
    | undefined;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "all" || val === "ALL") {
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

  const setBranchId = useCallback(
    (id: string) => {
      updateFilters({ branchId: id, page: null });
    },
    [updateFilters]
  );

  const setFloorId = useCallback(
    (id: string) => {
      updateFilters({ floorId: id, page: null });
    },
    [updateFilters]
  );

  const setZoneId = useCallback(
    (id: string) => {
      updateFilters({ zoneId: id, page: null });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: null });
    },
    [updateFilters]
  );

  const setSeatType = useCallback(
    (newType: string) => {
      updateFilters({ seatType: newType, page: null });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage > 1 ? String(newPage) : null });
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: number) => {
      updateFilters({ size: String(newSize), page: null });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

  const setFilter = useCallback(
    (key: string, val: string | null | undefined) => {
      updateFilters({ [key]: val, page: null });
    },
    [updateFilters]
  );

  const filters = {
    search,
    debouncedSearch,
    branchId,
    floorId,
    zoneId,
    status: statusParam,
    seatType: seatTypeParam,
    page,
    size,
  };

  return {
    filters,
    setFilter,
    updateFilters,
    search,
    debouncedSearch,
    branchId,
    floorId,
    zoneId,
    status,
    statusParam,
    seatType,
    seatTypeParam,
    page,
    size,
    isPending,
    setSearch,
    setBranchId,
    setFloorId,
    setZoneId,
    setStatus,
    setSeatType,
    setPage,
    setSize,
    resetFilters,
  };
}
