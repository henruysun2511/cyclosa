"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
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
import type { InternalOpportunityDto } from "../../types/recruitment.types";

interface InternalOppApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: InternalOpportunityDto | null;
  onSubmit: (id: string, coverLetter: string) => Promise<void>;
  isLoading?: boolean;
}

export function InternalOppApplyDialog({
  open,
  onOpenChange,
  opportunity,
  onSubmit,
  isLoading = false,
}: InternalOppApplyDialogProps) {
  const [coverLetter, setCoverLetter] = useState(
    "Tôi bày tỏ nguyện vọng được thuyên chuyển sang vị trí mới này nhằm phát huy thế mạnh năng lực kỹ thuật và cống hiến cho các dự án chiến lược của công ty."
  );

  if (!opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;
    await onSubmit(opportunity.id, coverLetter.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Nộp đơn Ứng tuyển Thuyên chuyển Nội bộ
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ứng tuyển vị trí <strong className="text-foreground">{opportunity.jobOpeningTitle}</strong> tại{" "}
            <strong className="text-foreground">{opportunity.departmentName}</strong>.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="coverLetter" className="text-xs font-medium">
              Thư ngỏ bày tỏ nguyện vọng & Lý do thuyên chuyển <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="coverLetter"
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Nêu lý do nguyện vọng, kinh nghiệm hiện tại và mục tiêu phát triển..."
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
              size="sm"
              disabled={!coverLetter.trim() || isLoading}
              className="h-9 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  <span>Đang gửi đơn...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Nộp đơn ứng tuyển</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

