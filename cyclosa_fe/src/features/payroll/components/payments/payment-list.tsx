"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
} from "../../constants/payroll.constants";
import type { PayrollPaymentDto } from "../../types/payroll.types";
import { useGetPayrollPaymentsByPeriodQuery } from "../../api/payroll-api";
import { Search, RotateCcw, AlertCircle, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentListProps {
  periodId: string;
}

export function PaymentList({ periodId }: PaymentListProps) {
  const { data, isLoading, isError, refetch } = useGetPayrollPaymentsByPeriodQuery(periodId);
  const [search, setSearch] = useState("");

  const payments: PayrollPaymentDto[] = data?.data || [];

  const filtered = payments.filter((p) => {
    return (
      (p.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.employeeCode || "").toLowerCase().includes(search.toLowerCase()) ||
      p.accountNumber.includes(search)
    );
  });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã NV, họ tên, số tài khoản..."
              className="pl-9 text-sm h-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-muted-foreground">
              Tổng số: <span className="font-semibold text-foreground">{filtered.length}</span> lệnh chi
            </span>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Đặt lại</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px] font-semibold text-xs">MÃ NV</TableHead>
              <TableHead className="font-semibold text-xs">NGƯỜI THỤ HƯỞNG</TableHead>
              <TableHead className="font-semibold text-xs">PHÒNG BAN</TableHead>
              <TableHead className="font-semibold text-xs">NGÂN HÀNG</TableHead>
              <TableHead className="font-semibold text-xs">SỐ TÀI KHOẢN</TableHead>
              <TableHead className="text-right font-semibold text-xs">SỐ TIỀN CHI TRẢ</TableHead>
              <TableHead className="text-center font-semibold text-xs">TRẠNG THÁI</TableHead>
              <TableHead className="font-semibold text-xs">MÃ THAM CHIẾU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải danh sách chi trả ngân hàng</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs mt-1">
                      Thử lại
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <CreditCard className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Chưa có lệnh chi trả nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Kỳ lương cần được phê duyệt để hệ thống tự động sinh danh sách ủy nhiệm chi.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary text-xs">{p.employeeCode || "—"}</TableCell>
                  <TableCell className="font-medium text-foreground text-xs">{p.employeeName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.departmentName || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.bankName}</TableCell>
                  <TableCell className="text-xs font-mono">{p.accountNumber}</TableCell>
                  <TableCell className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(p.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={PAYMENT_STATUS_VARIANTS[p.status]}>
                      {PAYMENT_STATUS_LABELS[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {p.bankReference || "—"}
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
