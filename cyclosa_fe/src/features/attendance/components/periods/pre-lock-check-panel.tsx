"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, FileQuestion, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimesheetPreLockCheckResponse } from "../../types/attendance.types";

interface PreLockCheckPanelProps {
  checkData?: TimesheetPreLockCheckResponse;
  isLoading: boolean;
}

export function PreLockCheckPanel({ checkData, isLoading }: PreLockCheckPanelProps) {
  if (isLoading) {
    return (
      <Card className="shadow-xs border">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isReady = checkData?.readyToLock;

  return (
    <Card className="shadow-xs border">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            Kiểm tra điều kiện trước khóa
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Hệ thống tự động quét và cảnh báo các đơn từ chưa giải quyết hoặc bất thường chưa xử lý
          </p>
        </div>
        <div>
          {isReady ? (
            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Đủ điều kiện khóa kỳ
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1 py-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Còn tồn đọng cần xử lý
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Đơn giải trình chưa duyệt */}
          <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FileQuestion className="h-3.5 w-3.5" />
                Đơn chưa duyệt
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  (checkData?.pendingRequestsCount || 0) > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600"
                }`}
              >
                {checkData?.pendingRequestsCount || 0} đơn
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {(checkData?.pendingRequestsCount || 0) > 0
                ? "Cần duyệt hết trước khi khóa"
                : "Tất cả đơn đã được xử lý"}
            </p>
          </div>

          {/* Bất thường chấm công */}
          <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Bất thường chưa sửa
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  (checkData?.unresolvedAnomaliesCount || 0) > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600"
                }`}
              >
                {checkData?.unresolvedAnomaliesCount || 0} ca
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {(checkData?.unresolvedAnomaliesCount || 0) > 0
                ? "Thiếu quẹt vào/ra hoặc vắng"
                : "Không có lỗi quẹt thẻ tồn đọng"}
            </p>
          </div>

          {/* Tổng nhân sự hợp lệ */}
          <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Tổng nhân sự chốt
              </span>
              <span className="font-mono font-bold text-sm text-foreground">
                {checkData?.eligibleEmployeesCount || 0} người
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sẽ sinh {checkData?.eligibleEmployeesCount || 0} bản ghi Snapshot
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

