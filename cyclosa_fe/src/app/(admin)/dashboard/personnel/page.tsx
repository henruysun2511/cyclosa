"use client";

import React, { useState } from "react";
import {
  Users,
  FileCheck,
  ClockAlert,
  Award,
  Building,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/features/dashboard/components/shared/dashboard-header";
import { DashboardNavTabs } from "@/features/dashboard/components/shared/dashboard-nav-tabs";
import {
  DashboardKpiCards,
  DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";
import { StackedBarChart } from "@/features/dashboard/components/charts/stacked-bar-chart";
import { HorizontalRankChart } from "@/features/dashboard/components/charts/horizontal-rank-chart";
import { useGetPersonnelDashboardQuery } from "@/features/dashboard/api/dashboard-api";
import Link from "next/link";

export default function PersonnelDashboardPage() {
  const [period, setPeriod] = useState<"MONTH" | "QUARTER" | "YEAR">("MONTH");
  const { data: dashboard, isLoading, refetch, isFetching } = useGetPersonnelDashboardQuery({
    period,
  });

  const kpiItems: DashboardKpiItem[] = [
    {
      id: "active_employees",
      title: "Nhân viên chính thức đang hoạt động",
      value: (dashboard?.activeEmployees ?? 0).toLocaleString("vi-VN"),
      unit: "người",
      icon: FileCheck,
      iconBgColor: "bg-blue-600 text-white",
      change: 2.4,
      changeLabel: "so với tháng trước",
      sparkline: [110, 115, 122, 130, 138, dashboard?.activeEmployees ?? 145],
    },
    {
      id: "probation_employees",
      title: "Nhân sự đang thử việc",
      value: (dashboard?.probationEmployees ?? 0).toLocaleString("vi-VN"),
      unit: "nhân sự",
      icon: Users,
      iconBgColor: "bg-amber-600 text-white",
      change: 8.5,
      changeLabel: "đợt tuyển dụng mới",
      sparkline: [8, 12, 10, 15, 14, dashboard?.probationEmployees ?? 16],
    },
    {
      id: "expiring_contracts",
      title: "Hợp đồng sắp hết hạn",
      value: (dashboard?.expiringContractsCount ?? 0).toLocaleString("vi-VN"),
      unit: "cần tái ký",
      icon: ClockAlert,
      iconBgColor: (dashboard?.expiringContractsCount ?? 0) > 0 ? "bg-rose-600 text-white" : "bg-slate-600 text-white",
      change: -15.0,
      changeLabel: "đã xử lý tái ký sớm",
      sparkline: [12, 10, 8, 9, 7, dashboard?.expiringContractsCount ?? 5],
    },
    {
      id: "avg_tenure",
      title: "Thâm niên công tác bình quân",
      value: (dashboard?.averageTenureYears ?? 0).toFixed(1),
      unit: "năm",
      icon: Award,
      iconBgColor: "bg-emerald-600 text-white",
      change: 0.3,
      changeLabel: "gắn kết nhân tài",
      sparkline: [2.1, 2.3, 2.4, 2.6, 2.7, dashboard?.averageTenureYears ?? 2.8],
    },
  ];

  const contractTypePalette: Record<string, string> = {
    INDEFINITE: "#2563eb",
    DEFINITE_TERM: "#059669",
    PROBATION: "#d97706",
    SEASONAL: "#7c3aed",
    PART_TIME: "#db2777",
  };

  const cleanContractLabel = (label: string, type: string) => {
    if (label) return label.replace(/\s*\([^)]*\)/g, "");
    if (type === "DEFINITE_TERM") return "Có thời hạn 12 đến 36 tháng";
    if (type === "INDEFINITE") return "Không xác định thời hạn";
    if (type === "PROBATION") return "Thử việc và đào tạo";
    if (type === "SEASONAL") return "Thời vụ theo mùa";
    return type;
  };

  const contractTypeData = (dashboard?.contractTypeDistribution || []).map((ct) => ({
    label: cleanContractLabel(ct.label, ct.contractType),
    value: ct.count,
    color: contractTypePalette[ct.contractType] || "#475569",
  }));

  const branchSeries = [
    { name: "Tổng nhân sự", colorClass: "bg-blue-600", fillHex: "#2563eb" },
  ];

  const branchData = (dashboard?.branchDistribution || []).map((b) => ({
    label: b.branchName.replace(/[()]/g, ""),
    values: [b.employeeCount],
  }));

  const tenureRankItems = (dashboard?.tenureDistribution || []).map((t) => ({
    label: t.label.replace(/\s*\([^)]*\)/g, ""),
    value: t.count,
    subText: `${(t.percentage || 0).toFixed(1)}% tỷ trọng`,
  }));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Nhân sự & Hợp đồng"
        subtitle="Thống kê hợp đồng lao động, phân bổ chi nhánh và thâm niên công tác"
        icon={Users}
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refetch}
        isRefreshing={isLoading || isFetching}
      />

      <DashboardNavTabs />

      {/* KPI Cards Row */}
      <DashboardKpiCards items={kpiItems} isLoading={isLoading} />

      {/* Row 1: Branch Distribution & Contract Type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Stacked Bar */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Phân bổ nhân sự theo chi nhánh
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Quy mô nhân sự làm việc tại các văn phòng và chi nhánh trực thuộc
              </CardDescription>
            </div>
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-xs font-bold gap-1">
              <Building className="h-3.5 w-3.5 text-blue-600" />
              {dashboard?.branchDistribution?.length || 0} Chi nhánh
            </Badge>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              series={branchSeries}
              data={branchData}
              height={250}
              stacked={false}
            />
          </CardContent>
        </Card>

        {/* Contract Type Donut */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Cơ cấu loại hợp đồng
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ hợp đồng theo hình thức pháp lý
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={contractTypeData}
              centerLabel="Tổng hợp đồng"
              centerValue={dashboard?.activeEmployees ?? 0}
              size={170}
            />
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Tenure breakdown & Expiring Contracts Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenure Distribution */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-foreground">
              Thâm niên công tác
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Số lượng nhân sự phân nhóm theo số năm cống hiến
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <HorizontalRankChart
              items={tenureRankItems}
              maxItems={6}
              unit="người"
              barColor="bg-emerald-600"
            />
          </CardContent>
        </Card>

        {/* Expiring Contracts Table (2 columns) */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                Hợp đồng sắp hết hạn trong 30 ngày
                {(dashboard?.expiringContracts?.length ?? 0) > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-bold">
                    {dashboard?.expiringContracts?.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Danh sách nhân sự cần tái ký hoặc thỏa thuận gia hạn hợp đồng mới
              </CardDescription>
            </div>
            <Link href="/contracts">
              <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold h-7 px-2">
                Xem tất cả hợp đồng
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="flex-1">
            {isLoading ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !dashboard?.expiringContracts ||
              dashboard.expiringContracts.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
                <FolderOpen className="h-8 w-8 text-muted-foreground/60" />
                <span className="text-xs font-medium">
                  Không có hợp đồng nào sắp hết hạn trong 30 ngày tới.
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-semibold">
                      <th className="pb-2.5">Nhân viên</th>
                      <th className="pb-2.5">Số HĐ</th>
                      <th className="pb-2.5">Loại HĐ</th>
                      <th className="pb-2.5">Ngày hết hạn</th>
                      <th className="pb-2.5 text-right">Còn lại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dashboard.expiringContracts.slice(0, 5).map((c, i) => (
                      <tr key={i} className="hover:bg-muted/60 transition-colors">
                        <td className="py-2.5 font-semibold text-foreground">
                          {c.employeeName}
                        </td>
                        <td className="py-2.5 text-muted-foreground font-mono text-[11px] font-medium">
                          {c.contractNumber}
                        </td>
                        <td className="py-2.5 text-foreground font-medium">
                          {c.contractType}
                        </td>
                        <td className="py-2.5 text-foreground font-medium">
                          {c.expiryDate || "N/A"}
                        </td>
                        <td className="py-2.5 text-right">
                          <Badge
                            variant={c.daysRemaining <= 10 ? "destructive" : "secondary"}
                            className="text-[10px] px-2 py-0.5 font-bold"
                          >
                            {c.daysRemaining} ngày
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
