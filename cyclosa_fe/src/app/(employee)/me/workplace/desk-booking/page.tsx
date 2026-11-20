"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Armchair,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useBookDeskMutation,
  useGetSeatsQuery,
} from "@/features/workplace/api/workplace-api";
import type { WorkplaceSeatDetail } from "@/features/workplace/types/workplace.types";

export default function WorkplaceDeskBookingWizardPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Lấy danh sách bàn Hot-desk thật từ hệ thống
  const { data: hotDesksData, isLoading: isLoadingDesks } = useGetSeatsQuery({
    seatType: "HOT_DESK",
    status: "IN_SERVICE",
    size: 50,
  });

  const availableDesks = hotDesksData?.items || [];
  const [bookDesk, { isLoading }] = useBookDeskMutation();

  const handleBook = async () => {
    if (!selectedSeat) {
      toast.warning("Vui lòng chọn một bàn làm việc trước khi xác nhận");
      return;
    }

    try {
      await bookDesk({
        seatId: selectedSeat,
        bookingDate: selectedDate,
        note: note.trim() || undefined,
      }).unwrap();

      toast.success("Đặt bàn làm việc linh hoạt thành công!");
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.data?.message || "Đặt bàn thất bại. Bàn có thể đã được người khác đặt trước.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Armchair className="w-6 h-6 text-primary shrink-0" />
            <span>Đặt bàn làm việc</span>
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
            <span className="text-foreground font-medium">Đặt bàn làm việc</span>
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
              Đặt bàn làm việc thành công!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Chỗ ngồi của bạn đã được xác nhận cho ngày <strong>{selectedDate}</strong>. Sáng ngày làm việc, vui lòng quét mã QR dán trên mặt bàn để hoàn tất check-in.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href="/me/workplace">Về trang Workplace của tôi</Link>
              </Button>
              <Button variant="outline" onClick={() => setIsSuccess(false)}>
                Đặt thêm ngày khác
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Cột trái: Chọn ngày & tiện ích */}
          <Card className="md:col-span-1 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Thời gian làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ngày lên văn phòng</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Ghi chú bổ sung</label>
                <Input
                  placeholder="VD: Cần gần nhóm dự án..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cột phải: Danh sách bàn trống */}
          <Card className="md:col-span-2 border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Armchair className="h-5 w-5 text-primary" />
                Chọn Bàn Hot-desk Khả dụng ({availableDesks.length} bàn trống)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableDesks.map((desk: WorkplaceSeatDetail) => {
                  const isChosen = selectedSeat === desk.id;
                  return (
                    <div
                      key={desk.id}
                      onClick={() => setSelectedSeat(desk.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isChosen
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-lg text-primary">{desk.seatCode}</span>
                        <Badge variant="outline" className="text-xs">{desk.floorName}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{desk.zoneName}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {desk.amenities?.map((am, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {am.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-end">
                <Button
                  onClick={handleBook}
                  disabled={!selectedSeat || isLoading}
                  className="gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isLoading ? "Đang xử lý..." : "Xác nhận đặt bàn này"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
