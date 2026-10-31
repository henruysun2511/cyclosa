"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  XCircle,
  FileText,
  Star,
  RotateCw,
  ExternalLink,
  Layers,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Check,
  ChevronRight,
  Sliders,
  Eye,
  Scan,
  LayoutDashboard,
  Kanban,
  Map,
  BadgeCheck,
} from "lucide-react";
import { SpiderIcon } from "@/components/shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Danh mục các màn hình minh họa hoạt hình trong thư viện
interface ScreenItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  active: boolean;
  realUrl: string;
  description: string;
  icon: React.ElementType;
}

const SCREENS_CATALOG: ScreenItem[] = [
  {
    id: "ai-parser",
    title: "AI CV Parser & Matcher",
    category: "Tuyển dụng & AI",
    badge: "Đang mở",
    active: true,
    realUrl: "/recruitment/cv-parser",
    description: "Bóc tách thông tin ứng viên từ CV gốc Harvard và chấm điểm đối soát AI.",
    icon: Scan,
  },
  {
    id: "overview",
    title: "Dashboard Tổng quan 360°",
    category: "Thống kê & Vận hành",
    badge: "Sắp ra mắt",
    active: false,
    realUrl: "/dashboard",
    description: "Bộ thẻ KPI hoạt hình, biểu đồ cơ cấu nhân sự và lịch chấm công.",
    icon: LayoutDashboard,
  },
  {
    id: "ats-pipeline",
    title: "Sơ đồ Tuyển dụng ATS Kanban",
    category: "Tuyển dụng",
    badge: "Sắp ra mắt",
    active: false,
    realUrl: "/recruitment/pipeline",
    description: "Luồng thẻ ứng viên di chuyển qua các phễu phỏng vấn hoạt hình sinh động.",
    icon: Kanban,
  },
  {
    id: "workplace-map",
    title: "Bản đồ Chỗ ngồi Mặt bằng 2D",
    category: "Không gian làm việc",
    badge: "Sắp ra mắt",
    active: false,
    realUrl: "/workplace/map",
    description: "Bản đồ sơ đồ văn phòng vui nhộn với trạng thái ghế trống và đã ngồi.",
    icon: Map,
  },
];

