"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Laptop,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Eye,
  Check,
  UserCheck,
  Calendar,
  X,
  FileCheck2,
  Sparkles
} from "lucide-react";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

interface OnboardingTask {
  id: string;
  title: string;
  category: "IT" | "HR" | "TRAINING" | "WORK";
  isCompleted: boolean;
  isRequired: boolean;
}

interface OnboardingProcess {
  id: string;
  code: string;
  employeeName: string;
  employeeCode: string;
  avatar: string;
  role: string;
  department: string;
  startDate: string;
  probationEndDate: string;
  mentor: string;
  status: "PREPARING" | "IN_PROGRESS" | "REVIEW_PENDING" | "COMPLETED";
  completedTasks: number;
  totalTasks: number;
  currentPhase: "Giai đoạn 1: Chuẩn bị" | "Giai đoạn 2: Tuần đầu tiên" | "Giai đoạn 3: Tháng 1" | "Giai đoạn 4: Đánh giá thử việc";
  tasks: OnboardingTask[];
}

export default function ONB03ProcessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null);

  const [processes, setProcesses] = useState<OnboardingProcess[]>([
    {
      id: "PROC-01",
      code: "ONB-2026-081",
      employeeName: "Hoàng Minh Trí",
      employeeCode: "FSI-401",
      avatar: "MT",
      role: "Senior Fullstack Engineer",
      department: "Khối Công nghệ & Sản phẩm",
      startDate: "15/09/2026",
      probationEndDate: "15/11/2026",
      mentor: "Trần Bảo Long (Lead)",
      status: "IN_PROGRESS",
      completedTasks: 9,
      totalTasks: 12,
      currentPhase: "Giai đoạn 3: Tháng 1",
      tasks: [
        { id: "T1", title: "Cấp phát Macbook Pro M3 & Tài khoản Github Enterprise", category: "IT", isCompleted: true, isRequired: true },
        { id: "T2", title: "Ký kết Hợp đồng Thử việc điện tử & Khai báo BHXH", category: "HR", isCompleted: true, isRequired: true },
        { id: "T3", title: "Tham gia Buổi đào tạo Văn hóa & Giá trị cốt lõi công ty", category: "TRAINING", isCompleted: true, isRequired: true },
        { id: "T4", title: "Thiết lập môi trường Dev & Local Docker Compose", category: "WORK", isCompleted: true, isRequired: true },
        { id: "T5", title: "Hoàn thành Task kiểm thử đầu tiên trên môi trường Staging", category: "WORK", isCompleted: true, isRequired: true },
        { id: "T6", title: "Buổi Check-in 30 ngày cùng Quản lý trực tiếp", category: "HR", isCompleted: false, isRequired: true },
        { id: "T7", title: "Báo cáo nghiệm thu thử việc 60 ngày", category: "HR", isCompleted: false, isRequired: true }
      ]
    },
    {
      id: "PROC-02",
      code: "ONB-2026-084",
      employeeName: "Phạm Thảo Vy",
      employeeCode: "FSI-405",
      avatar: "TV",
      role: "UI/UX Product Designer",
      department: "Khối Phát triển Giải pháp",
      startDate: "01/10/2026",
      probationEndDate: "01/12/2026",
      mentor: "Đặng Mỹ Linh (Design Lead)",
      status: "IN_PROGRESS",
      completedTasks: 4,
      totalTasks: 10,
      currentPhase: "Giai đoạn 2: Tuần đầu tiên",
      tasks: [
        { id: "T1", title: "Cấp phát tài khoản Figma Enterprise & Slack", category: "IT", isCompleted: true, isRequired: true },
        { id: "T2", title: "Tham gia Orientation đào tạo nhập môn", category: "TRAINING", isCompleted: true, isRequired: true },
        { id: "T3", title: "Gặp mặt Buddy và giới thiệu phòng ban", category: "HR", isCompleted: true, isRequired: true },
        { id: "T4", title: "Làm quen với Design System v2.0 của Cyclosa", category: "WORK", isCompleted: true, isRequired: false },
        { id: "T5", title: "Thiết kế mini-flow cải tiến chức năng Calendar", category: "WORK", isCompleted: false, isRequired: true }
      ]
    },
    {
      id: "PROC-03",
      code: "ONB-2026-079",
      employeeName: "Ngô Quang Hải",
      employeeCode: "FSI-398",
      avatar: "QH",
      role: "DevOps & Cloud Engineer",
      department: "Ban Vận hành & Hạ tầng",
      startDate: "01/08/2026",
      probationEndDate: "01/10/2026",
      mentor: "Vũ Đình Cường",
      status: "REVIEW_PENDING",
      completedTasks: 12,
      totalTasks: 12,
      currentPhase: "Giai đoạn 4: Đánh giá thử việc",
      tasks: [
        { id: "T1", title: "Cấp quyền truy cập AWS & Vault", category: "IT", isCompleted: true, isRequired: true },
        { id: "T2", title: "Đạt chứng chỉ nội bộ về An toàn bảo mật", category: "TRAINING", isCompleted: true, isRequired: true },
        { id: "T3", title: "Triển khai cụm CI/CD pipeline tự động", category: "WORK", isCompleted: true, isRequired: true },
        { id: "T4", title: "Báo cáo kết quả 2 tháng thử việc", category: "HR", isCompleted: true, isRequired: true }
      ]
    },
    {
      id: "PROC-04",
      code: "ONB-2026-088",
      employeeName: "Lê Ngọc Hân",
      employeeCode: "FSI-412",
      avatar: "NH",
      role: "Talent Acquisition Specialist",
      department: "Ban Nhân sự & Tổ chức",
      startDate: "10/10/2026",
      probationEndDate: "10/12/2026",
      mentor: "Phạm Thúy Hằng",
      status: "PREPARING",
      completedTasks: 2,
      totalTasks: 10,
      currentPhase: "Giai đoạn 1: Chuẩn bị",
      tasks: [
        { id: "T1", title: "Chuẩn bị bàn làm việc & Thẻ nhân viên", category: "HR", isCompleted: true, isRequired: true },
        { id: "T2", title: "Yêu cầu cấp phát Laptop Lenovo ThinkPad", category: "IT", isCompleted: true, isRequired: true },
        { id: "T3", title: "Gửi Welcome Email & Tài liệu hướng dẫn ngày 1", category: "HR", isCompleted: false, isRequired: true }
      ]
    }
  ]);

  const filteredProcesses = processes.filter(p => {
    const matchesSearch =
      p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OnboardingProcess["status"]) => {
    switch (status) {
      case "PREPARING":
        return <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/30">Chuẩn bị gia nhập</span>;
      case "IN_PROGRESS":
        return <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30">Đang thử việc</span>;
      case "REVIEW_PENDING":
        return <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">Chờ nghiệm thu</span>;
      case "COMPLETED":
        return <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">Chính thức</span>;
    }
  };

  const handleToggleTask = (processId: string, taskId: string) => {
    setProcesses(prev =>
      prev.map(p => {
        if (p.id === processId) {
          const updatedTasks = p.tasks.map(t =>
            t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
          );
          const completedCount = updatedTasks.filter(t => t.isCompleted).length;
          return {
            ...p,
            tasks: updatedTasks,
            completedTasks: completedCount
          };
        }
        return p;
      })
    );

    if (selectedProcess && selectedProcess.id === processId) {
      setSelectedProcess(prev => {
        if (!prev) return null;
        const updatedTasks = prev.tasks.map(t =>
          t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
        );
        return {
          ...prev,
          tasks: updatedTasks,
          completedTasks: updatedTasks.filter(t => t.isCompleted).length
        };
      });
    }
  };

  const kpis = [
    {
      title: "Nhân sự mới đang hội nhập",
      value: "16 nhân sự",
      change: "+4 tháng này",
      isPositive: true,
      subtext: "100% đã được phân công Mentor / Buddy"
    },
    {
      title: "Tiến độ hoàn thành trung bình",
      value: "74.8%",
      change: "+6.2%",
      isPositive: true,
      subtext: "Thời gian hòa nhập nhanh hơn 12 ngày"
    },
    {
      title: "Chờ nghiệm thu ký HĐ chính thức",
      value: "3 hồ sơ",
      change: "Cần đánh giá",
      isPositive: false,
      subtext: "Hạn nghiệm thu trong 5 ngày tới"
    },
    {
      title: "Độ hài lòng trải nghiệm Onboarding",
      value: "96.4%",
      change: "Rất tốt",
      isPositive: true,
      subtext: "Khảo sát tự động sau 30 ngày"
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
            <span className="hover:text-foreground transition-colors">Hội nhập & Đào tạo</span>
            <span>/</span>
            <span className="text-foreground font-medium">Tiến trình hội nhập</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Hành trình hội nhập nhân viên mới
            
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Theo dõi hành trình từ lúc tiếp nhận đến khi hoàn tất thử việc 60 ngày. Tự động hóa cấp tài khoản, đào tạo và nghiệm thu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/onboarding/templates" className="btn-outline flex items-center gap-1.5 text-xs">
            <BookOpen className="h-4 w-4" />
            <span>Mẫu Checklist</span>
          </Link>
          <Link href="/onboarding/processes/new" className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Khởi tạo tiến trình mới</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards metrics={kpis} />

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên nhân sự mới, mã NV, chức vụ..."
            className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "PREPARING", label: "Chuẩn bị (Day 1)" },
            { id: "IN_PROGRESS", label: "Đang thử việc" },
            { id: "REVIEW_PENDING", label: "Chờ nghiệm thu" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Onboarding Roadmap Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProcesses.map((proc) => {
          const progressPercent = Math.round((proc.completedTasks / proc.totalTasks) * 100);

          return (
            <div
              key={proc.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header: User Info & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {proc.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      {proc.employeeName}
                      <span className="text-[10px] font-mono text-muted-foreground font-normal">
                        ({proc.employeeCode})
                      </span>
                    </h3>
                    <p className="text-xs text-primary font-medium">{proc.role}</p>
                    <p className="text-[11px] text-muted-foreground">{proc.department}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(proc.status)}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {proc.code}
                  </span>
                </div>
              </div>

              {/* Milestone Stage Pill */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Chặng hiện tại:</span>
                    <span className="font-semibold text-foreground">{proc.currentPhase}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-[11px] block">Người hướng dẫn (Buddy):</span>
                  <span className="font-medium text-foreground">{proc.mentor}</span>
                </div>
              </div>

              {/* Progress Bar & Task Count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                    Hạng mục hoàn thành:
                  </span>
                  <span className="font-mono font-bold text-foreground">
                    {proc.completedTasks}/{proc.totalTasks} ({progressPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      progressPercent === 100
                        ? "bg-emerald-500"
                        : progressPercent >= 60
                        ? "bg-primary"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Key Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Ngày gia nhập: <strong className="text-foreground">{proc.startDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Hết hạn thử việc: <strong className="text-foreground">{proc.probationEndDate}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProcess(proc)}
                  className="btn-outline text-xs flex items-center gap-1.5 py-1.5 px-3"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>Xem Checklist nhiệm vụ</span>
                </button>

                {proc.status === "REVIEW_PENDING" ? (
                  <button
                    onClick={() => alert(`Nghiệm thu thử việc thành công cho ${proc.employeeName}! Chuyển sang hợp đồng chính thức.`)}
                    className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Nghiệm thu thử việc</span>
                  </button>
                ) : (
                  <Link
                    href={`/onboarding/processes/${proc.id}`}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Quản lý tiến trình</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Checklist Modal */}
      {selectedProcess && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-primary" />
                  Checklist Hội Nhập
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedProcess.employeeName} ({selectedProcess.employeeCode}) • {selectedProcess.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedProcess(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg text-xs">
                <span>Tiến độ hoàn thành:</span>
                <span className="font-bold text-primary font-mono">
                  {selectedProcess.completedTasks}/{selectedProcess.totalTasks} nhiệm vụ
                </span>
              </div>

              <div className="space-y-2">
                {selectedProcess.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(selectedProcess.id, task.id)}
                    className={`p-3 rounded-lg border flex items-start gap-3 transition-colors cursor-pointer select-none ${
                      task.isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-card border-border hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        task.isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-muted-foreground/40 bg-background"
                      }`}
                    >
                      {task.isCompleted && <Check className="h-3.5 w-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.title}
                        </span>
                        {task.isRequired && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold shrink-0">
                            Bắt buộc
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Nhóm: {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20 text-xs">
              <span className="text-muted-foreground text-[11px]">
                Nhấn vào nhiệm vụ để đánh dấu hoàn thành nhanh
              </span>
              <button
                onClick={() => setSelectedProcess(null)}
                className="btn-primary text-xs px-4 py-1.5"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
