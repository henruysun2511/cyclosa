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
import { Badge } from "@/components/ui/badge";
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ItAccountRequestDto } from "../../types/onboarding.types";

interface ItRequestTableProps {
  requests: ItAccountRequestDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  canHandleIt: boolean;
  onOpenProvision: (req: ItAccountRequestDto) => void;
}

export function ItRequestTable({
  requests,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  canHandleIt,
  onOpenProvision,
}: ItRequestTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROVISIONED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đã cấp tài khoản
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200 text-xs"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Không thể cấp
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Chờ IT cấp phát
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="min-w-[200px] text-xs font-semibold">Nhân sự tiếp nhận</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Hệ thống tài khoản</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Bảo mật VPN</TableHead>
              <TableHead className="w-[200px] text-xs font-semibold">Thông tin đã cấp</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Thời gian tạo</TableHead>
              <TableHead className="w-[110px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-36 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-36 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <KeyRound className="h-8 w-8 text-muted-foreground/40" />
                    <p>Không có yêu cầu cấp tài khoản IT nào cần xử lý.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow
                  key={req.id}
                  className="hover:bg-muted/25 transition-colors"
                >
                  {/* Nhân sự */}
                  <TableCell>
                    <span className="font-bold text-xs text-foreground block">
                      {req.employeeName}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono block">
                      {req.employeeCode} {req.employeeDepartment ? `• ${req.employeeDepartment}` : ""}
                    </span>
                  </TableCell>

                  {/* Hệ thống */}
                  <TableCell>
                    <span className="font-medium text-xs text-foreground block">
                      {req.itAccountTypeName}
                    </span>
                  </TableCell>

                  {/* VPN */}
                  <TableCell>
                    {req.requiresVpn ? (
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]"
                      >
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Cần VPN
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Không</span>
                    )}
                  </TableCell>

                  {/* Thông tin cấp */}
                  <TableCell>
                    {req.provisionedUsername ? (
                      <div className="text-xs font-mono space-y-0.5">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                          User: {req.provisionedUsername}
                        </span>
                        {req.provisionedEmail && (
                          <span className="text-muted-foreground block truncate">
                            {req.provisionedEmail}
                          </span>
                        )}
                      </div>
                    ) : req.failureReason ? (
                      <span className="text-xs text-rose-600 italic block">
                        Lý do: {req.failureReason}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Chưa cấp phát
                      </span>
                    )}
                  </TableCell>

                  {/* Trạng thái */}
                  <TableCell>{getStatusBadge(req.status)}</TableCell>

                  {/* Ngày tạo */}
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </TableCell>

                  {/* Thao tác */}
                  <TableCell className="text-right">
                    {canHandleIt && req.status === "PENDING" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onOpenProvision(req)}
                        className="h-7 px-2.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        Cấp tài khoản
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Hiển thị {requests.length} trên tổng số {totalItems} yêu cầu IT
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <span className="font-mono text-xs px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

