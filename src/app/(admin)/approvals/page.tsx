"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  RefreshCw,
  GitFork,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useWorkflowInboxFilters,
  useGetWorkflowStatsQuery,
  useGetMyInboxQuery,
  useGetMySubmittedQuery,
  useGetWorkflowHistoryQuery,
  WorkflowStatsCards,
  WorkflowInboxFilters,
  WorkflowInboxTable,
} from "@/features/workflow";

export default function ApprovalsPage() {
  const router = useRouter();
  const {
    tab,
    search,
    debouncedSearch,
    requestType,
    requestTypeParam,
    page,
    size,
    setTab,
    setSearch,
    setRequestType,
    setPage,
    resetFilters,
  } = useWorkflowInboxFilters();

  // 1. Thống kê số liệu
  const { data: stats, refetch: refetchStats } = useGetWorkflowStatsQuery();

  // 2. Query dữ liệu theo tab
  const {
    data: inboxData,
    isLoading: loadingInbox,
    isFetching: fetchingInbox,
    refetch: refetchInbox,
  } = useGetMyInboxQuery(
    {
      page,
      size,
      keyword: debouncedSearch.trim() || undefined,
      requestType,
    },
    { skip: tab !== "inbox" }
  );

  const {
    data: submittedData,
    isLoading: loadingSubmitted,
    isFetching: fetchingSubmitted,
    refetch: refetchSubmitted,
  } = useGetMySubmittedQuery(
    {
      page,
      size,
      keyword: debouncedSearch.trim() || undefined,
      requestType,
    },
    { skip: tab !== "submitted" }
  );

  const {
    data: historyData,
    isLoading: loadingHistory,
    isFetching: fetchingHistory,
    refetch: refetchHistory,
  } = useGetWorkflowHistoryQuery(
    {
      page,
      size,
      keyword: debouncedSearch.trim() || undefined,
      requestType,
    },
    { skip: tab !== "history" }
  );

  const isFetching = fetchingInbox || fetchingSubmitted || fetchingHistory;
  const isLoading =
    tab === "inbox"
      ? loadingInbox
      : tab === "submitted"
      ? loadingSubmitted
      : loadingHistory;

  const currentData =
    tab === "inbox" ? inboxData : tab === "submitted" ? submittedData : historyData;

  const items = currentData?.items || [];
  const totalPages = currentData?.pagination?.pages || 0;
  const totalItems = currentData?.pagination?.total || 0;

  const handleRefresh = () => {
    refetchStats();
    if (tab === "inbox") refetchInbox();
    else if (tab === "submitted") refetchSubmitted();
    else if (tab === "history") refetchHistory();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Title on top, Breadcrumb underneath, NO description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            Hộp thư Phê duyệt
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Hộp thư phê duyệt</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/settings/workflows">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <GitFork className="w-3.5 h-3.5 text-primary" />
              Cấu hình quy trình
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* 2. Thẻ KPI Stats */}
      <WorkflowStatsCards
        stats={stats}
        activeTab={tab}
        onSelectTab={setTab}
        onOpenDefinitions={() => router.push("/settings/workflows")}
      />

      {/* 3. Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <Tabs value={tab} onValueChange={(val: any) => setTab(val)} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto h-9">
            <TabsTrigger value="inbox" className="text-xs gap-1.5 px-4">
              <Clock className="w-3.5 h-3.5" />
              Chờ tôi duyệt
              {stats?.pendingMyApproval ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {stats.pendingMyApproval}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="submitted" className="text-xs gap-1.5 px-4">
              <Send className="w-3.5 h-3.5" />
              Tôi đã gửi
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1.5 px-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Lịch sử đã duyệt
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 4. Bộ lọc tìm kiếm */}
      <WorkflowInboxFilters
        search={search}
        onSearchChange={setSearch}
        selectedType={requestTypeParam}
        onTypeChange={setRequestType}
        onReset={resetFilters}
      />

      {/* 5. Bảng dữ liệu */}
      <WorkflowInboxTable
        items={items}
        isLoading={isLoading}
        activeTab={tab}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        size={size}
        onPageChange={setPage}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

