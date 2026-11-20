"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditActionBadge } from "./audit-action-badge";
import { formatAuditDateTime, getActorInitials, getActorAvatarColor } from "../utils/audit-utils";
import { AUDIT_ENTITY_LABEL } from "../constants/audit.constants";
import type { AuditLog } from "../types/audit.types";
import { cn } from "@/lib/utils";

interface AuditColumnsOptions {
  onViewDetail: (log: AuditLog) => void;
}

export function getAuditColumns(
  options: AuditColumnsOptions
): ColumnDef<AuditLog>[] {
  return [
    // ── Cột 1: Thời điểm ───────────────────────────────────────────────────
    {
      accessorKey: "occurredAt",
      header: "Thời điểm",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formatAuditDateTime(row.original.occurredAt)}
        </span>
      ),
    },

    // ── Cột 2: Người thực hiện ─────────────────────────────────────────────
    {
      accessorKey: "actor",
      header: "Người thực hiện",
      cell: ({ row }) => {
        const actor = row.original.actor;
        const initials = getActorInitials(actor?.fullName);
        const colorClass = getActorAvatarColor(actor?.id || "");
        return (
          <div className="flex items-center gap-2.5">
            {actor?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={actor.avatarUrl}
                alt={actor.fullName}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white font-bold text-[10px] shadow-sm",
                  colorClass
                )}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                {actor?.fullName || "Hệ thống"}
              </p>
              <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[140px] block">
                {actor?.email || "system"}
              </span>
            </div>
          </div>
        );
      },
    },

    // ── Cột 3: Hành động ───────────────────────────────────────────────────
    {
      accessorKey: "action",
      header: "Hành động",
      cell: ({ row }) => (
        <AuditActionBadge action={row.original.action} />
      ),
    },

    // ── Cột 4: Phân hệ / Đối tượng ────────────────────────────────────────
    {
      accessorKey: "entityType",
      header: "Phân hệ",
      cell: ({ row }) => {
        const entityType = row.original.entityType;
        const label = AUDIT_ENTITY_LABEL[entityType] || entityType;
        return (
          <span className="font-mono text-xs font-semibold text-primary">
            {label}
          </span>
        );
      },
    },

    // ── Cột 5: Mô tả & Tham chiếu ─────────────────────────────────────────
    {
      accessorKey: "entityReference",
      header: "Mô tả & Tham chiếu",
      cell: ({ row }) => (
        <div className="max-w-[220px]">
          {row.original.description && (
            <p className="text-xs text-foreground truncate">
              {row.original.description}
            </p>
          )}
          {row.original.entityReference && (
            <span className="text-[11px] text-muted-foreground truncate block font-mono">
              {row.original.entityReference}
            </span>
          )}
          {!row.original.description && !row.original.entityReference && (
            <span className="text-xs text-muted-foreground italic">—</span>
          )}
        </div>
      ),
    },

    // ── Cột 6: Địa chỉ IP ─────────────────────────────────────────────────
    {
      accessorKey: "ipAddress",
      header: "Địa chỉ IP",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.ipAddress || "—"}
        </span>
      ),
    },

    // ── Cột 7: Thao tác ───────────────────────────────────────────────────
    {
      id: "actions",
      header: () => <span className="sr-only">Thao tác</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-primary"
          onClick={() => options.onViewDetail(row.original)}
          title="Xem chi tiết & So sánh thay đổi"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Chi tiết</span>
        </Button>
      ),
    },
  ];
}

