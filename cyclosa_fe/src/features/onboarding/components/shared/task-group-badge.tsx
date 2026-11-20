"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingTaskGroup } from "../../types/onboarding.types";
import {
  ONBOARDING_TASK_GROUP_LABELS,
  ONBOARDING_TASK_GROUP_ICONS,
} from "../../constants/onboarding.constants";

interface TaskGroupBadgeProps {
  taskGroup: OnboardingTaskGroup;
  className?: string;
  showIcon?: boolean;
}

export function TaskGroupBadge({
  taskGroup,
  className,
  showIcon = true,
}: TaskGroupBadgeProps) {
  const label = ONBOARDING_TASK_GROUP_LABELS[taskGroup] || taskGroup;
  const Icon = ONBOARDING_TASK_GROUP_ICONS[taskGroup];

  const getStyle = (group: OnboardingTaskGroup) => {
    switch (group) {
      case "DOCS":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300";
      case "EQUIPMENT":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
      case "ACCOUNTS":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300";
      case "TRAINING":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
      case "ORIENTATION":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 w-fit",
        getStyle(taskGroup),
        className
      )}
    >
      {showIcon && Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{label}</span>
    </Badge>
  );
}

