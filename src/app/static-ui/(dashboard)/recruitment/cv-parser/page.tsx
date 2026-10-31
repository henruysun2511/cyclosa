"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Download,
  Printer,
  User,
  Building2,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  ChevronRight,
  ArrowLeft,
  Check,
  Star,
  Share2,
  Calendar,
  Send,
  XCircle,
  Clock,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CvParserAndReviewPage() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showHighlight, setShowHighlight] = useState(true);
  const [rating, setRating] = useState(5);
  const [recruiterNote, setRecruiterNote] = useState(
    "Hồ sơ xuất sắc, ứng viên có 5+ năm kinh nghiệm React/Next.js, từng làm Tech Lead tại fintech. Đề xuất mời vào vòng Phỏng vấn kỹ thuật với CTO."
  );
  const [status, setStatus] = useState<"REVIEWING" | "PASSED" | "REJECTED" | "TALENT_POOL">("REVIEWING");

  const handleApprove = () => {
    setStatus("PASSED");
    toast.success("Đã phê duyệt ứng viên vào Vòng Phỏng Vấn (Round 1)!", {
      description: "Hồ sơ đã được tự động chuyển tiếp sang ATS Pipeline và lịch phỏng vấn.",
    });
  };

  const handleReject = () => {
    setStatus("REJECTED");
    toast.error("Đã chuyển hồ sơ sang danh sách Không phù hợp", {
      description: "Hệ thống đã lưu trạng thái và chuẩn bị email cảm ơn tự động.",
    });
  };

  const handleSaveTalentPool = () => {
    setStatus("TALENT_POOL");
    toast.info("Đã lưu hồ sơ vào Ngân hàng Tài năng (Talent Pool) cho các cơ hội tương lai.");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header (Phong cách Dashboard: đơn giản, mềm mại, thanh lịch) ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Bóc tách & Đánh giá CV
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              ● Match Score: 94/100
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Đối soát CV gốc chuẩn Harvard và danh sách thông tin năng lực bóc tách tự động qua AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/recruitment/pipeline">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>ATS Pipeline</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveTalentPool}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Lưu Talent Pool
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Từ chối
          </Button>

          <Button
            size="sm"
            onClick={handleApprove}
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Duyệt phỏng vấn</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Thẻ KPI Tổng Kết Nhanh (Phong cách Dashboard) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Điểm phù hợp AI */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Điểm phù hợp với JD
              </span>
              <div className="text-2xl font-bold tracking-tight text-primary font-mono mt-0.5">
                94<span className="text-xs font-normal text-muted-foreground">/100</span>
              </div>
              <div className="w-28 bg-red-100 dark:bg-red-950/40 h-1.5 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full rounded-full" style={{ width: "94%" }} />
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-primary dark:bg-red-950/40 dark:text-red-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Vị trí ứng tuyển */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Vị trí ứng tuyển
              </span>
              <div className="text-base font-bold tracking-tight text-foreground mt-0.5 truncate max-w-[170px]">
                Senior Frontend Lead
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Khối Công Nghệ • FSI</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Thâm niên kinh nghiệm */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Kinh nghiệm tích lũy
              </span>
              <div className="text-base font-bold tracking-tight text-foreground mt-0.5">
                5.2 năm
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Yêu cầu JD: 4+ năm</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Trình độ học vấn */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Trình độ đào tạo
              </span>
              <div className="text-base font-bold tracking-tight text-foreground mt-0.5">
                ĐH Bách Khoa HN
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Kỹ sư CNTT • GPA 3.65</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Bố cục 2 Cột (Trái: CV Harvard Style | Phải: Metadata & Review) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── CỘT TRÁI: CV GIẢ LẬP CHUẨN HARVARD STYLE (7 cols) ─────── */}
        <Card className="lg:col-span-7 xl:col-span-7 border-border bg-card shadow-xs rounded-xl overflow-hidden">
          {/* Toolbar của CV Viewer */}
          <CardHeader className="py-3 px-5 border-b border-border flex flex-row items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-foreground">
                CV Ứng viên (Harvard Standard Format)
              </CardTitle>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHighlight(!showHighlight)}
                className="h-7 text-2xs gap-1 text-muted-foreground hover:text-foreground"
                title="Bật/Tắt highlight từ khóa AI bóc tách"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>AI Highlights</span>
              </Button>

              <div className="h-4 w-[1px] bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="h-7 w-7 p-0"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>

              <span className="font-mono text-2xs text-muted-foreground min-w-[32px] text-center">
                {zoomLevel}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="h-7 w-7 p-0"
                title="Phóng to"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(100)}
                className="h-7 w-7 p-0"
                title="Mặc định"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>

          {/* Vùng hiển thị CV Giả Lập Harvard Style */}
          <CardContent className="p-4 sm:p-6 bg-slate-100/60 dark:bg-muted/20 flex items-center justify-center min-h-[580px] overflow-auto">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              className="transition-transform duration-150"
            >
              {/* Trang giấy A4 mô phỏng chuẩn Harvard Style */}
              <div className="w-[520px] min-h-[720px] bg-white text-slate-900 shadow-md border border-slate-300 p-8 rounded-sm font-serif text-[11px] leading-relaxed space-y-3.5 select-none">
                {/* ── Header: Tên & Thông tin liên hệ ────────────────── */}
                <div className="text-center space-y-1 pb-2 border-b-2 border-slate-900">
                  <h2 className="text-xl font-bold tracking-wider uppercase font-serif text-slate-950">
                    PHẠM MINH TUẤN
                  </h2>
                  <p className="text-[10px] text-slate-600 font-sans tracking-tight">
                    Cầu Giấy, Hà Nội, Việt Nam • (+84) 974 567 890 • tuan.pham@cyclosa.vn
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans tracking-tight">
                    linkedin.com/in/tuanpham-dev • github.com/tuanpham-frontend
                  </p>
                </div>

                {/* ── 1. EDUCATION (Học vấn) ─────────────────────────── */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    EDUCATION
                  </h3>

                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <strong className="text-[11px] font-bold text-slate-900">
                        ĐẠI HỌC BÁCH KHOA HÀ NỘI (HUST)
                      </strong>
                      <span className="text-[10px] text-slate-600 italic">
                        Hà Nội, Việt Nam
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[10px] font-sans">
                      <span className="italic">
                        Kỹ sư Công nghệ Thông tin (Chuyên ngành Khoa học Máy tính)
                      </span>
                      <span className="font-mono text-slate-600">09/2014 – 06/2019</span>
                    </div>

                    <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-800 font-sans pl-1">
                      <li>
                        Điểm trung bình tích lũy:{" "}
                        <span
                          className={cn(
                            showHighlight &&
                              "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded"
                          )}
                        >
                          GPA 3.65 / 4.0 (Tốt nghiệp loại Giỏi)
                        </span>
                      </li>
                      <li>Học bổng Khuyến khích Tài năng HUST 4 kỳ liên tiếp; Giải Nhì Olympic Tin học Sinh viên.</li>
                    </ul>
                  </div>
                </div>

                {/* ── 2. EXPERIENCE (Kinh nghiệm làm việc) ───────────── */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    PROFESSIONAL EXPERIENCE
                  </h3>

                  {/* Vị trí 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <strong className="text-[11px] font-bold text-slate-900">
                        TẬP ĐOÀN CÔNG NGHỆ FSI / CYCLOSA
                      </strong>
                      <span className="text-[10px] text-slate-600 italic">
                        Hà Nội, Việt Nam
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[10px] font-sans">
                      <span className="italic font-medium">
                        Senior Frontend Engineer & Team Lead
                      </span>
                      <span className="font-mono text-slate-600">08/2022 – Hiện tại</span>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 font-sans pl-1">
                      <li>
                        Dẫn dắt đội ngũ 6 kỹ sư frontend xây dựng kiến trúc{" "}
                        <span
                          className={cn(
                            showHighlight &&
                              "bg-blue-100 text-blue-950 font-semibold px-1 rounded"
                          )}
                        >
                          Micro-Frontend trên React 19 & Next.js 15
                        </span>{" "}
                        phục vụ 15,000+ nhân viên doanh nghiệp.
                      </li>
                      <li>
                        Tối ưu hóa Core Web Vitals cho hệ thống Dashboard và ATS Pipeline,{" "}
                        <span
                          className={cn(
                            showHighlight &&
                              "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded"
                          )}
                        >
                          giảm FCP từ 2.4s xuống 0.8s (tăng 65% tốc độ)
                        </span>
                        .
                      </li>
                      <li>
                        Thiết kế Design System với 40+ reusable components chuẩn WCAG AA, rút ngắn 35% thời gian bàn giao tính năng mới.
                      </li>
                    </ul>
                  </div>

                  {/* Vị trí 2 */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <strong className="text-[11px] font-bold text-slate-900">
                        VNPAY / CỔNG THANH TOÁN ĐIỆN TỬ
                      </strong>
                      <span className="text-[10px] text-slate-600 italic">
                        Hà Nội, Việt Nam
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-[10px] font-sans">
                      <span className="italic font-medium">
                        Frontend Software Engineer
                      </span>
                      <span className="font-mono text-slate-600">06/2019 – 07/2022</span>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 font-sans pl-1">
                      <li>
                        Phát triển giao diện quản trị cổng thanh toán xử lý{" "}
                        <span
                          className={cn(
                            showHighlight &&
                              "bg-amber-100 text-amber-950 font-semibold px-1 rounded"
                          )}
                        >
                          2.5M giao dịch/ngày
                        </span>{" "}
                        sử dụng React, TypeScript và WebSockets.
                      </li>
                      <li>
                        Tích hợp luồng xác thực nhận diện khuôn mặt Face ID và OTP bảo mật 2 lớp, giảm thiểu 90% rủi ro gian lận truy cập.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ── 3. PROJECTS (Dự án tiêu biểu) ─────────────────── */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    KEY PROJECTS
                  </h3>

                  <div className="space-y-1 font-sans text-[10.5px]">
                    <div className="flex justify-between items-baseline">
                      <strong className="text-[11px] text-slate-900 font-semibold">
                        ATS Kanban Recruitment Pipeline:
                      </strong>
                      <span className="font-mono text-slate-500 text-[10px]">2023 – 2024</span>
                    </div>
                    <p className="text-slate-700 pl-1">
                      Nền tảng quản lý luồng ứng viên tuyển dụng kéo-thả thời gian thực, tích hợp AI matching tự động phân loại CV ứng viên.
                    </p>
                  </div>
                </div>

                {/* ── 4. TECHNICAL SKILLS & CERTIFICATIONS ──────────── */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    TECHNICAL SKILLS & CERTIFICATIONS
                  </h3>

                  <div className="space-y-1 font-sans text-[10.5px] text-slate-800">
                    <p>
                      <strong>Ngôn ngữ & Frameworks:</strong>{" "}
                      <span
                        className={cn(
                          showHighlight &&
                            "bg-purple-100 text-purple-950 font-semibold px-1 rounded"
                        )}
                      >
                        TypeScript, JavaScript (ES6+), React 19, Next.js, Tailwind CSS, Redux Toolkit
                      </span>
                    </p>
                    <p>
                      <strong>Kiến trúc & Công cụ:</strong> Micro-Frontend, RESTful APIs, GraphQL, Docker, Git, Jest, Playwright CI/CD.
                    </p>
                    <p>
                      <strong>Ngoại ngữ & Chứng chỉ:</strong> Tiếng Anh chuyên ngành (
                      <span
                        className={cn(
                          showHighlight &&
                            "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded"
                        )}
                      >
                        IELTS 7.5
                      </span>
                      ), AWS Certified Cloud Practitioner (2023).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── CỘT PHẢI: METADATA & REVIEW ĐÁNH GIÁ (5 cols) ─────────── */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4">
          {/* Card 1: AI Match Score & Phân tích chuyên sâu */}
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI Matching Analysis</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phân tích mức độ tương thích với Job Description
                </p>
              </div>

              <div className="text-right">
                <span className="text-xl font-bold font-mono text-primary">94%</span>
                <span className="text-[10px] text-muted-foreground block">Tương thích</span>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {/* Thanh tiến độ tổng quan */}
              <div className="space-y-1.5 pb-3 border-b border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Tổng điểm tương thích hồ sơ:</span>
                  <span className="font-mono font-bold text-primary text-sm">94%</span>
                </div>
                <div className="w-full bg-red-100 dark:bg-red-950/40 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: "94%" }}
                  />
                </div>
              </div>

              {/* Tiêu chí phân rã matching */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Kỹ năng cốt lõi (Tech Stack):</span>
                    <span className="font-mono font-semibold text-primary">96%</span>
                  </div>
                  <div className="w-full bg-red-50 dark:bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: "96%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Số năm kinh nghiệm & Leadership:</span>
                    <span className="font-mono font-semibold text-primary">92%</span>
                  </div>
                  <div className="w-full bg-red-50 dark:bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Học vấn & Bằng cấp:</span>
                    <span className="font-mono font-semibold text-primary">100%</span>
                  </div>
                  <div className="w-full bg-red-50 dark:bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: "100%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Ngoại ngữ & Kỹ năng bổ trợ (IELTS):</span>
                    <span className="font-mono font-semibold text-primary">90%</span>
                  </div>
                  <div className="w-full bg-red-50 dark:bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>

              {/* Tóm tắt nhận xét AI */}
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  Đánh giá nhanh từ AI Copilot:
                </span>
                <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  ✓ Ứng viên đáp ứng đầy đủ yêu cầu vị trí Lead Frontend: thạo React/Next.js, từng chịu trách nhiệm hệ thống quy mô lớn, GPA giỏi HUST.
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  ⚡ <em>Gợi ý phỏng vấn:</em> Đào sâu kinh nghiệm xử lý xung đột kỹ thuật và chiến lược phân chia module Micro-Frontend.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Thông tin Metadata trích xuất có cấu trúc */}
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground">
                Thông tin Ứng viên Bóc tách
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3.5 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground text-[11px] block">Họ và tên</span>
                <strong className="text-foreground text-sm font-semibold block">
                  Phạm Minh Tuấn
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Email liên hệ</span>
                  <span className="font-mono text-foreground font-medium block truncate">
                    tuan.pham@cyclosa.vn
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Số điện thoại</span>
                  <span className="font-mono text-foreground font-medium block">
                    0974 567 890
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Kinh nghiệm</span>
                  <span className="text-foreground font-semibold block">5.2 năm</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Địa điểm</span>
                  <span className="text-foreground font-medium block truncate">Hà Nội</span>
                </div>
              </div>

              {/* Danh sách kỹ năng (Skill Tags) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground text-[11px] block">
                  Kỹ năng chuyên môn khớp (Matched Skills)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "React 19",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Micro-Frontend",
                    "Architecture",
                    "Redux Toolkit",
                    "IELTS 7.5",
                  ].map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-2xs font-mono font-medium"
                    >
                      ✓ {skill}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-2xs font-mono text-muted-foreground">
                    AWS Cloud
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Đánh giá của Recruiter & Phê duyệt bước tiếp theo */}
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
              <CardTitle className="text-sm font-semibold text-foreground">
                Đánh giá của Tuyển dụng (Recruiter Review)
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3.5 text-xs">
              {/* Rating 5 sao */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Đánh giá hồ sơ:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground font-mono ml-1.5">
                    {rating}.0/5
                  </span>
                </div>
              </div>

              {/* Recruiter Notes */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Ghi chú tuyển dụng vòng lọc CV</Label>
                <Textarea
                  value={recruiterNote}
                  onChange={(e) => setRecruiterNote(e.target.value)}
                  rows={3}
                  className="text-xs resize-none bg-card"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  onClick={handleApprove}
                  className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  <span>Duyệt vào vòng Phỏng vấn (Interview)</span>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveTalentPool}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Lưu Talent Pool
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    Không phù hợp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
