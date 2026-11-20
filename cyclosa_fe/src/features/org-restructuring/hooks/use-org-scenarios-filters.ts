"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import type { OrgScenarioFilterParams } from "../types/org-restructuring.types";

export function useOrgScenariosFilters(initialPage = 0, initialSize = 10) {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string>("ALL");
  const [scope, setScope] = useState<string>("ALL");
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const [debouncedKeyword] = useDebounce(keyword, 350);

  const queryParams = useMemo<OrgScenarioFilterParams>(() => {
    return {
      keyword: debouncedKeyword.trim() ? debouncedKeyword.trim() : undefined,
      status: status !== "ALL" ? status : undefined,
      scope: scope !== "ALL" ? scope : undefined,
      page,
      size,
    };
  }, [debouncedKeyword, status, scope, page, size]);

  const handleReset = () => {
    setKeyword("");
    setStatus("ALL");
    setScope("ALL");
    setPage(0);
  };

  return {
    keyword,
    setKeyword,
    status,
    setStatus,
    scope,
    setScope,
    page,
    setPage,
    size,
    setSize,
    queryParams,
    handleReset,
  };
}
