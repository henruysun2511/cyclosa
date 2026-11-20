import {
  PERMISSIONS,
  DATA_SCOPE,
  SYSTEM_ROLE,
  type DataScope,
  type SystemRole,
} from "../constants/permission.constants";

export type { DataScope, SystemRole };

/**
 * Danh sách 12 Phân hệ tài nguyên (Resource Prefixes)
 */
export type PermissionResource = keyof typeof PERMISSIONS;

/**
 * Kiểu dữ liệu Mã quyền cụ thể (36 mã quyền hợp lệ)
 */
export type PermissionCode =
  typeof PERMISSIONS[PermissionResource][keyof typeof PERMISSIONS[PermissionResource]];

/**
 * Bản ghi Quyền hiệu lực nhận từ Backend
 */
export interface EffectivePermission {
  permissionCode: PermissionCode | string;
  resource: string;
  action: string;
  dataScope: DataScope;
}

/**
 * Bản đồ phân quyền người dùng trong State: Map<PermissionCode, DataScope>
 */
export type UserPermissionMap = Partial<Record<PermissionCode, DataScope>>;

/**
 * Trạng thái phân quyền tổng hợp của người dùng
 */
export interface UserAuthorizationState {
  roles: (SystemRole | string)[];
  permissions: (PermissionCode | string)[];
  dataScopes: UserPermissionMap;
  isSuperAdmin: boolean;
}

