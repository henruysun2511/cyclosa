"use client";

import React from "react";
import { Building2, MapPin } from "lucide-react";
import type { CompanyStats } from "../types/company.types";

export interface CompanyKpiCardsProps {
  stats: CompanyStats;
}

export function CompanyKpiCards({ stats }: CompanyKpiCardsProps) {
  const cards = [
    {
      title: "Total Companies",
      value: stats.totalCompanies,
      icon: Building2,
      iconBg: "bg-primary",
      chartColor: "#DC2626",
      chartType: "curve-orange",
    },
    {
      title: "Active Companies",
      value: stats.activeCompanies,
      icon: Building2,
      iconBg: "bg-accent",
      chartColor: "#22C55E",
      chartType: "curve-green",
    },
    {
      title: "Inactive Companies",
      value: stats.inactiveCompanies,
      icon: Building2,
      iconBg: "bg-destructive",
      chartColor: "#EF4444",
      chartType: "zigzag-red",
    },
    {
      title: "Company Location",
      value: stats.companyLocation,
      icon: MapPin,
      iconBg: "bg-[#38BDF8]",
      chartColor: "#38BDF8",
      chartType: "curve-blue",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="kpi-card">
            {/* Left: Info and Icon */}
            <div className="flex items-center gap-3.5">
              <div className={`kpi-icon-wrapper ${card.iconBg}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="kpi-title">{card.title}</p>
                <h3 className="kpi-value">{card.value}</h3>
              </div>
            </div>

            {/* Right: Trend SVG Sparkline */}
            <div className="h-9 w-20 shrink-0 opacity-85">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                {card.chartType === "curve-orange" && (
                  <>
                    <defs>
                      <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,35 Q25,38 50,22 T100,8 L100,45 L0,45 Z"
                      fill="url(#grad-orange)"
                    />
                    <path
                      d="M0,35 Q25,38 50,22 T100,8"
                      fill="none"
                      stroke={card.chartColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {card.chartType === "curve-green" && (
                  <>
                    <defs>
                      <linearGradient id="grad-green" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,38 Q30,42 60,18 T100,5 L100,45 L0,45 Z"
                      fill="url(#grad-green)"
                    />
                    <path
                      d="M0,38 Q30,42 60,18 T100,5"
                      fill="none"
                      stroke={card.chartColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {card.chartType === "zigzag-red" && (
                  <>
                    <defs>
                      <linearGradient id="grad-red" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,15 L25,32 L55,20 L75,38 L100,28 L100,45 L0,45 Z"
                      fill="url(#grad-red)"
                    />
                    <path
                      d="M0,15 L25,32 L55,20 L75,38 L100,28"
                      fill="none"
                      stroke={card.chartColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {card.chartType === "curve-blue" && (
                  <>
                    <defs>
                      <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,30 Q35,12 70,25 T100,10 L100,45 L0,45 Z"
                      fill="url(#grad-blue)"
                    />
                    <path
                      d="M0,30 Q35,12 70,25 T100,10"
                      fill="none"
                      stroke={card.chartColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const KpiCards = CompanyKpiCards;
