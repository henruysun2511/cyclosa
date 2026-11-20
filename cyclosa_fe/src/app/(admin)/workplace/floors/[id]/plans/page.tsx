"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileCheck,
  Plus,
  RefreshCw,
  Compass,
  CheckCircle2,
  Archive,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  useGetFloorPlansQuery,
  useCreateFloorPlanMutation,
  usePublishFloorPlanMutation,
  useArchiveFloorPlanMutation,
  type WorkplaceFloorPlan,
} from "@/features/workplace";

export default function WorkplaceFloorPlansPage() {
  const router = useRouter();
  const params = useParams();
  const floorId = params?.id as string;

  const { data: plans = [], isLoading, isFetching, refetch } = useGetFloorPlansQuery(floorId, { skip: !floorId });
  const [createFloorPlan, { isLoading: isCreating }] = useCreateFloorPlanMutation();
  const [publishFloorPlan] = usePublishFloorPlanMutation();
  const [archiveFloorPlan] = useArchiveFloorPlanMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [scaleMetersPerPx, setScaleMetersPerPx] = useState(0.05);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nextVersion = plans.length + 1;
      await createFloorPlan({
        floorId,
        versionNo: nextVersion,
        canvasWidth: Number(canvasWidth),
        canvasHeight: Number(canvasHeight),
        scaleMetersPerPx: Number(scaleMetersPerPx),
      }).unwrap();

      toast.success(`Đã tạo bản vẽ mặt bằng phiên bản v${nextVersion} thành công!`);
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tạo bản vẽ mặt bằng mới.");
    }
  };

  const handlePublish = async (planId: string, versionNo: number) => {
    try {
      await publishFloorPlan(planId).unwrap();
      toast.success(`Đã xuất bản chính thức bản vẽ phiên bản v${versionNo}!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xuất bản bản vẽ.");
    }
  };

  const handleArchive = async (planId: string, versionNo: number) => {
    try {
      await archiveFloorPlan(planId).unwrap();
      toast.success(`Đã chuyển bản vẽ v${versionNo} sang lưu trữ.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu trữ bản vẽ.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <FileCheck className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý Phiên bản Bản vẽ Mặt bằng</span>
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
            <Link href="/workplace/floors" className="hover:text-primary transition-colors">
              Tầng làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Phiên bản mặt bằng</span>
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/workplace/floors/${floorId}/editor`)}
            className="h-9 gap-1.5"
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>Mở Canvas Editor</span>
          </Button>

          <Button size="sm" onClick={() => setIsDialogOpen(true)} className="h-9 gap-1.5 shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Tạo bản vẽ mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Bảng Danh sách Phiên bản Bản vẽ Mặt bằng (Table-Embedded Empty State) */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-24 text-center text-xs font-semibold">Phiên bản</TableHead>
              <TableHead className="text-xs font-semibold">Kích thước Canvas (W x H)</TableHead>
              <TableHead className="text-xs font-semibold">Tỷ lệ Scale (m/px)</TableHead>
              <TableHead className="w-36 text-center text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold">Thời điểm tạo</TableHead>
              <TableHead className="w-56 text-center text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-center"><Skeleton className="h-5 w-12 mx-auto rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-8 w-44 mx-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-muted-foreground text-xs">
                  Chưa có phiên bản bản vẽ mặt bằng nào. Bấm &quot;Tạo bản vẽ mới&quot; để khởi tạo sơ đồ tầng.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => {
                const isPublished = plan.status === "PUBLISHED";
                const isArchived = plan.status === "ARCHIVED";

                return (
                  <TableRow key={plan.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center font-mono font-bold text-xs text-primary">
                      v{plan.versionNo}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {plan.canvasWidth} x {plan.canvasHeight} px
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {plan.scaleMetersPerPx} m/px
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={isPublished ? "default" : isArchived ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {isPublished ? "Đang áp dụng (Published)" : isArchived ? "Lưu trữ (Archived)" : "Bản nháp (Draft)"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {plan.createdAt ? new Date(plan.createdAt).toLocaleString("vi-VN") : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/workplace/floors/${floorId}/editor`)}
                          className="h-7 text-xs gap-1"
                        >
                          <Compass className="w-3.5 h-3.5 text-primary" />
                          <span>Mở Editor</span>
                        </Button>

                        {!isPublished && (
                          <Button
                            size="sm"
                            onClick={() => handlePublish(plan.id, plan.versionNo)}
                            className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Xuất bản</span>
                          </Button>
                        )}

                        {isPublished && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchive(plan.id, plan.versionNo)}
                            className="h-7 text-xs gap-1 text-muted-foreground"
                          >
                            <Archive className="w-3.5 h-3.5" />
                            <span>Lưu trữ</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Tạo Bản vẽ Mới */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Tạo mới Phiên bản Bản vẽ Mặt bằng</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chiều rộng Canvas (px) *</Label>
                <Input
                  type="number"
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(Number(e.target.value))}
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Chiều cao Canvas (px) *</Label>
                <Input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(Number(e.target.value))}
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tỷ lệ đo đạc Scale (Mét / Pixel) *</Label>
              <Input
                type="number"
                step="0.001"
                value={scaleMetersPerPx}
                onChange={(e) => setScaleMetersPerPx(Number(e.target.value))}
                placeholder="VD: 0.05"
                className="text-xs h-9"
                required
              />
              <p className="text-[11px] text-muted-foreground">Mặc định: 1 pixel tương ứng 0.05 mét (5cm).</p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isCreating}>
                {isCreating ? "Đang tạo..." : "Tạo phiên bản bản vẽ"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
