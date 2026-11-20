"use client";

import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  useApproveAttendanceRequestMutation,
  useRejectAttendanceRequestMutation,
} from "../../api/attendance-api";
import type { AttendanceRequestResponse } from "../../types/attendance.types";

interface RequestReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AttendanceRequestResponse | null;
  onSuccess?: () => void;
}

export function RequestReviewDialog({
  open,
  onOpenChange,
  request,
  onSuccess,
}: RequestReviewDialogProps) {
  const [approveRequest, { isLoading: isApproving }] = useApproveAttendanceRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectAttendanceRequestMutation();

  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(true);
  const [adjustedInTime, setAdjustedInTime] = useState("");
  const [adjustedOutTime, setAdjustedOutTime] = useState("");

  // Sync initial adjusted times from request
  React.useEffect(() => {
    if (request) {
      setAdjustedInTime(
        request.proposedInTime
          ? new Date(request.proposedInTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : ""
      );
      setAdjustedOutTime(
        request.proposedOutTime
          ? new Date(request.proposedOutTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : ""
      );
    }
  }, [request]);

  if (!request) return null;

  const handleApprove = async () => {
    try {
      await approveRequest({
        id: request.id,
        body: {
          comment: comment.trim() || undefined,
          adjustedInTime:
            isAdjusting && adjustedInTime
              ? `${request.attendanceDate}T${adjustedInTime}:00`
              : undefined,
          adjustedOutTime:
            isAdjusting && adjustedOutTime
              ? `${request.attendanceDate}T${adjustedOutTime}:00`
              : undefined,
        },
      }).unwrap();

      toast.success("Đã phê duyệt đơn giải trình thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phê duyệt đơn");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối đơn");
      return;
    }

    try {
      await rejectRequest({
        id: request.id,
        reason: rejectionReason,
      }).unwrap();

      toast.success("Đã từ chối đơn giải trình");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể từ chối đơn");
    }
  };

  const isLoading = isApproving || isRejecting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Xem xét & Phê duyệt giải trình</DialogTitle>
          <DialogDescription>
            Đơn của nhân viên: <strong>{request.employeeName || request.employeeCode}</strong> ({request.attendanceDate})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Thông tin đơn */}
          <div className="rounded-xl border bg-muted/30 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Loại đơn:</span>
              <span className="font-semibold">{request.requestType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giờ đề xuất:</span>
              <span className="font-mono font-medium">
                {request.proposedInTime ? new Date(request.proposedInTime).toLocaleTimeString("vi-VN") : "--"}
                {" đến "}
                {request.proposedOutTime ? new Date(request.proposedOutTime).toLocaleTimeString("vi-VN") : "--"}
              </span>
            </div>
            <div className="border-t pt-1.5">
              <span className="text-muted-foreground block mb-0.5">Lý do nhân viên gửi:</span>
              <p className="text-foreground italic">{request.reason}</p>
            </div>
          </div>

          {/* Công nhận giờ điều chỉnh công */}
          <div className="space-y-3 rounded-xl border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Tự động sinh điều chỉnh công</Label>
                <p className="text-[11px] text-muted-foreground">
                  Ghi nhận giờ vào/ra chính thức vào bảng công nhật
                </p>
              </div>
              <Switch checked={isAdjusting} onCheckedChange={setIsAdjusting} />
            </div>

            {isAdjusting && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Giờ vào công nhận</Label>
                  <Input
                    type="time"
                    value={adjustedInTime}
                    onChange={(e) => setAdjustedInTime(e.target.value)}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Giờ ra công nhận</Label>
                  <Input
                    type="time"
                    value={adjustedOutTime}
                    onChange={(e) => setAdjustedOutTime(e.target.value)}
                    className="h-8 mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ý kiến phê duyệt / Lý do từ chối */}
          <div className="space-y-2">
            <Label className="text-xs">Ý kiến người duyệt (ghi chú nội bộ)</Label>
            <Textarea
              placeholder="Nhập ghi chú cho nhân viên hoặc phòng nhân sự..."
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-destructive">Lý do từ chối (bắt buộc nếu bấm Từ chối)</Label>
            <Input
              placeholder="Nhập lý do không chấp thuận giải trình..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="h-8"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
            className="gap-1"
          >
            <XCircle className="h-4 w-4" />
            Từ chối đơn
          </Button>
          <Button
            type="button"
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
          >
            <CheckCircle2 className="h-4 w-4" />
            Phê duyệt & Điều chỉnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

