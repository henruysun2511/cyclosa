"use client";

import React, { useState } from "react";
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
import { AlertCircle } from "lucide-react";

export interface ConfirmReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default" | "warning";
  requiredReason?: boolean;
  minCharacters?: number;
  onConfirm: (reason: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function ConfirmReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  reasonLabel = "Lý do / Ý kiến bắt buộc",
  reasonPlaceholder = "Vui lòng nhập lý do chi tiết cho hành động này...",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  variant = "destructive",
  requiredReason = true,
  minCharacters = 5,
  onConfirm,
  isLoading = false,
}: ConfirmReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (requiredReason && reason.trim().length < minCharacters) {
      setError(`Vui lòng nhập ít nhất ${minCharacters} ký tự.`);
      return;
    }
    setError(null);
    await onConfirm(reason);
    setReason("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setReason("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
            )}
            <DialogTitle className="text-lg font-semibold text-foreground">
              {title}
            </DialogTitle>
          </div>
          {description && (
            <DialogDescription className="text-sm text-muted-foreground pt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-2 py-3">
          <Label htmlFor="action-reason" className="text-sm font-medium">
            {reasonLabel} {requiredReason && <span className="text-rose-500">*</span>}
          </Label>
          <Textarea
            id="action-reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder={reasonPlaceholder}
            className="min-h-24 resize-none"
            rows={3}
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
