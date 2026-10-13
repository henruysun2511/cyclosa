"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Monitor,
  Calendar,
  Users,
  AlertCircle,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Plus,
  Wrench,
  Check,
  Building2,
  Layers,
  Sparkles,
  Wifi,
  Coffee,
  Zap,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyWorkplacePage() {
  const [checkedIn, setCheckedIn] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueLocation, setIssueLocation] = useState("Bàn A-023 (Tầng 3)");

  // Danh sách sự cố mẫu
  const [issues, setIssues] = useState([
    {
      id: "iss_01",
      title: "Máy lạnh tầng 3 khu Backend phả gió quá lạnh",
      location: "Tầng 3 • Khu Backend",
      status: "IN_PROGRESS",
      statusText: "Đang xử lý",
      createdAt: "Hôm nay, 09:15"
    },
    {
      id: "iss_02",
      title: "Đèn LED rọi bàn A-021 bị chập chờn",
      location: "Bàn A-021 • Tầng 3",
      status: "RESOLVED",
      statusText: "Đã khắc phục",
      createdAt: "Hôm qua, 14:30"
    }
  ]);

  const handleCheckInToggle = () => {
    setCheckedIn(!checkedIn);
    if (!checkedIn) {
      toast.success("Check-in bàn làm việc thành công! Hệ thống đã ghi nhận hiện diện.");
    } else {
      toast.info("Đã Check-out bàn làm việc.");
    }
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim()) {
      toast.error("Vui lòng nhập nội dung sự cố.");
      return;
    }
    const newIssue = {
      id: `iss_${Date.now()}`,
      title: issueTitle,
      location: issueLocation,
      status: "IN_PROGRESS",
      statusText: "Đang xử lý",
      createdAt: "Vừa xong"
    };
    setIssues([newIssue, ...issues]);
    setIssueTitle("");
    setReportModalOpen(false);
    toast.success("Đã gửi phản ánh sự cố cơ sở vật chất tới bộ phận Office Admin & IT!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <span>Không gian làm việc của tôi</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Cá nhân
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi bàn làm việc hiện tại, lịch đặt bàn linh hoạt, phòng họp sắp tới và gửi phản ánh cơ sở vật chất.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-8.5 text-xs gap-1.5">
            <Link href="/workplace/map">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Sơ đồ chỗ ngồi 2D</span>
            </Link>
          </Button>

          <Button asChild size="sm" className="h-8.5 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
            <Link href="/workplace/desk-booking">
              <Calendar className="h-3.5 w-3.5" />
              <span>Đặt bàn Hotdesk mới</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. LAYOUT 4 KHỐI CHÍNH (THEO ĐÚNG SPEC YÊU CẦU) ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── KHỐI 1: BÀN CỦA TÔI (CURRENT DESK) ────────────────── */}
        <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <span>Bàn làm việc của tôi</span>
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-semibold px-2 py-0.5 border",
                checkedIn
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-slate-100 text-slate-700 border-slate-300"
              )}
            >
              {checkedIn ? "● ĐÃ CHECK-IN HÔM NAY" : "○ CHƯA CHECK-IN"}
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block">Vị trí chỗ ngồi</span>
                <strong className="text-2xl font-bold font-mono text-primary">
                  Bàn A-023
                </strong>
                <p className="text-xs text-foreground font-medium mt-0.5">
                  Tầng 3 • Khu Backend & Cloud • Keangnam HN
                </p>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  Loại bàn: Chỗ ngồi cố định (Fixed Desk)
                </span>
              </div>

              {/* QR Code Check-in */}
              <div className="p-2 rounded-xl border border-border bg-muted/30 flex flex-col items-center text-center">
                <QrCode className="h-16 w-16 text-primary" />
                <span className="text-[9px] text-muted-foreground font-mono mt-1">Mã Check-in</span>
              </div>
            </div>

            {/* Tiện ích tại bàn */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Trang thiết bị bàn làm việc
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>2 Màn hình Dell 4K 27\"</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Bàn nâng hạ thông minh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Cổng sạc Type-C 100W</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>Cửa sổ view Landmark 72</span>
                </div>
              </div>
            </div>

            {/* Thao tác bàn */}
            <div className="pt-2 border-t border-border flex items-center gap-2">
              <Button
                size="sm"
                variant={checkedIn ? "outline" : "default"}
                onClick={handleCheckInToggle}
                className={cn(
                  "flex-1 text-xs h-8.5 gap-1.5",
                  !checkedIn && "bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                )}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{checkedIn ? "Check-out bàn" : "Quét mã Check-in"}</span>
              </Button>

              <Button asChild size="sm" variant="outline" className="text-xs h-8.5 gap-1">
                <Link href="/workplace/map">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Xem trên bản đồ 2D</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── KHỐI 2: LỊCH ĐẶT BÀN LINH HOẠT (HOTDESK BOOKINGS) ── */}
        <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Lịch đặt bàn linh hoạt</span>
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary p-0 hover:bg-transparent">
              <Link href="/workplace/desk-booking">
                <span>+ Đặt thêm</span>
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-3 text-xs">
            {/* Mục 1: Hôm nay */}
            <div className="p-3 rounded-lg border border-red-200 bg-red-50/40 dark:bg-red-950/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-mono text-primary">07/10</strong>
                  <span className="font-semibold text-foreground">Bàn A-023 (Tầng 3)</span>
                  <Badge variant="outline" className="text-[10px] bg-red-100 text-primary border-red-200">
                    Hôm nay
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">08:00 - 17:00 • Khu Backend & Cloud</p>
              </div>
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Đang sử dụng
              </Badge>
            </div>

            {/* Mục 2: Thứ Sáu */}
            <div className="p-3 rounded-lg border border-border bg-muted/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-mono text-foreground">09/10</strong>
                  <span className="font-semibold text-foreground">Bàn B-014 (Tầng 3)</span>
                  <Badge variant="outline" className="text-[10px]">
                    Sắp tới
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">08:00 - 17:00 • Khu UI/UX Design</p>
              </div>
              <span className="text-[11px] text-primary font-medium">Đã xác nhận</span>
            </div>

            {/* Mục 3: Tuần tới */}
            <div className="p-3 rounded-lg border border-border bg-muted/10 flex items-center justify-between opacity-80">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-mono text-foreground">12/10</strong>
                  <span className="font-semibold text-foreground">Bàn A-005 (Tầng 3)</span>
                </div>
                <p className="text-[11px] text-muted-foreground">08:00 - 17:00 • Khu Backend</p>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium">Đã đặt chỗ</span>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="w-full text-xs h-8">
                <Link href="/workplace/desk-booking">
                  <span>Xem chi tiết lịch đặt bàn</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── KHỐI 3: PHÒNG HỌP SẮP TỚI (UPCOMING MEETINGS) ─────── */}
        <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Phòng họp sắp tới</span>
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary p-0 hover:bg-transparent">
              <Link href="/workplace/admin/room-bookings">
                <span>Đặt phòng</span>
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-3 text-xs">
            {/* Cuộc họp 1: Chiều nay */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-semibold text-foreground">
                  Meeting Room A (Phòng Hội Nghị)
                </strong>
                <Badge variant="outline" className="text-[10px] bg-red-50 text-primary border-red-200 font-mono">
                  14:00 - 15:00
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Nội dung: <strong>Họp Sprint Review & Kế hoạch Q4</strong>
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                <span>Tầng 3 • Sức chứa 12 người</span>
                <span className="text-primary font-medium">Chủ trì: Nguyễn Văn An</span>
              </div>
            </div>

            {/* Cuộc họp 2: Ngày mai */}
            <div className="p-3.5 rounded-lg border border-border bg-muted/15 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-semibold text-foreground">
                  Innovation Lab (Phòng Sáng Tạo)
                </strong>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Ngày mai, 09:30 - 10:30
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Nội dung: <strong>Brainstorm UI/UX Bản đồ số 2D</strong>
              </p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                <span>Tầng 2 • Sức chứa 8 người</span>
                <span>Chủ trì: Trần Mai Phương</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── KHỐI 4: PHIẾU PHẢN ÁNH SỰ CỐ (FACILITY TICKETS) ─────── */}
        <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              <span>Phiếu sự cố cơ sở vật chất</span>
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReportModalOpen(true)}
              className="h-7 text-xs text-primary gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Báo hỏng</span>
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-3 text-xs">
            {issues.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border bg-muted/10 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-semibold text-foreground truncate max-w-[260px]">
                    {item.title}
                  </strong>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 border",
                      item.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300"
                    )}
                  >
                    {item.statusText}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{item.location}</span>
                  <span className="font-mono">{item.createdAt}</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-lg border border-dashed border-border bg-muted/20 text-center">
              <p className="text-[11px] text-muted-foreground">
                Gặp sự cố về mạng LAN, máy lạnh, đèn chiếu sáng hoặc ghế bàn?
              </p>
              <Button
                size="sm"
                variant="link"
                onClick={() => setReportModalOpen(true)}
                className="text-xs text-primary font-medium p-0 h-auto mt-1"
              >
                + Gửi phản ánh nhanh đến Office Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Báo hỏng cơ sở vật chất */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-5 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <span>Báo hỏng & Phản ánh cơ sở vật chất</span>
              </h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Vị trí xảy ra sự cố</label>
                <input
                  type="text"
                  value={issueLocation}
                  onChange={(e) => setIssueLocation(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                  placeholder="Ví dụ: Bàn A-023, Tầng 3, Pantry..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Nội dung chi tiết sự cố</label>
                <textarea
                  rows={3}
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                  placeholder="Mô tả cụ thể: máy lạnh quá lạnh, ổ cắm không có điện, đèn nhấp nháy..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReportModalOpen(false)}
                  className="h-8 text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Gửi phản ánh
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
