"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  RefreshCw,
  Users,
  PlayCircle,
  StopCircle,
  ArrowLeft,
  Award,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  useGetCycleByIdQuery,
  useGetCycleSummaryQuery,
  useGetReviewsQuery,
  useActivateCycleMutation,
  useCloseCycleMutation,
  useInitializeReviewsMutation,
  CycleStatusBadge,
  ReviewTable,
  InitializeReviewsDialog,
  PERFORMANCE_CYCLE_TYPE_LABELS,
  PERFORMANCE_RATING_LABELS,
  type PerformanceRating,
} from "@/features/performance";
import { useGetEmployeesQuery } from "@/features/employee";

export default function PerformanceCycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: cycleId } = use(params);
  const router = useRouter();

  const [initDialogOpen, setInitDialogOpen] = useState(false);

  // Queries
  const {
    data: cycleData,
    isLoading: isCycleLoading,
    isFetching: isCycleFetching,
    refetch: refetchCycle,
  } = useGetCycleByIdQuery(cycleId);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetCycleSummaryQuery(cycleId);

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useGetReviewsQuery({
    cycleId,
    page: 1,
    size: 50,
  });

  const { data: employeesData } = useGetEmployeesQuery({
    size: 200,
    status: "ACTIVE",
  });

  // Mutations
  const [activateCycle, { isLoading: isActivating }] = useActivateCycleMutation();
  const [closeCycle, { isLoading: isClosing }] = useCloseCycleMutation();
  const [initializeReviews, { isLoading: isInitializing }] = useInitializeReviewsMutation();

  const cycle = cycleData?.data;
  const summary = summaryData?.data;
  const reviews = reviewsData?.data?.items || [];
  const employees = (employeesData?.items || []).map((e: any) => ({
    id: e.id,
    employeeCode: e.employeeCode,
    fullName: `${e.lastName} ${e.firstName}`,
    departmentName: e.currentDepartmentName,
  }));

  const handleRefetchAll = () => {
    refetchCycle();
    refetchSummary();
    refetchReviews();
  };

  const handleActivate = async () => {
    if (!confirm("Kích hoạt mở kỳ đánh giá này cho toàn công ty?")) return;
    try {
      await activateCycle(cycleId).unwrap();
      toast.success("Kích hoạt kỳ đánh giá thành công");
      handleRefetchAll();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể kích hoạt kỳ đánh giá");
    }
  };

  const handleClose = async () => {
    if (!confirm("Đóng kỳ đánh giá này? Kết quả sẽ được tổng kết.")) return;
    try {
      await closeCycle(cycleId).unwrap();
      toast.success("Đóng kỳ đánh giá thành công");
      handleRefetchAll();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể đóng kỳ đánh giá");
    }
  };

  const handleInitializeReviews = async (selectedCycleId: string, employeeIds: string[]) => {
    try {
      await initializeReviews({
        cycleId: selectedCycleId,
        body: { employeeIds },
      }).unwrap();
      toast.success(`Đã khởi tạo ${employeeIds.length} phiếu đánh giá thành công`);
      refetchReviews();
      refetchSummary();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể khởi tạo phiếu đánh giá");
    }
  };

  if (isCycleLoading) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Đang tải thông tin kỳ đánh giá...
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">
          Không tìm thấy kỳ đánh giá được yêu cầu
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push("/performance/cycles")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại danh sách kỳ
        </Button>
      </div>
    );
  }

  const ratings: PerformanceRating[] = [
    "EXCELLENT",
    "GOOD",
    "SATISFACTORY",
    "NEEDS_IMPROVEMENT",
    "POOR",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Calendar className="w-6 h-6 text-primary shrink-0" />
            <span>{cycle.name}</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/performance/cycles" className="hover:text-primary transition-colors">
              Hiệu suất & KPI
            </Link>
            <span>/</span>
            <Link href="/performance/cycles" className="hover:text-primary transition-colors">
              Kỳ đánh giá
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{cycle.name}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefetchAll}
            disabled={isCycleFetching}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCycleFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          {cycle.status === "ACTIVE" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInitDialogOpen(true)}
                className="h-8 text-xs gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Khởi tạo phiếu đánh giá</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={isClosing}
                className="h-8 text-xs gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Đóng kỳ đánh giá</span>
              </Button>
            </>
          )}

          {cycle.status === "DRAFT" && (
            <Button
              size="sm"
              onClick={handleActivate}
              disabled={isActivating}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Kích hoạt mở kỳ</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thông tin tổng quan kỳ & Phân bổ xếp loại */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card thông số kỳ */}
        <Card className="shadow-xs border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Thông tin chu kỳ</span>
              <CycleStatusBadge status={cycle.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Phân loại:</span>
              <span className="font-medium text-foreground">
                {PERFORMANCE_CYCLE_TYPE_LABELS[cycle.cycleType]}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Năm áp dụng:</span>
              <span className="font-medium text-foreground">Năm {cycle.year}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Thời gian diễn ra:</span>
              <span className="font-medium text-foreground">
                {cycle.startDate} - {cycle.endDate}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Hạn nhân viên tự chấm:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {cycle.selfReviewDeadline || "Chưa thiết lập"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Hạn quản lý hoàn tất:</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {cycle.managerReviewDeadline || "Chưa thiết lập"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card thống kê phân bổ kết quả */}
        <Card className="shadow-xs border-border/60 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Phân bổ xếp loại & Điểm số trung bình</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSummaryLoading ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Đang tổng hợp dữ liệu xếp loại...
              </div>
            ) : summary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-muted/30 border">
                    <span className="text-[11px] text-muted-foreground block">Tổng phiếu</span>
                    <span className="text-xl font-bold text-foreground">
                      {summary.totalReviews}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border">
                    <span className="text-[11px] text-muted-foreground block">Đã chốt (Finalized)</span>
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {summary.finalizedReviews}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/30 border col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-muted-foreground block">Điểm trung bình kỳ</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {summary.averageScore ? Number(summary.averageScore).toFixed(1) : "—"}/100
                    </span>
                  </div>
                </div>

                {/* Thanh xếp loại */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Phân bổ xếp loại nhân sự:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {ratings.map((r) => {
                      const count = summary.ratingDistribution?.[r] || 0;
                      return (
                        <div key={r} className="p-2 rounded border bg-background text-center">
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {PERFORMANCE_RATING_LABELS[r]}
                          </span>
                          <span className="text-sm font-bold text-foreground block mt-0.5">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* 3. Danh sách phiếu đánh giá trong kỳ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Danh sách phiếu đánh giá nhân sự ({reviews.length})</span>
          </h2>

          <Link href={`/performance/reviews?cycleId=${cycleId}`}>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">
              Xem toàn bộ trên trang quản lý phiếu &rarr;
            </Button>
          </Link>
        </div>

        <ReviewTable
          items={reviews}
          isLoading={isReviewsLoading}
          page={1}
          size={50}
        />
      </div>

      {/* 4. Dialog Khởi tạo phiếu */}
      <InitializeReviewsDialog
        open={initDialogOpen}
        onOpenChange={setInitDialogOpen}
        cycles={[cycle]}
        defaultCycleId={cycle.id}
        employees={employees}
        onSubmit={handleInitializeReviews}
        isLoading={isInitializing}
      />
    </div>
  );
}
