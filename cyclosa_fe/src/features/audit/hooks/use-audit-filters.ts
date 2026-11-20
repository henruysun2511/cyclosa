"use client";

// ============================================================================
// CUSTOM HOOK: Đồng bộ bộ lọc nhật ký kiểm toán với URL Search Params
// Tuân thủ Quy chuẩn §7.2 — URL đồng bộ 2 chiều, auto reset page = 1
// ============================================================================

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { AuditLogFilters } from "../types/audit.types";
import { AUDIT_DEFAULT_PAGE_SIZE } from "../constants/audit.constants";

export function useAuditFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ── Đọc giá trị hiện tại từ URL ────────────────────────────────────────
  const search = searchParams.get("search") || "";
  const action = searchParams.get("action") || "";
  const entityType = searchParams.get("entityType") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const ipAddress = searchParams.get("ipAddress") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || String(AUDIT_DEFAULT_PAGE_SIZE), 10);

  // ── Hàm cập nhật URL Search Params ─────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "") {
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

  // ── Debounced search (400ms) — Quy chuẩn §7.2 ─────────────────────────
  const handleSearchChange = useDebouncedCallback((value: string) => {
    updateParams({ search: value || null, page: null });
  }, 400);

  // ── Setters từng bộ lọc (auto reset page = 1) ──────────────────────────
  const setAction = useCallback(
    (value: string) => updateParams({ action: value || null, page: null }),
    [updateParams]
  );

  const setEntityType = useCallback(
    (value: string) => updateParams({ entityType: value || null, page: null }),
    [updateParams]
  );

  const setDateRange = useCallback(
    (fromVal: string, toVal: string) =>
      updateParams({ from: fromVal || null, to: toVal || null, page: null }),
    [updateParams]
  );

  const setIpAddress = useCallback(
    (value: string) => updateParams({ ipAddress: value || null, page: null }),
    [updateParams]
  );

  const setPage = useCallback(
    (newPage: number) =>
      updateParams({ page: newPage > 1 ? String(newPage) : null }),
    [updateParams]
  );

  const setSize = useCallback(
    (newSize: number) =>
      updateParams({ size: String(newSize), page: null }),
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [router, pathname]);

  // ── Tham số truy vấn API (đã được chuẩn hóa) ───────────────────────────
  const queryParams = useMemo((): AuditLogFilters => {
    const params: AuditLogFilters = { page, size };
    if (search) params.search = search;
    if (action) params.action = action as AuditLogFilters["action"];
    if (entityType) params.entityType = entityType;
    if (from) params.from = from;
    if (to) params.to = to;
    if (ipAddress) params.ipAddress = ipAddress;
    return params;
  }, [search, action, entityType, from, to, ipAddress, page, size]);

  const hasActiveFilters =
    !!search || !!action || !!entityType || !!from || !!to || !!ipAddress;

  return {
    // Giá trị hiện tại
    search,
    action,
    entityType,
    from,
    to,
    ipAddress,
    page,
    size,
    // Trạng thái
    isPending,
    hasActiveFilters,
    // Setters
    handleSearchChange,
    setAction,
    setEntityType,
    setDateRange,
    setIpAddress,
    setPage,
    setSize,
    resetFilters,
    // Params API
    queryParams,
  };
}

