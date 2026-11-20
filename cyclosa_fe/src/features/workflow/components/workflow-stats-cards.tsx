"use client";

import React from "react";
import { Clock, CheckCircle2, Send, GitFork } from "lucide-react";
import type { WorkflowStatsResponse } from "../types/workflow.types";
import { cn } from "@/lib/utils";

interface WorkflowStatsCardsProps {
  stats?: WorkflowStatsResponse;
  activeTab: "inbox" | "submitted" | "history";
  onSelectTab: (tab: "inbox" | "submitted" | "history") => void;
  onOpenDefinitions?: () => void;
}

export function WorkflowStatsCards({
  stats,
  activeTab,
  onSelectTab,
  onOpenDefinitions,
}: WorkflowStatsCardsProps) {
  const cards = [
    {
      label: "Chờ tôi phê duyệt",
      subLabel: "Yêu cầu cần xử lý ngay",
      count: stats?.pendingMyApproval ?? 0,
      icon: Clock,
      iconBg: "bg-amber-600 text-white",
      sparkColor: "#D97706",
      sparkPath: "M0,32 Q25,12 50,22 T100,8",
      isActive: activeTab === "inbox",
      onClick: () => onSelectTab("inbox"),
    },
    {
      label: "Tôi đã phê duyệt",
      subLabel: "Lịch sử đã ra quyết định",
      count: stats?.approvedByMe ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,35 Q25,38 50,20 T100,6",
      isActive: activeTab === "history",
      onClick: () => onSelectTab("history"),
    },
    {
      label: "Tôi đã gửi",
      subLabel: "Hồ sơ của tôi đang chờ duyệt",
      count: stats?.mySubmittedTotal ?? 0,
      icon: Send,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
      isActive: activeTab === "submitted",
      onClick: () => onSelectTab("submitted"),
    },
    {
      label: "Quy trình thiết lập",
      subLabel: "Quy trình đang kích hoạt",
      count: stats?.totalActiveDefinitions ?? 0,
      icon: GitFork,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#9333EA",
      sparkPath: "M0,24 Q35,8 70,28 T100,10",
      isActive: false,
      onClick: onOpenDefinitions,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={item.onClick}
            className={cn(
              "relative text-left bg-card rounded-xl p-4 border transition-all duration-200 overflow-hidden group shadow-sm hover:shadow-md",
              item.isActive
                ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                : "border-border hover:border-border/80"
            )}
          >
            {/* Sparkline background */}
            <div className="absolute right-0 bottom-0 w-32 h-16 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity">
              <svg
                viewBox="0 0 100 40"
                className="w-full h-full fill-none stroke-current"
                style={{ color: item.sparkColor }}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.sparkPath} />
              </svg>
            </div>

            <div className="flex items-start justify-between relative z-10 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {item.count}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1 relative z-10 truncate">
              {item.subLabel}
            </p>
          </button>
        );
      })}
    </div>
  );
}

