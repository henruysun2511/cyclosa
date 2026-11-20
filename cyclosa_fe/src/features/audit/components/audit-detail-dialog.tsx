"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditSideBySideDiff } from "@/components/shared/audit-side-by-side-diff";
import { AuditActionBadge } from "./audit-action-badge";
import { formatAuditDateTime, getActorInitials, getActorAvatarColor, mapChangedFieldsToDiff } from "../utils/audit-utils";
import { useGetAuditLogByIdQuery } from "../api/audit-api";
import type { AuditLog } from "../types/audit.types";
import { cn } from "@/lib/utils";
import { Monitor, Clock, MapPin, User, FileJson } from "lucide-react";

interface AuditDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal chi tiết bản ghi nhật ký kiểm toán.
 * - Tab 1: So sánh trực quan Trước/Sau (AuditSideBySideDiff)
 * - Tab 2: Thông tin kỹ thuật (IP, User-Agent, JSON snapshot)
 */
export function AuditDetailDialog({
  log,
  open,
  onOpenChange,
}: AuditDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("diff");

  const { data: detailRes, isLoading } = useGetAuditLogByIdQuery(log?.id ?? "", {
    skip: !open || !log?.id,
  });

  const detail = detailRes?.data;
  const diffChanges = mapChangedFieldsToDiff(detail?.changedFields);

  if (!log) return null;

  const actor = log.actor;
  const initials = getActorInitials(actor?.fullName);
  const avatarColor = getActorAvatarColor(actor?.id || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Chi tiết Nhật ký Kiểm toán
            <AuditActionBadge action={log.action} size="sm" />
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            ID: {log.id}
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin tóm tắt */}
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-xs border border-border">
          {/* Actor */}
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white font-bold text-[11px] shadow-sm",
                avatarColor
              )}
            >
              {actor?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={actor.avatarUrl}
                  alt={actor.fullName}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{actor?.fullName || "Hệ thống"}</p>
              <p className="text-muted-foreground">{actor?.email}</p>
              {actor?.jobTitle && (
                <p className="text-muted-foreground">
                  {actor.jobTitle}
                  {actor.department && ` — ${actor.department}`}
                </p>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 gap-1.5 col-span-2 sm:col-span-1 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">{formatAuditDateTime(log.occurredAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">{log.ipAddress || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="font-mono">{log.entityType}</span>
              {log.entityId && (
                <span className="text-muted-foreground/70">#{log.entityId}</span>
              )}
            </div>
            {log.entityReference && (
              <p className="text-foreground font-medium">{log.entityReference}</p>
            )}
          </div>
        </div>

        {/* Tabs nội dung chi tiết */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="diff" className="text-xs">
              So sánh Dữ liệu Trước / Sau
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-xs">
              <Monitor className="h-3.5 w-3.5 mr-1.5" />
              Thông tin kỹ thuật
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Diff trực quan */}
          <TabsContent value="diff" className="mt-3">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : diffChanges.length > 0 ? (
              <AuditSideBySideDiff changes={diffChanges} />
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground italic">
                {["CREATE", "LOGIN", "VIEW", "EXPORT", "DOWNLOAD", "LOCK", "UNLOCK"].includes(log.action)
                  ? `Hành động "${log.action}" không ghi nhận sự thay đổi trường dữ liệu.`
                  : "Không có thông tin chi tiết thay đổi cho bản ghi này."}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Thông tin kỹ thuật */}
          <TabsContent value="technical" className="mt-3 space-y-3">
            {/* User-Agent */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Monitor className="h-3.5 w-3.5" />
                Trình duyệt / User-Agent
              </p>
              <div className="rounded-md bg-muted/50 border border-border px-3 py-2 font-mono text-xs text-muted-foreground break-all">
                {log.userAgent || "—"}
              </div>
            </div>

            {/* JSON snapshots */}
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                {detail?.oldValue && (
                  <div>
                    <p className="text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                      <FileJson className="h-3.5 w-3.5" />
                      Dữ liệu Trước (oldValue)
                    </p>
                    <pre className="rounded-md bg-rose-50/80 border border-rose-100 px-3 py-2 font-mono text-xs text-rose-900 overflow-x-auto max-h-48 overflow-y-auto">
                      {JSON.stringify(detail.oldValue, null, 2)}
                    </pre>
                  </div>
                )}
                {detail?.newValue && (
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                      <FileJson className="h-3.5 w-3.5" />
                      Dữ liệu Sau (newValue)
                    </p>
                    <pre className="rounded-md bg-emerald-50/80 border border-emerald-100 px-3 py-2 font-mono text-xs text-emerald-900 overflow-x-auto max-h-48 overflow-y-auto">
                      {JSON.stringify(detail.newValue, null, 2)}
                    </pre>
                  </div>
                )}
                {!detail?.oldValue && !detail?.newValue && (
                  <p className="text-xs text-muted-foreground italic text-center py-4">
                    Không có snapshot dữ liệu cho bản ghi này.
                  </p>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

