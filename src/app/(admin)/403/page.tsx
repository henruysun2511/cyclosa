"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6 ring-8 ring-destructive/5">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <div className="max-w-md space-y-3">
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          Mã lỗi: 403 Forbidden
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Truy cập bị từ chối
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Tài khoản của bạn chưa được cấp quyền hạn cần thiết để truy cập phân hệ hoặc thực hiện thao tác này.
        </p>

        <p className="text-xs text-muted-foreground/80">
          Nếu bạn cho rằng đây là một sự nhầm lẫn, vui lòng liên hệ Trưởng phòng Nhân sự (HR Admin) hoặc Quản trị viên hệ thống CYCLOSA.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-10 px-4 text-xs font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang trước
        </Button>

        <Link href="/products">
          <Button className="h-10 px-4 text-xs font-medium shadow-sm">
            <Home className="mr-2 h-4 w-4" />
            Về Trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}

