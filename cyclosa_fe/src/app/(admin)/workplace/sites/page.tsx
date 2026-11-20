"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Plus,
  RefreshCw,
  ArrowLeft,
  Layers,
  MapPin,
  Edit,
  Trash2,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useGetSitesQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
  useCreateFloorMutation,
  WorkplaceStatsCards,
  WorkplaceSiteList,
  SiteFormDialog,
  type WorkplaceSite,
  type SiteFormValues,
} from "@/features/workplace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetCompaniesQuery, useGetBranchesByCompanyQuery } from "@/features/organization";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function WorkplaceSitesPage() {
  const router = useRouter();

  // State chọn tòa nhà đang xem thông tin bên phải
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Dialog Site (Tòa nhà)
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<WorkplaceSite | null>(null);

  // Dialog thêm Tầng mới
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState(false);
  const [newFloorNumber, setNewFloorNumber] = useState<number>(1);
  const [newFloorName, setNewFloorName] = useState("");
  const [newFloorDesc, setNewFloorDesc] = useState("");

  // 1. Truy vấn danh sách tòa nhà
  const {
    data: sitesData,
    isLoading: isSitesLoading,
    isFetching: isSitesFetching,
    refetch: refetchSites,
  } = useGetSitesQuery({ size: 100 });

  const sites = sitesData?.items || [];
  const activeSite = sites.find((s) => s.id === (selectedSiteId || sites[0]?.id)) || sites[0] || null;

  // Tự động gán tòa nhà đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!selectedSiteId && sites.length > 0) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId]);

  // Mutations
  const [createSite, { isLoading: isCreatingSite }] = useCreateSiteMutation();
  const [updateSite, { isLoading: isUpdatingSite }] = useUpdateSiteMutation();
  const [deleteSite] = useDeleteSiteMutation();
  const [createFloor, { isLoading: isCreatingFloor }] = useCreateFloorMutation();

  // Danh sách chi nhánh từ Database theo Công ty
  const { data: companiesData } = useGetCompaniesQuery({});
  const activeCompanyId = companiesData?.items?.[0]?.id || "";
  const { data: branchData = [] } = useGetBranchesByCompanyQuery(activeCompanyId, {
    skip: !activeCompanyId,
  });
  const branches = branchData.length > 0
    ? branchData.map((b) => ({ id: b.id, name: b.name }))
    : [
        { id: "00000000-0000-0000-0000-000000000001", name: "Trụ sở Hà Nội" },
        { id: "00000000-0000-0000-0000-000000000002", name: "Chi nhánh TP.HCM" },
      ];

  // ── Xử lý Tòa nhà ──────────────────────────────────────────────────────────
  const handleOpenCreateSite = () => {
    setEditingSite(null);
    setIsSiteDialogOpen(true);
  };

  const handleOpenEditSite = (site: WorkplaceSite) => {
    setEditingSite(site);
    setIsSiteDialogOpen(true);
  };

  const handleDeleteSite = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tòa nhà / cơ sở "${name}" không?`)) {
      return;
    }
    try {
      await deleteSite(id).unwrap();
      toast.success(`Đã xóa cơ sở "${name}" thành công!`);
      if (activeSite?.id === id) {
        setSelectedSiteId(null);
      }
      refetchSites();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa cơ sở. Vui lòng kiểm tra lại ràng buộc dữ liệu.");
    }
  };

  const handleSubmitSiteForm = async (values: SiteFormValues) => {
    try {
      if (editingSite) {
        await updateSite({
          id: editingSite.id,
          name: values.name,
          address: values.address,
          description: values.description,
        }).unwrap();
        toast.success(`Đã cập nhật cơ sở "${values.name}" thành công!`);
      } else {
        const res = await createSite(values).unwrap();
        toast.success(`Đã thêm mới cơ sở "${values.name}" thành công!`);
        if (res?.id) setSelectedSiteId(res.id);
      }
      refetchSites();
    } catch (err: any) {
      toast.error(err?.data?.message || "Thao tác thất bại. Vui lòng thử lại sau.");
      throw err;
    }
  };

  // ── Xử lý Tầng ─────────────────────────────────────────────────────────────
  const handleOpenCreateFloor = () => {
    const nextNumber = (activeSite?.floorCount || 0) + 1;
    setNewFloorNumber(nextNumber);
    setNewFloorName(`Tầng ${nextNumber}`);
    setNewFloorDesc("");
    setIsFloorDialogOpen(true);
  };

  const handleCreateFloorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSite?.id) return;
    if (!newFloorName.trim()) {
      toast.warning("Vui lòng nhập tên tầng làm việc");
      return;
    }

    try {
      await createFloor({
        siteId: activeSite.id,
        floorNumber: Number(newFloorNumber),
        name: newFloorName.trim(),
        description: newFloorDesc.trim(),
      }).unwrap();

      toast.success(`Đã tạo mới tầng "${newFloorName.trim()}" thành công!`);
      setIsFloorDialogOpen(false);
      refetchSites();
      // Điều hướng ngay sang trang tầng của tòa nhà đó
      router.push(`/workplace/floors?siteId=${activeSite.id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo tầng làm việc mới.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Building2 className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý Tòa nhà & Cơ sở</span>
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
            <span className="text-foreground font-semibold">Tòa nhà & Cơ sở</span>
          </nav>
        </div>

        {/* Nút hành động trên Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchSites()}
            disabled={isSitesFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSitesFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Stats Cards ───────────────────────────────────────────────── */}
      <WorkplaceStatsCards
        totalSites={sites.length}
        totalFloors={sites.reduce((acc, s) => acc + (s.floorCount || 0), 0)}
        totalSeats={sites.reduce((acc, s) => acc + (s.totalSeats ?? (s.floorCount ? s.floorCount * 40 : 0)), 0)}
        isLoading={isSitesLoading}
      />

      {/* ── 3. Bố cục thống nhất: Bên trái Danh sách Tòa nhà (rộng hơn), Bên phải Thông tin khi click ── */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* ── CỘT BÊN TRÁI: Danh sách Tòa nhà (Rộng hơn, Chỉ có Icon to + Tên ở dưới) ──────────── */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-7">
          <WorkplaceSiteList
            sites={sites}
            selectedSiteId={activeSite?.id || null}
            onSelectSite={(site) => setSelectedSiteId(site.id)}
            onOpenFloors={(site) => router.push(`/workplace/floors?siteId=${site.id}`)}
            onAddNew={handleOpenCreateSite}
            isLoading={isSitesLoading}
          />
        </div>

        {/* ── CỘT BÊN PHẢI: Thông tin Tòa nhà được chọn khi click ────────────── */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-6">
          {activeSite ? (
            <Card className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              {/* Header Thẻ Tòa nhà */}
              <CardHeader className="p-5 border-b border-border/70 bg-muted/10 space-y-4">
                {/* Hàng nút thao tác nhỏ gọn ở trên: Nút Quay lại bên trái, Sửa/Xóa bên phải */}
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3 flex-wrap">
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
                    <Link href="/workplace">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại</span>
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditSite(activeSite)}
                      className="h-7 px-2.5 text-xs gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSite(activeSite.id, activeSite.name)}
                      className="h-7 px-2.5 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </Button>
                  </div>
                </div>

                {/* Khối thông tin Tòa nhà: Trải rộng 100% chiều ngang, không bị chèn ép */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                        {activeSite.name}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-[11px] font-semibold text-primary">
                        {activeSite.code}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px]">
                        {activeSite.branchName || "Trụ sở chính"}
                      </Badge>
                    </div>
                    {activeSite.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                        <span>{activeSite.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* 3 Khối chỉ số của Tòa nhà */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      Số tầng
                    </span>
                    <span className="text-xl font-extrabold text-foreground block mt-1">
                      {activeSite.floorCount || 0} tầng
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Chỗ ngồi
                    </span>
                    <span className="text-xl font-extrabold text-foreground block mt-1">
                      {activeSite.totalSeats ?? (activeSite.floorCount ? activeSite.floorCount * 40 : 0)} bàn
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      Chi nhánh
                    </span>
                    <span className="text-sm font-bold text-foreground block mt-1 truncate">
                      {activeSite.branchName || "Trụ sở chính"}
                    </span>
                  </div>
                </div>

                {/* Mô tả cơ sở */}
                {activeSite.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-foreground">Mô tả cơ sở:</h4>
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3.5 rounded-xl border border-border/40 leading-relaxed">
                      {activeSite.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-16 border rounded-2xl bg-card text-center space-y-3">
              <Building2 className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Chưa có tòa nhà nào</h3>
              <p className="text-xs text-muted-foreground">
                Hãy nhấn &quot;Thêm cơ sở mới&quot; để tạo tòa nhà đầu tiên.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Dialog Thêm / Sửa Tòa nhà ────────────────────────────────────────── */}
      <SiteFormDialog
        open={isSiteDialogOpen}
        onOpenChange={setIsSiteDialogOpen}
        site={editingSite}
        branches={branches}
        onSubmit={handleSubmitSiteForm}
        isLoading={isCreatingSite || isUpdatingSite}
      />

      {/* ── Dialog Thêm Tầng mới ────────────────────────────────────────────── */}
      <Dialog open={isFloorDialogOpen} onOpenChange={setIsFloorDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleCreateFloorSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Thêm tầng mới vào {activeSite?.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="floorNumber" className="text-xs">
                  Số thứ tự tầng (Tầng số) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="floorNumber"
                  type="number"
                  min={-5}
                  max={120}
                  value={newFloorNumber}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    setNewFloorNumber(num);
                    if (!newFloorName || newFloorName.startsWith("Tầng ")) {
                      setNewFloorName(`Tầng ${num}`);
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="floorName" className="text-xs">
                  Tên tầng làm việc <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="floorName"
                  value={newFloorName}
                  onChange={(e) => setNewFloorName(e.target.value)}
                  placeholder="VD: Tầng 12 — Khối Kỹ thuật"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="floorDesc" className="text-xs">
                  Mô tả quy hoạch mặt bằng
                </Label>
                <Textarea
                  id="floorDesc"
                  value={newFloorDesc}
                  onChange={(e) => setNewFloorDesc(e.target.value)}
                  placeholder="VD: Khu vực dành riêng cho bộ phận DEV, có 2 phòng họp và 40 bàn linh hoạt..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFloorDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isCreatingFloor}>
                {isCreatingFloor ? "Đang tạo..." : "Xác nhận tạo tầng"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
