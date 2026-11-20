"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Video,
  MapPin,
  Calendar,
  Wrench,
  Compass,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useResolveQrQuery } from "@/features/workplace/api/workplace-api";

export default function WorkplaceQrResolverPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [activeToken, setActiveToken] = useState("");

  const {
    data: resolved,
    isLoading,
    isError,
    error,
  } = useResolveQrQuery(activeToken, {
    skip: !activeToken,
  });

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      toast.warning("Vui lòng nhập hoặc quét mã token QR");
      return;
    }
    setActiveToken(tokenInput.trim());
  };

  const sampleTokens = [
    { label: "Bàn DEV-A01 (Tầng 12 Keangnam)", token: "qr-s1" },
    { label: "Bàn Hot-desk HOT-01", token: "qr-s4" },
    { label: "Phòng họp Innovation", token: "qr-room-innovation" },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header Standard Rule 02 ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <QrCode className="w-6 h-6 text-primary shrink-0" />
            <span>Quét mã QR vị trí</span>
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
            <span className="text-foreground font-medium">Quét mã QR vị trí</span>
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

      {/* ── Search / Scan Form Card ───────────────────────────────────────── */}
      <Card className="border border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Search className="h-4 w-4 text-primary" />
            <span>Nhập hoặc quét chuỗi Token từ mã QR vật lý</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleResolve} className="flex gap-2">
            <div className="relative flex-1">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Nhập chuỗi token QR (VD: qr-s1, qr-s4)..."
                className="pl-9 h-10 font-mono text-xs"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="h-10 px-5 gap-1.5 shadow-xs">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Tra cứu vị trí</span>
            </Button>
          </form>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground font-medium">Mã mẫu thử nghiệm:</span>
            {sampleTokens.map((sample) => (
              <button
                key={sample.token}
                type="button"
                onClick={() => {
                  setTokenInput(sample.token);
                  setActiveToken(sample.token);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors border border-border"
              >
                <span>{sample.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">({sample.token})</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Resolution Result Display ─────────────────────────────────────── */}
      {isLoading && (
        <Card className="border border-border p-8 text-center shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Đang giải mã token vị trí từ hệ thống...</p>
        </Card>
      )}

      {isError && (
        <Card className="border border-destructive/30 bg-destructive/5 p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-destructive">Mã QR không hợp lệ hoặc không tồn tại</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Token &quot;{activeToken}&quot; không khớp với bất kỳ vị trí bàn làm việc hoặc phòng họp nào trong cơ sở dữ liệu.
              </p>
            </div>
          </div>
        </Card>
      )}

      {resolved && !isLoading && (
        <Card className="border border-border shadow-xs overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                  {(resolved.targetType === "SEAT" || resolved.tokenType === "SEAT" || resolved.type === "SEAT") ? (
                    <Armchair className="h-7 w-7" />
                  ) : (
                    <Video className="h-7 w-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-foreground font-mono">
                      {resolved.code || resolved.name}
                    </h2>
                    <Badge variant={(resolved.targetType === "SEAT" || resolved.tokenType === "SEAT" || resolved.type === "SEAT") ? "default" : "secondary"}>
                      {(resolved.targetType === "SEAT" || resolved.tokenType === "SEAT" || resolved.type === "SEAT") ? "Vị trí Bàn làm việc" : "Phòng họp"}
                    </Badge>
                    {resolved.status && (
                      <Badge variant="outline" className="text-xs">
                        {resolved.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {[resolved.siteName, resolved.floorName, resolved.zoneName].filter(Boolean).join(" • ") || resolved.floorName || "Vị trí tại tòa nhà"}
                  </p>
                </div>
              </div>

              {resolved.currentOccupantName && (
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Nhân sự đang sử dụng</span>
                  <span className="text-sm font-semibold text-foreground">
                    {resolved.currentOccupantName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Thao tác nhanh cho vị trí này
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="justify-start gap-2 h-10 text-xs" asChild>
                  <Link href={`/workplace/desk-booking?seatCode=${encodeURIComponent(resolved.code || "")}`}>
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Đặt bàn tại vị trí này</span>
                  </Link>
                </Button>

                <Button variant="outline" className="justify-start gap-2 h-10 text-xs" asChild>
                  <Link href={`/workplace/issues/new?seatCode=${encodeURIComponent(resolved.code || "")}`}>
                    <Wrench className="h-4 w-4 text-amber-500" />
                    <span>Báo hỏng / sự cố</span>
                  </Link>
                </Button>

                <Button variant="outline" className="justify-start gap-2 h-10 text-xs" asChild>
                  <Link href="/me/workplace/map">
                    <Compass className="h-4 w-4 text-blue-500" />
                    <span>Xem vị trí trên bản đồ 2D</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
