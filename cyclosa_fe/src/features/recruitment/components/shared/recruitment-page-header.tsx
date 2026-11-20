"use client";

import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface RecruitmentPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  badgeText?: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function RecruitmentPageHeader({
  title,
  icon: Icon,
  breadcrumbs,
  actions,
}: RecruitmentPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          {Icon && <Icon className="w-6 h-6 text-primary shrink-0" />}
          {title}
        </h1>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
          <Link
            href="/"
            className="hover:text-primary transition-colors"
          >
            Trang chủ
          </Link>
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>/</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
