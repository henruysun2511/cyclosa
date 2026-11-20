"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { RequestType } from "../types/workflow.types";

export function useWorkflowInboxFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tab = (searchParams.get("tab") || "inbox") as "inbox" | "submitted" | "history";
  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const requestTypeParam = searchParams.get("type") || "all";
  const requestType = (requestTypeParam === "all" ? undefined : requestTypeParam) as
    | RequestType
    | undefined;

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

  const setTab = useCallback(
    (newTab: "inbox" | "submitted" | "history") => {
      updateFilters({ tab: newTab === "inbox" ? null : newTab, page: null });
    },
    [updateFilters]
  );

  const setSearch = useCallback(
    (term: string) => {
      updateFilters({ search: term, page: null });
    },
    [updateFilters]
  );

  const setRequestType = useCallback(
    (type: string) => {
      updateFilters({ type, page: null });
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
    tab,
    search,
    debouncedSearch,
    requestType,
    requestTypeParam,
    page,
    size,
    isPending,
    setTab,
    setSearch,
    setRequestType,
    setPage,
    setSize,
    resetFilters,
  };
}

