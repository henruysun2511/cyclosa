"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DailyAttendanceStatus } from "../../types/attendance.types";
import { DAILY_ATTENDANCE_STATUS_MAP } from "../../constants/attendance.constants";

interface AttendanceStatusBadgeProps {
  status: DailyAttendanceStatus;
  showCharOnly?: boolean;
  className?: string;
}

export function AttendanceStatusBadge({
  status,
  showCharOnly = false,
  className,
}: AttendanceStatusBadgeProps) {
  const meta = DAILY_ATTENDANCE_STATUS_MAP[status] || {
    label: status,
    variant: "secondary",
    colorClass: "bg-muted text-muted-foreground",
    badgeChar: "?",
  };

  if (showCharOnly) {
    return (
      <span
        title={meta.label}
        className={cn(
          "inline-flex items-center justify-center font-bold text-[11px] rounded px-1.5 py-0.5 border leading-none transition-colors",
          meta.colorClass,
          className
        )}
      >
        {meta.badgeChar}
      </span>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border text-xs gap-1", meta.colorClass, className)}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </Badge>
  );
}

