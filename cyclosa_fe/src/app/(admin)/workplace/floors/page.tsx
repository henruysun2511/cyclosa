"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Layers,
  Building2,
  Compass,
  Plus,
  RefreshCw,
  ArrowLeft,
  FileCheck,
  Trash2,
  Edit,
  SlidersHorizontal,
  FileCode2,
  Users,
  Grid,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetSitesQuery,
  useGetFloorsBySiteIdQuery,
  useCreateFloorMutation,
  useUpdateFloorMutation,
  useDeleteFloorMutation,
  WorkplaceStatsCards,
  WorkplaceFloorList,
  type WorkplaceFloor,
} from "@/features/workplace";

export default function WorkplaceFloorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId") || "";

  // 1. Lấy danh sách tòa nhà
  const { data: sitesData, isLoading: isSitesLoading } = useGetSitesQuery({ size: 100 });
  const sites = sitesData?.items || [];

  const [selectedSiteId, setSelectedSiteId] = useState<string>(initialSiteId);
  const activeSiteId = selectedSiteId || sites[0]?.id || "";
  const activeSite = sites.find((s) => s.id === activeSiteId) || sites[0] || null;

  useEffect(() => {
    if (!selectedSiteId && sites.length > 0) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId]);

  // 2. Lấy danh sách tầng của tòa nhà đang chọn
  const {
    data: floors = [],
    isLoading: isFloorsLoading,
    isFetching,
    refetch,
  } = useGetFloorsBySiteIdQuery(activeSiteId, {
    skip: !activeSiteId,
  });

  // Tầng đang được chọn để xem chi tiết bên phải
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const activeFloor = floors.find((f) => f.id === selectedFloorId) || floors[0] || null;

  useEffect(() => {
    if (floors.length > 0 && (!selectedFloorId || !floors.some((f) => f.id === selectedFloorId))) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  // Dialog Thêm tầng mới
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [floorName, setFloorName] = useState("");
  const [floorDesc, setFloorDesc] = useState("");

  // Dialog Sửa tầng
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFloorName, setEditFloorName] = useState("");
  const [editFloorDesc, setEditFloorDesc] = useState("");

  // Mutations
  const [createFloor, { isLoading: isCreating }] = useCreateFloorMutation();
  const [updateFloor, { isLoading: isUpdating }] = useUpdateFloorMutation();
  const [deleteFloor] = useDeleteFloorMutation();

  const handleOpenCreateFloor = () => {
    const nextNum = floors.length > 0 ? Math.max(...floors.map((f) => f.floorNumber)) + 1 : 1;
    setFloorNumber(nextNum);
    setFloorName(`Tầng ${nextNum}`);
    setFloorDesc("");
    setIsCreateDialogOpen(true);
  };

  const handleCreateFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floorName.trim()) {
      toast.warning("Vui lòng nhập tên tầng làm việc");
      return;
    }

    try {
      const res = await createFloor({
        siteId: activeSiteId,
        floorNumber: Number(floorNumber),
        name: floorName.trim(),
        description: floorDesc.trim() || undefined,
      }).unwrap();

      toast.success(`Đã thêm mới tầng "${floorName.trim()}" thành công!`);
      setIsCreateDialogOpen(false);
      setFloorName("");
      setFloorDesc("");
      refetch();
      if (res?.id) setSelectedFloorId(res.id);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo tầng làm việc.");
    }
  };

  const handleOpenEditFloor = (floor: WorkplaceFloor) => {
    setEditFloorName(floor.name);
    setEditFloorDesc(floor.description || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFloor?.id) return;
    if (!editFloorName.trim()) {
      toast.warning("Vui lòng nhập tên tầng làm việc");
      return;
    }

    try {
      await updateFloor({
        id: activeFloor.id,
        name: editFloorName.trim(),
        description: editFloorDesc.trim() || undefined,
      }).unwrap();

      toast.success(`Đã cập nhật tầng "${editFloorName.trim()}" thành công!`);
      setIsEditDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật thông tin tầng.");
    }
  };

  const handleDeleteFloor = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa tầng "${name}" không? Toàn bộ sơ đồ mặt bằng và chỗ ngồi sẽ bị xóa vĩnh viễn.`
      )
    ) {
      return;
    }

    try {
      await deleteFloor(id).unwrap();
      toast.success(`Đã xóa tầng "${name}" thành công!`);
      if (selectedFloorId === id) setSelectedFloorId(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa tầng này.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Layers className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý Tầng & Sơ đồ Mặt bằng</span>
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
            <Link href="/workplace/sites" className="hover:text-primary transition-colors">
              Tòa nhà & Cơ sở
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">
              Mặt bằng Tầng {activeSite ? `— ${activeSite.name}` : ""}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Stats Cards ───────────────────────────────────────────────── */}
      <WorkplaceStatsCards
        totalSites={sites.length}
        totalFloors={floors.length}
        totalSeats={floors.reduce((acc, f) => acc + (f.seatCount || 0), 0)}
        isLoading={isFloorsLoading || isSitesLoading}
      />

      {/* ── 3. Bố cục thống nhất Master-Detail: Bên trái Danh sách Tầng (rộng hơn), Bên phải Thông tin khi click ── */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* ── CỘT BÊN TRÁI: Danh sách Tầng (Rộng hơn, Chỉ có Icon to + Tên ở dưới) ─────────────── */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-7">
          <WorkplaceFloorList
            floors={floors}
            sites={sites}
            selectedSiteId={activeSiteId}
            selectedFloorId={activeFloor?.id || null}
            onSelectSite={(siteId) => {
              setSelectedSiteId(siteId);
              setSelectedFloorId(null);
            }}
            onSelectFloor={(floor) => setSelectedFloorId(floor.id)}
            onOpenFloorPlan={(floor) => router.push(`/workplace/floors/${floor.id}`)}
            onAddNewFloor={handleOpenCreateFloor}
            isLoading={isFloorsLoading || isSitesLoading}
          />
        </div>

        {/* ── CỘT BÊN PHẢI: Thông tin Tầng khi Click ─────────────────────────── */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-5 space-y-6">
          {activeFloor ? (
            <Card className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
              {/* Header Thẻ Tầng */}
              <CardHeader className="p-5 border-b border-border/70 bg-muted/10 space-y-4">
                {/* Hàng nút thao tác nhỏ gọn ở trên: Nút Quay lại bên trái, Cụm thao tác bên phải */}
                <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3 flex-wrap">
                  <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground">
                    <Link href="/workplace/sites">
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Quay lại</span>
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button asChild size="sm" className="h-7 px-2.5 text-xs gap-1 shadow-xs">
                      <Link href={`/workplace/floors/${activeFloor.id}`}>
                        <Compass className="w-3.5 h-3.5" />
                        <span>Mặt bằng</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-7 px-2.5 text-xs gap-1">
                      <Link href={`/workplace/floors/${activeFloor.id}/plans`}>
                        <FileCode2 className="w-3.5 h-3.5" />
                        <span>Phiên bản</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditFloor(activeFloor)}
                      className="h-7 px-2.5 text-xs gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFloor(activeFloor.id, activeFloor.name)}
                      className="h-7 px-2.5 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </Button>
                  </div>
                </div>

                {/* Khối thông tin Tầng: Trải rộng 100% chiều ngang, không bị chèn ép */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-mono font-bold flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[9px] uppercase font-sans tracking-tight text-primary-foreground/80">TẦNG</span>
                    <span className="text-lg leading-none">{activeFloor.floorNumber}</span>
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                        {activeFloor.name}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {activeSite?.name || activeFloor.siteName}
                      </Badge>
                      {activeFloor.publishedPlanVersion ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Bản vẽ v{activeFloor.publishedPlanVersion}</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px] text-muted-foreground gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Chưa có bản vẽ</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Thống kê 3 chỉ số nhanh của Tầng */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <Grid className="w-3.5 h-3.5 text-primary" />
                      Phân khu
                    </span>
                    <span className="text-xl font-extrabold text-foreground block mt-1">
                      {activeFloor.zoneCount || 0} khu
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Chỗ ngồi
                    </span>
                    <span className="text-xl font-extrabold text-foreground block mt-1">
                      {activeFloor.seatCount || 0} bàn
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-center">
                    <span className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-primary" />
                      Bản vẽ 2D
                    </span>
                    <span className="text-sm font-bold text-foreground block mt-1 truncate">
                      {activeFloor.publishedPlanVersion ? `v${activeFloor.publishedPlanVersion}` : "Chưa có"}
                    </span>
                  </div>
                </div>

                {/* Mô tả quy hoạch của Tầng */}
                {activeFloor.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-foreground">Mô tả quy hoạch tầng:</h4>
                    <p className="text-xs text-muted-foreground bg-muted/20 p-3.5 rounded-xl border border-border/40 leading-relaxed">
                      {activeFloor.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-16 border rounded-2xl bg-card text-center space-y-3">
              <Layers className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <h3 className="font-bold text-base text-foreground">Chưa có tầng nào trong cơ sở này</h3>
              <p className="text-xs text-muted-foreground">
                Hãy nhấn &quot;Thêm tầng mới&quot; để tạo tầng đầu tiên cho tòa nhà.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Dialog Thêm Tầng mới ────────────────────────────────────────────── */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleCreateFloor}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Thêm tầng mới vào {activeSite?.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="createFloorNumber" className="text-xs">
                  Số thứ tự tầng (Tầng số) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="createFloorNumber"
                  type="number"
                  min={-5}
                  max={120}
                  value={floorNumber}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    setFloorNumber(num);
                    if (!floorName || floorName.startsWith("Tầng ")) {
                      setFloorName(`Tầng ${num}`);
                    }
                  }}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="createFloorName" className="text-xs">
                  Tên tầng làm việc <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="createFloorName"
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  placeholder="VD: Tầng 12 — Khối Kỹ thuật"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="createFloorDesc" className="text-xs">
                  Mô tả quy hoạch mặt bằng
                </Label>
                <Textarea
                  id="createFloorDesc"
                  value={floorDesc}
                  onChange={(e) => setFloorDesc(e.target.value)}
                  placeholder="VD: Khu vực dành riêng cho bộ phận DEV, có 2 phòng họp và 40 bàn linh hoạt..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isCreating}>
                {isCreating ? "Đang tạo..." : "Xác nhận tạo tầng"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Dialog Sửa Tầng ─────────────────────────────────────────────────── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleUpdateFloor}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                <span>Chỉnh sửa thông tin {activeFloor?.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="editFloorName" className="text-xs">
                  Tên tầng làm việc <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="editFloorName"
                  value={editFloorName}
                  onChange={(e) => setEditFloorName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editFloorDesc" className="text-xs">
                  Mô tả quy hoạch mặt bằng
                </Label>
                <Textarea
                  id="editFloorDesc"
                  value={editFloorDesc}
                  onChange={(e) => setEditFloorDesc(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" disabled={isUpdating}>
                {isUpdating ? "Đang lưu..." : "Cập nhật thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
