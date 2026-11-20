"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AreaTrendDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AreaTrendChartProps {
  data: AreaTrendDataPoint[];
  height?: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export function AreaTrendChart({
  data,
  height = 240,
  primaryLabel = "Số lượng",
  secondaryLabel,
  valueFormatter = (v) => v.toLocaleString("vi-VN"),
  className,
}: AreaTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground font-medium">
        Không có dữ liệu xu hướng
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const secondaryValues = data.map((d) => d.secondaryValue ?? 0);
  const maxVal = Math.max(1, ...values, ...secondaryValues) * 1.15;
  const minVal = 0;

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = 500;
  const chartHeight = height;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / Math.max(1, data.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((d.value - minVal) / (maxVal - minVal)) * innerHeight;
    return { x, y, ...d };
  });

  const secondaryPoints = data.map((d, i) => {
    const sVal = d.secondaryValue ?? 0;
    const x = paddingLeft + (i / Math.max(1, data.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((sVal - minVal) / (maxVal - minVal)) * innerHeight;
    return { x, y, sVal };
  });

  const createSplinePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = createSplinePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  const secondaryLinePath = secondaryLabel ? createSplinePath(secondaryPoints) : "";

  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: Math.round(minVal + pct * (maxVal - minVal)),
    y: paddingTop + innerHeight - pct * innerHeight,
  }));

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className={cn("w-full space-y-2 select-none", className)}>
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground pb-1 font-medium">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-primary" />
          <span className="font-semibold text-foreground">{primaryLabel}</span>
        </div>
        {secondaryLabel && (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-xs bg-emerald-600" />
            <span className="font-semibold text-foreground">{secondaryLabel}</span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="area-trend-grad-primary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="area-trend-grad-secondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-Axis Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={chartWidth - paddingRight}
                y2={tick.y}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] font-semibold"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Baseline */}
          <line
            x1={paddingLeft}
            y1={paddingTop + innerHeight}
            x2={chartWidth - paddingRight}
            y2={paddingTop + innerHeight}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#area-trend-grad-primary)" />

          {/* Primary Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* Secondary Trend Line if exists */}
          {secondaryLinePath && (
            <path
              d={secondaryLinePath}
              fill="none"
              stroke="#059669"
              strokeWidth={2}
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          )}

          {/* Points & Interactive Hover Columns */}
          {points.map((pt, i) => {
            const isHovered = hoverIndex === i;
            const colW = innerWidth / points.length;

            return (
              <g key={i}>
                <rect
                  x={pt.x - colW / 2}
                  y={paddingTop}
                  width={colW}
                  height={innerHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />

                {/* Point dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150 pointer-events-none"
                />

                {/* X-axis Label */}
                <text
                  x={pt.x}
                  y={paddingTop + innerHeight + 18}
                  textAnchor="middle"
                  className={cn(
                    "text-[10px] transition-colors pointer-events-none",
                    isHovered
                      ? "fill-primary font-bold text-[11px]"
                      : "fill-muted-foreground font-semibold"
                  )}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {activePoint && (
          <div className="absolute top-2 right-2 pointer-events-none z-10 rounded-xl border border-border bg-popover px-3.5 py-2.5 text-xs shadow-md space-y-1 animate-in fade-in-50">
            <div className="font-bold text-foreground border-b border-border pb-1 text-xs">
              Kỳ: {activePoint.label}
            </div>
            <div className="flex items-center justify-between gap-4 pt-0.5">
              <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {primaryLabel}:
              </span>
              <span className="font-bold text-foreground">
                {valueFormatter(activePoint.value)}
              </span>
            </div>
            {secondaryLabel && activePoint.secondaryValue !== undefined && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  {secondaryLabel}:
                </span>
                <span className="font-bold text-foreground">
                  {valueFormatter(activePoint.secondaryValue)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
