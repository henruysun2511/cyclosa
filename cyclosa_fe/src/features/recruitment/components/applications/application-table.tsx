"use client";

import React from "react";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Sparkles,
  ArrowRight,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { APPLICATION_STAGE_LABELS } from "../../constants/recruitment.constants";
import type { ApplicationDto } from "../../types/recruitment.types";

export interface ApplicationTableProps {
  applications: ApplicationDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onOpenScorecard: (app: ApplicationDto) => void;
  onReject: (app: ApplicationDto) => void;
  canManage: boolean;
}

export function ApplicationTable({
  applications,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onOpenScorecard,
  onReject,
  canManage,
}: ApplicationTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[120px] text-xs font-semibold">Mã hồ sơ</TableHead>
              <TableHead className="min-w-[220px] text-xs font-semibold">Ứng viên</TableHead>
              <TableHead className="min-w-[220px] text-xs font-semibold">Vị trí ứng tuyển</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Giai đoạn</TableHead>
              <TableHead className="w-[140px] text-center text-xs font-semibold">Điểm phù hợp AI</TableHead>
              <TableHead className="w-[120px] text-xs font-semibold">Ngày nộp</TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy hồ sơ ứng tuyển nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const score = app.aiMatchScore ?? 88;

                return (
                  <TableRow key={app.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã hồ sơ */}
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onOpenScorecard(app)}
                        className="font-mono text-xs font-bold text-primary hover:underline"
                      >
                        {app.code || "APP-101"}
                      </button>
                    </TableCell>

                    {/* Họ tên ứng viên */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          href={`/recruitment/applications/${app.id}`}
                          className="font-bold text-xs text-foreground hover:text-primary transition-colors text-left block"
                          title="Bấm để mở không gian thẩm định CV chi tiết chuẩn Harvard"
                        >
                          {app.candidateName || "Ứng viên"}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">{app.candidateEmail}</p>
                      </div>
                    </TableCell>

                    {/* Vị trí ứng tuyển */}
                    <TableCell>
                      <span className="text-xs font-medium text-foreground line-clamp-1">
                        {app.jobOpeningTitle || "Vị trí tuyển dụng"}
                      </span>
                    </TableCell>

                    {/* Giai đoạn */}
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-medium">
                        {APPLICATION_STAGE_LABELS[app.currentStage] || app.currentStage}
                      </Badge>
                    </TableCell>

                    {/* Điểm AI */}
                    <TableCell className="text-center">
                      <button
                        type="button"
                        onClick={() => onOpenScorecard(app)}
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:scale-105 transition-all"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{score}%</span>
                      </button>
                    </TableCell>

                    {/* Ngày nộp */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {app.appliedDate
                          ? new Date(app.appliedDate).toLocaleDateString("vi-VN")
                          : "Hôm nay"}
                      </span>
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <DropdownMenuItem onClick={() => onOpenScorecard(app)}>
                            <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span>Xem AI Scorecard</span>
                          </DropdownMenuItem>

                          {canManage && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onReject(app)}
                                className="text-rose-600 focus:text-rose-700"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-2" />
                                <span>Từ chối hồ sơ</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Hiển thị{" "}
          <strong className="text-foreground font-mono">{applications.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> hồ sơ ứng tuyển
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-mono text-xs text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

