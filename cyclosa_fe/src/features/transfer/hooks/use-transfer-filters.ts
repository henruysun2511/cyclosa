"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { TransferStatus, TransferType } from "../types/transfer.types";

export function useTransferFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get("keyword") || "";
  const [debouncedKeyword] = useDebounce(keyword, 350);

  const transferType = (searchParams.get("transferType") as TransferType | "ALL") || "ALL";
  const status = (searchParams.get("status") as TransferStatus | "ALL") || "ALL";
  const departmentId = searchParams.get("departmentId") || "ALL";

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
    [searchParams, pathname, router]
  );

  const setKeyword = useCallback(
    (val: string) => {
      updateFilters({ keyword: val, page: "1" });
    },
    [updateFilters]
  );

  const setTransferType = useCallback(
    (val: string) => {
      updateFilters({ transferType: val, page: "1" });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (val: string) => {
      updateFilters({ status: val, page: "1" });
    },
    [updateFilters]
  );

  const setDepartmentId = useCallback(
    (val: string) => {
      updateFilters({ departmentId: val, page: "1" });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: String(newPage) });
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: number) => {
      updateFilters({ size: String(newSize), page: "1" });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const hasActiveFilters =
    Boolean(keyword) ||
    transferType !== "ALL" ||
    status !== "ALL" ||
    departmentId !== "ALL";

  return {
    keyword,
    debouncedKeyword,
    transferType,
    status,
    departmentId,
    page,
    size,
    isPending,
    hasActiveFilters,
    setKeyword,
    setTransferType,
    setStatus,
    setDepartmentId,
    setPage,
    setSize,
    resetFilters,
  };
}
