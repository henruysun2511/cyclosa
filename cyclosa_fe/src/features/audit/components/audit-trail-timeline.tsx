"use client";

import React from "react";
import { History, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditActionBadge } from "./audit-action-badge";
import { formatAuditDateTime, formatAuditTimeAgo } from "../utils/audit-utils";
import type { AuditTrailTimelineData, AuditTrailEvent } from "../types/audit.types";
import { cn } from "@/lib/utils";

interface AuditTrailTimelineProps {
  data?: AuditTrailTimelineData | null;
  isLoading?: boolean;
  onViewDetail?: (logId: string) => void;
  className?: string;
}

/**
 * Trục thời gian dọc (Vertical Timeline) hiển thị toàn bộ vòng đời của một thực thể.
 * Các sự kiện được sắp xếp từ sự kiện gần nhất → xa nhất (mới nhất ở trên).
 */
export function AuditTrailTimeline({
  data,
  isLoading = false,
  onViewDetail,
  className,
}: AuditTrailTimelineProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              {i < 3 && <div className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="pb-4 space-y-1.5 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.timeline.length === 0) {
    return (
      <div className={cn("text-center py-8 text-sm text-muted-foreground", className)}>
        <History className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>Chưa có lịch sử thay đổi nào được ghi nhận.</p>
      </div>
    );
  }

  // Hiển thị từ mới nhất → cũ nhất
  const sortedEvents = [...data.timeline].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return (
    <div className={cn("space-y-0", className)}>
      {/* Header tóm tắt */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <History className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">
          Dòng thời gian truy vết
        </span>
        <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">
          {data.totalEvents} sự kiện
        </span>
      </div>

      {/* Timeline Events */}
      {sortedEvents.map((event, index) => (
        <TimelineEventItem
          key={event.logId}
          event={event}
          isLast={index === sortedEvents.length - 1}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}

interface TimelineEventItemProps {
  event: AuditTrailEvent;
  isLast: boolean;
  onViewDetail?: (logId: string) => void;
}

function TimelineEventItem({ event, isLast, onViewDetail }: TimelineEventItemProps) {
  return (
    <div className="flex gap-3">
      {/* Timeline node */}
      <div className="flex flex-col items-center shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 shadow-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
        </div>
        {!isLast && (
          <div className="mt-1 w-px flex-1 min-h-[24px] bg-border" />
        )}
      </div>

      {/* Event content */}
      <div className={cn("pb-4 flex-1 min-w-0", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <AuditActionBadge action={event.action} size="sm" />
            {event.description && (
              <p className="text-xs text-foreground">{event.description}</p>
            )}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono">{formatAuditDateTime(event.occurredAt)}</span>
              <span>•</span>
              <span>{event.actorName}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {formatAuditTimeAgo(event.occurredAt)}
            </span>
            {onViewDetail && (
              <button
                type="button"
                onClick={() => onViewDetail(event.logId)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                title="Xem chi tiết bản ghi"
              >
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

