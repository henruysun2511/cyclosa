"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function useKpiFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const departmentIdParam = searchParams.get("departmentId") || "ALL";
  const departmentId =
    departmentIdParam === "ALL" ? undefined : departmentIdParam;

  const isActiveParam = searchParams.get("isActive") || "ALL";
  const isActive =
    isActiveParam === "ALL"
      ? undefined
      : isActiveParam === "true";

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

  const setDepartmentId = useCallback(
    (deptId: string) => {
      updateFilters({ departmentId: deptId, page: null });
    },
    [updateFilters]
  );

  const setIsActive = useCallback(
    (val: string) => {
      updateFilters({ isActive: val, page: null });
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
    departmentIdParam,
    departmentId,
    isActiveParam,
    isActive,
    page,
    size,
    isPending,
    setSearch,
    setDepartmentId,
    setIsActive,
    setPage,
    setSize,
    resetFilters,
  };
}
