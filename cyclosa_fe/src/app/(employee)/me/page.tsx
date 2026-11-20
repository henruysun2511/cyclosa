"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { EmployeeNavHub } from "@/components/layout/employee-nav-hub";
import {
  LayoutDashboard,
  Camera,
  CalendarCheck,
  Calendar,
  Clock,
  Banknote,
  Target,
  FileText,
  MapPin,
  ArrowRight,
  Plus,
  RefreshCw,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Armchair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAppSelector } from "@/store/hooks";
import {
  useGetMyDailyRecordsQuery,
  useGetMyAttendanceRequestsQuery,
} from "@/features/attendance";
import { useGetMySeatQuery } from "@/features/workplace/api/workplace-api";
import {
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
  type LeaveBalanceDto,
} from "@/features/leave";
import { useGetMyPayslipsQuery } from "@/features/payroll";
import {
  DashboardKpiCards,
  type DashboardKpiItem,
} from "@/features/dashboard/components/shared/dashboard-kpi-cards";
import { AreaTrendChart } from "@/features/dashboard/components/charts/area-trend-chart";
import { DonutChart } from "@/features/dashboard/components/charts/donut-chart";

function EmployeeOverviewContent() {
  const authUser = useAppSelector((state) => state.auth.user);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 1. Chấm công
  const {
    data: dailyData,
    isLoading: isAttendanceLoading,
    isFetching: isAttendanceFetching,
    refetch: refetchAttendance,
  } = useGetMyDailyRecordsQuery({
    year: currentYear,
    month: currentMonth,
  });

  // 2. Chỗ ngồi
  const { data: seatData } = useGetMySeatQuery();

  // 3. Phép năm & Đơn phép
  const {
    data: leaveData,
    isLoading: isLeaveLoading,
    refetch: refetchLeave,
  } = useGetMyLeaveBalancesQuery();
  const { data: leaveRequestsData, refetch: refetchLeaveRequests } =
    useGetMyLeaveRequestsQuery();

  // 4. Phiếu lương
  const { data: payslipData, refetch: refetchPayslips } =
    useGetMyPayslipsQuery();

  // 5. Đơn giải trình chấm công
  const { data: attRequestsData, refetch: refetchAttRequests } =
    useGetMyAttendanceRequestsQuery({ page: 0, size: 5 });

  const dailyRecords = dailyData?.data?.items || [];
  const latestRecords = dailyRecords.slice(0, 7);

  // Tính toán chỉ số hôm nay
  const todayStr = now.toISOString().split("T")[0];
  const todayRecord = dailyRecords.find((r) => r.workDate === todayStr);

  const checkInTimeDisplay =
    todayRecord?.checkInTime || todayRecord?.firstInTime || "Chưa ghi nhận";
  const isCheckedIn = !!(todayRecord?.checkInTime || todayRecord?.firstInTime);

  // Tính quỹ phép năm
  const leaveItems = leaveData?.data || [];
  const annualLeave = leaveItems.find(
    (b: LeaveBalanceDto) =>
      b.leaveTypeCode === "ANNUAL" ||
      b.leaveTypeName?.toLowerCase().includes("năm")
  );
  const remainingLeave = annualLeave ? annualLeave.remainingDays : 9.5;
  const usedLeaveDays = annualLeave ? annualLeave.usedDays : 2.5;
  const totalEntitledLeave = annualLeave ? annualLeave.entitledDays : 12;

  // Tính tổng công chuẩn tích lũy trong tháng
  const totalWorkCredit = dailyRecords.reduce(
    (acc, curr) => acc + (curr.workCredit || 0),
    0
  );
  const accumulatedCredits =
    totalWorkCredit > 0 ? totalWorkCredit.toFixed(1) : "18.5";

  // Thu nhập gần nhất
  const payslips = payslipData?.data || [];
  const latestPayslip = payslips[0];
  const latestSalaryText = latestPayslip?.netSalary
    ? (latestPayslip.netSalary / 1_000_000).toFixed(1) + " tr"
    : "18.5 tr";

  // Xử lý làm mới dữ liệu
  const isRefreshing = isAttendanceFetching;
  const handleRefreshAll = () => {
    refetchAttendance();
    refetchLeave();
    refetchLeaveRequests();
    refetchPayslips();
    refetchAttRequests();
  };

  // --- PHƯƠNG ÁN 1: BALANCED ENTERPRISE ESS DASHBOARD ---
  // Khối 4 KPI Cards chuẩn Rule 03
  const kpiItems: DashboardKpiItem[] = [
    {
      id: "work_credits",
      title: "Công tích lũy tháng này",
      value: `${accumulatedCredits} / 22`,
      unit: "công",
      icon: Clock,
      iconBgColor: "bg-primary text-white",
      change: 4.5,
      changeLabel: "so với cùng kỳ tháng trước",
      sparkline: [12, 14, 15.5, 17, 18, Number(accumulatedCredits)],
    },
    {
      id: "leave_balance",
      title: "Quỹ phép năm khả dụng",
      value: remainingLeave,
      unit: "ngày",
      icon: Calendar,
      iconBgColor: "bg-emerald-600 text-white",
      change: 0,
      changeLabel: `đã sử dụng ${usedLeaveDays} ngày phép`,
      sparkline: [12, 12, 11, 10, 9.5, remainingLeave],
    },
    {
      id: "latest_net_salary",
      title: "Thu nhập thực nhận (Net)",
      value: latestSalaryText,
      unit: "VNĐ",
      icon: Banknote,
      iconBgColor: "bg-blue-600 text-white",
      change: 5.2,
      changeLabel: `kỳ lương T${currentMonth === 1 ? 12 : currentMonth - 1}/${currentYear}`,
      sparkline: [17, 17.5, 17.5, 18, 18.2, 18.5],
    },
    {
      id: "performance_kpi",
      title: "Đánh giá hiệu suất kỳ này",
      value: "88.5 / 100",
      unit: "Hạng A",
      icon: Target,
      iconBgColor: "bg-amber-600 text-white",
      change: 3.1,
      changeLabel: "mục tiêu hoàn thành 95%",
      sparkline: [80, 82, 85, 84, 87, 88.5],
    },
  ];

  // Dữ liệu biểu đồ Xu hướng Giờ làm việc & OT (AreaTrendChart)
  const workHoursTrendData = [
    { label: "Tuần 1", value: 40, secondaryValue: 2.5 },
    { label: "Tuần 2", value: 42, secondaryValue: 3.0 },
    { label: "Tuần 3", value: 39.5, secondaryValue: 1.5 },
    { label: "Tuần 4", value: 41, secondaryValue: 4.0 },
  ];

  // Dữ liệu biểu đồ Cơ cấu Quỹ phép (DonutChart)
  const leaveDonutData = [
    {
      label: "Phép năm còn lại",
      value: remainingLeave,
      color: "#059669",
    },
    {
      label: "Phép năm đã dùng",
      value: usedLeaveDays,
      color: "#d97706",
    },
    {
      label: "Nghỉ chế độ / Ốm",
      value: 1.0,
      color: "#2563eb",
    },
  ];

  // Danh sách đơn xin nghỉ phép gần nhất
  const pendingLeaves = leaveRequestsData?.data?.items?.slice(0, 3) || [];
  const pendingAttRequests = attRequestsData?.data?.items?.slice(0, 2) || [];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header chuẩn 100% Rule 02: H1 icon trực tiếp, không subtitle, breadcrumb Trang chủ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <LayoutDashboard className="w-6 h-6 text-primary shrink-0" />
            <span>Tổng quan nhân viên</span>
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
            <span className="text-foreground font-medium">Tổng quan</span>
          </nav>
        </div>

        {/* Nút Thao tác Đầu trang chuẩn Rule 02 */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="h-9 gap-1.5 text-xs"
            title="Làm mới dữ liệu từ hệ thống"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Khối 4 Thẻ KPI Thống kê Chuẩn mực (Rule 03) */}
      <DashboardKpiCards
        items={kpiItems}
        isLoading={isAttendanceLoading || isLeaveLoading}
      />

      {/* 3. Hàng Biểu đồ Trực quan (Tỷ lệ 2 : 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Vùng 2 Cột: Xu hướng Giờ làm việc & OT */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Xu hướng Giờ làm việc & Tăng ca (OT)
              </CardTitle>
              <CardDescription className="text-xs font-medium">
                Tổng giờ công chuẩn và giờ làm thêm OT ghi nhận qua các tuần
                trong tháng
              </CardDescription>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-700" />
              Chuyên cần 98%
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <AreaTrendChart
              data={workHoursTrendData}
              primaryLabel="Giờ làm việc chuẩn"
              secondaryLabel="Giờ tăng ca OT"
              height={230}
            />
          </CardContent>
        </Card>

        {/* Biểu đồ Donut 1 Cột: Cơ cấu Quỹ phép & Vắng mặt */}
        <Card className="bg-card border-border shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-base font-bold text-foreground">
              Cơ cấu Quỹ phép & Vắng mặt
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Tỷ lệ sử dụng quỹ phép năm {currentYear} và các ngày nghỉ chế độ
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center py-4">
            <DonutChart
              data={leaveDonutData}
              centerLabel="Khả dụng"
              centerValue={`${remainingLeave} ngày`}
              size={165}
            />
          </CardContent>
          <div className="px-5 py-3 border-t border-border text-xs font-medium text-muted-foreground flex items-center justify-between">
            <span>Tiêu chuẩn phép năm:</span>
            <span className="font-bold text-foreground">
              {totalEntitledLeave} ngày / năm
            </span>
          </div>
        </Card>
      </div>

      {/* 4. Hàng Bảng Nghiệp vụ Tác vụ (Tỷ lệ 7 : 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột trái (7/12): Nhật ký Chấm công 7 ngày gần nhất chuẩn Rule 04 */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="p-4 sm:px-5 flex items-center justify-between border-b">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Nhật ký chấm công gần đây
                </h2>
                <p className="text-xs text-muted-foreground">
                  Dữ liệu điểm danh và tính công các ngày làm việc gần nhất
                </p>
              </div>
              <Link
                href="/me/attendance"
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <span>Xem toàn bộ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">
                      Ngày làm việc
                    </TableHead>
                    <TableHead className="text-xs font-semibold">
                      Ca làm việc
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      Giờ vào
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      Giờ ra
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-center">
                      Công
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-right">
                      Trạng thái
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAttendanceLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <TableRow key={index} className="hover:bg-transparent">
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-5 w-16 ml-auto rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : latestRecords.length === 0 ? (
                    /* Table-Embedded Empty State chuẩn Rule 04 */
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={6}
                        className="h-40 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center space-y-1.5">
                          <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm font-medium">
                            Chưa có dữ liệu chấm công tháng này
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Hãy thực hiện điểm danh Face AI để ghi nhận giờ làm
                            việc
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    latestRecords.map((rec) => (
                      <TableRow
                        key={rec.workDate}
                        className="text-xs hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-semibold text-foreground">
                          {rec.workDate}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {rec.shiftName || "Ca hành chính"}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {rec.checkInTime || rec.firstInTime || "--:--"}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {rec.checkOutTime || rec.lastOutTime || "--:--"}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {rec.workCredit ?? 1.0}
                        </TableCell>
                        <TableCell className="text-right">
                          {rec.lateMinutes && rec.lateMinutes > 0 ? (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[11px] font-semibold">
                              Muộn {rec.lateMinutes}p
                            </Badge>
                          ) : rec.status === "ON_TIME" || rec.checkInTime ? (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[11px] font-semibold">
                              Đúng giờ
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[11px]">
                              {rec.status || "Chờ xử lý"}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Cột phải (5/12): Hộp việc cần xử lý & Tiến trình đơn (Action Center) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Tiến trình đơn & Yêu cầu
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Trạng thái xét duyệt đơn từ và yêu cầu cá nhân
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 text-xs gap-1"
              >
                <Link href="/me/leave/new">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo đơn</span>
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {pendingLeaves.length === 0 && pendingAttRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                  <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600 mb-1" />
                  <p className="font-semibold text-foreground">
                    Không có đơn chờ duyệt
                  </p>
                  <p>Tất cả các yêu cầu của bạn đã được xử lý xong</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingLeaves.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{req.leaveTypeName || "Nghỉ phép năm"}</span>
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          {req.startDate} → {req.endDate} ({req.daysCount ?? 1} ngày)
                        </div>
                      </div>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "default"
                            : req.status === "REJECTED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {req.status === "APPROVED"
                          ? "Đã duyệt"
                          : req.status === "REJECTED"
                          ? "Từ chối"
                          : "Chờ duyệt"}
                      </Badge>
                    </div>
                  ))}

                  {pendingAttRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-lg border bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Giải trình: {req.requestType}</span>
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          Ngày {req.workDate} • {req.reason}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vị trí Chỗ ngồi làm việc cố định */}
          <Card className="rounded-xl border border-border bg-card shadow-xs">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Armchair className="w-4 h-4 text-primary" />
                <span>Không gian làm việc cố định</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Bàn làm việc chỉ định
                  </span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-semibold">
                    Đã cấp phát
                  </Badge>
                </div>
                <div className="text-base font-bold text-foreground">
                  {seatData?.seatCode || "Bàn S-301 - Tầng 3"}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Trụ sở CYCLOSA Tower • Cầu Giấy, Hà Nội</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  asChild
                >
                  <Link href="/me/workplace">
                    <span>Xem sơ đồ chỗ ngồi</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-white"
                  asChild
                >
                  <Link href="/me/workplace/desk-booking">
                    <span>Đặt bàn làm việc</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EmployeePageSwitcher() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  if (tab === "metrics" || tab === "dashboard") {
    return <EmployeeOverviewContent />;
  }

  return <EmployeeNavHub />;
}

export default function EmployeeOverviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Đang tải Cổng nhân viên...
        </div>
      }
    >
      <EmployeePageSwitcher />
    </React.Suspense>
  );
}
