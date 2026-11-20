"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
import { useApproveTransferMutation } from "../api/transfer-api";

interface ApproveTransferDialogProps {
  transferId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ApproveTransferDialog({
  transferId,
  open,
  onOpenChange,
  onSuccess,
}: ApproveTransferDialogProps) {
  const [notes, setNotes] = useState("");
  const [approveTransfer, { isLoading }] = useApproveTransferMutation();

  const handleApprove = async () => {
    if (!transferId) return;

    try {
      await approveTransfer({
        id: transferId,
        body: { notes: notes.trim() || undefined },
      }).unwrap();

      toast.success("Phê duyệt phiếu điều chuyển thành công");
      setNotes("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phê duyệt phiếu điều chuyển");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            Xác nhận phê duyệt điều chuyển
          </DialogTitle>
          <DialogDescription>
            Phiếu điều chuyển sẽ chuyển sang trạng thái <strong>Đã phê duyệt</strong> và sẵn sàng áp dụng khi đến ngày hiệu lực.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="text-xs font-medium text-foreground">
            Ý kiến chỉ đạo / Ghi chú phê duyệt (Tùy chọn)
          </label>
          <Textarea
            placeholder="Nhập ý kiến hoặc dặn dò nhận sự nhận việc..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleApprove} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isLoading ? "Đang xử lý..." : "Xác nhận phê duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
