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
import { Clock, CheckCircle2, XCircle, Ban, Eye, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { ATTENDANCE_REQUEST_TYPES } from "../../constants/attendance.constants";
import type { AttendanceRequestResponse } from "../../types/attendance.types";
import type { PageData } from "@/types/api.types";

interface AdminRequestTableProps {
  data?: PageData<AttendanceRequestResponse>;
  isLoading: boolean;
  onReviewRequest: (request: AttendanceRequestResponse) => void;
  onPageChange: (newPage: number) => void;
}

export function AdminRequestTable({
  data,
  isLoading,
  onReviewRequest,
  onPageChange,
}: AdminRequestTableProps) {
  const items = data?.items || [];
  const totalPages = data?.pagination?.pages || 0;
  const currentPage = data?.pagination?.page || 0;
  const totalElements = data?.pagination?.total || 0;

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
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Nhân viên</TableHead>
              <TableHead>Loại đơn</TableHead>
              <TableHead>Ngày áp dụng</TableHead>
              <TableHead className="text-center">Giờ đề xuất</TableHead>
              <TableHead className="max-w-xs">Lý do giải trình</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileQuestion className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Không tìm thấy đơn giải trình nào</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {req.employeeName || req.employeeId.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{req.employeeCode}</div>
                  </TableCell>
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
                  <TableCell className="text-right">
                    <Button
                      variant={req.status === "PENDING" ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => onReviewRequest(req)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {req.status === "PENDING" ? "Xem xét duyệt" : "Xem chi tiết"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
          <div>
            Hiển thị <span className="font-medium">{items.length}</span> trên{" "}
            <span className="font-medium">{totalElements}</span> đơn
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 0 || isLoading}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Trang trước
            </Button>
            <span className="font-medium">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || isLoading}
              className="h-8"
            >
              Trang sau
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

