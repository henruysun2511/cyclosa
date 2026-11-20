"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";
import type { EmployeeStatus } from "../types/employee.types";

export function useEmployeeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const keyword = searchParams.get("keyword") || "";
  const [debouncedKeyword] = useDebounce(keyword, 350);

  const companyId = searchParams.get("companyId") || "";
  const departmentId = searchParams.get("departmentId") || "";
  const statusParam = searchParams.get("status") || "ALL";
  const status = (statusParam === "ALL" ? undefined : statusParam) as EmployeeStatus | undefined;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "20", 10);

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

  const setKeyword = useCallback(
    (term: string) => {
      updateFilters({ keyword: term, page: null });
    },
    [updateFilters]
  );

  const setCompanyId = useCallback(
    (id: string) => {
      // Khi đổi công ty thì xóa phòng ban và quay về page 1
      updateFilters({ companyId: id, departmentId: null, page: null });
    },
    [updateFilters]
  );

  const setDepartmentId = useCallback(
    (deptId: string) => {
      updateFilters({ departmentId: deptId, page: null });
    },
    [updateFilters]
  );

  const setStatus = useCallback(
    (newStatus: string) => {
      updateFilters({ status: newStatus, page: null });
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
    const params = new URLSearchParams();
    if (companyId) {
      params.set("companyId", companyId);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, companyId]);

  return {
    keyword,
    debouncedKeyword,
    companyId,
    departmentId,
    status,
    statusParam,
    page,
    size,
    setKeyword,
    setCompanyId,
    setDepartmentId,
    setStatus,
    setPage,
    setSize,
    resetFilters,
    isPending,
  };
}

