"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePrecheckPayrollPeriodQuery, useCalculatePayrollMutation } from "../../api/payroll-api";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Loader2, Play } from "lucide-react";

interface PeriodPrecheckDialogProps {
  periodId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCalculated?: () => void;
}

export function PeriodPrecheckDialog({
  periodId,
  open,
  onOpenChange,
  onCalculated,
}: PeriodPrecheckDialogProps) {
  const { data, isLoading } = usePrecheckPayrollPeriodQuery(periodId || "", {
    skip: !periodId || !open,
  });
  const [calculatePayroll, { isLoading: isCalculating }] = useCalculatePayrollMutation();

  const precheck = data?.data;

  const handleStartCalculation = async () => {
    if (!periodId) return;
    try {
      await calculatePayroll(periodId).unwrap();
      toast.success("Đã tính toán lương thành công");
      onOpenChange(false);
      onCalculated?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi khi tính toán bảng lương");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kiểm tra dữ liệu trước khi tính lương</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40">
              <span className="text-sm font-medium">Số nhân sự đủ điều kiện:</span>
              <Badge variant="outline" className="font-semibold">
                {precheck?.totalEligibleEmployees || 0} nhân viên
              </Badge>
            </div>

            {precheck?.warnings && precheck.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Cảnh báo cần lưu ý ({precheck.warnings.length})</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {precheck.warnings.map((w, idx) => (
                    <div key={idx} className="p-2 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
                      • {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {precheck?.errors && precheck.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                  <XCircle className="h-4 w-4" />
                  <span>Lỗi chặn tính lương ({precheck.errors.length})</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {precheck.errors.map((e, idx) => (
                    <div key={idx} className="p-2 rounded bg-destructive/10 text-destructive">
                      • {e}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {precheck?.isReady && (!precheck.warnings || precheck.warnings.length === 0) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 text-sm">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Toàn bộ hồ sơ nhân sự, dữ liệu công và tạm ứng đều hợp lệ để chạy tính lương.</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={handleStartCalculation}
            disabled={isLoading || isCalculating || !precheck?.isReady}
          >
            {isCalculating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Bắt đầu tính lương
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

