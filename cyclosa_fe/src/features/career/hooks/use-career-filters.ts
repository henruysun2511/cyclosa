"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
import type { RiskLevel, TalentTag } from "../types/career.types";

export function useCareerPathFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const fromJobTitleId = searchParams.get("fromJobTitleId") || "ALL";
  const toJobTitleId = searchParams.get("toJobTitleId") || "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [debouncedSearch] = useDebounce(search, 300);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "ALL") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const setSearch = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ search: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setFromJobTitleId = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ fromJobTitleId: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setToJobTitleId = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ toJobTitleId: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setPage = useCallback(
    (newPage: number) => {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`);
    },
    [pathname, router, createQueryString]
  );

  const setSize = useCallback(
    (newSize: number) => {
      router.push(`${pathname}?${createQueryString({ size: newSize, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (fromJobTitleId !== "ALL") count++;
    if (toJobTitleId !== "ALL") count++;
    return count;
  }, [search, fromJobTitleId, toJobTitleId]);

  return {
    filters: {
      search,
      debouncedSearch,
      fromJobTitleId,
      toJobTitleId,
      page,
      size,
    },
    setSearch,
    setFromJobTitleId,
    setToJobTitleId,
    setPage,
    setSize,
    resetFilters,
    activeFilterCount,
  };
}

export function useSuccessionPlanFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const departmentId = searchParams.get("departmentId") || "ALL";
  const riskLevel = (searchParams.get("riskLevel") || "ALL") as RiskLevel | "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [debouncedSearch] = useDebounce(search, 300);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "ALL") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const setSearch = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ search: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setDepartmentId = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ departmentId: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setRiskLevel = useCallback(
    (val: RiskLevel | "ALL") => {
      router.push(`${pathname}?${createQueryString({ riskLevel: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setPage = useCallback(
    (newPage: number) => {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`);
    },
    [pathname, router, createQueryString]
  );

  const setSize = useCallback(
    (newSize: number) => {
      router.push(`${pathname}?${createQueryString({ size: newSize, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (departmentId !== "ALL") count++;
    if (riskLevel !== "ALL") count++;
    return count;
  }, [search, departmentId, riskLevel]);

  return {
    filters: {
      search,
      debouncedSearch,
      departmentId,
      riskLevel,
      page,
      size,
    },
    setSearch,
    setDepartmentId,
    setRiskLevel,
    setPage,
    setSize,
    resetFilters,
    activeFilterCount,
  };
}

export function useTalentPoolFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const departmentId = searchParams.get("departmentId") || "ALL";
  const tag = (searchParams.get("tag") || "ALL") as TalentTag | "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const [debouncedSearch] = useDebounce(search, 300);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || value === "ALL") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const setSearch = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ search: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setDepartmentId = useCallback(
    (val: string) => {
      router.push(`${pathname}?${createQueryString({ departmentId: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setTag = useCallback(
    (val: TalentTag | "ALL") => {
      router.push(`${pathname}?${createQueryString({ tag: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setPage = useCallback(
    (newPage: number) => {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`);
    },
    [pathname, router, createQueryString]
  );

  const setSize = useCallback(
    (newSize: number) => {
      router.push(`${pathname}?${createQueryString({ size: newSize, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (departmentId !== "ALL") count++;
    if (tag !== "ALL") count++;
    return count;
  }, [search, departmentId, tag]);

  return {
    filters: {
      search,
      debouncedSearch,
      departmentId,
      tag,
      page,
      size,
    },
    setSearch,
    setDepartmentId,
    setTag,
    setPage,
    setSize,
    resetFilters,
    activeFilterCount,
  };
}
