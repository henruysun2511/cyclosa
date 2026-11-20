"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  OffboardingStatus,
  OffboardingType,
  ClearanceStatus,
} from "../types/offboarding.types";
import {
  OFFBOARDING_STATUS_CONFIG,
  OFFBOARDING_TYPE_LABELS,
  CLEARANCE_STATUS_CONFIG,
} from "../constants/offboarding.constants";

export function OffboardingStatusBadge({
  status,
  className,
}: {
  status: OffboardingStatus;
  className?: string;
}) {
  const config = OFFBOARDING_STATUS_CONFIG[status] || {
    label: status,
    variant: "muted",
  };

  const variantStyles = {
    warning:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    info: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
    primary:
      "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    danger:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    muted:
      "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
  }[config.variant];

  return (
    <Badge
      variant="outline"
      className={cn("font-medium px-2.5 py-0.5 rounded-full text-xs", variantStyles, className)}
    >
      {config.label}
    </Badge>
  );
}

export function OffboardingTypeBadge({
  type,
  className,
}: {
  type: OffboardingType;
  className?: string;
}) {
  const isResignation = type === "RESIGNATION";
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium px-2 py-0.5 rounded-md text-xs",
        isResignation
          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
          : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        className
      )}
    >
      {OFFBOARDING_TYPE_LABELS[type]}
    </Badge>
  );
}

export function ClearanceStatusBadge({
  status,
  className,
}: {
  status: ClearanceStatus;
  className?: string;
}) {
  const config = CLEARANCE_STATUS_CONFIG[status] || {
    label: status,
    variant: "warning",
  };

  const variantStyles = {
    warning:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    success:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    danger:
      "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  }[config.variant];

  return (
    <Badge
      variant="outline"
      className={cn("font-medium px-2.5 py-0.5 rounded-full text-xs", variantStyles, className)}
    >
      {config.label}
    </Badge>
  );
}
