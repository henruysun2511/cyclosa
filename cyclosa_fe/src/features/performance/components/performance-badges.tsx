import { Badge } from "@/components/ui/badge";
import {
  PerformanceCycleStatus,
  ReviewStatus,
  PerformanceRating,
  GoalStatus,
} from "../types/performance.types";
import {
  PERFORMANCE_CYCLE_STATUS_BADGES,
  REVIEW_STATUS_BADGES,
  PERFORMANCE_RATING_BADGES,
  GOAL_STATUS_BADGES,
} from "../constants/performance.constants";

export function CycleStatusBadge({ status }: { status: PerformanceCycleStatus }) {
  const conf = PERFORMANCE_CYCLE_STATUS_BADGES[status] || {
    label: status,
    variant: "secondary" as const,
  };
  return (
    <Badge variant={conf.variant} className={conf.className}>
      {conf.label}
    </Badge>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const conf = REVIEW_STATUS_BADGES[status] || {
    label: status,
    variant: "secondary" as const,
  };
  return (
    <Badge variant={conf.variant} className={conf.className}>
      {conf.label}
    </Badge>
  );
}

export function RatingBadge({ rating }: { rating?: PerformanceRating }) {
  if (!rating) return <span className="text-muted-foreground text-xs">—</span>;
  const conf = PERFORMANCE_RATING_BADGES[rating] || {
    label: rating,
    className: "bg-slate-100 text-slate-800",
  };
  return (
    <Badge variant="outline" className={`font-semibold ${conf.className}`}>
      {conf.label}
    </Badge>
  );
}

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const conf = GOAL_STATUS_BADGES[status] || {
    label: status,
    className: "bg-slate-100 text-slate-800",
  };
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${conf.className}`}>
      {conf.label}
    </Badge>
  );
}
