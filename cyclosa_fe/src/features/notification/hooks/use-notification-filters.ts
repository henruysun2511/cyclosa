"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import type {
  NotificationFilterParams,
  NotificationTab,
  NotificationType,
} from "../types/notification.types";

export function useNotificationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tab = (searchParams.get("tab") || "ALL").toUpperCase() as NotificationTab;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "15", 10);

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

  const setTab = useCallback(
    (newTab: NotificationTab) => {
      // Khi chuyển tab, luôn đặt lại trang về 1 để tránh lỗi ở trang rỗng
      updateFilters({
        tab: newTab === "ALL" ? null : newTab,
        page: null,
      });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({
        page: newPage > 1 ? String(newPage) : null,
      });
    },
    [updateFilters]
  );

  const setSize = useCallback(
    (newSize: number) => {
      updateFilters({
        size: String(newSize),
        page: null,
      });
    },
    [updateFilters]
  );

  // Chuyển đổi tab trên giao diện thành params gửi lên API Backend
  const queryParams = useMemo((): NotificationFilterParams => {
    const params: NotificationFilterParams = {
      page,
      size,
    };

    if (tab === "UNREAD") {
      params.read = false;
    } else if (tab !== "ALL") {
      params.type = tab as NotificationType;
    }

    return params;
  }, [tab, page, size]);

  return {
    tab,
    page,
    size,
    isPending,
    queryParams,
    setTab,
    setPage,
    setSize,
  };
}

