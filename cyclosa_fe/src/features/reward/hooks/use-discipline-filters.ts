"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type {
  DisciplineStatus,
  DisciplineForm,
} from "../types/reward.types";

export function useDisciplineFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status =
    statusParam === "ALL" ? undefined : (statusParam as DisciplineStatus);

  const formParam = searchParams.get("form") || "ALL";
  const disciplineForm =
    formParam === "ALL" ? undefined : (formParam as DisciplineForm);

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

  const setStatus = useCallback(
    (st: string) => {
      updateFilters({ status: st, page: null });
    },
    [updateFilters]
  );

  const setDisciplineForm = useCallback(
    (form: string) => {
      updateFilters({ form, page: null });
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
    status,
    disciplineForm,
    page,
    size,
    isPending,
    setSearch,
    setStatus,
    setDisciplineForm,
    setPage,
    resetFilters,
  };
}

