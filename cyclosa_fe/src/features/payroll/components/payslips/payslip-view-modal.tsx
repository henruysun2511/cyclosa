"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetPayslipDetailQuery } from "../../api/payroll-api";
import { Loader2, FileText, Printer, Building2, User } from "lucide-react";

interface PayslipViewModalProps {
  payslipId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayslipViewModal({
  payslipId,
  open,
  onOpenChange,
}: PayslipViewModalProps) {
  const { data, isLoading } = useGetPayslipDetailQuery(payslipId || "", {
    skip: !payslipId || !open,
  });

  const payslip = data?.data;
  const lines = payslip?.lines || [];

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Phiếu lương điện tử cá nhân
          </DialogTitle>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            In phiếu lương
          </Button>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !payslip ? (
          <div className="py-10 text-center text-muted-foreground">
            Không tìm thấy thông tin phiếu lương.
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Header branding */}
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold uppercase tracking-wider text-primary">CÔNG TY CỔ PHẦN CYCLOSA</h2>
              <p className="text-sm font-semibold">{payslip.payrollPeriodName}</p>
              <p className="text-xs text-muted-foreground">
                Chu kỳ: {payslip.startDate} đến {payslip.endDate}
              </p>
            </div>

            {/* Employee Information */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border bg-muted/20 text-xs">
              <div>
                <span className="text-muted-foreground">Họ và tên: </span>
                <span className="font-semibold text-foreground">{payslip.employeeName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mã nhân viên: </span>
                <span className="font-semibold text-foreground">{payslip.employeeCode}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Phòng ban: </span>
                <span className="font-medium text-foreground">{payslip.departmentName || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Chức vụ: </span>
                <span className="font-medium text-foreground">{payslip.positionName || "—"}</span>
              </div>
            </div>

            {/* Income & Deductions Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Chi tiết thu nhập & các khoản khấu trừ
              </h4>

              <div className="border rounded-lg divide-y text-xs">
                {lines.map((l) => (
                  <div key={l.id} className="p-2.5 flex items-center justify-between">
                    <span className="font-medium text-foreground">{l.title}</span>
                    <span className="font-semibold">{formatCurrency(l.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Highlights */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tổng thu nhập Gross:</span>
                <span className="font-semibold text-foreground">{formatCurrency(payslip.grossSalary)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Bảo hiểm NLĐ đóng (10.5%):</span>
                <span className="font-semibold text-foreground">-{formatCurrency(payslip.employeeInsurance)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Thuế thu nhập cá nhân (TNCN):</span>
                <span className="font-semibold text-foreground">-{formatCurrency(payslip.pitTax)}</span>
              </div>
              {payslip.salaryAdvance && payslip.salaryAdvance > 0 ? (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Khấu trừ tạm ứng lương:</span>
                  <span className="font-semibold text-foreground">-{formatCurrency(payslip.salaryAdvance)}</span>
                </div>
              ) : null}

              <Separator className="my-2" />

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-sm text-foreground">THỰC LĨNH CHUYỂN KHOẢN (NET):</span>
                <span className="font-extrabold text-xl text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(payslip.netSalary)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-center text-muted-foreground italic">
              Phiếu lương được phát hành tự động qua Hệ thống Cyclosa HRM. Mọi thắc mắc vui lòng liên hệ phòng Nhân sự.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

