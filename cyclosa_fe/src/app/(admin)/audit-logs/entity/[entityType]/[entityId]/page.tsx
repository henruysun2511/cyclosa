"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/features/authorization/components/route-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetEntityAuditTrailQuery,
  useGetAuditLogByIdQuery,
  AuditTrailTimeline,
  AuditDetailDialog,
} from "@/features/audit";
import type { AuditLog } from "@/features/audit";
import { AUDIT_ENTITY_LABEL } from "@/features/audit/constants/audit.constants";

interface PageProps {
  params: Promise<{
    entityType: string;
    entityId: string;
  }>;
}

/**
 * Trang Audit Trail — Dòng thời gian truy vết toàn bộ vòng đời của 1 thực thể.
 * Mở từ link `/audit-logs/entity/{entityType}/{entityId}` hoặc nút
 * "Lịch sử thay đổi" trên các trang chi tiết của các module khác.
 *
 * Sử dụng Next.js 16 async params pattern (Quy chuẩn §3.3).
 */
export default function EntityAuditTrailPage({ params }: PageProps) {
  const { entityType, entityId } = use(params);

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: res, isLoading } = useGetEntityAuditTrailQuery(
    { entityType, entityId },
    { skip: !entityType || !entityId }
  );

  const { data: logDetailRes } = useGetAuditLogByIdQuery(selectedLogId ?? "", {
    skip: !selectedLogId,
  });

  const data = res?.data;
  const displayEntityType =
    decodeURIComponent(AUDIT_ENTITY_LABEL[entityType] || entityType);
  const displayEntityId = decodeURIComponent(entityId);

  const handleViewLogDetail = (logId: string) => {
    setSelectedLogId(logId);
    setDetailDialogOpen(true);
  };

  // Tạo đối tượng AuditLog từ log detail để truyền vào AuditDetailDialog
  const selectedLog = logDetailRes?.data
    ? (logDetailRes.data as AuditLog)
    : null;

  return (
    <RouteGuard permission={PERMISSIONS.AUDIT.VIEW}>
      <div className="space-y-5">
        {/* ── Header & Breadcrumbs ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/audit-logs" className="hover:text-primary transition-colors">
                Nhật ký kiểm toán
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">
                Audit Trail — {displayEntityType}
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/audit-logs">
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Quay lại danh sách">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Lịch sử thay đổi — {displayEntityType}
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {entityType} #{displayEntityId}
                  {data && (
                    <span className="ml-2 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                      {data.totalEvents} sự kiện
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dòng thời gian Truy vết ─────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <AuditTrailTimeline
            data={data}
            isLoading={isLoading}
            onViewDetail={handleViewLogDetail}
          />
        </div>

        {/* ── Dialog Chi tiết bản ghi ──────────────────────────────────────── */}
        <AuditDetailDialog
          log={selectedLog}
          open={detailDialogOpen}
          onOpenChange={(open) => {
            setDetailDialogOpen(open);
            if (!open) setSelectedLogId(null);
          }}
        />
      </div>
    </RouteGuard>
  );
}

