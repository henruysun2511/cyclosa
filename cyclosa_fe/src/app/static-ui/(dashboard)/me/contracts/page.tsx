"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileSignature,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sparkles,
  Paperclip,
  Check,
  History,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyContractsPage() {
  const currentContract = {
    contractNumber: "HĐLĐ-2026-00125",
    title: "Hợp đồng lao động xác định thời hạn (36 tháng)",
    role: "Chuyên viên Cao cấp Phát triển Phần mềm",
    signDate: "07/10/2026",
    effectiveDate: "15/10/2026",
    expiryDate: "14/10/2029",
    salary: 38000000,
    status: "WAITING_MY_SIGN"
  };

  const historyContracts = [
    {
      id: "con_old_01",
      contractNumber: "HĐTV-2023/089",
      title: "Hợp đồng thử việc (02 tháng)",
      effectiveDate: "15/08/2023 - 15/10/2023",
      salary: 28000000,
      status: "COMPLETED"
    },
    {
      id: "con_old_02",
      contractNumber: "HĐLĐ-2023/120",
      title: "Hợp đồng lao động xác định thời hạn (12 tháng)",
      effectiveDate: "15/10/2023 - 14/10/2024",
      salary: 32000000,
      status: "COMPLETED"
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSignature className="h-6 w-6 text-primary" />
              <span>Hợp đồng của tôi</span>
            </h1>
            <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
              Cá nhân
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Xem và ký điện tử các hợp đồng lao động, phụ lục thu nhập và quyết định nhân sự của bạn.
          </p>
        </div>

        <Button asChild size="sm" className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs">
          <Link href="/me/signing">
            <FileSignature className="h-3.5 w-3.5" />
            <span>Đến trang Ký hợp đồng</span>
          </Link>
        </Button>
      </div>

      {/* ── 2. Hợp đồng hiện hành / Chờ ký (Featured Card) ─────── */}
      <Card className="border-red-200 bg-red-50/20 dark:bg-red-950/10 shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-red-100 dark:border-red-900/40 bg-red-50/60 dark:bg-red-950/30 flex flex-row items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
              Văn bản cần xử lý ngay
            </span>
            <CardTitle className="text-base font-bold text-foreground mt-0.5">
              {currentContract.title}
            </CardTitle>
          </div>
          <Badge className="bg-primary text-primary-foreground text-xs font-semibold animate-pulse">
            ● Chờ bạn ký
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-muted-foreground text-[11px] block">Mã hợp đồng:</span>
              <strong className="text-foreground font-mono text-sm">{currentContract.contractNumber}</strong>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px] block">Mức lương cơ bản:</span>
              <strong className="text-primary font-mono text-sm">38.000.000 VNĐ</strong>
            </div>
            <div>
              <span className="text-muted-foreground text-[11px] block">Thời hạn hiệu lực:</span>
              <span className="text-foreground font-mono font-medium">15/10/2026 ➔ 14/10/2029</span>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-semibold text-foreground block">
                Hợp đồng đã được xác thực bởi Đại diện HR (Trần Mai Phương).
              </span>
              <p className="text-[11px] text-muted-foreground">
                Vui lòng kiểm tra lại 6 mục điều khoản và hoàn tất chữ ký điện tử trước ngày 14/10/2026.
              </p>
            </div>

            <Button asChild size="sm" className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0 gap-1.5">
              <Link href="/me/signing">
                <FileSignature className="h-3.5 w-3.5" />
                <span>Ký hợp đồng ngay</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Lịch sử các hợp đồng trước đây ────────────────────── */}
      <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <span>Lịch sử hợp đồng đã hoàn thành ({historyContracts.length})</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-3 text-xs">
          {historyContracts.map((con) => (
            <div
              key={con.id}
              className="p-3.5 rounded-lg border border-border bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <strong className="font-mono text-foreground font-semibold">{con.contractNumber}</strong>
                  <span className="text-foreground font-medium">• {con.title}</span>
                  <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700">
                    Đã thanh lý / Hết hạn
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Thời gian: {con.effectiveDate} &nbsp;|&nbsp; Mức lương: {con.salary.toLocaleString("vi-VN")} VNĐ
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1"
                  onClick={() => toast.info(`Đang tải tệp PDF ${con.contractNumber}...`)}
                >
                  <Download className="h-3 w-3" />
                  <span>Tải PDF</span>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
