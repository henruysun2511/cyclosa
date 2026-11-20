"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  GitFork,
  Plus,
  Search,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileCheck,
  GitCompare,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrgScenario {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "APPLIED" | "CANCELLED";
  targetEffectiveDate: string;
  totalDepartments: number;
  totalEmployeesImpacted: number;
  costImpactMonthly: string;
  costImpactType: "INCREASE" | "DECREASE" | "NEUTRAL";
  createdAt: string;
  createdBy: string;
}

const INITIAL_SCENARIOS: OrgScenario[] = [
  {
    id: "sc_01",
    code: "SCN-2026-Q4-TECH",
    name: "Tái cấu trúc Khối Công nghệ & Thành lập Trung tâm AI",
    description: "Tách Trung tâm Nghiên cứu AI thành Đơn vị độc lập trực thuộc Tổng Giám Đốc, bổ sung 15 nhân sự chuyên gia.",
    status: "DRAFT",
    targetEffectiveDate: "01/11/2026",
    totalDepartments: 8,
    totalEmployeesImpacted: 45,
    costImpactMonthly: "+180,000,000 ₫",
    costImpactType: "INCREASE",
    createdAt: "02/10/2026",
    createdBy: "Lê Hoàng Nam (CTO)",
  },
  {
    id: "sc_02",
    code: "SCN-2026-Q4-MERGE-BIZ",
    name: "Sáp nhập Ban Phát Triển Thị Trường vào Khối Kinh Doanh",
    description: "Tinh gọn bộ máy quản lý trung gian, giảm 2 chức danh Trưởng phòng, tối ưu hóa ngân sách vận hành chi nhánh.",
    status: "PENDING_APPROVAL",
    targetEffectiveDate: "01/12/2026",
    totalDepartments: 5,
    totalEmployeesImpacted: 28,
    costImpactMonthly: "-65,000,000 ₫",
    costImpactType: "DECREASE",
    createdAt: "28/09/2026",
    createdBy: "Trần Thị Mai (HRD)",
  },
  {
    id: "sc_03",
    code: "SCN-2026-Q3-BRANCH-DN",
    name: "Thành lập Chi Nhánh Công Nghệ Đà Nẵng",
    description: "Mở rộng trung tâm phát triển phần mềm khu vực Miền Trung tại Tòa nhà FPT Complex.",
    status: "APPLIED",
    targetEffectiveDate: "01/09/2026",
    totalDepartments: 3,
    totalEmployeesImpacted: 35,
    costImpactMonthly: "+320,000,000 ₫",
    costImpactType: "INCREASE",
    createdAt: "15/08/2026",
    createdBy: "Nguyễn Văn An (CEO)",
  },
];

