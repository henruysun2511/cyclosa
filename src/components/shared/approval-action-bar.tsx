"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ConfirmReasonDialog } from "./confirm-reason-dialog";

export interface ApprovalActionBarProps {
  requestId: string | number;
  requestTitle?: string;
  onApprove: (comment?: string) => void | Promise<void>;
  onReject: (reason: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function ApprovalActionBar({
  requestId,
  requestTitle = "yêu cầu này",
  onApprove,
  onReject,
  isLoading = false,
}: ApprovalActionBarProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  return (
    <>
      <div
        data-request-id={requestId}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-border py-3 px-4 sm:px-8 shadow-lg transition-all"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-sm font-medium text-foreground">
              Bạn có quyền phê duyệt {requestTitle}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="outline"
              className="text-primary border-primary/30 hover:bg-red-50 hover:text-primary"
              onClick={() => setRejectDialogOpen(true)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1.5" />
              Từ chối
            </Button>

            <Button
              type="button"
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
              onClick={() => setApproveDialogOpen(true)}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 mr-1.5" />
              Phê duyệt
            </Button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <ConfirmReasonDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Từ chối phê duyệt"
        description="Vui lòng cung cấp lý do từ chối để người gửi nắm được thông tin chỉnh sửa."
        reasonLabel="Lý do từ chối"
        reasonPlaceholder="Nhập lý do từ chối yêu cầu..."
        confirmText="Xác nhận từ chối"
        variant="destructive"
        requiredReason={true}
        onConfirm={async (reason) => {
          await onReject(reason);
        }}
        isLoading={isLoading}
      />

      {/* Approve Modal (Optional comment) */}
      <ConfirmReasonDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        title="Xác nhận phê duyệt"
        description="Bạn có chắc chắn muốn phê duyệt yêu cầu này không?"
        reasonLabel="Ghi chú thêm (không bắt buộc)"
        reasonPlaceholder="Nhập ý kiến chỉ đạo hoặc ghi chú kèm theo nếu có..."
        confirmText="Đồng ý duyệt"
        variant="default"
        requiredReason={false}
        minCharacters={0}
        onConfirm={async (comment) => {
          await onApprove(comment);
        }}
        isLoading={isLoading}
      />
    </>
  );
}
