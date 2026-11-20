"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface BellCurveGrade {
  tier: string;
  actualCount: number;
  actualPercent: number; // 0-100
  targetPercent: number; // 0-100
  colorClass?: string;
  fillHex?: string;
}

export interface BellCurveChartProps {
  grades: BellCurveGrade[];
  height?: number;
  className?: string;
}

export function BellCurveChart({
  grades,
  height = 230,
  className,
}: BellCurveChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!grades || grades.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
        Không có dữ liệu phân bổ chuông đánh giá
      </div>
    );
  }

  const defaultTiers = [
    { color: "#059669", label: "Xuất sắc" },
    { color: "#2563eb", label: "Tốt" },
    { color: "#d97706", label: "Đạt" },
    { color: "#dc2626", label: "Cần cải thiện" },
  ];

  const chartWidth = 520;
  const chartHeight = height;
  const paddingLeft = 30;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    1,
    ...grades.map((g) => Math.max(g.actualPercent, g.targetPercent))
  ) * 1.2;

  // Generate smooth Gaussian bell curve points across innerWidth
  const bellPointsCount = 60;
  const bellCurvePoints: { x: number; y: number }[] = [];
  const mean = innerWidth / 2;
  const stdDev = innerWidth / 4.8;

  for (let i = 0; i <= bellPointsCount; i++) {
    const x = (i / bellPointsCount) * innerWidth;
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    const gaussian = Math.exp(exponent);
    const yVal = gaussian * 0.95;
    const y = paddingTop + innerHeight - yVal * innerHeight;
    bellCurvePoints.push({ x: paddingLeft + x, y });
  }

  const bellLinePath =
    bellCurvePoints.reduce(
      (acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`,
      ""
    );
  const bellAreaPath = `${bellLinePath} L ${
    bellCurvePoints[bellCurvePoints.length - 1].x
  } ${paddingTop + innerHeight} L ${bellCurvePoints[0].x} ${
    paddingTop + innerHeight
  } Z`;

  const colWidth = innerWidth / grades.length;
  const barWidth = Math.min(42, colWidth * 0.55);

  return (
    <div className={cn("w-full space-y-3 select-none", className)}>
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground pb-1 font-medium">
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-slate-500 border-t-2 border-dashed" />
          <span>Chuông chuẩn lý tưởng</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-xs bg-primary" />
          <span className="font-semibold text-foreground">Thực tế doanh nghiệp</span>
        </div>
      </div>

      {/* SVG Bell Curve Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="bell-curve-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Bell Curve Area Fill */}
          <path
            d={bellAreaPath}
            fill="url(#bell-curve-grad)"
          />

          {/* Theoretical Gauss Curve Line */}
          <path
            d={bellLinePath}
            fill="none"
            stroke="#2563eb"
            strokeOpacity={0.8}
            strokeWidth={2}
            strokeDasharray="4 3"
          />

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

          {/* Actual Bars & Markers */}
          {grades.map((grade, idx) => {
            const centerX = paddingLeft + (idx + 0.5) * colWidth;
            const barHeight = (grade.actualPercent / maxVal) * innerHeight;
            const barY = paddingTop + innerHeight - barHeight;
            const isHovered = hoveredIdx === idx;
            const color =
              grade.fillHex ||
              defaultTiers[idx % defaultTiers.length].color;

            const targetY =
              paddingTop + innerHeight - (grade.targetPercent / maxVal) * innerHeight;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Column Background Highlight */}
                {isHovered && (
                  <rect
                    x={centerX - colWidth / 2 + 2}
                    y={paddingTop}
                    width={colWidth - 4}
                    height={innerHeight}
                    fill="currentColor"
                    fillOpacity={0.06}
                    rx={6}
                  />
                )}

                {/* Actual Bar */}
                <rect
                  x={centerX - barWidth / 2}
                  y={barY}
                  width={barWidth}
                  height={Math.max(3, barHeight)}
                  fill={color}
                  rx={4}
                  className="transition-all duration-200"
                  opacity={hoveredIdx !== null && !isHovered ? 0.6 : 1}
                />

                {/* Target line indicator */}
                <line
                  x1={centerX - barWidth / 2 - 4}
                  y1={targetY}
                  x2={centerX + barWidth / 2 + 4}
                  y2={targetY}
                  stroke="#334155"
                  strokeWidth={2.5}
                />

                {/* Top percentage text */}
                <text
                  x={centerX}
                  y={barY - 6}
                  textAnchor="middle"
                  className={cn(
                    "text-[11px] font-bold transition-colors",
                    isHovered ? "fill-primary" : "fill-foreground"
                  )}
                >
                  {grade.actualPercent.toFixed(1)}%
                </text>

                {/* Tier Label */}
                <text
                  x={centerX}
                  y={paddingTop + innerHeight + 16}
                  textAnchor="middle"
                  className={cn(
                    "text-[11px] font-bold transition-colors",
                    isHovered ? "fill-primary" : "fill-foreground"
                  )}
                >
                  {grade.tier}
                </text>

                {/* Employee Count */}
                <text
                  x={centerX}
                  y={paddingTop + innerHeight + 30}
                  textAnchor="middle"
                  className="fill-muted-foreground font-semibold text-[10px]"
                >
                  {grade.actualCount} nhân sự
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && grades[hoveredIdx] && (
          <div className="absolute top-2 right-2 pointer-events-none z-10 rounded-xl border border-border bg-popover px-3.5 py-2.5 text-xs shadow-md space-y-1 animate-in fade-in-50">
            <div className="font-bold text-foreground border-b border-border pb-1 text-xs">
              Xếp loại: {grades[hoveredIdx].tier}
            </div>
            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between gap-4 text-muted-foreground font-medium">
                <span>Thực tế:</span>
                <span className="font-bold text-foreground">
                  {grades[hoveredIdx].actualPercent.toFixed(1)}% ({grades[hoveredIdx].actualCount} người)
                </span>
              </div>
              <div className="flex justify-between gap-4 text-muted-foreground font-medium">
                <span>Khuyến nghị Gauss:</span>
                <span className="font-bold text-foreground">
                  {grades[hoveredIdx].targetPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-border text-[11px]">
                <span className="font-medium text-muted-foreground">Chênh lệch:</span>
                <span
                  className={cn(
                    "font-bold",
                    grades[hoveredIdx].actualPercent - grades[hoveredIdx].targetPercent > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {(grades[hoveredIdx].actualPercent - grades[hoveredIdx].targetPercent > 0 ? "+" : "") +
                    (grades[hoveredIdx].actualPercent - grades[hoveredIdx].targetPercent).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
