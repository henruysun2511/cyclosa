"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
  colorClass?: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
  valueFormatter?: (val: number) => string;
  showLegend?: boolean;
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function DonutChart({
  data,
  size = 160,
  thickness = 20,
  centerLabel = "Tổng",
  centerValue,
  valueFormatter = (v) => v.toLocaleString("vi-VN"),
  showLegend = true,
  layout = "vertical",
  className,
}: DonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const defaultPalette = [
    "#2563eb", // blue-600
    "#059669", // emerald-600
    "#d97706", // amber-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
    "#0891b2", // cyan-600
    "#475569", // slate-600
  ];

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-xs text-muted-foreground font-medium gap-1">
        <span>Không có dữ liệu phân bổ</span>
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const segments = data.map((item, idx) => {
    const percent = total > 0 ? item.value / total : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...item,
      label: item.label.replace(/[()]/g, ""),
      percent,
      strokeDasharray,
      strokeDashoffset,
      colorHex: item.color || defaultPalette[idx % defaultPalette.length],
    };
  });

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;
  const isVertical = layout === "vertical";

  return (
    <div
      className={cn(
        "w-full select-none",
        isVertical
          ? "flex flex-col items-center justify-center gap-4"
          : "flex flex-col md:flex-row items-center justify-center gap-6",
        className
      )}
    >
      {/* SVG Donut Circle */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 overflow-visible"
        >
          {/* Base Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={thickness}
          />

          {/* Value Segments */}
          {segments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.colorHex}
                strokeWidth={isHovered ? thickness + 4 : thickness}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                style={{
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2">
          {activeSegment ? (
            <>
              <span className="text-[10px] text-muted-foreground uppercase font-bold line-clamp-1 max-w-[100px]">
                {activeSegment.label}
              </span>
              <span className="text-xl font-bold text-foreground">
                {valueFormatter(activeSegment.value)}
              </span>
              <span className="text-xs font-bold text-primary">
                {(activeSegment.percent * 100).toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {centerLabel}
              </span>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {centerValue !== undefined ? centerValue : valueFormatter(total)}
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">
                {data.length} nhóm
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      {showLegend && (
        <div
          className={cn(
            "w-full",
            isVertical
              ? "pt-3 border-t border-border/60 space-y-1.5"
              : "flex flex-col gap-2 min-w-[160px] max-w-[240px]"
          )}
        >
          {segments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between gap-3 text-xs p-1.5 rounded-lg transition-colors cursor-pointer",
                  isHovered
                    ? "bg-slate-100 dark:bg-slate-800 font-bold"
                    : "hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                )}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2 min-w-0 mr-1">
                  <span
                    className="h-3 w-3 rounded-xs shrink-0 shadow-2xs"
                    style={{ backgroundColor: seg.colorHex }}
                  />
                  <span className="truncate text-foreground text-xs font-medium">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-xs font-bold">
                  <span className="text-foreground">
                    {valueFormatter(seg.value)}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {(seg.percent * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
