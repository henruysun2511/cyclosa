import React from "react";
import {
  LayoutDashboard,
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
  Building,
  UserCheck,
  LogOut,
  History,
  GitFork,
  Film,
  Package,
} from "lucide-react";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import type {
  PermissionCode,
  PermissionResource,
} from "@/features/authorization/types/permission.types";

export interface NavChildItem {
  title: string;
  href: string;
  badge?: string;
  permission?: PermissionCode | string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  permission?: PermissionCode | string;
  resource?: PermissionResource;
  children?: NavChildItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    label: "TỔNG QUAN & VIỆC CẦN LÀM",
    items: [
      {
        title: "Sản phẩm (Sample CRUD)",
        href: "/products",
        icon: Package,
        badge: "Mẫu",
      },
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
          { title: "Định nghĩa 24 quy trình", href: "/admin/workflow-definitions", permission: PERMISSIONS.ROLE.MANAGE },
          { title: "Thiết kế luồng duyệt", href: "/admin/workflow-definitions/new", permission: PERMISSIONS.ROLE.MANAGE },
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
          { title: "Chấm công trực tuyến", href: "/me/attendance/check-in", permission: PERMISSIONS.ATTENDANCE.CHECKIN },
          { title: "Lịch sử chấm công", href: "/me/attendance" },
          { title: "Đơn nghỉ phép", href: "/me/leave", permission: PERMISSIONS.LEAVE.APPLY },
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
        resource: "ORG",
        children: [
          { title: "Sơ đồ tổ chức", href: "/organization/departments", permission: PERMISSIONS.ORG.VIEW },
          { title: "Danh sách công ty", href: "/organization/companies", permission: PERMISSIONS.ORG.VIEW },
          { title: "Vùng miền & Chi nhánh", href: "/organization/regions-branches", permission: PERMISSIONS.ORG.MANAGE },
          { title: "Chức danh & Cấp bậc", href: "/organization/job-titles", permission: PERMISSIONS.ORG.MANAGE },
          { title: "Trung tâm chi phí", href: "/organization/cost-centers", permission: PERMISSIONS.ORG.MANAGE },
          { title: "Mô phỏng tái cơ cấu", href: "/org-simulations", permission: PERMISSIONS.ORG.SIMULATE },
        ],
      },
      {
        title: "Hồ sơ nhân viên",
        href: "/employees",
        icon: Users,
        resource: "EMPLOYEE",
        children: [
          { title: "Danh sách nhân viên", href: "/employees", permission: PERMISSIONS.EMPLOYEE.VIEW },
          { title: "Tiếp nhận nhân sự mới", href: "/employees/new", permission: PERMISSIONS.EMPLOYEE.CREATE },
          { title: "Điều chuyển nhân sự", href: "/transfers", permission: PERMISSIONS.EMPLOYEE.UPDATE },
        ],
      },
      {
        title: "Tuyển dụng & Thu hút",
        href: "/recruitment/openings",
        icon: UserCheck,
        resource: "RECRUITMENT",
        children: [
          { title: "Đề xuất tuyển dụng", href: "/recruitment/requests", permission: PERMISSIONS.RECRUITMENT.VIEW },
          { title: "Vị trí tuyển dụng", href: "/recruitment/openings", permission: PERMISSIONS.RECRUITMENT.CREATE },
          { title: "ATS Pipeline tuyển dụng", href: "/recruitment/pipeline", badge: "ATS", permission: PERMISSIONS.RECRUITMENT.MANAGE },
          { title: "Bóc tách & Đánh giá CV", href: "/recruitment/cv-parser", badge: "AI", permission: PERMISSIONS.RECRUITMENT.MANAGE },
          { title: "Danh sách ứng viên", href: "/recruitment/candidates", permission: PERMISSIONS.RECRUITMENT.VIEW },
          { title: "Hồ sơ ứng tuyển", href: "/recruitment/applications", permission: PERMISSIONS.RECRUITMENT.VIEW },
          { title: "Lịch phỏng vấn", href: "/recruitment/interviews", permission: PERMISSIONS.RECRUITMENT.MANAGE },
          { title: "Thư mời nhận việc", href: "/recruitment/offers", permission: PERMISSIONS.RECRUITMENT.MANAGE },
          { title: "Ngân hàng tài năng", href: "/recruitment/talent-pool", permission: PERMISSIONS.RECRUITMENT.VIEW },
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
        resource: "CONTRACT",
        children: [
          { title: "Danh sách hợp đồng", href: "/contracts", permission: PERMISSIONS.CONTRACT.VIEW },
          { title: "Hợp đồng sắp hết hạn", href: "/contracts/expiring", permission: PERMISSIONS.CONTRACT.VIEW },
          { title: "Mẫu hợp đồng chuẩn", href: "/contract-templates", permission: PERMISSIONS.CONTRACT.CREATE },
          { title: "Văn bản chờ ký số", href: "/me/signing", permission: PERMISSIONS.CONTRACT.SIGN },
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
        resource: "ATTENDANCE",
        children: [
          { title: "Tổng quan chấm công", href: "/attendance/overview", permission: PERMISSIONS.ATTENDANCE.VIEW },
          { title: "Nhật ký vào ra chi tiết", href: "/attendance/logs", permission: PERMISSIONS.ATTENDANCE.VIEW },
          { title: "Phân ca làm việc", href: "/attendance/shift-assignments", permission: PERMISSIONS.ATTENDANCE.MANAGE },
          { title: "Đơn giải trình công", href: "/attendance/requests" },
          { title: "Bảng tổng hợp công", href: "/attendance/timesheets", permission: PERMISSIONS.ATTENDANCE.MANAGE },
        ],
      },
      {
        title: "Nghỉ phép",
        href: "/leave/requests",
        icon: CalendarDays,
        resource: "LEAVE",
        children: [
          { title: "Danh sách đơn nghỉ phép", href: "/leave/requests", permission: PERMISSIONS.LEAVE.VIEW },
          { title: "Quản lý quỹ phép", href: "/leave/balances", permission: PERMISSIONS.LEAVE.MANAGE },
          { title: "Lịch nghỉ toàn công ty", href: "/leave/calendar", permission: PERMISSIONS.LEAVE.VIEW },
        ],
      },
      {
        title: "Tiền lương & Đãi ngộ",
        href: "/payroll/dashboard",
        icon: DollarSign,
        resource: "PAYROLL",
        children: [
          { title: "Dashboard chi phí lương", href: "/payroll/dashboard", permission: PERMISSIONS.PAYROLL.VIEW },
          { title: "Kỳ tính lương", href: "/payroll/periods", permission: PERMISSIONS.PAYROLL.PROCESS },
          { title: "Thành phần thu nhập/khấu trừ", href: "/payroll/components", permission: PERMISSIONS.PAYROLL.PROCESS },
          { title: "Quản lý tạm ứng", href: "/payroll/advances", permission: PERMISSIONS.PAYROLL.PROCESS },
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
        resource: "PERFORMANCE",
        children: [
          { title: "Chu kỳ đánh giá", href: "/performance/cycles", permission: PERMISSIONS.PERFORMANCE.VIEW },
          { title: "Phiếu đánh giá nhân viên", href: "/performance/reviews", permission: PERMISSIONS.PERFORMANCE.EVALUATE },
          { title: "Hiệu chuẩn kết quả (Bell Curve)", href: "/performance/calibration", permission: PERMISSIONS.PERFORMANCE.EVALUATE },
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
        resource: "WORKPLACE",
        children: [
          { title: "Sơ đồ chỗ ngồi 2D", href: "/workplace/map", badge: "2D", permission: PERMISSIONS.WORKPLACE.VIEW },
          { title: "Đặt bàn linh hoạt", href: "/workplace/desk-booking", permission: PERMISSIONS.WORKPLACE.VIEW },
          { title: "Bàn làm việc của tôi", href: "/workplace" },
          { title: "Quản lý sơ đồ tầng", href: "/workplace/admin/floors", permission: PERMISSIONS.WORKPLACE.MANAGE },
          { title: "Trình sửa bản đồ", href: "/workplace/admin/floors/fl_03/editor", permission: PERMISSIONS.WORKPLACE.MANAGE },
          { title: "Quản lý phòng họp", href: "/workplace/admin/room-bookings", permission: PERMISSIONS.WORKPLACE.MANAGE },
          { title: "Sự cố cơ sở vật chất", href: "/workplace/admin/issues", permission: PERMISSIONS.WORKPLACE.MANAGE },
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
        resource: "ROLE",
        children: [
          { title: "Người dùng tài khoản", href: "/admin/users", permission: PERMISSIONS.USER.VIEW },
          { title: "Vai trò & Phân quyền", href: "/roles", permission: PERMISSIONS.ROLE.VIEW },
          { title: "Định nghĩa quy trình duyệt", href: "/admin/workflow-definitions", permission: PERMISSIONS.ROLE.MANAGE },
          { title: "Cấu hình hệ thống", href: "/admin/system-configs", permission: PERMISSIONS.ROLE.MANAGE },
          { title: "Lịch nghỉ lễ", href: "/admin/holidays" },
          { title: "Danh mục kỹ năng", href: "/admin/skills" },
          { title: "Gửi thông báo toàn công ty", href: "/admin/broadcast", permission: PERMISSIONS.ROLE.MANAGE },
        ],
      },
      {
        title: "Nhật ký kiểm toán",
        href: "/audit-logs",
        icon: History,
        permission: PERMISSIONS.AUDIT.VIEW,
      },
      {
        title: "Quản lý Công ty",
        href: "/companies",
        icon: ShieldCheck,
        permission: PERMISSIONS.ROLE.MANAGE,
      },
    ],
  },
];

