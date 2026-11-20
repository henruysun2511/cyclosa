"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Star,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { CandidateDto, ApplicationDto } from "../../types/recruitment.types";

interface CvPreviewComparatorProps {
  candidate: CandidateDto;
  application?: ApplicationDto | null;
  onApproveForInterview?: () => void;
  onReject?: () => void;
  onSaveTalentPool?: () => void;
}

export function CvPreviewComparator({
  candidate,
  application,
  onApproveForInterview,
  onReject,
  onSaveTalentPool,
}: CvPreviewComparatorProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showHighlight, setShowHighlight] = useState(true);
  const [rating, setRating] = useState(5);
  const [recruiterNote, setRecruiterNote] = useState(
    "Hồ sơ xuất sắc, ứng viên có 5+ năm kinh nghiệm React/Next.js, từng làm Tech Lead tại fintech. Đề xuất mời vào vòng Phỏng vấn kỹ thuật với CTO."
  );

  const matchScore = application?.aiMatchScore ?? 94;
  const matchLog = application?.aiScreeningLog;

  return (
    <div className="space-y-6">
      {/* ── Bố cục 2 Cột (Trái: CV Harvard Style 7 cols | Phải: Metadata & Review 5 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── CỘT TRÁI: CV GIẢ LẬP CHUẨN HARVARD STYLE (7 cols) ─────── */}
        <Card className="lg:col-span-7 xl:col-span-7 border-border bg-card shadow-xs rounded-xl overflow-hidden">
          {/* Toolbar của CV Viewer */}
          <CardHeader className="py-3 px-5 border-b border-border flex flex-row items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-foreground">
                CV Ứng viên
              </CardTitle>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHighlight(!showHighlight)}
                className={cn(
                  "h-7 text-xs gap-1",
                  showHighlight
                    ? "text-primary font-bold bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Bật/Tắt highlight từ khóa AI bóc tách"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>AI Highlights</span>
              </Button>

              <div className="h-4 w-[1px] bg-border mx-1" />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="h-7 w-7 p-0"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>

              <span className="font-mono text-xs text-muted-foreground min-w-[32px] text-center">
                {zoomLevel}%
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="h-7 w-7 p-0"
                title="Phóng to"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(100)}
                className="h-7 w-7 p-0"
                title="Mặc định"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>

              {candidate.resumeUrl && (
                <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs ml-1">
                  <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3 w-3 mr-1" />
                    <span>Tải file gốc</span>
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Vùng hiển thị CV Giả Lập Harvard Style */}
          <CardContent className="p-4 sm:p-6 bg-slate-100/70 dark:bg-muted/20 flex items-center justify-center min-h-[620px] overflow-auto">
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
                    {candidate.fullName.toUpperCase()}
                  </h2>
                  <p className="text-[10px] text-slate-600 font-sans tracking-tight">
                    {candidate.address || "Cầu Giấy, Hà Nội, Việt Nam"} • {candidate.phone || "(+84) 974 567 890"} • {candidate.email}
                  </p>
                  <p className="text-[10px] text-slate-600 font-sans tracking-tight">
                    linkedin.com/in/{candidate.fullName.toLowerCase().replace(/\s+/g, "")}-dev • github.com/{candidate.fullName.toLowerCase().replace(/\s+/g, "")}-frontend
                  </p>
                </div>

                {/* ── 1. EDUCATION (Học vấn) ─────────────────────────── */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    EDUCATION
                  </h3>

                  {candidate.educations && candidate.educations.length > 0 ? (
                    candidate.educations.map((edu, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline font-sans">
                          <strong className="text-[11px] font-bold text-slate-900">
                            {edu.institutionName.toUpperCase()}
                          </strong>
                          <span className="text-[10px] text-slate-600 italic">Việt Nam</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[10px] font-sans">
                          <span className="italic">
                            {edu.degree} {edu.major ? `- ${edu.major}` : ""}
                          </span>
                          <span className="font-mono text-slate-600">
                            {edu.startDate || "2015"} – {edu.endDate || "2019"}
                          </span>
                        </div>
                        {edu.gpa !== undefined && (
                          <p className="text-[10.5px] text-slate-800 font-sans pl-1">
                            • Điểm tích lũy:{" "}
                            <span
                              className={cn(
                                showHighlight &&
                                  "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded"
                              )}
                            >
                              GPA {edu.gpa} / 4.0
                            </span>
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline font-sans">
                        <strong className="text-[11px] font-bold text-slate-900">
                          ĐẠI HỌC BÁCH KHOA HÀ NỘI (HUST)
                        </strong>
                        <span className="text-[10px] text-slate-600 italic">Hà Nội, Việt Nam</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[10px] font-sans">
                        <span className="italic">Kỹ sư Công nghệ Thông tin (Chuyên ngành Khoa học Máy tính)</span>
                        <span className="font-mono text-slate-600">09/2014 – 06/2019</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-800 font-sans pl-1">
                        <li>
                          Điểm trung bình tích lũy:{" "}
                          <span className={cn(showHighlight && "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded")}>
                            GPA 3.65 / 4.0 (Tốt nghiệp loại Giỏi)
                          </span>
                        </li>
                        <li>Học bổng Khuyến khích Tài năng HUST 4 kỳ liên tiếp; Giải Nhì Olympic Tin học Sinh viên.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* ── 2. EXPERIENCE (Kinh nghiệm làm việc) ───────────── */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 font-serif border-b border-slate-400 pb-0.5">
                    PROFESSIONAL EXPERIENCE
                  </h3>

                  {candidate.workExperiences && candidate.workExperiences.length > 0 ? (
                    candidate.workExperiences.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline font-sans">
                          <strong className="text-[11px] font-bold text-slate-900">
                            {exp.companyName.toUpperCase()}
                          </strong>
                          <span className="text-[10px] text-slate-600 italic">Việt Nam</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[10px] font-sans">
                          <span className="italic font-medium">{exp.position}</span>
                          <span className="font-mono text-slate-600">
                            {exp.startDate || "2021"} – {exp.isCurrent ? "Hiện tại" : exp.endDate || "2024"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-[10.5px] text-slate-800 font-sans pl-1 leading-relaxed">
                            • {exp.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between items-baseline font-sans">
                          <strong className="text-[11px] font-bold text-slate-900">
                            TẬP ĐOÀN CÔNG NGHỆ FSI / CYCLOSA
                          </strong>
                          <span className="text-[10px] text-slate-600 italic">Hà Nội, Việt Nam</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[10px] font-sans">
                          <span className="italic font-medium">Senior Frontend Engineer & Team Lead</span>
                          <span className="font-mono text-slate-600">08/2022 – Hiện tại</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 font-sans pl-1">
                          <li>
                            Dẫn dắt đội ngũ 6 kỹ sư frontend xây dựng kiến trúc{" "}
                            <span className={cn(showHighlight && "bg-blue-100 text-blue-950 font-semibold px-1 rounded")}>
                              Micro-Frontend trên React 19 & Next.js 15
                            </span>{" "}
                            phục vụ 15,000+ nhân viên doanh nghiệp.
                          </li>
                          <li>
                            Tối ưu hóa Core Web Vitals cho hệ thống Dashboard và ATS Pipeline,{" "}
                            <span className={cn(showHighlight && "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded")}>
                              giảm FCP từ 2.4s xuống 0.8s (tăng 65% tốc độ)
                            </span>.
                          </li>
                          <li>
                            Thiết kế Design System với 40+ reusable components chuẩn WCAG AA, rút ngắn 35% thời gian bàn giao tính năng mới.
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-baseline font-sans">
                          <strong className="text-[11px] font-bold text-slate-900">
                            VNPAY / CỔNG THANH TOÁN ĐIỆN TỬ
                          </strong>
                          <span className="text-[10px] text-slate-600 italic">Hà Nội, Việt Nam</span>
                        </div>
                        <div className="flex justify-between items-baseline text-[10px] font-sans">
                          <span className="italic font-medium">Frontend Software Engineer</span>
                          <span className="font-mono text-slate-600">06/2019 – 07/2022</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[10.5px] text-slate-800 font-sans pl-1">
                          <li>
                            Phát triển giao diện quản trị cổng thanh toán xử lý{" "}
                            <span className={cn(showHighlight && "bg-amber-100 text-amber-950 font-semibold px-1 rounded")}>
                              2.5M giao dịch/ngày
                            </span>{" "}
                            sử dụng React, TypeScript và WebSockets.
                          </li>
                          <li>
                            Tích hợp luồng xác thực nhận diện khuôn mặt Face ID và OTP bảo mật 2 lớp, giảm thiểu 90% rủi ro gian lận truy cập.
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
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
                      <span className={cn(showHighlight && "bg-purple-100 text-purple-950 font-semibold px-1 rounded")}>
                        {candidate.skills && candidate.skills.length > 0
                          ? candidate.skills.map((s) => s.skillName).join(", ")
                          : "TypeScript, JavaScript (ES6+), React 19, Next.js, Tailwind CSS, Redux Toolkit"}
                      </span>
                    </p>
                    <p>
                      <strong>Kiến trúc & Công cụ:</strong> Micro-Frontend, RESTful APIs, GraphQL, Docker, Git, Jest, Playwright CI/CD.
                    </p>
                    <p>
                      <strong>Ngoại ngữ & Chứng chỉ:</strong> Tiếng Anh chuyên ngành (
                      <span className={cn(showHighlight && "bg-emerald-100 text-emerald-950 font-semibold px-1 rounded")}>
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
                <span className="text-xl font-bold font-mono text-primary">{matchScore}%</span>
                <span className="text-[10px] text-muted-foreground block">Tương thích</span>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {/* Thanh tiến độ tổng quan */}
              <div className="space-y-1.5 pb-3 border-b border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Tổng điểm tương thích hồ sơ:</span>
                  <span className="font-mono font-bold text-primary text-sm">{matchScore}%</span>
                </div>
                <div className="w-full bg-red-100 dark:bg-red-950/40 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${matchScore}%` }}
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

              {/* Tóm tắt nhận xét AI Copilot */}
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-900 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  Đánh giá nhanh từ AI Copilot:
                </span>
                <p className="text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  {matchLog?.notes ||
                    "✓ Ứng viên đáp ứng đầy đủ yêu cầu vị trí Lead Frontend: thạo React/Next.js, từng chịu trách nhiệm hệ thống quy mô lớn, GPA giỏi HUST."}
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
                  {candidate.fullName}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Email liên hệ</span>
                  <span className="font-mono text-foreground font-medium block truncate">
                    {candidate.email}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Số điện thoại</span>
                  <span className="font-mono text-foreground font-medium block">
                    {candidate.phone || "0974 567 890"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Kinh nghiệm</span>
                  <span className="text-foreground font-semibold block">
                    {candidate.yearsOfExperience || 5.2} năm
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] block">Địa điểm</span>
                  <span className="text-foreground font-medium block truncate">
                    {candidate.address || "Hà Nội"}
                  </span>
                </div>
              </div>

              {/* Danh sách kỹ năng (Skill Tags) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground text-[11px] block">
                  Kỹ năng chuyên môn khớp (Matched Skills)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.skills && candidate.skills.length > 0
                    ? candidate.skills.map((s) => s.skillName)
                    : [
                        "React 19",
                        "Next.js",
                        "TypeScript",
                        "Tailwind CSS",
                        "Micro-Frontend",
                        "Architecture",
                        "Redux Toolkit",
                        "IELTS 7.5",
                      ]
                  ).map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-mono font-medium"
                    >
                      ✓ {skill}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
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
                Đánh giá của Tuyển dụng
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
                {onApproveForInterview && (
                  <Button
                    type="button"
                    onClick={onApproveForInterview}
                    className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    <span>Duyệt vào vòng Phỏng vấn (Interview)</span>
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {onSaveTalentPool && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onSaveTalentPool}
                      className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Lưu Talent Pool
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onReject}
                      className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                    >
                      Không phù hợp
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
