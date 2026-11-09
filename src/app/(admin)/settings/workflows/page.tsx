"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitFork,
  Plus,
  RefreshCw,
  Search,
  Building2,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useGetCompaniesQuery } from "@/features/organization/api";
import {
  useWorkflowDefinitionFilters,
  useGetWorkflowDefinitionsQuery,
  useToggleWorkflowDefinitionStatusMutation,
  useDeleteWorkflowDefinitionMutation,
  REQUEST_TYPE_MAP,
  REQUEST_TYPE_OPTIONS,
} from "@/features/workflow";

export default function WorkflowDefinitionsPage() {
  const router = useRouter();
  const {
    search,
    debouncedSearch,
    companyId,
    requestType,
    requestTypeParam,
    statusParam,
    isActive,
    page,
    size,
    setSearch,
    setCompanyId,
    setRequestType,
    setStatus,
    setPage,
    resetFilters,
  } = useWorkflowDefinitionFilters();

  const { data: companiesData } = useGetCompaniesQuery({ size: 100 });
  const companies = companiesData?.items || [];

  const { data, isLoading, isFetching, refetch } = useGetWorkflowDefinitionsQuery({
    page,
    size,
    keyword: debouncedSearch.trim() || undefined,
    companyId: companyId || undefined,
    requestType,
    isActive,
  });

  const [toggleStatus] = useToggleWorkflowDefinitionStatusMutation();
  const [deleteWorkflow] = useDeleteWorkflowDefinitionMutation();

  const items = data?.items || [];
  const totalPages = data?.pagination?.pages || 0;
  const totalItems = data?.pagination?.total || 0;

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleStatus(id).unwrap();
      toast.success(
        currentStatus ? "Đã tạm dừng quy trình." : "Đã kích hoạt áp dụng quy trình."
      );
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể thay đổi trạng thái quy trình.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa quy trình "${name}"?`)) return;
    try {
      await deleteWorkflow(id).unwrap();
      toast.success("Đã xóa quy trình thành công.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xóa quy trình này.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Title on top, Breadcrumb underneath */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GitFork className="w-6 h-6 text-primary" />
            Cấu hình Quy trình Phê duyệt
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/approvals" className="hover:text-primary transition-colors">
              Phê duyệt
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Cấu hình quy trình</span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Link href="/settings/workflows/new">
            <Button size="sm" className="h-9 gap-1.5 text-xs shadow-xs">
              <Plus className="w-4 h-4" />
              Thêm quy trình mới
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-card p-3 rounded-xl border shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên quy trình..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Company Select */}
        <div>
          <Select value={companyId || "all"} onValueChange={(val) => setCompanyId(val || "")}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Công ty áp dụng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả công ty</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Request Type Select */}
        <div>
          <Select value={requestTypeParam} onValueChange={(val) => setRequestType(val || "all")}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Loại chứng từ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chứng từ</SelectItem>
              {REQUEST_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Select */}
        <div className="flex items-center gap-2">
          <Select value={statusParam} onValueChange={(val) => setStatus(val || "all")}>
            <SelectTrigger className="h-9 text-xs flex-1">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang kích hoạt</SelectItem>
              <SelectItem value="inactive">Đã tạm dừng</SelectItem>
            </SelectContent>
          </Select>

          {(search || companyId || requestTypeParam !== "all" || statusParam !== "all") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* 3. Table of Definitions */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <GitFork className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-foreground">
              Chưa có quy trình phê duyệt nào
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Nhấn nút &ldquo;Thêm quy trình mới&rdquo; để bắt đầu xây dựng quy trình duyệt đa cấp cho công ty của bạn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="min-w-[220px] font-semibold text-xs">Tên quy trình</TableHead>
                  <TableHead className="w-[180px] font-semibold text-xs">Công ty áp dụng</TableHead>
                  <TableHead className="w-[160px] font-semibold text-xs">Loại chứng từ</TableHead>
                  <TableHead className="w-[120px] font-semibold text-xs text-center">Số cấp duyệt</TableHead>
                  <TableHead className="w-[140px] font-semibold text-xs">Kích hoạt</TableHead>
                  <TableHead className="w-[130px] font-semibold text-xs">Ngày tạo</TableHead>
                  <TableHead className="w-[80px] text-right font-semibold text-xs">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Link
                        href={`/settings/workflows/${item.id}/edit`}
                        className="font-semibold text-xs text-foreground hover:text-primary transition-colors block"
                      >
                        {item.name}
                      </Link>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {item.companyName || "Tất cả công ty"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge className="bg-blue-600 text-white border-transparent text-xs font-medium">
                        {REQUEST_TYPE_MAP[item.requestType as keyof typeof REQUEST_TYPE_MAP] || item.requestType}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-600 text-white font-mono">
                        {item.stepCount} cấp duyệt
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={() => handleToggle(item.id, item.isActive)}
                        />
                        <span className="text-[11px] text-muted-foreground">
                          {item.isActive ? "Áp dụng" : "Tạm dừng"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "---"}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 text-xs">
                          <DropdownMenuItem
                            onClick={() => router.push(`/settings/workflows/${item.id}/edit`)}
                            className="cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id, item.name)}
                            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Xóa quy trình
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <div>
              Hiển thị {(page - 1) * size + 1} - {Math.min(page * size, totalItems)} / {totalItems} quy trình
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-7 px-2.5 text-xs"
              >
                Trước
              </Button>
              <span className="px-2 font-medium text-foreground">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-7 px-2.5 text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

