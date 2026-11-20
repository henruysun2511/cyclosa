"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { RewardType } from "../types/reward.types";

export function useRewardFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const rewardTypeParam = searchParams.get("rewardType") || "ALL";
  const rewardType =
    rewardTypeParam === "ALL" ? undefined : (rewardTypeParam as RewardType);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

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

  const setRewardType = useCallback(
    (type: string) => {
      updateFilters({ rewardType: type, page: null });
    },
    [updateFilters]
  );

  const setFrom = useCallback(
    (val: string) => {
      updateFilters({ from: val, page: null });
    },
    [updateFilters]
  );

  const setTo = useCallback(
    (val: string) => {
      updateFilters({ to: val, page: null });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (p: number) => {
      updateFilters({ page: p.toString() });
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
    rewardType,
    from,
    to,
    page,
    size,
    isPending,
    setSearch,
    setRewardType,
    setFrom,
    setTo,
    setPage,
    resetFilters,
  };
}

