"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  ArrowLeft,
  FileCheck,
  TrendingUp,
  Users,
  Building2,
  Send,
  CheckCircle2,
  Coins,
  ShieldCheck,
  Clock,
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
import { ConfirmReasonDialog, StatusBadge } from "@/components/shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrgSimulationImpactPage() {
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [status, setStatus] = useState<"DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "APPLIED">("DRAFT");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* ── 1. Top Bar & Breadcrumb ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Phân tích Tác động & Trình phê duyệt
            </h1>
            <StatusBadge status={status} />
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
            <Link
              href="/org-simulations/sc_01"
              className="hover:text-primary transition-colors font-mono"
            >
              SCN-2026-Q4-TECH
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tác động & Phê duyệt</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
            <Link href="/org-simulations/sc_01">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span>Quay lại Sandbox Editor</span>
            </Link>
          </Button>

          {status === "DRAFT" && (
            <Button
              className="bg-primary hover:bg-primary/90 text-white text-xs h-8"
              onClick={() => setSubmitModalOpen(true)}
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              <span>Trình phê duyệt phương án</span>
            </Button>
          )}

          {status === "APPROVED" && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
              onClick={() => setApplyModalOpen(true)}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Áp dụng vào cơ cấu thật</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── 2. High-level Metrics Snapshot ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-800">
                <span>Nhân sự chịu ảnh hưởng</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Tổng nhân sự bị ảnh hưởng
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  45 <span className="text-xs font-normal text-muted-foreground">nhân sự</span>
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="imp-spark-1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,35 Q25,32 50,18 T100,6 L100,45 L0,45 Z" fill="url(#imp-spark-1)" />
                    <path d="M0,35 Q25,32 50,18 T100,6" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                2 điều chuyển, 43 đổi đơn vị cha
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/40 dark:border-rose-800">
                <span>+5.2% quỹ lương</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Biến động quỹ lương / tháng
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-rose-600">
                  +180,000,000 ₫
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="imp-spark-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,38 Q30,36 65,22 T100,8 L100,45 L0,45 Z" fill="url(#imp-spark-2)" />
                    <path d="M0,38 Q30,36 65,22 T100,8" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Tăng ngân sách khối chuyên môn R&D
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800">
                <span>Cần cập nhật</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Quy trình duyệt bị ảnh hưởng
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  6 <span className="text-xs font-normal text-muted-foreground">quy trình</span>
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="imp-spark-3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,24 Q30,38 65,20 T100,28 L100,45 L0,45 Z" fill="url(#imp-spark-3)" />
                    <path d="M0,24 Q30,38 65,20 T100,28" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Cập nhật thẩm quyền người phê duyệt
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Cost Center Impact Breakdown ─────────────────────────── */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">
              Tác động phân bổ Ngân sách theo Trung tâm Chi phí
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Trung tâm chi phí</TableHead>
                <TableHead className="text-xs font-semibold">Ngân sách hiện tại</TableHead>
                <TableHead className="text-xs font-semibold">Sau khi tái cơ cấu</TableHead>
                <TableHead className="text-xs font-semibold text-right">Chênh lệch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">
                  CC_TECH_RND (Khối Công Nghệ)
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  2,100,000,000 ₫/tháng
                </TableCell>
                <TableCell className="font-mono text-xs font-medium text-foreground">
                  2,280,000,000 ₫/tháng
                </TableCell>
                <TableCell className="text-right font-mono text-xs font-bold text-rose-600">
                  +180,000,000 ₫
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold text-foreground text-xs">
                  CC_HR_OPS (Vận Hành Nhân Sự)
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  680,000,000 ₫/tháng
                </TableCell>
                <TableCell className="font-mono text-xs font-medium text-foreground">
                  680,000,000 ₫/tháng
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground">
                  0 ₫
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ── 4. Workflow & Permissions Check ─────────────────────────── */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <CardTitle className="text-sm font-semibold">
              Kiểm tra tính toàn vẹn hệ thống & Quyền hạn
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Không phát hiện phòng ban nào bị mồ côi (mọi đơn vị đều có đơn vị cha hợp lệ).</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Tất cả 45 nhân sự đều đã được chỉ định chức vụ và quản lý trực tiếp mới.</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Không có xung đột chu kỳ đánh giá hiệu suất đang chạy.</span>
          </div>
        </CardContent>
      </Card>

      {/* ── 5. Dialogs ──────────────────────────────────────────────── */}
      {/* Submit Confirmation Dialog */}
      <ConfirmReasonDialog
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        title="Trình phê duyệt kịch bản tái cơ cấu"
        description="Kịch bản sẽ được gửi tới Ban Tổng Giám Đốc và Hội đồng Quản trị phê duyệt trước khi áp dụng."
        reasonLabel="Ghi chú trình bày tóm tắt"
        reasonPlaceholder="Nhập lý do và các điểm nổi bật cần phê duyệt..."
        confirmText="Gửi trình duyệt"
        variant="default"
        requiredReason={false}
        onConfirm={async () => {
          setStatus("PENDING_APPROVAL");
          toast.success("Đã gửi trình phê duyệt kịch bản thành công!");
          setSubmitModalOpen(false);
        }}
      />

      {/* Apply to Live Org Dialog */}
      <ConfirmReasonDialog
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        title="Áp dụng phương án vào Cơ cấu Doanh nghiệp thật"
        description="CẢNH BÁO: Hành động này sẽ thay đổi chính thức cây sơ đồ tổ chức, chuỗi báo cáo quản lý và chuyển đổi dữ liệu nhân sự trên toàn hệ thống."
        reasonLabel="Số nghị quyết HĐQT / Quyết định ban hành"
        reasonPlaceholder="Nhập số nghị quyết phê duyệt..."
        confirmText="Xác nhận áp dụng thực tế"
        variant="destructive"
        onConfirm={async () => {
          setStatus("APPLIED");
          toast.success("Đã áp dụng phương án vào Cơ cấu Doanh nghiệp chính thức!");
          setApplyModalOpen(false);
        }}
      />
    </div>
  );
}
