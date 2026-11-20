"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function useRoleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const roleId = searchParams.get("roleId") || "";
  const search = searchParams.get("search") || "";
  const [debouncedSearch] = useDebounce(search, 350);

  const setFilter = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value.trim()) {
        params.set(name, value.trim());
      } else {
        params.delete(name);
      }

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const setRoleId = useCallback(
    (id: string) => {
      setFilter("roleId", id);
    },
    [setFilter]
  );

  const setSearch = useCallback(
    (term: string) => {
      setFilter("search", term);
    },
    [setFilter]
  );

  return {
    roleId,
    search,
    debouncedSearch,
    setRoleId,
    setSearch,
    isPending,
  };
}

