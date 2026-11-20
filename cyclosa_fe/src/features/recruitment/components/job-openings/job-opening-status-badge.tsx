import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  JOB_OPENING_STATUS_BADGES,
  JOB_OPENING_STATUS_LABELS,
} from "../../constants/recruitment.constants";
import type { JobOpeningStatus } from "../../types/recruitment.types";
import { cn } from "@/lib/utils";

interface JobOpeningStatusBadgeProps {
  status: JobOpeningStatus;
  className?: string;
}

export function JobOpeningStatusBadge({ status, className }: JobOpeningStatusBadgeProps) {
  const config = JOB_OPENING_STATUS_BADGES[status] || {
    label: JOB_OPENING_STATUS_LABELS[status] || status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium px-2 py-0.5", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

