"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpiderIcon } from "@/components/shared";
import { useAppSelector } from "@/store/hooks";

export default function GlobalForbiddenPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-100/80 p-6 text-center select-none dark:bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] opacity-70 dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white shadow-md">
            <SpiderIcon className="h-5 w-5" />
          </div>
          <span className="font-sans text-lg font-bold tracking-tight text-foreground">
            Cyclo<span className="text-primary">sa</span> HRM
          </span>
        </div>

        {/* 403 Icon */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5 dark:bg-rose-950/50 dark:text-rose-400">
          <ShieldAlert className="h-10 w-10" />
        </div>

        {/* Status Badge & Content */}
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:bg-rose-950/60 dark:text-rose-300">
            Mã trạng thái: 403 Forbidden
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Truy cập bị từ chối
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Tài khoản của bạn chưa được cấp quyền hạn cần thiết để truy cập phân hệ hoặc thực hiện thao tác này.
          </p>

          <p className="text-xs text-muted-foreground/80 leading-relaxed border-t border-border/60 pt-3 mt-2">
            Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ Trưởng phòng Nhân sự (HR Admin) hoặc Quản trị viên hệ thống CYCLOSA để được hỗ trợ cấp quyền.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-11 px-5 text-xs font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang trước
          </Button>

          {isAuthenticated ? (
            <Link href="/products">
              <Button className="h-11 px-5 text-xs font-medium shadow-md">
                <Home className="mr-2 h-4 w-4" />
                Về Trang chủ
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="h-11 px-5 text-xs font-medium shadow-md">
                <LogIn className="mr-2 h-4 w-4" />
                Đến trang Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <p className="relative z-10 mt-8 text-xs text-muted-foreground">
        © 2026 CYCLOSA HRM Enterprise • Hệ thống Quản trị Nhân sự & Vận hành Doanh nghiệp
      </p>
    </div>
  );
}

