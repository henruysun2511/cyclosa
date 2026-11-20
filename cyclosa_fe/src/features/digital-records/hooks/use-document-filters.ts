"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { DocumentStatus } from "../types/digital-records.types";

export function useDocumentFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const documentTypeIdParam = searchParams.get("documentTypeId") || "ALL";
  const documentTypeId =
    documentTypeIdParam === "ALL" || documentTypeIdParam === "" ? undefined : documentTypeIdParam;

  const statusParam = searchParams.get("status") || "ALL";
  const status =
    statusParam === "ALL" || statusParam === ""
      ? undefined
      : (statusParam as DocumentStatus);

  const legalHoldParam = searchParams.get("isLegalHold");
  const isLegalHold =
    legalHoldParam === "true" ? true : legalHoldParam === "false" ? false : undefined;

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

  const setDocumentTypeId = useCallback(
    (newTypeId: string) => {
      updateFilters({ documentTypeId: newTypeId, page: null });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: null });
    },
    [updateFilters]
  );

  const setIsLegalHold = useCallback(
    (hold: boolean | undefined) => {
      updateFilters({
        isLegalHold: hold === true ? "true" : hold === false ? "false" : null,
        page: null,
      });
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
    documentTypeId,
    documentTypeIdParam,
    status,
    statusParam,
    isLegalHold,
    legalHoldParam,
    page,
    size,
    setSearch,
    setDocumentTypeId,
    setStatus,
    setIsLegalHold,
    setPage,
    setSize,
    resetFilters,
    isPending,
  };
}
