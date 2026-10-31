"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { SpiderIcon } from "@/components/shared";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnUrl=${returnUrl}`);
    }
  }, [isInitialized, isAuthenticated, router, pathname]);

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

  // Nếu đã khởi tạo và chưa đăng nhập, trả về null trong lúc router chuyển hướng
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

