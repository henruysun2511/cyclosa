"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  X,
  RotateCcw,
  Tag,
  Armchair,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useGetAmenitiesQuery,
  useCreateAmenityMutation,
  useDeleteAmenityMutation,
} from "@/features/workplace/api/workplace-api";
import { WorkplaceAmenityTable } from "@/features/workplace/components/admin/workplace-amenity-table";
import { AmenityFormDialog } from "@/features/workplace/components/dialogs/amenity-form-dialog";
import type { WorkplaceAmenity } from "@/features/workplace/types/workplace.types";
import type { AmenityFormValues } from "@/features/workplace/schemas/workplace.schema";

export default function WorkplaceAmenitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: amenities = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAmenitiesQuery();

  const [createAmenity, { isLoading: isCreating }] = useCreateAmenityMutation();
  const [deleteAmenity] = useDeleteAmenityMutation();

  const filteredAmenities = amenities.filter((a: WorkplaceAmenity) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(s) ||
      (a.iconName && a.iconName.toLowerCase().includes(s)) ||
      (a.description && a.description.toLowerCase().includes(s))
    );
  });

  const withIconCount = amenities.filter((a) => Boolean(a.iconName)).length;
  const withDescCount = amenities.filter((a) => Boolean(a.description)).length;
  const totalSeatsEquipped = amenities.reduce((acc, a) => acc + (a.seatCount || 0), 0);

  const handleCreateAmenitySubmit = async (values: AmenityFormValues) => {
    try {
      await createAmenity({
        name: values.name.trim(),
        iconName: values.iconName?.trim() || undefined,
        description: values.description?.trim() || undefined,
      }).unwrap();

      toast.success(`Đã thêm tiện ích "${values.name}" thành công!`);
      setIsDialogOpen(false);
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message || "Thêm tiện ích thất bại. Tên tiện ích có thể đã tồn tại.";
      toast.error(msg);
    }
  };

  const handleDeleteAmenity = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tiện ích "${name}"?`)) return;

    try {
      await deleteAmenity(id).unwrap();
      toast.success(`Đã xóa tiện ích "${name}" thành công!`);
      refetch();
    } catch (err: any) {
      const msg = err?.data?.message || "Xóa tiện ích thất bại. Tiện ích này có thể đang được gắn vào bàn làm việc.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header Standard Rule 02 ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Sparkles className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý Tiện ích Bàn làm việc</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tiện ích bàn làm việc</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-9 gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tiện ích mới</span>
          </Button>
        </div>
      </div>

      {/* ── 4 KPI Cards Standard Rule 03 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng số tiện ích</p>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {amenities.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Có biểu tượng icon</p>
              <p className="text-2xl font-bold tracking-tight text-blue-600 mt-1">
                {withIconCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
              <Tag className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Có mô tả công năng</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-1">
                {withDescCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Lượt bàn trang bị</p>
              <p className="text-2xl font-bold tracking-tight text-purple-600 mt-1">
                {totalSeatsEquipped}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
              <Armchair className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2-Row Filter Bar Standard Rule 03 ────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên tiện ích, mã biểu tượng, mô tả chi tiết..."
            className="pl-9 pr-9 h-9 text-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="flex justify-end pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Xóa bộ lọc</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Table Standard Rule 04 ────────────────────────────────────────── */}
      <WorkplaceAmenityTable
        amenities={filteredAmenities}
        isLoading={isLoading}
        onDelete={handleDeleteAmenity}
      />

      {/* ── Form Dialog Standard Rule 05 ─────────────────────────────────── */}
      <AmenityFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateAmenitySubmit}
        isSubmitting={isCreating}
      />
    </div>
  );
}
