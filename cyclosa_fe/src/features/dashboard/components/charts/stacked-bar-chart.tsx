"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface StackedBarSeries {
  name: string;
  colorClass: string;
  fillHex?: string;
}

export interface StackedBarItem {
  label: string;
  values: number[];
  subLabel?: string;
}

export interface StackedBarChartProps {
  series: StackedBarSeries[];
  data: StackedBarItem[];
  height?: number;
  stacked?: boolean;
  rotateLabels?: boolean;
  valueFormatter?: (val: number) => string;
  className?: string;
}

export function StackedBarChart({
  series,
  data,
  height = 250,
  stacked = true,
  rotateLabels,
  valueFormatter = (v) => v.toLocaleString("vi-VN"),
  className,
}: StackedBarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<{ barIdx: number; seriesIdx?: number } | null>(null);

  if (!data || data.length === 0 || !series || series.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground font-medium">
        Không có dữ liệu biểu đồ cột
      </div>
    );
  }

  const shouldRotate =
    rotateLabels !== undefined
      ? rotateLabels
      : data.length >= 4 || data.some((d) => d.label.length > 8);

  const shortenLabel = (text: string) => {
    let clean = text.replace(/[()]/g, "").trim();
    clean = clean
      .replace(/Phòng Phát triển Phần mềm/gi, "PT Phần mềm")
      .replace(/Phòng Đảm bảo Chất lượng/gi, "Đảm bảo CL")
      .replace(/Ban Nhân sự & Hành chính/gi, "Nhân sự & HC")
      .replace(/Phòng Tài chính Kế toán/gi, "Tài chính KT")
      .replace(/Khối Công nghệ & Sản phẩm/gi, "Khối CN & SP")
      .replace(/Ban Tổng Giám đốc/gi, "Ban TGĐ")
      .replace(/Chi nhánh/gi, "CN")
      .replace(/Văn phòng/gi, "VP");
    return clean.length > 15 ? clean.slice(0, 14) + "…" : clean;
  };

  const itemTotals = data.map((d) => d.values.reduce((acc, v) => acc + (v || 0), 0));
  const maxVal = stacked
    ? Math.max(1, ...itemTotals) * 1.15
    : Math.max(1, ...data.flatMap((d) => d.values)) * 1.15;

  const paddingLeft = 40;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = shouldRotate ? 80 : 36;

  const chartWidth = Math.max(600, data.length * 90);
  const chartHeight = shouldRotate ? height + 50 : height;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const groupWidth = innerWidth / data.length;
  const barWidth = stacked
    ? Math.min(36, groupWidth * 0.55)
    : Math.min(24, (groupWidth * 0.8) / series.length);

  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: Math.round(pct * maxVal),
    y: paddingTop + innerHeight - pct * innerHeight,
  }));

  const defaultColors = [
    "#2563eb",
    "#059669",
    "#d97706",
    "#7c3aed",
    "#db2777",
    "#0891b2",
  ];

  return (
    <div className={cn("w-full space-y-3 select-none", className)}>
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-end gap-4 text-xs text-muted-foreground pb-0.5 font-medium">
        {series.map((s, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={cn("h-3 w-3 rounded-xs shrink-0", s.colorClass)}
              style={s.fillHex ? { backgroundColor: s.fillHex } : undefined}
            />
            <span className="font-semibold text-foreground">{s.name}</span>
          </div>
        ))}
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
        >
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

          {/* Bars */}
          {data.map((item, barIdx) => {
            const groupCenterX = paddingLeft + (barIdx + 0.5) * groupWidth;
            const displayLabel = shouldRotate
              ? shortenLabel(item.label)
              : item.label.length > 12
              ? item.label.slice(0, 11) + "…"
              : item.label;

            if (stacked) {
              let currentY = paddingTop + innerHeight;
              return (
                <g
                  key={barIdx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex({ barIdx })}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Column highlight hover */}
                  {hoverIndex?.barIdx === barIdx && (
                    <rect
                      x={groupCenterX - groupWidth / 2 + 2}
                      y={paddingTop}
                      width={groupWidth - 4}
                      height={innerHeight}
                      fill="currentColor"
                      fillOpacity={0.06}
                      rx={6}
                    />
                  )}

                  {item.values.map((val, sIdx) => {
                    const segmentHeight = (val / maxVal) * innerHeight;
                    const segY = currentY - segmentHeight;
                    currentY = segY;

                    const isTopSegment = sIdx === item.values.length - 1;

                    return (
                      <rect
                        key={sIdx}
                        x={groupCenterX - barWidth / 2}
                        y={segY}
                        width={barWidth}
                        height={Math.max(0, segmentHeight)}
                        fill={series[sIdx]?.fillHex || defaultColors[sIdx % defaultColors.length]}
                        rx={isTopSegment ? 4 : 0}
                        className={cn(
                          "transition-all duration-200",
                          hoverIndex?.barIdx === barIdx ? "opacity-100" : "opacity-95 hover:opacity-100"
                        )}
                      />
                    );
                  })}

                  {/* Total on top if hovered */}
                  {hoverIndex?.barIdx === barIdx && itemTotals[barIdx] > 0 && (
                    <text
                      x={groupCenterX}
                      y={currentY - 6}
                      textAnchor="middle"
                      className="fill-foreground text-[11px] font-bold"
                    >
                      {valueFormatter(itemTotals[barIdx])}
                    </text>
                  )}

                  {/* X-axis Label */}
                  <text
                    x={shouldRotate ? groupCenterX - 4 : groupCenterX}
                    y={shouldRotate ? paddingTop + innerHeight + 16 : paddingTop + innerHeight + 18}
                    transform={
                      shouldRotate
                        ? `rotate(-45, ${groupCenterX - 4}, ${paddingTop + innerHeight + 16})`
                        : undefined
                    }
                    textAnchor={shouldRotate ? "end" : "middle"}
                    className={cn(
                      "text-[10px] transition-colors select-none",
                      hoverIndex?.barIdx === barIdx
                        ? "fill-primary font-bold text-[11px]"
                        : "fill-muted-foreground font-semibold"
                    )}
                  >
                    <title>{item.label}</title>
                    {displayLabel}
                  </text>
                </g>
              );
            } else {
              const totalGroupWidth = series.length * barWidth;
              const startX = groupCenterX - totalGroupWidth / 2;

              return (
                <g
                  key={barIdx}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex({ barIdx })}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {item.values.map((val, sIdx) => {
                    const bHeight = (val / maxVal) * innerHeight;
                    const bX = startX + sIdx * barWidth;
                    const bY = paddingTop + innerHeight - bHeight;

                    return (
                      <rect
                        key={sIdx}
                        x={bX + 1}
                        y={bY}
                        width={barWidth - 2}
                        height={Math.max(0, bHeight)}
                        fill={series[sIdx]?.fillHex || defaultColors[sIdx % defaultColors.length]}
                        rx={3}
                        className="transition-all duration-200 opacity-95 hover:opacity-100"
                      />
                    );
                  })}

                  {/* X-axis Label */}
                  <text
                    x={shouldRotate ? groupCenterX - 4 : groupCenterX}
                    y={shouldRotate ? paddingTop + innerHeight + 16 : paddingTop + innerHeight + 18}
                    transform={
                      shouldRotate
                        ? `rotate(-45, ${groupCenterX - 4}, ${paddingTop + innerHeight + 16})`
                        : undefined
                    }
                    textAnchor={shouldRotate ? "end" : "middle"}
                    className={cn(
                      "text-[10px] transition-colors select-none",
                      hoverIndex?.barIdx === barIdx
                        ? "fill-primary font-bold text-[11px]"
                        : "fill-muted-foreground font-semibold"
                    )}
                  >
                    <title>{item.label}</title>
                    {displayLabel}
                  </text>
                </g>
              );
            }
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {hoverIndex !== null && data[hoverIndex.barIdx] && (
          <div className="absolute top-2 right-2 pointer-events-none z-10 rounded-xl border border-border bg-popover px-3.5 py-2.5 text-xs shadow-md space-y-1 animate-in fade-in-50">
            <div className="font-bold text-foreground border-b border-border pb-1 text-xs">
              {data[hoverIndex.barIdx].label.replace(/[()]/g, "")}
            </div>
            <div className="space-y-1 pt-1">
              {series.map((s, sIdx) => {
                const val = data[hoverIndex.barIdx].values[sIdx] ?? 0;
                return (
                  <div key={sIdx} className="flex items-center justify-between gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-xs shrink-0"
                        style={{
                          backgroundColor:
                            s.fillHex || defaultColors[sIdx % defaultColors.length],
                        }}
                      />
                      <span>{s.name}:</span>
                    </div>
                    <span className="font-bold text-foreground">
                      {valueFormatter(val)}
                    </span>
                  </div>
                );
              })}
              {stacked && (
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-border text-xs font-bold text-foreground">
                  <span>Tổng cộng:</span>
                  <span>{valueFormatter(itemTotals[hoverIndex.barIdx])}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
