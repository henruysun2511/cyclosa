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
import { Clock, LogIn, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { VerificationResultBadge } from "../shared/verification-result-badge";
import type { AttendanceLogResponse } from "../../types/attendance.types";
import type { PageData } from "@/types/api.types";

interface AttendanceLogTableProps {
  data?: PageData<AttendanceLogResponse>;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export function AttendanceLogTable({
  data,
  isLoading,
  onPageChange,
}: AttendanceLogTableProps) {
  const items = data?.items || [];
  const totalPages = data?.pagination?.pages || 0;
  const currentPage = data?.pagination?.page || 0;
  const totalElements = data?.pagination?.total || 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[170px]">Thời gian quét</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead className="w-[130px]">Loại sự kiện</TableHead>
              <TableHead className="text-center">Kết quả xác thực</TableHead>
              <TableHead className="text-center">Điểm Face AI</TableHead>
              <TableHead className="text-center">Khoảng cách GPS</TableHead>
              <TableHead className="text-right">Mã kiểm toán (Audit)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Clock className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">Không tìm thấy lượt quét thẻ nào phù hợp</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/40 text-xs">
                  <TableCell className="font-medium">
                    {new Date(log.punchTime || log.occurredAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {log.employeeName || log.employeeId.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {log.employeeCode || log.employeeId}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.eventType === "CHECK_IN" ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 gap-1">
                        <LogIn className="h-3 w-3" />
                        Vào ca
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/40 gap-1">
                        <LogOut className="h-3 w-3" />
                        Tan ca
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <VerificationResultBadge result={log.verificationResult} />
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {log.faceMatchScore !== undefined && log.faceMatchScore !== null
                      ? `${log.faceMatchScore.toFixed(1)}%`
                      : "--"}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {log.distanceMeters !== undefined && log.distanceMeters !== null
                      ? `${log.distanceMeters}m`
                      : "--"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                    {log.transactionCode}
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
            <span className="font-medium">{totalElements}</span> lượt quẹt thẻ
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