export default function CartoonAnimationGalleryPage() {
  const [selectedScreenId, setSelectedScreenId] = useState("ai-parser");
  const [laserActive, setLaserActive] = useState(true);
  const [motionActive, setMotionActive] = useState(true);
  const [stampStatus, setStampStatus] = useState<"NONE" | "PASSED" | "REJECTED">("NONE");
  const [userRating, setUserRating] = useState(5);
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>("React / Next.js");

  const currentScreen = SCREENS_CATALOG.find((s) => s.id === selectedScreenId) || SCREENS_CATALOG[0];

  const handleApprove = () => {
    setStampStatus("PASSED");
    toast.success("Đã phê duyệt ứng viên!", {
      description: "Đóng dấu mộc cartoon PASSED thành công lên tài liệu CV.",
    });
  };

  const handleReject = () => {
    setStampStatus("REJECTED");
    toast.error("Đã từ chối ứng viên!", {
      description: "Đóng dấu mộc cartoon REJECTED lên tài liệu.",
    });
  };

  const handleResetStamp = () => {
    setStampStatus("NONE");
    toast.info("Đã thiết lập lại trạng thái tài liệu");
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16">
      {/* ── 1. Header Giới thiệu Phòng Thí Nghiệm Hoạt Hình ────────── */}
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-slate-900 bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#0f172a]">
        {/* Background decorative cartoon dots */}
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-red-100/70 border-[2px] border-red-300 pointer-events-none" />
        <div className="absolute top-1/2 right-12 h-8 w-8 rounded-full bg-amber-200 border-[2px] border-amber-400 pointer-events-none hidden sm:block" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                <SpiderIcon className="h-3.5 w-3.5" />
                <span>CYCLOSA CARTOON UI LAB</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs border-[1.5px] border-amber-400">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Phong cách Hoạt hình Đồ họa
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              Thư viện Giao diện Minh họa Hoạt hình
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Trừu tượng hóa các màn hình hệ thống theo ngôn ngữ hoạt hình (Cartoon Wireframe), đường viền
              đậm cá tính (Neo-brutalist / Comic), bóng nổi 3D đặc trưng và các hiệu ứng quét AI sống động.
              Toàn bộ giữ nguyên bảng màu nhận diện đỏ chủ đạo của <strong>CYCLOSA</strong>.
            </p>
          </div>

          {/* Quick Stats / Info card */}
          <div className="flex items-center gap-3 bg-slate-50 border-[2px] border-slate-900 rounded-2xl p-3.5 shadow-[4px_4px_0px_#0f172a] shrink-0">
            <div className="h-12 w-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a]">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Đang hiển thị
              </div>
              <div className="text-base font-bold text-slate-900">
                Màn hình: AI Parser
              </div>
              <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                Tia quét Laser AI đang chạy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Danh mục màn hình (Screen Switcher) & Thanh công cụ ──── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-red-600" />
            <span>Danh mục Màn hình Minh họa:</span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle Laser */}
            <button
              type="button"
              onClick={() => setLaserActive(!laserActive)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold text-xs border-[2px] border-slate-900 transition-all select-none flex items-center gap-1.5 cursor-pointer",
                laserActive
                  ? "bg-red-500 text-white shadow-[2px_2px_0px_#0f172a]"
                  : "bg-white text-slate-600 shadow-[2px_2px_0px_#0f172a]"
              )}
            >
              <Zap className={cn("h-3.5 w-3.5", laserActive && "animate-bounce")} />
              <span>Laser Quét: {laserActive ? "BẬT" : "TẮT"}</span>
            </button>

            {/* Toggle Motion */}
            <button
              type="button"
              onClick={() => setMotionActive(!motionActive)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-bold text-xs border-[2px] border-slate-900 transition-all select-none flex items-center gap-1.5 cursor-pointer",
                motionActive
                  ? "bg-amber-400 text-slate-900 shadow-[2px_2px_0px_#0f172a]"
                  : "bg-white text-slate-600 shadow-[2px_2px_0px_#0f172a]"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Hiệu ứng rung động: {motionActive ? "BẬT" : "TẮT"}</span>
            </button>

            {/* Link to real screen */}
            <Link
              href={currentScreen.realUrl}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-slate-900 text-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-800 transition-all flex items-center gap-1.5 no-underline hover:no-underline"
            >
              <span>Đến trang thật</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Catalog Screen Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCREENS_CATALOG.map((screen) => {
            const Icon = screen.icon;
            const isSelected = screen.id === selectedScreenId;
            return (
              <button
                key={screen.id}
                type="button"
                onClick={() => {
                  if (screen.id === "ai-parser") {
                    setSelectedScreenId(screen.id);
                  } else {
                    toast.info(`Màn hình "${screen.title}" đang được dựng trong bộ thư viện hoạt hình!`, {
                      description: "Hiện tại bạn có thể trải nghiệm đầy đủ trang AI Parser trước.",
                    });
                  }
                }}
                className={cn(
                  "p-3.5 rounded-2xl border-[2.5px] text-left transition-all relative flex flex-col justify-between gap-2.5 select-none cursor-pointer",
                  isSelected
                    ? "bg-white border-slate-900 shadow-[4px_4px_0px_#0f172a] -translate-y-0.5"
                    : "bg-slate-100/80 border-slate-300 hover:border-slate-800 hover:bg-white hover:shadow-[3px_3px_0px_#0f172a]"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center font-bold border-[2px] border-slate-900 shrink-0",
                      isSelected
                        ? "bg-red-600 text-white shadow-[2px_2px_0px_#0f172a]"
                        : "bg-white text-slate-700"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-extrabold border-[1.5px] uppercase",
                      isSelected
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "bg-slate-200/70 text-slate-600 border-slate-300"
                    )}
                  >
                    {screen.badge}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-900 line-clamp-1">
                    {screen.title}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {screen.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. KHUNG TRÌNH DIỄN MÀN HÌNH HOẠT HÌNH: AI PARSER ──────── */}
      <div className="relative rounded-3xl border-[3px] border-slate-900 bg-slate-100/90 p-4 sm:p-7 shadow-[8px_8px_0px_#0f172a]">
        {/* Top Floating Tape Decor */}
        <div className="absolute -top-3 left-10 px-4 py-0.5 bg-amber-300 border-[2px] border-slate-900 rounded-md font-mono text-[11px] font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a] rotate-[-2deg] select-none">
          ★ CARTOON WIREFRAME STAGE — AI PARSER
        </div>

        {/* ── 3.1. Comic Header Bar của màn hình ─────────────────────── */}
        <div className="bg-white rounded-2xl border-[2.5px] border-slate-900 p-4 sm:p-5 shadow-[4px_4px_0px_#0f172a] mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-red-600 text-white flex items-center justify-center border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] shrink-0">
              <SpiderIcon className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-black text-slate-900 tracking-tight font-sans">
                  Bóc tách & Đánh giá CV (AI Parser)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-black border-[1.5px] border-red-300 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  <span>Match Score: 94/100</span>
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Khung đối soát tài liệu CV gốc chuẩn Harvard vs Thực thể năng lực bóc tách AI
              </div>
            </div>
          </div>

          {/* Action buttons (Comic style) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {stampStatus !== "NONE" && (
              <button
                type="button"
                onClick={handleResetStamp}
                className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white text-slate-700 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                title="Gỡ dấu mộc để thử lại"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Gỡ mộc</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleReject}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-rose-100 text-rose-800 border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:bg-rose-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <XCircle className="h-3.5 w-3.5 text-rose-600" />
              <span>Từ chối</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-1.5 rounded-xl font-bold text-xs bg-red-600 text-white border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Duyệt ứng viên</span>
            </button>
          </div>
        </div>

        {/* ── 3.2. Nội dung 2 cột đối soát dạng Hoạt hình ────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================
              CỘT TRÁI (7 cols): TÀI LIỆU CV HOẠT HÌNH (CARTOON CV DOC)
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600 border border-slate-900" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  1. Tài liệu CV Gốc (Harvard Format)
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-300">
                📄 Page 1 of 2 • 100% Zoom
              </span>
            </div>

            {/* BẢNG GIẤY CV HOẠT HÌNH */}
            <div
              className={cn(
                "relative bg-white rounded-3xl border-[3px] border-slate-900 p-6 sm:p-8 shadow-[6px_6px_0px_#0f172a] overflow-hidden min-h-[580px] transition-transform select-none",
                motionActive && "animate-cartoonFloat"
              )}
            >
              {/* Paper Corner Fold Effect */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-slate-200 border-b-[2.5px] border-l-[2.5px] border-slate-900 rounded-bl-xl shadow-xs" />

              {/* TIA LASER QUÉT AI ĐỘNG (NẾU BẬT) */}
              {laserActive && (
                <div
                  className="absolute left-0 right-0 h-1 bg-red-600 shadow-[0_0_12px_#dc2626] animate-laser z-20 pointer-events-none"
                  style={{ opacity: 0.9 }}
                >
                  <div className="absolute -top-2 left-6 px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-xs">
                    ✦ AI SCANNING RAY
                  </div>
                </div>
              )}

              {/* DẤU MỘC CARTOON NẾU ĐÃ BẤM DUYỆT HOẶC TỪ CHỐI */}
              {stampStatus === "PASSED" && (
                <div className="absolute top-1/3 right-8 z-30 animate-stampPop pointer-events-none">
                  <div className="px-5 py-3 rounded-2xl border-[4px] border-red-600 bg-red-100/90 text-red-600 font-black text-2xl uppercase tracking-widest rotate-[-12deg] shadow-[4px_4px_0px_#dc2626] flex flex-col items-center justify-center">
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck className="h-6 w-6 stroke-[3]" />
                      PASSED ✓
                    </span>
                    <span className="text-[10px] tracking-normal font-mono font-bold mt-0.5">
                      CYCLOSA AI VERIFIED
                    </span>
                  </div>
                </div>
              )}

              {stampStatus === "REJECTED" && (
                <div className="absolute top-1/3 right-8 z-30 animate-stampPop pointer-events-none">
                  <div className="px-5 py-3 rounded-2xl border-[4px] border-rose-600 bg-rose-100/90 text-rose-600 font-black text-2xl uppercase tracking-widest rotate-[-12deg] shadow-[4px_4px_0px_#e11d48] flex flex-col items-center justify-center">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="h-6 w-6 stroke-[3]" />
                      REJECTED ✕
                    </span>
                    <span className="text-[10px] tracking-normal font-mono font-bold mt-0.5">
                      NOT MATCHED WITH JD
                    </span>
                  </div>
                </div>
              )}

              {/* ── NỘI DUNG CV THEO PHONG CÁCH HOẠT HÌNH ────────── */}
              <div className="space-y-6">
                {/* CV Header: Avatar doodle & Tên ứng viên */}
                <div className="flex items-start gap-4 pb-5 border-b-[2px] border-slate-200">
                  {/* Cartoon avatar doodle */}
                  <div className="h-16 w-16 rounded-2xl bg-amber-100 border-[2.5px] border-slate-900 flex items-center justify-center text-slate-800 font-black text-xl shrink-0 shadow-[3px_3px_0px_#0f172a] relative">
                    <span>👨‍💻</span>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-[2px] border-slate-900 flex items-center justify-center text-white text-[10px]">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    {/* Tên ứng viên (khối cartoon nổi bật) */}
                    <div className="inline-block bg-slate-900 text-white font-black text-base px-3 py-1 rounded-xl shadow-[2px_2px_0px_#dc2626]">
                      NGUYỄN TUẤN CƯỜNG
                    </div>

                    <div className="text-xs font-bold text-red-600 uppercase tracking-wide flex items-center gap-1.5">
                      <span>Senior Fullstack Engineer / Tech Lead</span>
                    </div>

                    {/* Contact chips */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 text-[10px] font-semibold text-slate-700">
                        <Mail className="h-3 w-3 text-red-500" />
                        cuong.nguyen@cyclosa.vn
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 text-[10px] font-semibold text-slate-700">
                        <Phone className="h-3 w-3 text-emerald-600" />
                        0974 567 890
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-300 text-[10px] font-semibold text-slate-700">
                        <MapPin className="h-3 w-3 text-blue-500" />
                        Cầu Giấy, Hà Nội
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 1: HỌC VẤN (EDUCATION) HOẠT HÌNH */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                    <GraduationCap className="h-4 w-4 text-red-600" />
                    <span>HỌC VẤN & ĐÀO TẠO</span>
                    <span className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>

                  <div className="bg-slate-50 border-[2px] border-slate-800 rounded-2xl p-3 space-y-1.5 shadow-[2px_2px_0px_#0f172a]">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>ĐẠI HỌC BÁCH KHOA HÀ NỘI</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        2015 – 2020
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Kỹ sư Công nghệ Thông tin (Khoa CNTT) — GPA: 3.65 / 4.0
                    </div>
                  </div>
                </div>

                {/* Section 2: KINH NGHIỆM LÀM VIỆC VỚI VÙNG AI KHOANH VÙNG (BOUNDING BOX) */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                    <Briefcase className="h-4 w-4 text-red-600" />
                    <span>KINH NGHIỆM LÀM VIỆC (AI KHOANH VÙNG)</span>
                    <span className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>

                  {/* Job 1 with AI Bounding Box highlight */}
                  <div
                    className={cn(
                      "rounded-2xl border-[2.5px] p-3.5 space-y-2.5 transition-all relative",
                      highlightedSkill?.includes("React") || highlightedSkill?.includes("Next.js")
                        ? "border-red-500 bg-red-50/70 shadow-[3px_3px_0px_#dc2626]"
                        : "border-slate-800 bg-white shadow-[2px_2px_0px_#0f172a]"
                    )}
                  >
                    {/* Bounding box tag */}
                    <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-wider border border-slate-900 shadow-2xs">
                      ⚡ AI DETECTED: 98% MATCH
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>TẬP ĐOÀN CÔNG NGHỆ FINTECH VN • TECH LEAD</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        2022 – Hiện tại
                      </span>
                    </div>

                    {/* Cartoon skeleton / stylized bullets */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />
                        <span className="text-[11px] font-medium leading-relaxed">
                          Kiến trúc và triển khai hệ thống lõi Next.js 15, React 19, TypeScript phục vụ
                          hơn 500,000 người dùng hàng ngày.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />
                        <span className="text-[11px] font-medium leading-relaxed">
                          Tối ưu hóa Core Web Vitals, giảm 45% thời gian tải trang và thiết lập CI/CD tự động.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="rounded-2xl border-[2px] border-slate-800 bg-slate-50 p-3 space-y-1.5 shadow-[2px_2px_0px_#0f172a]">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>GLOBAL SOFTWARE OUTSOURCING • SENIOR DEV</span>
                      <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        2020 – 2022
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      Phát triển hệ thống Dashboard tài chính, áp dụng Micro-frontend và Redux Toolkit.
                    </div>
                  </div>
                </div>

                {/* Section 3: KỸ NĂNG CỐT LÕI (CARTOON TAGS) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-red-600" />
                    <span>KỸ NĂNG & NĂNG LỰC TRÍCH XUẤT</span>
                    <span className="h-0.5 flex-1 bg-slate-200 rounded-full" />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: "React / Next.js", color: "bg-red-100 text-red-900 border-red-300" },
                      { name: "TypeScript", color: "bg-blue-100 text-blue-900 border-blue-300" },
                      { name: "Tailwind CSS", color: "bg-teal-100 text-teal-900 border-teal-300" },
                      { name: "Node.js / Express", color: "bg-emerald-100 text-emerald-900 border-emerald-300" },
                      { name: "Redux Toolkit", color: "bg-purple-100 text-purple-900 border-purple-300" },
                      { name: "Docker & CI/CD", color: "bg-amber-100 text-amber-900 border-amber-300" },
                    ].map((s) => (
                      <span
                        key={s.name}
                        onClick={() => setHighlightedSkill(s.name)}
                        className={cn(
                          "px-2.5 py-1 rounded-xl text-[11px] font-bold border-[2px] transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#0f172a]",
                          s.color,
                          highlightedSkill === s.name && "scale-105 ring-2 ring-slate-900"
                        )}
                      >
                        {s.name} ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              CỘT PHẢI (5 cols): BẢNG AI TRÍCH XUẤT & ĐIỂM SỐ HOẠT HÌNH
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500 border border-slate-900" />
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  2. Trích xuất Thực thể AI (AI Extraction)
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                ● 100% Parsed
              </span>
            </div>

            {/* BẢNG ĐIỀU KHIỂN AI HOẠT HÌNH */}
            <div className="bg-white rounded-3xl border-[3px] border-slate-900 p-5 sm:p-6 shadow-[6px_6px_0px_#0f172a] space-y-6">
              {/* AI Mascot & Score Gauge */}
              <div className="flex items-center gap-4 bg-red-50/70 border-[2.5px] border-slate-900 rounded-2xl p-4 shadow-[3px_3px_0px_#0f172a]">
                {/* Chunky Score Badge */}
                <div className="h-20 w-20 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] shrink-0">
                  <span className="font-black text-2xl leading-none">94%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider mt-1 text-red-100">
                    MATCH SCORE
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black text-slate-900 font-sans">
                      Khớp Lệnh Tuyển Dụng
                    </span>
                    <span className="text-xs">🤖</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-tight">
                    Hồ sơ thỏa mãn <strong>9/10 tiêu chí bắt buộc</strong> và <strong>4/4 điểm cộng</strong> của vị trí Senior Fullstack.
                  </p>
                </div>
              </div>

              {/* 3 Thanh Năng Lượng Phù Hợp (Energy Bars) */}
              <div className="space-y-3">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  TIÊU CHÍ ĐỐI CHIẾU AI (MATCH CRITERIA)
                </div>

                <div className="space-y-2.5">
                  {/* Metric 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>⚡ Kỹ năng chuyên môn (Tech Stack)</span>
                      <span className="text-red-600 font-black">96%</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 rounded-xl border-[2px] border-slate-900 overflow-hidden shadow-2xs">
                      <div className="h-full bg-red-500 rounded-lg w-[96%]" />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>⚡ Số năm kinh nghiệm (5+ Năm)</span>
                      <span className="text-emerald-600 font-black">92%</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 rounded-xl border-[2px] border-slate-900 overflow-hidden shadow-2xs">
                      <div className="h-full bg-emerald-500 rounded-lg w-[92%]" />
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>⚡ Học vấn & Bằng cấp liên quan</span>
                      <span className="text-amber-600 font-black">95%</span>
                    </div>
                    <div className="h-3.5 w-full bg-slate-100 rounded-xl border-[2px] border-slate-900 overflow-hidden shadow-2xs">
                      <div className="h-full bg-amber-400 rounded-lg w-[95%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thẻ Kỹ năng AI bóc tách (Bubbly pills) */}
              <div className="space-y-2.5">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  THỰC THỂ NĂNG LỰC ĐÃ TRÍCH XUẤT
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Next.js 15", status: "100%", match: true },
                    { label: "React 19", status: "100%", match: true },
                    { label: "TypeScript", status: "96%", match: true },
                    { label: "Tailwind v4", status: "98%", match: true },
                    { label: "Fintech Core", status: "90%", match: true },
                    { label: "Microservices", status: "88%", match: true },
                    { label: "GraphQL", status: "75%", match: false },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setHighlightedSkill(item.label)}
                      className={cn(
                        "px-2.5 py-1 rounded-xl text-xs font-bold border-[2px] border-slate-900 flex items-center gap-1 transition-all cursor-pointer shadow-[2px_2px_0px_#0f172a]",
                        item.match ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500",
                        highlightedSkill === item.label && "bg-red-500 text-white -translate-y-0.5"
                      )}
                    >
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "text-[10px] px-1 rounded",
                          item.match ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                        )}
                      >
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SỔ TAY GHI CHÚ RECRUITER (CARTOON YELLOW STICKY NOTE) */}
              <div className="relative bg-amber-100 border-[2.5px] border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_#0f172a] space-y-2.5">
                {/* Pin decor */}
                <div className="absolute -top-3 left-6 h-6 w-6 rounded-full bg-red-600 border-[2px] border-slate-900 shadow-2xs" />

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-black text-slate-900 uppercase">
                    📝 Ghi chú Đánh giá Recruiter
                  </div>

                  {/* 5 Cartoon Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserRating(s)}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            s <= userRating
                              ? "fill-amber-500 text-slate-900"
                              : "text-slate-400"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white/70 p-2.5 rounded-xl border border-amber-300">
                  &ldquo;Hồ sơ xuất sắc. Kỹ năng React/Next.js trùng khớp 100% với yêu cầu dự án CYCLOSA.
                  Đề xuất chuyển tiếp sang Vòng 1: Phỏng vấn Kỹ thuật với Giám đốc Công nghệ.&rdquo;
                </p>

                <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                  <span>Người đánh giá: Nguyễn Văn An (HR Lead)</span>
                  <span className="text-red-700">Độ ưu tiên: CAO ★★★</span>
                </div>
              </div>

              {/* Nút hành động nhanh */}
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-1 py-2.5 rounded-xl font-black text-xs bg-red-600 text-white border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>XÁC NHẬN DUYỆT ỨNG VIÊN</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
