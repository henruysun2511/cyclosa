"use client";

import { Badge } from "@/components/ui/badge";
import { LEAVE_STATUS_VARIANTS } from "../../constants/leave.constants";
import type { LeaveRequestStatus } from "../../types/leave.types";

interface LeaveStatusBadgeProps {
  status: LeaveRequestStatus;
  className?: string;
}

export function LeaveStatusBadge({ status, className }: LeaveStatusBadgeProps) {
  const config = LEAVE_STATUS_VARIANTS[status] || {
    label: status,
    variant: "outline" as const,
    className: "",
  };

  return (
    <Badge
      variant={config.variant}
      className={`font-medium ${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}

