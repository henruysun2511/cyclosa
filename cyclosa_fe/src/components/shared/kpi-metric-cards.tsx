"use client";

import React from "react";
import { Layers, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export interface KpiCardItem {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ElementType;
  iconBg?: string;
  chartColor?: string;
  chartType?: "curve-red" | "curve-green" | "curve-amber" | "curve-blue";
}

export interface MetricItem {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ElementType;
}

export interface KpiMetricCardsProps {
  cards?: KpiCardItem[];
  metrics?: MetricItem[];
}

export function KpiMetricCards({ cards, metrics }: KpiMetricCardsProps) {
  const defaultCards: KpiCardItem[] = [
    {
      title: "Tổng số bản ghi",
      value: "128",
      change: "+8.4%",
      isPositive: true,
      subtext: "Tất cả dữ liệu trong hệ thống",
      icon: Layers,
      iconBg: "bg-primary",
      chartColor: "#DC2626",
      chartType: "curve-red",
    },
    {
      title: "Đang hoạt động",
      value: "96",
      change: "+3.2%",
      isPositive: true,
      subtext: "Đạt 75% công suất vận hành",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500",
      chartColor: "#22C55E",
      chartType: "curve-green",
    },
    {
      title: "Chờ phê duyệt",
      value: "24",
      change: "Đang xử lý",
      isPositive: false,
      subtext: "Cần xử lý trong tuần này",
      icon: Clock,
      iconBg: "bg-amber-500",
      chartColor: "#F59E0B",
      chartType: "curve-amber",
    },
    {
      title: "Cần xử lý",
      value: "8",
      change: "Ưu tiên cao",
      isPositive: false,
      subtext: "Yêu cầu can thiệp ngay",
      icon: AlertCircle,
      iconBg: "bg-sky-500",
      chartColor: "#38BDF8",
      chartType: "curve-blue",
    },
  ];

  let items: KpiCardItem[] = defaultCards;

  if (cards && cards.length > 0) {
    items = cards;
  } else if (metrics && metrics.length > 0) {
    const defaultPalette = [
      { icon: Layers, iconBg: "bg-primary", chartColor: "#DC2626", chartType: "curve-red" as const },
      { icon: CheckCircle2, iconBg: "bg-emerald-500", chartColor: "#22C55E", chartType: "curve-green" as const },
      { icon: Clock, iconBg: "bg-amber-500", chartColor: "#F59E0B", chartType: "curve-amber" as const },
      { icon: AlertCircle, iconBg: "bg-sky-500", chartColor: "#38BDF8", chartType: "curve-blue" as const },
    ];

    items = metrics.map((m, idx) => {
      const p = defaultPalette[idx % defaultPalette.length];
      return {
        title: m.title,
        value: m.value,
        change: m.change,
        isPositive: m.isPositive ?? true,
        subtext: m.subtext,
        icon: m.icon || p.icon,
        iconBg: p.iconBg,
        chartColor: p.chartColor,
        chartType: p.chartType,
      };
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((card, idx) => {
        const Icon = card.icon || Layers;
        const gradId = `kpi-grad-${idx}-${card.chartType || "red"}`;
        const color = card.chartColor || "#DC2626";
        const hasChange = Boolean(card.change);
        const isUp = card.isPositive ?? true;

        return (
          <div
            key={card.title + idx}
            className="bg-white p-5 rounded-xl border border-border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between group"
          >
            {/* Top row: Icon and Trend Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className={`h-10 w-10 rounded-lg ${card.iconBg || "bg-primary"} text-white flex items-center justify-center shadow-2xs shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>

              {hasChange && (
                <div
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                    isUp
                      ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                      : "text-rose-700 bg-rose-50 border border-rose-200"
                  }`}
                >
                  <span>{card.change}</span>
                </div>
              )}
            </div>

            {/* Bottom: Title & Value & Sparkline */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5 truncate">
                {card.title}
              </p>
              <div className="flex items-end justify-between gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {card.value}
                </h3>

                {/* Micro Sparkline */}
                <div className="h-8 w-16 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q25,38 50,22 T100,8 L100,45 L0,45 Z"
                      fill={`url(#${gradId})`}
                    />
                    <path
                      d="M0,35 Q25,38 50,22 T100,8"
                      fill="none"
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {card.subtext && (
                <p className="text-[11px] text-gray-500 mt-1 truncate">
                  {card.subtext}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
