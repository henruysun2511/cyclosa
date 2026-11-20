"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { OnboardingTaskDto } from "../../types/onboarding.types";

interface TaskCompleteDialogProps {
  task: OnboardingTaskDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (taskId: string, notes?: string, documentUrl?: string) => Promise<void>;
}

export function TaskCompleteDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
}: TaskCompleteDialogProps) {
  const [notes, setNotes] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(task.id, notes.trim() || undefined, documentUrl.trim() || undefined);
      setNotes("");
      setDocumentUrl("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              Xác nhận Hoàn thành Công việc
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Đánh dấu hoàn tất cho đầu việc: <strong className="text-foreground">{task.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          {task.documentRequired && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Đường dẫn tài liệu / File minh chứng <span className="text-destructive">*</span>
              </Label>
              <Input
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="https://drive.google.com/file/... hoặc URL tài liệu"
                className="h-8 text-xs font-mono"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Ghi chú xác nhận (Tùy chọn)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đã tiếp nhận bản sao CCCD công chứng và lưu hồ sơ lưu trữ nhân sự..."
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
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isSubmitting ? "Đang lưu..." : "Xác nhận hoàn thành"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

