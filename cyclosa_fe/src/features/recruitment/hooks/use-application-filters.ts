"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { ApplicationStage } from "../types/recruitment.types";

export function useApplicationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const jobOpeningId = searchParams.get("jobOpeningId") || "ALL";

  const stageParam = searchParams.get("stage") || "ALL";
  const stage = (stageParam === "ALL" ? undefined : stageParam) as ApplicationStage | undefined;

  const viewMode = (searchParams.get("view") || "kanban") as "kanban" | "table";

  const onlyHighAiScore = searchParams.get("highScore") === "true";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "50", 10);

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

  const setJobOpeningId = useCallback(
    (id: string) => {
      updateFilters({ jobOpeningId: id, page: null });
    },
    [updateFilters]
  );

  const setStage = useCallback(
    (newStage: string) => {
      updateFilters({ stage: newStage, page: null });
    },
    [updateFilters]
  );

  const setViewMode = useCallback(
    (mode: "kanban" | "table") => {
      updateFilters({ view: mode === "kanban" ? null : mode });
    },
    [updateFilters]
  );

  const setOnlyHighAiScore = useCallback(
    (highScore: boolean) => {
      updateFilters({ highScore: highScore ? "true" : null, page: null });
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
    search,
    debouncedSearch,
    jobOpeningId,
    stageParam,
    stage,
    viewMode,
    onlyHighAiScore,
    page,
    size,
    setSearch,
    setJobOpeningId,
    setStage,
    setViewMode,
    setOnlyHighAiScore,
    setPage,
    resetFilters,
  };
}

