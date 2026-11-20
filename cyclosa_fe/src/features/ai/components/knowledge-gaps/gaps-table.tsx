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
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  HelpCircle,
  CheckCircle2,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { GapsStatusBadge } from "./gaps-status-badge";
import type { UnansweredQuestion } from "../../types/ai.types";

export interface GapsTableProps {
  questions: UnansweredQuestion[];
  isLoading: boolean;
  page: number;
  size?: number;
  onResolve: (id: string) => Promise<void>;
  onDismiss: (id: string) => Promise<void>;
}

export function GapsTable({
  questions,
  isLoading,
  page,
  size = 10,
  onResolve,
  onDismiss,
}: GapsTableProps) {
  const [dismissTargetId, setDismissTargetId] = useState<string | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  const handleConfirmDismiss = async () => {
    if (!dismissTargetId) return;
    setIsDismissing(true);
    try {
      await onDismiss(dismissTargetId);
    } finally {
      setIsDismissing(false);
      setDismissTargetId(null);
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
                <TableHead className="min-w-[320px] text-xs font-semibold">
                  Nội dung câu hỏi người dùng đặt ra
                </TableHead>
                <TableHead className="w-[170px] text-center text-xs font-semibold">
                  Trạng thái xử lý
                </TableHead>
                <TableHead className="w-[180px] text-xs font-semibold">
                  Thời điểm hỏi
                </TableHead>
                <TableHead className="w-24 text-center text-xs font-semibold">
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
                      <Skeleton className="h-4 w-72" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-5 w-24 rounded-full mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : questions.length === 0 ? (
                /* 2. TABLE-EMBEDDED EMPTY STATE (RULE 04) */
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="h-56 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                      <p className="text-sm font-semibold text-foreground">
                        Không có lỗ hổng tri thức nào chưa giải quyết!
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Kho tri thức nội bộ hiện đang đáp ứng rất tốt các câu hỏi tra cứu chính sách của cán bộ nhân viên.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* 3. ROWS DỮ LIỆU THỰC TẾ */
                questions.map((q, index) => (
                  <TableRow
                    key={q.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {(page - 1) * size + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        <span className="font-medium text-xs text-foreground">
                          {q.questionText}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <GapsStatusBadge status={q.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(q.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {q.status === "PENDING_REVIEW" ? (
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
                            <DropdownMenuItem
                              onClick={() => onResolve(q.id)}
                              className="text-emerald-600 focus:text-emerald-600 cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                              <span>Đã bổ sung tài liệu</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDismissTargetId(q.id)}
                              className="text-muted-foreground focus:text-muted-foreground cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-2" />
                              <span>Bỏ qua câu hỏi</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Đã xử lý
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal xác nhận bỏ qua câu hỏi */}
      <ConfirmDialog
        open={Boolean(dismissTargetId)}
        onOpenChange={(open) => !open && setDismissTargetId(null)}
        title="Bỏ qua câu hỏi này?"
        description="Bạn có chắc chắn muốn bỏ qua câu hỏi này? Trạng thái sẽ được chuyển thành 'Đã bỏ qua' và không yêu cầu HR cập nhật quy chế nữa."
        confirmLabel="Bỏ qua"
        cancelLabel="Hủy bỏ"
        variant="default"
        isLoading={isDismissing}
        onConfirm={handleConfirmDismiss}
      />
    </>
  );
}
