"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Download,
  Eye,
  FileText,
  ShieldCheck,
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  Receipt,
  Loader2,
  TrendingUp,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetMyPayslipsQuery,
  useGetMySalaryAdvancesQuery,
  useRequestMySalaryAdvanceMutation,
  type PayslipDto,
} from "@/features/payroll";
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

export default function EmployeePayrollPage() {
  const { data: payslipData, isLoading: loadingPayslips } = useGetMyPayslipsQuery();
  const { data: advanceData, isLoading: loadingAdvances, refetch: refetchAdvances } = useGetMySalaryAdvancesQuery();
  const [requestAdvance, { isLoading: submittingAdvance }] = useRequestMySalaryAdvanceMutation();

  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [advanceReason, setAdvanceReason] = useState<string>("");

  const payslips = payslipData?.data || [];
  const advances = advanceData?.data || [];
  const latestPayslip = payslips[0];

  const handleCreateAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(advanceAmount.replace(/\D/g, ""));
    if (!amountNum || amountNum <= 0) {
      toast.error("Vui lòng nhập số tiền tạm ứng hợp lệ");
      return;
    }
    if (!advanceReason.trim()) {
      toast.error("Vui lòng nhập lý do đề xuất tạm ứng lương");
      return;
    }

    try {
      await requestAdvance({
        amount: amountNum,
        reason: advanceReason.trim(),
        requestDate: new Date().toISOString().split("T")[0],
      }).unwrap();
      toast.success("Đã gửi đề xuất tạm ứng lương thành công");
      setAdvanceDialogOpen(false);
      setAdvanceAmount("");
      setAdvanceReason("");
      refetchAdvances();
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Không thể gửi yêu cầu tạm ứng";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <Banknote className="w-6 h-6 text-primary shrink-0" />
            <span>Phiếu lương</span>
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
            <span className="text-foreground font-medium">Phiếu lương</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {latestPayslip && (
            <Button asChild size="sm" className="h-9 gap-1.5 text-xs bg-primary text-primary-foreground font-semibold shadow-xs">
              <Link href={`/me/payslips?id=${latestPayslip.id}`}>
                <Receipt className="w-3.5 h-3.5" />
                <span>Xem phiếu lương điện tử</span>
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdvanceDialogOpen(true)}
            className="h-9 gap-1.5 text-xs cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-primary" />
            <span>Đề xuất tạm ứng lương</span>
          </Button>
        </div>
      </div>

      {/* 2. Thẻ tóm tắt thu nhập gần nhất - Chuẩn Rule 03 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Lương thực lĩnh (Net) */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-emerald-500/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-emerald-600 text-white">
              <Banknote className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Lương thực lĩnh (Net)
                </p>
                <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                  {latestPayslip?.payrollPeriodName || "Kỳ gần nhất"}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {loadingPayslips ? (
                  <Skeleton className="h-7 w-28" />
                ) : latestPayslip?.netSalary ? (
                  `${latestPayslip.netSalary.toLocaleString("vi-VN")} ₫`
                ) : (
                  "-- ₫"
                )}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {latestPayslip?.issuedAt
                    ? `Phát hành ${formatDate(latestPayslip.issuedAt)}`
                    : "Chưa có kỳ phát hành"}
                </span>
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 35 Q 25 30, 50 15 T 100 8"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Tổng thu nhập gộp (Gross) */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-primary/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-primary text-white">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Tổng thu nhập gộp (Gross)
                </p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Đã gồm phụ cấp</Badge>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {loadingPayslips ? (
                  <Skeleton className="h-7 w-28" />
                ) : latestPayslip?.grossSalary ? (
                  `${latestPayslip.grossSalary.toLocaleString("vi-VN")} ₫`
                ) : (
                  "-- ₫"
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                {latestPayslip?.totalAllowances
                  ? `Phụ cấp: ${latestPayslip.totalAllowances.toLocaleString("vi-VN")} ₫`
                  : "Chế độ đãi ngộ công ty"}
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 40 Q 30 25, 60 20 T 100 5"
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Khấu trừ bảo hiểm & Thuế */}
        <div className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs bg-card hover:border-blue-500/40 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 bg-blue-600 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Khấu trừ BH & Thuế
                </p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Theo luật</Badge>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                {loadingPayslips ? (
                  <Skeleton className="h-7 w-28" />
                ) : latestPayslip ? (
                  `${((latestPayslip.employeeInsurance || 0) + (latestPayslip.pitTax || 0)).toLocaleString("vi-VN")} ₫`
                ) : (
                  "-- ₫"
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                BHXH/BHYT/BHTN + Thuế TNCN
              </p>
            </div>
          </div>
          <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity hidden sm:block">
            <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
              <path
                d="M0 10 Q 30 18, 60 28 T 100 35"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Danh sách phiếu lương hàng tháng */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Lịch sử phiếu lương (Payslips Ledger)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tra cứu và tải tài liệu bảng phân bổ lương hàng tháng đã được phát hành
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Kỳ tính lương</TableHead>
                  <TableHead className="font-semibold text-xs">Mã kỳ lương</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Tổng thu nhập</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Tổng khấu trừ</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Thực lĩnh (Net)</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPayslips ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : payslips.length > 0 ? (
                  payslips.map((ps: PayslipDto) => {
                    const totalDeductions = (ps.employeeInsurance || 0) + (ps.pitTax || 0) + (ps.salaryAdvance || 0);
                    return (
                      <TableRow key={ps.id}>
                        <TableCell className="font-semibold text-xs text-foreground">
                          {ps.payrollPeriodName || "Kỳ lương"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {ps.payrollPeriodCode || ps.payrollPeriodId}
                        </TableCell>
                        <TableCell className="text-xs text-right font-medium">
                          {ps.grossSalary?.toLocaleString("vi-VN") || 0} đ
                        </TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground">
                          {totalDeductions.toLocaleString("vi-VN")} đ
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {ps.netSalary?.toLocaleString("vi-VN") || 0} đ
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge className="bg-emerald-600 text-white text-[10px]">
                            Đã thanh toán
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button asChild variant="outline" size="sm" className="h-8 gap-1 text-xs">
                              <Link href={`/me/payslips?id=${ps.id}`}>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Chi tiết</span>
                              </Link>
                            </Button>
                            {ps.fileUrl && (
                              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" asChild>
                                <a href={ps.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Tải PDF</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Banknote className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có phiếu lương nào được phát hành</p>
                        <p className="text-xs text-muted-foreground">Phiếu lương sẽ tự động hiển thị sau khi kế toán chốt bảng lương kỳ này</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Lịch sử đề xuất tạm ứng lương */}
      <Card className="rounded-xl border shadow-xs">
        <CardHeader className="p-5 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Lịch sử Đề xuất Tạm ứng lương (Salary Advances)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Theo dõi tình trạng phê duyệt và giải ngân các khoản tạm ứng cá nhân
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setAdvanceDialogOpen(true)}
            className="h-8 gap-1.5 text-xs bg-primary text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo đề xuất</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="font-semibold text-xs">Mã đề xuất</TableHead>
                  <TableHead className="font-semibold text-xs">Ngày yêu cầu</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Số tiền tạm ứng</TableHead>
                  <TableHead className="font-semibold text-xs">Lý do tạm ứng</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingAdvances ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : advances.length > 0 ? (
                  advances.map((adv) => {
                    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
                      PENDING: { label: "Chờ phê duyệt", variant: "outline" },
                      APPROVED: { label: "Đã phê duyệt", variant: "secondary" },
                      REJECTED: { label: "Từ chối", variant: "destructive" },
                      PAID: { label: "Đã giải ngân", variant: "default" },
                      DISBURSED: { label: "Đã giải ngân", variant: "default" },
                    };
                    const badge = statusConfig[adv.status] || { label: adv.status, variant: "outline" as const };
                    return (
                      <TableRow key={adv.id}>
                        <TableCell className="font-semibold text-xs text-foreground font-mono">
                          {adv.id.substring(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(adv.requestedAt || adv.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs text-right font-bold text-foreground">
                          {adv.amount?.toLocaleString("vi-VN")} đ
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {adv.reason || "Tạm ứng chi phí cá nhân"}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge variant={badge.variant} className="text-[10px]">
                            {badge.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-28 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5">
                        <Receipt className="h-7 w-7 text-muted-foreground/40" />
                        <p className="text-sm font-medium">Chưa có đề xuất tạm ứng lương nào</p>
                        <p className="text-xs text-muted-foreground">Bạn có thể gửi đề xuất khi có nhu cầu tài chính khẩn cấp</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Đề xuất Tạm ứng Lương */}
      <Dialog open={advanceDialogOpen} onOpenChange={setAdvanceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreateAdvance}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Đề xuất tạm ứng lương</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Gửi yêu cầu tạm ứng tiền lương kỳ này tới phòng Nhân sự & Kế toán phê duyệt.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-semibold">
                  Số tiền tạm ứng (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  placeholder="Ví dụ: 5,000,000"
                  value={advanceAmount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setAdvanceAmount(raw ? Number(raw).toLocaleString("vi-VN") : "");
                  }}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-xs font-semibold">
                  Lý do tạm ứng <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Nhập lý do chi tiết..."
                  rows={3}
                  value={advanceReason}
                  onChange={(e) => setAdvanceReason(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdvanceDialogOpen(false)}
                disabled={submittingAdvance}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-white"
                disabled={submittingAdvance}
              >
                {submittingAdvance && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                Gửi đề xuất
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
