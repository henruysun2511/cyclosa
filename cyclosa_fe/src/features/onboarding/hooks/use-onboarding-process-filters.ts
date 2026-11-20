"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { OnboardingStatus } from "../types/onboarding.types";

export function useOnboardingProcessFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" ? undefined : statusParam) as
    | OnboardingStatus
    | undefined;

  const departmentId = searchParams.get("departmentId") || "";
  const mentorId = searchParams.get("mentorId") || "";

  const viewMode = (searchParams.get("view") || "list") as "list" | "kanban";

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

  const setDepartmentId = useCallback(
    (deptId: string) => {
      updateFilters({ departmentId: deptId, page: null });
    },
    [updateFilters]
  );

  const setViewMode = useCallback(
    (mode: "list" | "kanban") => {
      updateFilters({ view: mode === "list" ? null : mode });
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
      departmentId: departmentId || undefined,
      mentorId: mentorId || undefined,
      status: status || "ALL",
      page,
      size,
    },
    search,
    status: statusParam,
    departmentId,
    mentorId,
    viewMode,
    page,
    size,
    setSearch,
    setStatus,
    setDepartmentId,
    setViewMode,
    setPage,
    updateFilters,
    resetFilters,
  };
}

