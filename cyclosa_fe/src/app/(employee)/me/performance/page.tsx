"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  Award,
  TrendingUp,
  CheckCircle2,
  Calendar,
  FileCheck,
  Star,
  Edit3,
  Send,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyReviewsQuery,
  useSaveSelfAssessmentMutation,
  useSubmitSelfAssessmentMutation,
  useGetReviewDetailQuery,
} from "@/features/performance/api/performance-api";
import {
  REVIEW_STATUS_LABELS,
  PERFORMANCE_RATING_LABELS,
} from "@/features/performance/constants/performance.constants";
import type { PerformanceReviewDto } from "@/features/performance/types/performance.types";
import { toast } from "sonner";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "---";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "---" : d.toLocaleDateString("vi-VN");
  } catch {
    return "---";
  }
}

export default function EmployeePerformancePage() {
  const { data: reviewsData, isLoading: loadingReviews, refetch } = useGetMyReviewsQuery();
  const [saveSelfAssessment, { isLoading: savingAssessment }] = useSaveSelfAssessmentMutation();
  const [submitSelfAssessment, { isLoading: submittingAssessment }] = useSubmitSelfAssessmentMutation();

  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReviewDto | null>(null);
  const [generalComment, setGeneralComment] = useState("");

  const reviews = reviewsData?.data || [];
  const latestReview = reviews[0];

  const handleOpenAssessment = (review: PerformanceReviewDto) => {
    setSelectedReview(review);
    setGeneralComment("");
    setAssessmentDialogOpen(true);
  };

  const handleSaveDraft = async () => {
    if (!selectedReview) return;
    if (!generalComment.trim()) {
      toast.error("Vui lòng nhập nhận xét tự đánh giá");
      return;
    }

    try {
      await saveSelfAssessment({
        reviewId: selectedReview.id,
        body: { generalComment: generalComment.trim() },
      }).unwrap();
      toast.success("Đã lưu bản nháp tự đánh giá");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Không thể lưu bản nháp";
      toast.error(msg);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!selectedReview) return;
    if (!generalComment.trim()) {
      toast.error("Vui lòng nhập nhận xét tự đánh giá trước khi nộp");
      return;
    }

    try {
      await saveSelfAssessment({
        reviewId: selectedReview.id,
        body: { generalComment: generalComment.trim() },
      }).unwrap();
      await submitSelfAssessment(selectedReview.id).unwrap();
      toast.success("Đã nộp bản tự đánh giá thành công");
      setAssessmentDialogOpen(false);
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Không thể nộp tự đánh giá";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Target className="w-6 h-6 text-primary shrink-0" />
            <span>Đánh giá hiệu suất</span>
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
            <span className="text-foreground font-medium">Đánh giá hiệu suất</span>
          </nav>
        </div>
      </div>

      {/* 2. Thẻ kết quả kỳ đánh giá gần nhất */}
      {loadingReviews ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-8 w-60" />
            <Skeleton className="h-4 w-80" />
          </div>
        </Card>
      ) : latestReview ? (
        <Card className="rounded-xl border shadow-xs bg-card p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {latestReview.finalRating && (
                  <Badge className="bg-amber-600 text-white text-[11px] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    Xếp loại: {PERFORMANCE_RATING_LABELS[latestReview.finalRating] || latestReview.finalRating}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground font-medium">
                  {latestReview.cycleName}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Điểm tổng kết:{" "}
                <span className="text-primary font-extrabold">
                  {latestReview.finalScore !== undefined ? `${latestReview.finalScore} / 100` : "Đang đánh giá"}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Quản lý đánh giá: {latestReview.managerEmployeeName || "Chưa phân công"} • Trạng thái:{" "}
                <span className="font-semibold text-foreground">
                  {REVIEW_STATUS_LABELS[latestReview.status] || latestReview.status}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {latestReview.status === "DRAFT" && (
                <Button
                  size="sm"
                  onClick={() => handleOpenAssessment(latestReview)}
                  className="rounded-xl text-xs bg-primary text-white gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Tự đánh giá</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/40 border">
              <span className="font-semibold text-foreground">Số lượng mục tiêu cam kết:</span>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                {latestReview.totalGoals || 0} mục tiêu trọng tâm trong kỳ (Tổng trọng số: {latestReview.totalWeight || 100}%)
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border">
              <span className="font-semibold text-foreground">Thời gian cập nhật:</span>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                {formatDate(latestReview.updatedAt)}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-xl border shadow-xs bg-card p-6 text-center">
          <p className="text-sm font-medium text-foreground">Hiện chưa có kỳ đánh giá hiệu suất nào</p>
          <p className="text-xs text-muted-foreground mt-1">Khi phòng Nhân sự khởi tạo đợt đánh giá định kỳ, phiếu đánh giá sẽ hiển thị tại đây</p>
        </Card>
      )}

      {/* 3. Lịch sử các kỳ đánh giá */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b">
          <CardTitle className="text-base font-semibold text-foreground">
            Lịch sử Đánh giá Hiệu suất (Performance History)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Kỳ đánh giá</TableHead>
                  <TableHead className="font-semibold text-xs">Quản lý đánh giá</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Điểm số</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Xếp loại</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingReviews ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : reviews.length > 0 ? (
                  reviews.map((rw) => (
                    <TableRow key={rw.id}>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {rw.cycleName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {rw.managerEmployeeName || "Chưa phân công"}
                      </TableCell>
                      <TableCell className="text-xs text-center font-bold text-primary">
                        {rw.finalScore !== undefined ? rw.finalScore : "--"}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        {rw.finalRating ? (
                          <Badge variant="secondary" className="text-[10px]">
                            {PERFORMANCE_RATING_LABELS[rw.finalRating] || rw.finalRating}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge
                          variant={
                            rw.status === "FINALIZED"
                              ? "default"
                              : rw.status === "DRAFT"
                              ? "outline"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {REVIEW_STATUS_LABELS[rw.status] || rw.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {rw.status === "DRAFT" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAssessment(rw)}
                            className="h-7 text-xs text-primary gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Tự đánh giá</span>
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info(`Kỳ đánh giá ${rw.cycleName}: ${REVIEW_STATUS_LABELS[rw.status] || rw.status}`)}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            Xem trạng thái
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5">
                        <Target className="h-7 w-7 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có kỳ đánh giá nào được kích hoạt</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Tự đánh giá hiệu suất */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Tự đánh giá kết quả công việc</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedReview?.cycleName} • Gửi nhận xét cá nhân tới quản lý trực tiếp.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="selfComment" className="text-xs font-semibold">
                Nội dung tự đánh giá & Thành tích đạt được <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="selfComment"
                rows={5}
                placeholder="Trình bày chi tiết tiến độ các mục tiêu đã cam kết, những sáng kiến, khó khăn và đề xuất hỗ trợ..."
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={savingAssessment || submittingAssessment}
            >
              {savingAssessment && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Lưu bản nháp
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-primary text-white"
              onClick={handleSubmitAssessment}
              disabled={savingAssessment || submittingAssessment}
            >
              {submittingAssessment && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Nộp bản tự đánh giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
