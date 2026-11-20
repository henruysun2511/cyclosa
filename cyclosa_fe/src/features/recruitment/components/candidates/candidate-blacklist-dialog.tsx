"use client";

import React, { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CandidateDto } from "../../types/recruitment.types";

interface CandidateBlacklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateDto | null;
  onConfirm: (id: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function CandidateBlacklistDialog({
  open,
  onOpenChange,
  candidate,
  onConfirm,
  isLoading = false,
}: CandidateBlacklistDialogProps) {
  const [reason, setReason] = useState("");

  if (!candidate) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onConfirm(candidate.id, reason.trim());
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Đưa Ứng viên vào Danh sách đen (Blacklist)
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ứng viên <strong className="text-foreground">{candidate.fullName}</strong> ({candidate.email}) sẽ bị gắn cờ cảnh báo trong toàn bộ các chiến dịch tuyển dụng tiếp theo.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-medium">
              Lý do đưa vào Blacklist <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="VD: Không tham gia phỏng vấn không báo trước (No-show), gian lận thông tin bằng cấp..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs resize-none"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-9 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!reason.trim() || isLoading}
              className="h-9 text-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Xác nhận đưa vào Blacklist</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

