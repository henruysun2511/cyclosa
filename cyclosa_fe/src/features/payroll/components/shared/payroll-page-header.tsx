"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface PayrollPageHeaderProps {
  title: string;
  icon: LucideIcon;
  breadcrumb: string;
  parentHref?: string;
  parentTitle?: string;
  actions?: React.ReactNode;
}

/**
 * Header chuẩn cho phân hệ Bảng lương tuân thủ 100% Rule 02:
 * - Icon đặt trực tiếp trong thẻ H1 (KHÔNG bọc hộp nền bo góc)
 * - Breadcrumbs chuẩn: Trang chủ / Bảng lương & Tính lương / [Trang hiện tại]
 * - Nút thao tác góc phải (Actions)
 * - KHÔNG subtitle / description dài dòng
 */
export function PayrollPageHeader({
  title,
  icon: Icon,
  breadcrumb,
  parentHref = "/payroll/periods",
  parentTitle = "Bảng lương & Tính lương",
  actions,
}: PayrollPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        {/* 1. Tiêu đề H1 với Icon đặt trực tiếp theo Rule 02 */}
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          <Icon className="w-6 h-6 text-primary shrink-0" />
          <span>{title}</span>
        </h1>

        {/* 2. Đường dẫn Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href={parentHref} className="hover:text-primary transition-colors">
            {parentTitle}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{breadcrumb}</span>
        </nav>
      </div>

      {/* 3. Nút Thao tác Đầu trang (Actions) */}
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}

