import type { DataScope } from "@/features/authorization/constants/permission.constants";

/**
 * Phản hồi tóm tắt của Vai trò từ GET /api/v1/roles
 */
export interface RoleResponse {
  id: string;
  companyId: string | null;
  code: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  createdAt: string;
}

/**
 * Phân quyền được gán cho vai trò kèm phạm vi dữ liệu
 */
export interface RolePermissionResponse {
  id: string;
  permissionId: string;
  permissionCode: string;
  resource: string;
  action: string;
  description: string;
  dataScope: DataScope;
}

/**
 * Chi tiết vai trò kèm số lượng user và ma trận quyền từ GET /api/v1/roles/{roleId}
 */
export interface RoleDetailResponse {
  id: string;
  companyId: string | null;
  code: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  userCount: number;
  permissions: RolePermissionResponse[];
  createdAt: string;
  updatedAt?: string | null;
}

/**
 * Quyền chức năng hệ thống từ GET /api/v1/permissions
 */
export interface PermissionResponse {
  id: string;
  resource: string;
  action: string;
  code: string;
  description: string;
}

/**
 * Danh mục quyền gom theo 12 Phân hệ từ GET /api/v1/permissions/grouped
 * Key: RESOURCE (vd: ROLE, EMPLOYEE, USER, ORG, LEAVE, ATTENDANCE, PAYROLL...)
 */
export type GroupedPermissionsResponse = Record<string, PermissionResponse[]>;

/**
 * Tham số lọc và phân trang vai trò
 */
export interface RoleFilterParams {
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: "name" | "code" | "isSystemRole" | "createdAt";
  direction?: "asc" | "desc";
  companyId?: string;
  isSystemRole?: boolean;
}

/**
 * DTO tạo mới vai trò tùy chỉnh (POST /api/v1/roles)
 */
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  companyId?: string | null;
}

/**
 * DTO cập nhật vai trò (PUT /api/v1/roles/{roleId})
 */
export interface UpdateRoleRequest {
  name: string;
  description?: string;
}

/**
 * Mục cấu hình quyền và phạm vi dữ liệu
 */
export interface PermissionScopeItem {
  permissionId: string;
  dataScope: DataScope;
}

/**
 * DTO lưu thiết lập ma trận quyền cho vai trò (PUT /api/v1/roles/{roleId}/permissions)
 */
export interface AssignRolePermissionsRequest {
  permissions: PermissionScopeItem[];
}

