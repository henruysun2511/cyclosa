"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Settings,
  ShieldAlert,
  Flame,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { showApiErrorToast } from "@/lib/api-error";
import { DataPagination } from "@/components/common/data-pagination";
import {
  useGetDocumentsQuery,
  useGetSimpleDocumentTypesQuery,
  useArchiveDocumentMutation,
  useDocumentFilters,
  DocumentStatsCards,
  DocumentFilters,
  DocumentTable,
  DigitizationSignModal,
  PlaceHoldModal,
  CreateDocumentDialog,
  type DocumentSummary,
} from "@/features/digital-records";
import { Plus } from "lucide-react";

export default function DocumentsPage() {
  const {
    search,
    debouncedSearch,
    documentTypeId,
    documentTypeIdParam,
    status,
    statusParam,
    isLegalHold,
    page,
    size,
    setSearch,
    setDocumentTypeId,
    setStatus,
    setIsLegalHold,
    setPage,
    setSize,
    resetFilters,
  } = useDocumentFilters();

  // Modals state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDocForSign, setSelectedDocForSign] = useState<DocumentSummary | null>(null);
  const [signModalOpen, setSignModalOpen] = useState(false);

  const [selectedDocForHold, setSelectedDocForHold] = useState<DocumentSummary | null>(null);
  const [holdModalOpen, setHoldModalOpen] = useState(false);

  // RTK Query hooks
  const { data: documentTypes = [] } = useGetSimpleDocumentTypesQuery();
  const {
    data: documentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetDocumentsQuery({
    page: page > 0 ? page - 1 : 0,
    size,
    search: debouncedSearch.trim() || undefined,
    documentTypeId: documentTypeId,
    status: status,
    isLegalHold,
  });

  const [archiveMutation] = useArchiveDocumentMutation();

  const handleArchive = async (id: string) => {
    try {
      await archiveMutation(id).unwrap();
      toast.success("Nộp lưu kho bất biến (AIP) thành công!");
      refetch();
    } catch (err) {
      showApiErrorToast(err, "Không thể nộp lưu tài liệu. Vui lòng thử lại!");
    }
  };

  const handleOpenSignModal = (doc: DocumentSummary) => {
    setSelectedDocForSign(doc);
    setSignModalOpen(true);
  };

  const handleOpenHoldModal = (doc: DocumentSummary) => {
    setSelectedDocForHold(doc);
    setHoldModalOpen(true);
  };

  const handleCardFilter = (statusKey: string | undefined) => {
    if (!statusKey || statusKey === "ALL") {
      setStatus("ALL");
      setIsLegalHold(undefined);
    } else if (statusKey === "HOLD") {
      setIsLegalHold(true);
      setStatus("ALL");
    } else {
      setStatus(statusKey);
      setIsLegalHold(undefined);
    }
  };

  // Thống kê sơ bộ
  const documents = documentsData?.items || [];
  const totalElements = documentsData?.pagination?.total || 0;
  const draftOrPending = documents.filter((d) => d.status === "DRAFT" || d.status === "VERIFIED").length;
  const archivedCount = documents.filter((d) => d.status === "ARCHIVED").length;
  const holdCount = documents.filter((d) => d.isLegalHold).length;

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn mực theo Golden Standard (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <span>Kho lưu trữ & số hóa</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Kho lưu trữ & số hóa</span>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Link href="/documents/destruction">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
            >
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span>Hội đồng xét hủy</span>
            </Button>
          </Link>

          <Link href="/documents/legal-holds">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-amber-700 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950/30"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Tạm giữ pháp lý</span>
            </Button>
          </Link>

          <Link href="/documents/settings/retention">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Chính sách lưu trữ</span>
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => refetch()}
            variant="outline"
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tài liệu số hóa</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê nhanh chuẩn Rule 03 (Icon Box h-12 w-12 + Sparkline SVG + Click filter) */}
      <DocumentStatsCards
        total={totalElements}
        draftOrPending={draftOrPending}
        archived={archivedCount}
        legalHold={holdCount}
        selectedStatus={isLegalHold ? "HOLD" : statusParam}
        onFilterStatus={handleCardFilter}
      />

      {/* 3. Thanh Lọc 2 hàng (Rule 03) */}
      <DocumentFilters
        search={search}
        onSearchChange={setSearch}
        documentTypes={documentTypes}
        selectedDocumentTypeId={documentTypeIdParam}
        onDocumentTypeChange={setDocumentTypeId}
        selectedStatus={statusParam}
        onStatusChange={setStatus}
        selectedLegalHold={isLegalHold}
        onLegalHoldChange={setIsLegalHold}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn Table (Rule 04) */}
      <DocumentTable
        documents={documents}
        isLoading={isLoading}
        page={page}
        size={size}
        onOpenSignModal={handleOpenSignModal}
        onOpenHoldModal={handleOpenHoldModal}
        onArchive={handleArchive}
      />

      {/* 5. Phân trang */}
      {documentsData?.pagination && (
        <DataPagination
          pagination={documentsData.pagination}
          onPageChange={(zeroBasedPage) => setPage(zeroBasedPage + 1)}
          onPageSizeChange={(newSize) => {
            setSize(newSize);
            setPage(1);
          }}
        />
      )}

      {/* 6. Modals nghiệp vụ */}
      <DigitizationSignModal
        document={selectedDocForSign}
        open={signModalOpen}
        onOpenChange={setSignModalOpen}
        onSuccess={() => refetch()}
      />

      <PlaceHoldModal
        document={selectedDocForHold}
        open={holdModalOpen}
        onOpenChange={setHoldModalOpen}
        onSuccess={() => refetch()}
      />

      <CreateDocumentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
