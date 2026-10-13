"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  CheckSquare,
  Search,
  Check,
  X,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge, ConfirmReasonDialog } from "@/components/shared";
import { toast } from "sonner";

interface PendingWorkflowItem {
  id: string;
  requestType: "LEAVE" | "ADVANCE" | "RECRUITMENT" | "CONTRACT" | "TRANSFER";
  typeLabel: string;
  title: string;
  submitterName: string;
  submitterRole: string;
  initials: string;
  avatarBg: string;
  submittedAt: string;
  summary: string;
  urgency: "HIGH" | "NORMAL";
}

const INITIAL_WORKFLOWS: PendingWorkflowItem[] = [
  {
    id: "wf_01",
    requestType: "LEAVE",
    typeLabel: "Đơn nghỉ phép",
    title: "Đơn xin nghỉ phép năm 02 ngày (06/10 - 07/10)",
    submitterName: "Trần Thị Mai",
    submitterRole: "Trưởng Phòng Nhân Sự",
    initials: "TM",
    avatarBg: "bg-blue-500 text-white",
    submittedAt: "Hôm nay 09:15",
    summary: "Nghỉ việc gia đình đột xuất. Đã bàn giao công việc rà soát bảng lương cho Đỗ Hải Nam.",
    urgency: "NORMAL",
  },
  {
    id: "wf_02",
    requestType: "RECRUITMENT",
    typeLabel: "Đề xuất tuyển dụng",
    title: "Đề xuất tuyển dụng 02 Senior Frontend Engineer",
    submitterName: "Phạm Minh Tuấn",
    submitterRole: "Tech Lead Frontend",
    initials: "PT",
    avatarBg: "bg-purple-500 text-white",
    submittedAt: "Hôm qua 16:40",
    summary: "Bổ sung định biên nhân sự phục vụ dự án mở rộng Module AI Copilot & Smart Workplace Q4.",
    urgency: "HIGH",
  },
  {
    id: "wf_03",
    requestType: "ADVANCE",
    typeLabel: "Tạm ứng lương",
    title: "Đề nghị tạm ứng lương công tác phí quý 4",
    submitterName: "Đặng Minh Tân",
    submitterRole: "Junior Backend Engineer",
    initials: "MT",
    avatarBg: "bg-teal-500 text-white",
    submittedAt: "02/10/2026",
    summary: "Tạm ứng số tiền 15,000,000 ₫ chi trả khách sạn và vé máy bay triển khai dự án chi nhánh HCM.",
    urgency: "NORMAL",
  },
];

export default function PendingWorkflowsPage() {
  const [workflows, setWorkflows] = useState<PendingWorkflowItem[]>(INITIAL_WORKFLOWS);
  const [search, setSearch] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<PendingWorkflowItem | null>(null);

  const filteredWorkflows = workflows.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.submitterName.toLowerCase().includes(search.toLowerCase()) ||
      w.typeLabel.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    toast.success("Đã phê duyệt thành công yêu cầu");
  };

  const handleRejectConfirm = (reason: string) => {
    if (!selectedWorkflow) return;
    setWorkflows((prev) => prev.filter((w) => w.id !== selectedWorkflow.id));
    toast.error(`Đã từ chối yêu cầu: ${reason}`);
    setRejectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hàng đợi Phê duyệt Tập trung
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
              Quy trình & Luồng duyệt
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Hàng đợi chờ duyệt</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setWorkflows([]);
              toast.success("Đã duyệt tất cả các yêu cầu trong hàng đợi");
            }}
          >
            <Check className="h-4 w-4" />
            <span>Phê duyệt tất cả</span>
          </button>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Yêu cầu chờ bạn xử lý ({filteredWorkflows.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, người nộp, loại đơn..."
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
                <th>Loại quy trình</th>
                <th>Tiêu đề & Nội dung tóm tắt</th>
                <th>Người đề xuất</th>
                <th>Thời điểm nộp</th>
                <th className="text-center">Mức độ khẩn</th>
                <th className="text-right">Hành động phê duyệt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredWorkflows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    Không có yêu cầu nào đang chờ phê duyệt. Bạn đã hoàn thành tất cả công việc!
                  </td>
                </tr>
              ) : (
                filteredWorkflows.map((w) => (
                  <tr key={w.id} className="table-row">
                    <td>
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {w.typeLabel}
                      </span>
                    </td>
                    <td>
                      <p className="font-semibold text-foreground text-sm">
                        {w.title}
                      </p>
                      <p className="text-xs text-[#4B5563] mt-0.5 max-w-md line-clamp-1">
                        {w.summary}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${w.avatarBg} font-bold text-xs shadow-2xs`}
                        >
                          {w.initials}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-xs">
                            {w.submitterName}
                          </p>
                          <span className="text-[11px] text-muted-foreground">
                            {w.submitterRole}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs font-mono text-muted-foreground">
                      {w.submittedAt}
                    </td>
                    <td className="text-center">
                      {w.urgency === "HIGH" ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                          Khẩn cấp
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          Bình thường
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Phê duyệt nhanh"
                          onClick={() => handleApprove(w.id)}
                          className="btn-icon-sm text-accent hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Từ chối yêu cầu"
                          onClick={() => {
                            setSelectedWorkflow(w);
                            setRejectModalOpen(true);
                          }}
                          className="btn-icon-sm text-destructive hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <div>
            Hiển thị {filteredWorkflows.length} trên tổng số{" "}
            <span className="font-semibold text-foreground">{workflows.length}</span> yêu cầu
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

      {/* ── Dialog Reject Workflow ──────────────────────────────────── */}
      <ConfirmReasonDialog
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        title={`Từ chối: ${selectedWorkflow?.title}`}
        description={`Người đề xuất: ${selectedWorkflow?.submitterName} (${selectedWorkflow?.submitterRole}). Bạn cần nêu rõ lý do để người gửi điều chỉnh.`}
        reasonLabel="Lý do từ chối phê duyệt (Bắt buộc)"
        requiredReason={true}
        confirmText="Xác nhận từ chối"
        variant="destructive"
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
