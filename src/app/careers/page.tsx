"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  DollarSign,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SpiderIcon } from "@/components/shared";

interface PublicJobOpening {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  deadline: string;
  summary: string;
  tags: string[];
}

const MOCK_PUBLIC_JOBS: PublicJobOpening[] = [
  {
    slug: "senior-frontend-engineer-react",
    title: "Senior Frontend Engineer (React 19 / Next.js)",
    department: "Khối Công Nghệ & Chuyển Đổi Số",
    location: "Hà Nội (Trụ Sở FSI)",
    type: "Toàn thời gian",
    salaryRange: "30,000,000 — 45,000,000 ₫",
    deadline: "31/10/2026",
    summary: "Tham gia phát triển kiến trúc nền tảng ERP & Smart Workplace cho hàng trăm nghìn người dùng doanh nghiệp lớn.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "ai-engineer-llm-rag",
    title: "AI Engineer (LLM & RAG Agent Systems)",
    department: "Trung Tâm Nghiên Cứu AI & Data",
    location: "Hà Nội / Hybrid",
    type: "Toàn thời gian",
    salaryRange: "35,000,000 — 60,000,000 ₫",
    deadline: "15/11/2026",
    summary: "Xây dựng hệ thống trợ lý ảo Copilot, bóc tách OCR tài liệu pháp lý và phân tích số liệu nhân sự doanh nghiệp.",
    tags: ["Python", "LangChain", "PyTorch", "RAG"],
  },
  {
    slug: "senior-backend-engineer-java",
    title: "Senior Backend Engineer (Java / Spring Boot)",
    department: "Khối Công Nghệ & Chuyển Đổi Số",
    location: "TP. Hồ Chí Minh",
    type: "Toàn thời gian",
    salaryRange: "30,000,000 — 48,000,000 ₫",
    deadline: "30/10/2026",
    summary: "Thiết kế kiến trúc vi dịch vụ (Microservices), tối ưu hóa hiệu năng cơ sở dữ liệu và bảo mật cấp ngân hàng.",
    tags: ["Java 21", "Spring Boot 3", "PostgreSQL", "Kafka"],
  },
  {
    slug: "enterprise-sales-manager",
    title: "Enterprise Sales Manager (B2B SaaS)",
    department: "Khối Kinh Doanh Doanh Nghiệp",
    location: "Hà Nội / TP. HCM",
    type: "Toàn thời gian",
    salaryRange: "25,000,000 — 40,000,000 ₫ + Thưởng DS",
    deadline: "20/10/2026",
    summary: "Mở rộng mạng lưới khách hàng doanh nghiệp thuộc nhóm tài chính, ngân hàng và tập đoàn đa ngành.",
    tags: ["B2B SaaS", "Enterprise Sales", "Đàm phán"],
  },
];

export default function CareersPublicPage() {
  const [search, setSearch] = useState("");

  const filteredJobs = MOCK_PUBLIC_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* ── Public Brand Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/careers" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center font-black shadow-xs">
              <SpiderIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-foreground tracking-tight">
                CYCLOSA <span className="text-primary font-normal">Careers</span>
              </span>
              <span className="text-2xs text-muted-foreground uppercase tracking-widest">
                FSI Corporation
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/login">Đăng nhập nhân viên</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <Badge className="bg-primary/20 text-indigo-300 border-indigo-400/30 text-xs px-3 py-1">
            Gia nhập Đội ngũ Tiên phong Công nghệ
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Kiến tạo Tương lai Chuyển đổi số Doanh nghiệp
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Khám phá các cơ hội nghề nghiệp tại CYCLOSA — Môi trường làm việc mở, chế độ đãi ngộ hàng đầu và cơ hội bứt phá công danh.
          </p>

          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm vị trí tuyển dụng, kỹ năng, công nghệ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 pr-4 bg-white/10 text-white placeholder:text-slate-400 border-white/20 rounded-full text-xs shadow-lg backdrop-blur-md focus:bg-white focus:text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Job Openings List ───────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Các vị trí đang tuyển dụng ({filteredJobs.length})
          </h2>
          <Badge variant="outline" className="text-xs font-mono">REC-01</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <Card
              key={job.slug}
              className="shadow-2xs border-border hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <CardHeader className="p-6 pb-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium text-primary">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.department}
                  </span>
                  <span className="font-mono">{job.type}</span>
                </div>

                <CardTitle className="text-base font-bold text-foreground hover:text-primary transition-colors">
                  <Link href={`/careers/${job.slug}`}>{job.title}</Link>
                </CardTitle>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {job.summary}
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((t, idx) => (
                    <Badge key={idx} variant="secondary" className="text-2xs bg-slate-100 font-normal">
                      {t}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-border font-mono">
                  <div className="flex items-center gap-1 text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold justify-end">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{job.salaryRange}</span>
                  </div>
                </div>

                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                  <Link href={`/careers/${job.slug}`}>
                    Ứng tuyển vị trí này
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* ── Public Footer ───────────────────────────────────────────── */}
      <footer className="bg-white border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto px-4 space-y-1">
          <p>© 2026 CYCLOSA HRM Platform. All rights reserved.</p>
          <p>Tòa nhà FSI Tower, Số 18 Cầu Giấy, Hà Nội • Email tuyển dụng: tuyendung@cyclosa.vn</p>
        </div>
      </footer>
    </div>
  );
}
