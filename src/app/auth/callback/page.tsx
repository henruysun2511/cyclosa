"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success">("processing");

  useEffect(() => {
    // Simulate token verification and session hydration
    const timer = setTimeout(() => {
      setStatus("success");
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 800);
      return () => clearTimeout(redirectTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm text-center p-6 shadow-md border-border">
        <CardContent className="space-y-4 pt-4">
          {status === "processing" ? (
            <>
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  Đang đồng bộ phiên đăng nhập
                </h3>
                <p className="text-xs text-muted-foreground">
                  Đang nạp quyền hạn và cấu hình tài khoản Google...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-emerald-700">
                  Xác thực thành công
                </h3>
                <p className="text-xs text-muted-foreground">
                  Đang chuyển hướng vào hệ thống...
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
