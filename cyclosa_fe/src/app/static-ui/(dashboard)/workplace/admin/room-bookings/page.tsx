"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Video,
  Monitor,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MeetingBooking {
  id: string;
  roomName: string;
  roomCode: string;
  floor: string;
  capacity: number;
  title: string;
  hostName: string;
  hostRole: string;
  timeSlot: string;
  status: "CONFIRMED" | "IN_PROGRESS" | "COMPLETED";
  devices: string[];
}

export default function RoomBookingsManagementPage() {
  const [selectedDate, setSelectedDate] = useState("2026-10-07");
  const [newBookingModal, setNewBookingModal] = useState(false);

  const [bookings, setBookings] = useState<MeetingBooking[]>([
    {
      id: "mb_01",
      roomName: "Phòng Họp Hội Đồng (Board Room)",
      roomCode: "MR-01",
      floor: "Tầng 3",
      capacity: 18,
      title: "Họp Chiến lược Kinh doanh Q4",
      hostName: "Lê Hoàng Nam",
      hostRole: "Tổng Giám Đốc",
      timeSlot: "14:00 - 16:30",
      status: "IN_PROGRESS",
      devices: ["Cisco Webex 4K", "Màn hình 85\"", "Bảng kính từ tính"]
    },
    {
      id: "mb_02",
      roomName: "Phòng Họp Sáng Tạo (Innovation Lab)",
      roomCode: "MR-02",
      floor: "Tầng 3",
      capacity: 8,
      title: "Review UI/UX Sơ đồ chỗ ngồi 2D & Document Signing",
      hostName: "Nguyễn Văn An",
      hostRole: "Product Lead",
      timeSlot: "10:00 - 11:30",
      status: "COMPLETED",
      devices: ["TV Samsung 65\" 4K", "Micro Shure", "Whiteboard 3m"]
    },
    {
      id: "mb_03",
      roomName: "Phonebooth #2 (Focus Box)",
      roomCode: "PB-02",
      floor: "Tầng 3",
      capacity: 1,
      title: "Cuộc gọi phỏng vấn ứng viên Lead Dev",
      hostName: "Trần Mai Phương",
      hostRole: "Trưởng ban Nhân sự",
      timeSlot: "15:00 - 15:45",
      status: "CONFIRMED",
      devices: ["Vách cách âm -35dB", "Ghế Bar nâng hạ", "Cổng sạc Type-C"]
    },
    {
      id: "mb_04",
      roomName: "Phòng Họp Sprint (Agile Room)",
      roomCode: "MR-03",
      floor: "Tầng 2",
      capacity: 12,
      title: "Daily Standup & Phân rã Task Sprint 28",
      hostName: "Phạm Minh Tuấn",
      hostRole: "Senior Tech Lead",
      timeSlot: "09:00 - 09:45",
      status: "COMPLETED",
      devices: ["Màn hình 75\"", "Camera góc rộng 120°"]
    }
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Quản lý Lịch phòng họp</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Office Admin
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi tình trạng sử dụng, kiểm soát thiết bị và đặt phòng họp thay cho các phòng ban.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8.5 text-xs gap-1.5">
            <Link href="/workplace/map">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span>Xem vị trí phòng trên 2D Map</span>
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => setNewBookingModal(true)}
            className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Đặt lịch phòng họp</span>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Tổng số phòng</span>
              <div className="text-2xl font-bold font-mono text-foreground mt-0.5">8</div>
              <span className="text-[11px] text-muted-foreground">Phòng họp & Phonebooth</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Đang họp Live</span>
              <div className="text-2xl font-bold font-mono text-primary mt-0.5">1</div>
              <span className="text-[11px] text-muted-foreground">Board Room (HĐQT)</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-primary flex items-center justify-center">
              <Video className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Phòng đang trống</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">7</div>
              <span className="text-[11px] text-muted-foreground">Sẵn sàng đặt lịch</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Lượt họp hôm nay</span>
              <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">12</div>
              <span className="text-[11px] text-muted-foreground">Tổng thời lượng 18.5 giờ</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Danh sách cuộc họp theo ngày ────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3 px-5 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Lịch họp ngày {selectedDate.split("-").reverse().join("/")}</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-mono focus:outline-hidden"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Phòng họp</th>
                  <th className="py-3 px-4">Nội dung cuộc họp</th>
                  <th className="py-3 px-4">Người chủ trì</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Trang thiết bị</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {item.timeSlot}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-foreground block">{item.roomName}</strong>
                      <span className="text-[11px] text-muted-foreground font-mono">{item.roomCode} • {item.floor} (Sức chứa: {item.capacity})</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground block">{item.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-foreground block">{item.hostName}</strong>
                      <span className="text-[11px] text-muted-foreground">{item.hostRole}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0.5 border font-semibold",
                          item.status === "IN_PROGRESS" && "bg-red-50 text-primary border-red-300 animate-pulse",
                          item.status === "CONFIRMED" && "bg-blue-50 text-blue-700 border-blue-300",
                          item.status === "COMPLETED" && "bg-slate-100 text-slate-700 border-slate-300"
                        )}
                      >
                        {item.status === "IN_PROGRESS" && "● ĐANG HỌP"}
                        {item.status === "CONFIRMED" && "● ĐÃ ĐẶT"}
                        {item.status === "COMPLETED" && "● ĐÃ KẾT THÚC"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-muted-foreground">
                      {item.devices.join(", ")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info(`Chi tiết cuộc họp: ${item.title}`)}
                        className="h-7 text-xs text-primary"
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Đặt phòng họp mới */}
      {newBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Đặt phòng họp mới</span>
              </h3>
              <button
                onClick={() => setNewBookingModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Chọn phòng họp</label>
                <select className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden">
                  <option>Phòng Họp Sáng Tạo (Innovation Lab - Tầng 3 • 8 người)</option>
                  <option>Phòng Họp Hội Đồng (Board Room - Tầng 3 • 18 người)</option>
                  <option>Phonebooth #1 (Focus Box - Tầng 3 • 1 người)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground font-medium">Tiêu đề cuộc họp</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Họp Sprint Review, Phỏng vấn..."
                  className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-muted-foreground font-medium">Thời gian bắt đầu</label>
                  <input
                    type="time"
                    defaultValue="14:00"
                    className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground font-medium">Thời gian kết thúc</label>
                  <input
                    type="time"
                    defaultValue="15:00"
                    className="w-full h-8.5 px-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewBookingModal(false)}
                className="h-8 text-xs"
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setNewBookingModal(false);
                  toast.success("Đặt lịch phòng họp thành công!");
                }}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                Xác nhận đặt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
