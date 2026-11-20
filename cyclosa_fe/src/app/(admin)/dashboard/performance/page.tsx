"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  Star,
  AlertTriangle,
  TrendingUp,
  Grid3X3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/features/dashboard/components/shared/dashboard-header";
import { DashboardNavTabs } from "@/features/dashboard/components/shared/dashboard-nav-tabs";
import {
  DashboardKpiCards,
  DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { BellCurveChart } from "@/features/dashboard/components/charts/bell-curve-chart";
import { HorizontalRankChart } from "@/features/dashboard/components/charts/horizontal-rank-chart";
import { RadialGaugeChart } from "@/features/dashboard/components/charts/radial-gauge-chart";
import { useGetPerformanceDashboardQuery } from "@/features/dashboard/api/dashboard-api";

export default function PerformanceDashboardPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("QUARTER");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetPerformanceDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "cycle_completion_rate",
      title: "Tiến độ hoàn thành đánh giá",
      value: (dashboard?.cycleCompletionRate ?? 0).toFixed(1),
      unit: "%",
      icon: CheckCircle2,
      iconBgColor: "bg-blue-600 text-white",
      change: 4.2,
      changeLabel: "hoàn tất đợt đánh giá",
      sparkline: [65, 78, 85, 92, 95, dashboard?.cycleCompletionRate ?? 98],
    },
    {
      id: "average_score",
      title: "Điểm hiệu suất trung bình",
      value: (dashboard?.averageScore ?? 0).toFixed(2),
      unit: "/5.0",
      icon: Star,
      iconBgColor: "bg-emerald-600 text-white",
      change: 0.15,
      changeLabel: "chất lượng công việc nâng cao",
      sparkline: [3.8, 3.9, 4.05, 4.1, 4.18, dashboard?.averageScore ?? 4.25],
    },
    {
      id: "okr_achievement_rate",
      title: "Tỷ lệ hoàn thành mục tiêu",
      value: (dashboard?.okrAchievementRate ?? 0).toFixed(1),
      unit: "%",
      icon: Award,
      iconBgColor: "bg-purple-600 text-white",
      change: 3.5,
      changeLabel: "vượt kỳ vọng đề ra",
      sparkline: [78, 80, 82, 84, 86, dashboard?.okrAchievementRate ?? 87.5],
    },
    {
      id: "pip_count",
      title: "Nhân sự cần hỗ trợ kèm cặp",
      value: (dashboard?.pipCount ?? 0).toLocaleString("vi-VN"),
      unit: "nhân sự",
      icon: AlertTriangle,
      iconBgColor: (dashboard?.pipCount ?? 0) > 0 ? "bg-rose-600 text-white" : "bg-slate-600 text-white",
      change: -20.0,
      changeLabel: "được hỗ trợ kèm cặp",
      sparkline: [8, 6, 5, 4, 3, dashboard?.pipCount ?? 2],
    },
  ];

  const bellGrades = (dashboard?.bellCurveDistribution || []).map((g) => ({
    tier: `${g.grade} - ${g.label.replace(/\s*\([^)]*\)/g, "")}`,
    actualCount: g.actualCount,
    actualPercent: g.actualPercentage,
    targetPercent: g.targetPercentage,
  }));

  const deptRanks = (dashboard?.departmentRanking || []).map((d) => ({
    label: d.departmentName,
    value: d.averageScore,
    subText: `Hoàn tất ${(d.completionRate || 0).toFixed(0)}%`,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Hiệu suất & Đánh giá"
        subtitle="Đánh giá xếp loại nhân sự, phân bổ chuông Gauss và tỷ lệ hoàn thành mục tiêu"
        icon={Award}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Row 1: Bell Curve Gauss Distribution & OKR Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bell Curve Gauss (2 cols) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Phân bổ xếp loại theo Chuông chuẩn Gauss
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                So sánh tỷ trọng thực tế của doanh nghiệp với đường cong phân phối chuẩn lý tưởng
              </CardDescription>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-700" />
              Phân bổ cân đối
            </Badge>
          </CardHeader>
          <CardContent>
            <BellCurveChart grades={bellGrades} height={250} />
          </CardContent>
        </Card>

        {/* OKR Gauge (1 col) */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Mức độ đạt mục tiêu công việc
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tiến độ hoàn thành các kết quả then chốt toàn doanh nghiệp
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <RadialGaugeChart
              value={dashboard?.okrAchievementRate ?? 86.4}
              maxValue={100}
              label="Tỷ lệ hoàn thành mục tiêu"
              subText="Kỳ vọng quý: Trên 80%"
              colorScheme="emerald"
            />
          </CardContent>
          <div className="p-4 border-t border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
            <span>Tiến độ thực hiện:</span>
            <span className="font-bold text-foreground">Đúng kế hoạch đề ra</span>
          </div>
        </Card>
      </div>

      {/* Row 2: Department Performance Rankings & 9-Box Matrix Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dept Rankings */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              Bảng vàng hiệu suất theo khối phòng ban
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Xếp hạng theo điểm đánh giá trung bình từ cao đến thấp
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <HorizontalRankChart
              items={deptRanks}
              maxItems={5}
              unit="điểm"
              barColor="bg-emerald-600"
              valueFormatter={(v) => v.toFixed(2)}
            />
          </CardContent>
        </Card>

        {/* 9-Box Grid Card Summary - Solid High-contrast Cards */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-primary" />
              Mô hình ma trận nhân tài chín ô
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Phân loại lực lượng nhân tài theo tiềm năng và hiệu suất
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              {(dashboard?.nineBoxGridSummary || []).slice(0, 6).map((b, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800/60 shadow-2xs space-y-1 hover:border-primary/50 transition-all"
                >
                  <div className="text-[10px] text-muted-foreground uppercase font-bold truncate">
                    {b.label.replace(/\s*\([^)]*\)/g, "")}
                  </div>
                  <div className="text-xl font-bold text-foreground">{b.count}</div>
                  <div className="text-[10px] text-primary font-bold">
                    {(b.percentage || 0).toFixed(1)}% tỷ trọng
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
