"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Plus,
  Search,
  Kanban,
  Users,
  Eye,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Pencil,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface JobOpeningItem {
  id: string;
  title: string;
  code: string;
  departmentName: string;
  totalNeeded: number;
  hiredCount: number;
  applicantCount: number;
  deadline: string;
  status: "OPEN" | "ON_HOLD" | "CLOSED";
}

const INITIAL_OPENINGS: JobOpeningItem[] = [
  {
    id: "op_01",
    title: "Senior Frontend Engineer (React 19 / Next.js)",
    code: "REQ-2026-089",
    departmentName: "Phòng Phát Triển Frontend",
    totalNeeded: 3,
    hiredCount: 1,
    applicantCount: 24,
    deadline: "31/10/2026",
    status: "OPEN",
  },
  {
    id: "op_02",
    title: "AI Engineer (LLM & RAG Agent Systems)",
    code: "REQ-2026-092",
    departmentName: "Trung Tâm Nghiên Cứu AI",
    totalNeeded: 2,
    hiredCount: 0,
    applicantCount: 18,
    deadline: "15/11/2026",
    status: "OPEN",
  },
  {
    id: "op_03",
    title: "Senior Backend Engineer (Java / Spring Boot)",
    code: "REQ-2026-075",
    departmentName: "Phòng Phát Triển Backend",
    totalNeeded: 4,
    hiredCount: 3,
    applicantCount: 42,
    deadline: "15/10/2026",
    status: "OPEN",
  },
  {
    id: "op_04",
    title: "Chuyên Viên Quan Hệ Khách Hàng Doanh Nghiệp",
    code: "REQ-2026-060",
    departmentName: "Khối Kinh Doanh",
    totalNeeded: 5,
    hiredCount: 5,
    applicantCount: 35,
    deadline: "30/09/2026",
    status: "CLOSED",
  },
];

export default function RecruitmentOpeningsPage() {
  const [openings] = useState<JobOpeningItem[]>(INITIAL_OPENINGS);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredOpenings = openings.filter(
    (op) =>
      op.title.toLowerCase().includes(search.toLowerCase()) ||
      op.code.toLowerCase().includes(search.toLowerCase()) ||
      op.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Đợt tuyển dụng & Yêu cầu tuyển dụng
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
              Tuyển dụng & Thu hút
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Yêu cầu tuyển dụng (Openings)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/recruitment/pipeline" className="btn-outline">
            <Kanban className="h-4 w-4 text-primary" />
            <span>ATS Pipeline</span>
          </Link>

          <Link href="/careers" target="_blank" className="btn-outline">
            <Eye className="h-4 w-4" />
            <span>Trang Career công khai</span>
          </Link>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tạo đợt tuyển dụng mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo tin tuyển dụng</span>
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
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đang mở tuyển (Open)</p>
                <h3 className="kpi-value">{openings.filter((o) => o.status === "OPEN").length}</h3>
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
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng ứng viên tiếp nhận</p>
                <h3 className="kpi-value">
                  {openings.reduce((sum, o) => sum + o.applicantCount, 0)}
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
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đã tiếp nhận (Hired)</p>
                <h3 className="kpi-value">
                  {openings.reduce((sum, o) => sum + o.hiredCount, 0)} / {openings.reduce((sum, o) => sum + o.totalNeeded, 0)}
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
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đã hoàn thành đợt</p>
                <h3 className="kpi-value">{openings.filter((o) => o.status === "CLOSED").length}</h3>
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
              Danh sách vị trí tuyển dụng
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, mã vị trí, phòng ban..."
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
                <th>Mã đợt</th>
                <th>Vị trí tuyển dụng</th>
                <th>Phòng ban phụ trách</th>
                <th className="text-center">Chỉ tiêu / Đã tuyển</th>
                <th className="text-center">Số lượng ứng viên</th>
                <th>Hạn nộp hồ sơ</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOpenings.map((op) => (
                <tr key={op.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {op.code}
                  </td>
                  <td>
                    <Link
                      href={`/recruitment/openings/${op.id}/pipeline`}
                      className="font-semibold text-foreground text-sm hover:text-primary transition-colors block"
                    >
                      {op.title}
                    </Link>
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {op.departmentName}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    <span className="text-accent">{op.hiredCount}</span> / {op.totalNeeded}
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {op.applicantCount} hồ sơ
                    </span>
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {op.deadline}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={op.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        href={`/recruitment/openings/${op.id}/pipeline`}
                        title="Mở Kanban Pipeline ATS"
                        className="btn-icon-sm"
                      >
                        <Kanban className="h-3.5 w-3.5 text-primary" />
                      </Link>
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => toast.info(`Chỉnh sửa vị trí: ${op.title}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
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
            Hiển thị {filteredOpenings.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{openings.length}</span> vị trí
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
