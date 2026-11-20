"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface RadialGaugeChartProps {
  value: number;
  maxValue?: number;
  label?: string;
  unit?: string;
  subText?: string;
  size?: number;
  strokeWidth?: number;
  colorScheme?: "emerald" | "blue" | "amber" | "rose" | "dynamic";
  className?: string;
}

export function RadialGaugeChart({
  value,
  maxValue = 100,
  label = "Tỷ lệ",
  unit = "%",
  subText,
  size = 175,
  strokeWidth = 16,
  colorScheme = "dynamic",
  className,
}: RadialGaugeChartProps) {
  const clampedVal = Math.max(0, Math.min(maxValue, value));
  const percent = maxValue > 0 ? clampedVal / maxValue : 0;

  const radius = (size - strokeWidth) / 2;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength * (1 - percent);

  let primaryColor = "#2563eb";
  if (colorScheme === "emerald") primaryColor = "#059669";
  else if (colorScheme === "amber") primaryColor = "#d97706";
  else if (colorScheme === "rose") primaryColor = "#dc2626";
  else if (colorScheme === "dynamic") {
    if (percent >= 0.8) primaryColor = "#059669";
    else if (percent >= 0.5) primaryColor = "#d97706";
    else primaryColor = "#dc2626";
  }

  const angleRad = Math.PI * (1 - percent);
  const dotX = size / 2 - radius * Math.cos(angleRad);
  const dotY = size / 2 - radius * Math.sin(angleRad);

  return (
    <div className={cn("flex flex-col items-center justify-center select-none", className)}>
      <div className="relative" style={{ width: size, height: size * 0.62 }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`gauge-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Value Arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2}`}
            fill="none"
            stroke={colorScheme === "dynamic" ? `url(#gauge-grad-${size})` : primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Indicator Dot at tip */}
          {percent > 0.02 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 + 1}
              fill="#ffffff"
              stroke={primaryColor}
              strokeWidth={3.5}
              className="shadow-md transition-all duration-700 ease-out"
            />
          )}
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-end text-center">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {clampedVal.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-muted-foreground">{unit}</span>
          </div>
          {label && (
            <span className="text-xs font-semibold text-muted-foreground line-clamp-1">
              {label}
            </span>
          )}
        </div>
      </div>

      {subText && (
        <span className="text-[11px] font-semibold text-foreground mt-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-border">
          {subText}
        </span>
      )}
    </div>
  );
}
