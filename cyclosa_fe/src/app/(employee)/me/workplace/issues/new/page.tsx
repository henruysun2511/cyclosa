"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Upload,
  Armchair,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useReportIssueMutation,
  useGetSeatsQuery,
  useGetMySeatQuery,
} from "@/features/workplace/api/workplace-api";

export default function NewWorkplaceIssuePage() {
  const [issueType, setIssueType] = useState("ELECTRICAL");
  const [severity, setSeverity] = useState("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("MY_SEAT");
  const [isSuccess, setIsSuccess] = useState(false);

  // Queries gọi API vị trí bàn làm việc thật
  const { data: mySeat } = useGetMySeatQuery();
  const { data: seatsData, isLoading: isLoadingSeats } = useGetSeatsQuery({ size: 100 });
  const seats = seatsData?.items || [];

  const [reportIssue, { isLoading }] = useReportIssueMutation();

  useEffect(() => {
    if (mySeat?.id) {
      setSelectedLocation(mySeat.id);
    } else if (seats.length > 0) {
      setSelectedLocation(seats[0].id);
    }
  }, [mySeat, seats]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.warning("Vui lòng điền đầy đủ tiêu đề và mô tả sự cố");
      return;
    }

    const resolvedSeatId = selectedLocation === "OTHER" ? undefined : selectedLocation;

    try {
      await reportIssue({
        issueType,
        severity,
        title: title.trim(),
        description: description.trim(),
        seatId: resolvedSeatId,
      }).unwrap();

      toast.success("Báo cáo sự cố cơ sở vật chất đã được gửi thành công!");
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Gửi báo cáo sự cố thất bại. Vui lòng thử lại.";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
            <span>Báo cáo sự cố</span>
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
            <span className="text-foreground font-medium">Báo cáo sự cố</span>
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
              Đã gửi báo cáo sự cố thành công!
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Cảm ơn bạn đã phản ánh. Bộ phận quản trị văn phòng đã tiếp nhận và sẽ cử kỹ thuật viên kiểm tra xử lý trong thời gian sớm nhất.
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <Button asChild>
                <Link href="/me/workplace">Về Không gian làm việc</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="issueType">Loại sự cố <span className="text-rose-500">*</span></Label>
                <Select value={issueType} onValueChange={(val: string | null) => setIssueType(val || "ELECTRICAL")}>
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Chọn loại sự cố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ELECTRICAL">Điện & Ổ cắm</SelectItem>
                    <SelectItem value="FURNITURE">Bàn ghế & Nội thất</SelectItem>
                    <SelectItem value="AIR_CONDITIONING">Điều hòa nhiệt độ</SelectItem>
                    <SelectItem value="HARDWARE">Thiết bị phần cứng / Màn hình</SelectItem>
                    <SelectItem value="CLEANING">Vệ sinh môi trường</SelectItem>
                    <SelectItem value="OTHER">Vấn đề khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="severity">Mức độ ảnh hưởng</Label>
                <Select value={severity} onValueChange={(val: string | null) => setSeverity(val || "MEDIUM")}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Chọn mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Thấp (Chưa ảnh hưởng công việc ngay)</SelectItem>
                    <SelectItem value="MEDIUM">Trung bình (Cần khắc phục trong ngày)</SelectItem>
                    <SelectItem value="HIGH">Khẩn cấp (Gây gián đoạn công việc / Nguy cơ an toàn)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vị trí phát sinh: Dùng Dropdown Select gọi API CSDL, tuyệt đối không bắt người dùng nhập mã chuỗi */}
              <div className="space-y-1.5">
                <Label htmlFor="seatId">Vị trí phát sinh sự cố <span className="text-rose-500">*</span></Label>
                <Select value={selectedLocation} onValueChange={(val) => setSelectedLocation(val || "OTHER")}>
                  <SelectTrigger id="seatId">
                    <SelectValue placeholder="Chọn vị trí hoặc bàn làm việc..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mySeat && (
                      <SelectItem value={mySeat.id}>
                        Bàn làm việc của tôi: {mySeat.seatCode} ({mySeat.floorName || "Chỗ cố định"})
                      </SelectItem>
                    )}
                    {seats.map((seat) => (
                      <SelectItem key={seat.id} value={seat.id}>
                        Bàn {seat.seatCode} - {seat.floorName || "Tầng làm việc"} ({seat.seatType === "HOT_DESK" ? "Hot-desk" : "Cố định"})
                      </SelectItem>
                    ))}
                    <SelectItem value="OTHER">Khu vực chung / Pantry / Phòng họp / Hành lang</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống tự động liên kết mã bàn và sơ đồ mặt bằng tương ứng
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Tiêu đề sự cố <span className="text-rose-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="VD: Ổ cắm điện dưới chân bàn bị chập không có nguồn"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Mô tả chi tiết <span className="text-rose-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả cụ thể hiện tượng xảy ra..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" asChild>
                  <Link href="/me/workplace">Hủy</Link>
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-primary text-white">
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                  Gửi báo cáo sự cố
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
