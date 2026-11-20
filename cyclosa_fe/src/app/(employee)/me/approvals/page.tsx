"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
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

export default function EmployeeApprovalsPage() {
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
    tab === "inbox"
      ? inboxData
      : tab === "submitted"
        ? submittedData
        : historyData;

  const totalPages = currentData?.pagination?.pages || 0;
  const totalItems = currentData?.pagination?.total || 0;

  const handleRefresh = () => {
    refetchStats();
    if (tab === "inbox") refetchInbox();
    else if (tab === "submitted") refetchSubmitted();
    else refetchHistory();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <CheckSquare className="w-6 h-6 text-primary shrink-0" />
            <span>Phê duyệt yêu cầu</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Phê duyệt</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Thống kê nhanh chuẩn Rule 03 */}
      <WorkflowStatsCards
        stats={stats}
        activeTab={tab}
        onSelectTab={setTab}
      />

      {/* 3. Bộ Tabs chuyển đổi Hộp thư */}
      <div className="space-y-4">
        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as "inbox" | "submitted" | "history")}
        >
          <TabsList className="grid grid-cols-3 max-w-md h-9">
            <TabsTrigger value="inbox" className="text-xs gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Chờ tôi duyệt</span>
              {stats?.pendingMyApproval ? (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/15 text-amber-600 font-bold">
                  {stats.pendingMyApproval}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="submitted" className="text-xs gap-1.5 font-medium">
              <Send className="w-3.5 h-3.5" />
              <span>Tôi đã gửi</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Lịch sử đã duyệt</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 4. Bộ lọc tìm kiếm */}
        <WorkflowInboxFilters
          search={search}
          onSearchChange={setSearch}
          selectedType={requestTypeParam || "ALL"}
          onTypeChange={setRequestType}
          onReset={resetFilters}
        />

        {/* 5. Bảng dữ liệu hộp thư */}
        <WorkflowInboxTable
          items={currentData?.items || []}
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
    </div>
  );
}
