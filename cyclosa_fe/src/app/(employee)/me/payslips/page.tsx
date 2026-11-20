"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Banknote,
  Download,
  Printer,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SensitiveMask } from "@/components/shared";
import { useGetMyPayslipsQuery, useGetMyPayslipDetailQuery } from "@/features/payroll";
import { useGetMyProfileQuery } from "@/features/employee";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { env } from "@/config/env";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Helper chuyển đổi số tiền sang chữ tiếng Việt chuẩn xác
function numberToVietnameseWords(n: number): string {
  if (!n || isNaN(n) || n <= 0) return "Không đồng.";

  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  const readThreeDigits = (num: number, hasHigher: boolean): string => {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;
    let res = "";

    if (hundreds > 0 || hasHigher) {
      res += digits[hundreds] + " trăm ";
    }

    if (tens > 1) {
      res += digits[tens] + " mươi ";
      if (ones === 1) res += "mốt ";
      else if (ones === 5) res += "lăm ";
      else if (ones > 0) res += digits[ones] + " ";
    } else if (tens === 1) {
      res += "mười ";
      if (ones === 5) res += "lăm ";
      else if (ones > 0) res += digits[ones] + " ";
    } else {
      if (hasHigher && ones > 0) res += "lẻ ";
      if (ones > 0) res += digits[ones] + " ";
    }

    return res.trim();
  };

  let integerPart = Math.floor(n);
  const groups: number[] = [];
  while (integerPart > 0) {
    groups.push(integerPart % 1000);
    integerPart = Math.floor(integerPart / 1000);
  }

  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g > 0) {
      const text = readThreeDigits(g, i < groups.length - 1);
      result += text + " " + units[i] + " ";
    }
  }

  result = result.trim();
  if (!result) return "Không đồng chẵn.";
  return result.charAt(0).toUpperCase() + result.slice(1) + " đồng chẵn.";
}

