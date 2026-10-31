"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraCapture, ConfirmReasonDialog } from "@/components/shared";

export default function MyFaceEnrollmentPage() {
  const [hasEnrolled, setHasEnrolled] = useState(true);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/me/profile">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại Hồ sơ của tôi
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">EMP-10</Badge>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dữ liệu Khuôn mặt Face ID
        </h1>
        <p className="text-xs text-muted-foreground">
          Dùng để xác thực chấm công nhanh trên thiết bị di động và máy nhận diện tại văn phòng.
        </p>
      </div>

      {showCapture ? (
        <Card className="shadow-2xs border-border">
          <CardContent className="p-4">
            <CameraCapture
              title="Đăng ký khuôn mặt mới"
              subtitle="Căn chỉnh khuôn mặt vào giữa khung tròn và làm theo hướng dẫn"
              onCapture={() => {
                setHasEnrolled(true);
                setShowCapture(false);
              }}
            />
            <div className="text-center mt-3">
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setShowCapture(false)}>
                Hủy bỏ
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : hasEnrolled ? (
        <Card className="shadow-2xs border-border text-center p-6 space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xs">
            <ShieldCheck className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Khuôn mặt đã được xác thực</h3>
            <p className="text-xs text-emerald-700 font-medium">Trạng thái: Hoạt động • Liveness đạt chuẩn FSI</p>
            <p className="text-2xs text-muted-foreground mt-1">Đăng ký ngày: 01/01/2026 09:30 • Điểm tương đồng: 99.8%</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1">
            <span className="font-semibold text-foreground">Điều khoản quyền riêng tư:</span>
            <p className="text-2xs text-muted-foreground">
              Dữ liệu sinh trắc học của bạn được mã hóa một chiều (one-way biometric template) và chỉ dùng cho mục đích chấm công và bảo mật văn phòng.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              onClick={() => setRevokeModalOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Yêu cầu xóa dữ liệu khuôn mặt
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-xs"
              onClick={() => setShowCapture(true)}
            >
              <Camera className="h-3.5 w-3.5 mr-1.5" />
              Cập nhật lại khuôn mặt
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-2xs border-border text-center p-8 space-y-4">
          <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Camera className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Chưa đăng ký Face ID</h3>
            <p className="text-xs text-muted-foreground">
              Đăng ký khuôn mặt ngay để sử dụng tính năng chấm công 1 chạm bằng điện thoại.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white text-xs"
            onClick={() => setShowCapture(true)}
          >
            Bắt đầu đăng ký khuôn mặt
          </Button>
        </Card>
      )}

      {/* Revoke confirmation dialog */}
      <ConfirmReasonDialog
        open={revokeModalOpen}
        onOpenChange={setRevokeModalOpen}
        title="Xóa dữ liệu sinh trắc học khuôn mặt"
        description="Bạn có quyền yêu cầu xóa dữ liệu khuôn mặt của mình theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Sau khi xóa, bạn sẽ chấm công bằng thẻ hoặc mã QR."
        reasonLabel="Lý do yêu cầu xóa dữ liệu"
        reasonPlaceholder="Nhập lý do xóa (lo ngại quyền riêng tư, thay đổi hình thức chấm công...)..."
        confirmText="Xác nhận xóa dữ liệu"
        variant="destructive"
        onConfirm={async () => {
          setHasEnrolled(false);
          setRevokeModalOpen(false);
        }}
      />
    </div>
  );
}
