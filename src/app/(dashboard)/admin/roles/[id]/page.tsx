"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Save,
  Users,
  FileText,
  Lock,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DataScope = "NONE" | "OWN" | "TEAM" | "DEPARTMENT" | "COMPANY" | "ALL";

interface PermissionRow {
  module: string;
  resource: string;
  actions: {
    view: DataScope;
    create: boolean;
    edit: DataScope;
    delete: DataScope;
    approve?: boolean;
    export?: boolean;
  };
}

const MOCK_PERMISSIONS_MATRIX: PermissionRow[] = [
  {
    module: "Nhân sự",
    resource: "Hồ sơ nhân viên (Employee)",
    actions: { view: "DEPARTMENT", create: true, edit: "DEPARTMENT", delete: "NONE", export: true },
  },
  {
    module: "Nhân sự",
    resource: "Hợp đồng lao động (Contract)",
    actions: { view: "DEPARTMENT", create: true, edit: "DEPARTMENT", delete: "NONE", approve: true },
  },
  {
    module: "Chấm công & Ca",
    resource: "Bảng chấm công (Timesheet)",
    actions: { view: "DEPARTMENT", create: false, edit: "DEPARTMENT", delete: "NONE", approve: true },
  },
  {
    module: "Nghỉ phép",
    resource: "Đơn xin nghỉ phép (Leave Request)",
    actions: { view: "DEPARTMENT", create: true, edit: "OWN", delete: "OWN", approve: true },
  },
  {
    module: "Tiền lương",
    resource: "Bảng lương & Phiếu lương (Payroll)",
    actions: { view: "OWN", create: false, edit: "NONE", delete: "NONE", approve: false },
  },
  {
    module: "Tuyển dụng",
    resource: "Hồ sơ ứng viên & Pipeline (Recruitment)",
    actions: { view: "DEPARTMENT", create: true, edit: "DEPARTMENT", delete: "NONE", approve: true },
  },
];

