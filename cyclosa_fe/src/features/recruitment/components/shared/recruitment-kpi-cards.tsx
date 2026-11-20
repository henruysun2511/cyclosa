"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { KpiCardItem } from "@/components/shared/kpi-metric-cards";

interface RecruitmentKpiCardsProps {
  cards: KpiCardItem[];
  defaultCollapsed?: boolean;
}

export function RecruitmentKpiCards({
  cards,
}: RecruitmentKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        const sparkPath =
          idx === 0
            ? "M0,35 Q25,38 50,22 T100,8"
            : idx === 1
            ? "M0,38 Q30,42 60,18 T100,5"
            : idx === 2
            ? "M0,30 Q35,12 70,25 T100,10"
            : "M0,25 Q30,35 60,15 T100,20";
        const sparkColor = item.chartColor || "#DC2626";

        return (
          <div
            key={item.title + idx}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all group bg-card",
              "border-border hover:border-primary/40 hover:shadow-md cursor-pointer"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg || "bg-primary text-white"
                )}
              >
                {Icon && <Icon className="h-6 w-6" />}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {item.value}
                </h3>
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 100 40">
                <path
                  d={sparkPath}
                  fill="none"
                  stroke={sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
