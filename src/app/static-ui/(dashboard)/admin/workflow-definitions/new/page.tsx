"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Clock,
  Shield,
  UserCheck,
  Building,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  GitFork,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Info
} from "lucide-react";

type ApproverType =
  | "DIRECT_MANAGER"
  | "ORGANIZATIONAL_UNIT_HEAD"
  | "SPECIFIC_ROLE"
  | "SPECIFIC_EMPLOYEE";

interface StepConfig {
  id: string;
  order: number;
  name: string;
  approverType: ApproverType;
  roleOrTarget: string;
  slaHours: number;
  slaAction: "REMIND" | "AUTO_ESCALATE" | "AUTO_REJECT";
  hasCondition: boolean;
  conditionField: string;
  conditionOperator: ">" | ">=" | "==" | "<";
  conditionValue: string;
}

export default function CMN07WorkflowDesignerPage() {
  const [requestType, setRequestType] = useState("WF-LEAVE");
  const [workflowTitle, setWorkflowTitle] = useState("Quy trình Phê duyệt Đơn xin nghỉ phép");
  const [version, setVersion] = useState("v2.1");
  const [description, setDescription] = useState(
    "Định tuyến phê duyệt đơn nghỉ phép tự động từ Quản lý trực tiếp đến Trưởng khối nếu số ngày nghỉ vượt quá 3 ngày."
  );

  const [steps, setSteps] = useState<StepConfig[]>([
    {
      id: "step-1",
      order: 1,
      name: "Phê duyệt Quản lý Trực tiếp",
      approverType: "DIRECT_MANAGER",
      roleOrTarget: "Quản lý trực tiếp (Manager ID)",
      slaHours: 24,
      slaAction: "AUTO_ESCALATE",
      hasCondition: false,
      conditionField: "",
      conditionOperator: ">",
      conditionValue: ""
    },
    {
      id: "step-2",
      order: 2,
      name: "Phê duyệt Trưởng Đơn vị (Nghỉ > 3 ngày)",
      approverType: "ORGANIZATIONAL_UNIT_HEAD",
      roleOrTarget: "Trưởng phòng / Trưởng khối",
      slaHours: 48,
      slaAction: "REMIND",
      hasCondition: true,
      conditionField: "Số ngày nghỉ phép (days)",
      conditionOperator: ">",
      conditionValue: "3"
    },
    {
      id: "step-3",
      order: 3,
      name: "Xác nhận & Cập nhật Quỹ phép HR",
      approverType: "SPECIFIC_ROLE",
      roleOrTarget: "Chuyên viên HRBP (Role: hr_specialist)",
      slaHours: 24,
      slaAction: "REMIND",
      hasCondition: false,
      conditionField: "",
      conditionOperator: ">",
      conditionValue: ""
    }
  ]);

  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleAddStep = () => {
    const newStepNumber = steps.length + 1;
    const newStep: StepConfig = {
      id: `step-${Date.now()}`,
      order: newStepNumber,
      name: `Bước ${newStepNumber}: Phê duyệt bổ sung`,
      approverType: "SPECIFIC_ROLE",
      roleOrTarget: "Trưởng ban Nhân sự (Role: hr_director)",
      slaHours: 24,
      slaAction: "REMIND",
      hasCondition: false,
      conditionField: "",
      conditionOperator: ">",
      conditionValue: ""
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) {
      alert("Quy trình phê duyệt phải có ít nhất 1 bước!");
      return;
    }
    const filtered = steps.filter(s => s.id !== id);
    const reordered = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(reordered);
  };

  const handleMoveStep = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    const reordered = newSteps.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(reordered);
  };

  const handlePublish = () => {
    setPublishedSuccess(true);
    setTimeout(() => {
      window.location.href = "/admin/workflow-definitions";
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <Link href="/admin/workflow-definitions" className="hover:text-foreground transition-colors">
              Quy trình & Phê duyệt
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Thiết kế luồng duyệt</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admin/workflow-definitions" className="btn-icon" title="Quay lại danh mục">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Trình thiết kế quy trình
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium font-mono">
                  {version}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Cấu hình chuỗi người duyệt tuần tự, kỷ luật thời gian SLA (giờ) và thiết lập điều kiện rẽ nhánh thông minh.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/workflow-definitions" className="btn-outline text-xs">
            Hủy bỏ
          </Link>
          <button
            onClick={() => alert("Đã lưu bản nháp (DRAFT) thành công!")}
            className="btn-outline text-xs flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Lưu bản nháp</span>
          </button>
          <button
            onClick={handlePublish}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" />
            <span>Xuất bản áp dụng (Publish)</span>
          </button>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-900 text-white flex items-center gap-3 text-xs animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-white" />
          <div>
            <h4 className="font-bold">Xuất bản quy trình thành công!</h4>
            <p className="text-[11px] mt-0.5 text-slate-300">Phiên bản {version} đã được kích hoạt chạy thật. Đang chuyển hướng...</p>
          </div>
        </div>
      )}

      {/* Workflow General Config Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          1. Thông tin quy trình nghiệp vụ gốc
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-foreground mb-1">
              Loại nghiệp vụ đi qua Workflow <span className="text-rose-500">*</span>
            </label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            >
              <optgroup label="Nhóm Vận hành hàng ngày">
                <option value="WF-LEAVE">WF-LEAVE - Đơn xin nghỉ phép</option>
                <option value="WF-OVERTIME">WF-OVERTIME - Đăng ký làm thêm giờ (OT)</option>
                <option value="WF-ATT-CORRECTION">WF-ATT-CORRECTION - Điều chỉnh chấm công</option>
              </optgroup>
              <optgroup label="Nhóm Hợp đồng & Nhân sự">
                <option value="WF-TERMINATION">WF-TERMINATION - Chấm dứt HĐLĐ</option>
                <option value="WF-TRANSFER">WF-TRANSFER - Điều chuyển nội bộ</option>
                <option value="WF-RESTRUCTURING">WF-RESTRUCTURING - Tái cơ cấu phòng ban</option>
              </optgroup>
              <optgroup label="Nhóm Tài chính & Lương">
                <option value="WF-SALARY-ADV">WF-SALARY-ADV - Tạm ứng lương</option>
                <option value="WF-PAYROLL-REVIEW">WF-PAYROLL-REVIEW - Phê duyệt bảng lương</option>
                <option value="WF-EWA-LIMIT">WF-EWA-LIMIT - Ứng lương linh hoạt vượt hạn mức</option>
              </optgroup>
              <optgroup label="Nhóm Tuyển dụng & Onboarding">
                <option value="WF-MANPOWER">WF-MANPOWER - Yêu cầu tuyển dụng mới</option>
                <option value="WF-SPECIAL-ASSET">WF-SPECIAL-ASSET - Cấp phát tài sản đặc thù</option>
              </optgroup>
              <optgroup label="Nhóm Nghỉ việc & Quan hệ LĐ">
                <option value="WF-RESIGNATION">WF-RESIGNATION - Đơn xin thôi việc</option>
                <option value="WF-OFFBOARDING-CLEARANCE">WF-OFFBOARDING-CLEARANCE - Biên bản bàn giao</option>
                <option value="WF-GRIEVANCE">WF-GRIEVANCE - Khiếu nại lao động</option>
              </optgroup>
              <optgroup label="Nhóm Lưu trữ hồ sơ">
                <option value="WF-ARCHIVE">WF-ARCHIVE - Nộp lưu kho hồ sơ</option>
                <option value="WF-DISPOSAL">WF-DISPOSAL - Đề xuất tiêu hủy tài liệu</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1">
              Tên quy trình hiển thị <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={workflowTitle}
              onChange={(e) => setWorkflowTitle(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-foreground mb-1">
              Phiên bản ban hành
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block font-medium text-foreground mb-1">
              Mô tả chính sách & Phạm vi áp dụng
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Visual Live Approval Flow Diagram */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <GitFork className="h-4 w-4 text-primary" />
            2. Trực quan hóa luồng phê duyệt tuần tự (Flow Diagram)
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {steps.length} cấp phê duyệt
          </span>
        </div>

        <div className="p-4 bg-muted/20 border border-border rounded-lg overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[700px]">
            {/* Start Node */}
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center shrink-0 w-36">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Người tạo đơn</span>
              <span className="text-xs font-semibold text-foreground mt-0.5 block">Nhân viên (ESS)</span>
              <span className="text-[9.5px] text-muted-foreground">Khởi tạo phiếu</span>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

            {/* Dynamic Step Nodes */}
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="p-3 rounded-lg bg-card border border-border shadow-xs shrink-0 w-48 relative group hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="h-4 w-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">
                      {step.order}
                    </span>
                    <span className="text-[9px] font-mono text-slate-700 font-bold px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded">
                      SLA: {step.slaHours}h
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground truncate">{step.name}</h4>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{step.roleOrTarget}</p>
                  {step.hasCondition && (
                    <span className="text-[9px] px-1 py-0.2 mt-1 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 block truncate">
                      Nếu {step.conditionField} {step.conditionOperator} {step.conditionValue}
                    </span>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </React.Fragment>
            ))}

            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

            {/* End Node */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-900 text-center shrink-0 w-36 text-white shadow-xs">
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider block">Hoàn tất</span>
              <span className="text-xs font-semibold text-white mt-0.5 block">Phê duyệt xong</span>
              <span className="text-[9.5px] text-slate-300">Cập nhật CSDL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-level Step Configuration List */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              3. Cấu hình chi tiết từng bước duyệt (Multi-level Configuration)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Thiết lập người duyệt động, thời gian cam kết dịch vụ (SLA) và điều kiện kích hoạt.
            </p>
          </div>

          <button
            onClick={handleAddStep}
            className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm bước duyệt</span>
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="p-4 rounded-xl border border-border bg-muted/15 space-y-3 relative group transition-colors hover:border-primary/30"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                    {step.order}
                  </span>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => {
                      const updated = steps.map(s => s.id === step.id ? { ...s, name: e.target.value } : s);
                      setSteps(updated);
                    }}
                    className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveStep(index, "up")}
                    disabled={index === 0}
                    className="btn-icon-sm disabled:opacity-30"
                    title="Di chuyển lên"
                  >
                    <MoveUp className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleMoveStep(index, "down")}
                    disabled={index === steps.length - 1}
                    className="btn-icon-sm disabled:opacity-30"
                    title="Di chuyển xuống"
                  >
                    <MoveDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleRemoveStep(step.id)}
                    className="btn-icon-sm text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    title="Xóa bước này"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Step Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
                {/* Approver Type */}
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Loại người duyệt (Approver Type)
                  </label>
                  <select
                    value={step.approverType}
                    onChange={(e) => {
                      const updated = steps.map(s => s.id === step.id ? { ...s, approverType: e.target.value as ApproverType } : s);
                      setSteps(updated);
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="DIRECT_MANAGER">DIRECT_MANAGER (Quản lý trực tiếp)</option>
                    <option value="ORGANIZATIONAL_UNIT_HEAD">ORGANIZATIONAL_UNIT_HEAD (Trưởng phòng/khối)</option>
                    <option value="SPECIFIC_ROLE">SPECIFIC_ROLE (Vai trò chuyên trách)</option>
                    <option value="SPECIFIC_EMPLOYEE">SPECIFIC_EMPLOYEE (Đích danh nhân sự)</option>
                  </select>
                </div>

                {/* SLA Hours */}
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Hạn mức thời gian (SLA Hours)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={168}
                      value={step.slaHours}
                      onChange={(e) => {
                        const updated = steps.map(s => s.id === step.id ? { ...s, slaHours: Number(e.target.value) } : s);
                        setSteps(updated);
                      }}
                      className="w-24 rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-muted-foreground">giờ làm việc</span>
                  </div>
                </div>

                {/* SLA Action */}
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Hành vi khi quá hạn SLA
                  </label>
                  <select
                    value={step.slaAction}
                    onChange={(e) => {
                      const updated = steps.map(s => s.id === step.id ? { ...s, slaAction: e.target.value as any } : s);
                      setSteps(updated);
                    }}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="REMIND">Gửi thông báo nhắc nhở (REMIND)</option>
                    <option value="AUTO_ESCALATE">Tự động leo thang cấp trên (AUTO_ESCALATE)</option>
                    <option value="AUTO_REJECT">Tự động từ chối đơn (AUTO_REJECT)</option>
                  </select>
                </div>
              </div>

              {/* Branch Condition Checkbox & Config */}
              <div className="pt-2 border-t border-border/60">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={step.hasCondition}
                    onChange={(e) => {
                      const updated = steps.map(s => s.id === step.id ? { ...s, hasCondition: e.target.checked } : s);
                      setSteps(updated);
                    }}
                    className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span className="font-semibold text-foreground">
                    Kích hoạt bước này có điều kiện (Condition Branching)
                  </span>
                </label>

                {step.hasCondition && (
                  <div className="mt-2 p-3 rounded-lg bg-background border border-border grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Trường dữ liệu kiểm tra:</span>
                      <input
                        type="text"
                        placeholder="Ví dụ: days, amount, position_level"
                        value={step.conditionField}
                        onChange={(e) => {
                          const updated = steps.map(s => s.id === step.id ? { ...s, conditionField: e.target.value } : s);
                          setSteps(updated);
                        }}
                        className="w-full rounded border border-input px-2.5 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Phép so sánh:</span>
                      <select
                        value={step.conditionOperator}
                        onChange={(e) => {
                          const updated = steps.map(s => s.id === step.id ? { ...s, conditionOperator: e.target.value as any } : s);
                          setSteps(updated);
                        }}
                        className="w-full rounded border border-input px-2 py-1 text-xs"
                      >
                        <option value=">">Lớn hơn (&gt;)</option>
                        <option value=">=">Lớn hơn hoặc bằng (&gt;=)</option>
                        <option value="==">Bằng chính xác (==)</option>
                        <option value="<">Nhỏ hơn (&lt;)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block mb-1">Giá trị ngưỡng:</span>
                      <input
                        type="text"
                        placeholder="Ví dụ: 3, 10000000"
                        value={step.conditionValue}
                        onChange={(e) => {
                          const updated = steps.map(s => s.id === step.id ? { ...s, conditionValue: e.target.value } : s);
                          setSteps(updated);
                        }}
                        className="w-full rounded border border-input px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
