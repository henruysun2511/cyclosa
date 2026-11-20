"use client";

import React from "react";
import { HelpCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UnansweredQuestion } from "../../types/ai.types";

interface GapsStatsCardsProps {
  questions: UnansweredQuestion[];
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
}

export function GapsStatsCards({
  questions,
  selectedStatus,
  onFilterStatus,
}: GapsStatsCardsProps) {
  const totalCount = questions.length;
  const pendingCount = questions.filter((q) => q.status === "PENDING_REVIEW").length;
  const addedCount = questions.filter((q) => q.status === "DOCUMENT_ADDED").length;
  const dismissedCount = questions.filter((q) => q.status === "DISMISSED").length;

  const stats = [
    {
      label: "Tổng câu hỏi chưa đáp",
      count: totalCount,
      icon: HelpCircle,
      iconBg: "bg-indigo-600 text-white",
      sparkColor: "#6366F1",
      sparkPath: "M0,30 Q25,18 50,24 T100,8",
      statusKey: "ALL",
      unit: "câu hỏi",
    },
    {
      label: "Chờ rà soát chính sách",
      count: pendingCount,
      icon: Clock,
      iconBg: "bg-amber-600 text-white",
      sparkColor: "#D97706",
      sparkPath: "M0,35 Q25,38 50,20 T100,6",
      statusKey: "PENDING_REVIEW",
      unit: "câu hỏi",
    },
    {
      label: "Đã bổ sung tài liệu mới",
      count: addedCount,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
      statusKey: "DOCUMENT_ADDED",
      unit: "vấn đề",
    },
    {
      label: "Đã bỏ qua / Không phù hợp",
      count: dismissedCount,
      icon: XCircle,
      iconBg: "bg-slate-600 text-white",
      sparkColor: "#64748B",
      sparkPath: "M0,32 Q35,32 70,32 T100,32",
      statusKey: "DISMISSED",
      unit: "câu hỏi",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.statusKey;
        return (
          <div
            key={item.label}
            onClick={() =>
              onFilterStatus?.(isSelected ? undefined : item.statusKey === "ALL" ? undefined : item.statusKey)
            }
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {item.count}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Sparkline mini SVG trang trí */}
            <div className="h-8 w-16 opacity-60 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 40" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
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
