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
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, LogIn, LogOut } from "lucide-react";
import { VerificationResultBadge } from "../shared/verification-result-badge";
import type { AttendanceLogResponse } from "../../types/attendance.types";

interface MyPunchLogsTableProps {
  logs: AttendanceLogResponse[];
  isLoading: boolean;
}

export function MyPunchLogsTable({ logs, isLoading }: MyPunchLogsTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[180px]">Thời gian quét</TableHead>
            <TableHead className="w-[130px]">Loại sự kiện</TableHead>
            <TableHead className="text-center">Kết quả xác thực</TableHead>
            <TableHead className="text-center">Độ khớp Face AI</TableHead>
            <TableHead className="text-center">Khoảng cách GPS</TableHead>
            <TableHead className="text-right">Mã kiểm toán (Audit)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Clock className="h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Chưa có lượt quét thẻ nào được ghi nhận</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-muted/40 text-xs">
                <TableCell className="font-medium">
                  {new Date(log.punchTime || log.occurredAt || "").toLocaleString("vi-VN")}
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
  );
}

