import React from "react";
import Link from "next/link";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <ShieldX className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground">403 — Không có quyền truy cập</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Bạn không có quyền hạn truy cập tài nguyên hoặc thực hiện hành động này.
        Vui lòng liên hệ quản trị viên hệ thống hoặc kiểm tra lại vai trò của bạn.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về Trang chủ
          </Link>
        </Button>
      </div>
    </div>
  );
}
