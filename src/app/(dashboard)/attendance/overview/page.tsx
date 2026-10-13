"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Clock,
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface AttendanceRecordToday {
  id: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  shiftName: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "PRESENT" | "LATE" | "ABSENT" | "ON_LEAVE";
}

const INITIAL_ATTENDANCE_TODAY: AttendanceRecordToday[] = [
  { id: "att_1", employeeName: "Nguyễn Văn An", employeeCode: "EMP001", initials: "NA", avatarBg: "bg-red-500 text-white", departmentName: "Ban Giám Đốc", shiftName: "Ca Hành Chính (08:30 - 17:30)", checkInTime: "08:24", status: "PRESENT" },
  { id: "att_2", employeeName: "Trần Thị Mai", employeeCode: "EMP002", initials: "TM", avatarBg: "bg-blue-500 text-white", departmentName: "Khối Quản Trị Nhân Sự", shiftName: "Ca Hành Chính (08:30 - 17:30)", checkInTime: "08:15", status: "PRESENT" },
  { id: "att_3", employeeName: "Lê Hoàng Nam", employeeCode: "EMP003", initials: "HN", avatarBg: "bg-emerald-500 text-white", departmentName: "Khối Công Nghệ", shiftName: "Ca Hành Chính (08:30 - 17:30)", checkInTime: "08:55", status: "LATE" },
  { id: "att_4", employeeName: "Phạm Minh Tuấn", employeeCode: "EMP004", initials: "PT", avatarBg: "bg-purple-500 text-white", departmentName: "Phòng Phát Triển Frontend", shiftName: "Ca Hành Chính (08:30 - 17:30)", checkInTime: "08:28", status: "PRESENT" },
  { id: "att_5", employeeName: "Đỗ Thu Trang", employeeCode: "EMP045", initials: "TT", avatarBg: "bg-amber-500 text-white", departmentName: "Khối Kinh Doanh", shiftName: "Ca Hành Chính (08:30 - 17:30)", status: "ON_LEAVE" },
  { id: "att_6", employeeName: "Vũ Hải Đăng", employeeCode: "EMP095", initials: "HD", avatarBg: "bg-slate-500 text-white", departmentName: "Khối Công Nghệ", shiftName: "Ca Hành Chính (08:30 - 17:30)", status: "ABSENT" },
];

export default function AttendanceOverviewPage() {
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecordToday[]>(INITIAL_ATTENDANCE_TODAY);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  const filteredLogs = attendanceLogs.filter(
    (l) =>
      l.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      l.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      l.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tổng quan Chấm công Hôm nay
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
              Chấm công & Ca
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Bảng điểm danh hôm nay</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-outline"
            onClick={() => toast.info("Đang xuất báo cáo chấm công ngày...")}
          >
            <Download className="h-4 w-4" />
            <span>Xuất dữ liệu</span>
          </button>

          <Link href="/me/attendance/check-in" className="btn-primary">
            <MapPin className="h-4 w-4" />
            <span>Chấm công Face ID</span>
          </Link>

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
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đúng giờ (Present)</p>
                <h3 className="kpi-value">{attendanceLogs.filter((a) => a.status === "PRESENT").length}</h3>
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
              <div className="kpi-icon-wrapper bg-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đi muộn (Late)</p>
                <h3 className="kpi-value">{attendanceLogs.filter((a) => a.status === "LATE").length}</h3>
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
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Nghỉ phép (On Leave)</p>
                <h3 className="kpi-value">{attendanceLogs.filter((a) => a.status === "ON_LEAVE").length}</h3>
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
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Vắng mặt (Absent)</p>
                <h3 className="kpi-value">{attendanceLogs.filter((a) => a.status === "ABSENT").length}</h3>
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
              Nhật ký chấm công thời gian thực
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo nhân viên, mã, phòng ban..."
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
                <th>Ca làm việc</th>
                <th className="text-center">Giờ Check-in</th>
                <th className="text-center">Giờ Check-out</th>
                <th className="text-center">Trạng thái điểm danh</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${log.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {log.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {log.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    {log.departmentName}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {log.shiftName}
                  </td>
                  <td className="text-center font-mono text-xs font-semibold text-foreground">
                    {log.checkInTime || "—"}
                  </td>
                  <td className="text-center font-mono text-xs text-muted-foreground">
                    {log.checkOutTime || "—"}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      title="Giải trình chấm công"
                      onClick={() => toast.info(`Giải trình chấm công cho ${log.employeeName}`)}
                      className="btn-icon-sm hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredLogs.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{attendanceLogs.length}</span> lượt chấm công
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
