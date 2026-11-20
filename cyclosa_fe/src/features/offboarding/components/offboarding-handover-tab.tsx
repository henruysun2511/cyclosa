"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Armchair,
  Package,
  RotateCcw,
  CheckCircle2,
  Clock,
  Printer,
  MapPin,
  Building2,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetHandoverProtocolQuery,
  useReturnOffboardingAssetsMutation,
} from "../api/offboarding-api";

interface OffboardingHandoverTabProps {
  requestId: string;
  isCompleted?: boolean;
}

export function OffboardingHandoverTab({
  requestId,
  isCompleted = false,
}: OffboardingHandoverTabProps) {
  const { data: protocolRes, isLoading, refetch } =
    useGetHandoverProtocolQuery(requestId);
  const [returnAssets, { isLoading: isReturning }] =
    useReturnOffboardingAssetsMutation();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [condition, setCondition] = useState("GOOD");
  const [notes, setNotes] = useState("");

  const protocol = protocolRes?.data;
  const releasedSeat = protocol?.releasedSeat;
  const assets = protocol?.assets || [];
  const totalAssets = protocol?.totalAssets || 0;
  const returnedAssets = protocol?.returnedAssets || 0;
  const remainingAssets = totalAssets - returnedAssets;

  const handleReturnAll = async () => {
    try {
      await returnAssets({
        requestId,
        payload: {
          condition,
          notes: notes.trim() || undefined,
        },
      }).unwrap();

      toast.success("Đã thu hồi toàn bộ tài sản về kho và cập nhật hạng mục bàn giao!");
      setOpenConfirmDialog(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Thu hồi tài sản thất bại");
    }
  };

  const handlePrintProtocol = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 bg-muted animate-pulse rounded-xl" />
        <div className="h-48 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Action Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Biên bản Liên thông: Giải phóng Chỗ ngồi & Thu hồi Tài sản</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tự động giải phóng vị trí trên sơ đồ tầng 2D và thu hồi thiết bị công ty về kho
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintProtocol}
            className="text-xs h-8 gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>In biên bản bàn giao</span>
          </Button>

          {!isCompleted && remainingAssets > 0 && (
            <Button
              size="sm"
              onClick={() => setOpenConfirmDialog(true)}
              className="text-xs h-8 gap-1.5 shadow-2xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Thu hồi toàn bộ tài sản về kho ({remainingAssets})</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── 1. Khối Chỗ ngồi làm việc (Workplace Integration) ───────────── */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Armchair className="h-4 w-4 text-primary" />
              <span>1. Chỗ ngồi làm việc & Sơ đồ tầng (Workplace)</span>
            </div>
            {releasedSeat?.isReleased && (
              <Badge className="bg-emerald-600 text-white text-xs">
                Đã giải phóng thành bàn trống
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {releasedSeat ? (
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-foreground">
                    Bàn làm việc: {releasedSeat.seatCode}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {releasedSeat.zoneName || "Khu vực làm việc"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>{releasedSeat.siteName || "Cơ sở"}</span>
                  <span>•</span>
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{releasedSeat.floorName || "Tầng làm việc"}</span>
                </p>

                {releasedSeat.isReleased ? (
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-1 mt-2">
                    <p className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Đã tự động giải phóng chỗ ngồi trên sơ đồ mặt bằng vào lúc:{" "}
                      {releasedSeat.releasedAt
                        ? new Date(releasedSeat.releasedAt).toLocaleString("vi-VN")
                        : "Vừa xong"}
                    </p>
                    {releasedSeat.releaseNote && (
                      <p className="text-[11px] text-muted-foreground italic pl-5">
                        Ghi chú: {releasedSeat.releaseNote}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 flex items-center gap-1.5 pt-1">
                    <Clock className="h-3.5 w-3.5" />
                    Bàn đang được phân bổ. Sẽ tự động giải phóng khi hồ sơ thôi việc được duyệt.
                  </p>
                )}
              </div>

              <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1 shrink-0">
                <Link href="/workplace/floors">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Xem sơ đồ tầng</span>
                </Link>
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-muted-foreground bg-muted/15 rounded-xl border border-dashed border-border">
              <Armchair className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
              <p className="font-medium text-foreground">Không có chỗ ngồi cố định</p>
              <p className="text-[11px] mt-0.5">Nhân viên này làm việc theo chế độ linh hoạt (Hybrid / Hot-desk) hoặc chưa được cấp ghế cố định.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 2. Khối Thu hồi Tài sản bàn giao (Asset Integration) ─────────── */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span>2. Danh mục Tài sản cấp phát & Thu hồi ({returnedAssets}/{totalAssets})</span>
            </CardTitle>

            <div className="flex items-center gap-2">
              {remainingAssets === 0 && totalAssets > 0 ? (
                <Badge className="bg-emerald-600 text-white text-xs">
                  ✓ Đã thu hồi toàn bộ ({totalAssets}/{totalAssets})
                </Badge>
              ) : remainingAssets > 0 ? (
                <Badge className="bg-amber-500 text-white text-xs">
                  Còn {remainingAssets} thiết bị cần thu hồi
                </Badge>
              ) : null}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {assets.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground bg-muted/15 rounded-xl border border-dashed border-border">
              <Package className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
              <p className="font-medium text-foreground">Không có tài sản công ty cấp phát</p>
              <p className="text-[11px] mt-0.5">Nhân sự này hiện không giữ thiết bị nào trong phân hệ Quản lý Tài sản.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-12 text-center text-xs">STT</TableHead>
                    <TableHead className="w-32 text-xs">Mã tài sản</TableHead>
                    <TableHead className="text-xs">Tên thiết bị</TableHead>
                    <TableHead className="w-36 text-xs">Số Serial</TableHead>
                    <TableHead className="w-32 text-xs">Ngày bàn giao</TableHead>
                    <TableHead className="w-36 text-xs">Trạng thái thu hồi</TableHead>
                    <TableHead className="w-32 text-xs">Thời điểm trả</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset, idx) => {
                    return (
                      <TableRow key={asset.assignmentId} className="text-xs">
                        <TableCell className="text-center text-muted-foreground font-mono">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-primary">
                          {asset.assetCode}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{asset.assetName}</div>
                          <div className="text-[11px] text-muted-foreground">{asset.categoryName}</div>
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {asset.serialNumber || "--"}
                        </TableCell>
                        <TableCell>
                          {asset.assignedAt
                            ? new Date(asset.assignedAt).toLocaleDateString("vi-VN")
                            : "--"}
                        </TableCell>
                        <TableCell>
                          {asset.isReturned ? (
                            <Badge className="bg-emerald-600 text-white text-[10px]">
                              ✓ Đã thu hồi về kho
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500 text-white text-[10px]">
                              Đang giữ (Chưa trả)
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-[11px]">
                          {asset.returnedAt
                            ? new Date(asset.returnedAt).toLocaleString("vi-VN")
                            : "--"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Dialog Xác nhận Thu hồi tài sản 1-Click ──────────────────────── */}
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <RotateCcw className="h-5 w-5 text-emerald-600" />
              <span>Xác nhận Thu hồi {remainingAssets} Tài sản về Kho</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Thao tác này sẽ cập nhật toàn bộ {remainingAssets} thiết bị sang trạng thái{" "}
              <strong className="text-foreground">Sẵn sàng (AVAILABLE)</strong> trong kho, đồng thời tự động đánh dấu hoàn thành mục bàn giao tài sản (ASSET) sang trạng thái{" "}
              <strong className="text-emerald-600">Đã hoàn tất (CLEARED)</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Tình trạng thiết bị khi thu hồi:</label>
              <Select value={condition} onValueChange={(val: string | null) => val && setCondition(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCELLENT">Rất tốt (EXCELLENT)</SelectItem>
                  <SelectItem value="GOOD">Tốt / Bình thường (GOOD)</SelectItem>
                  <SelectItem value="FAIR">Khá / Trầy xước nhẹ (FAIR)</SelectItem>
                  <SelectItem value="POOR">Cũ / Cần bảo dưỡng (POOR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Ghi chú thu hồi (nếu có):</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ví dụ: Đã bàn giao đầy đủ phụ kiện, cáp sạc, máy hoạt động bình thường..."
                className="text-xs min-h-[70px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenConfirmDialog(false)}
              disabled={isReturning}
              className="text-xs h-8"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleReturnAll}
              disabled={isReturning}
              className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isReturning ? "Đang xử lý..." : "Xác nhận thu hồi vào kho"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
