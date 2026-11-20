"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Target,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface PerfCycleItem {
  id: string;
  name: string;
  code: string;
  type: "KPI_ANNUAL" | "OKR_QUARTERLY" | "REVIEW_360";
  periodName: string;
  startDate: string;
  endDate: string;
  employeeCount: number;
  completionRate: number;
  status: "OPEN" | "CALIBRATION" | "LOCKED" | "COMPLETED";
}

const INITIAL_CYCLES: PerfCycleItem[] = [
  {
    id: "cyc_2026_q3",
    name: "Đánh giá Hiệu suất & OKR Quý 3/2026",
    code: "PERF-2026-Q3",
    type: "OKR_QUARTERLY",
    periodName: "01/07/2026 — 30/09/2026",
    startDate: "25/09/2026",
    endDate: "15/10/2026",
    employeeCount: 450,
    completionRate: 86,
    status: "CALIBRATION",
  },
  {
    id: "cyc_2026_mid",
    name: "Đánh giá Năng lực Giữa năm & 360 Độ",
    code: "PERF-2026-MID",
    type: "REVIEW_360",
    periodName: "01/01/2026 — 30/06/2026",
    startDate: "15/06/2026",
    endDate: "15/07/2026",
    employeeCount: 440,
    completionRate: 100,
    status: "COMPLETED",
  },
  {
    id: "cyc_2025_year",
    name: "Đánh giá Xếp hạng KPI Tổng kết Năm 2025",
    code: "PERF-2025-YEAR",
    type: "KPI_ANNUAL",
    periodName: "01/01/2025 — 31/12/2025",
    startDate: "01/12/2025",
    endDate: "15/01/2026",
    employeeCount: 410,
    completionRate: 100,
    status: "LOCKED",
  },
];

export default function PerformanceCyclesPage() {
  const [cycles] = useState<PerfCycleItem[]>(INITIAL_CYCLES);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredCycles = cycles.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Kỳ Đánh giá Hiệu suất
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
              Hiệu suất & Mục tiêu
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Kỳ đánh giá (PERF-01)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/performance/calibration" className="btn-outline">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Phân phối chuẩn (Bell Curve)</span>
          </Link>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Khởi tạo đợt đánh giá hiệu suất mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Khởi tạo kỳ mới</span>
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
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Kỳ đánh giá đang chạy</p>
                <h3 className="kpi-value text-xl">Quý 3/2026</h3>
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
                <p className="kpi-title">Tiến độ nộp tự đánh giá</p>
                <h3 className="kpi-value">94.8%</h3>
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
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Quản lý hoàn thành chấm</p>
                <h3 className="kpi-value">86.2%</h3>
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
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Giai đoạn hiện tại</p>
                <h3 className="kpi-value text-xl">Hiệu chuẩn</h3>
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
              Các chu kỳ đánh giá hiệu suất
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã kỳ đánh giá..."
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
                <th>Mã kỳ</th>
                <th>Tên kỳ đánh giá hiệu suất</th>
                <th>Mô hình áp dụng</th>
                <th>Thời gian chu kỳ</th>
                <th className="text-center">Quy mô nhân sự</th>
                <th>Tiến độ hoàn thành</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hiệu chuẩn điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCycles.map((c) => (
                <tr key={c.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {c.code}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {c.name}
                  </td>
                  <td className="text-xs text-foreground">
                    {c.type === "OKR_QUARTERLY"
                      ? "OKR Quý"
                      : c.type === "REVIEW_360"
                      ? "Đánh giá 360 độ"
                      : "KPI Năm"}
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {c.periodName}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {c.employeeCount} nhân sự
                  </td>
                  <td>
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{c.completionRate}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${c.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="text-right">
                    <Link
                      href="/performance/calibration"
                      className="btn-outline h-7 text-xs inline-flex items-center gap-1.5"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                      <span>Calibration</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredCycles.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{cycles.length}</span> chu kỳ
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
