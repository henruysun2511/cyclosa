"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  Lock,
  Unlock,
  Download,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";
import { toast } from "sonner";

interface TimesheetRow {
  id: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  standardDays: number;
  actualWorkDays: number;
  otHoursWeekday: number;
  otHoursWeekend: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  lateTimes: number;
  status: "OPEN" | "LOCKED";
}

const INITIAL_TIMESHEETS: TimesheetRow[] = [
  {
    id: "ts_01",
    employeeName: "Nguyễn Văn An",
    employeeCode: "EMP001",
    initials: "NA",
    avatarBg: "bg-primary text-white",
    departmentName: "Ban Giám Đốc",
    standardDays: 22,
    actualWorkDays: 22,
    otHoursWeekday: 0,
    otHoursWeekend: 0,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lateTimes: 0,
    status: "OPEN",
  },
  {
    id: "ts_02",
    employeeName: "Trần Thị Mai",
    employeeCode: "EMP002",
    initials: "TM",
    avatarBg: "bg-slate-900 text-white",
    departmentName: "Khối Quản Trị Nhân Sự",
    standardDays: 22,
    actualWorkDays: 20,
    otHoursWeekday: 4,
    otHoursWeekend: 0,
    paidLeaveDays: 2,
    unpaidLeaveDays: 0,
    lateTimes: 0,
    status: "OPEN",
  },
  {
    id: "ts_03",
    employeeName: "Phạm Minh Tuấn",
    employeeCode: "EMP004",
    initials: "PT",
    avatarBg: "bg-slate-800 text-white",
    departmentName: "Phòng Phát Triển Frontend",
    standardDays: 22,
    actualWorkDays: 21,
    otHoursWeekday: 12,
    otHoursWeekend: 4,
    paidLeaveDays: 1,
    unpaidLeaveDays: 0,
    lateTimes: 1,
    status: "OPEN",
  },
  {
    id: "ts_04",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-slate-700 text-white",
    departmentName: "Phòng Phát Triển Backend",
    standardDays: 22,
    actualWorkDays: 22,
    otHoursWeekday: 8,
    otHoursWeekend: 0,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    lateTimes: 2,
    status: "OPEN",
  },
];

export default function TimesheetsGridPage() {
  const [timesheets, setTimesheets] = useState<TimesheetRow[]>(INITIAL_TIMESHEETS);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [periodLocked, setPeriodLocked] = useState(false);

  const filteredTimesheets = timesheets.filter(
    (t) =>
      t.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      t.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      t.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleLockPeriodConfirm = (reason: string) => {
    setPeriodLocked(true);
    setTimesheets((prev) => prev.map((t) => ({ ...t, status: "LOCKED" as const })));
    toast.success(`Đã chốt và khóa bảng công Tháng ${selectedMonth}. Lý do: ${reason}`, {
      description: "Dữ liệu công đã được chuyển tự động sang Module Tính Lương (PAY-04).",
    });
    setLockModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Bảng Tổng hợp Công Tháng
            </h1>
            <span
              className={`badge ${
                periodLocked ? "badge-inactive" : "badge-active"
              }`}
            >
              {periodLocked ? "Đã khóa kỳ công" : "Kỳ công đang mở"}
            </span>
          </div>
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
              href="/attendance/overview"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Chấm công
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Bảng công tháng (ATT-11)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-outline"
            onClick={() => toast.info("Đang kết xuất bảng công định dạng Excel...")}
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>

          {!periodLocked ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setLockModalOpen(true)}
            >
              <Lock className="h-4 w-4" />
              <span>Khóa bảng công tháng</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-outline text-slate-800"
              onClick={() => {
                setPeriodLocked(false);
                setTimesheets((prev) => prev.map((t) => ({ ...t, status: "OPEN" as const })));
                toast.info("Đã mở khóa kỳ công để hiệu chỉnh");
              }}
            >
              <Unlock className="h-4 w-4" />
              <span>Mở khóa kỳ công</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">
              Dữ liệu công tháng {selectedMonth}
            </h2>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-8 rounded-md border border-border bg-white px-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            />
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
                <th>Nhân sự</th>
                <th>Phòng ban</th>
                <th className="text-center">Công chuẩn</th>
                <th className="text-center">Công thực tế</th>
                <th className="text-center">OT Ngày thường</th>
                <th className="text-center">OT Cuối tuần</th>
                <th className="text-center">Nghỉ phép</th>
                <th className="text-center">Đi muộn (lần)</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTimesheets.map((t) => (
                <tr key={t.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {t.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {t.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    {t.departmentName}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {t.standardDays}
                  </td>
                  <td className="text-center font-bold text-xs text-slate-900">
                    {t.actualWorkDays}
                  </td>
                  <td className="text-center text-xs font-mono">
                    {t.otHoursWeekday}h
                  </td>
                  <td className="text-center text-xs font-mono">
                    {t.otHoursWeekend}h
                  </td>
                  <td className="text-center text-xs font-semibold text-foreground">
                    {t.paidLeaveDays} ngày
                  </td>
                  <td className={`text-center text-xs font-mono ${t.lateTimes > 0 ? "text-primary font-bold" : "text-muted-foreground"}`}>
                    {t.lateTimes}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredTimesheets.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{timesheets.length}</span> nhân sự
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

      {/* ── Dialog Lock Period Reason ─────────────────────────────────── */}
      <ConfirmReasonDialog
        open={lockModalOpen}
        onOpenChange={setLockModalOpen}
        title={`Chốt & Khóa bảng công Tháng ${selectedMonth}`}
        description="Khi đã khóa bảng công, nhân viên và quản lý không thể chỉnh sửa hay gửi đơn giải trình công bổ sung. Bảng dữ liệu sẽ chốt cố định để phục vụ tính lương."
        reasonLabel="Biên bản chốt công / Ghi chú phê duyệt"
        requiredReason={true}
        confirmText="Xác nhận khóa bảng công"
        onConfirm={handleLockPeriodConfirm}
      />
    </div>
  );
}
