"use client";

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

export default function RWD01Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const mockData = [
    {
        "id": 1,
        "code": "REC-2026-001",
        "title": "Quyết định khen thưởng - Khối Công nghệ & R&D",
        "category": "Công nghệ",
        "assignee": "Nguyễn Văn An",
        "department": "Khối Công nghệ Thông tin",
        "updatedAt": "Hôm nay, 14:30",
        "status": "ACTIVE",
        "priority": "Cao"
    },
    {
        "id": 2,
        "code": "REC-2026-002",
        "title": "Quyết định khen thưởng - Khối Khách hàng Doanh nghiệp",
        "category": "Kinh doanh",
        "assignee": "Đỗ Kim Oanh",
        "department": "Khối Kinh Doanh",
        "updatedAt": "Hôm nay, 11:15",
        "status": "PENDING_APPROVAL",
        "priority": "Trung bình"
    },
    {
        "id": 3,
        "code": "REC-2026-003",
        "title": "Quyết định khen thưởng - Ban Nhân sự & Quản trị Vận hành",
        "category": "Nhân sự",
        "assignee": "Trần Mai Phương",
        "department": "Ban Quản trị Nguồn nhân lực",
        "updatedAt": "Hôm qua, 16:45",
        "status": "APPROVED",
        "priority": "Bình thường"
    },
    {
        "id": 4,
        "code": "REC-2026-004",
        "title": "Quyết định khen thưởng - Khối Tài chính Kế toán",
        "category": "Tài chính",
        "assignee": "Phạm Minh Đức",
        "department": "Khối Tài chính Doanh nghiệp",
        "updatedAt": "02/10/2026",
        "status": "ACTIVE",
        "priority": "Cao"
    },
    {
        "id": 5,
        "code": "REC-2026-005",
        "title": "Quyết định khen thưởng - Văn phòng Ban Điều hành",
        "category": "Điều hành",
        "assignee": "Lê Hoàng Nam",
        "department": "Văn phòng Tổng Giám đốc",
        "updatedAt": "01/10/2026",
        "status": "COMPLETED",
        "priority": "Tiêu chuẩn"
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
            <span className="hover:text-foreground transition-colors">{"Khen thưởng & Kỷ luật"}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{"Quyết định khen thưởng"}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {"Quyết định khen thưởng"}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">● Đang hoạt động</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {"Lọc theo nhân viên, hình thức, khoảng ngày; cột \"đã chuyển Payroll\""}
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
