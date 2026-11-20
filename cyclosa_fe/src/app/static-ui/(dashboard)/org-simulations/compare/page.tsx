"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  Layers,
  TrendingDown,
  TrendingUp,
  GitCompare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared";

export default function OrgSimulationsComparePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── 1. Top Bar & Breadcrumb ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              So sánh Đối chiếu Kịch bản Tái cơ cấu
            </h1>
            <Badge variant="outline" className="font-mono text-xs">SIM-COMPARE</Badge>
          </div>
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
              href="/org-simulations"
              className="hover:text-primary transition-colors"
            >
              Mô phỏng cơ cấu
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">So sánh đối chiếu</span>
          </nav>
        </div>

        <div>
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <Link href="/org-simulations">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại danh sách kịch bản</span>
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Bảng phân tích đối sánh song song giữa Cơ cấu hiện tại (Baseline) và các phương án kịch bản giả lập đề xuất.
      </p>

      {/* ── 2. Comparison Table Card ─────────────────────────────────── */}
      <Card className="shadow-xs border-border bg-card overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Bảng đối chiếu chỉ số cơ cấu & tài chính
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold w-1/4">Chỉ số so sánh</TableHead>
                <TableHead className="text-xs font-semibold w-1/4 bg-muted/60">Cơ cấu Hiện tại (Baseline)</TableHead>
                <TableHead className="text-xs font-semibold w-1/4 bg-primary/5 text-primary">Phương án A (SCN-Q4-TECH)</TableHead>
                <TableHead className="text-xs font-semibold w-1/4 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">Phương án B (SCN-Q4-BIZ)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Trạng thái kịch bản</TableCell>
                <TableCell className="bg-muted/30">
                  <StatusBadge status="ACTIVE" customLabel="Đang áp dụng" />
                </TableCell>
                <TableCell className="bg-primary/5">
                  <StatusBadge status="DRAFT" />
                </TableCell>
                <TableCell className="bg-blue-50/30 dark:bg-blue-950/10">
                  <StatusBadge status="PENDING_APPROVAL" />
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Tổng số phòng ban / đơn vị</TableCell>
                <TableCell className="font-mono text-xs bg-muted/30">12 đơn vị</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-foreground bg-primary/5">14 đơn vị (+2)</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-foreground bg-blue-50/30 dark:bg-blue-950/10">10 đơn vị (-2)</TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Số nhân sự bị điều chuyển</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground bg-muted/30">—</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-primary bg-primary/5">45 nhân sự</TableCell>
                <TableCell className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/10">22 nhân sự</TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Biến động quỹ lương tháng</TableCell>
                <TableCell className="font-mono text-xs bg-muted/30">7,250,000,000 ₫/tháng</TableCell>
                <TableCell className="font-mono text-xs font-bold text-rose-600 bg-primary/5">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> +180,000,000 ₫
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-emerald-600 bg-blue-50/30 dark:bg-blue-950/10">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="h-3.5 w-3.5" /> -45,000,000 ₫
                  </span>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Mục tiêu chiến lược</TableCell>
                <TableCell className="text-xs text-muted-foreground bg-muted/30">Mô hình hiện hành</TableCell>
                <TableCell className="text-xs text-foreground bg-primary/5">Mở rộng mảng AI & Cloud</TableCell>
                <TableCell className="text-xs text-foreground bg-blue-50/30 dark:bg-blue-950/10">Tinh gọn chi phí kinh doanh</TableCell>
              </TableRow>

              <TableRow className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">Thao tác</TableCell>
                <TableCell className="bg-muted/30 text-xs text-muted-foreground">—</TableCell>
                <TableCell className="bg-primary/5">
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <Link href="/org-simulations/sc_01">Mở Sandbox A</Link>
                  </Button>
                </TableCell>
                <TableCell className="bg-blue-50/30 dark:bg-blue-950/10">
                  <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                    <Link href="/org-simulations/sc_02">Mở Sandbox B</Link>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
