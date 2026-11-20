"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useExtendTemporaryTransferMutation } from "../api/transfer-api";

interface ExtendTransferDialogProps {
  transferId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ExtendTransferDialog({
  transferId,
  open,
  onOpenChange,
  onSuccess,
}: ExtendTransferDialogProps) {
  const [newEndDate, setNewEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [extendTransfer, { isLoading }] = useExtendTemporaryTransferMutation();

  const handleExtend = async () => {
    if (!transferId) return;
    if (!newEndDate) {
      toast.error("Vui lòng chọn ngày kết thúc gia hạn mới");
      return;
    }

    try {
      await extendTransfer({
        id: transferId,
        body: {
          newEndDate,
          notes: notes.trim() || undefined,
        },
      }).unwrap();

      toast.success("Gia hạn thời gian điều chuyển tạm thời thành công");
      setNewEndDate("");
      setNotes("");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể gia hạn điều chuyển");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600">
            <Calendar className="w-5 h-5" />
            Gia hạn điều chuyển tạm thời / Biệt phái
          </DialogTitle>
          <DialogDescription>
            Kéo dài thời hạn công tác biệt phái của nhân sự tại đơn vị tiếp nhận.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Ngày kết thúc mới <span className="text-destructive">*</span>
            </label>
            <Input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="h-9 text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Lý do / Căn cứ gia hạn
            </label>
            <Textarea
              placeholder="Nêu rõ lý do gia hạn thêm thời gian biệt phái..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-xs resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleExtend} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white">
            {isLoading ? "Đang xử lý..." : "Xác nhận gia hạn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
