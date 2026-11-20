"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Armchair,
  Calendar,
  Video,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  QrCode,
  Layers,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetMySeatQuery,
  useGetMyDeskBookingsQuery,
  useGetMyRoomBookingsQuery,
  useGetMyIssuesQuery,
} from "@/features/workplace/api/workplace-api";

import type { DeskBooking, RoomBooking } from "@/features/workplace/types/workplace.types";

export default function MyWorkplaceDashboardPage() {
  const { data: mySeat, isLoading: isSeatLoading } = useGetMySeatQuery();
  const { data: myDeskBookings } = useGetMyDeskBookingsQuery();
  const { data: myRoomBookings } = useGetMyRoomBookingsQuery();
  const { data: myIssues } = useGetMyIssuesQuery();

  const activeDeskBookings = myDeskBookings?.filter((b: DeskBooking) => b.status === "CONFIRMED") || [];
  const activeRoomBookings = myRoomBookings?.filter((r: RoomBooking) => r.status === "CONFIRMED") || [];

  return (
    <div className="space-y-6">
      {/* 1. Header Standard Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Building2 className="w-6 h-6 text-primary shrink-0" />
            <span>Không gian làm việc</span>
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
            <span className="text-foreground font-medium">Không gian làm việc</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
            <Link href="/me/workplace/qr">
              <QrCode className="w-3.5 h-3.5 text-primary" />
              <span>Quét mã QR</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
            <Link href="/me/workplace/map">
              <Search className="w-3.5 h-3.5" />
              <span>Sơ đồ mặt bằng</span>
            </Link>
          </Button>
          <Button size="sm" className="h-9 gap-1.5 text-xs bg-primary text-white shadow-xs" asChild>
            <Link href="/me/workplace/desk-booking">
              <Armchair className="w-3.5 h-3.5" />
              <span>Đặt bàn làm việc</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Hero Card: Chỗ ngồi cố định của tôi */}
      <Card className="border border-border bg-card shadow-xs overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xs shrink-0">
                <Armchair className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">
                    {mySeat ? `Bàn làm việc: ${mySeat.seatCode}` : "Bạn chưa được phân bổ bàn cố định"}
                  </h2>
                  {mySeat && (
                    <Badge variant="default" className="text-xs">
                      Bàn cố định chính thức
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  {mySeat
                    ? `${mySeat.siteName} • ${mySeat.floorName} • ${mySeat.zoneName}`
                    : "Bạn có thể sử dụng tính năng Đặt bàn linh hoạt khi lên văn phòng"}
                </p>
              </div>
            </div>

            {mySeat && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link href={`/me/workplace/map?highlightSeat=${mySeat.id}`}>
                    <Layers className="h-4 w-4" />
                    Xem vị trí trên bản đồ
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

        {/* 3. Grid 2 Columns: Lịch đặt bàn & Lịch phòng họp */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: Lịch đặt bàn Hot-desking */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Lịch Đặt Bàn Linh hoạt Sắp tới
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/me/workplace/desk-booking">Đặt thêm</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeDeskBookings.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Bạn chưa có lịch đặt bàn linh hoạt nào sắp tới.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeDeskBookings.map((b: DeskBooking) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">{b.seatCode}</span>
                          <Badge variant="secondary" className="text-xs">
                            {b.bookingDate}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {b.siteName} • {b.floorName}
                        </p>
                      </div>
                      <Badge className="bg-emerald-500 text-white">Đã xác nhận</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Lịch họp của tôi */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Cuộc Họp của Tôi Hôm nay
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="/me/workplace/room-booking">Đặt phòng</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activeRoomBookings.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Không có lịch họp nào diễn ra trong hôm nay.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRoomBookings.map((r: RoomBooking) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div>
                        <span className="font-semibold text-foreground text-sm">{r.title}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.roomName} ({r.floorName}) • {new Date(r.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - {new Date(r.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge className="bg-blue-600 text-white">Sắp diễn ra</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 4. Quick Actions Banner */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/me/workplace/map"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Search className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Tìm vị trí Đồng nghiệp</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Xem bàn làm việc và chỉ đường</p>
            </div>
          </Link>

          <Link
            href="/me/workplace/room-booking"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Đặt phòng Họp</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tìm phòng trống & chống trùng giờ</p>
            </div>
          </Link>

          <Link
            href="/me/workplace/issues/new"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Báo hỏng Thiết bị / Sự cố</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Phản ánh bàn ghế, điện, điều hòa</p>
            </div>
          </Link>
        </div>
    </div>
  );
}
