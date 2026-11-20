"use client";

import React from "react";
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
  Edit,
  Send,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { RequestStatusBadge } from "./request-status-badge";
import { EMPLOYMENT_TYPE_LABELS } from "../../constants/recruitment.constants";
import type { RecruitmentRequestDto } from "../../types/recruitment.types";

export interface RequestTableProps {
  requests: RecruitmentRequestDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (request: RecruitmentRequestDto) => void;
  onEdit: (request: RecruitmentRequestDto) => void;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
  canApprove: boolean;
}

export function RequestTable({
  requests,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onDelete,
  canManage,
  canApprove,
}: RequestTableProps) {
  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[140px] text-xs font-semibold">Mã đề xuất</TableHead>
              <TableHead className="min-w-[220px] text-xs font-semibold">Vị trí tuyển dụng</TableHead>
              <TableHead className="w-[120px] text-center text-xs font-semibold">Chỉ tiêu</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">Hình thức</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Khung lương dự kiến</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[110px] text-xs font-semibold">Ngày tạo</TableHead>
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
                      <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy đề xuất tuyển dụng nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((item) => {
                const isPending = item.status === "PENDING_APPROVAL";
                const isApproved = item.status === "APPROVED";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã đề xuất */}
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => onViewDetail(item)}
                        className="font-mono text-xs font-bold text-primary hover:underline"
                      >
                        {item.code}
                      </button>
                    </TableCell>

                    {/* Vị trí & Phòng ban */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(item)}
                          className="font-semibold text-xs text-foreground hover:text-primary transition-colors text-left line-clamp-1"
                        >
                          {item.title}
                        </button>
                        <p className="text-[11px] text-muted-foreground">
                          {item.departmentName || "Phòng ban nội bộ"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Chỉ tiêu */}
                    <TableCell className="text-center">
                      <span className="font-mono text-xs font-bold text-foreground">
                        {item.headcount}
                      </span>
                    </TableCell>

                    {/* Hình thức làm việc */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {EMPLOYMENT_TYPE_LABELS[item.employmentType] || item.employmentType}
                      </span>
                    </TableCell>

                    {/* Mức lương */}
                    <TableCell>
                      {!item.minSalary && !item.maxSalary ? (
                        <span className="text-xs text-muted-foreground">Thỏa thuận</span>
                      ) : (
                        <span className="text-xs text-foreground font-mono">
                          {formatCurrency(item.minSalary)} - {formatCurrency(item.maxSalary)}
                        </span>
                      )}
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <RequestStatusBadge status={item.status} />
                    </TableCell>

                    {/* Ngày tạo */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "-"}
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
                        <DropdownMenuContent align="end" className="w-52 text-xs">
                          <DropdownMenuItem onClick={() => onViewDetail(item)}>
                            <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span>Xem chi tiết đề xuất</span>
                          </DropdownMenuItem>

                          {canManage && isPending && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                              <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <span>Chỉnh sửa đề xuất</span>
                            </DropdownMenuItem>
                          )}

                          {canManage && isPending && (
                            <DropdownMenuItem onClick={() => onSubmit(item.id)}>
                              <Send className="h-3.5 w-3.5 mr-2 text-blue-600" />
                              <span>Trình duyệt</span>
                            </DropdownMenuItem>
                          )}

                          {canApprove && isPending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onApprove(item.id)}
                                className="text-emerald-600 focus:text-emerald-700 font-medium"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                <span>Phê duyệt đề xuất</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onReject(item.id)}
                                className="text-rose-600 focus:text-rose-700 font-medium"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-2" />
                                <span>Từ chối</span>
                              </DropdownMenuItem>
                            </>
                          )}

                          {isApproved && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/recruitment/job-openings/new?fromRequestId=${item.id}`}
                                  className="text-primary font-medium flex items-center"
                                >
                                  <Briefcase className="h-3.5 w-3.5 mr-2" />
                                  <span>Tạo Vị trí tuyển dụng</span>
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}

                          {canManage && isPending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                <span>Xóa đề xuất</span>
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
          <strong className="text-foreground font-mono">{requests.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> đề xuất
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

