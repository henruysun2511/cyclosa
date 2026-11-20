"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileQuestion, XCircle, Clock, CheckCircle2, Ban } from "lucide-react";
import { ATTENDANCE_REQUEST_TYPES } from "../../constants/attendance.constants";
import type { AttendanceRequestResponse } from "../../types/attendance.types";

interface MyRequestsTableProps {
  requests: AttendanceRequestResponse[];
  isLoading: boolean;
  onCancelRequest?: (id: string) => void;
  isCancelling?: boolean;
}

export function MyRequestsTable({
  requests,
  isLoading,
  onCancelRequest,
  isCancelling,
}: MyRequestsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40 gap-1">
            <Clock className="h-3 w-3" /> Chờ duyệt
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 gap-1">
            <XCircle className="h-3 w-3" /> Từ chối
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="text-muted-foreground gap-1">
            <Ban className="h-3 w-3" /> Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeName = (type: string) => {
    return ATTENDANCE_REQUEST_TYPES.find((t: { value: string; label: string }) => t.value === type)?.label || type;
  };

  const formatTime = (iso?: string | null) => {
    if (!iso) return "--:--";
    return new Date(iso).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Loại đơn</TableHead>
            <TableHead>Ngày áp dụng</TableHead>
            <TableHead className="text-center">Giờ đề xuất (Vào / Ra)</TableHead>
            <TableHead className="max-w-xs">Lý do giải trình</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead>Ý kiến người duyệt</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileQuestion className="h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Bạn chưa có đơn giải trình chấm công nào</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-medium">
                  {getTypeName(req.requestType)}
                </TableCell>
                <TableCell>
                  {new Date(req.attendanceDate || req.workDate || "").toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {formatTime(req.proposedInTime)} - {formatTime(req.proposedOutTime)}
                </TableCell>
                <TableCell className="max-w-xs truncate" title={req.reason}>
                  {req.reason}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(req.status)}
                </TableCell>
                <TableCell className="text-muted-foreground italic truncate max-w-[150px]">
                  {req.rejectionReason || req.reviewerComment || "--"}
                </TableCell>
                <TableCell className="text-right">
                  {req.status === "PENDING" && onCancelRequest && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:bg-destructive/10"
                      disabled={isCancelling}
                      onClick={() => onCancelRequest(req.id)}
                    >
                      Hủy đơn
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

