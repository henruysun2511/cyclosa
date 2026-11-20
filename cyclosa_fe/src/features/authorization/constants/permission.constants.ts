// ============================================================================
// HẰNG SỐ PHÂN QUYỀN HỆ THỐNG CYCLOSA HRM (SINGLE SOURCE OF TRUTH)
// ============================================================================

/**
 * 1. Danh mục 36 Mã quyền chức năng gom nhóm theo 12 Phân hệ tài nguyên (Resource Prefix)
 */
export const PERMISSIONS = {
  // 1. Phân quyền & Quản lý Vai trò
  ROLE: {
    VIEW: "role.view",
    MANAGE: "role.manage",
    ASSIGN: "role.assign",
  },

  // 2. Quản lý Tài khoản người dùng
  USER: {
    VIEW: "user.view",
    CREATE: "user.create",
    UPDATE: "user.update",
    ACTIVATE: "user.activate",
  },

  // 3. Cơ cấu Tổ chức & Phòng ban
  ORG: {
    VIEW: "org.view",
    MANAGE: "org.manage",
    SIMULATE: "org.simulate",
  },

  // 4. Quản lý Hồ sơ Nhân sự
  EMPLOYEE: {
    VIEW: "employee.view",
    CREATE: "employee.create",
    UPDATE: "employee.update",
    DELETE: "employee.delete",
  },

  // 5. Quản lý Nghỉ phép
  LEAVE: {
    VIEW: "leave.view",
    APPLY: "leave.apply",
    APPROVE: "leave.approve",
    MANAGE: "leave.manage",
  },

  // 6. Chấm công & Ca kíp
  ATTENDANCE: {
    VIEW: "attendance.view",
    CHECKIN: "attendance.checkin",
    MANAGE: "attendance.manage",
  },

  // 7. Tiền lương & Thu nhập
  PAYROLL: {
    VIEW: "payroll.view",
    PROCESS: "payroll.process",
    VIEW_SALARY: "payroll.view_salary",
  },

  // 8. Hợp đồng Lao động
  CONTRACT: {
    VIEW: "contract.view",
    CREATE: "contract.create",
    SIGN: "contract.sign",
    APPROVE: "contract.approve",
    TEMPLATE: "contract.template",
  },

  // 9. Tuyển dụng & Thu hút nhân tài
  RECRUITMENT: {
    VIEW: "recruitment.view",
    CREATE: "recruitment.create",
    MANAGE: "recruitment.manage",
  },

  // 10. Đánh giá Hiệu suất & KPI
  PERFORMANCE: {
    VIEW: "performance.view",
    EVALUATE: "performance.evaluate",
  },

  // 11. Không gian làm việc số & Tài sản
  WORKPLACE: {
    VIEW: "workplace.view",
    MANAGE: "workplace.manage",
  },

  // 12. Nhật ký Kiểm toán & Tuân thủ
  AUDIT: {
    VIEW: "audit.view",
  },
} as const;

/**
 * 2. Danh mục 5 Cấp độ Phạm vi Dữ liệu (Data Scope)
 */
export const DATA_SCOPE = {
  ALL: "ALL",               // Toàn hệ thống
  COMPANY: "COMPANY",       // Trong phạm vi công ty/pháp nhân
  DEPARTMENT: "DEPARTMENT", // Trong phạm vi phòng ban trực thuộc
  TEAM: "TEAM",             // Trong phạm vi đội nhóm
  OWN: "OWN",               // Chỉ dữ liệu của chính mình
} as const;

export type DataScope = typeof DATA_SCOPE[keyof typeof DATA_SCOPE];

/**
 * Trọng số thứ bậc của phạm vi dữ liệu: ALL > COMPANY > DEPARTMENT > TEAM > OWN
 */
export const DATA_SCOPE_LEVEL: Record<DataScope, number> = {
  [DATA_SCOPE.ALL]: 5,
  [DATA_SCOPE.COMPANY]: 4,
  [DATA_SCOPE.DEPARTMENT]: 3,
  [DATA_SCOPE.TEAM]: 2,
  [DATA_SCOPE.OWN]: 1,
};

