"use client";

import React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, AlertTriangle } from "lucide-react";
import { useLockTimesheetPeriodMutation } from "../../api/attendance-api";

interface LockConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodId: string;
  periodName: string;
  onSuccess?: () => void;
}

export function LockConfirmDialog({
  open,
  onOpenChange,
  periodId,
  periodName,
  onSuccess,
}: LockConfirmDialogProps) {
  const [lockPeriod, { isLoading }] = useLockTimesheetPeriodMutation();

  const handleLock = async () => {
    try {
      await lockPeriod({ id: periodId }).unwrap();
      toast.success(`Khóa kỳ công "${periodName}" và tạo Snapshot thành công!`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể khóa kỳ công");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <DialogTitle>Xác nhận khóa kỳ công & Chốt Snapshot?</DialogTitle>
          <DialogDescription>
            Bạn đang chuẩn bị khóa kỳ: <strong>{periodName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-start gap-2 text-foreground font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Các tác động khi khóa kỳ công:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Hệ thống đóng hoàn toàn việc gửi đơn giải trình và chấm công bổ sung.</li>
            <li>Toàn bộ công chuẩn, giờ OT, ngày nghỉ phép được đóng băng bất biến thành <strong>Timesheet Snapshots</strong>.</li>
            <li>Dữ liệu snapshot được chuyển giao sang phân hệ Lương (Payroll).</li>
          </ul>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleLock} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5">
            <Lock className="h-4 w-4" />
            {isLoading ? "Đang tạo Snapshot..." : "Xác nhận Khóa kỳ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

