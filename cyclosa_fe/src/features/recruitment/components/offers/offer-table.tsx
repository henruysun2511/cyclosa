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
  Send,
  UserCheck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { OfferStatusBadge } from "./offer-status-badge";
import type { OfferDto } from "../../types/recruitment.types";

export interface OfferTableProps {
  offers: OfferDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onSend: (id: string) => void;
  onAccept: (id: string) => void;
  onConvert?: (offer: OfferDto) => void;
  isConverting?: boolean;
  onDecline: (offer: OfferDto) => void;
  canManage: boolean;
}

export function OfferTable({
  offers,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onSend,
  onAccept,
  onConvert,
  isConverting,
  onDecline,
  canManage,
}: OfferTableProps) {
  const formatCurrency = (val: number) => {
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
              <TableHead className="w-[130px] text-xs font-semibold">Mã Offer</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Ứng viên trúng tuyển</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Vị trí công việc</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">Lương chính thức</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Ngày bắt đầu</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Hạn phản hồi</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold">Trạng thái</TableHead>
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
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-36 text-center text-xs text-muted-foreground">
                  Không tìm thấy thư mời nhận việc nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              offers.map((item) => {
                const isSent = item.status === "SENT";
                const isAccepted = item.status === "ACCEPTED";
                const isDraft = item.status === "DRAFT" || item.status === "APPROVED";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã Offer */}
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-primary">
                        {item.code || "OFF-001"}
                      </span>
                    </TableCell>

                    {/* Ứng viên */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-foreground block">
                          {item.candidateName || "Ứng viên"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{item.candidateEmail}</span>
                      </div>
                    </TableCell>

                    {/* Vị trí */}
                    <TableCell>
                      <span className="text-xs font-medium text-foreground line-clamp-1">
                        {item.jobOpeningTitle || "Vị trí tuyển dụng"}
                      </span>
                    </TableCell>

                    {/* Lương chính thức */}
                    <TableCell>
                      <span className="text-xs font-bold text-foreground font-mono">
                        {formatCurrency(item.baseSalary)}
                      </span>
                    </TableCell>

                    {/* Ngày bắt đầu */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {item.startDate ? new Date(item.startDate).toLocaleDateString("vi-VN") : "-"}
                      </span>
                    </TableCell>

                    {/* Hạn phản hồi */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("vi-VN") : "7 ngày"}
                      </span>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <div className="space-y-1">
                        <OfferStatusBadge status={item.status} />
                        {item.isConvertedToEmployee && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded px-1.5 py-0.5 w-fit">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            <span>{item.employeeCode || "Đã vào việc"}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage && isAccepted && !item.isConvertedToEmployee && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs gap-1"
                            onClick={() => onConvert?.(item)}
                            disabled={isConverting}
                            title="Tiếp nhận ứng viên thành nhân viên và tự động kích hoạt Onboarding"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Tiếp nhận 1-Click</span>
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 text-xs">
                            {canManage && isDraft && (
                              <DropdownMenuItem onClick={() => onSend(item.id)}>
                                <Send className="h-3.5 w-3.5 mr-2 text-blue-600" />
                                <span>Gửi Offer cho ứng viên</span>
                              </DropdownMenuItem>
                            )}

                            {canManage && isSent && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => onAccept(item.id)}
                                  className="text-emerald-600 focus:text-emerald-700 font-semibold"
                                >
                                  <UserCheck className="h-3.5 w-3.5 mr-2" />
                                  <span>Xác nhận Ứng viên Đồng ý (Accept)</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDecline(item)}
                                  className="text-rose-600 focus:text-rose-700"
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-2" />
                                  <span>Ứng viên từ chối Offer</span>
                                </DropdownMenuItem>
                              </>
                            )}

                            {isAccepted && !item.isConvertedToEmployee && (
                              <DropdownMenuItem
                                onClick={() => onConvert?.(item)}
                                className="text-emerald-600 focus:text-emerald-700 font-semibold"
                              >
                                <Sparkles className="h-3.5 w-3.5 mr-2" />
                                <span>Tiếp nhận & Tạo Onboarding (1-Click)</span>
                              </DropdownMenuItem>
                            )}

                            {item.isConvertedToEmployee && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={item.employeeId ? `/employees/${item.employeeId}` : "/employees"}
                                    className="text-emerald-600 font-medium flex items-center"
                                  >
                                    <UserCheck className="h-3.5 w-3.5 mr-2" />
                                    <span>Hồ sơ nhân viên ({item.employeeCode || "Xem"})</span>
                                  </Link>
                                </DropdownMenuItem>
                                {item.onboardingProcessId && (
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/onboarding/processes/${item.onboardingProcessId}`}
                                      className="text-blue-600 font-medium flex items-center"
                                    >
                                      <Calendar className="h-3.5 w-3.5 mr-2" />
                                      <span>Tiến trình Onboarding</span>
                                    </Link>
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
          <strong className="text-foreground font-mono">{offers.length}</strong> /{" "}
          <strong className="text-foreground font-mono">{totalItems}</strong> thư mời nhận việc
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

