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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FolderOpen,
  Eye,
  Pencil,
  Trash2,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import { CycleStatusBadge } from "../performance-badges";
import { PERFORMANCE_CYCLE_TYPE_LABELS } from "../../constants/performance.constants";
import type { PerformanceCycleDto } from "../../types/performance.types";
import { useRouter } from "next/navigation";

interface CycleTableProps {
  items: PerformanceCycleDto[];
  isLoading?: boolean;
  page: number;
  size: number;
  onEdit?: (cycle: PerformanceCycleDto) => void;
  onDelete?: (cycle: PerformanceCycleDto) => void;
  onActivate?: (cycle: PerformanceCycleDto) => void;
  onClose?: (cycle: PerformanceCycleDto) => void;
}

export function CycleTable({
  items,
  isLoading,
  page,
  size,
  onEdit,
  onDelete,
  onActivate,
  onClose,
}: CycleTableProps) {
  const router = useRouter();

  const formatDate = (dStr?: string) => {
    if (!dStr) return "—";
    try {
      const parts = dStr.slice(0, 10).split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dStr;
    } catch {
      return dStr;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">Tên kỳ đánh giá</TableHead>
              <TableHead className="text-xs font-semibold">Phân loại & Năm</TableHead>
              <TableHead className="text-xs font-semibold">Thời gian áp dụng</TableHead>
              <TableHead className="text-xs font-semibold text-center">Tiến độ phiếu</TableHead>
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
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
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
                  colSpan={7}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Không tìm thấy kỳ đánh giá nào</p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* 3. Table Rows */
              items.map((cycle, index) => {
                const completionRate =
                  cycle.totalReviews > 0
                    ? Math.round((cycle.finalizedReviews / cycle.totalReviews) * 100)
                    : 0;

                return (
                  <TableRow
                    key={cycle.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {(page - 1) * size + index + 1}
                    </TableCell>

                    <TableCell className="text-xs">
                      <button
                        onClick={() => router.push(`/performance/cycles/${cycle.id}`)}
                        className="font-medium text-foreground hover:text-primary transition-colors text-left"
                      >
                        {cycle.name}
                      </button>
                      {cycle.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {cycle.description}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {PERFORMANCE_CYCLE_TYPE_LABELS[cycle.cycleType] || cycle.cycleType}
                      </span>
                      <span className="text-[11px] block text-muted-foreground">
                        Năm {cycle.year}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      <span>
                        {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                      </span>
                      {cycle.selfReviewDeadline && (
                        <span className="text-[11px] block text-amber-600 dark:text-amber-400">
                          Hạn tự chấm: {formatDate(cycle.selfReviewDeadline)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-xs">
                      <span className="font-semibold text-foreground">
                        {cycle.finalizedReviews}/{cycle.totalReviews}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        ({completionRate}% chốt)
                      </span>
                    </TableCell>

                    <TableCell>
                      <CycleStatusBadge status={cycle.status} />
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuItem
                            onClick={() => router.push(`/performance/cycles/${cycle.id}`)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Xem chi tiết kỳ
                          </DropdownMenuItem>

                          {cycle.status === "DRAFT" && (
                            <>
                              <DropdownMenuItem onClick={() => onEdit?.(cycle)}>
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                Chỉnh sửa thông tin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onActivate?.(cycle)}
                                className="text-emerald-600 focus:text-emerald-600"
                              >
                                <PlayCircle className="w-3.5 h-3.5 mr-2" />
                                Kích hoạt mở kỳ
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete?.(cycle)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Xóa kỳ đánh giá
                              </DropdownMenuItem>
                            </>
                          )}

                          {cycle.status === "ACTIVE" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onClose?.(cycle)}
                                className="text-amber-600 focus:text-amber-600"
                              >
                                <StopCircle className="w-3.5 h-3.5 mr-2" />
                                Đóng kỳ đánh giá
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
