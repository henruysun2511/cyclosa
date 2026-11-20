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
  Calendar,
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import {
  INTERVIEW_STATUS_BADGES,
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_ROUND_TYPE_LABELS,
  INTERVIEW_FORMAT_LABELS,
} from "../../constants/recruitment.constants";
import type { InterviewDto } from "../../types/recruitment.types";

export interface InterviewTableProps {
  interviews: InterviewDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onOpenStarQuestions: (interview: InterviewDto) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  canManage: boolean;
}

export function InterviewTable({
  interviews,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onOpenStarQuestions,
  onComplete,
  onCancel,
  canManage,
}: InterviewTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[120px] text-xs font-semibold">Mã lịch</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Ứng viên</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Vị trí & Vòng phỏng vấn</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">Thời gian phỏng vấn</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Hình thức</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[140px] text-center text-xs font-semibold">Phiếu chấm điểm</TableHead>
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
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-7 w-20 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : interviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy lịch phỏng vấn nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              interviews.map((item) => {
                const statusBadge = INTERVIEW_STATUS_BADGES[item.status] || {
                  label: item.status,
                  className: "bg-muted text-muted-foreground",
                };

                return (
                  <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã lịch */}
                    <TableCell>
                      <Link
                        href={`/recruitment/interviews/${item.id}`}
                        className="font-mono text-xs font-bold text-primary hover:underline"
                      >
                        {item.code || "INT-01"}
                      </Link>
                    </TableCell>

                    {/* Ứng viên */}
                    <TableCell>
                      <span className="font-bold text-xs text-foreground block">
                        {item.candidateName || "Ứng viên"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{item.candidateEmail}</span>
                    </TableCell>

                    {/* Vị trí & Vòng */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-semibold text-xs text-foreground block line-clamp-1">
                          {item.jobOpeningTitle || "Vị trí tuyển dụng"}
                        </span>
                        <span className="text-[11px] text-primary font-medium">
                          {item.roundName || (item.roundType ? INTERVIEW_ROUND_TYPE_LABELS[item.roundType] : "Vòng chuyên môn")}
                        </span>
                      </div>
                    </TableCell>

                    {/* Thời gian */}
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium text-foreground">
                          {item.scheduledStartTime
                            ? new Date(item.scheduledStartTime).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "09:00"}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {item.scheduledStartTime
                            ? new Date(item.scheduledStartTime).toLocaleDateString("vi-VN")
                            : "08/10/2026"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Hình thức */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        {item.interviewFormat === "ONLINE" ? (
                          <Video className="h-3 w-3 text-blue-600" />
                        ) : (
                          <MapPin className="h-3 w-3 text-amber-600" />
                        )}
                        <span>{INTERVIEW_FORMAT_LABELS[item.interviewFormat]}</span>
                      </span>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-medium ${statusBadge.className}`}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>

                    {/* Nút vào Phiếu chấm điểm Blind Grading */}
                    <TableCell className="text-center">
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1 border-purple-200 text-purple-700 hover:bg-purple-50">
                        <Link href={`/recruitment/interviews/${item.id}/scorecard`}>
                          <Lock className="h-3 w-3" />
                          <span>Chấm điểm</span>
                        </Link>
                      </Button>
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 text-xs">
                          <DropdownMenuItem asChild>
                            <Link href={`/recruitment/interviews/${item.id}`} className="flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>Xem chi tiết lịch</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onOpenStarQuestions(item)}>
                            <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
                            <span>Gợi ý câu hỏi STAR (AI)</span>
                          </DropdownMenuItem>

                          {canManage && item.status === "SCHEDULED" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onComplete(item.id)}
                                className="text-emerald-600 focus:text-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                <span>Hoàn thành buổi phỏng vấn</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onCancel(item.id)}
                                className="text-rose-600 focus:text-rose-700"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-2" />
                                <span>Hủy lịch</span>
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
          <strong className="text-foreground font-mono">{interviews.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> buổi phỏng vấn
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

