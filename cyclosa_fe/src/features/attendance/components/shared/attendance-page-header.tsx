"use client";

import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AttendancePageHeaderProps {
  title: string;
  icon?: React.ElementType;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function AttendancePageHeader({
  title,
  icon: Icon,
  breadcrumbs,
  actions,
}: AttendancePageHeaderProps) {
  // Loại bỏ "Trang chủ" nếu đã có trong breadcrumbs truyền vào để tránh trùng lặp
  const cleanBreadcrumbs = breadcrumbs.filter(
    (b) => b.label.trim().toLowerCase() !== "trang chủ"
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        {/* 1. Tiêu đề H1 với Icon đặt trực tiếp chuẩn 100% Rule 02 */}
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          {Icon && <Icon className="w-6 h-6 text-primary shrink-0" />}
          <span>{title}</span>
        </h1>

        {/* 2. Đường dẫn Breadcrumb chuẩn 100% Rule 02 */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          {cleanBreadcrumbs.map((item, idx) => {
            const isLast = idx === cleanBreadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                <span>/</span>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </React.Fragment>
            );
          })}
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
