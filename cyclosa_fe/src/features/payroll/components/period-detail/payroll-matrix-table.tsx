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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PayrollRecordDto } from "../../types/payroll.types";
import { Search, Eye, Edit3, AlertCircle, RotateCcw, Building2, UserX } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

interface PayrollMatrixTableProps {
  records: PayrollRecordDto[];
  isLoading: boolean;
  isError: boolean;
  onViewTrace: (recordId: string) => void;
  onManualAdjust: (record: PayrollRecordDto) => void;
  isPeriodLocked?: boolean;
}

/**
 * Bảng ma trận lương tuân thủ Rule 03 (Filter Bar 2 hàng) & Rule 04 (Table-Embedded Empty State)
 */
export function PayrollMatrixTable({
  records,
  isLoading,
  isError,
  onViewTrace,
  onManualAdjust,
  isPeriodLocked = false,
}: PayrollMatrixTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  const handleDebouncedSearch = useDebouncedCallback((val: string) => {
    setDebouncedSearch(val);
  }, 350);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    handleDebouncedSearch(val);
  };

  const handleReset = () => {
    setSearch("");
    setDebouncedSearch("");
    setDepartmentFilter("ALL");
  };

  const departments = Array.from(
    new Set(records.map((r) => r.departmentName).filter(Boolean))
  ) as string[];

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.employeeName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchDept = departmentFilter === "ALL" || r.departmentName === departmentFilter;
    return matchSearch && matchDept;
  });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* 1. Thanh lọc ma trận 2 hàng theo Rule 03 */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        {/* Hàng 1: Tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo mã nhân viên, họ tên..."
            className="pl-9 text-sm h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Bộ lọc phòng ban + Đặt lại */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              Phòng ban:
            </span>
            <Select
              value={departmentFilter}
              onValueChange={(val) => setDepartmentFilter(val || "ALL")}
            >
              <SelectTrigger className="h-8 text-xs bg-background max-w-xs">
                <SelectValue placeholder="Tất cả phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Hiển thị <span className="font-semibold text-foreground">{filteredRecords.length}</span> / {records.length} nhân sự
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              <span>Đặt lại</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Bảng dữ liệu ma trận lương */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[100px] font-semibold text-xs">MÃ NV</TableHead>
              <TableHead className="font-semibold text-xs min-w-[150px]">HỌ TÊN</TableHead>
              <TableHead className="font-semibold text-xs min-w-[130px]">PHÒNG BAN</TableHead>
              <TableHead className="text-right font-semibold text-xs">CÔNG THỰC TẾ</TableHead>
              <TableHead className="text-right font-semibold text-xs">LƯƠNG CƠ BẢN</TableHead>
              <TableHead className="text-right font-semibold text-xs">GIỜ OT</TableHead>
              <TableHead className="text-right font-semibold text-xs">PHỤ CẤP</TableHead>
              <TableHead className="text-right font-semibold text-xs text-primary">TỔNG GROSS</TableHead>
              <TableHead className="text-right font-semibold text-xs">BHXH/BHYT/BHTN</TableHead>
              <TableHead className="text-right font-semibold text-xs">THUẾ TNCN</TableHead>
              <TableHead className="text-right font-semibold text-xs">TẠM ỨNG</TableHead>
              <TableHead className="text-right font-semibold text-xs text-emerald-600 dark:text-emerald-400">THỰC NHẬN (NET)</TableHead>
              <TableHead className="text-right font-semibold text-xs min-w-[100px]">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={13} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải ma trận bảng lương</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserX className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Không tìm thấy dữ liệu tính lương
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc lọc theo phòng ban khác.
                    </p>
                    {(search || departmentFilter !== "ALL") && (
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
              filteredRecords.map((r) => {
                const isNetAnomaly = (r.netSalary ?? 0) <= 0;
                const isTaxAnomaly = (r.pitTax ?? 0) < 0;

                return (
                  <TableRow
                    key={r.id}
                    className={`hover:bg-muted/40 transition-colors ${
                      isNetAnomaly || isTaxAnomaly ? "bg-destructive/5 hover:bg-destructive/10" : ""
                    }`}
                  >
                    <TableCell className="font-semibold text-primary text-xs">
                      {r.employeeCode}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-xs">
                      <div>
                        {r.employeeName}
                        {r.hasManualAdjustment && (
                          <Badge variant="outline" className="ml-1.5 text-[10px] text-amber-600 border-amber-300">
                            Hiệu chỉnh
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.departmentName || "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {r.actualWorkDays ?? 0} / {r.standardDays ?? 22}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {formatCurrency(r.baseSalary)}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {r.otHours ? `${r.otHours}h` : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {formatCurrency(r.totalAllowances)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-xs text-primary">
                      {formatCurrency(r.grossSalary)}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {formatCurrency(r.employeeInsurance)}
                    </TableCell>
                    <TableCell
                      className={`text-right text-xs ${
                        isTaxAnomaly ? "font-bold text-destructive" : ""
                      }`}
                    >
                      {formatCurrency(r.pitTax)}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {formatCurrency(r.salaryAdvance)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold text-xs ${
                        isNetAnomaly
                          ? "text-destructive"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {formatCurrency(r.netSalary)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isPeriodLocked && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => onManualAdjust(r)}
                            title="Điều chỉnh dòng lương"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onViewTrace(r.id)}
                          title="Bóc tách chi tiết công thức"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
