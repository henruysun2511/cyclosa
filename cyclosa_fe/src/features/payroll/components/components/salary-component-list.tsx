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
  SALARY_COMPONENT_CATEGORY_LABELS,
  COMPONENT_FREQUENCY_LABELS,
} from "../../constants/payroll.constants";
import type { SalaryComponentDto } from "../../types/payroll.types";
import { useGetSalaryComponentsQuery, useDeleteSalaryComponentMutation } from "../../api/payroll-api";
import { SalaryComponentFilters } from "./salary-component-filters";
import { SalaryComponentFormDialog } from "./salary-component-form-dialog";
import { Trash2, Check, X, AlertCircle, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface SalaryComponentListProps {
  formOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
}

export function SalaryComponentList({
  formOpen: externalFormOpen,
  onFormOpenChange,
}: SalaryComponentListProps) {
  const { data, isLoading, isError, refetch } = useGetSalaryComponentsQuery();
  const [deleteComponent] = useDeleteSalaryComponentMutation();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [internalFormOpen, setInternalFormOpen] = useState(false);
  const isFormOpen = externalFormOpen !== undefined ? externalFormOpen : internalFormOpen;
  const setIsFormOpen = onFormOpenChange || setInternalFormOpen;

  const components: SalaryComponentDto[] = data?.data || [];

  const filtered = components.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || c.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "—";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cấu phần lương này?")) return;
    try {
      await deleteComponent(id).unwrap();
      toast.success("Xóa cấu phần lương thành công");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa cấu phần đang được sử dụng");
    }
  };

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("ALL");
  };

  return (
    <div className="space-y-4">
      {/* 1. Thanh lọc 2 hàng chuẩn Rule 03 */}
      <SalaryComponentFilters
        search={search}
        onSearchChange={setSearch}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onReset={handleReset}
      />

      {/* 2. Bảng dữ liệu theo Rule 04 */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px] font-semibold text-xs">MÃ CẤU PHẦN</TableHead>
              <TableHead className="font-semibold text-xs">TÊN CẤU PHẦN</TableHead>
              <TableHead className="font-semibold text-xs">PHÂN NHÓM</TableHead>
              <TableHead className="text-right font-semibold text-xs">GIÁ TRỊ MẶC ĐỊNH</TableHead>
              <TableHead className="text-center font-semibold text-xs">TÍNH THUẾ TNCN</TableHead>
              <TableHead className="text-center font-semibold text-xs">ĐÓNG BHXH</TableHead>
              <TableHead className="text-center font-semibold text-xs">TẦN SUẤT</TableHead>
              <TableHead className="text-right font-semibold text-xs">THAO TÁC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={8} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Không thể tải danh sách cấu phần lương</span>
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
                    <SlidersHorizontal className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium text-foreground">
                      Không tìm thấy cấu phần lương nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử điều chỉnh từ khóa tìm kiếm hoặc đặt lại tiêu chí lọc.
                    </p>
                    {(search || categoryFilter !== "ALL") && (
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
              filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary">{c.code}</TableCell>
                  <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">
                      {SALARY_COMPONENT_CATEGORY_LABELS[c.category] || c.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-xs">
                    {formatCurrency(c.defaultAmount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {c.isTaxable ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {c.isInsuranceSalary ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-600" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                    )}
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {COMPONENT_FREQUENCY_LABELS[c.frequency] || c.frequency}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(c.id)}
                      title="Xóa cấu phần"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SalaryComponentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
    </div>
  );
}
