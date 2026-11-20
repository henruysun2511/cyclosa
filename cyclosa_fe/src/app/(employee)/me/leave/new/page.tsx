"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateLeaveRequestForm } from "@/features/leave/components/requests/create-leave-request-form";

export default function NewLeaveRequestPage() {
  return (
    <div className="space-y-6">
      {/* Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <CalendarDays className="w-6 h-6 text-primary shrink-0" />
            <span>Tạo đơn xin nghỉ phép</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <Link href="/me/leave" className="hover:text-primary transition-colors">
              Nghỉ phép
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tạo đơn</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
            <Link href="/me/leave">
              <span>Quay lại</span>
            </Link>
          </Button>
        </div>
      </div>

      <CreateLeaveRequestForm isOnBehalf={false} />
    </div>
  );
}
