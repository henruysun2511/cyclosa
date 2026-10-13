"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  UserMinus,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Laptop,
  Coins,
  FileText,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface OffboardingItem {
  id: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  jobTitle: string;
  submittedDate: string;
  lastWorkingDate: string;
  reason: string;
  itHandoverCompleted: boolean;
  financeSettled: boolean;
  hrHandoverCompleted: boolean;
  status: "PENDING_APPROVAL" | "HANDOVER_IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

const INITIAL_OFFBOARDINGS: OffboardingItem[] = [
  {
    id: "off_01",
    employeeName: "Vũ Hải Đăng",
    employeeCode: "EMP095",
    initials: "HD",
    avatarBg: "bg-slate-600 text-white",
    departmentName: "Khối Công Nghệ",
    jobTitle: "Mid Backend Engineer",
    submittedDate: "15/09/2026",
    lastWorkingDate: "15/10/2026",
    reason: "Đi du học thạc sĩ tại Singapore",
    itHandoverCompleted: true,
    financeSettled: false,
    hrHandoverCompleted: false,
    status: "HANDOVER_IN_PROGRESS",
  },
  {
    id: "off_02",
    employeeName: "Trần Bảo Ngọc",
    employeeCode: "EMP074",
    initials: "BN",
    avatarBg: "bg-pink-600 text-white",
    departmentName: "Khối Kinh Doanh",
    jobTitle: "Chuyên Viên Marketing",
    submittedDate: "01/09/2026",
    lastWorkingDate: "30/09/2026",
    reason: "Chuyển nơi cư trú vào TP. HCM",
    itHandoverCompleted: true,
    financeSettled: true,
    hrHandoverCompleted: true,
    status: "COMPLETED",
  },
];

export default function OffboardingManagementPage() {
  const [offboardings] = useState<OffboardingItem[]>(INITIAL_OFFBOARDINGS);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredItems = offboardings.filter(
    (o) =>
      o.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      o.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      o.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Thôi việc & Bàn giao Tài sản
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
              Nhân sự & Hồ sơ
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Quy trình thôi việc (OFF-01)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tiếp nhận đơn xin nghỉ việc mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo hồ sơ thôi việc</span>
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
              <div className="kpi-icon-wrapper bg-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đang bàn giao công việc</p>
                <h3 className="kpi-value">{offboardings.filter((o) => o.status === "HANDOVER_IN_PROGRESS").length}</h3>
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
              <div className="kpi-icon-wrapper bg-accent">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đã hoàn tất thủ tục</p>
                <h3 className="kpi-value">{offboardings.filter((o) => o.status === "COMPLETED").length}</h3>
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
                <Laptop className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tài sản IT đã thu hồi</p>
                <h3 className="kpi-value">100%</h3>
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
              <div className="kpi-icon-wrapper bg-destructive">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tranh chấp / Nợ tạm ứng</p>
                <h3 className="kpi-value">0 vụ</h3>
              </div>
            </div>
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path d="M0,15 L25,32 L55,20 L75,38 L100,28" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
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
              Danh sách nhân sự đang thực hiện thôi việc
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo nhân sự, phòng ban..."
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
                <th>Nhân sự</th>
                <th>Phòng ban</th>
                <th>Lý do thôi việc</th>
                <th>Ngày làm việc cuối</th>
                <th className="text-center">Bàn giao thiết bị IT</th>
                <th className="text-center">Quyết toán tài chính</th>
                <th className="text-center">Thu hồi thẻ / BHXH</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
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
                  <td className="text-xs font-medium text-foreground">
                    {item.departmentName}
                  </td>
                  <td className="text-xs text-[#4B5563] max-w-xs truncate">
                    {item.reason}
                  </td>
                  <td className="text-xs font-mono font-bold text-destructive">
                    {item.lastWorkingDate}
                  </td>
                  <td className="text-center">
                    {item.itHandoverCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đã xong
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        Chờ trả máy
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {item.financeSettled ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đã quyết toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        Chưa tất toán
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    {item.hrHandoverCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đã chốt sổ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        Chờ trả thẻ
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredItems.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{offboardings.length}</span> hồ sơ
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
