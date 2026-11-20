"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";

export interface RankItem {
  id?: string;
  label: string;
  value: number;
  subText?: string;
  secondaryValue?: number;
}

export interface HorizontalRankChartProps {
  items: RankItem[];
  maxItems?: number;
  valueFormatter?: (val: number) => string;
  unit?: string;
  barColor?: string; // e.g. "bg-primary", "bg-emerald-600", "bg-purple-600"
  className?: string;
}

export function HorizontalRankChart({
  items,
  maxItems = 5,
  valueFormatter = (v) => v.toLocaleString("vi-VN"),
  unit,
  barColor = "bg-primary",
  className,
}: HorizontalRankChartProps) {
  if (!items || items.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-muted-foreground">
        Không có dữ liệu xếp hạng
      </div>
    );
  }

  const displayItems = items.slice(0, maxItems);
  const maxVal = Math.max(1, ...displayItems.map((i) => i.value));

  const getRankBadge = (rank: number) => {
    if (rank === 0) {
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white font-bold text-[10px] shadow-2xs">
          <Medal className="h-3 w-3" />
        </span>
      );
    }
    if (rank === 1) {
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white font-bold text-[10px] shadow-2xs">
          2
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-700 text-white font-bold text-[10px] shadow-2xs">
          3
        </span>
      );
    }
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
        {rank + 1}
      </span>
    );
  };

  return (
    <div className={cn("space-y-3.5 py-1", className)}>
      {displayItems.map((item, idx) => {
        const pct = Math.max(5, Math.min(100, (item.value / maxVal) * 100));

        return (
          <div key={idx} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate pr-2">
                {getRankBadge(idx)}
                <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                {item.subText && (
                  <span className="text-[11px] text-muted-foreground font-medium truncate hidden sm:inline">
                    • {item.subText}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 shrink-0 font-bold text-foreground">
                <span>{valueFormatter(item.value)}</span>
                {unit && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {unit}
                  </span>
                )}
              </div>
            </div>

            {/* Solid Progress Track */}
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out shadow-2xs",
                  barColor
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
