"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Filter,
  Download,
  GitFork,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  ChevronRight,
  User,
  Building2,
  Calendar,
  Sparkles,
  Layers,
  FileText
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

type WorkflowGroup =
  | "ALL"
  | "CONTRACT_PERSONNEL"
  | "DAILY_OPS"
  | "PAYROLL_FINANCE"
  | "RECRUITMENT_ONBOARDING"
  | "RELATIONS_OFFBOARDING"
  | "RECORDS_ARCHIVE";

interface WorkflowStepStatus {
  stepNumber: number;
  approverRole: string;
  approverName?: string;
  status: "COMPLETED" | "CURRENT" | "WAITING";
  completedAt?: string;
}

interface WorkflowRequestItem {
  id: string;
  code: string;
  workflowCode: string;
  workflowName: string;
  category: WorkflowGroup;
  requesterName: string;
  requesterCode: string;
  department: string;
  submittedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED";
  slaRemaining: string;
  isOverdue: boolean;
  currentStepSummary: string;
  steps: WorkflowStepStatus[];
}

export default function CMN05WorkflowSearchPage() {
  const [selectedGroup, setSelectedGroup] = useState<WorkflowGroup>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [requests, setRequests] = useState<WorkflowRequestItem[]>([
    {
      id: "REQ-1001",
      code: "REQ-2026-0891",
      workflowCode: "WF-LEAVE",
      workflowName: "Đơn xin nghỉ phép thường niên",
      category: "DAILY_OPS",
      requesterName: "Nguyễn Văn An",
      requesterCode: "FSI-102",
      department: "Khối Công nghệ & Sản phẩm",
      submittedAt: "04/10/2026 09:15",
      status: "PENDING",
      slaRemaining: "Còn 8h",
      isOverdue: false,
      currentStepSummary: "Bước 1/2: Quản lý trực tiếp đang xem xét",
      steps: [
        { stepNumber: 1, approverRole: "Quản lý trực tiếp", approverName: "Trần Bảo Long", status: "CURRENT" },
        { stepNumber: 2, approverRole: "Trưởng phòng", status: "WAITING" }
      ]
    },
    {
      id: "REQ-1002",
      code: "REQ-2026-0884",
      workflowCode: "WF-TERMINATION",
      workflowName: "Chấm dứt Hợp đồng lao động",
      category: "CONTRACT_PERSONNEL",
      requesterName: "Lê Hoàng Nam",
      requesterCode: "FSI-205",
      department: "Ban Vận hành & Cơ sở",
      submittedAt: "03/10/2026 14:00",
      status: "ESCALATED",
      slaRemaining: "Quá hạn 4h (Đã leo thang)",
      isOverdue: true,
      currentStepSummary: "Bước 2/3: Chuyển tiếp khẩn cấp lên HR Director",
      steps: [
        { stepNumber: 1, approverRole: "Quản lý trực tiếp", approverName: "Vũ Đình Cường", status: "COMPLETED", completedAt: "03/10 16:30" },
        { stepNumber: 2, approverRole: "HRBP phụ trách", approverName: "Lê Minh Trang", status: "CURRENT" },
        { stepNumber: 3, approverRole: "Giám đốc Nhân sự (HRD)", status: "WAITING" }
      ]
    },
    {
      id: "REQ-1003",
      code: "REQ-2026-0879",
      workflowCode: "WF-SALARY-ADV",
      workflowName: "Đề nghị tạm ứng lương 15.000.000 VNĐ",
      category: "PAYROLL_FINANCE",
      requesterName: "Phạm Hải Đăng",
      requesterCode: "FSI-308",
      department: "Khối Công nghệ & Sản phẩm",
      submittedAt: "03/10/2026 11:30",
      status: "PENDING",
      slaRemaining: "Còn 22h",
      currentStepSummary: "Bước 2/2: Kế toán trưởng đối soát",
      isOverdue: false,
      steps: [
        { stepNumber: 1, approverRole: "Quản lý trực tiếp", approverName: "Trần Bảo Long", status: "COMPLETED", completedAt: "03/10 15:00" },
        { stepNumber: 2, approverRole: "Kế toán trưởng", approverName: "Đỗ Kim Ngân", status: "CURRENT" }
      ]
    },
    {
      id: "REQ-1004",
      code: "REQ-2026-0865",
      workflowCode: "WF-MANPOWER",
      workflowName: "Yêu cầu tuyển dụng 2 Senior Backend Golang",
      category: "RECRUITMENT_ONBOARDING",
      requesterName: "Trần Bảo Long",
      requesterCode: "FSI-101",
      department: "Khối Công nghệ & Sản phẩm",
      submittedAt: "02/10/2026 08:30",
      status: "APPROVED",
      slaRemaining: "Hoàn tất đúng hạn",
      isOverdue: false,
      currentStepSummary: "Bước 3/3: Đã được Ban Tổng Giám đốc phê duyệt",
      steps: [
        { stepNumber: 1, approverRole: "Trưởng phòng ban", approverName: "Trần Bảo Long", status: "COMPLETED", completedAt: "02/10 09:00" },
        { stepNumber: 2, approverRole: "Trưởng ban Nhân sự", approverName: "Lê Minh Trang", status: "COMPLETED", completedAt: "02/10 17:00" },
        { stepNumber: 3, approverRole: "Tổng Giám đốc (CEO)", approverName: "Nguyễn Văn Cường", status: "COMPLETED", completedAt: "03/10 10:15" }
      ]
    },
    {
      id: "REQ-1005",
      code: "REQ-2026-0861",
      workflowCode: "WF-OFFBOARDING-CLEARANCE",
      workflowName: "Biên bản bàn giao nghỉ việc",
      category: "RELATIONS_OFFBOARDING",
      requesterName: "Hoàng Yến Nhi",
      requesterCode: "FSI-194",
      department: "Ban Nhân sự & Truyền thông",
      submittedAt: "01/10/2026 16:45",
      status: "PENDING",
      slaRemaining: "Còn 12h",
      isOverdue: false,
      currentStepSummary: "Bước 2/4: Thu hồi thiết bị & tài khoản IT",
      steps: [
        { stepNumber: 1, approverRole: "Bàn giao Quản lý", approverName: "Lê Minh Trang", status: "COMPLETED", completedAt: "02/10 10:00" },
        { stepNumber: 2, approverRole: "Bộ phận IT (Thu hồi máy)", approverName: "Nguyễn Văn Tuấn", status: "CURRENT" },
        { stepNumber: 3, approverRole: "Kế toán (Công nợ)", status: "WAITING" },
        { stepNumber: 4, approverRole: "HR (Chốt bảo hiểm)", status: "WAITING" }
      ]
    }
  ]);

  const groups: { id: WorkflowGroup; label: string }[] = [
    { id: "ALL", label: "Tất cả quy trình" },
    { id: "DAILY_OPS", label: "Vận hành hàng ngày" },
    { id: "CONTRACT_PERSONNEL", label: "Hợp đồng & Nhân sự" },
    { id: "PAYROLL_FINANCE", label: "Tài chính & Lương" },
    { id: "RECRUITMENT_ONBOARDING", label: "Tuyển dụng & Onboarding" },
    { id: "RELATIONS_OFFBOARDING", label: "Nghỉ việc & Quan hệ LĐ" },
    { id: "RECORDS_ARCHIVE", label: "Lưu trữ hồ sơ" }
  ];

  const filteredRequests = requests.filter((r) => {
    const matchesGroup = selectedGroup === "ALL" || r.category === selectedGroup;
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesSearch =
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGroup && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: WorkflowRequestItem["status"], isOverdue: boolean) => {
    switch (status) {
      case "PENDING":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-300">Đang chờ duyệt</span>;
      case "ESCALATED":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-red-50 text-primary border border-red-200 animate-pulse">Quá hạn • Đã leo thang</span>;
      case "APPROVED":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-slate-900 text-white border border-slate-900">Đã phê duyệt</span>;
      case "REJECTED":
        return <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500 border border-slate-200">Bị từ chối</span>;
    }
  };

  const kpis = [
    {
      title: "Tổng yêu cầu đang chạy",
      value: "148 phiếu",
      change: "+12 tuần này",
      isPositive: true,
      subtext: "Trên 24 quy trình nghiệp vụ toàn hệ thống"
    },
    {
      title: "Chờ phê duyệt trong hạn",
      value: "134 phiếu",
      change: "Đúng tiến độ",
      isPositive: true,
      subtext: "Thời gian xử lý trung bình: 14.2 giờ"
    },
    {
      title: "Cảnh báo quá hạn SLA",
      value: "6 phiếu",
      change: "Cần can thiệp",
      isPositive: false,
      subtext: "Đã tự động leo thang tới cấp Giám đốc"
    },
    {
      title: "Tỷ lệ phê duyệt hoàn tất",
      value: "96.8%",
      change: "+2.4%",
      isPositive: true,
      subtext: "Hiệu quả định tuyến tự động không nghẽn"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="hover:text-foreground transition-colors">Quy trình & Phê duyệt</span>
            <span>/</span>
            <span className="text-foreground font-medium">Trung tâm tra cứu</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Trung tâm Tra cứu & Giám sát Quy trình Phê duyệt
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi thời gian thực tiến độ phê duyệt đa cấp của 24 quy trình nghiệp vụ. Giám sát kỷ luật thời gian SLA và cảnh báo leo thang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/workflows/pending" className="btn-outline flex items-center gap-1.5 text-xs">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>Hộp thư cần tôi duyệt (3)</span>
          </Link>
          <Link href="/admin/workflow-definitions" className="btn-primary flex items-center gap-1.5 text-xs">
            <GitFork className="h-4 w-4" />
            <span>Định nghĩa 24 quy trình</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Business Group Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border text-xs scrollbar-none">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGroup(g.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedGroup === g.id
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã phiếu, người nộp, tên quy trình..."
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-background border border-border rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ duyệt</option>
            <option value="ESCALATED">Quá hạn • Đã leo thang</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
        </div>
      </div>

      {/* Workflow Ticket Feed / Cards */}
      <div className="space-y-3.5">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            {/* Left: Request Info */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {req.code}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {req.workflowCode}
                </span>
                {getStatusBadge(req.status, req.isOverdue)}
                <span className={`text-[10px] font-mono font-medium ${req.isOverdue ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  SLA: {req.slaRemaining}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  {req.workflowName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {req.requesterName} ({req.requesterCode})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    {req.department}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Nộp: {req.submittedAt}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="pt-2">
                <p className="text-[11px] text-muted-foreground font-medium mb-1.5">
                  Tiến độ hiện tại: <strong className="text-foreground">{req.currentStepSummary}</strong>
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {req.steps.map((step, sIdx) => {
                    const isDone = step.status === "COMPLETED";
                    const isCurrent = step.status === "CURRENT";

                    return (
                      <React.Fragment key={sIdx}>
                        <div
                          className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border transition-colors ${
                            isDone
                              ? "bg-slate-900 text-white border-slate-900 font-semibold"
                              : isCurrent
                              ? "bg-primary/10 border-primary/30 text-primary font-bold ring-1 ring-primary/20"
                              : "bg-muted/40 border-border text-muted-foreground"
                          }`}
                        >
                          <span className="h-3.5 w-3.5 rounded-full flex items-center justify-center text-[9px] font-bold">
                            {isDone ? "✓" : step.stepNumber}
                          </span>
                          <span>{step.approverRole}</span>
                          {step.approverName && (
                            <span className="opacity-80">({step.approverName})</span>
                          )}
                        </div>
                        {sIdx < req.steps.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Action */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border">
              <Link
                href={`/workflows/${req.id}`}
                className="btn-primary text-xs flex items-center gap-1 py-2 px-3.5 w-full md:w-auto justify-center"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Xem chi tiết hồ sơ</span>
              </Link>
              <span className="text-[10px] text-muted-foreground">
                Định tuyến tự động qua Engine
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
