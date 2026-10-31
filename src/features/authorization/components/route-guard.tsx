"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "../hooks/use-permission";
import { useAppSelector } from "@/store/hooks";
import { FORBIDDEN_ROUTE } from "../constants/permission.constants";
import type { PermissionCode } from "../types/permission.types";
import type { DataScope, SystemRole } from "../constants/permission.constants";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  /** Mã quyền yêu cầu để truy cập Route */
  permission?: PermissionCode | string;
  /** Danh sách các mã quyền (thỏa mãn nếu có ít nhất 1 quyền) */
  anyPermissions?: (PermissionCode | string)[];
  /** Vai trò yêu cầu */
  role?: SystemRole | string;
  /** Danh sách vai trò yêu cầu */
  roles?: (SystemRole | string)[];
  /** Phạm vi dữ liệu yêu cầu */
  requiredScope?: DataScope;
  /** URL chuyển hướng khi bị từ chối truy cập (Mặc định: /403) */
  fallbackUrl?: string;
  children: React.ReactNode;
}

/**
 * Component bảo vệ cấp Route/Layout. Chặn truy cập trái phép và chuyển hướng về /403.
 */
export function RouteGuard({
  permission,
  anyPermissions,
  role,
  roles,
  requiredScope,
  fallbackUrl = FORBIDDEN_ROUTE,
  children,
}: RouteGuardProps) {
  const router = useRouter();
  const { can, canAny, hasRole, hasAnyRole, isSuperAdmin } = usePermission();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Đợi AuthInitializer hoàn tất nạp thông tin user
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (isSuperAdmin) {
      setIsAuthorized(true);
      return;
    }

    let authorized = true;

    if (permission && !can(permission, requiredScope)) {
      authorized = false;
    } else if (anyPermissions && anyPermissions.length > 0 && !canAny(anyPermissions)) {
      authorized = false;
    }

    if (authorized && role && !hasRole(role)) {
      authorized = false;
    } else if (authorized && roles && roles.length > 0 && !hasAnyRole(roles)) {
      authorized = false;
    }

    if (!authorized) {
      setIsAuthorized(false);
      router.replace(fallbackUrl);
    } else {
      setIsAuthorized(true);
    }
  }, [
    isInitialized,
    isAuthenticated,
    isSuperAdmin,
    permission,
    anyPermissions,
    role,
    roles,
    requiredScope,
    fallbackUrl,
    router,
    can,
    canAny,
    hasRole,
    hasAnyRole,
  ]);

  // Trong lúc chờ kiểm tra phân quyền, render spinner nhẹ chống chớp giao diện (FOUC)
  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

