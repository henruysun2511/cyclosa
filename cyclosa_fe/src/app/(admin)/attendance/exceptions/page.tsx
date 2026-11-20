"use client";

import React, { useState } from "react";
import { AlertTriangle, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { toast } from "sonner";
import {
  AttendancePageHeader,
  useGetExceptionSummariesQuery,
  useGetDailyRecordsQuery,
} from "@/features/attendance";
import { ExceptionKpiCards } from "@/features/attendance/components/exceptions/exception-kpi-cards";

export default function AttendanceExceptionsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

  const { data: summaryData, isLoading: isSummaryLoading } = useGetExceptionSummariesQuery({
    date: selectedDate,
  });

  // Lấy các daily records có trạng thái bất thường
  const { data: recordsData, isLoading: isRecordsLoading } = useGetDailyRecordsQuery({
    date: selectedDate,
    page: 0,
    size: 50,
  });

  const abnormalRecords = (recordsData?.data?.items || []).filter(
    (r) => {
      if (selectedType === "MISSING") {
        return r.dailyStatus === "MISSING_CHECK_OUT" || r.status === "MISSING_CHECK_OUT";
      }
      return (
        r.dailyStatus === "ABSENT" ||
        r.dailyStatus === "MISSING_CHECK_OUT" ||
        (r.lateMinutes || 0) > 15 ||
        (r.earlyDepartureMinutes || 0) > 15
      );
    }
  );

  const handleSendReminder = (employeeName: string) => {
    toast.success(`Đã gửi thông báo nhắc nhở giải trình tới ${employeeName}`);
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Bất thường chấm công"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Bất thường chấm công" },
        ]}
        icon={AlertTriangle}
      />

      {/* KPI thẻ chỉ số bất thường */}
      <ExceptionKpiCards
        summary={summaryData?.data}
        selectedType={selectedType}
        onFilterType={setSelectedType}
        isLoading={isSummaryLoading}
      />

      {/* Bộ lọc ngày */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Ngày kiểm tra:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 rounded-md border text-xs bg-background"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Tìm thấy <span className="font-semibold text-rose-600 dark:text-rose-400">{abnormalRecords.length}</span> trường hợp cần xử lý
        </span>
      </div>

      {/* Bảng chi tiết các trường hợp bất thường */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[180px]">Nhân viên</TableHead>
              <TableHead>Ca làm việc</TableHead>
              <TableHead className="text-center">Giờ vào / Giờ ra</TableHead>
              <TableHead className="text-center">Loại bất thường</TableHead>
              <TableHead className="text-center">Độ lệch thời gian</TableHead>
              <TableHead className="text-right">Hành động nhắc nhở</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isRecordsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : abnormalRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Tuyệt vời! Không có bất thường nào được ghi nhận trong ngày này
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Toàn bộ nhân sự chấm công đúng quy định hoặc đã giải trình hợp lệ
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              abnormalRecords.map((r) => (
                <TableRow key={r.employeeId} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground">
                      {r.employeeName || r.employeeId.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{r.employeeCode}</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{r.shiftName}</span>
                    <span className="text-muted-foreground ml-1 text-[11px]">({r.shiftCode})</span>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {r.firstInTime ? new Date(r.firstInTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                    {" - "}
                    {r.lastOutTime ? new Date(r.lastOutTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                  </TableCell>
                  <TableCell className="text-center">
                    {r.dailyStatus === "ABSENT" ? (
                      <Badge variant="destructive">Vắng mặt không phép</Badge>
                    ) : r.dailyStatus === "MISSING_CHECK_OUT" ? (
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40">
                        Thiếu quẹt ra
                      </Badge>
                    ) : (r.lateMinutes || 0) > 15 ? (
                      <Badge variant="outline" className="text-rose-600 border-rose-300 bg-rose-50 dark:bg-rose-950/40">
                        Muộn {r.lateMinutes} phút
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Cần kiểm tra</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground font-mono">
                    {(r.lateMinutes || 0) > 0 && `Muộn: ${r.lateMinutes}p`}
                    {(r.earlyDepartureMinutes || 0) > 0 && ` Sớm: ${r.earlyDepartureMinutes}p`}
                    {!r.lateMinutes && !r.earlyDepartureMinutes && "--"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary hover:bg-primary/10"
                      onClick={() => handleSendReminder(r.employeeName || r.employeeCode || "Nhân viên")}
                    >
                      <Bell className="mr-1.5 h-3.5 w-3.5" />
                      Nhắc giải trình
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

