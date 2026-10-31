"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ShieldAlert,
  AlertTriangle,
  Scale,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface ComplianceAlert {
  id: string;
  category: "OVERTIME_LIMIT" | "CONTRACT_LIMIT" | "PROBATION_EXCEEDED" | "INSURANCE_ARREARS";
  title: string;
  department: string;
  affectedCount: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  legalCitation: string;
}

const INITIAL_ALERTS: ComplianceAlert[] = [
  {
    id: "leg_01",
    category: "OVERTIME_LIMIT",
    title: "Cảnh báo vượt ngưỡng làm thêm 40 giờ/tháng (Tháng 09)",
    department: "Khối Công Nghệ (Backend Team)",
    affectedCount: 3,
    severity: "HIGH",
    legalCitation: "Khoản 2 Điều 107 BLLĐ 2019",
  },
  {
    id: "leg_02",
    category: "CONTRACT_LIMIT",
    title: "Hợp đồng xác định thời hạn lần 2 sắp hết hạn cần chuyển sang vô thời hạn",
    department: "Khối Kinh Doanh",
    affectedCount: 2,
    severity: "CRITICAL",
    legalCitation: "Khoản 2 Điều 20 BLLĐ 2019",
  },
  {
    id: "leg_03",
    category: "PROBATION_EXCEEDED",
    title: "Thời gian thử việc sắp chạm giới hạn 60 ngày",
    department: "Phòng Phát Triển Backend",
    affectedCount: 1,
    severity: "MEDIUM",
    legalCitation: "Điều 25 BLLĐ 2019",
  },
];

export default function ComplianceDashboardPage() {
  const [alerts] = useState<ComplianceAlert[]>(INITIAL_ALERTS);
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bảng Chỉ huy Tuân thủ Luật Lao động & Pháp lý FSI
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
              Pháp chế & Rủi ro
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Bảng tuân thủ (Compliance)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-outline"
            onClick={() => toast.info("Đang kiểm tra rà soát các hợp đồng theo Bộ luật Lao động 2019...")}
          >
            <Scale className="h-4 w-4" />
            <span>Quét tuân thủ tự động</span>
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
              <div className="kpi-icon-wrapper bg-accent">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Chỉ số Tuân thủ FSI</p>
                <h3 className="kpi-value">98.2%</h3>
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
              <div className="kpi-icon-wrapper bg-destructive">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Cảnh báo nghiêm trọng</p>
                <h3 className="kpi-value">{alerts.filter((a) => a.severity === "CRITICAL").length} vụ</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,15 L25,32 L55,20 L75,38 L100,28" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Vượt ngưỡng OT &gt;40h</p>
                <h3 className="kpi-value">3 nhân sự</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,35 Q25,38 50,22 T100,8" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-[#38BDF8]">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Bộ luật Lao động</p>
                <h3 className="kpi-value text-xl">BLLĐ 2019</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,30 Q35,12 70,25 T100,10" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
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
              Các rủi ro & cảnh báo pháp lý đang kích hoạt ({alerts.length})
            </h2>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mức độ nghiêm trọng</th>
                <th>Nội dung cảnh báo vi phạm</th>
                <th>Đơn vị phòng ban</th>
                <th className="text-center">Số nhân sự ảnh hưởng</th>
                <th>Căn cứ quy định pháp luật</th>
                <th className="text-right">Hành động khắc phục</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alerts.map((al) => (
                <tr key={al.id} className="table-row">
                  <td>
                    {al.severity === "CRITICAL" ? (
                      <span className="badge badge-inactive">
                        Nghiêm trọng
                      </span>
                    ) : al.severity === "HIGH" ? (
                      <span className="inline-flex items-center rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Cao
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Trung bình
                      </span>
                    )}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {al.title}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {al.department}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {al.affectedCount} người
                  </td>
                  <td className="text-xs font-mono font-medium text-primary">
                    {al.legalCitation}
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn-outline h-7 text-xs"
                      onClick={() => toast.info(`Xử lý biện pháp khắc phục cho cảnh báo: ${al.title}`)}
                    >
                      Khắc phục ngay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {alerts.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{alerts.length}</span> cảnh báo
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
