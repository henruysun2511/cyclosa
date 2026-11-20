"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { ContractType } from "../types/leave.types";

export function useLeavePolicyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const leaveTypeId = searchParams.get("leaveTypeId") || "ALL";
  const contractType = (searchParams.get("contractType") as ContractType) || "ALL";

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

  const setLeaveTypeId = useCallback(
    (val: string) => updateFilters({ leaveTypeId: val, page: "1" }),
    [updateFilters]
  );

  const setContractType = useCallback(
    (val: string) => updateFilters({ contractType: val, page: "1" }),
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
    leaveTypeId,
    contractType,
    page,
    size,
    setSearch,
    setLeaveTypeId,
    setContractType,
    setPage,
    setPageSize,
    resetFilters,
  };
}

