"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, RotateCcw, Tag, Pencil, Trash2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { toast } from "sonner";
import {
  useGetAllCostCentersQuery,
  useDeleteCostCenterMutation,
} from "../../api/organization-api";
import { CostCenterFormDialog } from "../dialogs/cost-center-form-dialog";
import type { CostCenter } from "../../types/cost-center.types";

interface CostCenterCatalogTabProps {
  companyId: string;
}

export function CostCenterCatalogTab({ companyId }: CostCenterCatalogTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

  // Delete Confirm State
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

  const {
    data: costCenters = [],
    isLoading,
    refetch,
  } = useGetAllCostCentersQuery(companyId, { skip: !companyId });

  const [deleteCostCenter] = useDeleteCostCenterMutation();

  const filteredCostCenters = useMemo(() => {
    return costCenters.filter((cc) => {
      return (
        debouncedSearch.trim() === "" ||
        cc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        cc.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (cc.description && cc.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    });
  }, [costCenters, debouncedSearch]);

  const handleCreate = () => {
    setSelectedCostCenter(null);
    setIsOpen(true);
  };

  const handleEdit = (cc: CostCenter) => {
    setSelectedCostCenter(cc);
    setIsOpen(true);
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
      await deleteCostCenter(deleteConfirm.id).unwrap();
      refetch();
      toast.success("Xóa trung tâm chi phí thành công!");
      setDeleteConfirm((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch {
      toast.error("Không thể xóa trung tâm chi phí! Vui lòng kiểm tra ràng buộc phòng ban.");
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
            placeholder="Tìm kiếm theo mã trung tâm, tên trung tâm chi phí, mục đích hạch toán..."
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Mô tả & Nút Thao tác & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Tổng số {costCenters.length} trung tâm chi phí được thiết lập
            </span>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Đặt lại
              </Button>
            )}
          </div>

          <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5 text-xs cursor-pointer">
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm trung tâm chi phí</span>
          </Button>
        </div>
      </div>

      {/* ── Table (Rule 04) ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="w-36 text-xs font-semibold">Mã trung tâm</TableHead>
              <TableHead className="w-64 text-xs font-semibold">Tên trung tâm chi phí</TableHead>
              <TableHead className="text-xs font-semibold">Mô tả mục đích phân bổ ngân sách</TableHead>
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
                  <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell><div className="h-4 w-56 bg-muted animate-pulse rounded" /></TableCell>
                  <TableCell className="text-center">
                    <div className="h-7 w-12 bg-muted animate-pulse rounded mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCostCenters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState
                    icon={Tag}
                    title="Không tìm thấy trung tâm chi phí nào"
                    description={
                      searchTerm
                        ? "Thử thay đổi từ khóa tìm kiếm để xem kết quả khác."
                        : "Chưa có trung tâm chi phí nào được thiết lập cho công ty này."
                    }
                    action={
                      <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5 text-xs">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Thêm trung tâm chi phí</span>
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredCostCenters.map((cc, idx) => (
                <TableRow key={cc.id} className="hover:bg-muted/25 transition-colors">
                  <TableCell className="text-center text-slate-500 text-xs font-normal">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {cc.code}
                  </TableCell>
                  <TableCell className="font-medium text-xs text-foreground">
                    {cc.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {cc.description || "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 cursor-pointer hover:text-foreground"
                        onClick={() => handleEdit(cc)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive cursor-pointer hover:bg-destructive/10"
                        onClick={() => handleDelete(cc.id, cc.name)}
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
      <CostCenterFormDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        costCenter={selectedCostCenter}
        companyId={companyId}
        onSuccess={refetch}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Xác nhận xóa trung tâm chi phí"
        description={`Bạn có chắc chắn muốn xóa trung tâm chi phí "${deleteConfirm.name}"? Dữ liệu hạch toán liên quan có thể bị ảnh hưởng.`}
        confirmLabel="Xóa trung tâm chi phí"
        cancelLabel="Hủy"
        variant="destructive"
        isLoading={deleteConfirm.isLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