/** Kiểm tra phạm vi dữ liệu hiện tại có đạt tối thiểu một cấp độ nào đó không */
export function isAtLeastScope(currentScope: DataScope, requiredScope: DataScope): boolean {
  return DATA_SCOPE_LEVEL[currentScope] >= DATA_SCOPE_LEVEL[requiredScope];
}

/** Có quyền xem toàn công ty trở lên (ALL hoặc COMPANY) */
export function hasCompanyScope(scope: DataScope): boolean {
  return isAtLeastScope(scope, DATA_SCOPE.COMPANY);
}

/** Có quyền xem phòng ban trở lên (ALL, COMPANY hoặc DEPARTMENT) */
export function hasDepartmentScope(scope: DataScope): boolean {
  return isAtLeastScope(scope, DATA_SCOPE.DEPARTMENT);
}

/** Chỉ xem được dữ liệu cá nhân của chính mình (OWN) */
export function isOwnScope(scope: DataScope): boolean {
  return scope === DATA_SCOPE.OWN;
}

/**
 * 3. Danh mục 10 Vai trò chuẩn hệ thống (System Roles)
 */
export const SYSTEM_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",               // Quản trị cao nhất toàn hệ thống
  HR_ADMIN: "HR_ADMIN",                     // Trưởng phòng Nhân sự
  HR_SPECIALIST: "HR_SPECIALIST",           // Chuyên viên Nhân sự thực thi
  RECRUITER: "RECRUITER",                   // Chuyên viên Tuyển dụng
  PAYROLL_ACCOUNTANT: "PAYROLL_ACCOUNTANT", // Kế toán tiền lương & C&B
  EXECUTIVE: "EXECUTIVE",                   // Ban Lãnh đạo / BOD
  MANAGER: "MANAGER",                       // Quản lý đơn vị / Trưởng nhóm
  EMPLOYEE: "EMPLOYEE",                     // Nhân viên
  OFFICE_ADMIN: "OFFICE_ADMIN",             // Quản trị cơ sở vật chất & IT
  AUDITOR: "AUDITOR",                       // Kiểm toán nội bộ & Tuân thủ
} as const;

export type SystemRole = typeof SYSTEM_ROLE[keyof typeof SYSTEM_ROLE];

/**
 * 4. Nhãn hiển thị tiếng Việt của DataScope
 */
export const DATA_SCOPE_LABELS: Record<DataScope, string> = {
  [DATA_SCOPE.ALL]: "Toàn hệ thống",
  [DATA_SCOPE.COMPANY]: "Toàn công ty",
  [DATA_SCOPE.DEPARTMENT]: "Phòng ban",
  [DATA_SCOPE.TEAM]: "Đội nhóm",
  [DATA_SCOPE.OWN]: "Cá nhân",
};

/**
 * 5. Nhãn hiển thị tiếng Việt của Vai trò
 */
export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  [SYSTEM_ROLE.SUPER_ADMIN]: "Quản trị viên Cấp cao (Super Admin)",
  [SYSTEM_ROLE.HR_ADMIN]: "Trưởng phòng Nhân sự (HR Admin)",
  [SYSTEM_ROLE.HR_SPECIALIST]: "Chuyên viên Nhân sự (HR Specialist)",
  [SYSTEM_ROLE.RECRUITER]: "Chuyên viên Tuyển dụng (Recruiter)",
  [SYSTEM_ROLE.PAYROLL_ACCOUNTANT]: "Kế toán Tiền lương (Payroll)",
  [SYSTEM_ROLE.EXECUTIVE]: "Ban Lãnh đạo (Executive)",
  [SYSTEM_ROLE.MANAGER]: "Quản lý Đơn vị (Manager)",
  [SYSTEM_ROLE.EMPLOYEE]: "Nhân viên (Employee)",
  [SYSTEM_ROLE.OFFICE_ADMIN]: "Quản trị Cơ sở vật chất (Office Admin)",
  [SYSTEM_ROLE.AUDITOR]: "Kiểm toán Nội bộ (Auditor)",
};

/**
 * 6. Đường dẫn trang Cấm truy cập
 */
export const FORBIDDEN_ROUTE = "/403";

