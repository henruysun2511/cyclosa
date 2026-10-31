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
 * Tiêu đề tiếng Việt và mô tả thân thiện của 12 Phân hệ tài nguyên
 */
export const RESOURCE_METADATA: Record<
  string,
  { label: string; description: string; badgeVariant?: string }
> = {
  ROLE: {
    label: "Phân quyền & Vai trò",
    description: "Quản trị danh mục vai trò và ma trận quyền hạn",
  },
  USER: {
    label: "Tài khoản Người dùng",
    description: "Quản lý định danh, tài khoản đăng nhập và phân bổ vai trò",
  },
  ORG: {
    label: "Cơ cấu Tổ chức",
    description: "Sơ đồ phòng ban, đơn vị trực thuộc và mô phỏng tái cấu trúc",
  },
  EMPLOYEE: {
    label: "Hồ sơ Nhân sự",
    description: "Hồ sơ lý lịch, thông tin hợp đồng và quá trình công tác",
  },
  LEAVE: {
    label: "Quản lý Nghỉ phép",
    description: "Đơn xin nghỉ, phê duyệt phép và quỹ phép năm",
  },
  ATTENDANCE: {
    label: "Chấm công & Ca kíp",
    description: "Dữ liệu vào/ra, điểm danh GPS/Wifi và phân ca làm việc",
  },
  PAYROLL: {
    label: "Tiền lương & Đãi ngộ",
    description: "Tính bảng lương, phiếu lương cá nhân và thuế thu nhập",
  },
  CONTRACT: {
    label: "Hợp đồng Lao động",
    description: "Tạo lập hợp đồng điện tử, ký số và quản lý phụ lục",
  },
  RECRUITMENT: {
    label: "Tuyển dụng & Nhân tài",
    description: "Tin tuyển dụng, hồ sơ ứng viên và lịch phỏng vấn",
  },
  PERFORMANCE: {
    label: "Hiệu suất & KPI",
    description: "Thiết lập mục tiêu OKR/KPI và đánh giá chu kỳ",
  },
  WORKPLACE: {
    label: "Không gian Số & Tài sản",
    description: "Quản lý tài sản cấp phát, phòng họp và thiết bị làm việc",
  },
  AUDIT: {
    label: "Nhật ký Kiểm toán",
    description: "Theo dõi lịch sử truy vết thao tác và tuân thủ dữ liệu",
  },
};
