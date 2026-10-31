"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Building2,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Zap,
  Sparkles,
  User,
  Check,
  X,
  QrCode,
  ArrowRight,
  ChevronRight,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HotdeskSeat {
  id: string;
  code: string;
  zone: string;
  floor: string;
  status: "AVAILABLE" | "OCCUPIED" | "BLOCKED";
  amenities: string[];
}

export default function HotdeskBookingPage() {
  const [site, setSite] = useState("Hà Nội (Keangnam Landmark 72)");
  const [selectedDate, setSelectedDate] = useState("2026-10-07");
  const [selectedFloor, setSelectedFloor] = useState("Tầng 3");
  const [selectedSlot, setSelectedSlot] = useState<"FULL_DAY" | "MORNING" | "AFTERNOON">("FULL_DAY");

  // Bàn đang được người dùng chọn trên sơ đồ
  const [selectedDeskId, setSelectedDeskId] = useState<string>("A02");

  // Quản lý các lượt đặt của tôi
  const [myBookings, setMyBookings] = useState([
    {
      id: "bk_01",
      deskCode: "Bàn A02",
      floor: "Tầng 3",
      zone: "Khu Backend & Cloud",
      date: "07/10/2026",
      time: "08:00 - 17:30 (Cả ngày)",
      status: "CONFIRMED"
    },
    {
      id: "bk_02",
      deskCode: "Bàn B04",
      floor: "Tầng 3",
      zone: "Khu UI/UX & Design",
      date: "09/10/2026",
      time: "08:00 - 17:30 (Cả ngày)",
      status: "CONFIRMED"
    }
  ]);

  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  // Danh sách các bàn hiển thị trên Sơ đồ (Row A, Row B, Row C)
  const desksRowA: HotdeskSeat[] = [
    { id: "A01", code: "A01", zone: "Khu Backend", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" Dell", "Ghế Ergonomic", "Cổng sạc 100W"] },
    { id: "A02", code: "A02", zone: "Khu Backend", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" 4K", "Bàn nâng hạ thông minh", "Gần cửa sổ"] },
    { id: "A03", code: "A03", zone: "Khu Backend", floor: "Tầng 3", status: "OCCUPIED", amenities: ["Màn hình 24\" FHD"] },
    { id: "A04", code: "A04", zone: "Khu Backend", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" Dell", "Cáp mạng LAN"] },
    { id: "A05", code: "A05", zone: "Khu Backend", floor: "Tầng 3", status: "BLOCKED", amenities: ["Đang bảo trì định kỳ"] },
    { id: "A06", code: "A06", zone: "Khu Backend", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" 4K", "Cổng Type-C"] }
  ];

  const desksRowB: HotdeskSeat[] = [
    { id: "B01", code: "B01", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" Asus ProArt", "Ghế Ergonomic"] },
    { id: "B02", code: "B02", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" 4K", "Cổng Type-C"] },
    { id: "B03", code: "B03", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 24\" FHD"] },
    { id: "B04", code: "B04", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "OCCUPIED", amenities: ["Màn hình 27\" Dell"] },
    { id: "B05", code: "B05", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" Dell", "Bàn nâng hạ"] },
    { id: "B06", code: "B06", zone: "Khu Frontend & Mobile", floor: "Tầng 3", status: "OCCUPIED", amenities: ["Màn hình 27\" Dell"] }
  ];

  const desksRowC: HotdeskSeat[] = [
    { id: "C01", code: "C01", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "OCCUPIED", amenities: ["Màn hình 34\" Ultrawide"] },
    { id: "C02", code: "C02", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" 4K", "Ghế lưới thoáng"] },
    { id: "C03", code: "C03", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" 4K", "Cổng LAN 10Gbps"] },
    { id: "C04", code: "C04", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 24\" FHD"] },
    { id: "C05", code: "C05", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "BLOCKED", amenities: ["Khu vực dự trữ"] },
    { id: "C06", code: "C06", zone: "Khu AI & Data Labs", floor: "Tầng 3", status: "AVAILABLE", amenities: ["Màn hình 27\" Dell"] }
  ];

  const allDesks = [...desksRowA, ...desksRowB, ...desksRowC];
  const currentSelectedDesk = allDesks.find((d) => d.id === selectedDeskId) || desksRowA[1];

  // Xử lý xác nhận đặt bàn
  const handleConfirmBooking = () => {
    if (currentSelectedDesk.status !== "AVAILABLE") {
      toast.error("Bàn này hiện không khả dụng để đặt!");
      return;
    }

    const newBooking = {
      id: `bk_${Date.now()}`,
      deskCode: `Bàn ${currentSelectedDesk.code}`,
      floor: currentSelectedDesk.floor,
      zone: currentSelectedDesk.zone,
      date: selectedDate.split("-").reverse().join("/"),
      time: selectedSlot === "FULL_DAY" ? "08:00 - 17:30 (Cả ngày)" : selectedSlot === "MORNING" ? "08:00 - 12:00 (Sáng)" : "13:30 - 17:30 (Chiều)",
      status: "CONFIRMED"
    };

    setMyBookings([newBooking, ...myBookings]);
    setBookingSuccessModal(true);
    toast.success(`Đặt bàn ${currentSelectedDesk.code} thành công!`);
  };

  const handleCancelBooking = (bookingId: string) => {
    setMyBookings((prev) => prev.filter((b) => b.id !== bookingId));
    toast.info("Đã hủy lượt đặt bàn.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span>Đặt bàn linh hoạt</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Giao diện Nhân viên
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Chọn trực tiếp vị trí bàn làm việc trên sơ đồ chỗ ngồi thông minh cho ngày làm việc của bạn.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="h-8.5 text-xs gap-1.5">
          <Link href="/workplace/map">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>Xem toàn bộ bản đồ số 2D</span>
          </Link>
        </Button>
      </div>

      {/* ── 2. Thanh lọc: Cơ sở, Tầng & Ngày làm việc ──────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Chọn Cơ sở */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-primary" />
              <span>Cơ sở làm việc</span>
            </label>
            <select
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card font-medium focus:outline-hidden"
            >
              <option value="Hà Nội (Keangnam Landmark 72)">Hà Nội (Keangnam Landmark 72)</option>
              <option value="TP.HCM (Bitexco Financial Tower)">TP.HCM (Bitexco Financial Tower)</option>
              <option value="Đà Nẵng (Indochina Riverside)">Đà Nẵng (Indochina Riverside)</option>
            </select>
          </div>

          {/* Chọn Tầng */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>Tầng văn phòng</span>
            </label>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card font-medium focus:outline-hidden"
            >
              <option value="Tầng 1">Tầng 1 (Sảnh & Khách hàng)</option>
              <option value="Tầng 2">Tầng 2 (Vận hành & Kinh doanh)</option>
              <option value="Tầng 3">Tầng 3 (Công nghệ & R&D)</option>
              <option value="Tầng 4">Tầng 4 (Ban Lãnh đạo)</option>
            </select>
          </div>

          {/* Chọn Ngày */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Ngày đặt bàn</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card font-medium focus:outline-hidden"
            >
            </input>
          </div>

          {/* Chọn Khung giờ */}
          <div className="space-y-1">
            <label className="text-muted-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Khung thời gian</span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              <Button
                type="button"
                size="sm"
                variant={selectedSlot === "FULL_DAY" ? "default" : "outline"}
                onClick={() => setSelectedSlot("FULL_DAY")}
                className={cn("h-8.5 text-[11px] px-1", selectedSlot === "FULL_DAY" && "bg-primary text-primary-foreground")}
              >
                Cả ngày
              </Button>
              <Button
                type="button"
                size="sm"
                variant={selectedSlot === "MORNING" ? "default" : "outline"}
                onClick={() => setSelectedSlot("MORNING")}
                className={cn("h-8.5 text-[11px] px-1", selectedSlot === "MORNING" && "bg-primary text-primary-foreground")}
              >
                Sáng
              </Button>
              <Button
                type="button"
                size="sm"
                variant={selectedSlot === "AFTERNOON" ? "default" : "outline"}
                onClick={() => setSelectedSlot("AFTERNOON")}
                className={cn("h-8.5 text-[11px] px-1", selectedSlot === "AFTERNOON" && "bg-primary text-primary-foreground")}
              >
                Chiều
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. SƠ ĐỒ CHỖ NGỒI TRỰC QUAN (SEAT MAP VISUAL) ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bản đồ sơ đồ chọn bàn (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  <span>Sơ đồ chỗ ngồi ({selectedFloor} • {site.split(" ")[0]})</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nhấp trực tiếp vào ô bàn để chọn vị trí mong muốn
                </p>
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                Ngày: <span className="text-primary font-bold">{selectedDate.split("-").reverse().join("/")}</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-slate-50/70 dark:bg-slate-950/40">
              {/* Sơ đồ bàn theo 3 hàng (Row A, Row B, Row C) */}
              <div className="space-y-6 max-w-xl mx-auto py-2">
                {/* Hàng A: Khu Backend */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="text-blue-600">DÃY A • KHU BACKEND & CLOUD</span>
                    <span className="text-[10px] font-normal">Cửa sổ view Landmark 72</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2.5">
                    {desksRowA.map((desk) => {
                      const isSelected = selectedDeskId === desk.id;
                      const isAvailable = desk.status === "AVAILABLE";
                      const isOccupied = desk.status === "OCCUPIED";

                      return (
                        <button
                          key={desk.id}
                          disabled={!isAvailable}
                          onClick={() => setSelectedDeskId(desk.id)}
                          className={cn(
                            "h-16 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 transition-all duration-150 relative",
                            isSelected &&
                              "border-primary bg-red-50 text-primary shadow-md scale-105 ring-2 ring-primary ring-offset-2 z-10",
                            !isSelected &&
                              isAvailable &&
                              "border-emerald-300 bg-emerald-50/60 text-emerald-950 hover:border-emerald-500 hover:scale-102 cursor-pointer shadow-2xs",
                            isOccupied &&
                              "border-slate-300 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed",
                            desk.status === "BLOCKED" &&
                              "border-amber-300 bg-amber-50 text-amber-600 opacity-60 cursor-not-allowed"
                          )}
                        >
                          <span className="text-[11px] font-bold font-mono">{desk.code}</span>
                          <div className="text-[9px]">
                            {isSelected && <span className="font-bold text-primary">★ Chọn</span>}
                            {!isSelected && isAvailable && <span className="text-emerald-700">Trống</span>}
                            {isOccupied && <span>Đã đặt</span>}
                            {desk.status === "BLOCKED" && <span>Khóa</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hàng B: Khu Frontend & UI/UX */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="text-purple-600">DÃY B • KHU FRONTEND & PRODUCT</span>
                    <span className="text-[10px] font-normal">Gần Pantry & Máy in</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2.5">
                    {desksRowB.map((desk) => {
                      const isSelected = selectedDeskId === desk.id;
                      const isAvailable = desk.status === "AVAILABLE";
                      const isOccupied = desk.status === "OCCUPIED";

                      return (
                        <button
                          key={desk.id}
                          disabled={!isAvailable}
                          onClick={() => setSelectedDeskId(desk.id)}
                          className={cn(
                            "h-16 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 transition-all duration-150 relative",
                            isSelected &&
                              "border-primary bg-red-50 text-primary shadow-md scale-105 ring-2 ring-primary ring-offset-2 z-10",
                            !isSelected &&
                              isAvailable &&
                              "border-emerald-300 bg-emerald-50/60 text-emerald-950 hover:border-emerald-500 hover:scale-102 cursor-pointer shadow-2xs",
                            isOccupied &&
                              "border-slate-300 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed",
                            desk.status === "BLOCKED" &&
                              "border-amber-300 bg-amber-50 text-amber-600 opacity-60 cursor-not-allowed"
                          )}
                        >
                          <span className="text-[11px] font-bold font-mono">{desk.code}</span>
                          <div className="text-[9px]">
                            {isSelected && <span className="font-bold text-primary">★ Chọn</span>}
                            {!isSelected && isAvailable && <span className="text-emerald-700">Trống</span>}
                            {isOccupied && <span>Đã đặt</span>}
                            {desk.status === "BLOCKED" && <span>Khóa</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hàng C: Khu AI & Data */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                    <span className="text-emerald-600">DÃY C • KHU AI & DATA LABS</span>
                    <span className="text-[10px] font-normal">Khu yên tĩnh Focus Zone</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2.5">
                    {desksRowC.map((desk) => {
                      const isSelected = selectedDeskId === desk.id;
                      const isAvailable = desk.status === "AVAILABLE";
                      const isOccupied = desk.status === "OCCUPIED";

                      return (
                        <button
                          key={desk.id}
                          disabled={!isAvailable}
                          onClick={() => setSelectedDeskId(desk.id)}
                          className={cn(
                            "h-16 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 transition-all duration-150 relative",
                            isSelected &&
                              "border-primary bg-red-50 text-primary shadow-md scale-105 ring-2 ring-primary ring-offset-2 z-10",
                            !isSelected &&
                              isAvailable &&
                              "border-emerald-300 bg-emerald-50/60 text-emerald-950 hover:border-emerald-500 hover:scale-102 cursor-pointer shadow-2xs",
                            isOccupied &&
                              "border-slate-300 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed",
                            desk.status === "BLOCKED" &&
                              "border-amber-300 bg-amber-50 text-amber-600 opacity-60 cursor-not-allowed"
                          )}
                        >
                          <span className="text-[11px] font-bold font-mono">{desk.code}</span>
                          <div className="text-[9px]">
                            {isSelected && <span className="font-bold text-primary">★ Chọn</span>}
                            {!isSelected && isAvailable && <span className="text-emerald-700">Trống</span>}
                            {isOccupied && <span>Đã đặt</span>}
                            {desk.status === "BLOCKED" && <span>Khóa</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Chú thích trạng thái bàn dưới chân sơ đồ */}
            <div className="py-3 px-5 border-t border-border bg-card flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-muted-foreground uppercase text-[11px]">Chú thích:</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-400" />
                  <span>○ Còn trống</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-slate-200 border border-slate-300" />
                  <span>● Đã sử dụng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-amber-100 border border-amber-300" />
                  <span>■ Không khả dụng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-red-50 border-2 border-primary" />
                  <span className="font-medium text-primary">★ Bàn đang chọn</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Panel Bàn Đã Chọn & Xác Nhận Đặt Bàn (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Bàn đã chọn</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Mã bàn làm việc</span>
                    <strong className="text-2xl font-bold font-mono text-primary">
                      Bàn {currentSelectedDesk.code}
                    </strong>
                  </div>
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Hotdesk
                  </Badge>
                </div>

                <div className="pt-2 border-t border-red-200/60 space-y-1.5 text-foreground">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tầng:</span>
                    <strong>{currentSelectedDesk.floor}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phân khu:</span>
                    <strong className="text-primary">{currentSelectedDesk.zone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày làm việc:</span>
                    <span className="font-mono font-semibold">{selectedDate.split("-").reverse().join("/")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span>
                      {selectedSlot === "FULL_DAY" && "08:00 - 17:30 (Cả ngày)"}
                      {selectedSlot === "MORNING" && "08:00 - 12:00 (Buổi sáng)"}
                      {selectedSlot === "AFTERNOON" && "13:30 - 17:30 (Buổi chiều)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trang thiết bị của bàn */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Trang thiết bị tại bàn
                </span>
                <div className="space-y-1">
                  {currentSelectedDesk.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-foreground">
                      <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Thông tin nhân viên đặt */}
              <div className="p-3 rounded-lg border border-border bg-muted/20 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                  A
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-foreground block">Nguyễn Văn An</span>
                  <span className="text-[10px] text-muted-foreground block">EMP-001 • Khối Công nghệ</span>
                </div>
              </div>

              {/* Nút xác nhận đặt bàn */}
              <Button
                onClick={handleConfirmBooking}
                className="w-full text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Xác nhận đặt bàn</span>
              </Button>
            </CardContent>
          </Card>

          {/* Lịch sử lượt đặt của tôi */}
          <Card className="border-border bg-card shadow-xs rounded-xl">
            <CardHeader className="py-3 px-4 border-b border-border bg-muted/20">
              <CardTitle className="text-xs font-semibold text-foreground">
                Lượt đặt bàn của tôi ({myBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              {myBookings.map((b) => (
                <div key={b.id} className="p-2.5 rounded-lg border border-border bg-muted/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-primary font-mono">{b.deskCode}</strong>
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="text-[10px] text-rose-600 hover:underline"
                    >
                      Hủy đặt
                    </button>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {b.floor} • {b.zone}
                  </div>
                  <div className="text-[10px] font-mono text-foreground font-medium">
                    {b.date} ({b.time})
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal / Dialog thông báo đặt thành công */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Đặt bàn thành công!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Bạn đã giữ chỗ thành công cho <strong>Bàn {currentSelectedDesk.code}</strong> tại {currentSelectedDesk.floor}.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col items-center gap-2">
              <QrCode className="h-24 w-24 text-primary" />
              <span className="text-[10px] text-muted-foreground font-mono">
                Quét mã QR tại bàn để Check-in vào sáng {selectedDate.split("-").reverse().join("/")}
              </span>
            </div>

            <Button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full text-xs h-8.5 bg-primary text-primary-foreground"
            >
              Hoàn tất
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
