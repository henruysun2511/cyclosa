import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  OFFER_STATUS_BADGES,
  OFFER_STATUS_LABELS,
} from "../../constants/recruitment.constants";
import type { OfferStatus } from "../../types/recruitment.types";
import { cn } from "@/lib/utils";

interface OfferStatusBadgeProps {
  status: OfferStatus;
  className?: string;
}

export function OfferStatusBadge({ status, className }: OfferStatusBadgeProps) {
  const config = OFFER_STATUS_BADGES[status] || {
    label: OFFER_STATUS_LABELS[status] || status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium px-2 py-0.5", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

