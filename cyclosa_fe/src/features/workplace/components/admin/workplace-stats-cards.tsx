"use client";

import React from "react";
import { Building2, Layers, Armchair, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkplaceStatCardItem {
  key: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  sparkColor?: string;
  sparkPath?: string;
  unit?: string;
}

interface WorkplaceStatsCardsProps {
  totalSites?: number;
  totalFloors?: number;
  totalSeats?: number;
  openIssues?: number;
  selectedKey?: string;
  onFilterKey?: (key: string) => void;
  isLoading?: boolean;
  customCards?: WorkplaceStatCardItem[];
}

export function WorkplaceStatsCards({
  totalSites = 0,
  totalFloors = 0,
  totalSeats = 0,
  openIssues = 0,
  selectedKey,
  onFilterKey,
  isLoading,
  customCards,
}: WorkplaceStatsCardsProps) {
  const defaultCards: WorkplaceStatCardItem[] = [
    {
      key: "sites",
      label: "Tổng cơ sở / Tòa nhà",
      count: totalSites,
      icon: Building2,
      iconBg: "bg-primary text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,35 Q25,10 50,25 T100,15",
    },
    {
      key: "floors",
      label: "Tổng số tầng mặt sàn",
      count: totalFloors,
      icon: Layers,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#059669",
      sparkPath: "M0,30 Q30,35 60,15 T100,10",
    },
    {
      key: "seats",
      label: "Tổng số bàn làm việc",
      count: totalSeats,
      icon: Armchair,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
      sparkPath: "M0,35 Q20,20 50,15 T100,5",
    },
    {
      key: "issues",
      label: "Sự cố cần khắc phục",
      count: openIssues,
      icon: AlertCircle,
      iconBg: openIssues > 0 ? "bg-rose-600 text-white" : "bg-slate-600 text-white",
      sparkColor: openIssues > 0 ? "#E11D48" : "#475569",
      sparkPath: "M0,10 Q30,20 60,30 T100,35",
    },
  ];

  const cards = customCards || defaultCards;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedKey === item.key;

        return (
          <div
            key={item.key}
            onClick={() => onFilterKey?.(item.key)}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            {/* Cột trái: Icon Box lớn + Label + Số đếm */}
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <div className="text-2xl font-bold tracking-tight text-foreground flex items-baseline gap-1">
                  {isLoading ? (
                    <span className="inline-block h-7 w-12 animate-pulse rounded-md bg-muted" />
                  ) : (
                    <>
                      <span>{item.count.toLocaleString("vi-VN")}</span>
                      {item.unit && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {item.unit}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sparkline SVG trang trí */}
            <div className="hidden sm:block h-9 w-20 shrink-0 opacity-40 group-hover:opacity-90 transition-opacity">
              <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath || "M0,30 Q30,15 60,25 T100,10"}
                  fill="none"
                  stroke={item.sparkColor || "#2563EB"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
