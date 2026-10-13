"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  Camera,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, SensitiveMask } from "@/components/shared";

export default function MyProfilePage() {
  const [phone, setPhone] = useState("0901 234 567");
  const [personalEmail, setPersonalEmail] = useState("an.nguyen.personal@gmail.com");
  const [emergencyContact, setEmergencyContact] = useState("Nguyễn Thị Hoa (Vợ) — 0988 123 456");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hồ sơ Của Tôi</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cổng thông tin tự phục vụ nhân viên (ESS) — Xem thông tin cá nhân và cập nhật liên hệ khẩn cấp.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">EMP-09</Badge>
      </div>

      {/* ── Profile Header Card ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-white border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border">
              NA
            </div>
            <Link
              href="/me/face-enrollment"
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs hover:bg-primary/90"
              title="Đăng ký / Cập nhật Face ID"
            >
              <Camera className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Nguyễn Văn An</h2>
              <StatusBadge status="ACTIVE" customLabel="Chính thức" />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Mã NV: <strong>EMP001</strong> • Ban Giám Đốc • Tổng Giám Đốc
            </p>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="text-xs h-9">
          <Link href="/me/face-enrollment">
            <Camera className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Khuôn mặt Face ID (EMP-10)
          </Link>
        </Button>
      </div>

      {/* ── Editable Contact Info ───────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Thông tin liên lạc & Liên hệ khẩn cấp</CardTitle>
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs h-8" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isSaved ? "Đã lưu thay đổi!" : "Lưu cập nhật"}
          </Button>
        </CardHeader>

        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs">Số điện thoại di động</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="font-mono text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Email cá nhân nhận thông báo</Label>
            <Input value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} className="text-xs" />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Người liên hệ khẩn cấp (Họ tên, quan hệ, SĐT)</Label>
            <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className="text-xs" />
          </div>
        </CardContent>
      </Card>

      {/* ── Read-only Official Info ─────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-6 border-b border-border">
          <CardTitle className="text-sm font-semibold">Thông tin Hợp đồng & Pháp lý (Chỉ đọc)</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block text-2xs">Số Căn cước công dân</span>
            <SensitiveMask value="001085002345" maskType="id_card" />
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Tài khoản nhận lương</span>
            <SensitiveMask value="0011000987654" maskType="bank_account" />
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Hợp đồng lao động hiện tại</span>
            <strong className="text-foreground">HĐLĐ Vô thời hạn (HĐ-2020/001)</strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-2xs">Ngày ký kết ban đầu</span>
            <strong className="text-foreground font-mono">01/01/2020</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