export default function OrgSimulationsListPage() {
  const [scenarios] = useState<OrgScenario[]>(INITIAL_SCENARIOS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState("");
  const [newScenarioDesc, setNewScenarioDesc] = useState("");

  const filteredScenarios = scenarios.filter((sc) => {
    const matchesSearch =
      sc.name.toLowerCase().includes(search.toLowerCase()) ||
      sc.code.toLowerCase().includes(search.toLowerCase()) ||
      sc.createdBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const draftCount = scenarios.filter((s) => s.status === "DRAFT").length;
  const pendingCount = scenarios.filter((s) => s.status === "PENDING_APPROVAL").length;
  const appliedCount = scenarios.filter((s) => s.status === "APPLIED" || s.status === "APPROVED").length;

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Mô phỏng Cơ cấu Tổ chức
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
            <span className="hover:text-primary cursor-pointer transition-colors">
              Cơ cấu tổ chức
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Mô phỏng cơ cấu</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs">
            <Link href="/org-simulations/compare">
              <GitCompare className="h-3.5 w-3.5 mr-1.5" />
              <span>So sánh kịch bản</span>
            </Link>
          </Button>

          <Button
            size="sm"
            className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            <span>Tạo kịch bản mới</span>
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số kịch bản */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <GitFork className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
                <span>Toàn hệ thống</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Tổng số kịch bản
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {scenarios.length}
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="sim-spark-1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DC2626" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,35 Q25,32 50,18 T100,6 L100,45 L0,45 Z" fill="url(#sim-spark-1)" />
                    <path d="M0,35 Q25,32 50,18 T100,6" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Kịch bản sandbox đang lưu
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Bản nháp */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-slate-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Layers className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-slate-700 bg-slate-50 border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
                <span>Đang biên tập</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Bản nháp (Draft)
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {draftCount}
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="sim-spark-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#475569" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,32 Q30,28 65,20 T100,12 L100,45 L0,45 Z" fill="url(#sim-spark-2)" />
                    <path d="M0,32 Q30,28 65,20 T100,12" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Chưa trình ban lãnh đạo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Chờ phê duyệt */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800">
                <span>Cần xem xét</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Chờ phê duyệt
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {pendingCount}
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="sim-spark-3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D97706" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,24 Q30,38 65,20 T100,28 L100,45 L0,45 Z" fill="url(#sim-spark-3)" />
                    <path d="M0,24 Q30,38 65,20 T100,28" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Đang chờ BOD thông qua
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Đã áp dụng */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800">
                <span>Hiệu lực</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
                Đã áp dụng / Ban hành
              </p>
              <div className="flex items-end justify-between gap-2">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {appliedCount}
                </div>
                <div className="h-7 w-14 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="sim-spark-4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,38 Q30,36 65,22 T100,8 L100,45 L0,45 Z" fill="url(#sim-spark-4)" />
                    <path d="M0,38 Q30,36 65,22 T100,8" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 truncate">
                Đã chuyển thành cơ cấu chính thức
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Table Card ──────────────────────────────────────────────── */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">
              Danh sách kịch bản mô phỏng ({filteredScenarios.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Quản lý các phương án tái cấu trúc phòng ban và phân tích ngân sách nhân sự
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PENDING_APPROVAL">Chờ phê duyệt</option>
              <option value="APPROVED">Đã phê duyệt</option>
              <option value="APPLIED">Đã ban hành</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kịch bản, mã, người tạo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Mã kịch bản</TableHead>
                <TableHead className="text-xs font-semibold">Tên kịch bản mô phỏng</TableHead>
                <TableHead className="text-xs font-semibold">Người khởi tạo</TableHead>
                <TableHead className="text-xs font-semibold text-center">Số NV ảnh hưởng</TableHead>
                <TableHead className="text-xs font-semibold">Tác động quỹ lương tháng</TableHead>
                <TableHead className="text-xs font-semibold">Ngày áp dụng</TableHead>
                <TableHead className="text-xs font-semibold text-center">Trạng thái</TableHead>
                <TableHead className="text-xs font-semibold text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {filteredScenarios.map((sc) => (
                <TableRow key={sc.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {sc.code}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/org-simulations/${sc.id}`}
                      className="font-medium text-foreground text-sm hover:text-primary transition-colors block"
                    >
                      {sc.name}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-md mt-0.5">
                      {sc.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {sc.createdBy}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-xs text-foreground">
                    {sc.totalEmployeesImpacted} NS
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-mono text-xs font-semibold",
                        sc.costImpactType === "INCREASE"
                          ? "text-primary"
                          : sc.costImpactType === "DECREASE"
                          ? "text-emerald-600 font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      {sc.costImpactType === "INCREASE" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {sc.costImpactMonthly}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {sc.targetEffectiveDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={sc.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                    >
                      <Link href={`/org-simulations/${sc.id}`}>
                        <Layers className="h-3.5 w-3.5 mr-1 text-primary" />
                        <span>Mở Sandbox</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>
            Hiển thị <span className="font-medium text-foreground">{filteredScenarios.length}</span> trên tổng số{" "}
            <span className="font-semibold text-foreground">{scenarios.length}</span> kịch bản
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              <span>Trước</span>
            </Button>
            <Button size="sm" className="h-7 w-7 text-xs p-0 bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* ── 4. Dialog Create Scenario ─────────────────────────────────── */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Tạo kịch bản mô phỏng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Tên kịch bản mô phỏng *
              </label>
              <Input
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="Ví dụ: Tái cấu trúc Khối Kinh Doanh 2027"
                className="text-xs h-8"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground block">
                Mô tả mục tiêu kịch bản
              </label>
              <textarea
                rows={3}
                value={newScenarioDesc}
                onChange={(e) => setNewScenarioDesc(e.target.value)}
                placeholder="Mô tả bối cảnh và mục đích điều chỉnh cơ cấu..."
                className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => setCreateModalOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                if (!newScenarioName.trim()) {
                  toast.error("Vui lòng nhập tên kịch bản");
                  return;
                }
                toast.success(`Đã tạo kịch bản: ${newScenarioName}`);
                setCreateModalOpen(false);
                setNewScenarioName("");
                setNewScenarioDesc("");
              }}
            >
              Khởi tạo Sandbox
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
