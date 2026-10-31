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
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  Eye,
  Edit3,
  Copy
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

type WorkflowCategory =
  | "ALL"
  | "CONTRACT_PERSONNEL"
  | "DAILY_OPS"
  | "PAYROLL_FINANCE"
  | "RECRUITMENT_ONBOARDING"
  | "RELATIONS_OFFBOARDING"
  | "RECORDS_ARCHIVE";

interface WorkflowStepSummary {
  order: number;
  roleName: string;
  slaHours: number;
}

interface WorkflowDefinition {
  id: string;
  code: string;
  title: string;
  category: WorkflowCategory;
  categoryLabel: string;
  version: string;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  stepCount: number;
  steps: WorkflowStepSummary[];
  slaAction: "REMIND" | "AUTO_ESCALATE" | "AUTO_REJECT";
  hasCondition: boolean;
  publishedAt: string;
  activeRequestsCount: number;
}

export default function CMN06WorkflowDefinitionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [definitions, setDefinitions] = useState<WorkflowDefinition[]>([
    // Nhóm 1: Hợp đồng & Nhân sự
    {
      id: "WF-01",
      code: "WF-TERMINATION",
      title: "Chấm dứt Hợp đồng Lao động (Termination)",
      category: "CONTRACT_PERSONNEL",
      categoryLabel: "Hợp đồng & Nhân sự",
      version: "v2.0",
      status: "PUBLISHED",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 24 },
        { order: 2, roleName: "Chuyên viên HRBP", slaHours: 24 },
        { order: 3, roleName: "Giám đốc Nhân sự (HRD)", slaHours: 48 }
      ],
      slaAction: "AUTO_ESCALATE",
      hasCondition: true,
      publishedAt: "15/08/2026",
      activeRequestsCount: 4
    },
    {
      id: "WF-02",
      code: "WF-TRANSFER",
      title: "Điều chuyển nhân sự nội bộ (Internal Transfer)",
      category: "CONTRACT_PERSONNEL",
      categoryLabel: "Hợp đồng & Nhân sự",
      version: "v1.4",
      status: "PUBLISHED",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Quản lý phòng ban hiện tại", slaHours: 24 },
        { order: 2, roleName: "Quản lý phòng ban tiếp nhận", slaHours: 24 },
        { order: 3, roleName: "Trưởng ban Nhân sự", slaHours: 24 }
      ],
      slaAction: "REMIND",
      hasCondition: false,
      publishedAt: "01/09/2026",
      activeRequestsCount: 7
    },
    {
      id: "WF-03",
      code: "WF-RESTRUCTURING",
      title: "Tái cơ cấu sơ đồ & Định biên (Restructuring)",
      category: "CONTRACT_PERSONNEL",
      categoryLabel: "Hợp đồng & Nhân sự",
      version: "v1.0",
      status: "PUBLISHED",
      stepCount: 4,
      steps: [
        { order: 1, roleName: "Trưởng khối đề xuất", slaHours: 48 },
        { order: 2, roleName: "Giám đốc Nhân sự (HRD)", slaHours: 48 },
        { order: 3, roleName: "Giám đốc Tài chính (CFO)", slaHours: 48 },
        { order: 4, roleName: "Tổng Giám đốc (CEO)", slaHours: 72 }
      ],
      slaAction: "REMIND",
      hasCondition: true,
      publishedAt: "10/07/2026",
      activeRequestsCount: 1
    },

    // Nhóm 2: Vận hành hàng ngày
    {
      id: "WF-04",
      code: "WF-LEAVE",
      title: "Đơn xin nghỉ phép (Leave Request)",
      category: "DAILY_OPS",
      categoryLabel: "Vận hành hàng ngày",
      version: "v2.2",
      status: "PUBLISHED",
      stepCount: 2,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 12 },
        { order: 2, roleName: "Trưởng đơn vị (Nếu nghỉ >3 ngày)", slaHours: 24 }
      ],
      slaAction: "AUTO_ESCALATE",
      hasCondition: true,
      publishedAt: "20/09/2026",
      activeRequestsCount: 38
    },
    {
      id: "WF-05",
      code: "WF-OVERTIME",
      title: "Đăng ký làm thêm giờ (Overtime)",
      category: "DAILY_OPS",
      categoryLabel: "Vận hành hàng ngày",
      version: "v1.8",
      status: "PUBLISHED",
      stepCount: 1,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp phụ trách ca", slaHours: 8 }
      ],
      slaAction: "AUTO_ESCALATE",
      hasCondition: false,
      publishedAt: "05/09/2026",
      activeRequestsCount: 19
    },
    {
      id: "WF-06",
      code: "WF-ATT-CORRECTION",
      title: "Giải trình & Điều chỉnh chấm công (Attendance Correction)",
      category: "DAILY_OPS",
      categoryLabel: "Vận hành hàng ngày",
      version: "v1.2",
      status: "PUBLISHED",
      stepCount: 1,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 24 }
      ],
      slaAction: "AUTO_REJECT",
      hasCondition: false,
      publishedAt: "12/08/2026",
      activeRequestsCount: 12
    },

    // Nhóm 3: Tài chính & Lương
    {
      id: "WF-07",
      code: "WF-SALARY-ADV",
      title: "Đề nghị tạm ứng lương (Salary Advance)",
      category: "PAYROLL_FINANCE",
      categoryLabel: "Tài chính & Lương",
      version: "v1.5",
      status: "PUBLISHED",
      stepCount: 2,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 24 },
        { order: 2, roleName: "Kế toán trưởng / CFO", slaHours: 48 }
      ],
      slaAction: "REMIND",
      hasCondition: true,
      publishedAt: "18/08/2026",
      activeRequestsCount: 5
    },
    {
      id: "WF-08",
      code: "WF-PAYROLL-REVIEW",
      title: "Phê duyệt bảng thanh toán lương tháng (Payroll Review)",
      category: "PAYROLL_FINANCE",
      categoryLabel: "Tài chính & Lương",
      version: "v2.0",
      status: "PUBLISHED",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Trưởng nhóm C&B", slaHours: 24 },
        { order: 2, roleName: "Kế toán trưởng", slaHours: 24 },
        { order: 3, roleName: "Tổng Giám đốc (CEO)", slaHours: 48 }
      ],
      slaAction: "REMIND",
      hasCondition: false,
      publishedAt: "28/09/2026",
      activeRequestsCount: 2
    },
    {
      id: "WF-09",
      code: "WF-EWA-LIMIT",
      title: "Ứng lương linh hoạt vượt hạn mức (Earned Wage Access)",
      category: "PAYROLL_FINANCE",
      categoryLabel: "Tài chính & Lương",
      version: "v1.0",
      status: "PUBLISHED",
      stepCount: 1,
      steps: [
        { order: 1, roleName: "Chuyên viên C&B phụ trách", slaHours: 12 }
      ],
      slaAction: "AUTO_REJECT",
      hasCondition: true,
      publishedAt: "01/09/2026",
      activeRequestsCount: 3
    },

    // Nhóm 4: Tuyển dụng & Onboarding
    {
      id: "WF-10",
      code: "WF-MANPOWER",
      title: "Yêu cầu tuyển dụng nhân sự (Manpower Request)",
      category: "RECRUITMENT_ONBOARDING",
      categoryLabel: "Tuyển dụng & Onboarding",
      version: "v2.1",
      status: "PUBLISHED",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Trưởng phòng ban yêu cầu", slaHours: 24 },
        { order: 2, roleName: "Trưởng ban Nhân sự", slaHours: 48 },
        { order: 3, roleName: "Ban Tổng Giám đốc", slaHours: 48 }
      ],
      slaAction: "AUTO_ESCALATE",
      hasCondition: true,
      publishedAt: "14/09/2026",
      activeRequestsCount: 6
    },
    {
      id: "WF-11",
      code: "WF-SPECIAL-ASSET",
      title: "Cấp phát tài sản đặc thù giá trị cao (Special Asset Allocation)",
      category: "RECRUITMENT_ONBOARDING",
      categoryLabel: "Tuyển dụng & Onboarding",
      version: "v1.1",
      status: "PUBLISHED",
      stepCount: 2,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 24 },
        { order: 2, roleName: "Trưởng phòng IT / Quản trị Cơ sở", slaHours: 24 }
      ],
      slaAction: "REMIND",
      hasCondition: true,
      publishedAt: "22/08/2026",
      activeRequestsCount: 8
    },

    // Nhóm 5: Nghỉ việc & Quan hệ lao động
    {
      id: "WF-12",
      code: "WF-RESIGNATION",
      title: "Đơn xin thôi việc tự nguyện (Resignation)",
      category: "RELATIONS_OFFBOARDING",
      categoryLabel: "Nghỉ việc & Quan hệ LĐ",
      version: "v2.0",
      status: "PUBLISHED",
      stepCount: 2,
      steps: [
        { order: 1, roleName: "Quản lý trực tiếp", slaHours: 48 },
        { order: 2, roleName: "HRBP phụ trách khối", slaHours: 48 }
      ],
      slaAction: "AUTO_ESCALATE",
      hasCondition: false,
      publishedAt: "10/09/2026",
      activeRequestsCount: 3
    },
    {
      id: "WF-13",
      code: "WF-OFFBOARDING-CLEARANCE",
      title: "Biên bản bàn giao nghỉ việc (Offboarding Clearance)",
      category: "RELATIONS_OFFBOARDING",
      categoryLabel: "Nghỉ việc & Quan hệ LĐ",
      version: "v2.0",
      status: "PUBLISHED",
      stepCount: 4,
      steps: [
        { order: 1, roleName: "Thu hồi tài sản IT", slaHours: 24 },
        { order: 2, roleName: "Đối soát công nợ Kế toán", slaHours: 24 },
        { order: 3, roleName: "Nghiệm thu bàn giao Quản lý", slaHours: 24 },
        { order: 4, roleName: "Chốt sổ & Giấy tờ HR", slaHours: 24 }
      ],
      slaAction: "REMIND",
      hasCondition: false,
      publishedAt: "15/09/2026",
      activeRequestsCount: 5
    },
    {
      id: "WF-14",
      code: "WF-GRIEVANCE",
      title: "Khiếu nại & Giải quyết kỷ luật (Grievance Review)",
      category: "RELATIONS_OFFBOARDING",
      categoryLabel: "Nghỉ việc & Quan hệ LĐ",
      version: "v1.0",
      status: "PUBLISHED",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Hội đồng Kỷ luật & Hòa giải", slaHours: 72 },
        { order: 2, roleName: "Giám đốc Nhân sự", slaHours: 48 },
        { order: 3, roleName: "Ban Tổng Giám đốc", slaHours: 48 }
      ],
      slaAction: "REMIND",
      hasCondition: true,
      publishedAt: "05/08/2026",
      activeRequestsCount: 1
    },

    // Nhóm 6: Lưu trữ & Tiêu hủy hồ sơ
    {
      id: "WF-15",
      code: "WF-ARCHIVE",
      title: "Đề xuất nộp lưu kho hồ sơ nhân sự (Archive Submission)",
      category: "RECORDS_ARCHIVE",
      categoryLabel: "Lưu trữ & Hồ sơ",
      version: "v1.0",
      status: "PUBLISHED",
      stepCount: 1,
      steps: [
        { order: 1, roleName: "Văn thư lưu trữ / Pháp chế", slaHours: 48 }
      ],
      slaAction: "REMIND",
      hasCondition: false,
      publishedAt: "20/07/2026",
      activeRequestsCount: 4
    },
    {
      id: "WF-16",
      code: "WF-DISPOSAL",
      title: "Đề xuất tiêu hủy hồ sơ hết niên hạn (Disposal Proposal)",
      category: "RECORDS_ARCHIVE",
      categoryLabel: "Lưu trữ & Hồ sơ",
      version: "v1.0",
      status: "DRAFT",
      stepCount: 3,
      steps: [
        { order: 1, roleName: "Trưởng ban Quản trị Tài liệu", slaHours: 48 },
        { order: 2, roleName: "Phòng Pháp chế & Tuân thủ", slaHours: 48 },
        { order: 3, roleName: "Tổng Giám đốc phê duyệt", slaHours: 72 }
      ],
      slaAction: "REMIND",
      hasCondition: true,
      publishedAt: "Chưa xuất bản",
      activeRequestsCount: 0
    }
  ]);

  const categoryTabs: { id: WorkflowCategory; label: string }[] = [
    { id: "ALL", label: "Tất cả quy trình" },
    { id: "CONTRACT_PERSONNEL", label: "Hợp đồng & Nhân sự" },
    { id: "DAILY_OPS", label: "Vận hành hàng ngày" },
    { id: "PAYROLL_FINANCE", label: "Tài chính & Lương" },
    { id: "RECRUITMENT_ONBOARDING", label: "Tuyển dụng & Onboarding" },
    { id: "RELATIONS_OFFBOARDING", label: "Nghỉ việc & Quan hệ LĐ" },
    { id: "RECORDS_ARCHIVE", label: "Lưu trữ & Hồ sơ" }
  ];

  const filteredDefinitions = definitions.filter((d) => {
    const matchesCategory = selectedCategory === "ALL" || d.category === selectedCategory;
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (id: string) => {
    setDefinitions((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const kpis = [
    {
      title: "Tổng số quy trình chuẩn hóa",
      value: "24 quy trình",
      change: "Toàn diện",
      isPositive: true,
      subtext: "Bao phủ 100% nghiệp vụ HRM & Vận hành"
    },
    {
      title: "Quy trình đang chạy thực tế",
      value: "22 quy trình",
      change: "Active (v2.x)",
      isPositive: true,
      subtext: "Phiên bản ổn định, tự động hóa SLA"
    },
    {
      title: "Hồ sơ đang xử lý trên Engine",
      value: "148 phiếu",
      change: "+16 hôm nay",
      isPositive: true,
      subtext: "Đang định tuyến qua các bước phê duyệt"
    },
    {
      title: "Tỷ lệ phê duyệt đúng hạn SLA",
      value: "97.4%",
      change: "+1.8%",
      isPositive: true,
      subtext: "Tự động leo thang khi quá hạn"
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
            <span className="text-foreground font-medium">Định nghĩa quy trình</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Định nghĩa 24 Quy trình Phê duyệt
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản trị vòng đời (Draft, Published, Archived), cấu hình phân cấp duyệt, điều kiện rẽ nhánh và kỷ luật SLA tự động.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/workflows" className="btn-outline flex items-center gap-1.5 text-xs">
            <Search className="h-4 w-4" />
            <span>Tra cứu hồ sơ đang chạy</span>
          </Link>
          <Link href="/admin/workflow-definitions/new" className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thiết kế quy trình mới</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border text-xs scrollbar-none">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              selectedCategory === tab.id
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
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
            placeholder="Tìm theo tên quy trình, mã WF, phòng ban..."
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
            <option value="ALL">Tất cả ({definitions.length})</option>
            <option value="PUBLISHED">Đang áp dụng (PUBLISHED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
            <option value="ARCHIVED">Lưu trữ (ARCHIVED)</option>
          </select>
        </div>
      </div>

      {/* Workflow Definitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDefinitions.map((wf) => (
          <div
            key={wf.id}
            className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Top row: Code, Version, Status */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                    {wf.code}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {wf.version}
                  </span>
                  {wf.hasCondition && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-300">
                      Rẽ nhánh điều kiện
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                    wf.status === "PUBLISHED"
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : wf.status === "DRAFT"
                      ? "bg-slate-100 text-slate-600 border-slate-300 font-medium"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {wf.status === "PUBLISHED" ? "ĐANG ÁP DỤNG" : wf.status === "DRAFT" ? "BẢN NHÁP" : "LƯU TRỮ"}
                </span>
              </div>

              {/* Title & Group */}
              <h3 className="font-bold text-foreground text-sm leading-snug">
                {wf.title}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Nhóm nghiệp vụ: <strong className="text-foreground">{wf.categoryLabel}</strong>
              </p>

              {/* Multi-step Approval Chain Preview */}
              <div className="mt-3.5 p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5 text-primary" />
                    Chuỗi phê duyệt ({wf.stepCount} cấp):
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    SLA Quá hạn: <strong className="text-foreground">{wf.slaAction}</strong>
                  </span>
                </div>

                {/* Visual Step Sequence */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {wf.steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <div className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-background border border-border">
                        <span className="h-4 w-4 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          {step.order}
                        </span>
                        <span className="font-medium text-foreground truncate max-w-[130px]">
                          {step.roleName}
                        </span>
                        <span className="text-[9.5px] font-mono text-muted-foreground">
                          ({step.slaHours}h)
                        </span>
                      </div>
                      {sIdx < wf.steps.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer: Stats & Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Đang chạy: <strong className="text-foreground">{wf.activeRequestsCount} phiếu</strong>
                </span>
                <span>•</span>
                <span className="text-[11px]">Xuất bản: {wf.publishedAt}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleStatus(wf.id)}
                  className="btn-outline p-1.5 text-xs text-slate-700 hover:text-slate-900"
                  title={wf.status === "PUBLISHED" ? "Tạm ngừng quy trình" : "Kích hoạt áp dụng"}
                >
                  {wf.status === "PUBLISHED" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>

                <Link
                  href={`/admin/workflow-definitions/new?cloneFrom=${wf.code}`}
                  className="btn-outline p-1.5 text-xs text-muted-foreground hover:text-foreground"
                  title="Nhân bản tạo phiên bản mới"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/admin/workflow-definitions/new?code=${wf.code}`}
                  className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Sửa luồng duyệt</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
