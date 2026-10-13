"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  History,
  Building2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CameraCapture, StatusBadge } from "@/components/shared";

export default function MobileAttendanceCheckInPage() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCaptureComplete = () => {
    const timeStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setCheckInTime(timeStr);
    setCheckedIn(true);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Về Trang chủ
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">ATT-03</Badge>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Chấm Công Khuôn Mặt Di Động
        </h1>
        <p className="text-xs text-muted-foreground">
          Xác thực sinh trắc học Face ID và kiểm tra vị trí GPS tại chi nhánh văn phòng.
        </p>
      </div>

      {checkedIn ? (
        <Card className="shadow-md border-emerald-200 bg-white p-8 text-center space-y-5">
          <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-emerald-800">Check-in Thành Công!</h2>
            <p className="text-2xl font-black font-mono text-foreground">{checkInTime}</p>
            <StatusBadge status="PRESENT" customLabel="Đúng giờ" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-left space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Địa điểm:</span>
              <strong className="text-foreground">Trụ Sở Chính — Tòa Nhà FSI Tower</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tọa độ GPS:</span>
              <span>21.0285° N, 105.8544° E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Độ chính xác:</span>
              <strong className="text-emerald-600 font-semibold">Cách trụ sở 24m (Hợp lệ)</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs w-full sm:w-auto">
              <Link href="/me/attendance">
                <History className="h-3.5 w-3.5 mr-1.5" />
                Xem nhật ký công
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs w-full sm:w-auto">
              <Link href="/dashboard">Về Trang chủ</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-2xs border-border">
          <CardContent className="p-4">
            <CameraCapture
              title="Điểm danh vào ca (Check-in)"
              subtitle="Giữ yên khuôn mặt trong khung tròn cho đến khi có tín hiệu quét thành công"
              onCapture={handleCaptureComplete}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
