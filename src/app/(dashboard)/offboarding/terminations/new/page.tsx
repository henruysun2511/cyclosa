"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Save,
  Send,
  FileText,
  UploadCloud,
  CheckCircle2,
  Info
} from "lucide-react";

export default function OFF05Page() {
  const [formData, setFormData] = useState({
    code: "OFF-05-2026",
    title: "",
    category: "",
    department: "",
    effectiveDate: "2026-10-04",
    notes: "",
    priority: "MEDIUM"
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="hover:text-foreground transition-colors">{"Thủ tục thôi việc"}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{"Lập & chi tiết quyết định"}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href=".." className="btn-icon" title="Quay lại">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {"Lập & chi tiết quyết định"}
                
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Thông tin chi tiết, tiến trình phê duyệt đa cấp và nhật ký luân chuyển hồ sơ.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href=".." className="btn-outline text-xs">
            Hủy bỏ
          </Link>
          <button onClick={handleSubmit} className="btn-primary text-xs flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            <span>Lưu dữ liệu</span>
          </button>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Thông tin đã được ghi nhận và lưu trữ thành công trên hệ thống.</span>
        </div>
      )}

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <FileText className="h-4 w-4 text-primary" />
              Thông tin cấu hình chính
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Mã tham chiếu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  readOnly
                  className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-xs text-muted-foreground font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Mức độ ưu tiên
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="LOW">Thấp (Low)</option>
                  <option value="MEDIUM">Trung bình (Medium)</option>
                  <option value="HIGH">Cao (High)</option>
                  <option value="URGENT">Khẩn cấp (Urgent)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1">
                  Tiêu đề / Tên hạng mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề hoặc mô tả ngắn gọn..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Đơn vị / Phòng ban áp dụng
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Chọn đơn vị --</option>
                  <option value="TECH">Khối Công nghệ Thông tin</option>
                  <option value="HR">Ban Nhân sự & Vận hành</option>
                  <option value="FINANCE">Khối Tài chính Kế toán</option>
                  <option value="BIZ">Ban Kinh doanh Toàn quốc</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Ngày bắt đầu hiệu lực
                </label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-foreground mb-1">
                  Ghi chú chi tiết / Mô tả nghiệp vụ
                </label>
                <textarea
                  rows={4}
                  placeholder="Nhập các điều khoản, ghi chú hoặc hướng dẫn thực hiện..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Attachment Box */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-primary" />
              Tài liệu đính kèm & Minh chứng
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-xs font-medium text-foreground">Kéo thả tệp tin hoặc bấm để tải lên</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Hỗ trợ PDF, DOCX, XLSX, PNG dung lượng tối đa 25MB</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar (1 col) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Thông tin quy trình
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Module:</span>
                <span className="font-medium text-foreground">{"Thủ tục thôi việc"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Mã màn hình:</span>
                <span className="font-mono text-primary font-medium">OFF-05</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Phân quyền:</span>
                <span className="font-mono text-[11px] text-muted-foreground">{"offboarding.view / offboarding.terminate"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Trạng thái tạo:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600">
                  DRAFT
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Sau khi bấm Lưu, dữ liệu sẽ được chuyển vào quy trình kiểm tra và phê duyệt theo cấu hình chuẩn của hệ thống.
              </p>
            </div>

            <div className="pt-2">
              <button onClick={handleSubmit} className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Gửi phê duyệt ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
