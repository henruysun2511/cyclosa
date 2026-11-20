"use client";

import { useState } from "react";
import Link from "next/link";
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
  PAYROLL_PERIOD_STATUS_LABELS,
  PAYROLL_PERIOD_STATUS_VARIANTS,
} from "../../constants/payroll.constants";
import type { PayrollPeriodDto } from "../../types/payroll.types";
import { useGetPayrollPeriodsQuery } from "../../api/payroll-api";
import { PeriodFilters } from "./period-filters";
import { PeriodFormDialog } from "./period-form-dialog";
import { PeriodPrecheckDialog } from "./period-precheck-dialog";
import { Eye, Play, Users, AlertCircle, CalendarX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PeriodListProps {
  formOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
  onPeriodsLoaded?: (periods: PayrollPeriodDto[]) => void;
  refetchTrigger?: number;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export function PeriodList({
  formOpen: externalFormOpen,
  onFormOpenChange,
  onPeriodsLoaded,
  statusFilter: externalStatusFilter,
  onStatusFilterChange,
}: PeriodListProps) {
  const { data, isLoading, isError, refetch } = useGetPayrollPeriodsQuery();
  const [search, setSearch] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] = useState<string>("ALL");

  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter;
  const setStatusFilter = onStatusFilterChange || setInternalStatusFilter;

  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const isFormOpen = externalFormOpen !== undefined ? externalFormOpen : internalFormOpen;
  const setIsFormOpen = onFormOpenChange || setInternalFormOpen;

  const [precheckOpen, setPrecheckOpen] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);

  const periods: PayrollPeriodDto[] = data?.data || [];

  // Báo danh sách periods lên cha để render KPI Cards
  if (onPeriodsLoaded && data?.data) {
    onPeriodsLoaded(data.data);
  }

  const filteredPeriods = periods.filter((p) => {
    const matchSearch =
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase());
    
    let matchStatus = true;
    if (statusFilter && statusFilter !== "ALL") {
      if (statusFilter === "CALCULATED") {
        matchStatus = p.status === "CALCULATED" || p.status === "PENDING_APPROVAL";
      } else if (statusFilter === "APPROVED") {
        matchStatus = p.status === "APPROVED" || p.status === "LOCKED";
      } else {
        matchStatus = p.status === statusFilter;
      }
    }
    return matchSearch && matchStatus;
  });

  const handleOpenCalculate = (id: string) => {
    setSelectedPeriodId(id);
    setPrecheckOpen(true);
  };

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* 1. Bộ lọc 2 hàng theo Rule 03 */}
      <PeriodFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      {/* 2. Bảng dữ liệu theo Rule 04 */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px] font-semibold text-xs">MÃ KỲ</TableHead>
              <TableHead className="font-semibold text-xs">TÊN KỲ LƯƠNG</TableHead>
              <TableHead className="font-semibold text-xs">THỜI GIAN CHU KỲ</TableHead>
              <TableHead className="text-center font-semibold text-xs">SỐ NHÂN VIÊN</TableHead>
              <TableHead className="text-right font-semibold text-xs">TỔNG GROSS</TableHead>
              <TableHead className="text-right font-semibold text-xs">TỔNG NET</TableHead>
              <TableHead className="text-center font-semibold text-xs">TRẠNG THÁI</TableHead>
              <TableHead className="text-right font-semibold text-xs">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // TableSkeleton 5 hàng theo Rule 04
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải dữ liệu danh sách kỳ lương</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()} className="h-8 text-xs mt-1">
                      Thử lại
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPeriods.length === 0 ? (
              // Table-Embedded Empty State chuẩn Rule 04
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <CalendarX className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Không tìm thấy kỳ lương phù hợp
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc đặt lại tiêu chí lọc.
                    </p>
                    {(search || statusFilter !== "ALL") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="h-8 text-xs mt-2"
                      >
                        Đặt lại bộ lọc
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPeriods.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary">{p.code}</TableCell>
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.startDate} → {p.endDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {p.totalEmployees || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    {formatCurrency(p.totalGross)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatCurrency(p.totalNet)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={PAYROLL_PERIOD_STATUS_VARIANTS[p.status]}>
                      {PAYROLL_PERIOD_STATUS_LABELS[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status === "OPEN" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10"
                          onClick={() => handleOpenCalculate(p.id)}
                          title="Tính toán kỳ lương"
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Tính</span>
                        </Button>
                      )}
                      <Link href={`/payroll/periods/${p.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          <span>Chi tiết</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Mở kỳ lương */}
      <PeriodFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />

      {/* Modal Kiểm tra điều kiện & Chạy tính toán lương */}
      {selectedPeriodId && (
        <PeriodPrecheckDialog
          open={precheckOpen}
          onOpenChange={setPrecheckOpen}
          periodId={selectedPeriodId}
          onCalculated={() => {
            refetch();
            setPrecheckOpen(false);
          }}
        />
      )}
    </div>
  );
}
