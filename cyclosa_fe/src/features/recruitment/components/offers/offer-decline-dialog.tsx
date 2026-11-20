"use client";

import React, { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
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
import type { OfferDto } from "../../types/recruitment.types";

interface OfferDeclineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: OfferDto | null;
  onConfirm: (id: string, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export function OfferDeclineDialog({
  open,
  onOpenChange,
  offer,
  onConfirm,
  isLoading = false,
}: OfferDeclineDialogProps) {
  const [reason, setReason] = useState("");

  if (!offer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onConfirm(offer.id, reason.trim());
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
            <XCircle className="h-5 w-5 text-rose-600" />
            Ghi nhận Ứng viên từ chối Thư mời nhận việc
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ứng viên <strong className="text-foreground">{offer.candidateName}</strong> từ chối vị trí <strong className="text-foreground">{offer.jobOpeningTitle}</strong>.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-xs font-medium">
              Lý do ứng viên từ chối <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="VD: Nhận offer khác mức lương cao hơn, không phù hợp địa điểm đi lại..."
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
                <span>Xác nhận từ chối</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