export default function RoleDetailPage() {
  const [activeTab, setActiveTab] = useState<"matrix" | "documents" | "users">("matrix");
  const [permissions, setPermissions] = useState<PermissionRow[]>(MOCK_PERMISSIONS_MATRIX);
  const [isSaved, setIsSaved] = useState(false);

  const handleScopeChange = (index: number, action: "view" | "edit" | "delete", scope: DataScope) => {
    const updated = [...permissions];
    updated[index].actions[action] = scope;
    setPermissions(updated);
  };

  const handleToggle = (index: number, action: "create" | "approve" | "export") => {
    const updated = [...permissions];
    updated[index].actions[action] = !updated[index].actions[action];
    setPermissions(updated);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/admin/roles">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại danh sách vai trò
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">RBAC-04</Badge>
      </div>

      {/* ── Role Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Department Manager (Trưởng Phòng)
            </h1>
            <Badge variant="secondary" className="font-mono text-2xs">MANAGER</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Thiết lập ma trận phân quyền chi tiết theo từng chức năng, hành động và phạm vi giới hạn dữ liệu.
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90 text-white text-xs h-9" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {isSaved ? "Đã lưu ma trận!" : "Lưu cấu hình quyền"}
        </Button>
      </div>

      {/* ── Tabs Navigation ────────────────────────────────────────── */}
      <div className="flex border-b border-border gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === "matrix" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Ma trận phân quyền hệ thống
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === "documents" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Phân quyền loại tài liệu (DOC)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`pb-3 transition-colors border-b-2 ${
            activeTab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Người dùng đang giữ vai trò (28)
        </button>
      </div>

      {/* ── Tab Content: Ma trận quyền đa chiều ────────────────────── */}
      {activeTab === "matrix" && (
        <Card className="shadow-2xs border-border overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold">Ma trận Phân quyền & Phạm vi Dữ liệu</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Quy định phạm vi dữ liệu: <code>OWN</code> (Cá nhân) • <code>TEAM</code> (Nhóm) • <code>DEPARTMENT</code> (Phòng ban) • <code>COMPANY</code> (Toàn công ty) • <code>ALL</code> (Toàn tập đoàn)
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-border text-muted-foreground uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 w-1/4">Tài nguyên chức năng</th>
                  <th className="py-3 px-4 text-center">Xem (View)</th>
                  <th className="py-3 px-4 text-center">Tạo mới</th>
                  <th className="py-3 px-4 text-center">Chỉnh sửa</th>
                  <th className="py-3 px-4 text-center">Xóa</th>
                  <th className="py-3 px-4 text-center">Phê duyệt</th>
                  <th className="py-3 px-4 text-center">Xuất file</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {permissions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{row.resource}</div>
                      <div className="text-2xs text-muted-foreground">{row.module}</div>
                    </td>

                    {/* View Scope */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        className="h-7 px-2 text-2xs font-mono rounded border border-input bg-white font-medium"
                        value={row.actions.view}
                        onChange={(e) => handleScopeChange(idx, "view", e.target.value as DataScope)}
                      >
                        <option value="NONE">NONE</option>
                        <option value="OWN">OWN</option>
                        <option value="TEAM">TEAM</option>
                        <option value="DEPARTMENT">DEPARTMENT</option>
                        <option value="COMPANY">COMPANY</option>
                        <option value="ALL">ALL</option>
                      </select>
                    </td>

                    {/* Create Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={row.actions.create}
                        onChange={() => handleToggle(idx, "create")}
                        style={{ accentColor: "#DC2626" }}
                        className="h-4 w-4 rounded text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer"
                      />
                    </td>

                    {/* Edit Scope */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        className="h-7 px-2 text-2xs font-mono rounded border border-input bg-white font-medium"
                        value={row.actions.edit}
                        onChange={(e) => handleScopeChange(idx, "edit", e.target.value as DataScope)}
                      >
                        <option value="NONE">NONE</option>
                        <option value="OWN">OWN</option>
                        <option value="TEAM">TEAM</option>
                        <option value="DEPARTMENT">DEPARTMENT</option>
                        <option value="COMPANY">COMPANY</option>
                      </select>
                    </td>

                    {/* Delete Scope */}
                    <td className="py-3.5 px-4 text-center">
                      <select
                        className="h-7 px-2 text-2xs font-mono rounded border border-input bg-white font-medium"
                        value={row.actions.delete}
                        onChange={(e) => handleScopeChange(idx, "delete", e.target.value as DataScope)}
                      >
                        <option value="NONE">NONE</option>
                        <option value="OWN">OWN</option>
                        <option value="DEPARTMENT">DEPARTMENT</option>
                      </select>
                    </td>

                    {/* Approve Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      {row.actions.approve !== undefined ? (
                        <input
                          type="checkbox"
                          checked={row.actions.approve}
                          onChange={() => handleToggle(idx, "approve")}
                          style={{ accentColor: "#DC2626" }}
                          className="h-4 w-4 rounded text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer"
                        />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Export Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      {row.actions.export !== undefined ? (
                        <input
                          type="checkbox"
                          checked={row.actions.export}
                          onChange={() => handleToggle(idx, "export")}
                          style={{ accentColor: "#DC2626" }}
                          className="h-4 w-4 rounded text-primary accent-[#DC2626] focus:ring-1 focus:ring-primary cursor-pointer"
                        />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab Content: Document permissions */}
      {activeTab === "documents" && (
        <Card className="shadow-2xs border-border p-6 text-xs text-muted-foreground text-center">
          Cấu hình phân quyền xem và tải xuống theo từng danh mục loại hồ sơ (Hợp đồng, Bằng cấp, Bảng lương, Hồ sơ y tế).
        </Card>
      )}

      {/* Tab Content: Users */}
      {activeTab === "users" && (
        <Card className="shadow-2xs border-border p-6 text-xs text-muted-foreground text-center">
          Danh sách 28 nhân sự hiện đang được bổ nhiệm vai trò Quản lý phòng ban (Department Manager).
        </Card>
      )}
    </div>
  );
}
