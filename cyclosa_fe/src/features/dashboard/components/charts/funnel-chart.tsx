"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, CheckCircle2 } from "lucide-react";

export interface FunnelStage {
  label: string;
  count: number;
  conversionRate?: number; // Conversion from previous step (0-100)
  colorClass?: string;
  fillHex?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
  valueFormatter?: (val: number) => string;
}

export function FunnelChart({
  stages,
  className,
  valueFormatter = (v) => v.toLocaleString("vi-VN"),
}: FunnelChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!stages || stages.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
        Không có dữ liệu phễu tuyển dụng
      </div>
    );
  }

  const initialCount = stages[0]?.count || 1;
  const stagePalette = [
    "#2563eb", // blue-600
    "#0891b2", // cyan-600
    "#7c3aed", // violet-600
    "#d97706", // amber-600
    "#059669", // emerald-600
  ];

  return (
    <div className={cn("w-full space-y-2 py-1", className)}>
      {stages.map((stage, idx) => {
        const isHovered = hoveredIdx === idx;
        const widthPct = Math.max(10, Math.min(100, (stage.count / initialCount) * 100));
        const color = stage.fillHex || stagePalette[idx % stagePalette.length];
        
        // Calculate step-to-step drop rate
        const prevCount = idx > 0 ? stages[idx - 1].count : null;
        const stepRate =
          stage.conversionRate !== undefined
            ? stage.conversionRate
            : prevCount && prevCount > 0
            ? Math.round((stage.count / prevCount) * 100)
            : 100;

        const isLast = idx === stages.length - 1;

        return (
          <React.Fragment key={idx}>
            <div
              className={cn(
                "flex flex-col gap-2 p-3.5 rounded-xl border transition-all cursor-pointer bg-card shadow-xs",
                isHovered
                  ? "border-primary ring-2 ring-primary/20 shadow-sm"
                  : "border-border hover:border-primary/40 hover:shadow-xs"
              )}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Top row: Stage Name & Metrics */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white shadow-xs shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {isLast ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-foreground">
                      {stage.label}
                    </span>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {idx === 0
                        ? "100% hồ sơ tiếp nhận ban đầu"
                        : `${((stage.count / initialCount) * 100).toFixed(1)}% tỷ lệ giữ lại so với đầu vào`}
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-base font-bold text-foreground">
                    {valueFormatter(stage.count)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">ứng viên</span>
                </div>
              </div>

              {/* Bottom row: Solid high-contrast progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>

            {/* Transition indicator between stages */}
            {!isLast && (
              <div className="flex items-center justify-center -my-1 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-foreground px-3 py-0.5 rounded-full border border-border shadow-2xs">
                  <ArrowDown className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground font-normal">Tỷ lệ chuyển đổi:</span>
                  <span
                    className={cn(
                      "font-bold",
                      stepRate >= 50
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {stepRate}%
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
