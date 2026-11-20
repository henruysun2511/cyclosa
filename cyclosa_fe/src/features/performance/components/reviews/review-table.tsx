import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Eye } from "lucide-react";
import { ReviewStatusBadge, RatingBadge } from "../performance-badges";
import type { PerformanceReviewDto } from "../../types/performance.types";
import { useRouter } from "next/navigation";

interface ReviewTableProps {
  items: PerformanceReviewDto[];
  isLoading?: boolean;
  page: number;
  size: number;
}

export function ReviewTable({ items, isLoading, page, size }: ReviewTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">Nhân sự được đánh giá</TableHead>
              <TableHead className="text-xs font-semibold">Kỳ đánh giá</TableHead>
              <TableHead className="text-xs font-semibold">Quản lý trực tiếp</TableHead>
              <TableHead className="text-xs font-semibold text-center">Số mục tiêu / Trọng số</TableHead>
              <TableHead className="text-xs font-semibold text-center">Điểm & Xếp loại</TableHead>
              <TableHead className="text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-20 text-center text-xs font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 1. Loading Skeleton */}
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              /* 2. Table-Embedded Empty State */
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Không tìm thấy phiếu đánh giá nào</p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* 3. Table Rows */
              items.map((review, index) => (
                <TableRow
                  key={review.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {(page - 1) * size + index + 1}
                  </TableCell>

                  <TableCell className="text-xs">
                    <button
                      onClick={() => router.push(`/performance/reviews/${review.id}`)}
                      className="font-medium text-foreground hover:text-primary transition-colors text-left"
                    >
                      {review.employeeName}
                    </button>
                    <span className="text-[11px] font-mono text-muted-foreground block">
                      {review.employeeCode}{" "}
                      {review.departmentName && `• ${review.departmentName}`}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs font-medium text-foreground">
                    {review.cycleName}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {review.managerEmployeeName || "—"}
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    <span className="font-semibold text-foreground">
                      {review.totalGoals} mục tiêu
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      (Tổng: {review.totalWeight}%)
                    </span>
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    {review.finalScore !== undefined && review.finalScore !== null ? (
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground text-sm">
                          {Number(review.finalScore).toFixed(1)}/100
                        </span>
                        <div>
                          <RatingBadge rating={review.finalRating} />
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <ReviewStatusBadge status={review.status} />
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/performance/reviews/${review.id}`)}
                      className="h-8 text-xs gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Chi tiết</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
