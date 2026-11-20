"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Layers,
  Plus,
  ArrowUpDown,
  Users,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface JobLevel {
  id: string;
  name: string;
  code: string;
  rankOrder: number; // 1 = Highest (C-Level/Executive)
  salaryRangeDesc: string;
  employeeCount: number;
}

const INITIAL_JOB_LEVELS: JobLevel[] = [
  { id: "lvl_1", name: "C-Level / Ban Giám Đốc", code: "L1", rankOrder: 1, salaryRangeDesc: "Thỏa thuận HĐQT", employeeCount: 4 },
  { id: "lvl_2", name: "Giám Đốc Khối / Director", code: "L2", rankOrder: 2, salaryRangeDesc: "60,000,000 — 120,000,000 ₫", employeeCount: 8 },
  { id: "lvl_3", name: "Trưởng Phòng / Manager / Tech Lead", code: "L3", rankOrder: 3, salaryRangeDesc: "35,000,000 — 65,000,000 ₫", employeeCount: 26 },
  { id: "lvl_4", name: "Phó Phòng / Team Lead", code: "L4", rankOrder: 4, salaryRangeDesc: "28,000,000 — 45,000,000 ₫", employeeCount: 38 },
  { id: "lvl_5", name: "Senior / Chuyên viên Cao cấp", code: "L5", rankOrder: 5, salaryRangeDesc: "22,000,000 — 35,000,000 ₫", employeeCount: 110 },
  { id: "lvl_6", name: "Mid / Chuyên viên", code: "L6", rankOrder: 6, salaryRangeDesc: "14,000,000 — 22,000,000 ₫", employeeCount: 180 },
  { id: "lvl_7", name: "Junior / Nhân viên", code: "L7", rankOrder: 7, salaryRangeDesc: "9,000,000 — 14,000,000 ₫", employeeCount: 65 },
  { id: "lvl_8", name: "Fresher / Thực tập sinh", code: "L8", rankOrder: 8, salaryRangeDesc: "5,000,000 — 8,000,000 ₫", employeeCount: 19 },
];

export default function JobLevelsPage() {
  const [jobLevels, setJobLevels] = useState<JobLevel[]>(INITIAL_JOB_LEVELS);
  const [modalOpen, setModalOpen] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelCode, setNewLevelCode] = useState("");
  const [newRank, setNewRank] = useState(9);
  const [search, setSearch] = useState("");

  const filteredLevels = jobLevels.filter(
    (lvl) =>
      lvl.name.toLowerCase().includes(search.toLowerCase()) ||
      lvl.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const target = jobLevels.find((lvl) => lvl.id === id);
    if (!target) return;
    setJobLevels((prev) => prev.filter((lvl) => lvl.id !== id));
    toast.success(`Đã xóa cấp bậc: ${target.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Actions ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Cấp bậc & Thang bậc Thẩm quyền
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
            <span className="text-foreground font-medium">Thang cấp bậc (Job Levels)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm cấp bậc</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Thang bậc chức danh chuẩn doanh nghiệp
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã cấp bậc..."
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
                <th className="w-16 text-center">Thứ bậc</th>
                <th>Mã cấp</th>
                <th>Tên cấp bậc</th>
                <th>Khung dải lương tham chiếu (Benchmark)</th>
                <th className="text-center">Số lượng nhân sự</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLevels.map((lvl) => (
                <tr key={lvl.id} className="table-row">
                  <td className="text-center">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {lvl.rankOrder}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-bold text-foreground">
                    {lvl.code}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {lvl.name}
                  </td>
                  <td className="text-xs font-medium text-[#4B5563]">
                    {lvl.salaryRangeDesc}
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {lvl.employeeCount}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => toast.info(`Chỉnh sửa cấp bậc: ${lvl.name}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Xóa cấp bậc"
                        onClick={() => handleDelete(lvl.id)}
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
            Hiển thị {filteredLevels.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">
              {jobLevels.length}
            </span>{" "}
            cấp bậc
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

      {/* ── Dialog Add Job Level ─────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-border space-y-4 animate-scaleIn">
            <h3 className="text-lg font-bold text-foreground">Thêm cấp bậc chức danh mới</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Tên cấp bậc *
                </label>
                <input
                  value={newLevelName}
                  onChange={(e) => setNewLevelName(e.target.value)}
                  placeholder="Ví dụ: Lead Specialist / Trưởng nhóm chuyên môn"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Mã cấp bậc *
                </label>
                <input
                  value={newLevelCode}
                  onChange={(e) => setNewLevelCode(e.target.value)}
                  placeholder="Ví dụ: L4B"
                  className="input font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Thứ bậc (Rank Order)
                </label>
                <input
                  type="number"
                  value={newRank}
                  onChange={(e) => setNewRank(Number(e.target.value))}
                  className="input text-xs"
                />
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
                  toast.success(`Đã thêm cấp bậc: ${newLevelName}`);
                  setModalOpen(false);
                }}
              >
                Lưu cấp bậc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
