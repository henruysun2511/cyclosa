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
  Kanban,
  Share2,
  Lock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { JobOpeningStatusBadge } from "./job-opening-status-badge";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
} from "../../constants/recruitment.constants";
import type { JobOpeningDto } from "../../types/recruitment.types";

export interface JobOpeningTableProps {
  openings: JobOpeningDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onOpenPostingModal: (opening: JobOpeningDto) => void;
  onCloseOpening: (id: string) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
}

export function JobOpeningTable({
  openings,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onOpenPostingModal,
  onCloseOpening,
  onDelete,
  canManage,
}: JobOpeningTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[140px] text-xs font-semibold">Mã vị trí</TableHead>
              <TableHead className="min-w-[240px] text-xs font-semibold">Vị trí & Phòng ban</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Tiến độ tuyển dụng</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Hình thức</TableHead>
              <TableHead className="w-[130px] text-center text-xs font-semibold">Ứng viên</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Hạn nộp</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : openings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy vị trí tuyển dụng nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              openings.map((item) => {
                const percent = Math.min(
                  100,
                  Math.round(((item.hiredCount || 0) / (item.totalNeeded || 1)) * 100)
                );
                const isOpen = item.status === "OPEN";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã vị trí */}
                    <TableCell>
                      <Link
                        href={`/recruitment/job-openings/${item.id}`}
                        className="font-mono text-xs font-bold text-primary hover:underline"
                      >
                        {item.code}
                      </Link>
                    </TableCell>

                    {/* Tiêu đề & Phòng ban */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <Link
                          href={`/recruitment/job-openings/${item.id}`}
                          className="font-semibold text-xs text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          {item.departmentName || "Khối Công nghệ & Vận hành"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Tiến độ tuyển dụng với thanh Progress Bar */}
                    <TableCell>
                      <div className="space-y-1.5 w-36">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-foreground">
                            {item.hiredCount || 0} / {item.totalNeeded}
                          </span>
                          <span className="text-muted-foreground font-mono">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percent >= 100
                                ? "bg-emerald-500"
                                : percent > 0
                                ? "bg-primary"
                                : "bg-slate-300 dark:bg-slate-700"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Hình thức & Nơi làm việc */}
                    <TableCell>
                      <div className="text-xs">
                        <p className="text-foreground">
                          {EMPLOYMENT_TYPE_LABELS[item.employmentType] || item.employmentType}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {WORKPLACE_TYPE_LABELS[item.workplaceType] || item.workplaceType}
                        </p>
                      </div>
                    </TableCell>

                    {/* Số lượng ứng viên */}
                    <TableCell className="text-center">
                      <Link
                        href={`/recruitment/applications?jobOpeningId=${item.id}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                      >
                        <Users className="h-3 w-3" />
                        <span>{item.applicantCount || 0}</span>
                      </Link>
                    </TableCell>

                    {/* Hạn nộp hồ sơ */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {item.deadline
                          ? new Date(item.deadline).toLocaleDateString("vi-VN")
                          : "Không giới hạn"}
                      </span>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <JobOpeningStatusBadge status={item.status} />
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
                            <Link href={`/recruitment/job-openings/${item.id}`} className="flex items-center">
                              <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>Xem chi tiết vị trí</span>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link
                              href={`/recruitment/applications?jobOpeningId=${item.id}`}
                              className="flex items-center text-primary font-medium"
                            >
                              <Kanban className="h-3.5 w-3.5 mr-2" />
                              <span>Bảng ATS Pipeline</span>
                            </Link>
                          </DropdownMenuItem>

                          {canManage && isOpen && (
                            <DropdownMenuItem onClick={() => onOpenPostingModal(item)}>
                              <Share2 className="h-3.5 w-3.5 mr-2 text-blue-600" />
                              <span>Đăng tin lên Kênh (TopCV...)</span>
                            </DropdownMenuItem>
                          )}

                          {canManage && isOpen && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onCloseOpening(item.id)}
                                className="text-amber-600 focus:text-amber-700"
                              >
                                <Lock className="h-3.5 w-3.5 mr-2" />
                                <span>Đóng tuyển vị trí này</span>
                              </DropdownMenuItem>
                            </>
                          )}

                          {canManage && item.status === "DRAFT" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                <span>Xóa vị trí</span>
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
          <strong className="text-foreground font-mono">{openings.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> vị trí tuyển dụng
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

