"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PAYROLL_PERIOD_STATUS_LABELS,
  PAYROLL_PERIOD_STATUS_VARIANTS,
} from "../../constants/payroll.constants";
import type { PayrollPeriodDto } from "../../types/payroll.types";
import {
  useSubmitPayrollForApprovalMutation,
  useApprovePayrollPeriodMutation,
  useLockPayrollPeriodMutation,
} from "../../api/payroll-api";
import { toast } from "sonner";
import { ArrowLeft, Send, CheckCircle2, Lock, Banknote, Play, Loader2 } from "lucide-react";

interface PeriodDetailHeaderProps {
  period: PayrollPeriodDto;
  onRecalculateClick?: () => void;
  refetch?: () => void;
}

/**
 * Header trang chi tiết kỳ tính lương tuân thủ 100% Rule 02
 */
export function PeriodDetailHeader({
  period,
  onRecalculateClick,
  refetch,
}: PeriodDetailHeaderProps) {
  const [submitForApproval, { isLoading: isSubmitting }] = useSubmitPayrollForApprovalMutation();
  const [approvePeriod, { isLoading: isApproving }] = useApprovePayrollPeriodMutation();
  const [lockPeriod, { isLoading: isLocking }] = useLockPayrollPeriodMutation();

  const handleSubmit = async () => {
    try {
      await submitForApproval(period.id).unwrap();
      toast.success("Đã gửi trình duyệt bảng lương thành công");
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể trình duyệt bảng lương");
    }
  };

  const handleApprove = async () => {
    try {
      await approvePeriod(period.id).unwrap();
      toast.success("Bảng lương đã được phê duyệt thành công! Lệnh chi trả và phiếu lương đã được tạo.");
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể phê duyệt bảng lương");
    }
  };

  const handleLock = async () => {
    try {
      await lockPeriod(period.id).unwrap();
      toast.success("Đã khóa sổ bảng lương an toàn");
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể khóa sổ");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        {/* 1. Tiêu đề H1 với Icon đặt trực tiếp theo Rule 02 */}
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          <Banknote className="w-6 h-6 text-primary shrink-0" />
          <span>{period.name}</span>
          <Badge variant={PAYROLL_PERIOD_STATUS_VARIANTS[period.status]}>
            {PAYROLL_PERIOD_STATUS_LABELS[period.status]}
          </Badge>
        </h1>

        {/* 2. Đường dẫn Breadcrumb chuẩn Rule 02 */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/payroll/periods" className="hover:text-primary transition-colors">
            Bảng lương & Tính lương
          </Link>
          <span>/</span>
          <Link href="/payroll/periods" className="hover:text-primary transition-colors">
            Kỳ tính lương
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{period.code}</span>
        </nav>
      </div>

      {/* 3. Nút Thao tác Đầu trang (Actions) theo Rule 02 */}
      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
        {/* Nút Quay lại danh sách bắt buộc theo Rule 02 mục 4 */}
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link href="/payroll/periods">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            <span>Quay lại danh sách</span>
          </Link>
        </Button>

        {/* Các nút xử lý quy trình phê duyệt & tính lương */}
        {(period.status === "OPEN" || period.status === "CALCULATED") && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={onRecalculateClick}
          >
            <Play className="h-3.5 w-3.5 text-primary" />
            <span>{period.status === "OPEN" ? "Tính lương" : "Tính lại toàn bộ"}</span>
          </Button>
        )}

        {period.status === "CALCULATED" && (
          <Button
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Trình phê duyệt</span>
          </Button>
        )}

        {period.status === "PENDING_APPROVAL" && (
          <Button
            size="sm"
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-xs"
            onClick={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" />
            )}
            <span>Phê duyệt bảng lương</span>
          </Button>
        )}

        {period.status === "APPROVED" && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs border-amber-500/50 text-amber-600 hover:bg-amber-500/10 font-semibold gap-1.5"
            onClick={handleLock}
            disabled={isLocking}
          >
            {isLocking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            <span>Khóa sổ kỳ lương</span>
          </Button>
        )}
      </div>
    </div>
  );
}
