"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RatingBadge } from "../performance-badges";
import { Loader2, Calculator, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import type { ScorePreviewDto } from "../../types/performance.types";

interface ScorePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewData?: ScorePreviewDto;
  onFinalize: () => Promise<void>;
  isLoadingPreview?: boolean;
  isFinalizing?: boolean;
}

export function ScorePreviewDialog({
  open,
  onOpenChange,
  previewData,
  onFinalize,
  isLoadingPreview,
  isFinalizing,
}: ScorePreviewDialogProps) {
  const isReady = previewData?.isReadyToFinalize;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            <span>Xem trước điểm tổng hợp & Xếp loại</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tính toán điểm số gia quyền tự động theo công thức chuẩn và đối chiếu khung xếp loại.
          </DialogDescription>
        </DialogHeader>

        {isLoadingPreview ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Đang tính toán điểm số...</span>
          </div>
        ) : previewData ? (
          <div className="space-y-4 py-2">
            {/* Box điểm số lớn */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 text-center space-y-2">
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                ĐIỂM ĐÁNH GIÁ TỔNG HỢP (THANG 100)
              </span>
              <div className="text-4xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight">
                {Number(previewData.calculatedScore).toFixed(2)}
              </div>
              <div className="pt-1">
                <RatingBadge rating={previewData.calculatedRating} />
              </div>
            </div>

            {/* Chi tiết thông số */}
            <div className="grid grid-cols-2 gap-2 text-xs border rounded-lg p-3 bg-muted/20">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Tổng trọng số mục tiêu:</span>
                <span className="font-semibold text-foreground">
                  {previewData.totalWeight}%
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground block text-[11px]">Số lượng mục tiêu:</span>
                <span className="font-semibold text-foreground">
                  {previewData.evaluatedGoalsCount}/{previewData.totalGoals} đã chấm
                </span>
              </div>
            </div>

            {/* Cảnh báo hoặc xác nhận */}
            {isReady ? (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <span className="font-semibold block">Đã đủ điều kiện chốt kết quả</span>
                  <span className="text-[11px] block mt-0.5">
                    Toàn bộ mục tiêu đã được quản lý cho điểm. Khi bấm Chốt kết quả, phiếu đánh giá sẽ chuyển sang trạng thái <strong>FINALIZED</strong> và bất biến.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <span className="font-semibold block">Chưa thể chốt kết quả</span>
                  <span className="text-[11px] block mt-0.5">
                    {previewData.validationMessage || "Vẫn còn mục tiêu chưa được quản lý chấm điểm."}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isFinalizing}
            className="h-8 text-xs"
          >
            Đóng
          </Button>

          {isReady && (
            <Button
              type="button"
              size="sm"
              onClick={onFinalize}
              disabled={isFinalizing}
              className="h-8 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isFinalizing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Chốt kết quả bất biến</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
