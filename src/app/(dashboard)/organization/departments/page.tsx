"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  FolderTree,
  List,
  Plus,
  ArrowRightLeft,
  Trash2,
  Calendar,
  Building2,
  Users,
  Search,
  Pencil,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  OrgTree,
  DepartmentNode,
  MOCK_ORG_TREE,
  EmployeePicker,
  ConfirmReasonDialog,
} from "@/components/shared";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const [viewMode, setViewMode] = useState<"tree" | "table">("tree");
  const [selectedDept, setSelectedDept] = useState<DepartmentNode | null>(MOCK_ORG_TREE[0]);
  const [asOfDate, setAsOfDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [dissolveModalOpen, setDissolveModalOpen] = useState(false);

  // Form states
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [targetParentDept, setTargetParentDept] = useState("");

  // Flattened departments for table view
  const flattenedDepts: DepartmentNode[] = [
    { id: "corp", name: "Tập Đoàn CYCLOSA FSI", code: "CORP", managerName: "Nguyễn Văn An (CEO)", employeeCount: 450 },
    { id: "bod", name: "Ban Tổng Giám Đốc", code: "BOD", managerName: "Nguyễn Văn An", employeeCount: 6 },
    { id: "hr", name: "Khối Quản Trị Nhân Sự", code: "HRD", managerName: "Trần Thị Mai (HR Director)", employeeCount: 28 },
    { id: "hr_rec", name: "Phòng Tuyển Dụng & Thu Hút Nhân Tài", code: "REC", managerName: "Lê Thu Trang", employeeCount: 10 },
    { id: "hr_cbn", name: "Phòng Tiền Lương & Đãi Ngộ (C&B)", code: "CBN", managerName: "Đỗ Hải Nam", employeeCount: 8 },
    { id: "tech", name: "Khối Công Nghệ & Chuyển Đổi Số", code: "TECH", managerName: "Lê Hoàng Nam (CTO)", employeeCount: 215 },
    { id: "tech_fe", name: "Phòng Phát Triển Frontend", code: "FED", managerName: "Phạm Minh Tuấn", employeeCount: 45 },
    { id: "tech_be", name: "Phòng Phát Triển Backend & Cloud", code: "BED", managerName: "Trần Quốc Bảo", employeeCount: 65 },
    { id: "tech_ai", name: "Trung Tâm Nghiên Cứu AI & Data", code: "AIR", managerName: "Lê Thúy Hằng", employeeCount: 30 },
    { id: "fin", name: "Khối Tài Chính - Kế Toán", code: "FIN", managerName: "Hoàng Thảo Linh (CFO)", employeeCount: 35 },
    { id: "biz", name: "Khối Kinh Doanh & Tiếp Thị", code: "BIZ", managerName: "Vũ Đức Long (CCO)", employeeCount: 140 },
    { id: "leg", name: "Ban Pháp Chế & Quản Trị Rủi Ro", code: "LEG", managerName: "Đặng Bích Ngọc", employeeCount: 26 },
  ];

  const filteredTableDepts = flattenedDepts.filter(
    (d) =>
      d.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      d.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (d.managerName && d.managerName.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sơ đồ Cơ cấu Tổ chức
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
            <span className="text-foreground font-medium">Phòng ban & Đơn vị</span>
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-md border border-border bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "tree"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("tree")}
            >
              <FolderTree className="h-3.5 w-3.5" />
              <span>Dạng cây</span>
            </button>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setViewMode("table")}
            >
              <List className="h-3.5 w-3.5" />
              <span>Dạng bảng</span>
            </button>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo đơn vị mới</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar (asOf Date Picker & Search) ────────────────── */}
      <div className="table-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-medium text-foreground">
              Xem cơ cấu tại thời điểm (asOf):
            </span>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="h-8 rounded-md border border-border bg-white px-2.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
            />
            {asOfDate && (
              <button
                type="button"
                className="btn-outline h-8 text-xs"
                onClick={() => setAsOfDate("")}
              >
                Về hiện tại
              </button>
            )}
          </div>

          {viewMode === "table" && (
            <div className="relative w-full sm:w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Tìm phòng ban, mã, người phụ trách..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      {viewMode === "tree" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tree Structure (2 cols) */}
          <div className="lg:col-span-2 table-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Cây phả hệ đơn vị phòng ban
              </h2>
              <span className="text-xs text-muted-foreground">
                Click vào đơn vị để xem chi tiết
              </span>
            </div>
            <OrgTree
              data={MOCK_ORG_TREE}
              selectedId={selectedDept?.id}
              onSelect={(node) => setSelectedDept(node)}
            />
          </div>

          {/* Department Detail Side Panel (1 col) */}
          <div className="table-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                Thông tin đơn vị
              </h2>
              {selectedDept && (
                <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                  {selectedDept.code}
                </span>
              )}
            </div>

            {selectedDept ? (
              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Tên phòng ban/bộ phận:</p>
                  <p className="font-semibold text-foreground text-sm mt-0.5">
                    {selectedDept.name}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Người đứng đầu / Quản lý:</p>
                  <p className="font-medium text-foreground mt-0.5">
                    {selectedDept.managerName || "Chưa bổ nhiệm"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Quy mô nhân sự trực thuộc:</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {selectedDept.employeeCount || 0} nhân sự
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <p className="font-semibold text-foreground">Tác vụ đơn vị:</p>
                  <button
                    type="button"
                    className="btn-outline w-full justify-start text-xs"
                    onClick={() => setMoveModalOpen(true)}
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5 mr-2 text-primary" />
                    Điều chuyển nhánh cây (Move Department)
                  </button>

                  <button
                    type="button"
                    className="btn-outline w-full justify-start text-xs text-destructive hover:bg-red-50"
                    onClick={() => setDissolveModalOpen(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Giải thể đơn vị (Dissolve)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-muted-foreground">
                Chọn một phòng ban trên cây để xem chi tiết
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="table-card">
          <div className="table-toolbar">
            <h2 className="text-lg font-bold text-foreground">
              Danh sách phòng ban ({filteredTableDepts.length})
            </h2>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đơn vị</th>
                  <th>Tên phòng ban</th>
                  <th>Người phụ trách</th>
                  <th className="text-center">Số lượng nhân sự</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTableDepts.map((d) => (
                  <tr key={d.id} className="table-row">
                    <td className="font-mono text-xs font-semibold text-primary">
                      {d.code}
                    </td>
                    <td className="font-semibold text-foreground text-sm">
                      {d.name}
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {d.managerName || "—"}
                    </td>
                    <td className="text-center text-xs font-semibold text-foreground">
                      {d.employeeCount}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() => {
                            setSelectedDept(d);
                            setViewMode("tree");
                          }}
                          className="btn-icon-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => toast.info(`Chỉnh sửa đơn vị: ${d.name}`)}
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
              Hiển thị {filteredTableDepts.length} trên tổng số{" "}
              <span className="font-semibold text-foreground">
                {flattenedDepts.length}
              </span>{" "}
              đơn vị
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
      )}

      {/* ── Dialog Create Department ─────────────────────────────────── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-border space-y-4 animate-scaleIn">
            <h3 className="text-lg font-bold text-foreground">Tạo đơn vị phòng ban mới</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Tên phòng ban / Trung tâm *
                </label>
                <input
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="Ví dụ: Trung Tâm An Ninh Mạng"
                  className="input text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Mã đơn vị *
                </label>
                <input
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  placeholder="Ví dụ: SOC"
                  className="input font-mono text-xs uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Đơn vị cấp cha
                </label>
                <select
                  value={targetParentDept}
                  onChange={(e) => setTargetParentDept(e.target.value)}
                  className="input text-xs"
                >
                  <option value="">Chọn đơn vị quản lý trực tiếp...</option>
                  <option value="corp">Tập Đoàn CYCLOSA FSI (CORP)</option>
                  <option value="tech">Khối Công Nghệ & Chuyển Đổi Số (TECH)</option>
                  <option value="hr">Khối Quản Trị Nhân Sự (HRD)</option>
                  <option value="fin">Khối Tài Chính - Kế Toán (FIN)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setCreateModalOpen(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  toast.success(`Đã tạo thành công phòng ban: ${newDeptName}`);
                  setCreateModalOpen(false);
                }}
              >
                Xác nhận tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialog Move Department (Impact Assessment) ───────────────── */}
      <ConfirmReasonDialog
        open={moveModalOpen}
        onOpenChange={setMoveModalOpen}
        title={`Điều chuyển cơ cấu: ${selectedDept?.name}`}
        description="Thực hiện dời nhánh phòng ban và toàn bộ nhân sự trực thuộc sang cấp cha mới. Tác động phân tích sẽ áp dụng từ ngày hiệu lực."
        reasonLabel="Lý do điều chuyển cơ cấu (Bắt buộc theo ISO)"
        requiredReason={true}
        confirmText="Xác nhận điều chuyển"
        onConfirm={(reason) => {
          toast.success("Điều chuyển phòng ban thành công", {
            description: `Lý do: ${reason}`,
          });
          setMoveModalOpen(false);
        }}
      />

      {/* ── Dialog Dissolve Department ───────────────────────────────── */}
      <ConfirmReasonDialog
        open={dissolveModalOpen}
        onOpenChange={setDissolveModalOpen}
        title={`Giải thể đơn vị: ${selectedDept?.name}`}
        description={`CẢNH BÁO: Đơn vị đang có ${selectedDept?.employeeCount || 0} nhân viên. Bạn phải điều chuyển hết nhân viên trước khi giải thể.`}
        reasonLabel="Biên bản / Quyết định HĐQT số"
        requiredReason={true}
        confirmText="Xác nhận giải thể"
        variant="destructive"
        onConfirm={(reason) => {
          toast.success("Đã ghi nhận quyết định giải thể đơn vị");
          setDissolveModalOpen(false);
        }}
      />
    </div>
  );
}
