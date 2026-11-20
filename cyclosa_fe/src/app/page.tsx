"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { resolvePostLoginRoute } from "@/features/auth/utils/role-redirect";
import { SpiderIcon } from "@/components/shared";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated) {
      router.replace(resolvePostLoginRoute(user?.roles));
    } else {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg animate-pulse">
          <SpiderIcon className="h-7 w-7" />
        </div>
        <p className="text-xs font-medium text-muted-foreground animate-pulse">
          Đang chuyển hướng...
        </p>
      </div>
    </div>
  );
}
