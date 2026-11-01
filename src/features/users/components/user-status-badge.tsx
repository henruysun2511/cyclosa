"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Lock } from "lucide-react";
import { USER_STATUS_LABELS, type UserStatus } from "../constants/user.constants";
import { cn } from "@/lib/utils";

export interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function UserStatusBadge({ status, className }: UserStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] font-medium py-0.5",
            className
          )}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>{USER_STATUS_LABELS.ACTIVE}</span>
        </Badge>
      );
    case "PENDING_ACTIVATION":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[11px] font-medium py-0.5",
            className
          )}
        >
          <Clock className="h-3 w-3" />
          <span>{USER_STATUS_LABELS.PENDING_ACTIVATION}</span>
        </Badge>
      );
    case "LOCKED":
      return (
        <Badge
          variant="outline"
          className={cn(
            "bg-destructive/10 text-destructive border-destructive/30 gap-1 text-[11px] font-medium py-0.5",
            className
          )}
        >
          <Lock className="h-3 w-3" />
          <span>{USER_STATUS_LABELS.LOCKED}</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={cn("text-[11px] font-medium", className)}>
          {status}
        </Badge>
      );
  }
}

