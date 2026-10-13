"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  UploadCloud,
  Send,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileUploader, UploadedFileItem, SpiderIcon } from "@/components/shared";

export default function JobDetailPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFiles, setCvFiles] = useState<UploadedFileItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* ── Public Brand Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/careers" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-black shadow-xs">
              <SpiderIcon className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold text-foreground tracking-tight">
              CYCLOSA <span className="text-primary font-normal">Careers</span>
            </span>
          </Link>
          <Badge variant="outline" className="font-mono text-xs">REC-02</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/careers">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại danh sách việc làm
          </Link>
        </Button>

        {submitted ? (
          <Card className="shadow-md border-emerald-200 bg-white p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Ứng tuyển thành công!</h2>
              <p className="text-xs text-muted-foreground">
                Cảm ơn <strong>{fullName}</strong> đã quan tâm đến cơ hội nghề nghiệp tại CYCLOSA.
                Bộ phận Tuyển dụng sẽ rà soát hồ sơ và liên hệ với bạn trong vòng 3-5 ngày làm việc.
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white text-xs">
              <Link href="/careers">Xem các vị trí khác</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Job Description Left (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold text-xs">
                    Khối Công Nghệ & Chuyển Đổi Số
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">Toàn thời gian</Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                  Senior Frontend Engineer (React 19 / Next.js)
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-bold text-emerald-700">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                    30,000,000 — 45,000,000 ₫
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    Hà Nội (Trụ sở chính)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    Hạn: 31/10/2026
                  </span>
                </div>
              </div>

              {/* JD Content */}
              <div className="prose prose-sm max-w-none text-xs text-slate-700 space-y-4 bg-white p-6 rounded-xl border border-border shadow-2xs">
                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Mô tả công việc (JD)</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Chịu trách nhiệm kiến trúc và phát triển giao diện Web Application cho hệ thống HRM & Smart Workplace cấp doanh nghiệp lớn.</li>
                    <li>Sử dụng React 19, Next.js App Router, TypeScript và Tailwind CSS để tối ưu hóa trải nghiệm người dùng tốc độ cao.</li>
                    <li>Xây dựng thư viện Design System, Shared Components tái sử dụng đa phân hệ.</li>
                    <li>Tích hợp các tính năng AI Copilot, Chatbot, Canvas 2D tương tác và đồ thị số liệu.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Yêu cầu ứng viên</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tối thiểu 3 năm kinh nghiệm phát triển Frontend với React.js / Next.js / TypeScript.</li>
                    <li>Nắm vững State Management (Redux Toolkit, React Query/TanStack).</li>
                    <li>Có tư duy thẩm mỹ UI/UX cao cấp, chú trọng micro-interactions và hiệu năng trang.</li>
                    <li>Ưu tiên ứng viên có kinh nghiệm làm các sản phẩm SaaS B2B, ERP hoặc Fintech.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">Quyền lợi đãi ngộ</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Thu nhập cạnh tranh (lương cứng 30M-45M + tháng lương 13 + thưởng hiệu suất OKR).</li>
                    <li>Bảo hiểm sức khỏe cao cấp toàn diện (Bảo Việt / PVI) cho nhân viên và người thân.</li>
                    <li>Trang bị máy tính làm việc MacBook Pro M3 Max mới 100%.</li>
                    <li>14 ngày phép năm + du lịch công ty 2 lần/năm tại các resort 5 sao.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application Form Right (5 cols) */}
            <div className="lg:col-span-5">
              <Card className="shadow-xs border-border sticky top-24">
                <CardHeader className="py-4 px-6 border-b border-border">
                  <CardTitle className="text-base font-bold">Nộp đơn ứng tuyển trực tuyến</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Họ và tên của bạn *</Label>
                      <Input
                        required
                        placeholder="VD: Nguyễn Văn Nam"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Email liên hệ *</Label>
                      <Input
                        type="email"
                        required
                        placeholder="nam.nguyen@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Số điện thoại *</Label>
                      <Input
                        type="tel"
                        required
                        placeholder="0912 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Tải lên hồ sơ CV (PDF, DOCX) *</Label>
                      <FileUploader
                        files={cvFiles}
                        onChange={setCvFiles}
                        maxFiles={1}
                        label="Kéo thả CV của bạn vào đây"
                        description="Hỗ trợ PDF tối đa 15MB"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || cvFiles.length === 0}
                      className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-10 font-bold"
                    >
                      {loading ? (
                        "Đang gửi hồ sơ..."
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5 mr-2" />
                          Gửi hồ sơ ứng tuyển ngay
                        </>
                      )}
                    </Button>

                    <p className="text-2xs text-muted-foreground text-center">
                      Bằng việc nhấn nộp đơn, bạn đồng ý với chính sách xử lý dữ liệu tuyển dụng của CYCLOSA.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 CYCLOSA HRM Platform. All rights reserved.
      </footer>
    </div>
  );
}
