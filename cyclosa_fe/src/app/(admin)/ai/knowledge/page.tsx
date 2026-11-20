"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetKnowledgeDocumentsQuery,
  useArchiveKnowledgeDocumentMutation,
  useDeleteKnowledgeDocumentMutation,
  useKnowledgeFilters,
  KnowledgeStatsCards,
  KnowledgeFilters,
  KnowledgeDocTable,
  CreateDocDialog,
} from "@/features/ai";

export default function KnowledgeBasePage() {
  const [openCreate, setOpenCreate] = useState(false);

  // Hook quản lý bộ lọc và phân trang URL Search Params (Rule 01 & 06)
  const {
    search,
    debouncedSearch,
    categoryParam,
    category,
    statusParam,
    status,
    page,
    size,
    setSearch,
    setCategory,
    setStatus,
    setPage,
    setSize,
    resetFilters,
  } = useKnowledgeFilters();

  // Nạp danh sách tài liệu từ RTK Query
  const { data, isLoading, isFetching, refetch } = useGetKnowledgeDocumentsQuery({
    keyword: debouncedSearch.trim() || undefined,
    category,
    status,
  });

  const [archiveDoc] = useArchiveKnowledgeDocumentMutation();
  const [deleteDoc] = useDeleteKnowledgeDocumentMutation();

  const handleArchive = async (id: string) => {
    try {
      await archiveDoc(id).unwrap();
      toast.success("Đã lưu trữ tài liệu thành công");
      refetch();
    } catch {
      toast.error("Không thể lưu trữ tài liệu. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(id).unwrap();
      toast.success("Đã xóa tài liệu khỏi kho tri thức");
      refetch();
    } catch {
      toast.error("Không thể xóa tài liệu. Vui lòng thử lại.");
    }
  };

  const allDocuments = data?.data?.items || [];
  const totalElements = allDocuments.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  
  // Phân trang dữ liệu hiển thị phía client cho danh sách
  const paginatedDocuments = allDocuments.slice(
    (page - 1) * size,
    page * size
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Breadcrumbs (Golden Standard Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <BookOpen className="w-6 h-6 text-primary shrink-0" />
            <span>Kho Tri thức Nội bộ</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-muted-foreground">Trợ lý AI & Kho tri thức</span>
            <span>/</span>
            <span className="text-foreground font-medium">Kho tri thức</span>
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

          <Button
            size="sm"
            onClick={() => setOpenCreate(true)}
            className="h-9 gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tải lên tài liệu</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê 4 cột (Golden Standard Rule 03) */}
      <KnowledgeStatsCards
        documents={allDocuments}
        selectedStatus={statusParam}
        onFilterStatus={(st) => setStatus(st || "ALL")}
      />

      {/* 3. Thanh Bộ lọc 2 Hàng (Rule 03) */}
      <KnowledgeFilters
        search={search}
        onSearchChange={setSearch}
        selectedCategory={categoryParam}
        onCategoryChange={setCategory}
        selectedStatus={statusParam}
        onStatusChange={setStatus}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn Table (Rule 04) */}
      <KnowledgeDocTable
        documents={paginatedDocuments}
        isLoading={isLoading}
        page={page}
        size={size}
        onArchive={handleArchive}
        onDelete={handleDelete}
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

      {/* 6. Dialog Tải lên & Lập chỉ mục tài liệu */}
      <CreateDocDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
