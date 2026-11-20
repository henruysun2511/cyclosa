"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  KNOWLEDGE_STATUS_LABELS,
  KNOWLEDGE_STATUS_COLORS,
} from "../../constants/ai.constants";
import type { KnowledgeDocumentStatus } from "../../types/ai.types";

interface KnowledgeStatusBadgeProps {
  status: KnowledgeDocumentStatus;
  className?: string;
}

export function KnowledgeStatusBadge({
  status,
  className,
}: KnowledgeStatusBadgeProps) {
  const color = KNOWLEDGE_STATUS_COLORS[status] || {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
  };
  const label = KNOWLEDGE_STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs",
        color.bg,
        color.text,
        color.border,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-90 shrink-0" />
      <span>{label}</span>
    </span>
  );
}
