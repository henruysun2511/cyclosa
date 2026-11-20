"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Lock,
  ArrowRight,
  Plus,
  Coins,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import { StatusBadge, SensitiveMask } from "@/components/shared";
import { toast } from "sonner";

interface PayrollPeriodItem {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  plannedPaymentDate: string;
  standardWorkDays: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  status: "OPEN" | "CALCULATED" | "PENDING_APPROVAL" | "APPROVED" | "PAYMENT_PROCESSING" | "LOCKED";
}

const INITIAL_PERIODS: PayrollPeriodItem[] = [
  {
    id: "per_2026_09",
    code: "PAY-2026-09",
    name: "Kỳ lương Tháng 09/2026",
    startDate: "01/09/2026",
    endDate: "30/09/2026",
    plannedPaymentDate: "05/10/2026",
    standardWorkDays: 22,
    totalGrossSalary: 8450000000,
    totalNetSalary: 7320000000,
    status: "CALCULATED",
  },
  {
    id: "per_2026_08",
    code: "PAY-2026-08",
    name: "Kỳ lương Tháng 08/2026",
    startDate: "01/08/2026",
    endDate: "31/08/2026",
    plannedPaymentDate: "05/09/2026",
    standardWorkDays: 22,
    totalGrossSalary: 8390000000,
    totalNetSalary: 7280000000,
    status: "LOCKED",
  },
  {
    id: "per_2026_07",
    code: "PAY-2026-07",
    name: "Kỳ lương Tháng 07/2026",
    startDate: "01/07/2026",
    endDate: "31/07/2026",
    plannedPaymentDate: "05/08/2026",
    standardWorkDays: 23,
    totalGrossSalary: 8310000000,
    totalNetSalary: 7210000000,
    status: "LOCKED",
  },
];

export default function PayrollDashboardPage() {
  const [periods] = useState<PayrollPeriodItem[]>(INITIAL_PERIODS);
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Trung tâm Quản trị Bảng Lương & Chi trả
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
              Tiền lương & Đãi ngộ
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Bảng lương (Payroll)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Khởi tạo chu kỳ tính lương mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Mở kỳ lương mới</span>
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

      {/* ── 4 KPI Cards with SVG Sparkline ───────────────────────────── */}
      {!kpiCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
          <div className="kpi-card">
            <div className="flex items-center gap-3.5">
              <div className="kpi-icon-wrapper bg-primary">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Quỹ lương Gross tháng 09</p>
                <h3 className="kpi-value">
                  <SensitiveMask value="8.45 tỷ ₫" />
                </h3>
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
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Thực lĩnh chuyển khoản Net</p>
                <h3 className="kpi-value">
                  <SensitiveMask value="7.32 tỷ ₫" />
                </h3>
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
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Thuế TNCN & Trích BHXH</p>
                <h3 className="kpi-value">
                  <SensitiveMask value="1.13 tỷ ₫" />
                </h3>
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
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Ngày chi trả dự kiến</p>
                <h3 className="kpi-value text-xl">05/10/2026</h3>
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
              Danh sách các kỳ tính lương
            </h2>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã kỳ lương</th>
                <th>Tên kỳ tính lương</th>
                <th>Thời gian chu kỳ</th>
                <th className="text-center">Ngày công chuẩn</th>
                <th>Tổng quỹ lương Gross</th>
                <th>Tổng thực lĩnh Net</th>
                <th className="text-center">Trạng thái kỳ</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {periods.map((p) => (
                <tr key={p.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {p.code}
                  </td>
                  <td>
                    <Link
                      href={`/payroll/sheets/${p.id}`}
                      className="font-semibold text-foreground text-sm hover:text-primary transition-colors block"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {p.startDate} — {p.endDate}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {p.standardWorkDays} ngày
                  </td>
                  <td className="text-xs">
                    <SensitiveMask value={`${p.totalGrossSalary.toLocaleString("vi-VN")} ₫`} />
                  </td>
                  <td className="text-xs font-bold text-foreground">
                    <SensitiveMask value={`${p.totalNetSalary.toLocaleString("vi-VN")} ₫`} />
                  </td>
                  <td className="text-center">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        href={`/payroll/sheets/${p.id}`}
                        title="Xem chi tiết bảng lương"
                        className="btn-icon-sm"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {periods.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{periods.length}</span> kỳ lương
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
