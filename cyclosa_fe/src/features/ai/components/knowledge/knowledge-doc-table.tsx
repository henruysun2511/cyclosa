"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  Archive,
  Trash2,
  FolderOpen,
  Download,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { KnowledgeStatusBadge } from "./knowledge-status-badge";
import { KNOWLEDGE_CATEGORY_LABELS } from "../../constants/ai.constants";
import type { KnowledgeDocument } from "../../types/ai.types";

export interface KnowledgeDocTableProps {
  documents: KnowledgeDocument[];
  isLoading: boolean;
  page: number;
  size?: number;
  onArchive: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function KnowledgeDocTable({
  documents,
  isLoading,
  page,
  size = 10,
  onArchive,
  onDelete,
}: KnowledgeDocTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTargetId);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">
                  STT
                </TableHead>
                <TableHead className="min-w-[280px] text-xs font-semibold">
                  Tên văn bản / Quy chế nội bộ
                </TableHead>
                <TableHead className="w-[200px] text-xs font-semibold">
                  Danh mục
                </TableHead>
                <TableHead className="w-[100px] text-center text-xs font-semibold">
                  Phiên bản
                </TableHead>
                <TableHead className="w-[120px] text-center text-xs font-semibold">
                  Số đoạn (Chunks)
                </TableHead>
                <TableHead className="w-[140px] text-center text-xs font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[120px] text-xs font-semibold">
                  Ngày cập nhật
                </TableHead>
                <TableHead className="w-20 text-center text-xs font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* 1. SKELETON LOADING ROWS */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28 rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-20 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : documents.length === 0 ? (
                /* 2. TABLE-EMBEDDED EMPTY STATE (RULE 04) */
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="h-56 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-semibold text-foreground">
                        Không tìm thấy tài liệu phù hợp trong Kho tri thức
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Thử điều chỉnh từ khóa tìm kiếm hoặc nhấn &ldquo;Tải lên tài liệu mới&rdquo; để nạp văn bản quy chế vào hệ thống
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* 3. ROWS DỮ LIỆU THỰC TẾ */
                documents.map((doc, index) => (
                  <TableRow
                    key={doc.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {(page - 1) * size + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-xs text-foreground line-clamp-1">
                          {doc.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal border-border bg-muted/30"
                      >
                        {KNOWLEDGE_CATEGORY_LABELS[doc.category] || doc.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {doc.version}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-xs text-foreground">
                      {doc.chunkCount} đoạn
                    </TableCell>
                    <TableCell className="text-center">
                      <KnowledgeStatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          {doc.fileUrl && (
                            <DropdownMenuItem asChild className="cursor-pointer">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <Download className="h-3.5 w-3.5 mr-2 text-primary" />
                                <span>Tải tệp gốc</span>
                              </a>
                            </DropdownMenuItem>
                          )}
                          {doc.status === "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => onArchive(doc.id)}
                              className="text-amber-600 focus:text-amber-600 cursor-pointer"
                            >
                              <Archive className="h-3.5 w-3.5 mr-2" />
                              <span>Lưu trữ tài liệu</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setDeleteTargetId(doc.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            <span>Xóa khỏi kho</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal xác nhận xóa chuẩn Rule 07 */}
      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Xóa tài liệu khỏi Kho tri thức?"
        description="Thao tác này sẽ xóa vĩnh viễn văn bản quy chế và toàn bộ các vector nhúng (chunks) liên quan khỏi hệ thống RAG. Trợ lý AI sẽ không thể viện dẫn tài liệu này nữa."
        confirmLabel="Xóa tài liệu"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
