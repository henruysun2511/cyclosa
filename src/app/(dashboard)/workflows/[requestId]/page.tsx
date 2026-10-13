"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Download,
  FileText,
  Layers,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Building2,
  Calendar,
  X,
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import { ApprovalTimeline, ApprovalStepItem } from "@/components/shared/approval-timeline";

export default function CMN04WorkflowDetailPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "approval" | "history">("overview");
  const [showActionModal, setShowActionModal] = useState<"APPROVE" | "REJECT" | "CLARIFY" | null>(null);
  const [actionComment, setActionComment] = useState("");
  const [currentDecisionStatus, setCurrentDecisionStatus] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  const [timelineSteps, setTimelineSteps] = useState<ApprovalStepItem[]>([
    {
      id: "step-1",
      stepNumber: 1,
      stepName: "Khởi tạo yêu cầu nghỉ phép",
      approverName: "Nguyễn Văn An (Nhân viên nộp)",
      status: "APPROVED",
      decidedAt: "04/10/2026 09:15",
      comments: "Nộp đơn nghỉ phép thường niên 4 ngày từ 12/10 đến 15/10/2026."
    },
    {
      id: "step-2",
      stepNumber: 2,
      stepName: "Phê duyệt Quản lý Trực tiếp",
      approverName: "Trần Bảo Long (Lead Solution Architect)",
      status: currentDecisionStatus === "PENDING" ? "PENDING" : currentDecisionStatus === "APPROVED" ? "APPROVED" : "REJECTED",
      decidedAt: currentDecisionStatus !== "PENDING" ? "05/10/2026 08:30" : undefined,
      comments: currentDecisionStatus !== "PENDING" ? actionComment : undefined
    },
    {
      id: "step-3",
      stepNumber: 3,
      stepName: "Trưởng Đơn vị xác nhận (Nghỉ > 3 ngày)",
      approverName: "Đỗ Anh Tuấn (CTO)",
      status: "PENDING"
    }
  ]);

  const handleConfirmAction = () => {
    if (!actionComment.trim()) {
      alert("Vui lòng nhập nhận xét / lý do phê duyệt!");
      return;
    }

    if (showActionModal === "APPROVE") {
      setCurrentDecisionStatus("APPROVED");
      setTimelineSteps((prev) =>
        prev.map((s) =>
          s.stepNumber === 2
            ? { ...s, status: "APPROVED", decidedAt: "Hôm nay 08:30", comments: actionComment }
            : s.stepNumber === 3
            ? { ...s, status: "PENDING" }
            : s
        )
      );
    } else if (showActionModal === "REJECT") {
      setCurrentDecisionStatus("REJECTED");
      setTimelineSteps((prev) =>
        prev.map((s) =>
          s.stepNumber === 2
            ? { ...s, status: "REJECTED", decidedAt: "Hôm nay 08:30", comments: actionComment }
            : s
        )
      );
    }

    setShowActionModal(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <Link href="/workflows" className="hover:text-foreground transition-colors">
              Quy trình & Phê duyệt
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Chi tiết phiếu yêu cầu</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/workflows" className="btn-icon" title="Quay lại danh mục">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  REQ-2026-0891: Đơn xin nghỉ phép thường niên
                </h1>
                
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    currentDecisionStatus === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : currentDecisionStatus === "REJECTED"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  }`}
                >
                  {currentDecisionStatus === "APPROVED"
                    ? "ĐÃ PHÊ DUYỆT BƯỚC 1"
                    : currentDecisionStatus === "REJECTED"
                    ? "BỊ TỪ CHỐI"
                    : "ĐANG CHỜ TÔI DUYỆT"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Người nộp: <strong>Nguyễn Văn An (FSI-102)</strong> • Nộp ngày: 04/10/2026 • Hạn chót SLA: <strong>Còn 14 giờ</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline text-xs flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Action Banner for Current Approver */}
      {currentDecisionStatus === "PENDING" && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Hồ sơ này đang chờ bạn phê duyệt (Bước 1: Quản lý trực tiếp)
              </h3>
              <p className="text-xs text-muted-foreground">
                Thời hạn giải quyết cam kết dịch vụ (SLA) còn 14 giờ. Sau thời gian này hệ thống sẽ tự động leo thang.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setShowActionModal("REJECT");
                setActionComment("");
              }}
              className="btn-outline text-xs text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10 flex items-center gap-1.5 py-1.5 px-3"
            >
              <XCircle className="h-4 w-4" />
              <span>Từ chối</span>
            </button>
            <button
              onClick={() => {
                setShowActionModal("APPROVE");
                setActionComment("Đồng ý phê duyệt, nhân sự đã bàn giao công việc đầy đủ.");
              }}
              className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 py-1.5 px-3.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Phê duyệt</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "overview" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Thông tin hồ sơ gốc
        </button>
        <button
          onClick={() => setActiveTab("approval")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "approval" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Tiến trình luồng duyệt (Timeline)
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "history" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Nhật ký kiểm toán & Audit
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Nội dung chi tiết đơn nghỉ phép
                </h2>
                <Link
                  href="/leave"
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                  <span>Xem trang nghiệp vụ gốc</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Nhân sự nộp đơn:</span>
                  <p className="font-semibold text-foreground mt-0.5">Nguyễn Văn An (FSI-102)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phòng ban / Đơn vị:</span>
                  <p className="font-semibold text-foreground mt-0.5">Khối Công nghệ & Sản phẩm</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loại hình nghỉ:</span>
                  <p className="font-semibold text-emerald-500 mt-0.5">Nghỉ phép thường niên (Annual Leave)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Thời gian nghỉ:</span>
                  <p className="font-semibold text-foreground mt-0.5">12/10/2026 ➔ 15/10/2026 (4 ngày làm việc)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Quỹ phép còn lại:</span>
                  <p className="font-semibold text-foreground mt-0.5">8.5 ngày (Đủ điều kiện khấu trừ)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nhân sự nhận bàn giao:</span>
                  <p className="font-semibold text-foreground mt-0.5">Lê Văn Hoàng (Senior Dev)</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Lý do nghỉ phép:</span>
                  <p className="p-3 rounded-lg bg-muted/20 border border-border text-foreground italic mt-1">
                    &ldquo;Giải quyết công việc gia đình và tham gia kỳ nghỉ thường niên cùng người thân.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Tài liệu đính kèm & Minh chứng
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Ke-hoach-ban-giao-cong-viec-tuan-42.pdf</p>
                      <p className="text-[11px] text-muted-foreground">1.8 MB • Đã xác nhận giữa 2 nhân sự</p>
                    </div>
                  </div>
                  <button className="btn-outline py-1 px-2.5 text-xs">Tải xuống</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info Box */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thông số quy trình Engine
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Mã quy trình:</span>
                  <span className="font-mono text-primary font-bold">WF-LEAVE (v2.2)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Loose Foreign Key:</span>
                  <span className="font-mono text-[10px] text-muted-foreground">leave_requests: 1048</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Rẽ nhánh điều kiện:</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-bold text-[10px]">
                    Nghỉ &gt; 3 ngày (Đạt ngưỡng)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Cấp duyệt tiếp theo:</span>
                  <span className="font-medium text-foreground">Trưởng Đơn vị (CTO)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Mọi hành động phê duyệt hoặc từ chối đều được ghi nhận vào nhật ký kiểm toán bất biến (Audit Trail) phục vụ đối soát.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "approval" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Chuỗi phê duyệt & Tiến độ thực thi
          </h2>
          <ApprovalTimeline steps={timelineSteps} />
        </div>
      )}

      {activeTab === "history" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Nhật ký kiểm toán (Audit Trail)
          </h2>
          <div className="space-y-3 border-l-2 border-border pl-4">
            <div>
              <p className="font-semibold text-foreground">04/10/2026 09:15 - Nguyễn Văn An</p>
              <p className="text-muted-foreground text-[11px]">Khởi tạo đơn xin nghỉ phép 4 ngày, hệ thống định tuyến sang Bước 1.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">04/10/2026 09:15 - Workflow Engine</p>
              <p className="text-muted-foreground text-[11px]">Kích hoạt bộ đếm SLA 24 giờ cho người duyệt Trần Bảo Long.</p>
            </div>
          </div>
        </div>
      )}

      {/* Approve / Reject Modal */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                {showActionModal === "APPROVE" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-rose-500" />
                )}
                <div>
                  <h3 className="font-bold text-foreground text-sm">
                    {showActionModal === "APPROVE" ? "Xác nhận Phê duyệt yêu cầu" : "Từ chối yêu cầu phê duyệt"}
                  </h3>
                  <p className="text-xs text-muted-foreground">REQ-2026-0891 • Đơn nghỉ phép</p>
                </div>
              </div>
              <button
                onClick={() => setShowActionModal(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">
                  Nhận xét / Ý kiến phê duyệt (Bắt buộc) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  placeholder={
                    showActionModal === "APPROVE"
                      ? "Nhập nhận xét phê duyệt hoặc căn cứ phê duyệt..."
                      : "Nhập rõ lý do từ chối để người tạo đơn nắm thông tin..."
                  }
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="p-3 bg-muted/30 rounded-lg text-muted-foreground text-[11px] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>
                  Quyết định của bạn sẽ được đóng dấu điện tử và thông báo ngay tức thì tới người nộp đơn.
                </span>
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-end gap-2 bg-muted/20">
              <button
                onClick={() => setShowActionModal(null)}
                className="btn-outline text-xs px-3 py-1.5"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmAction}
                className={`btn-primary text-xs px-4 py-1.5 ${
                  showActionModal === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {showActionModal === "APPROVE" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
