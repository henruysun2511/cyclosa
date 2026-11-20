"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ShieldAlert,
  Search,
  Download,
  Calendar,
  Eye,
  Clock,
  User,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AuditSideBySideDiff, DiffFieldChange } from "@/components/shared";
import { toast } from "sonner";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  initials: string;
  avatarBg: string;
  action: "UPDATE" | "CREATE" | "DELETE" | "SECURITY_ALERT" | "EXPORT";
  entityName: string;
  recordIdentifier: string;
  ipAddress: string;
  diffs?: DiffFieldChange[];
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud_01",
    timestamp: "04/10/2026 17:45:12",
    actorName: "Trần Thị Mai",
    actorEmail: "mai.tran@cyclosa.vn",
    initials: "TM",
    avatarBg: "bg-blue-500 text-white",
    action: "UPDATE",
    entityName: "EMPLOYEE_CONTRACT",
    recordIdentifier: "HĐLĐ-2025/312 (Đặng Minh Tân)",
    ipAddress: "14.161.22.45",
    diffs: [
      { fieldName: "salary", fieldLabel: "Mức lương cơ bản (Gross)", oldValue: "15,000,000 ₫", newValue: "16,000,000 ₫" },
      { fieldName: "jobTitle", fieldLabel: "Chức danh công việc", oldValue: "Thực tập sinh", newValue: "Junior Backend Engineer" },
    ],
  },
  {
    id: "aud_02",
    timestamp: "04/10/2026 15:20:05",
    actorName: "Nguyễn Văn An",
    actorEmail: "an.nguyen@cyclosa.vn",
    initials: "NA",
    avatarBg: "bg-red-500 text-white",
    action: "UPDATE",
    entityName: "ORGANIZATION_STRUCTURE",
    recordIdentifier: "TECH_AI (Trung Tâm Nghiên Cứu AI)",
    ipAddress: "118.70.12.189",
    diffs: [
      { fieldName: "parentId", fieldLabel: "Đơn vị cấp cha trực thuộc", oldValue: "Khối Công Nghệ (TECH)", newValue: "Ban Tổng Giám Đốc (BOD)" },
    ],
  },
  {
    id: "aud_03",
    timestamp: "04/10/2026 11:05:40",
    actorName: "Hoàng Thảo Linh",
    actorEmail: "linh.hoang@cyclosa.vn",
    initials: "TL",
    avatarBg: "bg-amber-500 text-white",
    action: "EXPORT",
    entityName: "PAYROLL_SHEET",
    recordIdentifier: "PAY-2026-09 (Kỳ lương Tháng 9/2026)",
    ipAddress: "14.161.22.45",
  },
  {
    id: "aud_04",
    timestamp: "04/10/2026 09:30:18",
    actorName: "Hệ thống Tự động (System Daemon)",
    actorEmail: "system@cyclosa.vn",
    initials: "SYS",
    avatarBg: "bg-slate-700 text-white",
    action: "SECURITY_ALERT",
    entityName: "AUTH_ATTEMPT",
    recordIdentifier: "Tài khoản admin.temp@cyclosa.vn đăng nhập sai 5 lần",
    ipAddress: "45.118.135.21",
  },
];

export default function SystemAuditLogsPage() {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [diffModalOpen, setDiffModalOpen] = useState(false);

  const filteredLogs = logs.filter(
    (l) =>
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.recordIdentifier.toLowerCase().includes(search.toLowerCase()) ||
      l.entityName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nhật ký Hoạt động & Kiểm toán
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
              Hệ thống & Bảo mật
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Kiểm toán dữ liệu (AUD-01)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-outline"
            onClick={() => toast.info("Đang kết xuất nhật ký kiểm toán theo chuẩn ISO/IEC 27001...")}
          >
            <Download className="h-4 w-4" />
            <span>Xuất file kiểm toán</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Nhật ký tác động dữ liệu hệ thống
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo người thao tác, đối tượng, IP..."
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
                <th>Thời điểm</th>
                <th>Người thực hiện</th>
                <th className="text-center">Hành động</th>
                <th>Đối tượng tác động</th>
                <th>Chi tiết bản ghi</th>
                <th className="text-center">Địa chỉ IP</th>
                <th className="text-right">So sánh thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="table-row">
                  <td className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {l.timestamp}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${l.avatarBg} font-bold text-[10px] shadow-2xs`}
                      >
                        {l.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-xs">
                          {l.actorName}
                        </p>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {l.actorEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        l.action === "UPDATE"
                          ? "bg-blue-100 text-blue-700"
                          : l.action === "CREATE"
                          ? "bg-green-100 text-green-700"
                          : l.action === "SECURITY_ALERT"
                          ? "bg-red-100 text-destructive animate-pulse"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="font-mono text-xs font-semibold text-primary">
                    {l.entityName}
                  </td>
                  <td className="text-xs text-[#4B5563] max-w-xs truncate">
                    {l.recordIdentifier}
                  </td>
                  <td className="text-center font-mono text-xs text-muted-foreground">
                    {l.ipAddress}
                  </td>
                  <td className="text-right">
                    {l.diffs && l.diffs.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEntry(l);
                          setDiffModalOpen(true);
                        }}
                        className="btn-outline h-7 text-xs inline-flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>Xem Diff ({l.diffs.length})</span>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredLogs.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{logs.length}</span> sự kiện kiểm toán
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

      {/* ── Dialog Side-by-Side Diff ─────────────────────────────────── */}
      {diffModalOpen && selectedEntry && selectedEntry.diffs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-border space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Chi tiết Thay đổi Dữ liệu Trước & Sau (Audit Diff)
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {selectedEntry.recordIdentifier} • {selectedEntry.timestamp}
                </p>
              </div>
            </div>

            <AuditSideBySideDiff changes={selectedEntry.diffs} />

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setDiffModalOpen(false)}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
