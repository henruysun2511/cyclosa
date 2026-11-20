"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { ItAccountRequestStatus } from "../types/onboarding.types";

export function useItRequestFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" ? undefined : statusParam) as
    | ItAccountRequestStatus
    | undefined;

  const itAccountTypeId = searchParams.get("itAccountTypeId") || "";

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

  const setItAccountTypeId = useCallback(
    (typeId: string) => {
      updateFilters({ itAccountTypeId: typeId, page: null });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage > 1 ? String(newPage) : null });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

  return {
    filters: {
      keyword: debouncedSearch,
      status: status || "ALL",
      itAccountTypeId: itAccountTypeId || undefined,
      page,
      size,
    },
    search,
    status: statusParam,
    itAccountTypeId,
    page,
    size,
    setSearch,
    setStatus,
    setItAccountTypeId,
    setPage,
    updateFilters,
    resetFilters,
  };
}

