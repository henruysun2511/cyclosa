"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { ContractStatus, ContractType } from "../types/contract.types";

export function useContractFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const companyId = searchParams.get("companyId") || "";
  const statusParam = searchParams.get("status") || "all";
  const status = (statusParam === "all" || statusParam === "EXPIRING" ? undefined : statusParam) as
    | ContractStatus
    | undefined;

  const typeParam = searchParams.get("type") || "all";
  const contractType = (typeParam === "all" ? undefined : typeParam) as ContractType | undefined;

  const expiringFilter = searchParams.get("expiring") || "all";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

  // Tính toán expiringBefore date
  let expiringBefore: string | undefined = undefined;
  if (statusParam === "EXPIRING" || expiringFilter === "60") {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    expiringBefore = d.toISOString().split("T")[0];
  } else if (expiringFilter === "30") {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    expiringBefore = d.toISOString().split("T")[0];
  }

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
      updateFilters({ search: term, page: "1" });
    },
    [updateFilters]
  );

  const setCompanyId = useCallback(
    (id: string) => {
      updateFilters({ companyId: id, page: "1" });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: "1" });
    },
    [updateFilters]
  );

  const setContractType = useCallback(
    (newType: string) => {
      updateFilters({ type: newType, page: "1" });
    },
    [updateFilters]
  );

  const setExpiringFilter = useCallback(
    (newExp: string) => {
      updateFilters({ expiring: newExp, page: "1" });
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

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (companyId) {
      params.set("companyId", companyId);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, companyId]);

  return {
    search,
    debouncedSearch,
    companyId,
    status,
    statusParam,
    contractType,
    typeParam,
    expiringFilter,
    expiringBefore,
    page,
    size,
    setSearch,
    setCompanyId,
    setStatus,
    setContractType,
    setExpiringFilter,
    setPage,
    setSize,
    resetFilters,
    isPending,
  };
}

