"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Monitor,
  Calendar,
  CheckCircle2,
  Users,
  QrCode,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloorCanvas2D, DeskNode } from "@/components/shared";

export default function MyWorkplacePage() {
  const [selectedDesk, setSelectedDesk] = useState<DeskNode | null>(null);
  const [bookedDesk, setBookedDesk] = useState<string>("Bàn A-04 (Tầng 8)");

  return (
    <div className="space-y-6">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Workplace — Bàn Làm Việc & Phòng Họp
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cổng tiện ích văn phòng số — Đặt bàn linh hoạt (Hot-desking), đặt phòng họp và quét mã QR xác nhận.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">WP-15</Badge>
      </div>

      {/* ── Today Booking Info Card ─────────────────────────────────── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
            <Monitor className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-300 font-medium">Chỗ ngồi làm việc của bạn hôm nay:</span>
              <Badge className="bg-emerald-500 text-white text-2xs">Đang sử dụng</Badge>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{bookedDesk}</h2>
            <p className="text-2xs text-slate-300 font-mono">
              Zone A — Technology Hub • Giờ giữ chỗ: 08:00 — 18:00
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20">
            <QrCode className="h-3.5 w-3.5 mr-1.5" />
            Mã QR nhận chỗ
          </Button>
          <Button size="sm" className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white">
            Trả bàn sớm
          </Button>
        </div>
      </div>

      {/* ── Interactive 2D Floor Plan Canvas ─────────────────────────── */}
      <FloorCanvas2D
        floorName="Tầng 8 — Trụ Sở Chính (FSI Tower) — Chọn bàn để đặt chỗ"
        onSelectDesk={(desk) => setSelectedDesk(desk)}
      />
    </div>
  );
}
