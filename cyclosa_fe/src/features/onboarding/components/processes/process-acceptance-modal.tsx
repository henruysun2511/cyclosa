"use client";

import React, { useState } from "react";
import { Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingProcessDto } from "../../types/onboarding.types";

interface ProcessAcceptanceModalProps {
  process: OnboardingProcessDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (notes?: string) => Promise<void>;
}

export function ProcessAcceptanceModal({
  process,
  open,
  onOpenChange,
  onConfirm,
}: ProcessAcceptanceModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!process) return null;

  const hasUnfinishedMandatory = (process.mandatoryUnfinishedTasks || 0) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasUnfinishedMandatory) return;
    setIsSubmitting(true);
    try {
      await onConfirm(notes.trim() || undefined);
      setNotes("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              Nghiệm thu Đạt Thử việc & Tiếp nhận Chính thức
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Xác nhận hoàn thành tiến trình hội nhập cho nhân sự:{" "}
            <strong className="text-foreground">{process.employeeName}</strong> ({process.employeeCode})
          </DialogDescription>
        </DialogHeader>

        {hasUnfinishedMandatory ? (
          <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-destructive font-bold">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Chưa đủ điều kiện nghiệm thu</span>
            </div>
            <p className="text-muted-foreground">
              Vẫn còn <strong className="text-destructive">{process.mandatoryUnfinishedTasks} công việc bắt buộc</strong> chưa được hoàn thành.
              Quy định của doanh nghiệp yêu cầu 100% công việc bắt buộc phải hoàn thành trước khi nghiệm thu đạt thử việc.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Đủ điều kiện tiếp nhận chính thức!</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-200">
              Nhân viên đã hoàn thành toàn bộ các đầu việc bắt buộc trong kỳ thử việc. Bấm xác nhận để chuyển trạng thái sang Đã hoàn thành (COMPLETED).
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              Nhận xét đánh giá nghiệm thu (Tùy chọn)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Nhân viên hòa nhập tốt, nắm bắt nhanh công việc chuyên môn, đáp ứng tốt kỳ vọng của dự án..."
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Đóng
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || hasUnfinishedMandatory}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận Nghiệm thu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

