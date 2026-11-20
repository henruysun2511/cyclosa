"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, RotateCcw, MapPin, Navigation, Pencil, Trash2 } from "lucide-react";
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
  useGetAllRegionsQuery,
  useDeleteRegionMutation,
  useGetBranchesByCompanyQuery,
  useDeleteBranchMutation,
} from "../../api/organization-api";
import { RegionFormDialog } from "../dialogs/region-form-dialog";
import { BranchFormDialog } from "../dialogs/branch-form-dialog";
import type { Region } from "../../types/region.types";
import type { Branch } from "../../types/branch.types";

interface BranchCatalogTabProps {
  companyId: string;
}

export function BranchCatalogTab({ companyId }: BranchCatalogTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Region Dialog State
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Branch Dialog State
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchRegionId, setBranchRegionId] = useState<string>("");

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "region" | "branch";
    id: string;
    name: string;
    isLoading: boolean;
  }>({
    open: false,
    type: "branch",
    id: "",
    name: "",
    isLoading: false,
  });

  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    refetch: refetchRegions,
  } = useGetAllRegionsQuery(companyId, { skip: !companyId });

  const {
    data: branches = [],
    isLoading: isBranchesLoading,
    refetch: refetchBranches,
  } = useGetBranchesByCompanyQuery(companyId, { skip: !companyId });

  const [deleteRegion] = useDeleteRegionMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  // Filter branches client-side
  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchesSearch =
        debouncedSearch.trim() === "" ||
        b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        b.code.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (b.regionName && b.regionName.toLowerCase().includes(debouncedSearch.toLowerCase()));

      const matchesRegion =
        selectedRegionFilter === "ALL" || b.regionId === selectedRegionFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? b.isActive : !b.isActive);

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [branches, debouncedSearch, selectedRegionFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedRegionFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleCreateRegion = () => {
    setSelectedRegion(null);
    setIsRegionOpen(true);
  };

  const handleEditRegion = (region: Region) => {
    setSelectedRegion(region);
    setIsRegionOpen(true);
  };

  const handleCreateBranch = () => {
    if (regions.length === 0) {
      toast.warning("Vui lòng tạo ít nhất 1 Khu vực địa lý trước khi thêm chi nhánh!");
      return;
    }
    setSelectedBranch(null);
    setBranchRegionId(regions[0].id);
    setIsBranchOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchRegionId(branch.regionId);
    setIsBranchOpen(true);
  };

  const handleDelete = (type: "region" | "branch", id: string, name: string) => {
    setDeleteConfirm({
      open: true,
      type,
      id,
      name,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
      if (deleteConfirm.type === "region") {
        await deleteRegion(deleteConfirm.id).unwrap();
        refetchRegions();
        toast.success("Xóa khu vực thành công!");
      } else {
        await deleteBranch(deleteConfirm.id).unwrap();
        refetchBranches();
        toast.success("Xóa chi nhánh thành công!");
      }
      setDeleteConfirm((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch {
      toast.error("Không thể xóa bản ghi này! Vui lòng kiểm tra ràng buộc dữ liệu liên quan.");
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
            placeholder="Tìm kiếm theo mã chi nhánh, tên chi nhánh, khu vực..."
            className="pl-9 text-xs h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Bộ lọc Khu vực + Trạng thái + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground shrink-0">
                Khu vực:
              </span>
              <Select
                value={selectedRegionFilter}
                onValueChange={(val) => val && setSelectedRegionFilter(val)}
              >
                <SelectTrigger className="h-8 text-xs bg-background flex-1">
                  <SelectValue placeholder="Tất cả khu vực">
                    {(val: string) => {
                      if (!val || val === "ALL") return `Tất cả khu vực (${regions.length})`;
                      const r = regions.find((item) => item.id === val);
                      return r ? `${r.name} (${r.code})` : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    Tất cả khu vực ({regions.length})
                  </SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.name} ({r.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 min-w-[180px]">
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
                  <SelectItem value="ACTIVE" className="text-xs">
                    Đang hoạt động
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="text-xs">
                    Tạm ngưng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || selectedRegionFilter !== "ALL" || statusFilter !== "ALL") && (
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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateRegion}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm khu vực</span>
            </Button>
            <Button
              size="sm"
              onClick={handleCreateBranch}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm chi nhánh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bố cục 2 Cột: Khu vực (1/3) & Chi nhánh (2/3) ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Danh mục Khu vực địa lý */}
        <div className="space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Khu vực địa lý ({regions.length})
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden shadow-xs">
            {isRegionsLoading ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Đang tải danh sách khu vực...
              </div>
            ) : regions.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                <p>Chưa có khu vực nào.</p>
                <Button variant="outline" size="sm" onClick={handleCreateRegion} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Thêm khu vực
                </Button>
              </div>
            ) : (
              regions.map((r) => {
                const branchCount = branches.filter((b) => b.regionId === r.id).length;
                return (
                  <div
                    key={r.id}
                    className="p-3 flex items-center justify-between hover:bg-muted/25 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-xs font-semibold text-foreground block truncate">
                        {r.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-2xs font-mono text-muted-foreground font-semibold">
                          {r.code}
                        </span>
                        <span className="text-2xs text-muted-foreground">
                          • {branchCount} chi nhánh
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-foreground cursor-pointer"
                        onClick={() => handleEditRegion(r)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-destructive cursor-pointer"
                        onClick={() => handleDelete("region", r.id, r.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cột phải: Bảng Chi nhánh & GPS Geofence */}
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Navigation className="h-3.5 w-3.5 text-primary" />
              Chi nhánh & Geofence GPS ({filteredBranches.length})
            </h2>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                  <TableHead className="w-28 text-xs font-semibold">Mã CN</TableHead>
                  <TableHead className="text-xs font-semibold">Tên chi nhánh</TableHead>
                  <TableHead className="text-xs font-semibold">Khu vực</TableHead>
                  <TableHead className="text-xs font-semibold">Tọa độ GPS</TableHead>
                  <TableHead className="w-24 text-center text-xs font-semibold">Bán kính</TableHead>
                  <TableHead className="w-24 text-center text-xs font-semibold">Trạng thái</TableHead>
                  <TableHead className="w-16 text-center text-xs font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isBranchesLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center">
                        <div className="h-4 w-6 bg-muted animate-pulse rounded mx-auto" />
                      </TableCell>
                      <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell className="text-center"><div className="h-4 w-12 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                      <TableCell className="text-center"><div className="h-5 w-16 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                      <TableCell className="text-center"><div className="h-7 w-12 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="p-0">
                      <EmptyState
                        icon={Navigation}
                        title="Không tìm thấy chi nhánh nào"
                        description={
                          searchTerm || selectedRegionFilter !== "ALL" || statusFilter !== "ALL"
                            ? "Thử thay đổi bộ lọc tìm kiếm hoặc khu vực."
                            : "Chưa có chi nhánh nào thuộc công ty này."
                        }
                        action={
                          <Button size="sm" onClick={handleCreateBranch} className="h-8 gap-1.5 text-xs">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Thêm chi nhánh</span>
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBranches.map((b, idx) => (
                    <TableRow key={b.id} className="hover:bg-muted/25 transition-colors">
                      <TableCell className="text-center text-slate-500 text-xs font-normal">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {b.code}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {b.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {b.regionName || "--"}
                      </TableCell>
                      <TableCell className="font-mono text-2xs text-muted-foreground">
                        {b.latitude && b.longitude ? (
                          <span>{b.latitude}, {b.longitude}</span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa cài GPS</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono text-xs">
                        {b.attendanceRadiusMeters}m
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`text-xs font-medium text-white border-transparent ${
                            b.isActive ? "bg-emerald-600" : "bg-slate-600"
                          }`}
                        >
                          {b.isActive ? "Hoạt động" : "Tạm ngưng"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 cursor-pointer hover:text-foreground"
                            onClick={() => handleEditBranch(b)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive cursor-pointer hover:bg-destructive/10"
                            onClick={() => handleDelete("branch", b.id, b.name)}
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
        </div>
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────── */}
      <RegionFormDialog
        open={isRegionOpen}
        onOpenChange={setIsRegionOpen}
        region={selectedRegion}
        companyId={companyId}
        onSuccess={refetchRegions}
      />

      <BranchFormDialog
        open={isBranchOpen}
        onOpenChange={setIsBranchOpen}
        branch={selectedBranch}
        regionId={branchRegionId}
        onSuccess={refetchBranches}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Xác nhận xóa ${deleteConfirm.type === "region" ? "khu vực" : "chi nhánh"}`}
        description={`Bạn có chắc chắn muốn xóa "${deleteConfirm.name}"? Hành động này sẽ ảnh hưởng đến phân quyền chấm công và dữ liệu trực thuộc.`}
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy"
        variant="destructive"
        isLoading={deleteConfirm.isLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
