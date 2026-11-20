"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { LeaveGroup, LeavePayer } from "../types/leave.types";

export function useLeaveTypeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const leaveGroup = (searchParams.get("leaveGroup") as LeaveGroup) || "ALL";
  const payer = (searchParams.get("payer") as LeavePayer) || "ALL";

  const isActiveParam = searchParams.get("isActive");
  const isActive =
    isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;

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

  const setLeaveGroup = useCallback(
    (val: string) => updateFilters({ leaveGroup: val, page: "1" }),
    [updateFilters]
  );

  const setPayer = useCallback(
    (val: string) => updateFilters({ payer: val, page: "1" }),
    [updateFilters]
  );

  const setIsActive = useCallback(
    (val: string) => updateFilters({ isActive: val, page: "1" }),
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
    leaveGroup,
    payer,
    isActive,
    page,
    size,
    setSearch,
    setLeaveGroup,
    setPayer,
    setIsActive,
    setPage,
    setPageSize,
    resetFilters,
  };
}

