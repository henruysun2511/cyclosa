"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useGetPayrollRecordDetailQuery } from "../../api/payroll-api";
import { Loader2, Calculator, Building2, CreditCard } from "lucide-react";

interface PayrollRecordDrawerProps {
  recordId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayrollRecordDrawer({
  recordId,
  open,
  onOpenChange,
}: PayrollRecordDrawerProps) {
  const { data, isLoading } = useGetPayrollRecordDetailQuery(recordId || "", {
    skip: !recordId || !open,
  });

  const detail = data?.data;
  const record = detail?.record;
  const lines = detail?.lines || [];

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Truy vết & Giải trình tính lương
          </DialogTitle>
          <DialogDescription>
            Bóc tách từng dòng thu nhập, bảo hiểm, thuế TNCN và phụ cấp theo quy định pháp luật.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !record ? (
          <div className="py-10 text-center text-muted-foreground">
            Không tìm thấy thông tin bản ghi lương.
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Employee Info Card */}
            <div className="p-3.5 rounded-lg border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-foreground">{record.employeeName}</span>
                <Badge variant="outline">{record.employeeCode}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{record.departmentName || "Chưa phân phòng ban"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>{record.bankName || "Vietcombank"} - {record.bankAccount || "1903xxx"}</span>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Lương thực lĩnh (Net)</p>
                <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(record.netSalary)}
                </p>
              </div>
              <div className="text-right text-xs space-y-0.5 text-muted-foreground">
                <p>Tổng Gross: <span className="font-semibold text-foreground">{formatCurrency(record.grossSalary)}</span></p>
                <p>Chi phí DN: <span className="font-semibold text-foreground">{formatCurrency(record.totalEmployerCost)}</span></p>
              </div>
            </div>

            {/* Detailed Record Lines */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-tight">Chi tiết các khoản mục tính lương:</h4>
              <div className="divide-y rounded-md border bg-card">
                {lines.map((l) => (
                  <div key={l.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{l.title}</span>
                        {l.source === "MANUAL_ADJUSTMENT" && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            Điều chỉnh
                          </Badge>
                        )}
                      </div>
                      {l.adjustmentReason && (
                        <p className="text-[11px] text-amber-600 dark:text-amber-400">
                          Lý do: {l.adjustmentReason}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-sm">
                      {formatCurrency(l.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
