"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  Archive,
  Eye,
  KeyRound,
  History,
  MoreHorizontal,
  FileCheck,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DocumentSummary } from "../types/digital-records.types";

interface DocumentTableProps {
  documents: DocumentSummary[];
  isLoading: boolean;
  page?: number;
  size?: number;
  onOpenSignModal: (doc: DocumentSummary) => void;
  onOpenHoldModal: (doc: DocumentSummary) => void;
  onArchive: (id: string) => void;
  onOpenVersionModal?: (doc: DocumentSummary) => void;
}

export function DocumentTable({
  documents,
  isLoading,
  page = 1,
  size = 10,
  onOpenSignModal,
  onOpenHoldModal,
  onArchive,
  onOpenVersionModal,
}: DocumentTableProps) {
  const getStatusBadge = (status: string, isHold: boolean) => {
    if (isHold) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs">
          <ShieldAlert className="h-3 w-3" /> Tạm giữ pháp lý
        </span>
      );
    }
    switch (status) {
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-2xs">
            <Archive className="h-3 w-3" /> Đã lưu kho
          </span>
        );
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-2xs">
            <CheckCircle2 className="h-3 w-3" /> Đã thẩm định
          </span>
        );
      case "DESTROYED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-white shadow-2xs">
            Đã tiêu hủy
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600 text-white shadow-2xs">
            <Clock className="h-3 w-3" /> Bản nháp
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Mã tài liệu</TableHead>
              <TableHead className="text-xs font-semibold">Tiêu đề tài liệu</TableHead>
              <TableHead className="text-xs font-semibold">Loại hồ sơ</TableHead>
              <TableHead className="text-xs font-semibold">Nhân sự liên quan</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold">Ký số xác thực</TableHead>
              <TableHead className="text-xs font-semibold">Hạn lưu trữ</TableHead>
              <TableHead className="w-24 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 1. TRƯỜNG HỢP ĐANG TẢI DỮ LIỆU (SKELETON ROWS) */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 font-mono" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 font-mono" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-7 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : documents.length === 0 ? (
              /* 2. TRƯỜNG HỢP DANH SÁCH RỖNG (TABLE-EMBEDDED EMPTY STATE - RULE 04) */
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Không tìm thấy tài liệu số hóa phù hợp</p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* 3. TRƯỜNG HỢP CÓ DỮ LIỆU BẢN GHI */
              documents.map((doc, index) => (
                <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {(page - 1) * size + index + 1}
                  </TableCell>

                  <TableCell className="font-mono text-xs font-semibold text-foreground">
                    {doc.documentCode}
                  </TableCell>

                  <TableCell>
                    <div className="font-medium text-foreground text-sm leading-tight">
                      {doc.title}
                    </div>
                    {doc.dossierTitle && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Bộ hồ sơ: {doc.dossierTitle}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {doc.documentTypeName}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium text-foreground">
                      {doc.employeeFullName || "---"}
                    </div>
                    {doc.employeeCode && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {doc.employeeCode}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>{getStatusBadge(doc.status, doc.isLegalHold)}</TableCell>

                  <TableCell>
                    {doc.isDigitallySigned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-600 text-white shadow-2xs">
                        <FileCheck className="h-3 w-3" /> Đã ký số
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Chưa ký</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {doc.retentionUntil ? doc.retentionUntil : "Chưa thiết lập"}
                  </TableCell>

                  <TableCell className="text-right space-x-1">
                    <Link href={`/documents/${doc.id}/review`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-xs text-primary hover:text-primary"
                      >
                        <Eye className="h-3.5 w-3.5" /> Thẩm định OCR
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        {!doc.isDigitallySigned && doc.status !== "DESTROYED" && (
                          <DropdownMenuItem
                            onClick={() => onOpenSignModal(doc)}
                            className="gap-2 text-xs"
                          >
                            <KeyRound className="h-4 w-4 text-teal-600" /> Ký số xác thực
                          </DropdownMenuItem>
                        )}

                        {doc.status === "VERIFIED" && (
                          <DropdownMenuItem
                            onClick={() => onArchive(doc.id)}
                            className="gap-2 text-xs text-emerald-600"
                          >
                            <Archive className="h-4 w-4" /> Nộp lưu kho bất biến
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          onClick={() => onOpenHoldModal(doc)}
                          className="gap-2 text-xs text-rose-600"
                        >
                          <ShieldAlert className="h-4 w-4" />{" "}
                          {doc.isLegalHold ? "Xem lệnh tạm giữ" : "Ban hành tạm giữ pháp lý"}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {onOpenVersionModal && (
                          <DropdownMenuItem
                            onClick={() => onOpenVersionModal(doc)}
                            className="gap-2 text-xs"
                          >
                            <History className="h-4 w-4 text-muted-foreground" /> Tải phiên bản mới
                          </DropdownMenuItem>
                        )}
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
  );
}
