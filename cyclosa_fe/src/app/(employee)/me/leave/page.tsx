"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
  type LeaveBalanceDto,
  type LeaveRequestDto,
} from "@/features/leave";

export default function EmployeeLeavePage() {
  const { data: balanceData, isLoading: isBalanceLoading } = useGetMyLeaveBalancesQuery();
  const { data: requestData, isLoading: isRequestLoading } = useGetMyLeaveRequestsQuery();

  const balances = balanceData?.data || [];
  const requests = requestData?.data?.items || [];

  const annualLeave = balances.find(
    (b: LeaveBalanceDto) => b.leaveTypeCode === "ANNUAL" || b.leaveTypeName?.toLowerCase().includes("năm")
  );

  const totalEntitled = annualLeave ? annualLeave.entitledDays : 0;
  const remainingDays = annualLeave ? annualLeave.remainingDays : 0;
  const usedDays = annualLeave ? annualLeave.usedDays : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <CalendarDays className="w-6 h-6 text-primary shrink-0" />
            <span>Nghỉ phép</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/me" className="hover:text-primary transition-colors">
              Cổng nhân viên
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Nghỉ phép</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button size="sm" className="h-9 gap-1.5 bg-primary text-white shadow-xs cursor-pointer" asChild>
            <Link href="/me/leave/new">
              <Plus className="w-4 h-4" />
              <span>Tạo đơn xin nghỉ phép</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ thống kê quỹ phép năm (Leave Quotas Strip) chuẩn 100% Rule 03 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-emerald-600 text-white">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Khả dụng còn lại
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {isBalanceLoading ? "..." : remainingDays}{" "}
                <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </h3>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path d="M0,32 Q30,15 60,28 T100,10" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-primary text-white">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Hạn mức cấp năm
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {isBalanceLoading ? "..." : totalEntitled}{" "}
                <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </h3>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path d="M0,35 Q25,38 50,22 T100,8" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-amber-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Đã sử dụng
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {isBalanceLoading ? "..." : usedDays}{" "}
                <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </h3>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path d="M0,28 Q35,12 70,25 T100,15" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-blue-600 text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Chế độ BHXH
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                30 <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </h3>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path d="M0,38 Q30,42 60,18 T100,5" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Danh sách đơn xin nghỉ phép */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Lịch sử đơn xin nghỉ phép
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Theo dõi trạng thái phê duyệt của các đơn xin nghỉ phép đã nộp
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Loại phép</TableHead>
                  <TableHead className="font-semibold text-xs">Thời gian nghỉ</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Buổi nghỉ</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Số ngày</TableHead>
                  <TableHead className="font-semibold text-xs">Lý do</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Ngày gửi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isRequestLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : requests.length > 0 ? (
                  requests.map((r: LeaveRequestDto) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-xs text-foreground">
                        {r.leaveTypeName || "Nghỉ phép"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.startDate} {r.endDate && r.endDate !== r.startDate ? `đến ${r.endDate}` : ""}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className="text-[10px]">
                          {r.dayPortion === "MORNING"
                            ? "Nửa ngày sáng"
                            : r.dayPortion === "AFTERNOON"
                            ? "Nửa ngày chiều"
                            : "Cả ngày"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-center font-bold">
                        {r.daysCount || 1.0}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {r.reason || "Việc cá nhân"}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge
                          className={
                            r.status === "APPROVED"
                              ? "bg-emerald-600 text-white text-[10px]"
                              : r.status === "REJECTED"
                              ? "bg-destructive text-white text-[10px]"
                              : "bg-amber-600 text-white text-[10px]"
                          }
                        >
                          {r.status === "APPROVED"
                            ? "Đã phê duyệt"
                            : r.status === "REJECTED"
                            ? "Đã từ chối"
                            : "Chờ phê duyệt"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground text-right">
                        {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("vi-VN") : "---"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <CalendarCheck className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có đơn xin nghỉ phép nào</p>
                        <p className="text-xs text-muted-foreground">Các đơn xin nghỉ phép của bạn sau khi tạo sẽ hiển thị tiến trình tại đây</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
