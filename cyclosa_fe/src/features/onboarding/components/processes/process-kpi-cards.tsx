"use client";

import React from "react";
import { UserPlus, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingProcessDto } from "../../types/onboarding.types";

interface ProcessKpiCardsProps {
  processes: OnboardingProcessDto[];
}

export function ProcessKpiCards({
  processes,
}: ProcessKpiCardsProps) {
  const inProgressCount = processes.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "PREPARING"
  ).length;

  const reviewPendingCount = processes.filter(
    (p) => p.status === "REVIEW_PENDING" || (p.mandatoryUnfinishedTasks === 0 && p.status === "IN_PROGRESS")
  ).length;

  const completedCount = processes.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const averageProgress =
    processes.length > 0
      ? Math.round(
          processes.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) /
            processes.length
        )
      : 0;

  const cards = [
    {
      key: "IN_PROGRESS",
      label: "Đang trong kỳ thử việc",
      count: inProgressCount,
      icon: UserPlus,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#3B82F6",
      sparkPath: "M0,25 Q30,35 60,15 T100,20",
    },
    {
      key: "REVIEW_PENDING",
      label: "Chờ đánh giá & Nghiệm thu",
      count: reviewPendingCount,
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
    },
    {
      key: "COMPLETED",
      label: "Hoàn thành thử việc",
      count: completedCount,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
    {
      key: "AVG_PROGRESS",
      label: "Tiến độ lộ trình trung bình",
      count: `${averageProgress}%`,
      icon: Sparkles,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all group bg-card",
              "border-border hover:border-primary/40 hover:shadow-md cursor-pointer"
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
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {item.count}
                </h3>
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 100 40">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
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
