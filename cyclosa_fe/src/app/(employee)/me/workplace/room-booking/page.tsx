"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Video,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useBookRoomMutation,
  useGetMeetingRoomsQuery,
} from "@/features/workplace/api/workplace-api";
import type { WorkplaceFloorObject } from "@/features/workplace/types/workplace.types";

export default function WorkplaceRoomBookingWizardPage() {
  const [title, setTitle] = useState("");
  const [attendeeCount, setAttendeeCount] = useState(6);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Lấy danh sách phòng họp thật từ CSDL
  const { data: meetingRoomsData, isLoading: isLoadingRooms } = useGetMeetingRoomsQuery();
  const rooms = meetingRoomsData || [
    { id: "00000000-0000-0000-0000-000000000501", name: "Phòng họp Innovation", floorName: "Tầng 12", capacity: 16, description: "Phòng họp lớn, camera 4K Polycom, màn hình ghép Sony 85 inch" },
    { id: "00000000-0000-0000-0000-000000000502", name: "Phòng họp Agile Daily", floorName: "Tầng 12", capacity: 8, description: "Phòng họp nhanh Scrum/Agile Daily, TV 65 inch, bảng kính" },
  ];

  const [bookRoom, { isLoading: isBooking }] = useBookRoomMutation();

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) {
      toast.warning("Vui lòng chọn phòng họp trước khi xác nhận");
      return;
    }
    if (!title.trim() || !startTime || !endTime) {
      toast.warning("Vui lòng điền đầy đủ tiêu đề và khoảng thời gian họp");
      return;
    }

    try {
      await bookRoom({
        meetingRoomId: selectedRoom,
        title: title.trim(),
        attendeeCount,
        startTime,
        endTime,
        description: description.trim() || undefined,
      }).unwrap();

      toast.success(`Đặt phòng họp "${title}" thành công!`);
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.data?.message || "Đặt phòng họp thất bại. Thời gian đã chọn có thể bị trùng lịch.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Video className="w-6 h-6 text-primary shrink-0" />
            <span>Đặt phòng họp</span>
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
            <Link href="/me/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Đặt phòng họp</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
            <Link href="/me/workplace">
              <span>Quay lại</span>
            </Link>
          </Button>
        </div>
      </div>

      {isSuccess ? (
        <Card className="border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center py-10 shadow-sm">
          <CardContent className="space-y-4">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Đặt phòng họp thành công!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Cuộc họp <strong>{title}</strong> đã được xếp lịch. Vui lòng check-in bằng mã QR tại cửa phòng trước giờ họp 15 phút.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href="/workplace">Xem lịch họp của tôi</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleBook} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Cột trái: Thông tin cuộc họp */}
          <Card className="md:col-span-1 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Thời gian & Quy mô
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tiêu đề cuộc họp</label>
                <Input
                  placeholder="VD: Họp Sprint Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Số người tham dự</label>
                <Input
                  type="number"
                  min={1}
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(parseInt(e.target.value, 10))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Giờ bắt đầu</label>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Giờ kết thúc</label>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Cột phải: Chọn phòng */}
          <Card className="md:col-span-2 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Chọn Phòng Họp Khả dụng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {rooms.map((room: any) => {
                  const isChosen = selectedRoom === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all flex items-center justify-between ${
                        isChosen
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">{room.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Sức chứa: {room.capacity || 8} người
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{room.floorName || "Tầng làm việc"}</p>
                        {room.description && (
                          <p className="text-xs text-muted-foreground/80 mt-1 max-w-md">{room.description}</p>
                        )}
                      </div>
                      <Badge className="bg-emerald-500 text-white">Còn trống</Badge>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-end">
                <Button type="submit" disabled={!selectedRoom || isBooking} className="gap-2">
                  {isBooking && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isBooking ? "Đang xếp lịch..." : "Xác nhận đặt phòng"}
                  {!isBooking && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
