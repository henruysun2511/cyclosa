const fs = require('fs');
const path = require('path');

// 1. Read ba/page-list.md
const mdContent = fs.readFileSync(path.join(__dirname, '../../ba/page-list.md'), 'utf8');
const lines = mdContent.split('\n');

const screens = [];
for (const line of lines) {
  const parts = line.split('|').map(p => p.trim());
  if (parts.length >= 7 && /^[A-Z]+-\d+[a-z]?$/.test(parts[1])) {
    const id = parts[1];
    let rawRoute = parts[2].replace(/`/g, '');
    const titleAndType = parts[3].replace(/`/g, '');
    const desc = parts[4].replace(/`/g, '');
    const api = parts[5].replace(/`/g, '');
    const permission = parts[6].replace(/`/g, '');
    screens.push({ id, rawRoute, titleAndType, desc, api, permission });
  }
}

console.log('Total screens parsed from page-list.md:', screens.length);

// 2. Identify missing routes
const targetPages = [];

for (const s of screens) {
  const typeMatch = s.titleAndType.match(/\(([^)]+)\)/);
  const pageType = typeMatch ? typeMatch[1].trim().toUpperCase() : 'LIST';
  const pageTitle = s.titleAndType.replace(/\([^)]+\)/, '').trim();

  // Extract all valid URL paths
  const matches = [...s.rawRoute.matchAll(/(\/[a-zA-Z0-9_\-\:\/]+)/g)].map(m => m[1].replace(/\/+$/, ''));
  const subRoutes = matches.length > 0 ? matches : [s.rawRoute];
  
  for (const r of subRoutes) {
    let cleanRoute = r.split('?')[0].trim().replace(/^\//, '');
    let appPath = cleanRoute.replace(/:([a-zA-Z0-9_]+)/g, '[$1]');
    
    // Check if exists in any app directory and is NOT an auto-generated template
    const candidates = [
      path.join(__dirname, '../src/app', appPath, 'page.tsx'),
      path.join(__dirname, '../src/app/(dashboard)', appPath, 'page.tsx'),
      path.join(__dirname, '../src/app/(auth)', appPath, 'page.tsx')
    ];

    let found = false;
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        const content = fs.readFileSync(c, 'utf8');
        // If it's a hand-crafted screen, keep it
        if (!content.includes('Mục chuẩn 01') && !content.includes('Mã tham chiếu') && !content.includes('Nội dung nghiệp vụ') && !content.includes('Khối Công nghệ & Vận hành')) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      const isPublic = s.permission.toLowerCase().includes('public') || s.id.startsWith('AUTH');
      let targetFile = '';
      if (isPublic && !appPath.startsWith('careers')) {
        targetFile = path.join(__dirname, '../src/app/(auth)', appPath, 'page.tsx');
      } else if (appPath.startsWith('careers')) {
        targetFile = path.join(__dirname, '../src/app', appPath, 'page.tsx');
      } else {
        targetFile = path.join(__dirname, '../src/app/(dashboard)', appPath, 'page.tsx');
      }

      targetPages.push({
        id: s.id,
        route: cleanRoute,
        appPath,
        targetFile,
        pageTitle,
        pageType,
        desc: s.desc,
        api: s.api,
        permission: s.permission
      });
    }
  }
}

console.log('Total routes needing page.tsx generation/regeneration:', targetPages.length);

const moduleNames = {
  AUTH: 'Xác thực',
  CMN: 'Hệ thống dùng chung',
  ORG: 'Cơ cấu tổ chức',
  SIM: 'Mô phỏng tổ chức',
  RBAC: 'Phân quyền & Tài khoản',
  REC: 'Tuyển dụng & Ứng viên',
  EMP: 'Nhân sự & Hồ sơ',
  ONB: 'Hội nhập & Đào tạo',
  DOC: 'Số hóa & Tài liệu',
  CON: 'Hợp đồng lao động',
  ATT: 'Chấm công & Điểm danh',
  LEA: 'Nghỉ phép & Nghỉ lễ',
  PAY: 'Lương & Đãi ngộ',
  PERF: 'Đánh giá & Hiệu suất',
  RWD: 'Khen thưởng & Kỷ luật',
  CAR: 'Phát triển nghề nghiệp',
  TRF: 'Điều chuyển nhân sự',
  OFF: 'Thủ tục thôi việc',
  LEG: 'Tuân thủ & Pháp chế',
  AI: 'Trợ lý AI CYCLOSA',
  WP: 'Không gian làm việc (Workplace)',
  NTF: 'Thông báo & Tương tác',
  AUD: 'Nhật ký kiểm toán (Audit)'
};

function generatePageContent(p) {
  const moduleCode = p.id.split('-')[0];
  const moduleName = moduleNames[moduleCode] || 'Hệ thống';
  const isForm = p.pageType.includes('FORM') || p.pageType.includes('WIZARD') || p.route.endsWith('/new') || p.route.endsWith('/edit');
  const isDetail = (p.pageType.includes('DETAIL') || p.appPath.includes('[')) && !isForm;
  const isBoard = p.pageType.includes('BOARD') || p.route.includes('pipeline');
  const isCalendar = p.pageType.includes('CALENDAR') || p.route.includes('calendar');

  if (isForm) {
    return generateFormPage(p, moduleName);
  } else if (isBoard) {
    return generateBoardPage(p, moduleName);
  } else if (isCalendar) {
    return generateCalendarPage(p, moduleName);
  } else if (isDetail) {
    return generateDetailPage(p, moduleName);
  } else {
    return generateListPage(p, moduleName);
  }
}

function generateListPage(p, moduleName) {
  const titleStr = JSON.stringify(p.pageTitle);
  const moduleStr = JSON.stringify(moduleName);
  const descStr = JSON.stringify(p.desc);

  return `"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { KpiMetricCards } from "@/components/shared/kpi-metric-cards";

export default function ${sanitizeName(p.id)}Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const mockData = [
    {
      id: 1,
      code: "${p.id}-001",
      title: ${titleStr} + " - Mục chuẩn 01",
      category: ${moduleStr},
      assignee: "Nguyễn Văn An",
      department: "Khối Công nghệ Thông tin",
      updatedAt: "04/10/2026 14:30",
      status: "ACTIVE",
      priority: "Cao"
    },
    {
      id: 2,
      code: "${p.id}-002",
      title: ${titleStr} + " - Hồ sơ kiểm tra 02",
      category: ${moduleStr},
      assignee: "Trần Thị Mai",
      department: "Ban Nhân sự & Vận hành",
      updatedAt: "04/10/2026 11:15",
      status: "PENDING_APPROVAL",
      priority: "Trung bình"
    },
    {
      id: 3,
      code: "${p.id}-003",
      title: ${titleStr} + " - Bản ghi đối soát 03",
      category: ${moduleStr},
      assignee: "Lê Hoàng Nam",
      department: "Khối Tài chính Kế toán",
      updatedAt: "03/10/2026 16:45",
      status: "APPROVED",
      priority: "Bình thường"
    },
    {
      id: 4,
      code: "${p.id}-004",
      title: ${titleStr} + " - Đợt rà soát định kỳ 04",
      category: ${moduleStr},
      assignee: "Phạm Minh Đức",
      department: "Phòng Pháp chế & Tuân thủ",
      updatedAt: "02/10/2026 09:20",
      status: "ACTIVE",
      priority: "Cao"
    },
    {
      id: 5,
      code: "${p.id}-005",
      title: ${titleStr} + " - Tài liệu lưu trữ 05",
      category: ${moduleStr},
      assignee: "Vũ Thanh Trúc",
      department: "Văn phòng Tổng Giám đốc",
      updatedAt: "01/10/2026 17:00",
      status: "COMPLETED",
      priority: "Thấp"
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(mockData.map((d) => d.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="hover:text-foreground transition-colors">{${moduleStr}}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{${titleStr}}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {${titleStr}}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              ${p.id}
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {${descStr}}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="btn-outline flex items-center gap-1.5 text-xs">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiMetricCards />

      {/* Main Table Card */}
      <div className="table-card">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo mã, tiêu đề, phòng ban..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button className="filter-btn active">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <span>Tất cả</span>
              </button>
              <button className="filter-btn">
                <span>Hoạt động</span>
              </button>
              <button className="filter-btn">
                <span>Chờ duyệt</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-icon" title="Làm mới dữ liệu">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Table Sub Toolbar */}
        <div className="table-sub-toolbar">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Hiển thị:</span>
              <select className="bg-transparent border border-border rounded px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="10">10 dòng</option>
                <option value="25">25 dòng</option>
                <option value="50">50 dòng</option>
              </select>
            </div>
            {selectedRows.length > 0 && (
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
                Đã chọn {selectedRows.length} mục
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            Tổng cộng 5 kết quả tìm kiếm
          </span>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === mockData.length}
                    onChange={handleSelectAll}
                    aria-label="Chọn tất cả"
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                </th>
                <th>Mã</th>
                <th>
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    <span>Tiêu đề / Đối tượng</span>
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </th>
                <th>Phân loại</th>
                <th>Người phụ trách</th>
                <th>Đơn vị</th>
                <th>Cập nhật</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      aria-label={"Chọn mục " + row.code}
                      className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                  </td>
                  <td className="font-mono text-xs text-muted-foreground font-medium">
                    {row.code}
                  </td>
                  <td>
                    <div className="font-medium text-foreground">{row.title}</div>
                    <div className="text-[11px] text-muted-foreground">Độ ưu tiên: {row.priority}</div>
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-foreground">
                      {row.category}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {row.assignee.slice(-1)}
                      </div>
                      <span className="text-xs text-foreground font-medium">{row.assignee}</span>
                    </div>
                  </td>
                  <td className="text-xs text-muted-foreground">{row.department}</td>
                  <td className="text-xs text-muted-foreground">{row.updatedAt}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn-icon-sm" title="Xem chi tiết">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="btn-icon-sm" title="Chỉnh sửa">
                        <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button className="btn-icon-sm" title="Xóa bản ghi">
                        <Trash2 className="h-3.5 w-3.5 text-rose-500 hover:text-rose-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="table-pagination">
          <span className="text-xs text-muted-foreground">
            Hiển thị 1 đến 5 trong tổng số 5 bản ghi
          </span>
          <div className="flex items-center gap-1">
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1 disabled:opacity-50" disabled>
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </button>
            <button className="btn-primary py-1 px-2.5 text-xs">1</button>
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1 disabled:opacity-50" disabled>
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
}

function generateFormPage(p, moduleName) {
  const titleStr = JSON.stringify(p.pageTitle);
  const moduleStr = JSON.stringify(moduleName);
  const descStr = JSON.stringify(p.desc);
  const permStr = JSON.stringify(p.permission);

  return `"use client";

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

export default function ${sanitizeName(p.id)}Page() {
  const [formData, setFormData] = useState({
    code: "${p.id}-2026",
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
            <span className="hover:text-foreground transition-colors">{${moduleStr}}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{${titleStr}}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href=".." className="btn-icon" title="Quay lại">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {${titleStr}}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  ${p.id}
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {${descStr}}
              </p>
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
                <span className="font-medium text-foreground">{${moduleStr}}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Mã màn hình:</span>
                <span className="font-mono text-primary font-medium">${p.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Phân quyền:</span>
                <span className="font-mono text-[11px] text-muted-foreground">{${permStr}}</span>
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
`;
}

function generateDetailPage(p, moduleName) {
  const titleStr = JSON.stringify(p.pageTitle);
  const moduleStr = JSON.stringify(moduleName);
  const descStr = JSON.stringify(p.desc);
  const apiStr = JSON.stringify(p.api.split(',')[0]);
  const permStr = JSON.stringify(p.permission);

  return `"use client";

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

export default function ${sanitizeName(p.id)}Page() {
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
      approverName: "Lê Hoàng Nam (Phó TGĐ)",
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
            <span className="hover:text-foreground transition-colors">{${moduleStr}}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{${titleStr}}</span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href=".." className="btn-icon" title="Quay lại danh sách">
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {${titleStr}}
                </h1>
                <StatusBadge status="ACTIVE" />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-medium">
                  ${p.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {${descStr}}
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
                  <p className="font-medium text-foreground mt-0.5 font-mono">${p.id}-REC-2026</p>
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
                  <span className="font-medium text-foreground">{${moduleStr}}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">API Backend:</span>
                  <span className="font-mono text-[10px] text-primary truncate max-w-[160px]" title={${JSON.stringify(p.api)}}>
                    {${apiStr}}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Phân quyền:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{${permStr}}</span>
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
`;
}

function generateBoardPage(p, moduleName) {
  const titleStr = JSON.stringify(p.pageTitle);
  const moduleStr = JSON.stringify(moduleName);
  const descStr = JSON.stringify(p.desc);

  return `"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  MoreVertical
} from "lucide-react";

export default function ${sanitizeName(p.id)}Page() {
  const columns = [
    { id: "APPLIED", name: "Mới ứng tuyển", count: 12, color: "bg-blue-500" },
    { id: "SCREENING", name: "Sơ loại CV", count: 8, color: "bg-amber-500" },
    { id: "INTERVIEW", name: "Phỏng vấn", count: 5, color: "bg-purple-500" },
    { id: "OFFER", name: "Gửi Offer", count: 3, color: "bg-emerald-500" },
    { id: "HIRED", name: "Đã tuyển dụng", count: 2, color: "bg-primary" }
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
            <span className="hover:text-foreground transition-colors">{${moduleStr}}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{${titleStr}}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {${titleStr}}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              ${p.id}
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {${descStr}}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="rounded-xl border border-border bg-card p-3 shadow-sm min-w-[240px] flex flex-col h-[700px]">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className={"h-2.5 w-2.5 rounded-full " + col.color} />
                <h3 className="text-xs font-semibold text-foreground">{col.name}</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                {col.count}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 space-y-3">
              {[1, 2, 3].slice(0, col.count > 2 ? 3 : col.count).map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border bg-background p-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{"APP-00" + item + col.id.slice(0, 2)}</span>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground">Ứng viên Nguyễn Thành Đạt {item}</h4>
                  <p className="text-[11px] text-muted-foreground">Senior Frontend Engineer</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
                    <span>Kinh nghiệm: 4 năm</span>
                    <span className="text-primary font-medium">Đánh giá: 4.8/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
}

function generateCalendarPage(p, moduleName) {
  const titleStr = JSON.stringify(p.pageTitle);
  const moduleStr = JSON.stringify(moduleName);
  const descStr = JSON.stringify(p.desc);

  return `"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function ${sanitizeName(p.id)}Page() {
  const [currentMonth] = useState("Tháng 10, 2026");

  const holidays = [
    { date: "01/01/2026", title: "Tết Dương Lịch", type: "Nghỉ lễ toàn quốc" },
    { date: "15/02/2026", title: "Tết Nguyên Đán Bính Ngọ", type: "Nghỉ lễ truyền thống" },
    { date: "30/04/2026", title: "Ngày Giải phóng miền Nam", type: "Nghỉ lễ toàn quốc" },
    { date: "01/05/2026", title: "Ngày Quốc tế Lao động", type: "Nghỉ lễ toàn quốc" },
    { date: "02/09/2026", title: "Ngày Quốc khánh", type: "Nghỉ lễ toàn quốc" }
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
            <span className="hover:text-foreground transition-colors">{${moduleStr}}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{${titleStr}}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {${titleStr}}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              ${p.id}
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {${descStr}}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus className="h-4 w-4" />
            <span>Thêm sự kiện / ngày lễ</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">{currentMonth}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Tháng trước</span>
            </button>
            <button className="btn-outline py-1 px-2.5 text-xs">Hiện tại</button>
            <button className="btn-outline py-1 px-2 text-xs flex items-center gap-1">
              <span>Tháng sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Representation */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="py-2 font-semibold text-muted-foreground bg-muted/30 rounded">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <div
              key={date}
              className={"min-h-[70px] p-2 border border-border rounded-lg text-left flex flex-col justify-between transition-colors " + (date === 4 ? "bg-primary/5 border-primary font-bold text-primary" : "bg-card hover:bg-muted/30")}
            >
              <span className="text-xs">{date}</span>
              {date === 4 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-normal">
                  Hôm nay
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Holidays / Events Table */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Danh mục ngày nghỉ & Lịch sự kiện định kỳ</h3>
        <div className="divide-y divide-border text-xs">
          {holidays.map((h, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{h.title}</p>
                <p className="text-[11px] text-muted-foreground">{h.type}</p>
              </div>
              <span className="font-mono px-2.5 py-1 rounded bg-muted text-foreground font-medium">
                {h.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
}

function sanitizeName(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

// Execute generation
let generatedCount = 0;
for (const p of targetPages) {
  const dir = path.dirname(p.targetFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = generatePageContent(p);
  fs.writeFileSync(p.targetFile, content, 'utf8');
  generatedCount++;
}

console.log('Successfully generated/regenerated ' + generatedCount + ' pages.');
