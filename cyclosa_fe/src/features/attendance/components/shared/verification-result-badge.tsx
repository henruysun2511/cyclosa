"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VerificationResult } from "../../types/attendance.types";
import { VERIFICATION_RESULT_MAP } from "../../constants/attendance.constants";

interface VerificationResultBadgeProps {
  result: VerificationResult;
  className?: string;
}

export function VerificationResultBadge({ result, className }: VerificationResultBadgeProps) {
  const meta = VERIFICATION_RESULT_MAP[result] || {
    label: result,
    variant: "secondary",
    description: "",
  };

  const colorStyles: Record<string, string> = {
    SUCCESS: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    OUT_OF_RANGE: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
    FACE_MISMATCH: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    LIVENESS_FAILED: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    NO_ENROLLMENT: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    LOW_IMAGE_QUALITY: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    DUPLICATE_OR_SEQUENCE_ERROR: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30",
  };

  return (
    <Badge
      variant="outline"
      title={meta.description}
      className={cn("font-medium border text-xs", colorStyles[result] || "bg-muted text-muted-foreground", className)}
    >
      {meta.label}
    </Badge>
  );
}

