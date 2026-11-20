"use client";

import { Badge } from "@/components/ui/badge";
import { LEAVE_GROUP_VARIANTS } from "../../constants/leave.constants";
import type { LeaveGroup } from "../../types/leave.types";

interface LeaveGroupBadgeProps {
  group: LeaveGroup;
  className?: string;
}

export function LeaveGroupBadge({ group, className }: LeaveGroupBadgeProps) {
  const config = LEAVE_GROUP_VARIANTS[group] || {
    label: group,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <Badge
      variant="outline"
      className={`font-medium ${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}

