"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetUnansweredQuestionsQuery,
  useResolveUnansweredQuestionMutation,
  useDismissUnansweredQuestionMutation,
  useGapsFilters,
  GapsStatsCards,
  GapsFilters,
  GapsTable,
} from "@/features/ai";

export default function KnowledgeGapsPage() {
  // Hook quản lý bộ lọc và phân trang URL Search Params (Rule 01 & 06)
  const {
    search,
    debouncedSearch,
    statusParam,
    status,
    page,
    size,
    setSearch,
    setStatus,
    setPage,
    setSize,
    resetFilters,
  } = useGapsFilters();

  // Nạp danh sách câu hỏi chưa được giải đáp từ RTK Query
  const { data, isLoading, isFetching, refetch } = useGetUnansweredQuestionsQuery({
    keyword: debouncedSearch.trim() || undefined,
    status,
  });

  const [resolveQuestion] = useResolveUnansweredQuestionMutation();
  const [dismissQuestion] = useDismissUnansweredQuestionMutation();

  const handleResolve = async (id: string) => {
    try {
      await resolveQuestion(id).unwrap();
      toast.success("Đã ghi nhận bổ sung tài liệu giải đáp cho câu hỏi này");
      refetch();
    } catch {
      toast.error("Không thể cập nhật trạng thái câu hỏi");
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await dismissQuestion(id).unwrap();
      toast.success("Đã bỏ qua câu hỏi không phù hợp");
      refetch();
    } catch {
      toast.error("Không thể bỏ qua câu hỏi");
    }
  };

  const allQuestions = data?.data?.items || [];
  const totalElements = allQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  const paginatedQuestions = allQuestions.slice(
    (page - 1) * size,
    page * size
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Breadcrumbs (Golden Standard Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <HelpCircle className="w-6 h-6 text-primary shrink-0" />
            <span>Lỗ hổng Tri thức</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-muted-foreground">Trợ lý AI & Kho tri thức</span>
            <span>/</span>
            <span className="text-foreground font-medium">Lỗ hổng tri thức</span>
          </nav>
        </div>

        {/* Nút Thao tác Đầu trang */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 shadow-2xs"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê 4 cột (Golden Standard Rule 03) */}
      <GapsStatsCards
        questions={allQuestions}
        selectedStatus={statusParam}
        onFilterStatus={(st) => setStatus(st || "ALL")}
      />

      {/* 3. Thanh Bộ lọc 2 Hàng (Rule 03) */}
      <GapsFilters
        search={search}
        onSearchChange={setSearch}
        selectedStatus={statusParam}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn Table (Rule 04) */}
      <GapsTable
        questions={paginatedQuestions}
        isLoading={isLoading}
        page={page}
        size={size}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
      />

      {/* 5. Phân trang DataPagination chuẩn hệ thống */}
      {totalElements > 0 && (
        <DataPagination
          pagination={{
            page: page - 1,
            size,
            total: totalElements,
            pages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }}
          onPageChange={(p) => setPage(p + 1)}
          onPageSizeChange={setSize}
        />
      )}
    </div>
  );
}
