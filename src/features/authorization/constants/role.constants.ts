import type { PermissionResponse } from "../types/role.types";

export const ROLE_ENDPOINTS = {
  ROLES: "/api/v1/roles",
  ROLE_DETAIL: (roleId: string) => `/api/v1/roles/${roleId}`,
  ROLE_PERMISSIONS: (roleId: string) => `/api/v1/roles/${roleId}/permissions`,
  PERMISSIONS: "/api/v1/permissions",
  PERMISSIONS_GROUPED: "/api/v1/permissions/grouped",
} as const;

export const ROLE_FILTER_TABS = {
  ALL: "ALL",
  SYSTEM: "SYSTEM",
  CUSTOM: "CUSTOM",
} as const;

export type RoleFilterTab = typeof ROLE_FILTER_TABS[keyof typeof ROLE_FILTER_TABS];

/**
 * 6 Nhóm Phân Hệ Lớn (Level 1: Groups) & Tài nguyên con (Level 2: Sub-resources)
 */
export const PERMISSION_GROUPS = [
  {
    key: "HR_GROUP",
    title: "HỒ SƠ & NHÂN SỰ",
    resources: [
      { key: "EMPLOYEE", name: "Hồ sơ nhân viên & Lý lịch" },
      { key: "CONTRACT", name: "Hợp đồng lao động & Ký số" },
    ],
  },
  {
    key: "TIME_GROUP",
    title: "CHẤM CÔNG & NGHỈ PHÉP",
    resources: [
      { key: "ATTENDANCE", name: "Chấm công & Ca làm việc" },
      { key: "LEAVE", name: "Đơn xin nghỉ phép & Phê duyệt" },
    ],
  },
  {
    key: "PAYROLL_GROUP",
    title: "TIỀN LƯƠNG & ĐÃI NGỘ",
    resources: [
      { key: "PAYROLL", name: "Bảng tính lương & Phiếu lương" },
    ],
  },
  {
    key: "ORG_GROUP",
    title: "CƠ CẤU & TỔ CHỨC",
    resources: [
      { key: "ORG", name: "Sơ đồ tổ chức & Phòng ban" },
    ],
  },
  {
    key: "TALENT_GROUP",
    title: "TUYỂN DỤNG & HIỆU SUẤT",
    resources: [
      { key: "RECRUITMENT", name: "Kế hoạch & Tuyển dụng" },
      { key: "PERFORMANCE", name: "Đánh giá hiệu suất & KPI" },
    ],
  },
  {
    key: "SYSTEM_GROUP",
    title: "HỆ THỐNG & BẢO MẬT",
    resources: [
      { key: "ROLE", name: "Quản lý vai trò & Ma trận phân quyền" },
      { key: "USER", name: "Tài khoản người dùng" },
      { key: "WORKPLACE", name: "Không gian số & Tài sản" },
      { key: "AUDIT", name: "Nhật ký kiểm toán & Tuân thủ" },
    ],
  },
] as const;

/**
 * Helper sinh tiêu đề tự nhiên theo chuẩn hành động tiếng Việt
 */
export function getPermissionTitle(perm: PermissionResponse, resourceName: string): string {
  const action = perm.action.toUpperCase();
  const rawName = resourceName.toLowerCase().replace("quản lý ", "").replace("quản trị ", "");
  switch (action) {
    case "VIEW":
      return `Xem ${rawName}`;
    case "CREATE":
    case "APPLY":
      return `Tạo ${rawName}`;
    case "UPDATE":
    case "EDIT":
    case "PROCESS":
      return `Sửa ${rawName}`;
    case "DELETE":
      return `Xóa ${rawName}`;
    case "APPROVE":
      return `Phê duyệt ${rawName}`;
    case "SIGN":
      return `Ký duyệt ${rawName}`;
    case "CHECKIN":
      return `Điểm danh trực tuyến`;
    case "EVALUATE":
      return `Đánh giá ${rawName}`;
    case "ACTIVATE":
      return `Kích hoạt / Khóa tài khoản`;
    case "ASSIGN":
      return `Phân bổ vai trò`;
    case "SIMULATE":
      return `Mô phỏng cơ cấu tổ chức`;
    case "VIEW_SALARY":
      return `Xem chi tiết phiếu lương`;
    case "MANAGE":
      return `Quản lý ${rawName}`;
    default:
      return `${perm.action} ${rawName}`;
  }
}
