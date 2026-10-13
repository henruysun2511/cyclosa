"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  User,
  Users,
  Building2,
  FolderKanban,
  FileText,
  Clock,
  CalendarDays,
  DollarSign,
  Award,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Sparkles,
  Settings,
  ShieldCheck,
  ChevronDown,
  Building,
  UserCheck,
  LogOut,
  History,
  GitFork,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpiderIcon } from "@/components/shared";

export interface AdminSidebarProps {
  collapsed?: boolean;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

interface NavGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    children?: { title: string; href: string; badge?: string }[];
  }[];
}

export function AdminSidebar({
  collapsed = false,
  onSelectItem,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Expanded group states
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ess: true,
    org: false,
    rec: false,
    time: false,
    payroll: false,
    perf: false,
    workplace: false,
    admin: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      label: "TỔNG QUAN & VIỆC CẦN LÀM",
      items: [
        {
          title: "Trang chủ",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Quy trình & Phê duyệt",
          href: "/workflows",
          icon: GitFork,
          badge: "24",
          children: [
            { title: "Hộp thư chờ tôi duyệt", href: "/workflows/pending" },
            { title: "Yêu cầu tôi đã gửi", href: "/workflows/submitted" },
            { title: "Tra cứu hồ sơ quy trình", href: "/workflows" },
            { title: "Định nghĩa 24 quy trình", href: "/admin/workflow-definitions" },
            { title: "Thiết kế luồng duyệt", href: "/admin/workflow-definitions/new" },
          ],
        },
        {
          title: "Thông báo",
          href: "/notifications",
          icon: Bell,
        },
        {
          title: "Trợ lý AI",
          href: "/ai/chat",
          icon: Sparkles,
          badge: "AI",
        },
        {
          title: "Minh họa Hoạt hình",
          href: "/animation",
          icon: Film,
          badge: "NEW",
        },
      ],
    },
    {
      label: "CÁ NHÂN (ESS)",
      items: [
        {
          title: "Không gian của tôi",
          href: "/me/profile",
          icon: User,
          children: [
            { title: "Hồ sơ của tôi", href: "/me/profile" },
            { title: "Khuôn mặt Face ID", href: "/me/face-enrollment" },
            { title: "Chấm công trực tuyến", href: "/me/attendance/check-in" },
            { title: "Lịch sử chấm công", href: "/me/attendance" },
            { title: "Đơn nghỉ phép", href: "/me/leave" },
            { title: "Phiếu lương điện tử", href: "/me/payslips" },
            { title: "Đánh giá hiệu suất", href: "/me/performance" },
            { title: "Lộ trình nghề nghiệp", href: "/me/career" },
            { title: "Hợp đồng của tôi", href: "/me/contracts" },
            { title: "Văn bản chờ tôi ký", href: "/me/signing" },
            { title: "Đặt bàn & Phòng họp", href: "/me/workplace" },
            { title: "Tài sản đang giữ", href: "/me/assets" },
          ],
        },
      ],
    },
    {
      label: "QUẢN TRỊ NHÂN SỰ",
      items: [
        {
          title: "Tổ chức & Phòng ban",
          href: "/organization/departments",
          icon: Building2,
          children: [
            { title: "Sơ đồ tổ chức", href: "/organization/departments" },
            { title: "Danh sách công ty", href: "/organization/companies" },
            { title: "Vùng miền & Chi nhánh", href: "/organization/regions-branches" },
            { title: "Chức danh & Cấp bậc", href: "/organization/job-titles" },
            { title: "Trung tâm chi phí", href: "/organization/cost-centers" },
            { title: "Mô phỏng tái cơ cấu", href: "/org-simulations" },
          ],
        },
        {
          title: "Hồ sơ nhân viên",
          href: "/employees",
          icon: Users,
          children: [
            { title: "Danh sách nhân viên", href: "/employees" },
            { title: "Tiếp nhận nhân sự mới", href: "/employees/new" },
            { title: "Điều chuyển nhân sự", href: "/transfers" },
          ],
        },
        {
          title: "Tuyển dụng & Thu hút",
          href: "/recruitment/openings",
          icon: UserCheck,
          children: [
            { title: "Đề xuất tuyển dụng", href: "/recruitment/requests" },
            { title: "Vị trí tuyển dụng", href: "/recruitment/openings" },
            { title: "ATS Pipeline tuyển dụng", href: "/recruitment/pipeline", badge: "ATS" },
            { title: "Bóc tách & Đánh giá CV", href: "/recruitment/cv-parser", badge: "AI" },
            { title: "Danh sách ứng viên", href: "/recruitment/candidates" },
            { title: "Hồ sơ ứng tuyển", href: "/recruitment/applications" },
            { title: "Lịch phỏng vấn", href: "/recruitment/interviews" },
            { title: "Thư mời nhận việc", href: "/recruitment/offers" },
            { title: "Ngân hàng tài năng", href: "/recruitment/talent-pool" },
            { title: "Cơ hội nội bộ", href: "/marketplace" },
          ],
        },
        {
          title: "Hội nhập & Thôi việc",
          href: "/onboarding/plans",
          icon: LogOut,
          children: [
            { title: "Kế hoạch hội nhập", href: "/onboarding/plans" },
            { title: "Mẫu kế hoạch hội nhập", href: "/onboarding/templates" },
            { title: "Đơn xin thôi việc", href: "/offboarding/resignations" },
            { title: "Quy trình thôi việc", href: "/offboarding" },
            { title: "Phỏng vấn nghỉ việc", href: "/offboarding/exit-interviews" },
          ],
        },
      ],
    },
    {
      label: "HỒ SƠ, HỢP ĐỒNG & PHÁP CHẾ",
      items: [
        {
          title: "Số hóa hồ sơ",
          href: "/records/documents",
          icon: FolderKanban,
          children: [
            { title: "Kho tài liệu tập trung", href: "/records/documents" },
            { title: "Tải lên & Quét OCR", href: "/records/upload" },
            { title: "Hồ sơ sắp hết hạn", href: "/records/expiring" },
            { title: "Hàng đợi OCR bóc tách", href: "/documents/ocr-queue" },
            { title: "Đối soát hồ sơ OCR", href: "/documents/ocr-verify" },
            { title: "Chính sách lưu trữ", href: "/records/config/retention-policies" },
          ],
        },
        {
          title: "Hợp đồng lao động",
          href: "/contracts",
          icon: FileText,
          children: [
            { title: "Danh sách hợp đồng", href: "/contracts" },
            { title: "Hợp đồng sắp hết hạn", href: "/contracts/expiring" },
            { title: "Mẫu hợp đồng chuẩn", href: "/contract-templates" },
            { title: "Văn bản chờ ký số", href: "/me/signing" },
          ],
        },
        {
          title: "Pháp chế & Tuân thủ",
          href: "/compliance/dashboard",
          icon: ShieldAlert,
          children: [
            { title: "Dashboard tuân thủ", href: "/compliance/dashboard" },
            { title: "Văn bản pháp luật", href: "/compliance/legal-documents" },
            { title: "Quy tắc kiểm tra", href: "/compliance/rules" },
            { title: "Cảnh báo vi phạm", href: "/compliance/alerts" },
          ],
        },
      ],
    },
    {
      label: "CÔNG, PHÉP & BẢNG LƯƠNG",
      items: [
        {
          title: "Chấm công & Ca",
          href: "/attendance/overview",
          icon: Clock,
          children: [
            { title: "Tổng quan chấm công", href: "/attendance/overview" },
            { title: "Nhật ký vào ra chi tiết", href: "/attendance/logs" },
            { title: "Phân ca làm việc", href: "/attendance/shift-assignments" },
            { title: "Đơn giải trình công", href: "/attendance/requests" },
            { title: "Bảng tổng hợp công", href: "/attendance/timesheets" },
          ],
        },
        {
          title: "Nghỉ phép",
          href: "/leave/requests",
          icon: CalendarDays,
          children: [
            { title: "Danh sách đơn nghỉ phép", href: "/leave/requests" },
            { title: "Quản lý quỹ phép", href: "/leave/balances" },
            { title: "Lịch nghỉ toàn công ty", href: "/leave/calendar" },
          ],
        },
        {
          title: "Tiền lương & Đãi ngộ",
          href: "/payroll/dashboard",
          icon: DollarSign,
          children: [
            { title: "Dashboard chi phí lương", href: "/payroll/dashboard" },
            { title: "Kỳ tính lương", href: "/payroll/periods" },
            { title: "Thành phần thu nhập/khấu trừ", href: "/payroll/components" },
            { title: "Quản lý tạm ứng", href: "/payroll/advances" },
          ],
        },
      ],
    },
    {
      label: "HIỆU SUẤT & PHÁT TRIỂN",
      items: [
        {
          title: "Hiệu suất & KPI",
          href: "/performance/cycles",
          icon: Award,
          children: [
            { title: "Chu kỳ đánh giá", href: "/performance/cycles" },
            { title: "Phiếu đánh giá nhân viên", href: "/performance/reviews" },
            { title: "Hiệu chuẩn kết quả (Bell Curve)", href: "/performance/calibration" },
          ],
        },
        {
          title: "Phát triển & Kế nhiệm",
          href: "/career/skills-matrix",
          icon: TrendingUp,
          children: [
            { title: "Ma trận kỹ năng", href: "/career/skills-matrix" },
            { title: "Lộ trình thăng tiến", href: "/career/paths" },
            { title: "Kế hoạch kế nhiệm (9-Box)", href: "/career/succession/9-box" },
          ],
        },
        {
          title: "Khen thưởng & Kỷ luật",
          href: "/rewards",
          icon: Award,
          children: [
            { title: "Khen thưởng vinh danh", href: "/rewards" },
            { title: "Kỷ luật lao động", href: "/discipline" },
            { title: "Giải quyết khiếu nại", href: "/complaints" },
          ],
        },
      ],
    },
    {
      label: "VĂN PHÒNG & TÀI SẢN",
      items: [
        {
          title: "Smart Workplace",
          href: "/workplace/dashboard",
          icon: MapPin,
          children: [
            { title: "Sơ đồ chỗ ngồi 2D", href: "/workplace/map", badge: "2D" },
            { title: "Đặt bàn linh hoạt", href: "/workplace/desk-booking" },
            { title: "Bàn làm việc của tôi", href: "/workplace" },
            { title: "Quản lý sơ đồ tầng", href: "/workplace/admin/floors" },
            { title: "Trình sửa bản đồ", href: "/workplace/admin/floors/fl_03/editor" },
            { title: "Quản lý phòng họp", href: "/workplace/admin/room-bookings" },
            { title: "Sự cố cơ sở vật chất", href: "/workplace/admin/issues" },
          ],
        },
        {
          title: "Tài sản doanh nghiệp",
          href: "/assets",
          icon: Building,
          children: [
            { title: "Danh sách tài sản", href: "/assets" },
            { title: "Loại tài sản", href: "/assets/categories" },
          ],
        },
      ],
    },
    {
      label: "HỆ THỐNG & BẢO MẬT",
      items: [
        {
          title: "Quản trị hệ thống",
          href: "/admin/users",
          icon: Settings,
          children: [
            { title: "Người dùng tài khoản", href: "/admin/users" },
            { title: "Vai trò & Phân quyền", href: "/admin/roles" },
            { title: "Định nghĩa quy trình duyệt", href: "/admin/workflow-definitions" },
            { title: "Cấu hình hệ thống", href: "/admin/system-configs" },
            { title: "Lịch nghỉ lễ", href: "/admin/holidays" },
            { title: "Danh mục kỹ năng", href: "/admin/skills" },
            { title: "Gửi thông báo toàn công ty", href: "/admin/broadcast" },
          ],
        },
        {
          title: "Nhật ký kiểm toán",
          href: "/audit-logs",
          icon: History,
        },
        {
          title: "Quản lý Công ty",
          href: "/companies",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-white transition-all duration-300 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* ── Brand Logo Header ────────────────────────────────────────── */}
      <div className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-white">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline hover:no-underline select-none">
          <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <SpiderIcon className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground font-sans">
              Cyclo<span className="text-primary font-bold">sa</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Navigation Menu Scrollable ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                {group.label}
              </div>
            )}

            <nav className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const sectionKey = `${groupIdx}_${itemIdx}`;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = expandedSections[sectionKey] ?? false;
                const isDirectActive = pathname === item.href;
                const isChildActive = item.children?.some((c) => pathname?.startsWith(c.href));

                if (hasChildren) {
                  return (
                    <div key={item.title}>
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionKey)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer select-none no-underline hover:no-underline",
                          isChildActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Icon className={cn("h-4 w-4 shrink-0", isChildActive ? "text-primary" : "text-slate-500")} />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                              isExpanded && "rotate-180"
                            )}
                          />
                        )}
                      </button>

                      {!collapsed && isExpanded && (
                        <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-0.5 py-0.5">
                          {item.children!.map((child) => {
                            const active = pathname === child.href;
                            return (
                              <Link
                                key={child.title}
                                href={child.href}
                                onClick={() => onSelectItem?.(child.title)}
                                className={cn(
                                  "flex items-center justify-between py-1.5 px-2.5 rounded-md text-[12.5px] transition-colors select-none no-underline hover:no-underline",
                                  active
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                                )}
                              >
                                <span className="truncate">{child.title}</span>
                                {child.badge && (
                                  <span
                                    className={cn(
                                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                      active ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                    )}
                                  >
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => onSelectItem?.(item.title)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors select-none no-underline hover:no-underline",
                      isDirectActive
                        ? "bg-primary text-white font-medium shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Icon className={cn("h-4 w-4 shrink-0", isDirectActive ? "text-white" : "text-slate-500")} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          isDirectActive ? "bg-white text-primary" : "bg-primary/10 text-primary"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export const Sidebar = AdminSidebar;
export const DashboardSidebar = AdminSidebar;
