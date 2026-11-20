"use client";

import React, { useState } from "react";
import { XCircle } from "lucide-react";
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
import { useRejectTransferMutation } from "../api/transfer-api";

interface RejectTransferDialogProps {
  transferId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RejectTransferDialog({
  transferId,
  open,
  onOpenChange,
  onSuccess,
}: RejectTransferDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectTransfer, { isLoading }] = useRejectTransferMutation();

  const handleReject = async () => {
    if (!transferId) return;
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối phiếu điều chuyển");
      return;
    }

    try {
      await rejectTransfer({
        id: transferId,
        body: { rejectionReason: rejectionReason.trim() },
      }).unwrap();

      toast.success("Đã từ chối phiếu điều chuyển nhân sự");
      setRejectionReason("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể từ chối phiếu điều chuyển");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <XCircle className="w-5 h-5" />
            Từ chối phiếu điều chuyển
          </DialogTitle>
          <DialogDescription>
            Phiếu sẽ chuyển sang trạng thái <strong>Từ chối</strong> và người tạo có thể xem lý do hoặc lập lại phiếu mới.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="text-xs font-medium text-foreground">
            Lý do từ chối <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Nêu rõ lý do không đồng thuận điều chuyển nhân sự..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            className="text-xs resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleReject} disabled={isLoading} variant="destructive">
            {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