function EmployeePayslipContent() {
  const searchParams = useSearchParams();
  const paramId = searchParams.get("id");

  // Nạp danh sách phiếu lương cá nhân từ API
  const { data: payslipListData, isLoading: isListLoading } = useGetMyPayslipsQuery();
  const { data: myProfile } = useGetMyProfileQuery();
  const { data: meRes } = useGetMeQuery();

  const payslips = payslipListData?.data || [];

  // Mặc định chọn phiếu lương theo id param hoặc phiếu lương mới nhất
  const [selectedId, setSelectedId] = useState<string>("");

  const activeId = selectedId || paramId || payslips[0]?.id || "";

  // Nạp chi tiết phiếu lương đang chọn từ API
  const { data: payslipDetailData } = useGetMyPayslipDetailQuery(activeId, {
    skip: !activeId,
  });

  const payslip = payslipDetailData?.data || payslips.find((p) => p.id === activeId) || payslips[0];

  const employeeName =
    payslip?.employeeName ||
    myProfile?.fullName ||
    meRes?.data?.username ||
    "---";

  const employeeCode = payslip?.employeeCode || myProfile?.employeeCode || "---";
  const positionName = payslip?.positionName || myProfile?.currentJobTitleName || "Chưa cập nhật";
  const departmentName = payslip?.departmentName || myProfile?.currentDepartmentName || "Chưa cập nhật";

  const bankName = myProfile?.bankAccount?.bankName;
  const bankBranch = myProfile?.bankAccount?.bankBranchName;
  const accountNumber = myProfile?.bankAccount?.accountNumber;

  const grossSalary = payslip?.grossSalary ?? 0;
  const netSalary = payslip?.netSalary ?? 0;
  const employeeInsurance = payslip?.employeeInsurance ?? 0;
  const pitTax = payslip?.pitTax ?? 0;
  const salaryAdvance = payslip?.salaryAdvance ?? 0;

  // Lọc chi tiết các dòng thu nhập / giảm trừ từ hệ thống (PayrollRecordLine)
  const lines = payslip?.lines || [];

  // Thu nhập: BASE_SALARY, ALLOWANCE, OVERTIME, BONUS, REIMBURSEMENT
  const earningLines = lines.filter(
    (l) =>
      l.lineType === "BASE_SALARY" ||
      l.lineType === "ALLOWANCE" ||
      l.lineType === "OVERTIME" ||
      l.lineType === "BONUS" ||
      l.lineType === "REIMBURSEMENT"
  );

  // Giảm trừ: INSURANCE_EMPLOYEE, PERSONAL_INCOME_TAX, ADVANCE_RECOVERY, DEDUCTION
  const deductionLines = lines.filter(
    (l) =>
      l.lineType === "INSURANCE_EMPLOYEE" ||
      l.lineType === "PERSONAL_INCOME_TAX" ||
      l.lineType === "ADVANCE_RECOVERY" ||
      l.lineType === "DEDUCTION"
  );

  // Chi phí bảo hiểm do doanh nghiệp đóng (tham chiếu nếu có)
  const employerLines = lines.filter((l) => l.lineType === "INSURANCE_EMPLOYER");

  const totalDeductions = deductionLines.length > 0
    ? deductionLines.reduce((acc, cur) => acc + (cur.amount || 0), 0)
    : employeeInsurance + pitTax + salaryAdvance;

  // Xử lý tải PDF
  const handleDownloadPdf = () => {
    if (payslip?.fileUrl) {
      window.open(payslip.fileUrl, "_blank");
    } else {
      toast.info(`Phiếu lương ${payslip?.payrollPeriodName || ""} đang được kết xuất bản in PDF...`);
      window.print();
    }
  };

  if (isListLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang tải phiếu lương điện tử...</p>
      </div>
    );
  }

  if (payslips.length === 0) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Chưa có phiếu lương</h2>
        <p className="text-xs text-muted-foreground">
          Hiện tại tài khoản của bạn chưa có bảng phân bổ phiếu lương nào được phát hành.
        </p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href="/me">Quay lại Cổng nhân viên</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* ── 1. Page Header & Điều hướng chuẩn Rule 02 ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Banknote className="w-6 h-6 text-primary shrink-0" />
            <span>Phiếu lương điện tử</span>
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
            <Link href="/me/payroll" className="hover:text-primary transition-colors">
              Lịch sử lương
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Chi tiết phiếu lương</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Dropdown chọn kỳ lương thực tế */}
          <select
            value={activeId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-9 px-3 text-xs rounded-xl border border-border bg-card text-foreground font-medium shadow-xs focus:outline-hidden"
          >
            {payslips.map((p) => (
              <option key={p.id} value={p.id}>
                {p.payrollPeriodName || `Kỳ lương ${p.payrollPeriodCode || p.id.slice(0, 8)}`}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="h-9 gap-1.5 text-xs rounded-xl cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>In phiếu</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadPdf}
            className="h-9 gap-1.5 text-xs rounded-xl bg-primary text-primary-foreground font-semibold shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Tải PDF</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Electronic Payslip Voucher Card ── */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-xs space-y-6">
        {/* Header Voucher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {env.APP_NAME || "HỆ THỐNG DOANH NGHIỆP"}
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              PHIẾU THANH TOÁN LƯƠNG & THU NHẬP
            </h2>
            <p className="text-xs font-mono text-muted-foreground">
              Kỳ chi trả: {payslip?.payrollPeriodName || payslip?.payrollPeriodCode || "---"}{" "}
              {payslip?.startDate && payslip?.endDate ? `(${payslip.startDate} — ${payslip.endDate})` : ""}
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-xs px-3 py-1 font-semibold">
              ● {payslip?.issuedAt ? "Đã phát hành" : "Đang xử lý"}
            </Badge>
            <p className="text-[11px] text-muted-foreground font-mono">
              Ngày phát hành: {payslip?.issuedAt ? new Date(payslip.issuedAt).toLocaleDateString("vi-VN") : "---"}
            </p>
          </div>
        </div>

        {/* Employee Info Header (4 Cột chuẩn từ hệ thống) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border/60 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Họ và tên:</span>
            <strong className="text-foreground text-sm font-bold block mt-0.5 truncate">
              {employeeName}
            </strong>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Mã nhân viên:</span>
            <span className="font-mono font-bold text-primary text-sm block mt-0.5">
              {employeeCode}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Chức danh:</span>
            <span className="font-semibold text-foreground text-xs block mt-0.5 truncate">
              {positionName}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Đơn vị công tác:</span>
            <span className="font-medium text-foreground text-xs block mt-0.5 truncate">
              {departmentName}
            </span>
          </div>
        </div>

        {/* Breakdown: Earnings vs Deductions (2 Cột từ dữ liệu thật) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* CỘT I: CÁC KHOẢN THU NHẬP (EARNINGS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <span>I. CÁC KHOẢN THU NHẬP (EARNINGS)</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                +
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {earningLines.length > 0 ? (
                earningLines.map((line, idx) => (
                  <div
                    key={line.id || idx}
                    className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80"
                  >
                    <span className="text-muted-foreground">
                      {idx + 1}. {line.title}
                      {line.quantity && line.quantity > 0 ? (
                        <span className="text-[11px] text-muted-foreground/80 font-normal">
                          {" "}({line.quantity} công/giờ)
                        </span>
                      ) : null}
                      :
                    </span>
                    <SensitiveMask value={line.amount} maskType="salary" className="font-semibold text-foreground" />
                  </div>
                ))
              ) : (
                /* Nếu chưa có chi tiết dòng, hiển thị các trường tổng hợp thực tế */
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80">
                    <span className="text-muted-foreground">Tổng thu nhập chịu thuế & bảo hiểm:</span>
                    <SensitiveMask
                      value={grossSalary}
                      maskType="salary"
                      className="font-semibold text-foreground"
                    />
                  </div>
                  {payslip?.totalAllowances && payslip.totalAllowances > 0 ? (
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80">
                      <span className="text-muted-foreground">Tổng phụ cấp:</span>
                      <SensitiveMask
                        value={payslip.totalAllowances}
                        maskType="salary"
                        className="font-semibold text-foreground"
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 font-bold text-xs border-t border-border">
              <span className="text-foreground">Tổng thu nhập Gross:</span>
              <SensitiveMask
                value={grossSalary}
                maskType="salary"
                className="text-primary font-mono text-base font-bold"
              />
            </div>
          </div>

          {/* CỘT II: CÁC KHOẢN KHẤU TRỪ (DEDUCTIONS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs sm:text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <span>II. CÁC KHOẢN KHẤU TRỪ (DEDUCTIONS)</span>
              </h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                -
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {deductionLines.length > 0 ? (
                deductionLines.map((line, idx) => (
                  <div
                    key={line.id || idx}
                    className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80"
                  >
                    <span className="text-muted-foreground">{idx + 1}. {line.title}:</span>
                    <SensitiveMask value={line.amount} maskType="salary" className="font-semibold text-foreground" />
                  </div>
                ))
              ) : (
                /* Nếu chưa có chi tiết dòng, hiển thị các trường khấu trừ thực tế từ hệ thống */
                <div className="space-y-2">
                  {employeeInsurance > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80">
                      <span className="text-muted-foreground">1. Bảo hiểm bắt buộc NLĐ đóng:</span>
                      <SensitiveMask value={employeeInsurance} maskType="salary" className="font-semibold text-foreground" />
                    </div>
                  )}
                  {pitTax > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80">
                      <span className="text-muted-foreground">2. Thuế Thu Nhập Cá Nhân (TNCN):</span>
                      <SensitiveMask value={pitTax} maskType="salary" className="font-semibold text-foreground" />
                    </div>
                  )}
                  {salaryAdvance > 0 && (
                    <div className="flex justify-between items-center py-1.5 border-b border-dashed border-border/80">
                      <span className="text-muted-foreground">3. Khấu trừ tạm ứng lương trong kỳ:</span>
                      <SensitiveMask value={salaryAdvance} maskType="salary" className="font-semibold text-foreground" />
                    </div>
                  )}
                  {employeeInsurance === 0 && pitTax === 0 && salaryAdvance === 0 && (
                    <p className="text-xs text-muted-foreground py-2 italic">Không có khoản khấu trừ trong kỳ.</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 font-bold text-xs border-t border-border">
              <span className="text-foreground">Tổng giảm trừ:</span>
              <SensitiveMask
                value={totalDeductions}
                maskType="salary"
                className="text-rose-600 font-mono text-base font-bold"
              />
            </div>
          </div>
        </div>

        {/* Phần mở rộng: Bảo hiểm do doanh nghiệp đóng (nếu hệ thống trả về) */}
        {employerLines.length > 0 && (
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
              Khoản đóng góp của Doanh nghiệp (Chi phí tham khảo, không khấu trừ vào lương Net):
            </p>
            {employerLines.map((el, i) => (
              <div key={el.id || i} className="flex justify-between items-center">
                <span>{el.title}:</span>
                <SensitiveMask value={el.amount} maskType="salary" className="font-medium text-foreground" />
              </div>
            ))}
          </div>
        )}

        {/* ── 3. Net Salary Highlight Box ── */}
        <div className="rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-100">
              THỰC LĨNH CHUYỂN KHOẢN (NET TAKE-HOME)
            </p>
            <div className="flex items-center gap-2">
              <SensitiveMask
                value={netSalary}
                maskType="salary"
                className="text-3xl sm:text-4xl font-black text-white"
              />
            </div>
            <p className="text-xs text-red-200 pt-0.5">
              Bằng chữ: <em>{numberToVietnameseWords(netSalary)}</em>
            </p>
          </div>

          <div className="text-xs sm:text-right text-red-100 space-y-1 sm:border-l sm:border-red-500/50 sm:pl-6 shrink-0">
            {accountNumber ? (
              <>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    Tài khoản nhận: {bankName || "Ngân hàng"} {bankBranch ? `— ${bankBranch}` : ""}
                  </span>
                </p>
                <div className="font-mono font-bold text-white text-base">
                  <SensitiveMask value={accountNumber} maskType="bank_account" className="text-white" />
                </div>
              </>
            ) : (
              <p className="flex items-center sm:justify-end gap-1.5 italic text-red-200">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Chưa đăng ký tài khoản ngân hàng nhận lương</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployeePayslipPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted-foreground">Đang tải phiếu lương...</div>}>
      <EmployeePayslipContent />
    </Suspense>
  );
}
