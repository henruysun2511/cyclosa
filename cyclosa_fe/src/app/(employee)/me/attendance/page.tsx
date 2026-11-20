"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Camera, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttendancePageHeader,
  MyAttendanceStats,
  MyDailyRecordsTable,
  MyPunchLogsTable,
  MySnapshotsTable,
  useGetMyDailyRecordsQuery,
  useGetMyAttendanceLogsQuery,
  useGetMyTimesheetSnapshotsQuery,
} from "@/features/attendance";

export default function MyAttendancePage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);

  // Queries
  const { data: dailyData, isLoading: isDailyLoading } = useGetMyDailyRecordsQuery({
    year,
    month,
  });
  const { data: logsData, isLoading: isLogsLoading } = useGetMyAttendanceLogsQuery({
    page: 0,
    size: 50,
  });
  const { data: snapshotsData, isLoading: isSnapshotsLoading } = useGetMyTimesheetSnapshotsQuery({
    year,
  });

  const dailyRecords = dailyData?.data?.items || [];
  const punchLogs = logsData?.data?.items || [];
  const snapshots = snapshotsData?.data || [];

  const years = [currentYear - 1, currentYear, currentYear + 1];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Bảng công"
        breadcrumbs={[
          { label: "Cổng nhân viên", href: "/me" },
          { label: "Bảng công" },
        ]}
        icon={CalendarCheck}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" asChild>
              <Link href="/me/attendance/requests">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Đơn giải trình
              </Link>
            </Button>
            <Button size="sm" className="h-9 gap-1.5 text-xs bg-primary text-white shadow-xs" asChild>
              <Link href="/me/attendance/check-in">
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                Điểm danh Face AI
              </Link>
            </Button>
          </div>
        }
      />

      {/* Bộ chọn Tháng / Năm */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Tháng:
            </span>
            <Select value={String(month)} onValueChange={(val) => setMonth(Number(val))}>
              <SelectTrigger className="w-[110px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    Tháng {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Năm:</span>
            <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    Năm {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <span className="text-xs text-muted-foreground hidden sm:inline">
          Dữ liệu công được tính toán theo thời gian thực (First-In, Last-Out)
        </span>
      </div>

      {/* KPI Thống kê tháng */}
      <MyAttendanceStats records={dailyRecords} isLoading={isDailyLoading} />

      {/* Tabs dữ liệu */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="daily">Bảng công nhật</TabsTrigger>
          <TabsTrigger value="logs">Lịch sử quét thô</TabsTrigger>
          <TabsTrigger value="snapshots">Kỳ công đã chốt</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <MyDailyRecordsTable
            records={dailyRecords}
            isLoading={isDailyLoading}
            onRequestExplanation={(_record) => {
              window.location.href = "/me/attendance/requests";
            }}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <MyPunchLogsTable logs={punchLogs} isLoading={isLogsLoading} />
        </TabsContent>

        <TabsContent value="snapshots" className="space-y-4">
          <MySnapshotsTable snapshots={snapshots} isLoading={isSnapshotsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

