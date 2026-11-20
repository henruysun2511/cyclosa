"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DashboardKpiItem {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconBgColor: string; // e.g. "bg-primary text-white", "bg-emerald-600 text-white"
  change?: number; // percentage change vs prev period e.g. +4.5 or -2.1
  changeLabel?: string; // e.g. "so với tháng trước"
  sparkline?: number[]; // array of 5-7 points
}

export interface DashboardKpiCardsProps {
  items: DashboardKpiItem[];
  isLoading?: boolean;
  className?: string;
}

export function DashboardKpiCards({
  items,
  isLoading = false,
  className,
}: DashboardKpiCardsProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-card border-border shadow-xs rounded-xl">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const hasChange = item.change !== undefined && item.change !== null;
        const isPositive = hasChange && item.change! > 0;
        const isNegative = hasChange && item.change! < 0;

        // Simple SVG sparkline
        const pts = item.sparkline && item.sparkline.length > 1 ? item.sparkline : null;
        let sparkPath = "";
        if (pts) {
          const min = Math.min(...pts);
          const max = Math.max(...pts);
          const range = max - min || 1;
          const w = 64;
          const h = 22;
          sparkPath = pts
            .map((v, i) => {
              const x = (i / (pts.length - 1)) * w;
              const y = h - ((v - min) / range) * (h - 6) - 3;
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
        }

        return (
          <Card
            key={item.id}
            className="p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-all bg-card border-border rounded-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
                  {item.title}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {item.value}
                  </span>
                  {item.unit && (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Rule 03: Solid saturated icon box h-12 w-12 rounded-xl */}
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 font-bold",
                  item.iconBgColor
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            {/* Bottom Row: Trend badge & Sparkline */}
            <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-[11px]">
              {hasChange ? (
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={cn(
                      "flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md text-[10px]",
                      isPositive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        : isNegative
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                        : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : isNegative ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {item.change}%
                    </span>
                  </span>
                  <span className="text-muted-foreground font-medium truncate">
                    {item.changeLabel || "kỳ trước"}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground font-medium text-[10px]">
                  Cập nhật thời gian thực
                </span>
              )}

              {/* Mini Sparkline */}
              {sparkPath && (
                <svg width="64" height="22" className="overflow-visible">
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke={isNegative ? "#ef4444" : "#10b981"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
