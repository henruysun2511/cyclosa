"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  FileCheck2,
  Plus,
  Search,
  Download,
  Mail,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge, SensitiveMask } from "@/components/shared";
import { toast } from "sonner";

interface OfferLetterItem {
  id: string;
  candidateName: string;
  candidateEmail: string;
  initials: string;
  avatarBg: string;
  jobTitle: string;
  departmentName: string;
  grossSalary: number;
  startDate: string;
  sentDate: string;
  expiryDate: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "SENT" | "ACCEPTED" | "DECLINED";
}

const INITIAL_OFFERS: OfferLetterItem[] = [
  {
    id: "off_01",
    candidateName: "Lê Minh Tuấn",
    candidateEmail: "tuan.leminh@gmail.com",
    initials: "MT",
    avatarBg: "bg-blue-500 text-white",
    jobTitle: "Senior Frontend Engineer",
    departmentName: "Phòng Phát Triển Frontend",
    grossSalary: 38000000,
    startDate: "01/11/2026",
    sentDate: "03/10/2026",
    expiryDate: "08/10/2026",
    status: "SENT",
  },
  {
    id: "off_02",
    candidateName: "Hoàng Văn Thái",
    candidateEmail: "thai.hoang@gmail.com",
    initials: "VT",
    avatarBg: "bg-emerald-500 text-white",
    jobTitle: "AI Research Scientist",
    departmentName: "Trung Tâm Nghiên Cứu AI",
    grossSalary: 55000000,
    startDate: "15/11/2026",
    sentDate: "02/10/2026",
    expiryDate: "07/10/2026",
    status: "ACCEPTED",
  },
  {
    id: "off_03",
    candidateName: "Nguyễn Thị Phương",
    candidateEmail: "phuong.nguyen@gmail.com",
    initials: "TP",
    avatarBg: "bg-purple-500 text-white",
    jobTitle: "Chuyên Viên Quan Hệ Khách Hàng",
    departmentName: "Khối Kinh Doanh",
    grossSalary: 18000000,
    startDate: "15/10/2026",
    sentDate: "01/10/2026",
    expiryDate: "06/10/2026",
    status: "PENDING_APPROVAL",
  },
];

export default function RecruitmentOffersPage() {
  const [offers] = useState<OfferLetterItem[]>(INITIAL_OFFERS);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredOffers = offers.filter(
    (o) =>
      o.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      o.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản trị Thư Mời Nhận Việc
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
            <Link
              href="/recruitment/openings"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Tuyển dụng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Thư mời nhận việc (REC-26)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Soạn thư mời nhận việc mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo Offer mới</span>
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
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng thư mời phát hành</p>
                <h3 className="kpi-value">{offers.length}</h3>
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
                <p className="kpi-title">Đã chấp thuận (Accepted)</p>
                <h3 className="kpi-value">{offers.filter((o) => o.status === "ACCEPTED").length}</h3>
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
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đang chờ phản hồi</p>
                <h3 className="kpi-value">{offers.filter((o) => o.status === "SENT").length}</h3>
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
                <Send className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tỷ lệ chấp thuận</p>
                <h3 className="kpi-value">100%</h3>
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
              Danh sách Offer đã phát hành
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo ứng viên, vị trí..."
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
                <th>Ứng viên</th>
                <th>Vị trí đề xuất</th>
                <th>Phòng ban</th>
                <th>Mức lương Gross</th>
                <th>Ngày dự kiến Onboard</th>
                <th>Hạn chót phản hồi</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOffers.map((o) => (
                <tr key={o.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${o.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {o.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {o.candidateName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {o.candidateEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-semibold text-foreground">
                    {o.jobTitle}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {o.departmentName}
                  </td>
                  <td className="text-xs">
                    <SensitiveMask value={`${o.grossSalary.toLocaleString("vi-VN")} ₫`} />
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {o.startDate}
                  </td>
                  <td className="text-xs font-mono text-destructive font-semibold">
                    {o.expiryDate}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Gửi lại email Offer"
                        onClick={() => toast.success(`Đã gửi lại email thư mời tới: ${o.candidateEmail}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredOffers.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{offers.length}</span> thư mời
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
