"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Building2,
  FileText,
  Key,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OrgTreePicker, EmployeePicker } from "@/components/shared";

export default function EmployeeCreateWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form mock state
  const [fullName, setFullName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [contractType, setContractType] = useState("PROBATION");
  const [salary, setSalary] = useState("18,000,000");

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Completed wizard
      router.push("/employees");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/employees">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Hủy và quay lại danh sách
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">EMP-02</Badge>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tiếp nhận Nhân sự Mới
        </h1>
        <p className="text-xs text-muted-foreground">
          Nhập liệu từng bước để khởi tạo hồ sơ nhân viên, hợp đồng và tự động cấp tài khoản đăng nhập.
        </p>
      </div>

      {/* ── Stepper Indicator ───────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2 text-xs font-medium">
        {[
          { num: 1, title: "1. Thông tin cá nhân", icon: User },
          { num: 2, title: "2. Bổ nhiệm & Đơn vị", icon: Building2 },
          { num: 3, title: "3. Hợp đồng & Lương", icon: FileText },
          { num: 4, title: "4. Tài khoản & Hoàn tất", icon: Key },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
              step === s.num
                ? "bg-primary text-white border-primary shadow-xs font-bold"
                : step > s.num
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-50 text-muted-foreground border-slate-200"
            }`}
          >
            <span>{s.title}</span>
          </div>
        ))}
      </div>

      {/* ── Step Contents ───────────────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Bước 1: Thông tin nhân thân & Giấy tờ định danh</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs">Họ và tên đầy đủ *</Label>
                  <Input placeholder="VD: Nguyễn Thị Lan Anh" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Số CCCD / Hộ chiếu *</Label>
                  <Input placeholder="12 chữ số..." value={citizenId} onChange={(e) => setCitizenId(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Email cá nhân *</Label>
                  <Input type="email" placeholder="lananh@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Số điện thoại *</Label>
                  <Input placeholder="09xx..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Bước 2: Phân công đơn vị & Chức vụ công tác</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Phòng ban trực thuộc *</Label>
                  <OrgTreePicker value={null} onChange={() => {}} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Chức danh công việc *</Label>
                  <Input placeholder="VD: Chuyên viên Marketing" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Quản lý trực tiếp (Supervisor)</Label>
                  <EmployeePicker value={null} onChange={() => {}} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Bước 3: Hợp đồng lao động & Mức lương</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs">Loại hợp đồng ban đầu *</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-white px-3 text-xs"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                  >
                    <option value="PROBATION">Hợp đồng thử việc (2 tháng)</option>
                    <option value="DEFINITE_12M">Hợp đồng xác định thời hạn (12 tháng)</option>
                    <option value="INDEFINITE">Hợp đồng không xác định thời hạn</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Mức lương cơ bản (VNĐ) *</Label>
                  <Input value={salary} onChange={(e) => setSalary(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Bước 4: Cấp tài khoản đăng nhập & Hoàn tất</h3>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Sẵn sàng khởi tạo hồ sơ nhân sự
                </div>
                <p className="text-slate-600">
                  Hệ thống sẽ tự động cấp mã nhân viên <strong>EMP105</strong>, tạo tài khoản người dùng theo email công vụ và gửi email kích hoạt tài khoản.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="text-xs"
            >
              Quay lại
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white text-xs"
            >
              {step === 4 ? "Hoàn tất & Tiếp nhận" : "Tiếp theo"}
              {step < 4 && <ArrowRight className="h-3.5 w-3.5 ml-1.5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
