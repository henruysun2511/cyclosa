"use client";

import React, { useState } from "react";
import {
  Building2,
  Armchair,
  Laptop,
  Wrench,
  Clock,
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
import { RadialGaugeChart } from "@/features/dashboard/components/charts/radial-gauge-chart";
import { AreaTrendChart } from "@/features/dashboard/components/charts/area-trend-chart";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";
import { StackedBarChart } from "@/features/dashboard/components/charts/stacked-bar-chart";
import { useGetWorkplaceDashboardQuery } from "@/features/dashboard/api/dashboard-api";

export default function WorkplaceDashboardPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetWorkplaceDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "seat_occupancy",
      title: "Tỷ lệ lấp đầy chỗ ngồi",
      value: (dashboard?.deskOccupancyRateToday ?? 0).toFixed(1),
      unit: "%",
      icon: Armchair,
      iconBgColor: "bg-blue-600 text-white",
      change: 3.5,
      changeLabel: "tối ưu hóa không gian",
      sparkline: [75, 78, 80, 82, 84, dashboard?.deskOccupancyRateToday ?? 85.5],
    },
    {
      id: "meeting_occupancy",
      title: "Tỷ lệ sử dụng phòng họp",
      value: (dashboard?.meetingRoomOccupancyRate ?? 0).toFixed(1),
      unit: "%",
      icon: Building2,
      iconBgColor: "bg-indigo-600 text-white",
      change: 1.2,
      changeLabel: "hiệu suất sử dụng tốt",
      sparkline: [62, 65, 68, 70, 71, dashboard?.meetingRoomOccupancyRate ?? 72.5],
    },
    {
      id: "total_asset_value",
      title: "Tổng tài sản trang thiết bị",
      value: dashboard?.formattedAssetValue || ((dashboard?.totalAssignedAssetValue ?? 0) / 1_000_000).toLocaleString("vi-VN", {
        maximumFractionDigits: 1,
      }) + " tr",
      unit: "VNĐ",
      icon: Laptop,
      iconBgColor: "bg-emerald-600 text-white",
      change: 5.2,
      changeLabel: "đầu tư trang thiết bị mới",
      sparkline: [1200, 1250, 1300, 1420, 1490, ((dashboard?.totalAssignedAssetValue ?? 0) / 1_000_000) || 1550],
    },
    {
      id: "damaged_assets",
      title: "Thiết bị bảo trì sửa chữa",
      value: (dashboard?.damagedOrPendingAssetsCount ?? 0).toLocaleString("vi-VN"),
      unit: "thiết bị",
      icon: Wrench,
      iconBgColor: (dashboard?.damagedOrPendingAssetsCount ?? 0) > 5 ? "bg-amber-600 text-white" : "bg-slate-600 text-white",
      change: -15.0,
      changeLabel: "đã khắc phục sớm",
      sparkline: [8, 7, 5, 4, 3, dashboard?.damagedOrPendingAssetsCount ?? 2],
    },
  ];

  const floorSeries = [
    { name: "Đã có người ngồi", colorClass: "bg-blue-600", fillHex: "#2563eb" },
    { name: "Chỗ trống", colorClass: "bg-slate-300", fillHex: "#94a3b8" },
  ];

  const floorData = (dashboard?.floorOccupancy || []).map((f) => ({
    label: f.floorName.replace(/\s*\([^)]*\)/g, ""),
    values: [f.occupiedSeats, Math.max(0, f.totalSeats - f.occupiedSeats)],
  }));

  const meetingTrendData = (dashboard?.peakMeetingHours || []).map((m) => ({
    label: m.hourSlot.replace(/\s*\([^)]*\)/g, ""),
    value: m.bookingCount,
  }));

  const assetCategoryData = (dashboard?.assetCategoryDistribution || []).map((c) => ({
    label: c.categoryName.replace(/\s*\([^)]*\)/g, ""),
    value: c.totalQuantity,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Không gian & Tài sản"
        subtitle="Lấp đầy chỗ ngồi văn phòng, sử dụng phòng họp và quản trị tài sản doanh nghiệp"
        icon={Building2}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Row 1: Floor Occupancy Stacked Bar & Overall Occupancy Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor breakdown (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Tỷ lệ lấp đầy chỗ ngồi theo tầng
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Số lượng bàn làm việc đang sử dụng và còn trống theo từng khu vực tầng
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold gap-1">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              {dashboard?.floorOccupancy?.length || 0} Tầng làm việc
            </Badge>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              series={floorSeries}
              data={floorData}
              height={250}
              stacked={true}
            />
          </CardContent>
        </Card>

        {/* Overall Seat Occupancy Gauge (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Tỷ lệ sử dụng không gian
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Mức độ tối ưu hóa mặt bằng văn phòng toàn công ty
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <RadialGaugeChart
              value={dashboard?.deskOccupancyRateToday ?? 0}
              maxValue={100}
              label="Tỷ lệ lấp đầy"
              subText="Ngưỡng chuẩn tối ưu: 80% đến 90%"
              colorScheme="dynamic"
            />
          </CardContent>
          <div className="p-4 border-t border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
            <span>Đánh giá hiệu suất mặt bằng:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Rất hiệu quả
            </span>
          </div>
        </Card>
      </div>

      {/* Row 2: Meeting Room Peak Hours & Asset Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Room Trend (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Khung giờ cao điểm sử dụng phòng họp
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Số lượt đặt và sử dụng phòng họp theo các khung giờ trong ngày
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold">
              Đỉnh điểm từ 10 giờ đến 15 giờ
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={meetingTrendData}
              primaryLabel="Số lượt đặt phòng"
              height={240}
            />
          </CardContent>
        </Card>

        {/* Asset Category Donut (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Cơ cấu tài sản thiết bị
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ danh mục tài sản và máy móc làm việc
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={assetCategoryData}
              centerLabel="Tổng tài sản"
              size={170}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
