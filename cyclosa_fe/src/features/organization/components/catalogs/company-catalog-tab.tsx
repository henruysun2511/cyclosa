"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, RotateCcw, Building2, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { toast } from "sonner";
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
} from "../../api/organization-api";
import { CompanyFormDialog } from "../dialogs/company-form-dialog";
import { COMPANY_STATUS_OPTIONS } from "../../constants/organization.constants";
import type { Company } from "../../types/company.types";

export function CompanyCatalogTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Confirm Delete State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
    isLoading: boolean;
  }>({
    open: false,
    id: "",
    name: "",
    isLoading: false,
  });

  const { data: companiesData, isLoading, refetch } = useGetCompaniesQuery({ size: 100 });
  const [deleteCompany] = useDeleteCompanyMutation();

  const companies = companiesData?.items || [];

  // Filter client-side
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        debouncedSearch.trim() === "" ||
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (c.taxCode && c.taxCode.toLowerCase().includes(debouncedSearch.toLowerCase()));

      const matchesStatus =
        statusFilter === "ALL" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, debouncedSearch, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
  };

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({
      open: true,
      id,
      name,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
      await deleteCompany(deleteConfirm.id).unwrap();
      refetch();
      toast.success("Xóa công ty thành công!");
      setDeleteConfirm((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch {
      toast.error("Không thể xóa công ty! Vui lòng kiểm tra ràng buộc dữ liệu liên quan.");
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Filter Bar 2 hàng (Rule 03) ───────────────────────────── */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        {/* Hàng 1: Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo mã công ty, tên pháp nhân, mã số thuế..."
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Bộ lọc trạng thái + Nút Thao tác & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-[200px]">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Trạng thái:
              </span>
              <Select value={statusFilter} onValueChange={(val) => val && setStatusFilter(val)}>
                <SelectTrigger className="h-8 text-xs bg-background flex-1">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    Tất cả trạng thái
                  </SelectItem>
                  {COMPANY_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Đặt lại
              </Button>
            )}
          </div>

          <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5 text-xs cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm công ty</span>
          </Button>
        </div>
      </div>

      {/* ── Table (Rule 04) ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="w-32 text-xs font-semibold">Mã công ty</TableHead>
              <TableHead className="text-xs font-semibold">Tên pháp nhân</TableHead>
              <TableHead className="text-xs font-semibold">Mã số thuế</TableHead>
              <TableHead className="text-xs font-semibold">Số điện thoại</TableHead>
              <TableHead className="text-xs font-semibold">Email</TableHead>
              <TableHead className="w-28 text-center text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    <div className="h-4 w-6 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="h-7 w-14 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-0">
                  <EmptyState
                    icon={Building2}
                    title="Không tìm thấy công ty nào"
                    description={
                      searchTerm || statusFilter !== "ALL"
                        ? "Thử thay đổi bộ lọc tìm kiếm để xem kết quả khác."
                        : "Chưa có pháp nhân nào được tạo trong hệ thống."
                    }
                    action={
                      <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5 text-xs">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Thêm công ty đầu tiên</span>
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map((c, idx) => (
                <TableRow key={c.id} className="hover:bg-muted/25 transition-colors">
                  <TableCell className="text-center text-slate-500 text-xs font-normal">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {c.code}
                  </TableCell>
                  <TableCell className="font-medium text-xs text-foreground">
                    {c.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.taxCode || "--"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.phone || "--"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.email || "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-xs font-medium text-white border-transparent ${
                        c.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-600"
                      }`}
                    >
                      {c.status === "ACTIVE" ? "Hoạt động" : "Tạm ngưng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 cursor-pointer hover:text-foreground"
                        onClick={() => handleEdit(c)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleDelete(c.id, c.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <CompanyFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        company={selectedCompany}
        onSuccess={refetch}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Xác nhận xóa công ty"
        description={`Bạn có chắc chắn muốn xóa pháp nhân "${deleteConfirm.name}"? Hành động này không thể hoàn tác nếu đã có phòng ban liên kết.`}
        confirmLabel="Xóa công ty"
        cancelLabel="Hủy"
        variant="destructive"
        isLoading={deleteConfirm.isLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
