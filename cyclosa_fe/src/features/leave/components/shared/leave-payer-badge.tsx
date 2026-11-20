"use client";

import { Badge } from "@/components/ui/badge";
import { LEAVE_PAYER_VARIANTS } from "../../constants/leave.constants";
import type { LeavePayer } from "../../types/leave.types";

interface LeavePayerBadgeProps {
  payer: LeavePayer;
  className?: string;
}

export function LeavePayerBadge({ payer, className }: LeavePayerBadgeProps) {
  const config = LEAVE_PAYER_VARIANTS[payer] || {
    label: payer,
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

