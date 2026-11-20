"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { SpiderIcon } from "@/components/shared";
import { isEmployeeOnly } from "../utils/role-redirect";

export interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Nếu bật requireAdmin = true: Chỉ cho phép người dùng có vai trò Quản trị / Quản lý truy cập.
   * Nếu là nhân viên (EMPLOYEE thuần túy), tự động chuyển hướng sang Cổng nhân viên (/me).
   */
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Nếu trang này yêu cầu quyền quản trị nhưng người dùng là nhân viên thuần túy
    if (requireAdmin && isEmployeeOnly(user?.roles)) {
      router.replace("/me");
    }
  }, [isInitialized, isAuthenticated, user, requireAdmin, router, pathname]);

  // Tránh nhấp nháy FOUC: khi chưa khởi tạo xong phiên
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg animate-pulse">
            <SpiderIcon className="h-7 w-7" />
          </div>
          <p className="text-xs font-medium text-muted-foreground animate-pulse">
            Đang tải phiên làm việc...
          </p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, hoặc route yêu cầu Admin mà chỉ là Employee
  if (!isAuthenticated || (requireAdmin && isEmployeeOnly(user?.roles))) {
    return null;
  }

  return <>{children}</>;
}
