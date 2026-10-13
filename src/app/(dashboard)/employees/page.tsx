"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Users,
  UserCheck,
  UserPlus,
  UserX,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface EmployeeItem {
  id: string;
  code: string;
  name: string;
  initials: string;
  avatarBg: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  departmentName: string;
  jobTitle: string;
  branchName: string;
  startDate: string;
  status: "ACTIVE" | "PROBATION" | "SUSPENDED" | "TERMINATED";
}

const INITIAL_EMPLOYEES: EmployeeItem[] = [
  {
    id: "emp_1",
    code: "EMP001",
    name: "Nguyễn Văn An",
    initials: "NA",
    avatarBg: "bg-red-500 text-white",
    avatarUrl: "/avatars/emp_1.jpg",
    email: "an.nguyen@cyclosa.vn",
    phone: "0901 234 567",
    departmentName: "Ban Giám Đốc",
    jobTitle: "Tổng Giám Đốc (CEO)",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "01/01/2020",
    status: "ACTIVE",
  },
  {
    id: "emp_2",
    code: "EMP002",
    name: "Trần Thị Mai",
    initials: "TM",
    avatarBg: "bg-blue-500 text-white",
    email: "mai.tran@cyclosa.vn",
    phone: "0912 345 678",
    departmentName: "Khối Quản Trị Nhân Sự",
    jobTitle: "Trưởng Phòng Nhân Sự",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "15/03/2021",
    status: "ACTIVE",
  },
  {
    id: "emp_3",
    code: "EMP003",
    name: "Lê Hoàng Nam",
    initials: "HN",
    avatarBg: "bg-emerald-500 text-white",
    email: "nam.le@cyclosa.vn",
    phone: "0983 456 789",
    departmentName: "Khối Công Nghệ",
    jobTitle: "Technical Lead (CTO)",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "10/05/2021",
    status: "ACTIVE",
  },
  {
    id: "emp_4",
    code: "EMP004",
    name: "Phạm Minh Tuấn",
    initials: "PT",
    avatarBg: "bg-purple-500 text-white",
    email: "tuan.pham@cyclosa.vn",
    phone: "0974 567 890",
    departmentName: "Phòng Phát Triển Frontend",
    jobTitle: "Senior Frontend Engineer",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "01/08/2022",
    status: "ACTIVE",
  },
  {
    id: "emp_5",
    code: "EMP005",
    name: "Hoàng Thảo Linh",
    initials: "TL",
    avatarBg: "bg-amber-500 text-white",
    email: "linh.hoang@cyclosa.vn",
    phone: "0935 678 901",
    departmentName: "Khối Tài Chính",
    jobTitle: "Kế Toán Trưởng (CFO)",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "15/11/2021",
    status: "ACTIVE",
  },
  {
    id: "emp_6",
    code: "EMP088",
    name: "Đặng Minh Tân",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    email: "tan.dev@cyclosa.vn",
    phone: "0946 789 012",
    departmentName: "Phòng Phát Triển Backend",
    jobTitle: "Junior Backend Engineer",
    branchName: "Trụ Sở Chính — FSI Tower",
    startDate: "01/09/2026",
    status: "PROBATION",
  },
  {
    id: "emp_7",
    code: "EMP092",
    name: "Ngô Quang Huy",
    initials: "QH",
    avatarBg: "bg-indigo-500 text-white",
    email: "huy.ngo@cyclosa.vn",
    phone: "0967 890 123",
    departmentName: "Phòng Kế Toán Doanh Nghiệp",
    jobTitle: "Chuyên Viên Kế Toán",
    branchName: "Chi Nhánh Hồ Chí Minh",
    startDate: "15/09/2026",
    status: "PROBATION",
  },
];

