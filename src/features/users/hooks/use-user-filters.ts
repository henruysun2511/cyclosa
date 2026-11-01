"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { UserStatus } from "../constants/user.constants";

export function useUserFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get("keyword") || "";
  const [debouncedKeyword] = useDebounce(keyword, 350);

  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" ? undefined : statusParam) as UserStatus | undefined;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  const updateFilters = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "" || val === "ALL") {
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

  const setKeyword = useCallback(
    (term: string) => {
      updateFilters({ keyword: term, page: "1" });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: "1" });
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
      updateFilters({ size: String(newSize), page: "1" });
    },
    [updateFilters]
  );

  return {
    keyword,
    debouncedKeyword,
    status,
    statusParam,
    page,
    size,
    setKeyword,
    setStatus,
    setPage,
    setSize,
    isPending,
  };
}

