"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
import type { AssetCondition, AssetStatus } from "../types/asset.types";

export function useAssetFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "ALL";
  const status = (searchParams.get("status") || "ALL") as AssetStatus | "ALL";
  const conditionStatus = (searchParams.get("conditionStatus") || "ALL") as
    | AssetCondition
    | "ALL";
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

  const setCategoryId = useCallback(
    (val: string) => {
      router.push(
        `${pathname}?${createQueryString({ categoryId: val, page: 1 })}`
      );
    },
    [pathname, router, createQueryString]
  );

  const setStatus = useCallback(
    (val: AssetStatus | "ALL") => {
      router.push(`${pathname}?${createQueryString({ status: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const setConditionStatus = useCallback(
    (val: AssetCondition | "ALL") => {
      router.push(
        `${pathname}?${createQueryString({ conditionStatus: val, page: 1 })}`
      );
    },
    [pathname, router, createQueryString]
  );

  const setPage = useCallback(
    (val: number) => {
      router.push(`${pathname}?${createQueryString({ page: val })}`);
    },
    [pathname, router, createQueryString]
  );

  const setPageSize = useCallback(
    (val: number) => {
      router.push(`${pathname}?${createQueryString({ size: val, page: 1 })}`);
    },
    [pathname, router, createQueryString]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const queryParams = useMemo(
    () => ({
      keyword: debouncedSearch || undefined,
      categoryId: categoryId === "ALL" ? undefined : categoryId,
      status: status === "ALL" ? undefined : status,
      conditionStatus: conditionStatus === "ALL" ? undefined : conditionStatus,
      page: page - 1, // backend 0-based
      size,
    }),
    [debouncedSearch, categoryId, status, conditionStatus, page, size]
  );

  return {
    filters: {
      search,
      categoryId,
      status,
      conditionStatus,
      page,
      size,
    },
    queryParams,
    setSearch,
    setCategoryId,
    setStatus,
    setConditionStatus,
    setPage,
    setPageSize,
    resetFilters,
  };
}
