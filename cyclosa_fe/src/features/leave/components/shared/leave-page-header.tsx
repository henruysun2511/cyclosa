"use client";

import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface LeavePageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumb?: string;
  children?: React.ReactNode;
}

export function LeavePageHeader({
  title,
  description,
  icon: Icon,
  breadcrumb,
  children,
}: LeavePageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          {Icon && <Icon className="w-6 h-6 text-primary shrink-0" />}
          {title}
        </h1>
        {breadcrumb ? (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors cursor-pointer">
              Nghỉ phép
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>
        ) : description ? (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
