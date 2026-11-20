import { AUTH_ROUTES } from "../constants/auth.constants";

/**
 * Danh mục các vai trò có quyền truy cập vào cổng quản trị và quản lý điều hành
 */
export const ADMIN_OR_MANAGER_ROLES = [
  "SUPER_ADMIN",
  "HR_ADMIN",
  "HR_SPECIALIST",
  "RECRUITER",
  "PAYROLL_ACCOUNTANT",
  "EXECUTIVE",
  "MANAGER",
  "OFFICE_ADMIN",
  "AUDITOR",
  "ADMIN",
];

/**
 * Kiểm tra xem người dùng có quyền truy cập vào Cổng Quản trị / Nghiệp vụ Quản lý hay không
 */
export function canAccessAdminPortal(roles?: string[] | null): boolean {
  if (!roles || roles.length === 0) return false;
  const normalized = roles.map((r) => r.replace(/^ROLE_/, "").toUpperCase());
  return normalized.some((role) => ADMIN_OR_MANAGER_ROLES.includes(role));
}

/**
 * Kiểm tra xem người dùng có phải là nhân viên thuần túy (không có quyền quản trị) hay không
 */
export function isEmployeeOnly(roles?: string[] | null): boolean {
  return !canAccessAdminPortal(roles);
}

/**
 * Xác định tuyến đường mặc định sau khi đăng nhập dựa trên vai trò của người dùng.
 * - Vai trò EMPLOYEE (chỉ có quyền nhân viên): Chuyển hướng đến Cổng tự phục vụ Nhân viên (/me)
 * - Các vai trò quản trị/nghiệp vụ khác: Chuyển hướng đến Tổng quan điều hành (/dashboard/overview)
 */
export function getDefaultRouteForRoles(roles?: string[] | null): string {
  if (canAccessAdminPortal(roles)) {
    return AUTH_ROUTES.DEFAULT_AFTER_LOGIN;
  }
  return AUTH_ROUTES.EMPLOYEE_AFTER_LOGIN;
}

/**
 * Phân giải đường dẫn chuyển hướng sau khi đăng nhập chuẩn xác theo Role:
 * - Nếu Role là EMPLOYEE (nhân viên thuần túy): BẮT BUỘC về /me (hoặc các trang con của /me).
 *   Tuyệt đối KHÔNG chuyển hướng sang /dashboard hay các trang admin dù có returnUrl.
 * - Nếu Role là ADMIN / MANAGER: Ưu tiên returnUrl hợp lệ, mặc định về /dashboard/overview.
 */
export function resolvePostLoginRoute(
  roles?: string[] | null,
  returnUrl?: string | null
): string {
  const isAdmin = canAccessAdminPortal(roles);

  if (!isAdmin) {
    // Tài khoản nhân viên thuần túy: Chỉ cho phép vào các trang thuộc cổng nhân viên /me
    if (returnUrl && returnUrl.startsWith("/me") && !returnUrl.includes("/login")) {
      return returnUrl;
    }
    // Mọi URL khác (như /dashboard, /dashboard/overview, v.v.) đối với Employee đều BẮT BUỘC về /me
    return AUTH_ROUTES.EMPLOYEE_AFTER_LOGIN;
  }

  // Tài khoản Admin / Quản trị viên
  if (
    returnUrl &&
    returnUrl !== "/login" &&
    returnUrl !== "/products" &&
    returnUrl !== "/"
  ) {
    return returnUrl;
  }

  return AUTH_ROUTES.DEFAULT_AFTER_LOGIN;
}
