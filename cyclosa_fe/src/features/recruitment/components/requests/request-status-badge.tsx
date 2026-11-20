import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  RECRUITMENT_REQUEST_STATUS_BADGES,
  RECRUITMENT_REQUEST_STATUS_LABELS,
} from "../../constants/recruitment.constants";
import type { RecruitmentRequestStatus } from "../../types/recruitment.types";
import { cn } from "@/lib/utils";

interface RequestStatusBadgeProps {
  status: RecruitmentRequestStatus;
  className?: string;
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const config = RECRUITMENT_REQUEST_STATUS_BADGES[status] || {
    label: RECRUITMENT_REQUEST_STATUS_LABELS[status] || status,
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

