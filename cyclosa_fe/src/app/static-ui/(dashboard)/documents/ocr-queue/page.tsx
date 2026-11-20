"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  FileSearch,
  UploadCloud,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface OcrQueueItem {
  id: string;
  documentType: "CCCD" | "BANG_DAI_HOC" | "SYLL" | "GIAY_KHAM_SK";
  typeLabel: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  fileName: string;
  uploadedAt: string;
  confidenceScore: number;
  status: "PENDING_VERIFY" | "VERIFIED" | "REJECTED";
}

const INITIAL_QUEUE: OcrQueueItem[] = [
  {
    id: "ocr_01",
    documentType: "CCCD",
    typeLabel: "Căn cước công dân gắn chip",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    fileName: "CCCD_DangMinhTan_MatTruoc_MatSau.pdf",
    uploadedAt: "Hôm nay 08:45",
    confidenceScore: 98,
    status: "PENDING_VERIFY",
  },
  {
    id: "ocr_02",
    documentType: "BANG_DAI_HOC",
    typeLabel: "Bằng Tốt Nghiệp Đại Học",
    employeeName: "Ngô Quang Huy",
    employeeCode: "EMP092",
    initials: "QH",
    avatarBg: "bg-indigo-500 text-white",
    fileName: "BangTotNghiep_KinhTeQuocDan.jpg",
    uploadedAt: "Hôm qua 16:20",
    confidenceScore: 89,
    status: "PENDING_VERIFY",
  },
  {
    id: "ocr_03",
    documentType: "GIAY_KHAM_SK",
    typeLabel: "Giấy Khám Sức Khỏe Thông Tư 32",
    employeeName: "Vũ Phương Linh",
    employeeCode: "EMP085",
    initials: "PL",
    avatarBg: "bg-pink-500 text-white",
    fileName: "GiayKhamSK_BV_BachMai.pdf",
    uploadedAt: "01/10/2026",
    confidenceScore: 96,
    status: "VERIFIED",
  },
];

export default function DocumentOcrQueuePage() {
  const [queue] = useState<OcrQueueItem[]>(INITIAL_QUEUE);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredQueue = queue.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      item.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      item.typeLabel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hàng đợi Nhận diện Hồ sơ & OCR
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Hồ sơ & Văn bản
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Hàng đợi OCR (DOC-06)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tải lên tài liệu mới cần bóc tách OCR")}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Tải hồ sơ lên</span>
          </button>

          <button
            type="button"
            onClick={() => setKpiCollapsed(!kpiCollapsed)}
            title={kpiCollapsed ? "Mở rộng thống kê" : "Thu gọn thống kê"}
            className="btn-icon"
          >
            {kpiCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────── */}
      {!kpiCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-primary">
                <FileSearch className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Hồ sơ chờ đối soát</p>
                <h3 className="kpi-value">{queue.filter((q) => q.status === "PENDING_VERIFY").length}</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,35 Q25,38 50,22 T100,8" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-accent">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đã đối soát hợp lệ</p>
                <h3 className="kpi-value">{queue.filter((q) => q.status === "VERIFIED").length}</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,38 Q30,42 60,18 T100,5" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-[#38BDF8]">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Độ tin cậy AI trung bình</p>
                <h3 className="kpi-value">94.3%</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,30 Q35,12 70,25 T100,10" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Thời gian OCR trung bình</p>
                <h3 className="kpi-value text-xl">1.8 giây/trang</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,25 L35,18 L65,30 L100,12" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Hồ sơ trong hàng đợi OCR
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo nhân sự, mã, loại hồ sơ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nhân sự sở hữu</th>
                <th>Loại hồ sơ pháp lý</th>
                <th>Tên tệp đính kèm</th>
                <th>Thời điểm quét</th>
                <th className="text-center">Độ tin cậy OCR</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Đối soát thông tin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {item.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {item.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-semibold text-foreground">
                    {item.typeLabel}
                  </td>
                  <td className="text-xs text-[#4B5563] font-mono">
                    {item.fileName}
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {item.uploadedAt}
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-accent">
                      <Sparkles className="h-3 w-3" />
                      {item.confidenceScore}%
                    </span>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="text-right">
                    <Link
                      href={`/documents/ocr-verify/${item.id}`}
                      className="btn-outline h-7 text-xs inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>Xem & Xác minh (Split)</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredQueue.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{queue.length}</span> hồ sơ
          </div>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="pagination-nav-btn">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </button>
            <button type="button" className="pagination-btn active">
              1
            </button>
            <button type="button" disabled className="pagination-nav-btn">
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
