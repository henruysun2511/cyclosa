"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  RefreshCw,
  Plus,
  ArrowLeft,
  Award,
  Calculator,
  Lock,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetReviewDetailQuery,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useSaveManagerAssessmentMutation,
  useSubmitManagerAssessmentMutation,
  useLazyGetScorePreviewQuery,
  useFinalizeReviewMutation,
  useGetKpisQuery,
  ReviewStatusBadge,
  RatingBadge,
  GoalTable,
  GoalFormDialog,
  ManagerAssessmentDialog,
  ScorePreviewDialog,
  type PerformanceGoalDto,
  type GoalFormValues,
  type ManagerAssessmentPayload,
} from "@/features/performance";

export default function PerformanceReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reviewId } = use(params);
  const router = useRouter();

  // Dialog states
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoalDto | null>(null);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  // Queries
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isFetching: isReviewFetching,
    refetch: refetchReview,
  } = useGetReviewDetailQuery(reviewId);

  const { data: kpisData } = useGetKpisQuery({ size: 100, isActive: true });
  const kpis = kpisData?.data?.items || [];

  const [triggerScorePreview, { data: previewResponse, isFetching: isPreviewFetching }] =
    useLazyGetScorePreviewQuery();

  // Mutations
  const [addGoal, { isLoading: isAddingGoal }] = useAddGoalMutation();
  const [updateGoal, { isLoading: isUpdatingGoal }] = useUpdateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();
  const [saveManagerAssessment, { isLoading: isSavingAssessment }] = useSaveManagerAssessmentMutation();
  const [submitManagerAssessment, { isLoading: isSubmittingAssessment }] = useSubmitManagerAssessmentMutation();
  const [finalizeReview, { isLoading: isFinalizing }] = useFinalizeReviewMutation();

  const review = reviewData?.data;
  const isFinalized = review?.status === "FINALIZED";

  const totalWeight = Number(review?.totalWeight || 0);
  const remainingWeight = Math.max(0, 100 - totalWeight);

  const handleOpenAddGoal = () => {
    setSelectedGoal(null);
    setGoalDialogOpen(true);
  };

  const handleOpenEditGoal = (goal: PerformanceGoalDto) => {
    setSelectedGoal(goal);
    setGoalDialogOpen(true);
  };

  const handleGoalSubmit = async (values: GoalFormValues) => {
    try {
      if (selectedGoal) {
        await updateGoal({
          goalId: selectedGoal.id,
          reviewId,
          body: {
            name: values.name,
            targetValue: values.targetValue,
            kpiId: values.kpiId || undefined,
            weight: values.weight,
          },
        }).unwrap();
        toast.success("Cập nhật mục tiêu thành công");
      } else {
        await addGoal({
          reviewId,
          body: {
            name: values.name,
            targetValue: values.targetValue,
            kpiId: values.kpiId || undefined,
            weight: values.weight,
          },
        }).unwrap();
        toast.success("Thêm mục tiêu thành công");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi khi lưu mục tiêu");
    }
  };

  const handleDeleteGoal = async (goal: PerformanceGoalDto) => {
    if (!confirm(`Bạn có chắc muốn xóa mục tiêu "${goal.name}"?`)) return;
    try {
      await deleteGoal({ goalId: goal.id, reviewId }).unwrap();
      toast.success("Xóa mục tiêu thành công");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa mục tiêu");
    }
  };

  const handleAssessmentSubmit = async (
    payload: ManagerAssessmentPayload,
    submitDirectly: boolean
  ) => {
    try {
      await saveManagerAssessment({ reviewId, body: payload }).unwrap();
      if (submitDirectly) {
        await submitManagerAssessment(reviewId).unwrap();
        toast.success("Quản lý đã hoàn tất và nộp điểm đánh giá thành công");
      } else {
        toast.success("Lưu nháp điểm đánh giá thành công");
      }
      refetchReview();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể lưu điểm đánh giá");
    }
  };

  const handleOpenPreview = async () => {
    setPreviewDialogOpen(true);
    try {
      await triggerScorePreview(reviewId).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể tính toán xem trước điểm số");
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeReview(reviewId).unwrap();
      toast.success("Chốt kết quả đánh giá thành công (FINALIZED)");
      setPreviewDialogOpen(false);
      refetchReview();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chốt kết quả đánh giá");
    }
  };

  if (isReviewLoading) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Đang tải chi tiết phiếu đánh giá...
      </div>
    );
  }

  if (!review) {
    return (
      <div className="py-24 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">
          Không tìm thấy phiếu đánh giá được yêu cầu
        </p>
        <Button variant="outline" size="sm" onClick={() => router.push("/performance/reviews")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại danh sách phiếu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Rule 02) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <span>Phiếu đánh giá: {review.employeeName}</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/performance/reviews" className="hover:text-primary transition-colors">
              Hiệu suất & KPI
            </Link>
            <span>/</span>
            <Link href="/performance/reviews" className="hover:text-primary transition-colors">
              Phiếu đánh giá
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{review.employeeName}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchReview()}
            disabled={isReviewFetching}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReviewFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>

          {!isFinalized && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenAddGoal}
                className="h-8 text-xs gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span>Thêm mục tiêu</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssessmentDialogOpen(true)}
                className="h-8 text-xs gap-1.5 text-amber-700 dark:text-amber-300 border-amber-300 hover:bg-amber-50"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Quản lý chấm điểm</span>
              </Button>

              <Button
                size="sm"
                onClick={handleOpenPreview}
                className="h-8 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Xem trước & Chốt kết quả</span>
              </Button>
            </>
          )}

          {isFinalized && (
            <Badge variant="outline" className="h-8 px-3 text-xs gap-1.5 bg-purple-50 text-purple-700 border-purple-300">
              <Lock className="w-3.5 h-3.5" />
              <span>Đã chốt kết quả bất biến</span>
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Top Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Nhân sự & Kỳ đánh giá */}
        <Card className="shadow-xs border-border/60">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Thông tin nhân sự</span>
              <ReviewStatusBadge status={review.status} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <span className="font-semibold text-foreground block">
                  {review.employeeName}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Mã: {review.employeeCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Phòng ban / Chức danh:</span>
                <span className="font-medium text-foreground">
                  {review.departmentName || "Chưa gán"} • {review.jobTitleName || "Chưa gán"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground block text-[11px]">Kỳ đánh giá:</span>
                <span className="font-medium text-foreground">
                  {review.cycleName}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Trọng số & Kết quả */}
        <Card className="shadow-xs border-border/60">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Điểm số & Trọng số phân bổ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border">
              <div>
                <span className="text-[11px] text-muted-foreground block">Tổng trọng số:</span>
                <span className="text-base font-bold text-foreground">
                  {totalWeight}% / 100%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Số mục tiêu:</span>
                <span className="text-base font-bold text-foreground">
                  {review.goals?.length || 0} mục tiêu
                </span>
              </div>
            </div>

            <div className="text-center p-2 rounded-lg bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200">
              <span className="text-[11px] text-purple-700 dark:text-purple-300 block font-medium">
                ĐIỂM CHỐT CUỐI CÙNG
              </span>
              <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                {review.finalScore !== undefined && review.finalScore !== null
                  ? Number(review.finalScore).toFixed(2)
                  : "—"}
              </div>
              <div className="mt-1">
                <RatingBadge rating={review.finalRating} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Quản lý trực tiếp & Nhận xét */}
        <Card className="shadow-xs border-border/60">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ý kiến phản hồi & Đánh giá
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Quản lý phụ trách chấm điểm:
              </span>
              <span className="font-semibold text-foreground">
                {review.managerEmployeeName || "Chưa phân công"}
              </span>
            </div>

            {review.selfComment && (
              <div className="p-2 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 text-[11px]">
                <span className="font-semibold text-blue-700 dark:text-blue-300 block">
                  Ý kiến nhân sự tự nhận xét:
                </span>
                <p className="text-muted-foreground mt-0.5 italic">
                  &quot;{review.selfComment}&quot;
                </p>
              </div>
            )}

            {review.managerComment && (
              <div className="p-2 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 text-[11px]">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block">
                  Nhận xét của Quản lý:
                </span>
                <p className="text-muted-foreground mt-0.5 italic">
                  &quot;{review.managerComment}&quot;
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Danh sách mục tiêu (Goal Table) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span>Danh sách mục tiêu đánh giá ({review.goals?.length || 0})</span>
          </h2>

          {!isFinalized && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenAddGoal}
              className="h-8 text-xs gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Giao thêm mục tiêu</span>
            </Button>
          )}
        </div>

        <GoalTable
          goals={review.goals || []}
          reviewStatus={review.status}
          onEdit={handleOpenEditGoal}
          onDelete={handleDeleteGoal}
        />
      </div>

      {/* 4. Form Dialog Thêm / Sửa mục tiêu */}
      <GoalFormDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        entity={selectedGoal}
        kpis={kpis}
        remainingWeight={remainingWeight}
        onSubmit={handleGoalSubmit}
        isLoading={isAddingGoal || isUpdatingGoal}
      />

      {/* 5. Dialog Quản lý chấm điểm */}
      <ManagerAssessmentDialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
        goals={review.goals || []}
        initialComment={review.managerComment}
        onSubmit={handleAssessmentSubmit}
        isLoading={isSavingAssessment || isSubmittingAssessment}
      />

      {/* 6. Dialog Xem trước điểm & Chốt kết quả */}
      <ScorePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        previewData={previewResponse?.data}
        onFinalize={handleFinalize}
        isLoadingPreview={isPreviewFetching}
        isFinalizing={isFinalizing}
      />
    </div>
  );
}
