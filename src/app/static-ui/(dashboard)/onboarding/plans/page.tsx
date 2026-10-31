"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  UserCheck,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface OnboardingPlanItem {
  id: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  mentorName: string;
  startDate: string;
  probationEndDate: string;
  progressPercent: number;
  completedTasks: number;
  totalTasks: number;
  status: "ACTIVE" | "APPROVED" | "PENDING_APPROVAL";
}

const INITIAL_ONBOARDING_PLANS: OnboardingPlanItem[] = [
  {
    id: "onb_1",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    departmentName: "Phòng Phát Triển Backend",
    mentorName: "Trần Quốc Bảo (Tech Lead)",
    startDate: "01/09/2026",
    probationEndDate: "31/10/2026",
    progressPercent: 75,
    completedTasks: 9,
    totalTasks: 12,
    status: "ACTIVE",
  },
  {
    id: "onb_2",
    employeeName: "Ngô Quang Huy",
    employeeCode: "EMP092",
    initials: "QH",
    avatarBg: "bg-indigo-500 text-white",
    departmentName: "Phòng Kế Toán Doanh Nghiệp",
    mentorName: "Hoàng Thảo Linh (CFO)",
    startDate: "15/09/2026",
    probationEndDate: "15/11/2026",
    progressPercent: 40,
    completedTasks: 4,
    totalTasks: 10,
    status: "ACTIVE",
  },
  {
    id: "onb_3",
    employeeName: "Vũ Phương Linh",
    employeeCode: "EMP085",
    initials: "PL",
    avatarBg: "bg-pink-500 text-white",
    departmentName: "Phòng Tuyển Dụng",
    mentorName: "Trần Thị Mai (HRD)",
    startDate: "01/08/2026",
    probationEndDate: "30/09/2026",
    progressPercent: 100,
    completedTasks: 15,
    totalTasks: 15,
    status: "APPROVED",
  },
];

export default function OnboardingPlansPage() {
  const [plans] = useState<OnboardingPlanItem[]>(INITIAL_ONBOARDING_PLANS);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredPlans = plans.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Lộ trình Hội nhập & Đánh giá Thử việc
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
              Hội nhập & Đào tạo
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Kế hoạch Onboarding</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/me/onboarding" className="btn-outline">
            <Eye className="h-4 w-4" />
            <span>Cổng chào mừng nhân viên mới</span>
          </Link>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Gán lộ trình hội nhập mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Gán lộ trình mới</span>
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
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đang thử việc</p>
                <h3 className="kpi-value">{plans.filter((p) => p.status === "ACTIVE").length}</h3>
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
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đã đạt chuẩn chính thức</p>
                <h3 className="kpi-value">{plans.filter((p) => p.status === "APPROVED").length}</h3>
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
                <p className="kpi-title">Tiến độ hoàn thành TB</p>
                <h3 className="kpi-value">
                  {Math.round(plans.reduce((s, p) => s + p.progressPercent, 0) / plans.length)}%
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
                <p className="kpi-title">Đánh giá trong 15 ngày tới</p>
                <h3 className="kpi-value text-xl">1 nhân sự</h3>
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
              Danh sách nhân sự đang trong lộ trình Onboarding
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo nhân sự, mã, phòng ban..."
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
                <th>Nhân sự thử việc</th>
                <th>Phòng ban</th>
                <th>Người hướng dẫn (Mentor / Buddy)</th>
                <th>Ngày bắt đầu - Hạn thử việc</th>
                <th>Tiến độ nhiệm vụ</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPlans.map((p) => (
                <tr key={p.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${p.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {p.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {p.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {p.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    {p.departmentName}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {p.mentorName}
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {p.startDate} — {p.probationEndDate}
                  </td>
                  <td>
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{p.progressPercent}%</span>
                        <span className="text-muted-foreground font-normal">
                          {p.completedTasks}/{p.totalTasks}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        href="/me/onboarding"
                        title="Xem cổng chào đón"
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
            Hiển thị {filteredPlans.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{plans.length}</span> nhân sự
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
