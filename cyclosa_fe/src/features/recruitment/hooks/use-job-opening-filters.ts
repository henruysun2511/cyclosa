"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { JobOpeningStatus, EmploymentType } from "../types/recruitment.types";

export function useJobOpeningFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" ? undefined : statusParam) as JobOpeningStatus | undefined;

  const employmentTypeParam = searchParams.get("employmentType") || "ALL";
  const employmentType = (employmentTypeParam === "ALL" ? undefined : employmentTypeParam) as
    | EmploymentType
    | undefined;

  const departmentId = searchParams.get("departmentId") || "";

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

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: null });
    },
    [updateFilters]
  );

  const setEmploymentType = useCallback(
    (newType: string) => {
      updateFilters({ employmentType: newType, page: null });
    },
    [updateFilters]
  );

  const setDepartmentId = useCallback(
    (deptId: string) => {
      updateFilters({ departmentId: deptId, page: null });
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
    statusParam,
    status,
    employmentTypeParam,
    employmentType,
    departmentId,
    page,
    size,
    setSearch,
    setStatus,
    setEmploymentType,
    setDepartmentId,
    setPage,
    setSize,
    resetFilters,
  };
}