export default function EmployeesListPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [kpiCollapsed, setKpiCollapsed] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || emp.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, selectedStatus]);

  // Pagination
  const totalEntries = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((e) => selectedIds.includes(e.id));

  const handleDelete = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    toast.success(`Đã xóa hồ sơ nhân sự: ${target.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Actions ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hồ sơ Nhân sự Cốt lõi
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
            <span className="text-foreground font-medium">Danh sách nhân sự</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toast.info("Đang kết xuất danh sách nhân viên định dạng Excel...")}
            className="btn-outline"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>

          <Link href="/employees/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            <span>Tiếp nhận nhân sự mới</span>
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
              <div className="kpi-icon-wrapper bg-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng nhân sự</p>
                <h3 className="kpi-value">{employees.length}</h3>
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
                <p className="kpi-title">Đang làm việc</p>
                <h3 className="kpi-value">{employees.filter((e) => e.status === "ACTIVE").length}</h3>
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
                <p className="kpi-title">Thử việc (Onboarding)</p>
                <h3 className="kpi-value">{employees.filter((e) => e.status === "PROBATION").length}</h3>
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
                <p className="kpi-title">Tạm hoãn / Thôi việc</p>
                <h3 className="kpi-value">{employees.filter((e) => e.status === "SUSPENDED" || e.status === "TERMINATED").length}</h3>
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
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">Danh sách nhân viên</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className={`filter-btn ${selectedStatus !== "ALL" ? "active" : ""}`}
              >
                <span>
                  {selectedStatus === "ALL"
                    ? "Tất cả trạng thái"
                    : selectedStatus === "ACTIVE"
                    ? "Chính thức"
                    : "Thử việc"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              {statusDropdownOpen && (
                <div className="filter-dropdown-menu w-40">
                  {[
                    { key: "ALL", label: "Tất cả trạng thái" },
                    { key: "ACTIVE", label: "Chính thức" },
                    { key: "PROBATION", label: "Thử việc" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(item.key);
                        setStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`filter-menu-item ${selectedStatus === item.key ? "active" : ""}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Sub Toolbar */}
        <div className="table-sub-toolbar">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Hiển thị</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-border bg-white px-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>bản ghi</span>

            {selectedIds.length > 0 && (
              <span className="ml-3 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {selectedIds.length} đã chọn
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo họ tên, mã NV, email, chức danh..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Nhân sự</th>
                <th>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    <span>Phòng ban</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </th>
                <th>Chức danh</th>
                <th>Chi nhánh</th>
                <th>Ngày vào làm</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    Không tìm thấy nhân viên nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isSelected = selectedIds.includes(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`table-row ${isSelected ? "selected" : ""}`}
                    >
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(emp.id)}
                        />
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          {emp.avatarUrl ? (
                            <img
                              src={emp.avatarUrl}
                              alt={emp.name}
                              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border shadow-2xs"
                            />
                          ) : (
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${emp.avatarBg} font-bold text-xs shadow-2xs`}
                            >
                              {emp.initials}
                            </div>
                          )}
                          <div>
                            <Link
                              href={`/employees/${emp.id}`}
                              className="font-semibold text-foreground text-sm hover:text-primary transition-colors block"
                            >
                              {emp.name}
                            </Link>
                            <span className="text-xs text-muted-foreground font-mono">
                              {emp.code} • {emp.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="text-xs font-medium text-foreground">
                        {emp.departmentName}
                      </td>

                      <td className="text-xs text-[#4B5563]">
                        {emp.jobTitle}
                      </td>

                      <td className="text-xs text-muted-foreground">
                        {emp.branchName}
                      </td>

                      <td className="text-xs font-mono text-muted-foreground">
                        {emp.startDate}
                      </td>

                      <td className="text-center">
                        <StatusBadge status={emp.status} />
                      </td>

                      <td className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link
                            href={`/employees/${emp.id}`}
                            title="Xem hồ sơ 360°"
                            className="btn-icon-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            title="Chỉnh sửa thông tin"
                            onClick={() => toast.info(`Chỉnh sửa hồ sơ: ${emp.name}`)}
                            className="btn-icon-sm hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            title="Xóa hồ sơ"
                            onClick={() => handleDelete(emp.id)}
                            className="btn-icon-sm hover:bg-[#FEE2E2] hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="table-pagination">
          <div>
            Hiển thị {totalEntries > 0 ? startIndex + 1 : 0} đến {endIndex} trên{" "}
            <span className="font-semibold text-foreground">{totalEntries}</span> nhân sự
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="pagination-nav-btn"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="pagination-nav-btn"
            >
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
