"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Plus,
  Search,
  Lock,
  Unlock,
  Mail,
  Shield,
  Eye,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";
import { toast } from "sonner";

interface UserAccount {
  id: string;
  email: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  departmentName: string;
  roles: string[];
  status: "ACTIVE" | "PENDING_ACTIVATION" | "LOCKED";
  lastLoginAt: string;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr_1",
    email: "an.nguyen@cyclosa.vn",
    employeeName: "Nguyễn Văn An",
    employeeCode: "EMP001",
    initials: "NA",
    avatarBg: "bg-red-500 text-white",
    departmentName: "Ban Giám Đốc",
    roles: ["Super Admin", "Executive"],
    status: "ACTIVE",
    lastLoginAt: "Hôm nay 08:30",
  },
  {
    id: "usr_2",
    email: "mai.tran@cyclosa.vn",
    employeeName: "Trần Thị Mai",
    employeeCode: "EMP002",
    initials: "TM",
    avatarBg: "bg-blue-500 text-white",
    departmentName: "Khối Quản Trị Nhân Sự",
    roles: ["HR Director", "HR Specialist"],
    status: "ACTIVE",
    lastLoginAt: "Hôm nay 09:12",
  },
  {
    id: "usr_3",
    email: "nam.le@cyclosa.vn",
    employeeName: "Lê Hoàng Nam",
    employeeCode: "EMP003",
    initials: "HN",
    avatarBg: "bg-emerald-500 text-white",
    departmentName: "Khối Công Nghệ",
    roles: ["Department Manager"],
    status: "ACTIVE",
    lastLoginAt: "Hôm qua 17:45",
  },
  {
    id: "usr_4",
    email: "tan.dev@cyclosa.vn",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    departmentName: "Phòng Phát Triển Backend",
    roles: ["Employee Self-Service"],
    status: "PENDING_ACTIVATION",
    lastLoginAt: "Chưa đăng nhập",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      u.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      u.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleLockConfirm = (reason: string) => {
    if (!selectedUser) return;
    const isLocking = selectedUser.status !== "LOCKED";
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, status: isLocking ? ("LOCKED" as const) : ("ACTIVE" as const) }
          : u
      )
    );
    toast.success(
      isLocking
        ? `Đã khóa tài khoản ${selectedUser.email}. Lý do: ${reason}`
        : `Đã mở khóa tài khoản ${selectedUser.email}`
    );
    setLockModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản trị Tài khoản Người dùng
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
              Hệ thống & Phân quyền
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Tài khoản người dùng</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tính năng tạo tài khoản đăng nhập")}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo tài khoản mới</span>
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
                <p className="kpi-title">Tổng tài khoản</p>
                <h3 className="kpi-value">{users.length}</h3>
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
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Đang kích hoạt (Active)</p>
                <h3 className="kpi-value">{users.filter((u) => u.status === "ACTIVE").length}</h3>
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
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Chờ kích hoạt email</p>
                <h3 className="kpi-value">{users.filter((u) => u.status === "PENDING_ACTIVATION").length}</h3>
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
                <UserX className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tài khoản bị khóa</p>
                <h3 className="kpi-value">{users.filter((u) => u.status === "LOCKED").length}</h3>
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
              Danh sách tài khoản hệ thống
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo email, tên, mã nhân viên..."
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
                <th>Người dùng / Email</th>
                <th>Phòng ban</th>
                <th>Vai trò phân quyền</th>
                <th>Đăng nhập gần nhất</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="table-row">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${u.avatarBg} font-bold text-xs shadow-2xs`}
                      >
                        {u.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {u.employeeName}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                          {u.email} ({u.employeeCode})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-foreground">
                    {u.departmentName}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((r) => (
                        <span
                          key={r}
                          className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs font-mono text-muted-foreground">
                    {u.lastLoginAt}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title={u.status === "LOCKED" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                        onClick={() => {
                          setSelectedUser(u);
                          setLockModalOpen(true);
                        }}
                        className={`btn-icon-sm ${
                          u.status === "LOCKED"
                            ? "text-accent hover:bg-green-50"
                            : "text-destructive hover:bg-red-50"
                        }`}
                      >
                        {u.status === "LOCKED" ? (
                          <Unlock className="h-3.5 w-3.5" />
                        ) : (
                          <Lock className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/admin/users/${u.id}`}
                        title="Xem chi tiết phân quyền"
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
            Hiển thị {filteredUsers.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{users.length}</span> tài khoản
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

      {/* ── Dialog Confirm Lock/Unlock User ──────────────────────────── */}
      <ConfirmReasonDialog
        open={lockModalOpen}
        onOpenChange={setLockModalOpen}
        title={
          selectedUser?.status === "LOCKED"
            ? `Mở khóa tài khoản: ${selectedUser?.email}`
            : `Khóa tài khoản người dùng: ${selectedUser?.email}`
        }
        description={
          selectedUser?.status === "LOCKED"
            ? "Tài khoản sẽ được kích hoạt lại ngay lập tức và người dùng có thể đăng nhập."
            : "Người dùng sẽ bị thu hồi toàn bộ phiên đăng nhập hiện tại và không thể truy cập hệ thống."
        }
        reasonLabel="Lý do khóa/mở khóa (Bắt buộc theo chuẩn ISO/IEC 27001)"
        requiredReason={true}
        confirmText={selectedUser?.status === "LOCKED" ? "Mở khóa" : "Khóa tài khoản"}
        variant={selectedUser?.status === "LOCKED" ? "default" : "destructive"}
        onConfirm={handleToggleLockConfirm}
      />
    </div>
  );
}
