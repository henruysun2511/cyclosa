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
import {
  SALARY_ADVANCE_STATUS_LABELS,
  SALARY_ADVANCE_STATUS_VARIANTS,
} from "../../constants/payroll.constants";
import type { SalaryAdvanceDto } from "../../types/payroll.types";
import {
  useGetSalaryAdvancesQuery,
  useApproveSalaryAdvanceMutation,
  useRejectSalaryAdvanceMutation,
  useDisburseSalaryAdvanceMutation,
} from "../../api/payroll-api";
import { AdvanceFilters } from "./advance-filters";
import { AdvanceFormDialog } from "./advance-form-dialog";
import { toast } from "sonner";
import { Check, X, CreditCard, AlertCircle, HandCoins } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvanceListProps {
  formOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function AdvanceList({
  formOpen: externalFormOpen,
  onFormOpenChange,
  statusFilter: externalStatusFilter,
  onStatusFilterChange,
}: AdvanceListProps) {
  const { data, isLoading, isError, refetch } = useGetSalaryAdvancesQuery();
  const [approveAdvance] = useApproveSalaryAdvanceMutation();
  const [rejectAdvance] = useRejectSalaryAdvanceMutation();
  const [disburseAdvance] = useDisburseSalaryAdvanceMutation();

  const [search, setSearch] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] = useState("ALL");

  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter;
  const setStatusFilter = onStatusFilterChange || setInternalStatusFilter;

  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const isFormOpen = externalFormOpen !== undefined ? externalFormOpen : internalFormOpen;
  const setIsFormOpen = onFormOpenChange || setInternalFormOpen;

  const advances: SalaryAdvanceDto[] = data?.data || [];

  const filtered = advances.filter((a) => {
    const matchSearch =
      (a.employeeName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.employeeCode || "").toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveAdvance(id).unwrap();
      toast.success("Đã phê duyệt đơn tạm ứng");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phê duyệt");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAdvance({ id, reason: "Không đủ điều kiện tạm ứng" }).unwrap();
      toast.success("Đã từ chối đơn tạm ứng");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể từ chối");
    }
  };

  const handleDisburse = async (id: string) => {
    try {
      await disburseAdvance({ id }).unwrap();
      toast.success("Đã xác nhận giải ngân chi trả tạm ứng");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể giải ngân");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* 1. Thanh lọc 2 hàng chuẩn Rule 03 */}
      <AdvanceFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleReset}
      />

      {/* 2. Bảng dữ liệu theo Rule 04 */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px] font-semibold text-xs">MÃ NV</TableHead>
              <TableHead className="font-semibold text-xs">HỌ TÊN NHÂN VIÊN</TableHead>
              <TableHead className="text-right font-semibold text-xs">SỐ TIỀN ĐỀ NGHỊ</TableHead>
              <TableHead className="font-semibold text-xs">LÝ DO TẠM ỨNG</TableHead>
              <TableHead className="font-semibold text-xs">NGÀY ĐỀ NGHỊ</TableHead>
              <TableHead className="font-semibold text-xs">KỲ KHẤU TRỪ</TableHead>
              <TableHead className="text-center font-semibold text-xs">TRẠNG THÁI</TableHead>
              <TableHead className="text-right font-semibold text-xs">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải dữ liệu đơn tạm ứng</span>
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
                    <HandCoins className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Không tìm thấy đơn tạm ứng nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc đặt lại tiêu chí lọc.
                    </p>
                    {(search || statusFilter !== "ALL") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="h-8 text-xs mt-2"
                      >
                        Đặt lại bộ lọc
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary">{a.employeeCode || "—"}</TableCell>
                  <TableCell className="font-medium text-foreground">{a.employeeName || "—"}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {formatCurrency(a.amount)}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground" title={a.reason}>
                    {a.reason}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.requestedAt}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.recoveryPayrollPeriodName || "Kỳ kế tiếp"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={SALARY_ADVANCE_STATUS_VARIANTS[a.status]}>
                      {SALARY_ADVANCE_STATUS_LABELS[a.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {a.status === "PENDING_APPROVAL" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs gap-1 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                            onClick={() => handleApprove(a.id)}
                            title="Phê duyệt"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Duyệt</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs gap-1 text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(a.id)}
                            title="Từ chối"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Từ chối</span>
                          </Button>
                        </>
                      )}

                      {a.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs gap-1 text-blue-600 hover:bg-blue-500/10 border-blue-500/30"
                          onClick={() => handleDisburse(a.id)}
                          title="Giải ngân"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Giải ngân</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdvanceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  );
}
