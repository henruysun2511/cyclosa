"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  UNANSWERED_STATUS_LABELS,
  UNANSWERED_STATUS_COLORS,
} from "../../constants/ai.constants";
import type { UnansweredQuestionStatus } from "../../types/ai.types";

interface GapsStatusBadgeProps {
  status: UnansweredQuestionStatus;
  className?: string;
}

export function GapsStatusBadge({ status, className }: GapsStatusBadgeProps) {
  const color = UNANSWERED_STATUS_COLORS[status] || {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
  };
  const label = UNANSWERED_STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs",
        color.bg,
        color.text,
        color.border,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-90 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
