"use client";

import React from "react";
import { Building2, MapPin, Tag, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogTab } from "../../constants/organization.constants";

interface CatalogStatsCardsProps {
  activeTab: CatalogTab;
  onSelectTab: (tab: CatalogTab) => void;
  companyCount: number;
  branchCount: number;
  costCenterCount: number;
  jobTitleCount: number;
  jobLevelCount: number;
  isLoading?: boolean;
}

export function CatalogStatsCards({
  activeTab,
  onSelectTab,
  companyCount,
  branchCount,
  costCenterCount,
  jobTitleCount,
  jobLevelCount,
  isLoading = false,
}: CatalogStatsCardsProps) {
  const cards = [
    {
      tab: "companies" as CatalogTab,
      label: "Pháp nhân & Công ty",
      value: companyCount,
      subtext: "Pháp nhân hạch toán độc lập",
      icon: Building2,
      iconBg: "bg-primary text-white",
      sparkColor: "#2563eb",
      sparkPath: "M0,35 Q20,15 40,28 T80,10 T100,5",
      sparkFill: "rgba(37,99,235,0.08)",
      sparkFillPath: "M0,35 Q20,15 40,28 T80,10 T100,5 L100,45 L0,45 Z",
    },
    {
      tab: "branches" as CatalogTab,
      label: "Vùng miền & Chi nhánh",
      value: branchCount,
      subtext: "Văn phòng định vị Geofence GPS",
      icon: MapPin,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#059669",
      sparkPath: "M0,38 Q25,20 50,30 T80,12 T100,8",
      sparkFill: "rgba(5,150,105,0.08)",
      sparkFillPath: "M0,38 Q25,20 50,30 T80,12 T100,8 L100,45 L0,45 Z",
    },
    {
      tab: "cost-centers" as CatalogTab,
      label: "Trung tâm Chi phí",
      value: costCenterCount,
      subtext: "Quỹ hạch toán & phân bổ chi phí",
      icon: Tag,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#d97706",
      sparkPath: "M0,30 Q30,10 60,25 T90,15 T100,10",
      sparkFill: "rgba(217,119,6,0.08)",
      sparkFillPath: "M0,30 Q30,10 60,25 T90,15 T100,10 L100,45 L0,45 Z",
    },
    {
      tab: "job-matrix" as CatalogTab,
      label: "Chức danh & Cấp bậc",
      value: `${jobTitleCount} / ${jobLevelCount}`,
      subtext: "Vị trí chuyên môn & Thang bậc",
      icon: Briefcase,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333ea",
      sparkPath: "M0,32 Q20,28 45,15 T80,22 T100,5",
      sparkFill: "rgba(147,51,234,0.08)",
      sparkFillPath: "M0,32 Q20,28 45,15 T80,22 T100,5 L100,45 L0,45 Z",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeTab === card.tab;

        return (
          <div
            key={card.tab}
            role="button"
            tabIndex={0}
            onClick={() => onSelectTab(card.tab)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectTab(card.tab);
              }
            }}
            className={cn(
              "rounded-xl border p-4 transition-all duration-200 cursor-pointer select-none group relative overflow-hidden",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-slate-300 hover:shadow-xs"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Cột trái: Tiêu đề, Số đếm, Subtext */}
              <div className="space-y-1 min-w-0 flex-1">
                <span className="text-xs font-medium text-muted-foreground block truncate">
                  {card.label}
                </span>

                {isLoading ? (
                  <div className="h-7 w-16 bg-muted animate-pulse rounded my-1" />
                ) : (
                  <div className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                    {card.value}
                  </div>
                )}

                <p className="text-2xs text-muted-foreground line-clamp-1">
                  {card.subtext}
                </p>
              </div>

              {/* Cột phải: Sparkline + Icon Box */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs",
                    card.iconBg
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Sparkline SVG */}
                <div className="h-7 w-16 overflow-hidden">
                  <svg
                    viewBox="0 0 100 45"
                    className="w-full h-full preserve-3d"
                    fill="none"
                  >
                    <path d={card.sparkFillPath} fill={card.sparkFill} />
                    <path
                      d={card.sparkPath}
                      stroke={card.sparkColor}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chỉ báo trạng thái kích hoạt dưới đáy card */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </div>
        );
      })}
    </div>
  );
}
