"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingStatus } from "../../types/onboarding.types";
import {
  ONBOARDING_STATUS_LABELS,
  ONBOARDING_STATUS_COLORS,
} from "../../constants/onboarding.constants";

interface OnboardingStatusBadgeProps {
  status: OnboardingStatus;
  className?: string;
}

export function OnboardingStatusBadge({
  status,
  className,
}: OnboardingStatusBadgeProps) {
  const label = ONBOARDING_STATUS_LABELS[status] || status;
  const color = ONBOARDING_STATUS_COLORS[status] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-semibold px-2 py-0.5 rounded-full border shadow-2xs whitespace-nowrap",
        color.bg,
        color.text,
        color.border,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 inline-block" />
      {label}
    </Badge>
  );
}

