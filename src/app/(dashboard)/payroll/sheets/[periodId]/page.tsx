"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  Download,
  Send,
  Lock,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, SensitiveMask, ConfirmReasonDialog } from "@/components/shared";

interface EmployeeSalaryRow {
  id: string;
  employeeCode: string;
  name: string;
  departmentName: string;
  actualWorkDays: number;
  baseSalary: number;
  allowances: number;
  bonus: number;
  insuranceDeduction: number;
  taxDeduction: number;
  netSalary: number;
}

const MOCK_SALARY_SHEET: EmployeeSalaryRow[] = [
  {
    id: "sal_1",
    employeeCode: "EMP001",
    name: "Nguyễn Văn An",
    departmentName: "Ban Giám Đốc",
    actualWorkDays: 22,
    baseSalary: 80000000,
    allowances: 10000000,
    bonus: 20000000,
    insuranceDeduction: 3800000,
    taxDeduction: 18500000,
    netSalary: 87700000,
  },
  {
    id: "sal_2",
    employeeCode: "EMP002",
    name: "Trần Thị Mai",
    departmentName: "Khối Quản Trị Nhân Sự",
    actualWorkDays: 22,
    baseSalary: 45000000,
    allowances: 5000000,
    bonus: 8000000,
    insuranceDeduction: 3800000,
    taxDeduction: 6800000,
    netSalary: 47400000,
  },
  {
    id: "sal_3",
    employeeCode: "EMP003",
    name: "Lê Hoàng Nam",
    departmentName: "Khối Công Nghệ",
    actualWorkDays: 22,
    baseSalary: 55000000,
    allowances: 6000000,
    bonus: 10000000,
    insuranceDeduction: 3800000,
    taxDeduction: 9200000,
    netSalary: 58000000,
  },
  {
    id: "sal_4",
    employeeCode: "EMP004",
    name: "Phạm Minh Tuấn",
    departmentName: "Phòng Phát Triển Frontend",
    actualWorkDays: 22,
    baseSalary: 38000000,
    allowances: 4000000,
    bonus: 6000000,
    insuranceDeduction: 3800000,
    taxDeduction: 4900000,
    netSalary: 39300000,
  },
];

export default function PayrollSheetDetailPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"CALCULATED" | "PENDING_APPROVAL" | "APPROVED" | "LOCKED">("CALCULATED");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const filteredSheet = MOCK_SALARY_SHEET.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      s.departmentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/payroll/dashboard">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại Tổng quan lương
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">PAY-04</Badge>
      </div>

      {/* ── Sheet Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Bảng Tính Lương Chi Tiết — Tháng 09/2026
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Kỳ công chuẩn: <strong>22 ngày</strong> • Dữ liệu bảng công lấy từ kỳ đã khóa: <code>TS-2026-09 (LOCKED)</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="h-9 text-xs">
            <Download className="h-4 w-4 mr-1.5" />
            Xuất bảng lương (Excel)
          </Button>

          {status === "CALCULATED" && (
            <Button
              className="bg-primary hover:bg-primary/90 text-white text-xs h-9"
              onClick={() => setSubmitModalOpen(true)}
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Trình duyệt bảng lương
            </Button>
          )}

          {status === "APPROVED" && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Khóa sổ & Lập lệnh chi trả
            </Button>
          )}
        </div>
      </div>

      {/* ── Payroll Data Table ──────────────────────────────────────── */}
      <Card className="shadow-2xs border-border">
        <CardHeader className="py-4 px-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm nhân viên trong bảng lương..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>

          <div className="text-xs text-muted-foreground">
            Hiển thị <strong>{filteredSheet.length}</strong> nhân sự
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nhân sự</th>
                <th className="py-3 px-4">Phòng ban</th>
                <th className="py-3 px-4 text-center">Công thực tế</th>
                <th className="py-3 px-4 text-right">Lương cơ bản</th>
                <th className="py-3 px-4 text-right">Phụ cấp</th>
                <th className="py-3 px-4 text-right">Thưởng</th>
                <th className="py-3 px-4 text-right">Khấu trừ BHXH</th>
                <th className="py-3 px-4 text-right">Thuế TNCN</th>
                <th className="py-3 px-4 text-right font-bold text-foreground">Thực lĩnh (Net)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSheet.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{row.name}</div>
                    <span className="text-2xs text-muted-foreground font-mono">{row.employeeCode}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{row.departmentName}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    {row.actualWorkDays} / 22
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    <SensitiveMask value={row.baseSalary} maskType="salary" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    <SensitiveMask value={row.allowances} maskType="salary" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-medium">
                    <SensitiveMask value={row.bonus} maskType="salary" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600">
                    -<SensitiveMask value={row.insuranceDeduction} maskType="salary" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-rose-600">
                    -<SensitiveMask value={row.taxDeduction} maskType="salary" />
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700 text-sm">
                    <SensitiveMask value={row.netSalary} maskType="salary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Submit for Approval Reason Dialog */}
      <ConfirmReasonDialog
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        title="Trình phê duyệt Bảng tính lương Kỳ 09/2026"
        description="Sau khi trình duyệt, bảng lương sẽ được chuyển sang trạng thái PENDING_APPROVAL và khóa chỉnh sửa đối với kế toán viên cho đến khi có phản hồi của Giám đốc Tài chính."
        reasonLabel="Ghi chú giải trình (nếu có biến động)"
        reasonPlaceholder="Nhập ghi chú giải trình các khoản chi thưởng hoặc tăng giảm đột biến..."
        confirmText="Xác nhận trình duyệt"
        variant="default"
        requiredReason={false}
        onConfirm={async () => {
          setStatus("PENDING_APPROVAL");
          setSubmitModalOpen(false);
        }}
      />
    </div>
  );
}
