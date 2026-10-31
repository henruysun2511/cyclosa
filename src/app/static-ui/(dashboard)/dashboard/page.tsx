"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Briefcase,
  Calendar,
  DollarSign,
  RotateCcw,
  CheckSquare,
  Activity,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Building2,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/shared";
import { useGetDashboardOverviewQuery } from "@/features/dashboard/api/dashboard-api";
import type {
  DashboardFilterParams,
  HeadcountTrendPoint,
} from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [role, setRole] = useState<"HR" | "MANAGER" | "EXECUTIVE" | "EMPLOYEE" | "ADMIN">("HR");

  const filterParams: DashboardFilterParams = {
    period,
    role,
  };

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardOverviewQuery(filterParams);

  return (
    <div className="space-y-6">
      {/* ── 1. Header Dashboard ────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tổng quan
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tổng quan hoạt động nhân sự và các thông tin cần chú ý.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role selector (hỗ trợ phân quyền hiển thị theo role) */}
          <div className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Vai trò:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-transparent text-foreground outline-none cursor-pointer font-medium"
              aria-label="Chọn vai trò xem Dashboard"
            >
              <option value="HR">HR Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EXECUTIVE">Executive / BOD</option>
              <option value="EMPLOYEE">Employee (ESS)</option>
              <option value="ADMIN">Quản trị viên (Admin)</option>
            </select>
          </div>

          {/* Bộ chọn khoảng thời gian */}
          <div className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-2 py-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Kỳ:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="bg-transparent text-foreground outline-none cursor-pointer font-medium"
              aria-label="Chọn khoảng thời gian"
            >
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>

          {/* Nút làm mới dữ liệu */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Error State ─────────────────────────────────────────── */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không thể tải dữ liệu Dashboard</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              {(error as any)?.data?.message || "Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng kiểm tra lại."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-7 text-xs ml-4"
            >
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── 3. Loading State Skeletons ──────────────────────────────── */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card
                key={i}
                className={cn(
                  "border-border bg-card shadow-xs",
                  i === 4 && "sm:col-span-2 lg:col-span-1"
                )}
              >
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="h-3.5 w-24 mb-1.5" />
                    <div className="flex items-end justify-between gap-2">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-7 w-14 rounded" />
                    </div>
                    <Skeleton className="h-3 w-28 mt-1.5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 lg:col-span-2 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      )}

      {/* ── 4. Normal State Content (Dữ liệu thực từ API) ───────────── */}
      {!isLoading && data && (
        <>
          {/* ── 4.1. Khu vực KPI Cards ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Tổng số nhân viên */}
            <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Users className="h-4.5 w-4.5" />
                  </div>
                  {data.kpis.totalEmployees.changeText && (
                    <div
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                        data.kpis.totalEmployees.isPositive
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800"
                          : "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800"
                      )}
                    >
                      {data.kpis.totalEmployees.isPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{data.kpis.totalEmployees.changeText}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    Tổng số nhân viên
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {data.kpis.totalEmployees.value.toLocaleString("vi-VN")}
                    </div>
                    {/* Micro Sparkline Curve */}
                    <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                        <defs>
                          <linearGradient id="kpi-spark-1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,35 Q25,32 50,18 T100,6 L100,45 L0,45 Z" fill="url(#kpi-spark-1)" />
                        <path d="M0,35 Q25,32 50,18 T100,6" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    {data.kpis.totalEmployees.periodComparison}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Nhân viên mới */}
            <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <UserPlus className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{data.kpis.newEmployees.value} NS</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    Nhân viên mới
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {data.kpis.newEmployees.value.toLocaleString("vi-VN")}
                    </div>
                    <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                        <defs>
                          <linearGradient id="kpi-spark-2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,38 Q30,36 65,22 T100,8 L100,45 L0,45 Z" fill="url(#kpi-spark-2)" />
                        <path d="M0,38 Q30,36 65,22 T100,8" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    {data.kpis.newEmployees.periodText}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 3. Đang tuyển dụng */}
            <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Briefcase className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800">
                    <span>{data.kpis.activeRecruitments.openPositionsCount} vị trí mở</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    Đang tuyển dụng
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {data.kpis.activeRecruitments.value}
                    </div>
                    <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                        <defs>
                          <linearGradient id="kpi-spark-3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,30 Q25,12 55,26 T100,10 L100,45 L0,45 Z" fill="url(#kpi-spark-3)" />
                        <path d="M0,30 Q25,12 55,26 T100,10" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    Đang nhận hồ sơ ứng tuyển
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Nghỉ phép */}
            <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800">
                    <span>Trong kỳ</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    Nghỉ phép
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {data.kpis.onLeave.value}{" "}
                      <span className="text-xs font-normal text-muted-foreground ml-0.5">
                        {data.kpis.onLeave.unit}
                      </span>
                    </div>
                    <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                        <defs>
                          <linearGradient id="kpi-spark-4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,24 Q30,38 65,20 T100,28 L100,45 L0,45 Z" fill="url(#kpi-spark-4)" />
                        <path d="M0,24 Q30,38 65,20 T100,28" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    {data.kpis.onLeave.periodText}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 5. Chi phí tiền lương */}
            <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <DollarSign className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-800">
                    <span>{period === "month" ? "Tháng này" : period === "quarter" ? "Quý này" : "Cả năm"}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                    Chi phí tiền lương
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div
                      className="text-2xl font-bold tracking-tight text-foreground truncate"
                      title={data.kpis.totalPayroll.formatted}
                    >
                      {data.kpis.totalPayroll.formatted}
                    </div>
                    <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                        <defs>
                          <linearGradient id="kpi-spark-5" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#9333EA" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M0,34 Q30,26 65,16 T100,8 L100,45 L0,45 Z" fill="url(#kpi-spark-5)" />
                        <path d="M0,34 Q30,26 65,16 T100,8" fill="none" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1.5 truncate">
                    {data.kpis.totalPayroll.periodText}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── 4.2. Khu vực Biểu đồ Thống kê Trực quan ───────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Biểu đồ 1: Biến động nhân sự theo thời gian */}
            <Card className="lg:col-span-2 border-border bg-card shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Biến động nhân sự
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Số lượng nhân sự qua các mốc thời gian ({data.periodLabel})
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Tổng nhân sự
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Gia nhập
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    Thôi việc
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {data.headcountTrend.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    Không có dữ liệu biến động nhân sự trong khoảng thời gian này.
                  </div>
                ) : (
                  <HeadcountTrendSvgChart data={data.headcountTrend} />
                )}
              </CardContent>
            </Card>

            {/* Biểu đồ 2: Phân bổ nhân sự theo phòng ban */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-semibold">
                  Phân bổ theo phòng ban
                </CardTitle>
                <CardDescription className="text-xs">
                  Cơ cấu nhân sự hiện tại theo đơn vị
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {data.departmentDistribution.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Chưa có dữ liệu phòng ban.
                  </div>
                ) : (
                  data.departmentDistribution.map((dept) => (
                    <div key={dept.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground truncate max-w-[180px]" title={dept.name}>
                          {dept.name}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-muted-foreground">
                          <span>{dept.employeeCount} NS</span>
                          <span className="w-10 text-right font-medium text-foreground">
                            {dept.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${Math.min(dept.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Biểu đồ 3: Tình hình tuyển dụng (Pipeline Funnel) */}
          {data.recruitmentFunnel.length > 0 && (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Tình hình tuyển dụng
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Số lượng ứng viên theo từng giai đoạn tiếp nhận
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary">
                    <Link href="/recruitment/candidates">
                      Quản lý tuyển dụng <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {data.recruitmentFunnel.map((stage, idx) => (
                    <div
                      key={stage.stage}
                      className="rounded-lg border border-border p-3.5 text-center bg-card"
                    >
                      <div className="text-xs text-muted-foreground font-medium">
                        Bước {idx + 1}
                      </div>
                      <div className="text-xl font-bold text-foreground mt-1">
                        {stage.count}
                      </div>
                      <div className="text-xs font-semibold text-foreground mt-0.5">
                        {stage.stageName}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── 4.3. Công việc cần xử lý & Hoạt động gần đây ─────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Khu vực CẦN XỬ LÝ */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Cần xử lý
                  </CardTitle>
                  <Badge variant="secondary" className="text-2xs font-bold px-2 py-0.5">
                    {data.pendingTasks.length} việc
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary">
                  <Link href="/workflows/pending">
                    Xem tất cả <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {data.pendingTasks.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    Hiện không có nghiệp vụ nào đang chờ bạn xử lý.
                  </div>
                ) : (
                  data.pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">
                            {task.title}
                          </span>
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Đối tượng: <strong className="text-foreground">{task.targetObject}</strong> • Gửi bởi: {task.submitterName} ({task.timeAgo})
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 text-xs shrink-0 self-start sm:self-auto"
                      >
                        <Link href={task.actionUrl}>
                          {task.actionLabel}
                        </Link>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Khu vực HOẠT ĐỘNG GẦN ĐÂY */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base font-semibold">
                    Hoạt động gần đây
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-8 text-xs text-primary">
                  <Link href="/audit-logs">
                    Nhật ký kiểm toán <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {data.recentActivities.length === 0 ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    Chưa có hoạt động nào được ghi nhận trong phạm vi quyền của bạn.
                  </div>
                ) : (
                  data.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors text-xs"
                    >
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="text-foreground">
                          <strong className="font-semibold text-foreground">{act.actorName}</strong>{" "}
                          <span className="text-muted-foreground">({act.actorRole || "Thành viên"}):</span>{" "}
                          <span>{act.action}</span>
                        </div>
                        <div className="text-muted-foreground truncate" title={act.targetObject}>
                          Mục tiêu: <span className="font-medium text-foreground">{act.targetObject}</span>
                        </div>
                        <div className="text-2xs text-muted-foreground font-mono">
                          {act.timeAgo}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ── SVG Chart component for Headcount Trend (No external libraries, standard tokens) ──
function HeadcountTrendSvgChart({ data }: { data: HeadcountTrendPoint[] }) {
  if (data.length === 0) return null;

  const width = 640;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const counts = data.map((d) => d.count);
  const minVal = Math.max(0, Math.min(...counts) - 10);
  const maxVal = Math.max(...counts) + 10;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.count - minVal) / range) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48 select-none"
        preserveAspectRatio="none"
      >
        {/* Horizontal grid guide lines */}
        {[0, 0.5, 1].map((pct, idx) => {
          const y = paddingY + pct * (height - paddingY * 2);
          const val = Math.round(maxVal - pct * range);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Headcount Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X-axis labels */}
        {points.map((pt, idx) => (
          <g key={idx}>
            {/* Circle dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              className="fill-card stroke-primary"
              strokeWidth="2"
            />
            {/* Value above dot */}
            <text
              x={pt.x}
              y={pt.y - 8}
              textAnchor="middle"
              className="fill-foreground font-semibold text-[10px]"
            >
              {pt.count}
            </text>
            {/* Period below */}
            <text
              x={pt.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px] font-medium"
            >
              {pt.period}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
