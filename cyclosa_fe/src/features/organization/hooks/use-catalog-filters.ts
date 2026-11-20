"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  DEFAULT_COMPANY_ID,
  CATALOG_TABS,
  type CatalogTab,
} from "../constants/organization.constants";

export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const rawTab = searchParams.get("tab");
  const activeTab: CatalogTab =
    rawTab === CATALOG_TABS.BRANCHES ||
    rawTab === CATALOG_TABS.COST_CENTERS ||
    rawTab === CATALOG_TABS.JOB_MATRIX
      ? rawTab
      : CATALOG_TABS.COMPANIES;

  const companyId = searchParams.get("companyId") || DEFAULT_COMPANY_ID;

  const setTab = useCallback(
    (newTab: CatalogTab) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tab", newTab);
      const queryString = next.toString();
      startTransition(() => {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const setCompanyId = useCallback(
    (newCompanyId: string) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("companyId", newCompanyId);
      const queryString = next.toString();
      startTransition(() => {
        router.push(`${pathname}?${queryString}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  return {
    activeTab,
    companyId,
    setTab,
    setCompanyId,
  };
}

