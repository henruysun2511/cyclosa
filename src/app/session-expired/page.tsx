import React from "react";
import Link from "next/link";
import { Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionExpiredPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="h-16 w-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
        <Clock className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground">Phiên làm việc đã hết hạn</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Vì lý do an toàn bảo mật, phiên làm việc của bạn đã tự động kết thúc sau một thời gian không hoạt động.
        Vui lòng đăng nhập lại để tiếp tục công việc.
      </p>
      <div className="mt-6">
        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
          <Link href="/login">
            <LogIn className="h-4 w-4 mr-2" />
            Đăng nhập lại
          </Link>
        </Button>
      </div>
    </div>
  );
}
