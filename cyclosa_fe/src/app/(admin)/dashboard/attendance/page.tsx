"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  CalendarCheck,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/features/dashboard/components/shared/dashboard-header";
import { DashboardNavTabs } from "@/features/dashboard/components/shared/dashboard-nav-tabs";
import {
  DashboardKpiCards,
  DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { AreaTrendChart } from "@/features/dashboard/components/charts/area-trend-chart";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";
import { HorizontalRankChart } from "@/features/dashboard/components/charts/horizontal-rank-chart";
import { StackedBarChart } from "@/features/dashboard/components/charts/stacked-bar-chart";
import { useGetAttendanceDashboardQuery } from "@/features/dashboard/api/dashboard-api";

export default function AttendanceDashboardPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetAttendanceDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "on_time_rate",
      title: "Tỷ lệ chuyên cần đúng giờ",
      value: (dashboard?.onTimeRateToday ?? 0).toFixed(1),
      unit: "%",
      icon: CheckCircle2,
      iconBgColor: "bg-indigo-600 text-white",
      change: 1.5,
      changeLabel: "so với hôm qua",
      sparkline: [93, 94.2, 93.8, 95.1, 96.0, dashboard?.onTimeRateToday ?? 96.5],
    },
    {
      id: "late_early_count",
      title: "Lượt đi muộn về sớm",
      value: (dashboard?.lateEarlyCountMonth ?? 0).toLocaleString("vi-VN"),
      unit: "lượt",
      icon: AlertCircle,
      iconBgColor: (dashboard?.lateEarlyCountMonth ?? 0) > 20 ? "bg-amber-600 text-white" : "bg-blue-600 text-white",
      change: -14.2,
      changeLabel: "giảm thiểu đi muộn",
      sparkline: [45, 38, 32, 28, 22, dashboard?.lateEarlyCountMonth ?? 18],
    },
    {
      id: "total_ot_hours",
      title: "Tổng giờ làm thêm",
      value: (dashboard?.totalOvertimeHours ?? 0).toFixed(0),
      unit: "giờ",
      icon: Flame,
      iconBgColor: "bg-purple-600 text-white",
      change: 5.6,
      changeLabel: "phục vụ tiến độ dự án",
      sparkline: [120, 140, 155, 130, 175, dashboard?.totalOvertimeHours ?? 190],
    },
    {
      id: "pending_leaves",
      title: "Đơn nghỉ phép chờ duyệt",
      value: (dashboard?.pendingLeaveRequests ?? 0).toLocaleString("vi-VN"),
      unit: "đơn",
      icon: CalendarCheck,
      iconBgColor: "bg-emerald-600 text-white",
      change: 0.0,
      changeLabel: "cần quản lý phê duyệt",
      sparkline: [8, 12, 10, 6, 5, dashboard?.pendingLeaveRequests ?? 4],
    },
  ];

  const lateTrendData = (dashboard?.dailyLateTrend || []).map((d) => ({
    label: d.dayOfWeek,
    value: d.lateCount,
    secondaryValue: d.absentCount,
  }));

  const topOtItems = (dashboard?.topOvertimeDepartments || []).map((ot) => ({
    label: ot.departmentName,
    value: ot.totalOvertimeHours,
    subText: `BQ ${ot.averageHoursPerEmployee.toFixed(1)} giờ mỗi người`,
  }));

  const leaveColors = [
    "#2563eb",
    "#d97706",
    "#db2777",
    "#475569",
    "#7c3aed",
  ];

  const leaveData = (dashboard?.leaveTypeDistribution || []).map((l, i) => ({
    label: l.label ? l.label.replace(/\s*\([^)]*\)/g, "") : l.leaveType,
    value: l.daysCount,
    color: leaveColors[i % leaveColors.length],
  }));

  const shiftSeries = [
    { name: "Có mặt", colorClass: "bg-emerald-600", fillHex: "#059669" },
    { name: "Đi muộn", colorClass: "bg-amber-500", fillHex: "#d97706" },
    { name: "Vắng mặt", colorClass: "bg-rose-600", fillHex: "#dc2626" },
  ];

  const shiftData = (dashboard?.shiftAttendanceSummary || []).map((s) => ({
    label: s.shiftName,
    values: [s.presentCount, s.lateCount, s.absentCount],
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Chấm công & Ca kíp"
        subtitle="Giám sát chuyên cần, phân bổ ca kíp và giờ làm thêm toàn công ty"
        icon={Clock}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Row 1: Daily Late Trend & Leave Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily late trend (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Xu hướng vi phạm đi muộn trong tuần
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Số lượt ghi nhận đi muộn và vắng mặt theo từng ngày trong tuần
              </CardDescription>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-700" />
              Xu hướng giảm dần
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={lateTrendData}
              primaryLabel="Lượt đi muộn"
              secondaryLabel="Vắng mặt"
              height={260}
            />
          </CardContent>
        </Card>

        {/* Leave distribution Donut (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Cơ cấu lý do nghỉ phép
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ số ngày nghỉ phép theo từng loại chế độ
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={leaveData}
              centerLabel="Tổng ngày nghỉ"
              size={170}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Top OT Departments & Shift Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top OT Departments */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-purple-600" />
              Khối phòng ban làm thêm giờ nhiều nhất
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Xếp hạng theo tổng số giờ làm việc ngoài giờ lũy kế
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <HorizontalRankChart
              items={topOtItems}
              maxItems={5}
              unit="giờ"
              barColor="bg-purple-600"
            />
          </CardContent>
        </Card>

        {/* Shift Distribution */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              Tình hình chuyên cần theo ca làm việc
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ có mặt, đi muộn và vắng mặt tại các ca kíp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              series={shiftSeries}
              data={shiftData}
              height={230}
              stacked={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
