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
          className={cn(
            "bg-emerald-600 text-white border-transparent gap-1 text-xs font-medium py-0.5",
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
          className={cn(
            "bg-amber-600 text-white border-transparent gap-1 text-xs font-medium py-0.5",
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
          className={cn(
            "bg-red-600 text-white border-transparent gap-1 text-xs font-medium py-0.5",
            className
          )}
        >
          <Lock className="h-3 w-3" />
          <span>{USER_STATUS_LABELS.LOCKED}</span>
        </Badge>
      );
    default:
      return (
        <Badge className={cn("bg-slate-600 text-white border-transparent text-xs font-medium", className)}>
          {status}
        </Badge>
      );
  }
}

