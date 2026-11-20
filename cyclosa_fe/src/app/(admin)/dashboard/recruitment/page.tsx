"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Briefcase,
  Users,
  Hourglass,
  UserCheck,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/features/dashboard/components/shared/dashboard-header";
import { DashboardNavTabs } from "@/features/dashboard/components/shared/dashboard-nav-tabs";
import {
  DashboardKpiCards,
  DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { FunnelChart } from "@/features/dashboard/components/charts/funnel-chart";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";
import { HorizontalRankChart } from "@/features/dashboard/components/charts/horizontal-rank-chart";
import { RadialGaugeChart } from "@/features/dashboard/components/charts/radial-gauge-chart";
import { useGetRecruitmentDashboardQuery } from "@/features/dashboard/api/dashboard-api";

export default function RecruitmentDashboardPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetRecruitmentDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "open_positions",
      title: "Vị trí đang mở tuyển",
      value: (dashboard?.activeJobOpenings ?? 0).toLocaleString("vi-VN"),
      unit: "vị trí",
      icon: Briefcase,
      iconBgColor: "bg-blue-600 text-white",
      change: 8.0,
      changeLabel: "nhu cầu mở rộng quy mô",
      sparkline: [6, 8, 10, 9, 12, dashboard?.activeJobOpenings ?? 14],
    },
    {
      id: "time_to_fill",
      title: "Thời gian tuyển trung bình",
      value: (dashboard?.averageTimeToFillDays ?? 0).toFixed(0),
      unit: "ngày",
      icon: Hourglass,
      iconBgColor: "bg-amber-600 text-white",
      change: -12.5,
      changeLabel: "rút ngắn tốc độ tuyển",
      sparkline: [28, 25, 24, 22, 20, dashboard?.averageTimeToFillDays ?? 18],
    },
    {
      id: "cost_per_hire",
      title: "Chi phí tuyển bình quân",
      value: ((dashboard?.averageCostPerHire ?? 0) / 1_000_000).toLocaleString("vi-VN", {
        maximumFractionDigits: 1,
      }),
      unit: "tr VNĐ",
      icon: Users,
      iconBgColor: "bg-indigo-600 text-white",
      change: -5.0,
      changeLabel: "tối ưu ngân sách tuyển",
      sparkline: [4.5, 4.2, 3.8, 3.6, 3.5, ((dashboard?.averageCostPerHire ?? 0) / 1_000_000) || 3.2],
    },
    {
      id: "onboarding_progress",
      title: "Nhân sự đang thử việc",
      value: (dashboard?.onboardingInProgress ?? 0).toLocaleString("vi-VN"),
      unit: "nhân sự",
      icon: UserCheck,
      iconBgColor: "bg-emerald-600 text-white",
      change: 2.1,
      changeLabel: "tiến độ hội nhập tốt",
      sparkline: [5, 8, 10, 11, 12, dashboard?.onboardingInProgress ?? 14],
    },
  ];

  const funnelStages = (dashboard?.funnelStages || []).map((p) => ({
    label: p.stageName.replace(/\s*\([^)]*\)/g, ""),
    count: p.count,
    conversionRate: p.conversionRate,
  }));

  const sourcePalette = [
    "#2563eb",
    "#059669",
    "#d97706",
    "#7c3aed",
    "#db2777",
    "#0891b2",
  ];

  const sourceData = (dashboard?.candidateSources || []).map((s, idx) => ({
    label: s.sourceName.replace(/\s*\([^)]*\)/g, ""),
    value: s.count,
    color: sourcePalette[idx % sourcePalette.length],
  }));

  const topOpenings = (dashboard?.urgentJobOpenings || []).map((o) => ({
    label: o.jobTitle.replace(/\s*\([^)]*\)/g, ""),
    value: o.applicantsCount,
    subText: `${o.departmentName} • Mở ${o.daysOpen} ngày`,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Tuyển dụng & Hội nhập"
        subtitle="Phễu chuyển đổi ứng viên, hiệu quả nguồn tuyển và tiến độ hội nhập"
        icon={UserPlus}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Row 1: Conversion Funnel & Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Phễu chuyển đổi ứng viên qua các vòng
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Tỷ lệ sàng lọc và chuyển đổi qua từng giai đoạn tuyển dụng
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold gap-1">
              <Filter className="h-3.5 w-3.5 text-blue-600" />
              Quy trình chuẩn
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <FunnelChart stages={funnelStages} />
          </CardContent>
        </Card>

        {/* Source Breakdown Donut (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Kênh nguồn ứng viên
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ tiếp cận ứng viên theo nguồn thu hút
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={sourceData}
              centerLabel="Nguồn tuyển"
              size={170}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Top Urgent Openings & Probation Onboarding Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Openings (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              Vị trí tuyển dụng trọng điểm và khẩn cấp
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Số lượng ứng viên đã nộp hồ sơ theo từng vị trí đang mở
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <HorizontalRankChart
              items={topOpenings}
              maxItems={6}
              unit="ứng viên"
              barColor="bg-blue-600"
            />
          </CardContent>
        </Card>

        {/* Onboarding Health (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Chất lượng hội nhập
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ hoàn thành đúng hạn các nhiệm vụ onboarding thử việc
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <RadialGaugeChart
              value={92.5}
              maxValue={100}
              label="Tiến độ hội nhập"
              subText="Mục tiêu tối thiểu: 85%"
              colorScheme="emerald"
            />
          </CardContent>
          <div className="p-4 border-t border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
            <span>Tiêu chuẩn hội nhập:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Đạt tiêu chuẩn
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
