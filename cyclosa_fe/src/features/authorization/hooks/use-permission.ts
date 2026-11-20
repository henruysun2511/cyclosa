import { useAppSelector } from "@/store/hooks";
import {
  PERMISSIONS,
  DATA_SCOPE,
  SYSTEM_ROLE,
  isAtLeastScope,
  type DataScope,
  type SystemRole,
} from "../constants/permission.constants";
import type { PermissionCode, PermissionResource } from "../types/permission.types";

/**
 * Hook Quản lý và Thẩm định Phân quyền người dùng tập trung (Clean Architecture)
 */
export function usePermission() {
  const user = useAppSelector((state) => state.auth.user);

  const roles = user?.roles || [];
  const permissions = user?.permissions || [];
  const dataScopes = user?.dataScopes || {};

  // Super Admin luôn có toàn quyền tuyệt đối trên mọi tài nguyên
  const isSuperAdmin = roles.includes(SYSTEM_ROLE.SUPER_ADMIN);

  /**
   * 1. Kiểm tra người dùng có một mã quyền cụ thể không (có thể kèm điều kiện DataScope)
   * Ví dụ: can(PERMISSIONS.EMPLOYEE.VIEW, DATA_SCOPE.COMPANY)
   */
  const can = (
    permission: PermissionCode | string,
    requiredScope?: DataScope
  ): boolean => {
    if (isSuperAdmin) return true;
    if (!permissions.includes(permission)) return false;

    if (requiredScope) {
      const userScope = dataScopes[permission] || DATA_SCOPE.OWN;
      return isAtLeastScope(userScope, requiredScope);
    }

    return true;
  };

  /**
   * 2. Kiểm tra người dùng có ít nhất một trong các quyền được truyền vào
   * Ví dụ: canAny([PERMISSIONS.ROLE.VIEW, PERMISSIONS.ROLE.MANAGE])
   */
  const canAny = (perms: (PermissionCode | string)[]): boolean => {
    if (isSuperAdmin) return true;
    return perms.some((p) => permissions.includes(p));
  };

  /**
   * 3. Kiểm tra người dùng có tất cả các quyền được truyền vào
   */
  const canAll = (perms: (PermissionCode | string)[]): boolean => {
    if (isSuperAdmin) return true;
    return perms.every((p) => permissions.includes(p));
  };

  /**
   * 4. Kiểm tra người dùng có bất kỳ quyền nào thuộc một Phân hệ (Prefix Resource)
   * Rất tiện lợi cho việc kiểm tra hiển thị Menu cha của Sidebar!
   * Ví dụ: canAnyInResource("ROLE") -> kiểm tra role.view, role.manage, role.assign
   */
  const canAnyInResource = (resource: PermissionResource): boolean => {
    if (isSuperAdmin) return true;
    const resourcePermissions = Object.values(PERMISSIONS[resource] || {});
    return resourcePermissions.some((p) => permissions.includes(p));
  };

  /**
   * 5. Kiểm tra người dùng có một vai trò cụ thể không
   * Ví dụ: hasRole(SYSTEM_ROLE.HR_ADMIN)
   */
  const hasRole = (role: SystemRole | string): boolean => {
    if (isSuperAdmin) return true;
    return roles.includes(role);
  };

  /**
   * 6. Kiểm tra người dùng có ít nhất một trong các vai trò được truyền vào
   */
  const hasAnyRole = (requiredRoles: (SystemRole | string)[]): boolean => {
    if (isSuperAdmin) return true;
    return requiredRoles.some((r) => roles.includes(r));
  };

  /**
   * 7. Lấy phạm vi dữ liệu (DataScope) của quyền hiện tại
   * Trả về mặc định: ALL (với Super Admin), hoặc phạm vi được gán, hoặc OWN
   */
  const getDataScope = (permission: PermissionCode | string): DataScope => {
    if (isSuperAdmin) return DATA_SCOPE.ALL;
    return dataScopes[permission] || DATA_SCOPE.OWN;
  };

  return {
    can,
    canAny,
    canAll,
    canAnyInResource,
    hasRole,
    hasAnyRole,
    getDataScope,
    isSuperAdmin,
    roles,
    permissions,
  };
}

