"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertCircle, Clock, Hash, MapPin, Sparkles, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VerificationResultBadge } from "../shared/verification-result-badge";
import type { AttendanceLogResponse } from "../../types/attendance.types";

interface PunchResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AttendanceLogResponse | null;
  previewImage?: string | null;
  employeeName?: string | null;
}

export function PunchResultDialog({
  open,
  onOpenChange,
  result,
  previewImage,
  employeeName,
}: PunchResultDialogProps) {
  if (!result) return null;

  const isSuccess = result.verificationResult === "SUCCESS";
  const eventLabel = result.eventType === "CHECK_IN" ? "Vào ca (Check-in)" : "Tan ca (Check-out)";
  const displayName = result.employeeName || employeeName || "Nhân viên";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="items-center text-center pb-1">
          <div
            className={`p-3 rounded-full mb-2 ${
              isSuccess ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>
          <DialogTitle className="text-xl">
            {isSuccess ? `Chấm công ${eventLabel} thành công!` : `Ghi nhận lượt quét ${eventLabel}`}
          </DialogTitle>
          <div className="pt-2">
            <VerificationResultBadge result={result.verificationResult} />
          </div>
        </DialogHeader>

        {/* Khung hiển thị Ảnh chụp thực tế & Tên nhân viên */}
        {previewImage && (
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Ảnh điểm danh Face AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-center">
              <p className="font-semibold text-sm text-foreground flex items-center justify-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                {displayName}
              </p>
              {result.employeeCode && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Mã NV: {result.employeeCode}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-xs">
          {/* Thời gian */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Thời gian ghi nhận:
            </span>
            <span className="font-semibold text-foreground">
              {new Date(result.punchTime || result.occurredAt || "").toLocaleString("vi-VN")}
            </span>
          </div>

          {/* Độ khớp khuôn mặt AI */}
          {result.faceMatchScore !== undefined && result.faceMatchScore !== null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Độ khớp Face AI:
              </span>
              <span
                className={`font-semibold ${
                  result.faceMatchScore >= 80
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {result.faceMatchScore.toFixed(1)}%
              </span>
            </div>
          )}

          {/* Khoảng cách Geofence */}
          {result.distanceMeters !== undefined && result.distanceMeters !== null && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Khoảng cách GPS:
              </span>
              <span className="font-semibold">
                {result.distanceMeters} mét
              </span>
            </div>
          )}

          {/* Mã giao dịch bất biến */}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5" />
              Mã giao dịch (Audit Log):
            </span>
            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]">
              {result.transactionCode}
            </span>
          </div>
        </div>

        {!isSuccess && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Lượt quẹt đã được lưu vào hệ thống kiểm toán. Nếu có sai lệch do vị trí hoặc khuôn mặt, bạn có thể tạo &ldquo;Đơn giải trình chấm công&rdquo; để quản lý phê duyệt.
            </span>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
