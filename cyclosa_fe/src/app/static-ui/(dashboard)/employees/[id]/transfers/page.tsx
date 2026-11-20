"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Edit,
  Download,
  FileText,
  Layers,
  History
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { ApprovalTimeline, ApprovalStepItem } from "@/components/shared/approval-timeline";

export default function TRF04Page() {
  const [activeTab, setActiveTab] = useState("overview");

  const timelineSteps: ApprovalStepItem[] = [
    {
      id: "step-1",
      stepNumber: 1,
      stepName: "Khởi tạo yêu cầu",
      approverName: "Nguyễn Văn An",
      status: "APPROVED",
      decidedAt: "02/10/2026 08:30",
      comments: "Đã hoàn thành chuẩn bị hồ sơ và nộp duyệt."
    },
    {
      id: "step-2",
      stepNumber: 2,
      stepName: "Quản lý phòng ban xem xét",
      approverName: "Trần Thị Mai (Trưởng phòng)",
      status: "APPROVED",
      decidedAt: "03/10/2026 10:15",
      comments: "Đồng ý phê duyệt, đề nghị chuyển tiếp cho khối Nhân sự."
    },
    {
      id: "step-3",
      stepNumber: 3,
      stepName: "Ban Giám đốc phê duyệt",
      approverName: "Lê Hoàng Nam (Tổng Giám Đốc)",
      status: "PENDING"
    }
  ];

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
            <span className="hover:text-foreground transition-colors">{"Điều chuyển nhân sự"}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{"Lịch sử điều chuyển của nhân viên"}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href=".." className="btn-icon" title="Quay lại danh sách">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {"Lịch sử điều chuyển của nhân viên"}
                </h1>
                <StatusBadge status="ACTIVE" />
                
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {"Dòng thời gian các lần điều chuyển"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-outline text-xs flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            <span>Xuất PDF</span>
          </button>
          <button className="btn-primary text-xs flex items-center gap-1.5">
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab("overview")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "overview" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Thông tin chi tiết
        </button>
        <button
          onClick={() => setActiveTab("approval")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "approval" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Tiến trình phê duyệt
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={"pb-3 border-b-2 transition-colors " + (activeTab === "history" ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Lịch sử thay đổi & Audit
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <FileText className="h-4 w-4 text-primary" />
                Nội dung nghiệp vụ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Mã định danh:</span>
                  <p className="font-medium text-foreground mt-0.5 font-mono">TRF-04-REC-2026</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Trạng thái thực thi:</span>
                  <p className="font-medium text-emerald-600 mt-0.5">Đã kích hoạt và áp dụng</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Người lập:</span>
                  <p className="font-medium text-foreground mt-0.5">Nguyễn Văn An (NV-00824)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Đơn vị quản lý:</span>
                  <p className="font-medium text-foreground mt-0.5">Khối Công nghệ & Vận hành</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Mô tả tóm tắt:</span>
                  <p className="font-medium text-foreground mt-0.5 leading-relaxed">
                    Hồ sơ quy định chi tiết các tham số vận hành, tiêu chuẩn nghiệm thu và cơ chế đối soát dữ liệu theo chuẩn FSI Enterprise.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Tài liệu liên quan & Hồ sơ đính kèm
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Bien-ban-nghiep-vu-chi-tiet.pdf</p>
                      <p className="text-[11px] text-muted-foreground">2.4 MB • Đã ký số điện tử</p>
                    </div>
                  </div>
                  <button className="btn-outline py-1 px-2.5 text-xs">Tải xuống</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Thông số hệ thống
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">Module:</span>
                  <span className="font-medium text-foreground">{"Điều chuyển nhân sự"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">API Backend:</span>
                  <span className="font-mono text-[10px] text-primary truncate max-w-[160px]" title={"GET /employees/{employeeId}/transfer-history"}>
                    {"GET /employees/{employeeId}/transfer-history"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Phân quyền:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{"transfer.view"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "approval" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Quy trình & Nhật ký phê duyệt
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
              <p className="font-semibold text-foreground">04/10/2026 14:20 - Hệ thống</p>
              <p className="text-muted-foreground text-[11px]">Đồng bộ dữ liệu trạng thái tự động thành công.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">03/10/2026 10:15 - Trần Thị Mai</p>
              <p className="text-muted-foreground text-[11px]">Phê duyệt bước 2 và chuyển tiếp Ban Giám đốc.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">02/10/2026 08:30 - Nguyễn Văn An</p>
              <p className="text-muted-foreground text-[11px]">Khởi tạo hồ sơ ban đầu trên hệ thống.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
