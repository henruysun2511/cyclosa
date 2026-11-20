"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AuditTrailTimeline } from "./audit-trail-timeline";
import { useGetEntityAuditTrailQuery } from "../api/audit-api";
import { AUDIT_ENTITY_LABEL } from "../constants/audit.constants";

interface EntityAuditTrailDialogProps {
  entityType: string;
  entityId: string;
  entityLabel?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewLogDetail?: (logId: string) => void;
}

/**
 * Dialog Audit Trail tái sử dụng — có thể nhúng vào bất kỳ trang chi tiết nào
 * (Contracts, Employees, Roles, Departments...).
 * Người dùng click nút "Lịch sử thay đổi" sẽ mở dialog này.
 */
export function EntityAuditTrailDialog({
  entityType,
  entityId,
  entityLabel,
  open,
  onOpenChange,
  onViewLogDetail,
}: EntityAuditTrailDialogProps) {
  const { data: res, isLoading } = useGetEntityAuditTrailQuery(
    { entityType, entityId },
    { skip: !open || !entityType || !entityId }
  );

  const data = res?.data;
  const displayEntityType =
    entityLabel || AUDIT_ENTITY_LABEL[entityType] || entityType;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            Lịch sử thay đổi — {displayEntityType}
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            {entityType} #{entityId}
          </DialogDescription>
        </DialogHeader>

        <AuditTrailTimeline
          data={data}
          isLoading={isLoading}
          onViewDetail={onViewLogDetail}
        />

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

