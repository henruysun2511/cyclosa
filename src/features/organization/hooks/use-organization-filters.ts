"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  DEFAULT_COMPANY_ID,
  ORG_VIEW_MODES,
  type OrgViewMode,
} from "../constants/organization.constants";

export interface OrganizationFilterState {
  companyId: string;
  asOfDate: string;
  viewMode: OrgViewMode;
  keyword: string;
  page: number; // 0-based for API
  size: number;
}

export function useOrganizationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 1. Đọc state hiện tại từ URL searchParams
  const companyId = searchParams.get("companyId") || DEFAULT_COMPANY_ID;
  const asOfDate = searchParams.get("asOfDate") || "";
  const rawViewMode = searchParams.get("viewMode");
  const viewMode: OrgViewMode =
    rawViewMode === ORG_VIEW_MODES.TABLE
      ? ORG_VIEW_MODES.TABLE
      : ORG_VIEW_MODES.TREE;
  const keyword = searchParams.get("keyword") || "";
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 0 : rawPage - 1; // Convert 1-based URL to 0-based
  const rawSize = parseInt(searchParams.get("size") || "20", 10);
  const size = Number.isNaN(rawSize) ? 20 : rawSize;

  const filters: OrganizationFilterState = {
    companyId,
    asOfDate,
    viewMode,
    keyword,
    page,
    size,
  };

  // 2. Cập nhật URL searchParams
  const updateFilters = useCallback(
    (updates: Partial<Record<string, string | number | undefined | null>>) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      // Tự động reset page về 1 nếu thay đổi bộ lọc khác
      if (!("page" in updates) && ("keyword" in updates || "companyId" in updates || "asOfDate" in updates)) {
        next.delete("page");
      }

      const queryString = next.toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams]
  );

  // 3. Debounce cho ô tìm kiếm
  const setKeywordDebounced = useDebouncedCallback((kw: string) => {
    updateFilters({ keyword: kw.trim() || undefined });
  }, 400);

  // 4. Xóa bộ lọc về mặc định
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(`${pathname}?companyId=${DEFAULT_COMPANY_ID}`, {
        scroll: false,
      });
    });
  }, [pathname, router]);

  return {
    filters,
    updateFilters,
    setKeywordDebounced,
    resetFilters,
  };
}
