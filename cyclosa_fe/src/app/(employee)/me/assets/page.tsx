"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Wrench,
  PackageOpen,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyAssetsQuery } from "@/features/asset/api/asset-api";
import {
  useReportIssueMutation,
  useGetMySeatQuery,
} from "@/features/workplace/api/workplace-api";
import type { AssetAssignment } from "@/features/asset/types/asset.types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
}

const CONDITION_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  NEW: { label: "Mới 100%", variant: "default" },
  GOOD: { label: "Tốt", variant: "secondary" },
  FAIR: { label: "Bình thường", variant: "outline" },
  POOR: { label: "Kém / Cần bảo dưỡng", variant: "destructive" },
  DAMAGED: { label: "Hỏng", variant: "destructive" },
};

export default function EmployeeAssetsPage() {
  const { data: assets, isLoading } = useGetMyAssetsQuery();
  const { data: mySeat } = useGetMySeatQuery();
  const [reportIssue, { isLoading: isReporting }] = useReportIssueMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetAssignment | null>(null);
  const [issueType, setIssueType] = useState("EQUIPMENT");
  const [severity, setSeverity] = useState("MEDIUM");
  const [description, setDescription] = useState("");

  const activeAssets = (assets || []).filter((a) => a.active);
  const totalAssetsCount = activeAssets.length;
  const goodConditionCount = activeAssets.filter(
    (a) => !a.conditionOnAssign || a.conditionOnAssign === "GOOD" || a.conditionOnAssign === "NEW"
  ).length;

  const handleOpenReportDialog = (asset?: AssetAssignment) => {
    setSelectedAsset(asset || (activeAssets.length > 0 ? activeAssets[0] : null));
    setIssueType("EQUIPMENT");
    setSeverity("MEDIUM");
    setDescription("");
    setIsDialogOpen(true);
  };

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.warning("Vui lòng mô tả chi tiết tình trạng sự cố thiết bị");
      return;
    }

    try {
      const title = selectedAsset
        ? `Sự cố thiết bị: ${selectedAsset.assetName} (${selectedAsset.assetCode})`
        : "Sự cố thiết bị làm việc";

      await reportIssue({
        issueType,
        severity,
        title,
        description: description.trim(),
        seatId: mySeat?.id,
      }).unwrap();

      toast.success("Báo cáo sự cố thiết bị đã được gửi thành công tới bộ phận Quản trị / IT!");
      setIsDialogOpen(false);
      setDescription("");
      setSelectedAsset(null);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Gửi báo cáo sự cố thất bại. Vui lòng thử lại.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Laptop className="w-6 h-6 text-primary shrink-0" />
            <span>Tài sản & Thiết bị</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tài sản & Thiết bị</span>
          </nav>
        </div>
      </div>

      {/* 2. Thống kê nhanh chuẩn Rule 03 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Thiết bị đang nắm giữ */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-primary text-white">
              <Laptop className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Thiết bị đang nắm giữ
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {isLoading ? "--" : totalAssetsCount.toString().padStart(2, "0")}
                <span className="text-xs font-normal text-muted-foreground ml-1.5 font-sans">thiết bị</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                {totalAssetsCount > 0
                  ? activeAssets.map((a) => a.assetName).slice(0, 2).join(", ")
                  : "Chưa có thiết bị nào"}
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 35 Q 25 25, 50 18 T 100 8"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Tình trạng sử dụng */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-emerald-500/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-emerald-600 text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Tình trạng sử dụng
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {isLoading
                  ? "--"
                  : totalAssetsCount > 0
                    ? `${Math.round((goodConditionCount / totalAssetsCount) * 100)}%`
                    : "100%"}
                <span className="text-xs font-normal text-muted-foreground ml-1.5 font-sans">hoạt động tốt</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                {totalAssetsCount - goodConditionCount > 0
                  ? `${totalAssetsCount - goodConditionCount} thiết bị cần chú ý`
                  : "Hoạt động ổn định"}
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 38 Q 30 20, 60 15 T 100 5"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Biên bản bàn giao */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-blue-500/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-blue-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Biên bản bàn giao
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {isLoading ? "--" : totalAssetsCount.toString().padStart(2, "0")}
                <span className="text-xs font-normal text-muted-foreground ml-1.5 font-sans">biên bản</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                Đầy đủ hồ sơ quản lý
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 30 Q 35 15, 70 12 T 100 6"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Bảng danh sách tài sản */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold text-foreground">
            Danh mục tài sản được cấp phát
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Mã tài sản</TableHead>
                  <TableHead className="font-semibold text-xs">Tên thiết bị</TableHead>
                  <TableHead className="font-semibold text-xs">Loại tài sản</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày bàn giao</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Tình trạng</TableHead>
                  <TableHead className="font-semibold text-xs">Ghi chú bàn giao</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : activeAssets.length > 0 ? (
                  activeAssets.map((asset) => {
                    const cond = asset.conditionOnAssign
                      ? CONDITION_MAP[asset.conditionOnAssign] || { label: asset.conditionOnAssign, variant: "secondary" as const }
                      : { label: "Mới 100%", variant: "default" as const };
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-semibold text-xs text-foreground font-mono">
                          {asset.assetCode}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground">
                          {asset.assetName}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {asset.categoryName || "Thiết bị CNTT"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(asset.assignedAt)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge variant={cond.variant} className="text-[10px]">
                            {cond.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {asset.notes || "Bàn giao phục vụ công việc"}
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReportDialog(asset)}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 gap-1.5 cursor-pointer"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Báo sự cố</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <PackageOpen className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Hiện bạn chưa được cấp phát tài sản hoặc thiết bị nào</p>
                        <p className="text-xs text-muted-foreground">Các thiết bị máy tính, màn hình sau khi bàn giao sẽ hiển thị tại đây</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Báo cáo sự cố thiết bị trực tiếp */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-destructive" />
              <span>Báo hỏng / Sự cố thiết bị</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Gửi thông tin sự cố phần cứng, phần mềm tới bộ phận Quản trị / IT để được hỗ trợ kịp thời
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Thiết bị:</span>
                <span className="font-semibold text-foreground">{selectedAsset.assetName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mã tài sản:</span>
                <span className="font-mono font-bold text-primary">{selectedAsset.assetCode}</span>
              </div>
              {selectedAsset.categoryName && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Loại thiết bị:</span>
                  <span>{selectedAsset.categoryName}</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmitIssue} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Loại sự cố</Label>
              <Select value={issueType} onValueChange={(val) => setIssueType(val || "EQUIPMENT")}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQUIPMENT">Hỏng hóc phần cứng / thiết bị</SelectItem>
                  <SelectItem value="ELECTRICAL">Chập chờn nguồn điện / bộ sạc</SelectItem>
                  <SelectItem value="NETWORK">Lỗi kết nối / phần mềm</SelectItem>
                  <SelectItem value="OTHER">Vấn đề khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Mức độ ưu tiên</Label>
              <Select value={severity} onValueChange={(val) => setSeverity(val || "MEDIUM")}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Thấp - Vẫn có thể tạm sử dụng</SelectItem>
                  <SelectItem value="MEDIUM">Trung bình - Ảnh hưởng công việc</SelectItem>
                  <SelectItem value="HIGH">Cao - Thiết bị ngừng hoạt động</SelectItem>
                  <SelectItem value="CRITICAL">Khẩn cấp - Nguy cơ chập cháy / hỏng lan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Mô tả chi tiết tình trạng sự cố <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={3}
                placeholder="VD: Màn hình bị sọc ngang, quạt tản nhiệt kêu to hoặc sạc pin không vào..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                disabled={isReporting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isReporting}
                className="bg-destructive hover:bg-destructive/90 text-white gap-1.5 cursor-pointer"
              >
                {isReporting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Gửi báo cáo sự cố</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
