"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Receipt,
  Download,
  Calendar,
  Lock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
} from "lucide-react";
import { SensitiveMask } from "@/components/shared";
import { toast } from "sonner";

export default function EmployeePayslipPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-09");

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Phiếu Lương Điện Tử
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link
              href="/me/profile"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Cá nhân (ESS)
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Phiếu lương (PAY-12)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="filter-btn"
          >
            <option value="2026-09">Kỳ lương Tháng 09/2026</option>
            <option value="2026-08">Kỳ lương Tháng 08/2026</option>
            <option value="2026-07">Kỳ lương Tháng 07/2026</option>
          </select>

          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.success("Đang kết xuất phiếu lương bảo mật định dạng PDF có mật khẩu...")}
          >
            <Download className="h-4 w-4" />
            <span>Tải phiếu lương PDF</span>
          </button>
        </div>
      </div>

      {/* ── Electronic Payslip Card ──────────────────────────────────── */}
      <div className="table-card p-6 md:p-8 space-y-6 bg-white border border-border shadow-xs">
        {/* Header Voucher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                TẬP ĐOÀN CÔNG NGHỆ CYCLOSA FSI
              </p>
            </div>
            <h2 className="text-xl font-black text-foreground">
              PHIẾU THANH TOÁN LƯƠNG & THU NHẬP
            </h2>
            <p className="text-xs font-mono text-muted-foreground">
              Kỳ chi trả: Tháng 09/2026 (01/09/2026 — 30/09/2026)
            </p>
          </div>

          <div className="text-right">
            <span className="badge badge-active">Đã giải ngân chuyển khoản</span>
            <p className="text-[11px] text-muted-foreground mt-1">Ngày CK: 05/10/2026</p>
          </div>
        </div>

        {/* Employee Info Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 text-xs">
          <div>
            <span className="text-muted-foreground block">Họ và tên:</span>
            <span className="font-bold text-foreground mt-0.5 block">Nguyễn Văn An</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Mã nhân viên:</span>
            <span className="font-mono font-bold text-primary mt-0.5 block">EMP001</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Chức danh:</span>
            <span className="font-medium text-foreground mt-0.5 block">Tổng Giám Đốc (CEO)</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Ngày công thực tế:</span>
            <span className="font-mono font-bold text-foreground mt-0.5 block">22 / 22 ngày</span>
          </div>
        </div>

        {/* Breakdown: Earnings vs Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center justify-between">
              <span>I. CÁC KHOẢN THU NHẬP (EARNINGS)</span>
              <span className="text-xs font-bold text-accent">+</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">1. Lương cơ bản hợp đồng:</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="70,000,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">2. Phụ cấp trách nhiệm & quản lý:</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="10,000,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">3. Phụ cấp ăn trưa & điện thoại:</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="2,500,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">4. Thưởng hiệu quả KPI tháng:</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="5,000,000 ₫" />
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-2 font-bold text-xs text-foreground">
              <span>Tổng thu nhập Gross:</span>
              <span className="text-primary font-mono">
                <SensitiveMask value="87,500,000 ₫" />
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border flex items-center justify-between">
              <span>II. CÁC KHOẢN KHẤU TRỪ (DEDUCTIONS)</span>
              <span className="text-xs font-bold text-destructive">-</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">1. BHXH (8% trần lương cơ sở):</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="2,960,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">2. BHYT (1.5% trần):</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="555,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">3. BHTN (1% trần vùng 1):</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="496,000 ₫" />
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-muted-foreground">4. Thuế Thu Nhập Cá Nhân (TNCN):</span>
                <span className="font-semibold text-foreground">
                  <SensitiveMask value="12,189,000 ₫" />
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-2 font-bold text-xs text-foreground">
              <span>Tổng giảm trừ:</span>
              <span className="text-destructive font-mono">
                <SensitiveMask value="16,200,000 ₫" />
              </span>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Box */}
        <div className="rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-red-100">
              THỰC LĨNH CHUYỂN KHOẢN (NET TAKE-HOME)
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight">
              <SensitiveMask value="71,300,000 ₫" />
            </h3>
            <p className="text-xs text-red-200 mt-1">
              Bằng chữ: Bảy mươi mốt triệu ba trăm nghìn đồng chẵn.
            </p>
          </div>

          <div className="text-xs text-right text-red-100 space-y-1">
            <p>Tài khoản nhận: Vietcombank - CN Ba Đình</p>
            <p className="font-mono font-bold text-white">0011 0042 9988</p>
          </div>
        </div>
      </div>
    </div>
  );
}
