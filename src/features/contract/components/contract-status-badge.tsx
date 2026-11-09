import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_COLORS,
  CONTRACT_TYPE_LABELS,
  SIGNER_STATUS_LABELS,
  SIGNER_STATUS_COLORS,
} from "../constants/contract.constants";
import type { ContractStatus, ContractType, SignerStatus } from "../types/contract.types";

interface ContractStatusBadgeProps {
  status: ContractStatus;
  className?: string;
}

export function ContractStatusBadge({ status, className }: ContractStatusBadgeProps) {
  const color = CONTRACT_STATUS_COLORS[status] || {
    bg: "bg-slate-600",
    text: "text-white",
    border: "border-transparent",
  };
  const label = CONTRACT_STATUS_LABELS[status] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        color.bg,
        color.text,
        color.border,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-85" />
      {label}
    </span>
  );
}

interface ContractTypeBadgeProps {
  type: ContractType;
  className?: string;
}

export function ContractTypeBadge({ type, className }: ContractTypeBadgeProps) {
  const label = CONTRACT_TYPE_LABELS[type] || type;
  return (
    <Badge className={cn("bg-slate-700 text-white border-transparent text-xs font-medium", className)}>
      {label}
    </Badge>
  );
}

interface SignerStatusBadgeProps {
  status: SignerStatus;
  className?: string;
}

export function SignerStatusBadge({ status, className }: SignerStatusBadgeProps) {
  const color = SIGNER_STATUS_COLORS[status] || {
    bg: "bg-slate-500",
    text: "text-white",
  };
  const label = SIGNER_STATUS_LABELS[status] || status;

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", color.bg, color.text, className)}>
      {label}
    </span>
  );
}

