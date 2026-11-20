"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LucideIcon, RefreshCw, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  period?: "MONTH" | "QUARTER" | "YEAR";
  onPeriodChange?: (period: "MONTH" | "QUARTER" | "YEAR") => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  icon: Icon,
  period = "MONTH",
  onPeriodChange,
  onRefresh,
  isRefreshing = false,
  breadcrumbs,
  className,
  actions,
}: DashboardHeaderProps) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = `${title} | CYCLOSA HRM`;
    }
  }, [title]);

  const defaultCrumbs = [
    { label: "Bảng điều khiển", href: "/dashboard/overview" },
    { label: title },
  ];

  const renderCrumbs = breadcrumbs || defaultCrumbs;

  return (
    <div className={cn("space-y-2 pb-2", className)}>
      {/* 1. Breadcrumbs phía trên: Bảng điều khiển > [Tên trang] */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
        {renderCrumbs.map((crumb, idx) => {
          const isLast = idx === renderCrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Tiêu đề H1 với Icon nằm bên trái và Mô tả phía dưới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-0.5">
        <div className="flex items-center gap-3.5">
          <Icon className="h-8 w-8 text-primary shrink-0" />
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 3. Nút Thao tác & Bộ lọc Kỳ báo cáo phía bên phải */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {actions}

          {onPeriodChange && (
            <div className="flex items-center gap-1.5 bg-card border border-border shadow-2xs p-0.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground ml-2" />
              <Select
                value={period}
                onValueChange={(val) =>
                  onPeriodChange(val as "MONTH" | "QUARTER" | "YEAR")
                }
              >
                <SelectTrigger className="h-8 border-0 bg-transparent text-xs font-semibold focus:ring-0 shadow-none px-2 w-[110px]">
                  <SelectValue placeholder="Kỳ báo cáo" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="MONTH" className="text-xs font-medium">
                    Tháng này
                  </SelectItem>
                  <SelectItem value="QUARTER" className="text-xs font-medium">
                    Quý này
                  </SelectItem>
                  <SelectItem value="YEAR" className="text-xs font-medium">
                    Năm nay
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-8 px-2.5 text-xs gap-1.5 bg-card shadow-2xs font-medium"
            >
              <RefreshCw
                className={cn(
                  "h-3.5 w-3.5",
                  isRefreshing && "animate-spin text-primary"
                )}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
