"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { RequestType } from "../types/workflow.types";

export function useWorkflowDefinitionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const companyId = searchParams.get("companyId") || "";
  const requestTypeParam = searchParams.get("type") || "all";
  const requestType = (requestTypeParam === "all" ? undefined : requestTypeParam) as
    | RequestType
    | undefined;

  const statusParam = searchParams.get("status") || "all";
  const isActive =
    statusParam === "active" ? true : statusParam === "inactive" ? false : undefined;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

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

  const setCompanyId = useCallback(
    (id: string) => {
      updateFilters({ companyId: id, page: null });
    },
    [updateFilters]
  );

  const setRequestType = useCallback(
    (type: string) => {
      updateFilters({ type, page: null });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (status: string) => {
      updateFilters({ status, page: null });
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
    companyId,
    requestType,
    requestTypeParam,
    statusParam,
    isActive,
    page,
    size,
    isPending,
    setSearch,
    setCompanyId,
    setRequestType,
    setStatus,
    setPage,
    setSize,
    resetFilters,
  };
}

