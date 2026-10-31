"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  CalendarDays,
  Plus,
  Search,
  Check,
  X,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";
import { toast } from "sonner";

interface LeaveRequestItem {
  id: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "CANCELLED";
}

const INITIAL_LEAVE_REQUESTS: LeaveRequestItem[] = [
  {
    id: "lr_1",
    employeeName: "Trần Thị Mai",
    employeeCode: "EMP002",
    initials: "TM",
    avatarBg: "bg-blue-500 text-white",
    departmentName: "Khối Quản Trị Nhân Sự",
    leaveType: "Nghỉ phép năm",
    startDate: "06/10/2026",
    endDate: "07/10/2026",
    daysCount: 2,
    reason: "Việc gia đình đột xuất",
    status: "PENDING_APPROVAL",
  },
  {
    id: "lr_2",
    employeeName: "Lê Hoàng Nam",
    employeeCode: "EMP003",
    initials: "HN",
    avatarBg: "bg-emerald-500 text-white",
    departmentName: "Khối Công Nghệ",
    leaveType: "Nghỉ phép năm",
    startDate: "10/10/2026",
    endDate: "10/10/2026",
    daysCount: 1,
    reason: "Khám sức khỏe định kỳ",
    status: "APPROVED",
  },
  {
    id: "lr_3",
    employeeName: "Phạm Minh Tuấn",
    employeeCode: "EMP004",
    initials: "PT",
    avatarBg: "bg-purple-500 text-white",
    departmentName: "Phòng Phát Triển Frontend",
    leaveType: "Nghỉ ốm (BHXH)",
    startDate: "01/10/2026",
    endDate: "02/10/2026",
    daysCount: 2,
    reason: "Sốt xuất huyết theo chỉ định bác sĩ",
    status: "APPROVED",
  },
  {
    id: "lr_4",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    departmentName: "Phòng Phát Triển Backend",
    leaveType: "Nghỉ không hưởng lương",
    startDate: "15/10/2026",
    endDate: "15/10/2026",
    daysCount: 1,
    reason: "Bận thi bằng lái xe B2",
    status: "PENDING_APPROVAL",
  },
];

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_LEAVE_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<LeaveRequestItem | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      r.leaveType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" as const } : r))
    );
    toast.success("Đã phê duyệt đơn nghỉ phép");
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedReq) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id ? { ...r, status: "REJECTED" as const } : r
      )
    );
    toast.error(`Đã từ chối đơn nghỉ phép: ${reason}`);
    setRejectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản lý Đơn xin Nghỉ phép
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
            <span className="text-foreground font-medium">Đơn nghỉ phép</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tạo đơn nghỉ phép mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo đơn nghỉ phép</span>
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
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng số đơn</p>
                <h3 className="kpi-value">{requests.length}</h3>
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
              <div className="kpi-icon-wrapper bg-amber-500">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Chờ phê duyệt</p>
                <h3 className="kpi-value">{requests.filter((r) => r.status === "PENDING_APPROVAL").length}</h3>
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
                <p className="kpi-title">Đã phê duyệt</p>
                <h3 className="kpi-value">{requests.filter((r) => r.status === "APPROVED").length}</h3>
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
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Từ chối / Hủy</p>
                <h3 className="kpi-value">{requests.filter((r) => r.status === "REJECTED" || r.status === "CANCELLED").length}</h3>
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
              Danh sách đơn xin nghỉ phép
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-btn"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING_APPROVAL">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
          </div>
        </div>

        <div className="table-sub-toolbar">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Hiển thị</span>
            <select className="h-8 rounded-md border border-border bg-white px-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none">
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>bản ghi</span>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo nhân viên, mã, loại phép..."
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
                <th>Loại nghỉ phép</th>
                <th>Từ ngày - Đến ngày</th>
                <th className="text-center">Số ngày</th>
                <th>Lý do</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.map((r) => (
                <tr key={r.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${r.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {r.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {r.employeeCode}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    {r.departmentName}
                  </td>
                  <td className="text-xs text-primary font-semibold">
                    {r.leaveType}
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {r.startDate} — {r.endDate}
                  </td>
                  <td className="text-center font-bold text-xs text-foreground">
                    {r.daysCount} ngày
                  </td>
                  <td className="text-xs text-[#4B5563] max-w-xs truncate">
                    {r.reason}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      {r.status === "PENDING_APPROVAL" && (
                        <>
                          <button
                            type="button"
                            title="Phê duyệt"
                            onClick={() => handleApprove(r.id)}
                            className="btn-icon-sm text-accent hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Từ chối"
                            onClick={() => {
                              setSelectedReq(r);
                              setRejectModalOpen(true);
                            }}
                            className="btn-icon-sm text-destructive hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() => toast.info(`Đơn nghỉ phép: ${r.employeeName}`)}
                        className="btn-icon-sm"
                      >
                        <Eye className="h-3.5 w-3.5" />
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
            Hiển thị {filteredRequests.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{requests.length}</span> đơn
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

      {/* ── Dialog Reject Reason ─────────────────────────────────────── */}
      <ConfirmReasonDialog
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        title="Từ chối phê duyệt đơn nghỉ phép"
        description={`Nhân viên ${selectedReq?.employeeName} xin nghỉ từ ${selectedReq?.startDate} đến ${selectedReq?.endDate}.`}
        reasonLabel="Lý do từ chối (Bắt buộc)"
        requiredReason={true}
        confirmText="Xác nhận từ chối"
        variant="destructive"
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
