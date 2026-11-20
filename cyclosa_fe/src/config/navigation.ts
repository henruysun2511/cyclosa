import React from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Package,
  Users,
  Settings,
  Building2,
  Layers,
  UserCheck,
  FileText,
  CheckSquare,
  GitFork,
  Bell,
  History,
  Briefcase,
  Kanban,
  Calendar,
  Award,
  Sparkles,
  UserPlus,
  Clock,
  Banknote,
  ShieldAlert,
  MessageSquareWarning,
  UserMinus,
  ArrowLeftRight,
  GitBranch,
  Compass,
  SlidersHorizontal,
  Archive,
  FolderArchive,
  Flame,
  BookOpen,
  HelpCircle,
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

/**
 * Danh sách menu điều hướng thực tế của hệ thống CYCLOSA.
 * Tái cấu trúc theo Phương án A (Chuẩn Vòng đời nhân sự & Khối chuyên môn HRM/ERP).
 */
export const navigationConfig: NavGroup[] = [
  {
    label: "BẢNG ĐIỀU KHIỂN & PHÂN TÍCH",
    items: [
      {
        title: "Tổng quan điều hành",
        href: "/dashboard/overview",
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD.EXECUTIVE,
        resource: "DASHBOARD",
      },
      {
        title: "Nhân sự & Hợp đồng",
        href: "/dashboard/personnel",
        icon: Users,
        permission: PERMISSIONS.DASHBOARD.PERSONNEL,
        resource: "DASHBOARD",
      },
      {
        title: "Chấm công & Ca kíp",
        href: "/dashboard/attendance",
        icon: Clock,
        permission: PERMISSIONS.DASHBOARD.ATTENDANCE,
        resource: "DASHBOARD",
      },
      {
        title: "Tuyển dụng & Hội nhập",
        href: "/dashboard/recruitment",
        icon: UserPlus,
        permission: PERMISSIONS.DASHBOARD.RECRUITMENT,
        resource: "DASHBOARD",
      },
      {
        title: "Hiệu suất & Đánh giá",
        href: "/dashboard/performance",
        icon: Award,
        permission: PERMISSIONS.DASHBOARD.PERFORMANCE,
        resource: "DASHBOARD",
      },
      {
        title: "Không gian & Tài sản",
        href: "/dashboard/workplace",
        icon: Building2,
        permission: PERMISSIONS.DASHBOARD.WORKPLACE,
        resource: "DASHBOARD",
      },
    ],
  },
  {
    label: "CƠ CẤU TỔ CHỨC",
    items: [
      {
        title: "Sơ đồ tổ chức & Phòng ban",
        href: "/organization",
        icon: Building2,
        permission: PERMISSIONS.ORG.VIEW,
        resource: "ORG",
      },
      {
        title: "Danh mục tổ chức",
        href: "/organization/catalogs",
        icon: Layers,
        permission: PERMISSIONS.ORG.VIEW,
        resource: "ORG",
      },
      {
        title: "Tái cơ cấu tổ chức",
        href: "/org-restructuring/scenarios",
        icon: SlidersHorizontal,
        permission: "org_restructure.view",
        resource: "ORG" as any,
      },
    ],
  },
  {
    label: "QUẢN TRỊ NHÂN SỰ",
    items: [
      {
        title: "Hồ sơ nhân viên",
        href: "/employees",
        icon: UserCheck,
        permission: PERMISSIONS.EMPLOYEE.VIEW,
        resource: "EMPLOYEE",
      },
      {
        title: "Hợp đồng lao động",
        href: "/contracts",
        icon: FileText,
        permission: PERMISSIONS.CONTRACT.VIEW,
        resource: "CONTRACT",
        children: [
          {
            title: "Danh sách hợp đồng",
            href: "/contracts",
            permission: PERMISSIONS.CONTRACT.VIEW,
          },
          {
            title: "Biểu mẫu hợp đồng",
            href: "/contracts/templates",
            permission: PERMISSIONS.CONTRACT.TEMPLATE,
          },
        ],
      },
      {
        title: "Hội nhập nhân sự",
        href: "/onboarding/processes",
        icon: UserPlus,
        permission: PERMISSIONS.ONBOARDING.VIEW,
        resource: "ONBOARDING",
        children: [
          {
            title: "Tiến trình hội nhập",
            href: "/onboarding/processes",
            permission: PERMISSIONS.ONBOARDING.VIEW,
          },
          {
            title: "Mẫu checklist",
            href: "/onboarding/templates",
            permission: PERMISSIONS.ONBOARDING.VIEW,
          },
          {
            title: "Đào tạo định hướng",
            href: "/onboarding/orientation-sessions",
            permission: PERMISSIONS.ONBOARDING.VIEW,
          },
          {
            title: "Cấp tài khoản IT",
            href: "/onboarding/it-requests",
            permission: PERMISSIONS.ONBOARDING.IT_HANDLE,
          },
          {
            title: "Loại tài khoản CNTT",
            href: "/onboarding/it-account-types",
            permission: PERMISSIONS.ONBOARDING.MANAGE,
          },
        ],
      },
      {
        title: "Điều chuyển nhân sự",
        href: "/transfers",
        icon: ArrowLeftRight,
        permission: "transfer.view",
      },
      {
        title: "Quản lý tài sản",
        href: "/assets",
        icon: Package,
        permission: "asset.view",
      },
      {
        title: "Thôi việc & Bàn giao",
        href: "/offboarding",
        icon: UserMinus,
        permission: "offboarding.view",
      },
    ],
  },
  {
    label: "CHẤM CÔNG & TIỀN LƯƠNG",
    items: [
      {
        title: "Quản lý nghỉ phép",
        href: "/leave/requests",
        icon: Calendar,
        permission: PERMISSIONS.LEAVE.VIEW,
        resource: "LEAVE",
        children: [
          {
            title: "Đơn xin nghỉ phép",
            href: "/leave/requests",
            permission: PERMISSIONS.LEAVE.VIEW,
          },
          {
            title: "Quỹ phép nhân viên",
            href: "/leave/balances",
            permission: PERMISSIONS.LEAVE.MANAGE,
          },
          {
            title: "Lịch nghỉ đội ngũ",
            href: "/leave/calendar",
            permission: PERMISSIONS.LEAVE.VIEW,
          },
          {
            title: "Loại nghỉ phép",
            href: "/leave/types",
            permission: PERMISSIONS.LEAVE.CONFIG,
          },
          {
            title: "Chính sách phép năm",
            href: "/leave/policies",
            permission: PERMISSIONS.LEAVE.CONFIG,
          },
        ],
      },
      {
        title: "Quản lý chấm công",
        href: "/attendance/shifts",
        icon: Clock,
        permission: PERMISSIONS.ATTENDANCE.VIEW,
        resource: "ATTENDANCE",
        children: [
          {
            title: "Danh mục ca làm việc",
            href: "/attendance/shifts",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
          {
            title: "Lịch phân ca làm việc",
            href: "/attendance/shift-assignments",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
          {
            title: "Bảng công nhật",
            href: "/attendance/daily-records",
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            title: "Bảng công tổng hợp tháng",
            href: "/attendance/monthly-summary",
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            title: "Giám sát bất thường",
            href: "/attendance/exceptions",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
          {
            title: "Nhật ký quẹt thẻ (Logs)",
            href: "/attendance/logs",
            permission: PERMISSIONS.ATTENDANCE.VIEW,
          },
          {
            title: "Duyệt giải trình công",
            href: "/attendance/requests",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
          {
            title: "Lịch sử hiệu chỉnh công",
            href: "/attendance/adjustments",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
          {
            title: "Kỳ công & Khóa Snapshot",
            href: "/attendance/periods",
            permission: PERMISSIONS.ATTENDANCE.MANAGE,
          },
        ],
      },
      {
        title: "Bảng lương & Chi trả",
        href: "/payroll/periods",
        icon: Banknote,
        children: [
          {
            title: "Kỳ tính lương",
            href: "/payroll/periods",
          },
          {
            title: "Quản lý tạm ứng",
            href: "/payroll/advances",
          },
          {
            title: "Cấu phần & Phụ cấp",
            href: "/payroll/components",
          },
        ],
      },
    ],
  },
  {
    label: "ĐÁNH GIÁ & PHÁT TRIỂN",
    items: [
      {
        title: "Kỳ đánh giá hiệu suất",
        href: "/performance/cycles",
        icon: Calendar,
        permission: PERMISSIONS.PERFORMANCE.VIEW,
      },
      {
        title: "Phiếu đánh giá nhân sự",
        href: "/performance/reviews",
        icon: FileText,
        permission: PERMISSIONS.PERFORMANCE.VIEW,
      },
      {
        title: "Danh mục chỉ số KPI",
        href: "/performance/kpis",
        icon: Layers,
        permission: PERMISSIONS.PERFORMANCE.VIEW,
      },
      {
        title: "Khen thưởng nhân viên",
        href: "/rewards",
        icon: Award,
        permission: "reward.view",
      },
      {
        title: "Kỷ luật lao động",
        href: "/discipline",
        icon: ShieldAlert,
        permission: "discipline.view",
      },
      {
        title: "Khiếu nại & Phản ánh",
        href: "/complaints",
        icon: MessageSquareWarning,
        permission: "complaint.manage",
      },
      {
        title: "Lộ trình thăng tiến",
        href: "/career/paths",
        icon: GitBranch,
        permission: "career.view",
      },
      {
        title: "Kế hoạch kế nhiệm",
        href: "/career/succession",
        icon: Compass,
        permission: "succession.view",
      },
      {
        title: "Kho nhân tài & 9-Box",
        href: "/career/talent-pool",
        icon: Sparkles,
        permission: "succession.view",
      },
    ],
  },
  {
    label: "TUYỂN DỤNG & THU HÚT",
    items: [
      {
        title: "Đề xuất tuyển dụng",
        href: "/recruitment/requests",
        icon: FileText,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Vị trí tuyển dụng",
        href: "/recruitment/job-openings",
        icon: Briefcase,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Hồ sơ ứng viên",
        href: "/recruitment/candidates",
        icon: Users,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Hồ sơ ứng tuyển",
        href: "/recruitment/applications",
        icon: Kanban,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Lịch phỏng vấn",
        href: "/recruitment/interviews",
        icon: Calendar,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Thư mời nhận việc",
        href: "/recruitment/offers",
        icon: Award,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
      {
        title: "Cơ hội nội bộ",
        href: "/recruitment/internal-opportunities",
        icon: Sparkles,
        permission: PERMISSIONS.RECRUITMENT.VIEW,
        resource: "RECRUITMENT",
      },
    ],
  },
  {
    label: "QUY TRÌNH & PHÊ DUYỆT",
    items: [
      {
        title: "Hộp thư phê duyệt",
        href: "/approvals",
        icon: CheckSquare,
      },
      {
        title: "Quy trình phê duyệt",
        href: "/workflows",
        icon: GitFork,
      },
    ],
  },
  {
    label: "KHÔNG GIAN LÀM VIỆC",
    items: [
      {
        title: "Tòa nhà & Cơ sở",
        href: "/workplace/sites",
        icon: Building2,
        permission: PERMISSIONS.WORKPLACE.VIEW,
        resource: "WORKPLACE",
      },
      {
        title: "Sơ đồ tầng & Chỗ ngồi",
        href: "/workplace/floors",
        icon: Compass,
        permission: PERMISSIONS.WORKPLACE.VIEW,
        resource: "WORKPLACE",
      },
      {
        title: "Quản lý đặt bàn",
        href: "/workplace/desk-bookings",
        icon: Layers,
        permission: PERMISSIONS.WORKPLACE.MANAGE,
        resource: "WORKPLACE",
      },
      {
        title: "Quản lý phòng họp",
        href: "/workplace/room-bookings",
        icon: Calendar,
        permission: PERMISSIONS.WORKPLACE.MANAGE,
        resource: "WORKPLACE",
      },
      {
        title: "Sự cố cơ sở vật chất",
        href: "/workplace/issues",
        icon: ShieldAlert,
        permission: PERMISSIONS.WORKPLACE.MANAGE,
        resource: "WORKPLACE",
      },
    ],
  },
  {
    label: "HỆ THỐNG & PHÂN QUYỀN",
    items: [
      {
        title: "Tài khoản người dùng",
        href: "/users",
        icon: Users,
        permission: PERMISSIONS.USER.VIEW,
        resource: "USER",
      },
      {
        title: "Vai trò & Phân quyền",
        href: "/roles",
        icon: ShieldCheck,
        permission: PERMISSIONS.ROLE.VIEW,
        resource: "ROLE",
      },
      {
        title: "Trung tâm Thông báo",
        href: "/notifications",
        icon: Bell,
      },
      {
        title: "Nhật ký kiểm toán",
        href: "/audit-logs",
        icon: History,
        permission: PERMISSIONS.AUDIT.VIEW,
        resource: "AUDIT",
      },
    ],
  },
  {
    label: "SỐ HÓA & LƯU TRỮ",
    items: [
      {
        title: "Kho lưu trữ & số hóa",
        href: "/documents",
        icon: Archive,
      },
      {
        title: "Tạm giữ pháp lý",
        href: "/documents/legal-holds",
        icon: ShieldAlert,
      },
      {
        title: "Hội đồng xét hủy",
        href: "/documents/destruction",
        icon: Flame,
      },
      {
        title: "Chính sách lưu trữ",
        href: "/documents/settings/retention",
        icon: Clock,
      },
      {
        title: "Loại tài liệu & Metadata",
        href: "/documents/settings/types",
        icon: Layers,
      },
    ],
  },
  {
    label: "TRỢ LÝ AI & KHO TRI THỨC",
    items: [
      {
        title: "Trợ lý AI Copilot",
        href: "/ai/chat",
        icon: Sparkles,
        permission: "ai.chat.use",
      },
      {
        title: "Kho tri thức nội bộ",
        href: "/ai/knowledge",
        icon: BookOpen,
        permission: "ai.knowledge_base.manage",
      },
      {
        title: "Lỗ hổng tri thức",
        href: "/ai/knowledge-gaps",
        icon: HelpCircle,
        permission: "ai.knowledge_base.manage",
      },
    ],
  },
  {
    label: "CÀI ĐẶT TÀI KHOẢN",
    items: [
      {
        title: "Cài đặt tài khoản",
        href: "/settings/profile",
        icon: Settings,
        children: [
          {
            title: "Thông tin cá nhân",
            href: "/settings/profile",
          },
          {
            title: "Bảo mật & Mật khẩu",
            href: "/settings/security",
          },
        ],
      },
    ],
  },
];
