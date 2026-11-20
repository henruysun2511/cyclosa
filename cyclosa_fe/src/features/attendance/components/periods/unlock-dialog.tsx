"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Unlock, ShieldAlert } from "lucide-react";
import { useUnlockTimesheetPeriodMutation } from "../../api/attendance-api";

interface UnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodId: string;
  periodName: string;
  onSuccess?: () => void;
}

export function UnlockDialog({
  open,
  onOpenChange,
  periodId,
  periodName,
  onSuccess,
}: UnlockDialogProps) {
  const [reason, setReason] = useState("");
  const [unlockPeriod, { isLoading }] = useUnlockTimesheetPeriodMutation();

  const handleUnlock = async () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do mở khóa kỳ công để lưu vết kiểm toán");
      return;
    }

    try {
      await unlockPeriod({
        id: periodId,
        body: { reason: reason.trim() },
      }).unwrap();

      toast.success(`Đã mở khóa kỳ công "${periodName}" thành công`);
      setReason("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể mở khóa kỳ công");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="p-3 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 w-fit mb-2">
            <Unlock className="h-6 w-6" />
          </div>
          <DialogTitle>Mở khóa kỳ công đã chốt?</DialogTitle>
          <DialogDescription>
            Kỳ công: <strong>{periodName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs leading-relaxed text-muted-foreground">
          <div className="flex items-start gap-2 text-destructive font-medium">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Hành động được giám sát kiểm toán nghiêm ngặt (@Auditable):</span>
          </div>
          <p>
            Mở khóa kỳ công có thể ảnh hưởng đến dữ liệu lương đã tính toán. Mọi thao tác và lý do mở khóa sẽ được ghi nhận vào nhật ký kiểm toán hệ thống và gửi thông báo tới Ban Giám đốc/Kế toán trưởng.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <Label className="text-xs font-semibold">
            Lý do mở khóa kỳ công <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Nhập lý do chi tiết (ví dụ: phát hiện sai sót dữ liệu OT bộ phận Kinh doanh, điều chỉnh theo yêu cầu BGĐ...)"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleUnlock}
            disabled={isLoading || !reason.trim()}
            className="gap-1.5"
          >
            <Unlock className="h-4 w-4" />
            {isLoading ? "Đang mở khóa..." : "Xác nhận Mở khóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

