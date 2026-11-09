"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useApproveWorkflowStepMutation,
  useRejectWorkflowStepMutation,
  useCancelWorkflowRequestMutation,
} from "../api/workflow-api";
import type { WorkflowRequestResponse } from "../types/workflow.types";

export type ApprovalActionMode = "APPROVE" | "REJECT" | "CANCEL";

interface ApprovalActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ApprovalActionMode | null;
  request: WorkflowRequestResponse | null;
  stepId?: string; // Bước hiện tại đang duyệt (nếu có)
  onSuccess?: () => void;
}

export function ApprovalActionDialog({
  isOpen,
  onClose,
  mode,
  request,
  stepId,
  onSuccess,
}: ApprovalActionDialogProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [approveStep, { isLoading: isApproving }] = useApproveWorkflowStepMutation();
  const [rejectStep, { isLoading: isRejecting }] = useRejectWorkflowStepMutation();
  const [cancelWorkflow, { isLoading: isCancelling }] = useCancelWorkflowRequestMutation();

  const isLoading = isApproving || isRejecting || isCancelling;

  useEffect(() => {
    if (isOpen) {
      setComment("");
      setError(null);
    }
  }, [isOpen]);

  if (!mode || !request) return null;

  const handleSubmit = async () => {
    if (mode === "REJECT") {
      if (!comment.trim() || comment.trim().length < 5) {
        setError("Lý do từ chối phải có tối thiểu 5 ký tự.");
        return;
      }
    }

    if (mode === "CANCEL") {
      if (!comment.trim() || comment.trim().length < 3) {
        setError("Lý do hủy yêu cầu phải có tối thiểu 3 ký tự.");
        return;
      }
    }

    setError(null);

    try {
      if (mode === "APPROVE") {
        if (!stepId) {
          toast.error("Không tìm thấy thông tin bước duyệt hiện tại.");
          return;
        }
        await approveStep({
          requestId: request.id,
          stepId,
          body: { comment: comment.trim() || undefined },
        }).unwrap();
        toast.success("Đã phê duyệt bước thành công!");
      } else if (mode === "REJECT") {
        if (!stepId) {
          toast.error("Không tìm thấy thông tin bước duyệt hiện tại.");
          return;
        }
        await rejectStep({
          requestId: request.id,
          stepId,
          body: { comment: comment.trim() },
        }).unwrap();
        toast.success("Đã gửi quyết định từ chối phê duyệt.");
      } else if (mode === "CANCEL") {
        await cancelWorkflow({
          requestId: request.id,
          body: { reason: comment.trim() },
        }).unwrap();
        toast.success("Đã hủy yêu cầu phê duyệt thành công.");
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err?.data?.message || "Đã xảy ra lỗi khi thực hiện thao tác.";
      toast.error(msg);
    }
  };

  const getDialogConfig = () => {
    switch (mode) {
      case "APPROVE":
        return {
          title: "Xác nhận phê duyệt",
          desc: "Bạn có chắc chắn muốn thông qua bước phê duyệt này?",
          icon: CheckCircle2,
          iconColor: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400",
          submitLabel: "Đồng ý phê duyệt",
          submitVariant: "default" as const,
          placeholder: "Nhập ý kiến phê duyệt hoặc ghi chú (không bắt buộc)...",
          requiredReason: false,
        };
      case "REJECT":
        return {
          title: "Từ chối phê duyệt",
          desc: "Quy trình sẽ dừng lại ngay sau khi bạn từ chối. Vui lòng nêu rõ lý do.",
          icon: XCircle,
          iconColor: "text-red-600 bg-red-100 dark:bg-red-950/50 dark:text-red-400",
          submitLabel: "Xác nhận từ chối",
          submitVariant: "destructive" as const,
          placeholder: "Nhập chi tiết lý do từ chối (tối thiểu 5 ký tự)...",
          requiredReason: true,
        };
      case "CANCEL":
        return {
          title: "Hủy yêu cầu phê duyệt",
          desc: "Yêu cầu đã gửi sẽ bị hủy bỏ và chuyển trạng thái kết thúc.",
          icon: AlertTriangle,
          iconColor: "text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400",
          submitLabel: "Xác nhận hủy",
          submitVariant: "destructive" as const,
          placeholder: "Nhập lý do hủy yêu cầu (tối thiểu 3 ký tự)...",
          requiredReason: true,
        };
    }
  };

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">{config.title}</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {config.desc}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="bg-muted/40 rounded-lg p-3 text-sm space-y-1.5 border">
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">Mã hồ sơ:</span>
            <span className="font-medium font-mono text-xs">{request.referenceCode || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">Tiêu đề:</span>
            <span className="font-semibold text-xs text-right max-w-[280px] truncate">{request.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground text-xs">Người gửi:</span>
            <span className="text-xs">{request.requesterName}</span>
          </div>
          {request.currentStepName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Bước hiện tại:</span>
              <span className="text-xs font-medium text-primary">
                Bước {request.currentStepOrder}: {request.currentStepName}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="comment" className="text-sm font-medium">
            {config.requiredReason ? (
              <span>
                Lý do thực hiện <span className="text-destructive">*</span>
              </span>
            ) : (
              "Ý kiến / Ghi chú phản hồi"
            )}
          </Label>
          <Textarea
            id="comment"
            rows={3}
            placeholder={config.placeholder}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError(null);
            }}
            className={error ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Đóng
          </Button>
          <Button
            type="button"
            variant={config.submitVariant}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {config.submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

