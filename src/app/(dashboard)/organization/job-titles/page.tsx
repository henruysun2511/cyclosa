"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Briefcase,
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface JobTitle {
  id: string;
  name: string;
  code: string;
  departmentCategory: string;
  employeeCount: number;
  status: string;
}

const INITIAL_JOB_TITLES: JobTitle[] = [
  { id: "jt_ceo", name: "Tổng Giám Đốc", code: "CEO", departmentCategory: "Ban Giám Đốc", employeeCount: 1, status: "ACTIVE" },
  { id: "jt_cto", name: "Giám Đốc Công Nghệ", code: "CTO", departmentCategory: "Khối Công Nghệ", employeeCount: 1, status: "ACTIVE" },
  { id: "jt_cfo", name: "Giám Đốc Tài Chính", code: "CFO", departmentCategory: "Khối Tài Chính", employeeCount: 1, status: "ACTIVE" },
  { id: "jt_hrd", name: "Giám Đốc Nhân Sự", code: "HRD", departmentCategory: "Khối Nhân Sự", employeeCount: 1, status: "ACTIVE" },
  { id: "jt_tl", name: "Technical Lead", code: "TECH_LEAD", departmentCategory: "Khối Công Nghệ", employeeCount: 12, status: "ACTIVE" },
  { id: "jt_sfe", name: "Senior Frontend Engineer", code: "SR_FE", departmentCategory: "Khối Công Nghệ", employeeCount: 24, status: "ACTIVE" },
  { id: "jt_sbe", name: "Senior Backend Engineer", code: "SR_BE", departmentCategory: "Khối Công Nghệ", employeeCount: 32, status: "ACTIVE" },
  { id: "jt_mktm", name: "Marketing Manager", code: "MKT_MGR", departmentCategory: "Khối Kinh Doanh", employeeCount: 4, status: "ACTIVE" },
  { id: "jt_rec", name: "Chuyên Viên Tuyển Dụng", code: "REC_SPEC", departmentCategory: "Khối Nhân Sự", employeeCount: 8, status: "ACTIVE" },
  { id: "jt_leg", name: "Chuyên Viên Pháp Chế", code: "LEGAL_SPEC", departmentCategory: "Ban Pháp Chế", employeeCount: 5, status: "ACTIVE" },
];

export default function JobTitlesPage() {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>(INITIAL_JOB_TITLES);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitleName, setNewTitleName] = useState("");
  const [newTitleCode, setNewTitleCode] = useState("");
  const [newDeptCat, setNewDeptCat] = useState("Khối Công Nghệ");

  const filteredTitles = jobTitles.filter(
    (j) =>
      j.name.toLowerCase().includes(search.toLowerCase()) ||
      j.code.toLowerCase().includes(search.toLowerCase()) ||
      j.departmentCategory.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const target = jobTitles.find((t) => t.id === id);
    if (!target) return;
    setJobTitles((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Đã xóa chức danh: ${target.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Actions ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Danh mục Chức danh & Vị trí công việc
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
              Cơ cấu tổ chức
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Chức danh công việc (Job Titles)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm chức danh</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Danh sách chức danh ({filteredTitles.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên chức danh, mã, khối..."
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
                <th>Mã chức danh</th>
                <th>Tên vị trí công việc</th>
                <th>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    <span>Khối nghiệp vụ</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </th>
                <th className="text-center">Số lượng nhân sự</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTitles.map((jt) => (
                <tr key={jt.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {jt.code}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {jt.name}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {jt.departmentCategory}
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {jt.employeeCount}
                    </span>
                  </td>
                  <td className="text-center">
                    <StatusBadge status={jt.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => toast.info(`Chỉnh sửa chức danh: ${jt.name}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Xóa chức danh"
                        onClick={() => handleDelete(jt.id)}
                        className="btn-icon-sm hover:bg-[#FEE2E2] hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
            Hiển thị {filteredTitles.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">
              {jobTitles.length}
            </span>{" "}
            chức danh
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

      {/* ── Dialog Add Job Title ─────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-border space-y-4 animate-scaleIn">
            <h3 className="text-lg font-bold text-foreground">Thêm chức danh công việc mới</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Tên chức danh *
                </label>
                <input
                  value={newTitleName}
                  onChange={(e) => setNewTitleName(e.target.value)}
                  placeholder="Ví dụ: AI Research Scientist"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Mã chức danh *
                </label>
                <input
                  value={newTitleCode}
                  onChange={(e) => setNewTitleCode(e.target.value)}
                  placeholder="Ví dụ: AI_SCI"
                  className="input font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Khối nghiệp vụ
                </label>
                <select
                  value={newDeptCat}
                  onChange={(e) => setNewDeptCat(e.target.value)}
                  className="input text-xs"
                >
                  <option value="Ban Giám Đốc">Ban Giám Đốc</option>
                  <option value="Khối Công Nghệ">Khối Công Nghệ</option>
                  <option value="Khối Nhân Sự">Khối Nhân Sự</option>
                  <option value="Khối Tài Chính">Khối Tài Chính</option>
                  <option value="Khối Kinh Doanh">Khối Kinh Doanh</option>
                  <option value="Ban Pháp Chế">Ban Pháp Chế</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setModalOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  toast.success(`Đã thêm chức danh: ${newTitleName}`);
                  setModalOpen(false);
                }}
              >
                Lưu chức danh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
