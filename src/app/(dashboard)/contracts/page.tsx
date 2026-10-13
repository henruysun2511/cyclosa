"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  Plus,
  Search,
  Download,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileSignature,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { StatusBadge, SensitiveMask } from "@/components/shared";
import { toast } from "sonner";

interface ContractItem {
  id: string;
  contractNumber: string;
  employeeName: string;
  employeeCode: string;
  initials: string;
  avatarBg: string;
  contractType: "PROBATION" | "DEFINITE_12M" | "INDEFINITE";
  signDate: string;
  effectiveDate: string;
  expiryDate?: string;
  salary: number;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "TERMINATED";
}

const INITIAL_CONTRACTS: ContractItem[] = [
  {
    id: "con_01",
    contractNumber: "HĐLĐ-2020/001",
    employeeName: "Nguyễn Văn An",
    employeeCode: "EMP001",
    initials: "NA",
    avatarBg: "bg-red-500 text-white",
    contractType: "INDEFINITE",
    signDate: "01/01/2020",
    effectiveDate: "01/01/2020",
    salary: 80000000,
    status: "ACTIVE",
  },
  {
    id: "con_02",
    contractNumber: "HĐLĐ-2022/105",
    employeeName: "Phạm Minh Tuấn",
    employeeCode: "EMP004",
    initials: "PT",
    avatarBg: "bg-purple-500 text-white",
    contractType: "INDEFINITE",
    signDate: "01/08/2022",
    effectiveDate: "01/08/2022",
    salary: 38000000,
    status: "ACTIVE",
  },
  {
    id: "con_03",
    contractNumber: "HĐLĐ-2025/312",
    employeeName: "Đặng Minh Tân",
    employeeCode: "EMP088",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    contractType: "PROBATION",
    signDate: "01/09/2026",
    effectiveDate: "01/09/2026",
    expiryDate: "31/10/2026",
    salary: 16000000,
    status: "EXPIRING_SOON",
  },
  {
    id: "con_04",
    contractNumber: "HĐLĐ-2025/298",
    employeeName: "Ngô Quang Huy",
    employeeCode: "EMP092",
    initials: "QH",
    avatarBg: "bg-indigo-500 text-white",
    contractType: "DEFINITE_12M",
    signDate: "15/09/2025",
    effectiveDate: "15/09/2025",
    expiryDate: "14/09/2026",
    salary: 22000000,
    status: "EXPIRING_SOON",
  },
];

export default function ContractsListPage() {
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [kpiCollapsed, setKpiCollapsed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredContracts = useMemo(() => {
    return contracts.filter((con) => {
      const matchesSearch =
        con.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
        con.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        con.employeeCode.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "ALL" || con.contractType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [contracts, search, typeFilter]);

  const totalEntries = filteredContracts.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedContracts = filteredContracts.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedContracts.map((c) => c.id));
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
    paginatedContracts.length > 0 &&
    paginatedContracts.every((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Quản lý Hợp đồng Lao động & Phụ lục
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
              Hợp đồng & Văn bản
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Hợp đồng lao động</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-outline"
            onClick={() => toast.info("Đang xuất danh sách hợp đồng...")}
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tạo hợp đồng mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Soạn hợp đồng mới</span>
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
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Tổng hợp đồng</p>
                <h3 className="kpi-value">{contracts.length}</h3>
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
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">Không thời hạn</p>
                <h3 className="kpi-value">{contracts.filter((c) => c.contractType === "INDEFINITE").length}</h3>
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
                <p className="kpi-title">Xác định thời hạn / Thử việc</p>
                <h3 className="kpi-value">{contracts.filter((c) => c.contractType !== "INDEFINITE").length}</h3>
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
                <p className="kpi-title">Sắp hết hạn (&lt; 30 ngày)</p>
                <h3 className="kpi-value">{contracts.filter((c) => c.status === "EXPIRING_SOON").length}</h3>
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
              Danh sách hợp đồng nhân sự
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-btn"
            >
              <option value="ALL">Tất cả loại hợp đồng</option>
              <option value="INDEFINITE">Không xác định thời hạn</option>
              <option value="DEFINITE_12M">Xác định thời hạn 12T</option>
              <option value="PROBATION">Hợp đồng thử việc</option>
            </select>
          </div>
        </div>

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
              placeholder="Tìm theo số HĐ, tên, mã nhân viên..."
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
                <th className="w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Số hợp đồng</th>
                <th>Nhân sự</th>
                <th>Loại hợp đồng</th>
                <th>Ngày hiệu lực</th>
                <th>Ngày hết hạn</th>
                <th>Mức lương đóng BH</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedContracts.map((con) => {
                const isSelected = selectedIds.includes(con.id);
                return (
                  <tr key={con.id} className={`table-row ${isSelected ? "selected" : ""}`}>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(con.id)}
                      />
                    </td>
                    <td className="font-mono text-xs font-bold text-primary">
                      {con.contractNumber}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${con.avatarBg} font-bold text-xs shadow-2xs`}
                        >
                          {con.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {con.employeeName}
                          </p>
                          <span className="text-xs text-muted-foreground font-mono">
                            {con.employeeCode}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-foreground">
                      {con.contractType === "INDEFINITE"
                        ? "Không xác định thời hạn"
                        : con.contractType === "DEFINITE_12M"
                        ? "Có thời hạn (12 tháng)"
                        : "Thử việc (02 tháng)"}
                    </td>
                    <td className="text-xs font-mono text-muted-foreground">
                      {con.effectiveDate}
                    </td>
                    <td className="text-xs font-mono">
                      {con.expiryDate ? (
                        <span className={con.status === "EXPIRING_SOON" ? "text-destructive font-semibold" : "text-muted-foreground"}>
                          {con.expiryDate}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Vô thời hạn</span>
                      )}
                    </td>
                    <td className="text-xs">
                      <SensitiveMask value={`${con.salary.toLocaleString("vi-VN")} ₫`} />
                    </td>
                    <td className="text-center">
                      <StatusBadge status={con.status} />
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link
                          href={`/me/contracts/sign/${con.id}`}
                          title="Xem & Ký số điện tử"
                          className="btn-icon-sm"
                        >
                          <FileSignature className="h-3.5 w-3.5 text-primary" />
                        </Link>
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => toast.info(`Chỉnh sửa HĐ: ${con.contractNumber}`)}
                          className="btn-icon-sm hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {totalEntries > 0 ? startIndex + 1 : 0} đến {endIndex} trên{" "}
            <span className="font-semibold text-foreground">{totalEntries}</span> hợp đồng
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`pagination-btn ${currentPage === p ? "active" : ""}`}
              >
                {p}
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
