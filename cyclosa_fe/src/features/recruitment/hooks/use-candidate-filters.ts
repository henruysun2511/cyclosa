"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function useCandidateFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const blacklistParam = searchParams.get("isBlacklisted") || "ALL";
  const isBlacklisted =
    blacklistParam === "ALL" ? undefined : blacklistParam === "true";

  const minExperience = searchParams.get("minExperience")
    ? parseInt(searchParams.get("minExperience")!, 10)
    : undefined;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "ALL" || val === "all") {
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

  const setIsBlacklisted = useCallback(
    (val: string) => {
      updateFilters({ isBlacklisted: val, page: null });
    },
    [updateFilters]
  );

  const setMinExperience = useCallback(
    (years?: number) => {
      updateFilters({ minExperience: years ? String(years) : null, page: null });
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

  return {
    search,
    debouncedSearch,
    blacklistParam,
    isBlacklisted,
    minExperience,
    page,
    size,
    setSearch,
    setIsBlacklisted,
    setMinExperience,
    setPage,
    setSize,
    resetFilters,
  };
}

