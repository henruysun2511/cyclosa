"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Layers,
  MapPin,
  Plus,
  ArrowLeft,
  RefreshCw,
  Compass,
  Eye,
  Sparkles,
  SlidersHorizontal,
  FileCode2,
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
  useGetSiteByIdQuery,
  useGetFloorsBySiteIdQuery,
  useGetFloorMapQuery,
  useCreateFloorMutation,
  WorkplaceFloorStack,
  InteractiveFloorCanvas,
  type WorkplaceFloor,
} from "@/features/workplace";

export default function WorkplaceSiteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params?.id as string;

  const [selectedFloor, setSelectedFloor] = useState<WorkplaceFloor | null>(null);
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState(false);
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [floorName, setFloorName] = useState("");
  const [floorDesc, setFloorDesc] = useState("");

  const {
    data: site,
    isLoading: isSiteLoading,
    refetch: refetchSite,
  } = useGetSiteByIdQuery(siteId, { skip: !siteId });

  const {
    data: floors = [],
    isLoading: isFloorsLoading,
    refetch: refetchFloors,
  } = useGetFloorsBySiteIdQuery(siteId, { skip: !siteId });

  const {
    data: mapData,
    isLoading: isMapLoading,
  } = useGetFloorMapQuery(selectedFloor?.id || "", {
    skip: !selectedFloor?.id,
  });

  const [createFloor, { isLoading: isCreatingFloor }] = useCreateFloorMutation();

  const handleOpenCreateFloor = () => {
    const nextNumber = floors.length > 0 ? Math.max(...floors.map((f) => f.floorNumber)) + 1 : 1;
    setFloorNumber(nextNumber);
    setFloorName(`Tầng ${nextNumber}`);
    setFloorDesc("");
    setIsFloorDialogOpen(true);
  };

  const handleCreateFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!floorName.trim()) {
      toast.warning("Vui lòng nhập tên tầng làm việc");
      return;
    }

    try {
      await createFloor({
        siteId,
        floorNumber: Number(floorNumber),
        name: floorName.trim(),
        description: floorDesc.trim(),
      }).unwrap();

      toast.success(`Đã thêm mới tầng "${floorName.trim()}" thành công!`);
      setIsFloorDialogOpen(false);
      refetchFloors();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo tầng làm việc.");
    }
  };

  if (isSiteLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-16 border rounded-2xl bg-card text-center space-y-4">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Không tìm thấy thông tin tòa nhà</h2>
        <Button asChild variant="outline">
          <Link href="/workplace/sites">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Top Header & Điều hướng ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Building2 className="w-6 h-6 text-primary shrink-0" />
            <span>
              {selectedFloor
                ? `Sơ đồ 2D: ${selectedFloor.name} — ${site.name}`
                : `Mặt bằng Tầng: ${site.name}`}
            </span>
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
            <button
              onClick={() => setSelectedFloor(null)}
              className={`hover:text-primary transition-colors ${!selectedFloor ? "text-foreground font-semibold" : ""}`}
            >
              {site.name}
            </button>
            {selectedFloor && (
              <>
                <span>/</span>
                <span className="text-foreground font-semibold">{selectedFloor.name}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {selectedFloor ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFloor(null)}
              className="h-9 gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại các tầng</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
            >
              <Link href="/workplace/sites">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Danh sách tòa nhà</span>
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchSite();
              refetchFloors();
            }}
            className="h-9 gap-1.5"
            title="Làm mới"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </Button>

          {!selectedFloor ? (
            <Button size="sm" onClick={handleOpenCreateFloor} className="h-9 gap-1.5 shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Thêm tầng mới</span>
            </Button>
          ) : (
            <Button asChild size="sm" className="h-9 gap-1.5 shadow-xs">
              <Link href={`/workplace/floors/${selectedFloor.id}/editor`}>
                <SlidersHorizontal className="w-4 h-4" />
                <span>Biên tập Sơ đồ Canvas</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── 2. View Sơ đồ Mặt bằng 2D của Tầng được chọn ─────────────────────── */}
      {selectedFloor ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-mono font-bold flex items-center justify-center text-sm shadow-sm">
                T{selectedFloor.floorNumber}
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  {selectedFloor.name} — {site.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Sơ đồ vị trí phân khu, bàn làm việc và phòng họp trực quan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Link href={`/workplace/floors/${selectedFloor.id}/plans`}>
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>Quản lý Bản vẽ CAD</span>
                </Link>
              </Button>
            </div>
          </div>

          {mapData ? (
            <InteractiveFloorCanvas mapData={mapData} />
          ) : (
            <div className="p-16 border rounded-2xl bg-card text-center space-y-3">
              <Compass className="h-10 w-10 text-muted-foreground mx-auto animate-pulse" />
              <p className="text-sm font-semibold text-foreground">
                Tầng này chưa có bản vẽ sơ đồ mặt bằng nào được xuất bản
              </p>
              <Button asChild size="sm" className="gap-1.5 mt-2">
                <Link href={`/workplace/floors/${selectedFloor.id}/editor`}>
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Biên tập sơ đồ ngay</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* ── 3. View Mô hình Tầng Xếp Chồng Kiến Trúc (Layered Floor Stack) ─── */
        <WorkplaceFloorStack
          site={site}
          floors={floors}
          isLoading={isFloorsLoading}
          onSelectFloor={(floor) => setSelectedFloor(floor)}
          onAddFloor={handleOpenCreateFloor}
          onBackToSites={() => router.push("/workplace/sites")}
        />
      )}

      {/* ── Dialog Thêm tầng mới ──────────────────────────────────────────────── */}
      <Dialog open={isFloorDialogOpen} onOpenChange={setIsFloorDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <form onSubmit={handleCreateFloor}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Thêm tầng làm việc vào {site.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="floorNum" className="text-xs">Số thứ tự tầng (Tầng số) <span className="text-rose-500">*</span></Label>
                <Input
                  id="floorNum"
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
                <Label htmlFor="fName" className="text-xs">Tên tầng làm việc <span className="text-rose-500">*</span></Label>
                <Input
                  id="fName"
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  placeholder="VD: Tầng 12 — Khối Kỹ thuật"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fDesc" className="text-xs">Mô tả quy hoạch mặt bằng</Label>
                <Textarea
                  id="fDesc"
                  value={floorDesc}
                  onChange={(e) => setFloorDesc(e.target.value)}
                  placeholder="VD: Khu vực dành riêng cho các khối DEV, R&D..."
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
