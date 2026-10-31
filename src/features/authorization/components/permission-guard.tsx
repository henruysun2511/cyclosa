"use client";

import React from "react";
import { usePermission } from "../hooks/use-permission";
import type { DataScope, SystemRole } from "../constants/permission.constants";
import type { PermissionCode } from "../types/permission.types";

interface PermissionGuardProps {
  /** Mã quyền yêu cầu (Sử dụng PERMISSIONS.RESOURCE.ACTION) */
  permission?: PermissionCode | string;
  /** Danh sách các mã quyền (thỏa mãn nếu có ít nhất 1 quyền) */
  anyPermissions?: (PermissionCode | string)[];
  /** Phạm vi dữ liệu yêu cầu tối thiểu (ALL, COMPANY, DEPARTMENT, OWN) */
  requiredScope?: DataScope;
  /** Chế độ kiểm soát: "hide" (Ẩn khỏi DOM - Mặc định) hoặc "disable" (Làm mờ + vô hiệu hóa) */
  mode?: "hide" | "disable";
  /** Tooltip thông báo khi bị vô hiệu hóa (áp dụng khi mode="disable") */
  disabledTooltip?: string;
  /** Nội dung hiển thị thay thế khi không đủ quyền (chỉ áp dụng mode="hide") */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component kiểm soát hiển thị Button, Tab, Form Field hoặc Action dựa trên Quyền chức năng
 */
export function PermissionGuard({
  permission,
  anyPermissions,
  requiredScope,
  mode = "hide",
  disabledTooltip = "Bạn không có quyền thực hiện thao tác này",
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { can, canAny } = usePermission();

  let hasAccess = true;

  if (permission) {
    hasAccess = can(permission, requiredScope);
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = canAny(anyPermissions);
  }

  // Đủ quyền -> Render bình thường
  if (hasAccess) {
    return <>{children}</>;
  }

  // Chế độ 1: Ẩn hoàn toàn khỏi giao diện
  if (mode === "hide") {
    return <>{fallback}</>;
  }

  // Chế độ 2: Vô hiệu hóa và hiển thị tiêu đề giải thích lý do
  return (
    <span
      className="inline-flex cursor-not-allowed opacity-50 select-none pointer-events-none"
      title={disabledTooltip}
      aria-disabled="true"
    >
      {children}
    </span>
  );
}

interface RoleGuardProps {
  /** Một vai trò cụ thể được phép */
  role?: SystemRole | string;
  /** Danh sách vai trò được phép (ít nhất 1 vai trò khớp) */
  roles?: (SystemRole | string)[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component kiểm soát hiển thị dựa trên Vai trò người dùng (Roles)
 */
export function RoleGuard({
  role,
  roles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const { hasRole, hasAnyRole } = usePermission();

  let hasAccess = true;

  if (role) {
    hasAccess = hasRole(role);
  } else if (roles && roles.length > 0) {
    hasAccess = hasAnyRole(roles);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

