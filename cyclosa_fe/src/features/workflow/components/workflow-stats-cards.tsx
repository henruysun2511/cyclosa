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
      title: "Chờ tôi phê duyệt",
      value: stats?.pendingMyApproval ?? 0,
      description: "Yêu cầu cần xử lý ngay",
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "text-amber-500",
      sparkline: "M0 25 Q 25 15, 50 20 T 100 5",
      isActive: activeTab === "inbox",
      onClick: () => onSelectTab("inbox"),
    },
    {
      title: "Tôi đã phê duyệt",
      value: stats?.approvedByMe ?? 0,
      description: "Lịch sử đã ra quyết định",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "text-emerald-500",
      sparkline: "M0 30 Q 30 10, 60 25 T 100 8",
      isActive: activeTab === "history",
      onClick: () => onSelectTab("history"),
    },
    {
      title: "Tôi đã gửi",
      value: stats?.mySubmittedTotal ?? 0,
      description: "Hồ sơ của tôi đang chờ duyệt",
      icon: Send,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "text-blue-500",
      sparkline: "M0 20 Q 30 35, 60 15 T 100 10",
      isActive: activeTab === "submitted",
      onClick: () => onSelectTab("submitted"),
    },
    {
      title: "Quy trình thiết lập",
      value: stats?.totalActiveDefinitions ?? 0,
      description: "Quy trình đang kích hoạt",
      icon: GitFork,
      iconBg: "bg-primary text-white",
      sparkColor: "text-primary",
      sparkline: "M0 28 Q 20 8, 50 18 T 100 6",
      isActive: false,
      onClick: onOpenDefinitions,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={card.onClick}
            className={cn(
              "relative overflow-hidden rounded-xl border p-4 sm:p-5 shadow-xs transition-all group bg-card hover:border-primary/40 hover:shadow-md cursor-pointer",
              card.isActive
                ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                : "border-border"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                <div className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {card.value}
                </div>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  card.iconBg
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs border-t border-border/40 pt-2.5">
              <span className="text-muted-foreground truncate">{card.description}</span>
              <div className="w-16 h-6 shrink-0 ml-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                  <path
                    d={card.sparkline}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={card.sparkColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

