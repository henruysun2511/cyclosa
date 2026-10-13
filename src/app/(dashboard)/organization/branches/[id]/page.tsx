"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Save,
  Trash2,
  Users,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPicker,
  MapCoordinates,
  StatusBadge,
  ConfirmReasonDialog,
} from "@/components/shared";

export default function BranchDetailPage() {
  const [coords, setCoords] = useState<MapCoordinates>({
    lat: 21.028511,
    lng: 105.854444,
    radiusMeters: 200,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Breadcrumb & Navigation ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/organization/regions-branches">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại danh sách chi nhánh
          </Link>
        </Button>

        <Badge variant="outline" className="font-mono text-xs">ORG-04</Badge>
      </div>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Building className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Trụ Sở Chính — Tòa Nhà FSI Tower
            </h1>
            <StatusBadge status="ACTIVE" />
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Mã định danh: <strong>HN-HQ</strong> • Khu vực: <strong>Miền Bắc</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs h-9 text-rose-600 border-rose-200 hover:bg-rose-50"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Xóa chi nhánh
          </Button>

          <Button
            className="bg-primary hover:bg-primary/90 text-white text-xs h-9"
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isSaved ? "Đã lưu thành công!" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* ── General Info Form Card ──────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border">
          <CardTitle className="text-sm font-semibold">Thông tin hành chính văn phòng</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs">Tên chi nhánh / Văn phòng *</Label>
            <Input defaultValue="Trụ Sở Chính — Tòa Nhà FSI Tower" className="text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Mã chi nhánh *</Label>
            <Input defaultValue="HN-HQ" className="text-xs font-mono uppercase" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Địa chỉ thực tế *</Label>
            <Input defaultValue="Tầng 8-12, Tòa nhà FSI, Số 18 Cầu Giấy, Quận Cầu Giấy, Hà Nội" className="text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Số lượng nhân sự hiện tại</Label>
            <div className="flex items-center gap-2 p-2 rounded border bg-slate-50 font-mono">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">310 nhân viên trực thuộc</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Số điện thoại liên hệ</Label>
            <Input defaultValue="(024) 3768 9999" className="text-xs font-mono" />
          </div>
        </CardContent>
      </Card>

      {/* ── Geofencing MapPicker Card ───────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-rose-500" />
            <CardTitle className="text-sm font-semibold">
              Cấu hình Tọa độ & Bán kính Chấm công Geofencing
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground mb-4">
            Nhân viên sử dụng ứng dụng di động chấm công khuôn mặt Face ID phải nằm trong bán kính hợp lệ xung quanh tọa độ này.
          </p>
          <MapPicker value={coords} onChange={setCoords} />
        </CardContent>
      </Card>

      {/* Delete Confirmation Reason Modal */}
      <ConfirmReasonDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Xóa chi nhánh văn phòng"
        description="Chỉ có thể xóa chi nhánh khi không còn nhân viên nào trực thuộc và đã hoàn tất thanh lý tài sản cơ sở."
        reasonLabel="Lý do xóa / Quyết định đóng cửa văn phòng"
        reasonPlaceholder="Nhập lý do đóng chi nhánh..."
        confirmText="Xác nhận xóa"
        variant="destructive"
        onConfirm={async () => {
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
