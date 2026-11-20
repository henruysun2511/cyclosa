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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PayslipDto } from "../../types/payroll.types";
import { useGetPayslipsByPeriodQuery, useGetMyPayslipsQuery } from "../../api/payroll-api";
import { PayslipViewModal } from "./payslip-view-modal";
import { Search, Eye, FileText, AlertCircle, RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PayslipListProps {
  periodId?: string;
  isEmployeeSelfService?: boolean;
}

export function PayslipList({
  periodId,
  isEmployeeSelfService = false,
}: PayslipListProps) {
  const adminQuery = useGetPayslipsByPeriodQuery(periodId || "", {
    skip: isEmployeeSelfService || !periodId,
  });
  const meQuery = useGetMyPayslipsQuery(undefined, {
    skip: !isEmployeeSelfService,
  });

  const { data, isLoading, isError, refetch } = isEmployeeSelfService ? meQuery : adminQuery;

  const [search, setSearch] = useState("");
  const [selectedPayslipId, setSelectedPayslipId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const payslips: PayslipDto[] = data?.data || [];

  const filtered = payslips.filter((p) => {
    return (
      (p.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.employeeCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.payrollPeriodName || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleView = (id: string) => {
    setSelectedPayslipId(id);
    setViewModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã NV, họ tên, kỳ lương..."
              className="pl-9 text-sm h-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-muted-foreground">
              Tổng số: <span className="font-semibold text-foreground">{filtered.length}</span> phiếu lương
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
              <TableHead className="w-[110px] font-semibold text-xs">MÃ NV</TableHead>
              <TableHead className="font-semibold text-xs">HỌ VÀ TÊN</TableHead>
              <TableHead className="font-semibold text-xs">KỲ LƯƠNG</TableHead>
              <TableHead className="text-right font-semibold text-xs">THU NHẬP GROSS</TableHead>
              <TableHead className="text-right font-semibold text-xs">BẢO HIỂM (10.5%)</TableHead>
              <TableHead className="text-right font-semibold text-xs">THUẾ TNCN</TableHead>
              <TableHead className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                THỰC LĨNH (NET)
              </TableHead>
              <TableHead className="font-semibold text-xs">NGÀY PHÁT HÀNH</TableHead>
              <TableHead className="text-right font-semibold text-xs">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={9} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải danh sách phiếu lương</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs mt-1">
                      Thử lại
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Chưa có phiếu lương nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Phiếu lương điện tử sẽ tự động phát hành cho nhân viên sau khi kỳ lương được phê duyệt.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary text-xs">{p.employeeCode || "—"}</TableCell>
                  <TableCell className="font-medium text-foreground text-xs">{p.employeeName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.payrollPeriodName}</TableCell>
                  <TableCell className="text-right font-medium text-xs">
                    {formatCurrency(p.grossSalary)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatCurrency(p.employeeInsurance)}
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {formatCurrency(p.pitTax)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(p.netSalary)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.issuedAt || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs gap-1 text-primary hover:bg-primary/10"
                      onClick={() => handleView(p.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Xem phiếu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PayslipViewModal
        payslipId={selectedPayslipId}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </div>
  );
}
