"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  FolderTree,
  List,
  Plus,
  Download,
  Calendar,
  Building2,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetDepartmentTreeQuery,
  useGetDepartmentsQuery,
  useGetCompaniesQuery,
} from "@/features/organization/api/organization-api";
import { OrgTreeView } from "@/features/organization/components/org-tree/org-tree-view";
import { OrgTableView } from "@/features/organization/components/org-tree/org-table-view";
import { DepartmentFormDialog } from "@/features/organization/components/dialogs/department-form-dialog";
import { DepartmentMoveDialog } from "@/features/organization/components/dialogs/department-move-dialog";
import { DepartmentDetailDialog } from "@/features/organization/components/dialogs/department-detail-dialog";
import { DepartmentDissolveDialog } from "@/features/organization/components/dialogs/department-dissolve-dialog";
import type { Department, DepartmentNode } from "@/features/organization/types";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/token-storage";

const DEFAULT_COMPANY_ID = "00000000-0000-0000-0000-000000000001";

export default function OrganizationPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(DEFAULT_COMPANY_ID);
  const [asOfDate, setAsOfDate] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "table">("tree");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDissolveOpen, setIsDissolveOpen] = useState(false);

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Queries
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  const {
    data: treeNodes = [],
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useGetDepartmentTreeQuery({
    companyId: selectedCompanyId,
    asOfDate: asOfDate || undefined,
  });

  const {
    data: departmentsData,
    isLoading: isTableLoading,
    refetch: refetchTable,
  } = useGetDepartmentsQuery({
    companyId: selectedCompanyId,
    keyword: keyword || undefined,
    page,
    size: 20,
  });

  const departments = departmentsData?.items || [];

  // Helper convert Node to Department for Modals
  const nodeToDepartment = (node: DepartmentNode): Department => ({
    id: node.id,
    companyId: selectedCompanyId,
    code: node.code,
    name: node.name,
    parentDepartmentId: node.parentDepartmentId,
    costCenterId: node.costCenterId,
    costCenterName: node.costCenterName,
    managerEmployeeId: node.managerEmployeeId,
    isPermissionInherited: node.isPermissionInherited,
    effectiveFrom: node.effectiveFrom,
    isActive: true,
    createdAt: "",
  });

  // Handlers
  const handleOpenCreateRoot = () => {
    setSelectedDept(null);
    setTargetParentId(null);
    setIsFormOpen(true);
  };

  const handleOpenAddSub = (parentId: string) => {
    setSelectedDept(null);
    setTargetParentId(parentId);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept: Department | DepartmentNode) => {
    const d = "children" in dept ? nodeToDepartment(dept) : dept;
    setSelectedDept(d);
    setIsFormOpen(true);
  };

  const handleOpenMove = (dept: Department | DepartmentNode) => {
    const d = "children" in dept ? nodeToDepartment(dept) : dept;
    setSelectedDept(d);
    setIsMoveOpen(true);
  };

  const handleOpenDetail = (dept: Department | DepartmentNode) => {
    const d = "children" in dept ? nodeToDepartment(dept) : dept;
    setSelectedDept(d);
    setIsDetailOpen(true);
  };

  const handleOpenDissolve = (dept: Department | DepartmentNode) => {
    const d = "children" in dept ? nodeToDepartment(dept) : dept;
    setSelectedDept(d);
    setIsDissolveOpen(true);
  };

  const handleRefresh = () => {
    refetchTree();
    refetchTable();
  };

  // Export Excel
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const token = tokenStorage.getAccessToken();
      const query = asOfDate
        ? `companyId=${selectedCompanyId}&asOfDate=${asOfDate}`
        : `companyId=${selectedCompanyId}`;
      const url = `${env.API_BASE_URL}/departments/export?${query}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Không thể tải file xuất cơ cấu tổ chức");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `So_do_to_chuc_${asOfDate || new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Xuất file Excel thành công!");
    } catch {
      toast.error("Xuất file Excel thất bại, vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Sơ đồ Cơ cấu Tổ chức
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Cơ cấu tổ chức & Phòng ban</span>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/organization/catalogs">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Settings className="h-3.5 w-3.5" />
              <span>Quản lý danh mục</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            disabled={isExporting}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isExporting ? "Đang xuất..." : "Xuất Excel"}</span>
          </Button>

          <Button
            onClick={handleOpenCreateRoot}
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm phòng ban</span>
          </Button>
        </div>
      </div>

      {/* ── Filter & View Mode Toolbar ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-border shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Bộ chọn công ty */}
          <div className="w-56">
            <Select
              value={selectedCompanyId}
              onValueChange={(val) => val && setSelectedCompanyId(val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Chọn công ty / pháp nhân" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-xs">
                    {c.name} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ngày chốt cơ cấu hiệu lực */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <Input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="h-9 text-xs w-36"
              placeholder="Chốt tại ngày"
              title="Xem sơ đồ tổ chức chốt tại mốc ngày chỉ định"
            />
            {asOfDate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-2 text-xs text-muted-foreground"
                onClick={() => setAsOfDate("")}
              >
                Hôm nay
              </Button>
            )}
          </div>

          {/* Tìm kiếm phòng ban (ở chế độ bảng) */}
          {viewMode === "table" && (
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Tìm mã hoặc tên đơn vị..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
                className="pl-8 h-9 text-xs"
              />
            </div>
          )}
        </div>

        {/* View Mode Toggle: Tree vs Table */}
        <div className="flex items-center rounded-md border border-border bg-slate-50 p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("tree")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === "tree"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" />
            <span>Cây sơ đồ</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              viewMode === "table"
                ? "bg-white text-primary shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>Danh sách bảng</span>
          </button>
        </div>
      </div>

      {/* ── Main View (Tree View / Table View) ──────────────────────── */}
      {viewMode === "tree" ? (
        <OrgTreeView
          nodes={treeNodes}
          isLoading={isTreeLoading}
          onSelectNode={handleOpenDetail}
          onAddSubDepartment={handleOpenAddSub}
          onEdit={handleOpenEdit}
          onMove={handleOpenMove}
          onDissolve={handleOpenDissolve}
        />
      ) : (
        <OrgTableView
          departments={departments}
          isLoading={isTableLoading}
          onViewDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onMove={handleOpenMove}
          onDissolve={handleOpenDissolve}
        />
      )}

      {/* ── Dialogs ─────────────────────────────────────────────────── */}
      <DepartmentFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={selectedDept}
        parentDepartmentId={targetParentId}
        companyId={selectedCompanyId}
        onSuccess={handleRefresh}
      />

      <DepartmentMoveDialog
        open={isMoveOpen}
        onOpenChange={setIsMoveOpen}
        department={selectedDept}
        companyId={selectedCompanyId}
        onSuccess={handleRefresh}
      />

      <DepartmentDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        department={selectedDept}
        onEdit={handleOpenEdit}
        onMove={handleOpenMove}
      />

      <DepartmentDissolveDialog
        open={isDissolveOpen}
        onOpenChange={setIsDissolveOpen}
        department={selectedDept}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

