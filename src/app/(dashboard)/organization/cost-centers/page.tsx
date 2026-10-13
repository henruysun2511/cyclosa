"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Coins,
  Plus,
  Search,
  Building2,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface CostCenter {
  id: string;
  name: string;
  code: string;
  assignedDepartment: string;
  annualBudget: string;
  status: string;
}

const INITIAL_COST_CENTERS: CostCenter[] = [
  { id: "cc_1", name: "Trung Tâm Chi Phí Công Nghệ R&D", code: "CC_TECH_RND", assignedDepartment: "Khối Công Nghệ", annualBudget: "25,000,000,000 ₫", status: "ACTIVE" },
  { id: "cc_2", name: "Trung Tâm Chi Phí Kinh Doanh Toàn Quốc", code: "CC_SALES_NAT", assignedDepartment: "Khối Kinh Doanh", annualBudget: "18,500,000,000 ₫", status: "ACTIVE" },
  { id: "cc_3", name: "Trung Tâm Chi Phí Vận Hành Nhân Sự & Đào Tạo", code: "CC_HR_OPS", assignedDepartment: "Khối Quản Trị Nhân Sự", annualBudget: "8,200,000,000 ₫", status: "ACTIVE" },
  { id: "cc_4", name: "Trung Tâm Chi Phí Ban Tổng Giám Đốc", code: "CC_BOD", assignedDepartment: "Ban Tổng Giám Đốc", annualBudget: "12,000,000,000 ₫", status: "ACTIVE" },
  { id: "cc_5", name: "Trung Tâm Chi Phí Văn Phòng & Cơ Sở Hạ Tầng", code: "CC_FACILITIES", assignedDepartment: "Văn Phòng & Cơ Sở", annualBudget: "15,000,000,000 ₫", status: "ACTIVE" },
];

export default function CostCentersPage() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>(INITIAL_COST_CENTERS);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newDept, setNewDept] = useState("Khối Công Nghệ");
  const [newBudget, setNewBudget] = useState("10,000,000,000 ₫");

  const filteredCenters = costCenters.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.assignedDepartment.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    const target = costCenters.find((c) => c.id === id);
    if (!target) return;
    setCostCenters((prev) => prev.filter((c) => c.id !== id));
    toast.success(`Đã xóa trung tâm chi phí: ${target.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Actions ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Trung tâm Chi phí
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
            <span className="text-foreground font-medium">Trung tâm chi phí</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm trung tâm chi phí</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Danh sách trung tâm hạch toán chi phí ({filteredCenters.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo mã, tên hoặc khối liên kết..."
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
                <th>Mã chi phí</th>
                <th>Tên trung tâm chi phí</th>
                <th>Đơn vị phòng ban hạch toán</th>
                <th>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    <span>Ngân sách dự toán năm</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCenters.map((cc) => (
                <tr key={cc.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {cc.code}
                  </td>
                  <td className="font-semibold text-foreground text-sm">
                    {cc.name}
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {cc.assignedDepartment}
                  </td>
                  <td className="text-xs font-mono font-semibold text-foreground">
                    {cc.annualBudget}
                  </td>
                  <td className="text-center">
                    <StatusBadge status={cc.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => toast.info(`Chỉnh sửa trung tâm chi phí: ${cc.name}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Xóa"
                        onClick={() => handleDelete(cc.id)}
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
            Hiển thị {filteredCenters.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">
              {costCenters.length}
            </span>{" "}
            trung tâm chi phí
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

      {/* ── Modal Add Cost Center ───────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-border space-y-4 animate-scaleIn">
            <h3 className="text-lg font-bold text-foreground">Thêm trung tâm chi phí mới</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Tên trung tâm chi phí *
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Trung Tâm Chi Phí Bảo Mật & Cloud"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Mã chi phí (Cost Center Code) *
                </label>
                <input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Ví dụ: CC_SEC_CLOUD"
                  className="input font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Phòng ban hạch toán
                </label>
                <input
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Ngân sách dự toán năm
                </label>
                <input
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
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
                  toast.success(`Đã thêm trung tâm chi phí: ${newName}`);
                  setModalOpen(false);
                }}
              >
                Lưu trung tâm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
