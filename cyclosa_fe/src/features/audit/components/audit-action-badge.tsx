"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AUDIT_ACTION_CONFIG } from "../constants/audit.constants";
import type { AuditAction } from "../types/audit.types";

interface AuditActionBadgeProps {
  action: AuditAction | string;
  size?: "sm" | "default";
  className?: string;
}

/**
 * Badge màu sắc hiển thị 13 hành động kiểm toán chuẩn hóa.
 */
export function AuditActionBadge({
  action,
  size = "default",
  className,
}: AuditActionBadgeProps) {
  const config = AUDIT_ACTION_CONFIG[action as AuditAction];

  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium",
          "bg-slate-100 text-slate-700 border-slate-200",
          size === "sm" ? "text-[10px]" : "text-xs",
          className
        )}
      >
        {action}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold",
        config.className,
        size === "sm" ? "text-[10px]" : "text-xs",
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotClassName)}
      />
      {config.label}
    </span>
  );
}

