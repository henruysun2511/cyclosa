"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Clock,
  Banknote,
  Building2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/dashboard/components/shared/dashboard-header";
import { DashboardNavTabs } from "@/features/dashboard/components/shared/dashboard-nav-tabs";
import {
  DashboardKpiCards,
  DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { AreaTrendChart } from "@/features/dashboard/components/charts/area-trend-chart";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";
import { StackedBarChart } from "@/features/dashboard/components/charts/stacked-bar-chart";
import { HorizontalRankChart } from "@/features/dashboard/components/charts/horizontal-rank-chart";
import { useGetExecutiveDashboardQuery } from "@/features/dashboard/api/dashboard-api";
import Link from "next/link";

export default function ExecutiveOverviewPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetExecutiveDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "total_employees",
      title: "Tổng nhân sự chính thức",
      value: (dashboard?.totalEmployees ?? 0).toLocaleString("vi-VN"),
      unit: "người",
      icon: Users,
      iconBgColor: "bg-blue-600 text-white",
      change: dashboard?.employeeGrowthPercentage ?? 3.8,
      changeLabel: "so với kỳ trước",
      sparkline: [120, 125, 128, 134, 142, dashboard?.totalEmployees ?? 150],
    },
    {
      id: "turnover_rate",
      title: "Tỷ lệ biến động nhân sự",
      value: (dashboard?.turnoverRate ?? 0).toFixed(1),
      unit: "%",
      icon: UserCheck,
      iconBgColor: "bg-emerald-600 text-white",
      change: dashboard?.turnoverComparison ?? -0.5,
      changeLabel: "trong ngưỡng an toàn",
      sparkline: [4.2, 4.0, 3.8, 3.5, 3.2, dashboard?.turnoverRate ?? 3.1],
    },
    {
      id: "attendance_rate",
      title: "Tỷ lệ chuyên cần chung",
      value: (dashboard?.overallAttendanceRate ?? 0).toFixed(1),
      unit: "%",
      icon: Clock,
      iconBgColor: "bg-indigo-600 text-white",
      change: dashboard?.attendanceComparison ?? 1.2,
      changeLabel: "tỷ lệ tuân thủ giờ làm",
      sparkline: [92, 93.5, 91.8, 94.2, 95.1, dashboard?.overallAttendanceRate ?? 95.8],
    },
    {
      id: "monthly_payroll",
      title: "Dự toán quỹ lương tháng",
      value: dashboard?.formattedPayroll || ((dashboard?.estimatedMonthlyPayroll ?? 0) / 1_000_000).toLocaleString("vi-VN") + " tr",
      unit: "VNĐ",
      icon: Banknote,
      iconBgColor: "bg-amber-600 text-white",
      change: 2.5,
      changeLabel: "theo kế hoạch ngân sách",
      sparkline: [850, 880, 910, 920, 950, (dashboard?.estimatedMonthlyPayroll ?? 960_000_000) / 1_000_000],
    },
  ];

  const growthTrendData = (dashboard?.headcountTrend || []).map((t) => ({
    label: t.period,
    value: t.count,
    secondaryValue: t.joined,
  }));

  const deptDistSeries = [
    { name: "Tổng nhân sự", colorClass: "bg-blue-600", fillHex: "#2563eb" },
  ];

  const deptDistData = (dashboard?.departmentDistribution || []).map((d) => ({
    label: d.departmentName.replace(/[()]/g, ""),
    values: [d.employeeCount],
  }));

  const genderData = [
    {
      label: "Nam",
      value: dashboard?.genderDistribution?.maleCount ?? 0,
      color: "#2563eb",
    },
    {
      label: "Nữ",
      value: dashboard?.genderDistribution?.femaleCount ?? 0,
      color: "#db2777",
    },
    {
      label: "Khác",
      value: dashboard?.genderDistribution?.otherCount ?? 0,
      color: "#64748b",
    },
  ];

  const topDepts = (dashboard?.departmentDistribution || []).map((d) => ({
    label: d.departmentName.replace(/[()]/g, ""),
    value: d.employeeCount,
    subText: `${(d.percentage || 0).toFixed(1)}% cơ cấu`,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Tổng quan điều hành"
        subtitle="Bức tranh toàn cảnh hoạt động, nhân sự và hiệu quả vận hành doanh nghiệp"
        icon={LayoutDashboard}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trend (2 columns) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Xu hướng quy mô nhân sự
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Tổng số lượng nhân sự và số lượng gia nhập mới qua các kỳ
              </CardDescription>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-700" />
              Tăng trưởng ổn định
            </Badge>
          </CardHeader>
          <CardContent>
            <AreaTrendChart
              data={growthTrendData}
              primaryLabel="Tổng nhân sự"
              secondaryLabel="Tuyển mới"
              height={260}
            />
          </CardContent>
        </Card>

        {/* Gender Breakdown Donut (1 column) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Cơ cấu giới tính
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ phân bổ nhân sự theo giới tính toàn doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={genderData}
              centerLabel="Tổng nhân sự"
              centerValue={dashboard?.totalEmployees ?? 0}
              size={175}
            />
          </CardContent>
          <div className="px-6 pb-4 pt-2 border-t border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
            <span>Cân bằng giới tính:</span>
            <span className="font-bold text-foreground">
              {dashboard?.genderDistribution?.femaleCount && dashboard?.genderDistribution?.maleCount
                ? `${(
                    (dashboard.genderDistribution.femaleCount /
                      (dashboard.genderDistribution.femaleCount + dashboard.genderDistribution.maleCount)) *
                    100
                  ).toFixed(0)}% Nữ / ${(
                    (dashboard.genderDistribution.maleCount /
                      (dashboard.genderDistribution.femaleCount + dashboard.genderDistribution.maleCount)) *
                    100
                  ).toFixed(0)}% Nam`
                : "Đang cập nhật"}
            </span>
          </div>
        </Card>
      </div>

      {/* Row 2: Department breakdown & Quick Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Stacked Bar Chart */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Phân bổ nhân sự theo phòng ban
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Số lượng nhân sự đang làm việc tại các khối nghiệp vụ
              </CardDescription>
            </div>
            <Link href="/dashboard/personnel">
              <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold h-7 px-2">
                Chi tiết nhân sự
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              series={deptDistSeries}
              data={deptDistData}
              height={250}
              stacked={false}
            />
          </CardContent>
        </Card>

        {/* Top Departments Ranked List */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Phòng ban quy mô lớn nhất
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Top các phòng ban có tỷ trọng nhân sự cao nhất
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <HorizontalRankChart items={topDepts} maxItems={5} unit="người" />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Quick Navigation Cards to Subsystem Dashboards - Solid Saturated Icon Badges */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Truy cập nhanh bảng điều khiển chuyên sâu
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Link href="/dashboard/personnel" className="group">
            <Card className="p-4 transition-all bg-card border-border shadow-xs group-hover:border-primary group-hover:shadow-md rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Nhân sự & Hợp đồng
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                    Hợp đồng lao động, thâm niên và biến động
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/attendance" className="group">
            <Card className="p-4 transition-all bg-card border-border shadow-xs group-hover:border-primary group-hover:shadow-md rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Chấm công & Ca kíp
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                    Vi phạm đi muộn, giờ làm thêm và nghỉ phép
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/recruitment" className="group">
            <Card className="p-4 transition-all bg-card border-border shadow-xs group-hover:border-primary group-hover:shadow-md rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Tuyển dụng & Hội nhập
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                    Phễu chuyển đổi ứng viên và tiến độ hội nhập
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/performance" className="group">
            <Card className="p-4 transition-all bg-card border-border shadow-xs group-hover:border-primary group-hover:shadow-md rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Hiệu suất & Đánh giá
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                    Chuông phân phối Gauss và bảng vàng xếp hạng
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/workplace" className="group">
            <Card className="p-4 transition-all bg-card border-border shadow-xs group-hover:border-primary group-hover:shadow-md rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Không gian & Tài sản
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium line-clamp-1">
                    Lấp đầy chỗ ngồi văn phòng và thiết bị
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
