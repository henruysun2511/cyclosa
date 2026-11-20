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
import { useOrganizationFilters } from "@/features/organization/hooks/use-organization-filters";
import {
  DEFAULT_COMPANY_ID,
  ORG_VIEW_MODES,
} from "@/features/organization/constants/organization.constants";
import { OrgTreeView } from "@/features/organization/components/org-tree/org-tree-view";
import { OrgTableView } from "@/features/organization/components/org-tree/org-table-view";
import { DepartmentDetailPanel } from "@/features/organization/components/org-tree/department-detail-panel";
import { DepartmentFormDialog } from "@/features/organization/components/dialogs/department-form-dialog";
import { DepartmentMoveDialog } from "@/features/organization/components/dialogs/department-move-dialog";
import { DepartmentDetailDialog } from "@/features/organization/components/dialogs/department-detail-dialog";
import { DepartmentDissolveDialog } from "@/features/organization/components/dialogs/department-dissolve-dialog";
import type { Department, DepartmentNode } from "@/features/organization/types/department.types";
import type { Company } from "@/features/organization/types/company.types";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/token-storage";

export default function OrganizationPage() {
  const { filters, updateFilters, setKeywordDebounced } = useOrganizationFilters();
  const {
    companyId: selectedCompanyId,
    asOfDate,
    viewMode,
    keyword,
    page,
    size,
  } = filters;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDissolveOpen, setIsDissolveOpen] = useState(false);

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [moveTargetParentId, setMoveTargetParentId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Queries
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });

  const fallbackCompany: Company = React.useMemo(
    () => ({
      id: DEFAULT_COMPANY_ID,
      code: "CYC_CORP",
      name: "Công ty Cổ phần Tập đoàn CYCLOSA",
      status: "ACTIVE",
      createdAt: "",
    }),
    []
  );

  const companies = React.useMemo(() => {
    if (companiesData?.items && companiesData.items.length > 0) {
      return companiesData.items;
    }
    return [fallbackCompany];
  }, [companiesData, fallbackCompany]);

  // Tự động chọn công ty hợp lệ đầu tiên nếu chưa chọn hoặc ID hiện tại không tồn tại trong danh sách
  React.useEffect(() => {
    if (companies.length > 0) {
      const exists = companies.some((c) => c.id === selectedCompanyId);
      if (!selectedCompanyId || !exists) {
        updateFilters({ companyId: companies[0].id });
      }
    }
  }, [companies, selectedCompanyId, updateFilters]);

  const {
    data: treeNodes = [],
    isLoading: isTreeLoading,
    refetch: refetchTree,
  } = useGetDepartmentTreeQuery(
    {
      companyId: selectedCompanyId,
      asOfDate: asOfDate || undefined,
    },
    { skip: !selectedCompanyId }
  );

  const {
    data: departmentsData,
    isLoading: isTableLoading,
    refetch: refetchTable,
  } = useGetDepartmentsQuery(
    {
      companyId: selectedCompanyId,
      keyword: keyword || undefined,
      page,
      size: 20,
    },
    { skip: !selectedCompanyId }
  );

  // Helper convert Node to Department for Modals & Panel & Fallback
  const nodeToDepartment = React.useCallback(
    (node: DepartmentNode, parentName?: string): Department => ({
      id: node.id,
      companyId: selectedCompanyId,
      code: node.code,
      name: node.name,
      parentDepartmentId: node.parentDepartmentId,
      parentDepartmentName: parentName,
      costCenterId: node.costCenterId,
      costCenterName: node.costCenterName,
      managerEmployeeId: node.managerEmployeeId,
      isPermissionInherited: node.isPermissionInherited,
      effectiveFrom: node.effectiveFrom,
      isActive: true,
      createdAt: "",
    }),
    [selectedCompanyId]
  );

  // Flatten cây cơ cấu tổ chức làm nguồn dữ liệu fallback cho dạng bảng khi cần
  const flattenTreeToDepartments = React.useCallback(
    (nodes: DepartmentNode[], parentName?: string): Department[] => {
      let result: Department[] = [];
      nodes.forEach((n) => {
        result.push(nodeToDepartment(n, parentName));
        if (n.children && n.children.length > 0) {
          result = result.concat(flattenTreeToDepartments(n.children, n.name));
        }
      });
      return result;
    },
    [nodeToDepartment]
  );

  // Danh sách phòng ban dạng bảng: Ưu tiên dữ liệu từ API phân trang, nếu trống thì dùng dữ liệu cây đã nạp
  const departments = React.useMemo(() => {
    if (departmentsData?.items && departmentsData.items.length > 0) {
      return departmentsData.items;
    }
    if (treeNodes.length > 0) {
      let flat = flattenTreeToDepartments(treeNodes);
      if (keyword) {
        const kw = keyword.toLowerCase();
        flat = flat.filter(
          (d) =>
            d.name.toLowerCase().includes(kw) ||
            d.code.toLowerCase().includes(kw)
        );
      }
      return flat;
    }
    return [];
  }, [departmentsData, treeNodes, flattenTreeToDepartments, keyword]);

  // Tự động chọn phòng ban đầu tiên khi nạp xong dữ liệu cây
  React.useEffect(() => {
    if (!selectedDept && treeNodes.length > 0) {
      setSelectedDept(nodeToDepartment(treeNodes[0]));
    }
  }, [treeNodes, selectedDept, nodeToDepartment]);

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

  const handleOpenMove = (
    dept: Department | DepartmentNode,
    targetParentId?: string
  ) => {
    const d = "children" in dept ? nodeToDepartment(dept) : dept;
    setSelectedDept(d);
    setMoveTargetParentId(targetParentId !== undefined ? targetParentId : null);
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
    <PermissionGuard permission={PERMISSIONS.ORG.VIEW}>
      <div className="space-y-6 pb-12">
        {/* ── Page Header & Breadcrumb & Action Controls ────────────────── */}
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
              <span className="text-muted-foreground">Cơ cấu tổ chức</span>
              <span>/</span>
              <span className="text-foreground font-medium">Phòng ban & Đơn vị</span>
            </nav>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/organization/catalogs">
              <Button variant="outline" size="sm" className="btn-outline h-9 text-xs">
                <Settings className="h-3.5 w-3.5 mr-1 text-slate-500" />
                <span>Quản lý danh mục</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="btn-outline h-9 text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1 text-slate-500" />
              <span>{isExporting ? "Đang xuất..." : "Xuất sơ đồ Excel"}</span>
            </Button>

            <PermissionGuard permission={PERMISSIONS.ORG.MANAGE}>
              <Button
                onClick={handleOpenCreateRoot}
                size="sm"
                className="btn-primary h-9 text-xs font-medium"
              >
                <Plus className="h-4 w-4" />
                <span>Tạo đơn vị mới</span>
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* ── Filter Bar (asOf Date Picker & Company & View Mode) ───────── */}
        <div className="table-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Bộ chọn công ty / pháp nhân */}
              <div className="w-72 sm:w-80 min-w-[220px]">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(val) => val && updateFilters({ companyId: val })}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-white border-border overflow-hidden min-w-0">
                    <SelectValue placeholder="Chọn công ty / pháp nhân">
                      {(val: string) => {
                        const comp = companies.find((c) => c.id === val);
                        if (comp) {
                          return (
                            <span className="truncate max-w-[200px] text-left block font-medium">
                              {comp.name} ({comp.code})
                            </span>
                          );
                        }
                        if (companies.length === 0) {
                          return (
                            <span className="text-muted-foreground text-xs italic">
                              Đang tải công ty...
                            </span>
                          );
                        }
                        return (
                          <span className="text-muted-foreground text-xs">
                            Chọn công ty / pháp nhân
                          </span>
                        );
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        label={`${c.name} (${c.code})`}
                        className="text-xs"
                      >
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ngày chốt cơ cấu hiệu lực (asOf Date) */}
              <div className="flex items-center gap-2 shrink-0">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground whitespace-nowrap">
                  Xem cơ cấu tại thời điểm (asOf):
                </span>
                <Input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => updateFilters({ asOfDate: e.target.value })}
                  className="h-9 w-36 text-xs font-mono bg-white border-border"
                  placeholder="Chốt tại ngày"
                />
                {asOfDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-2 text-xs"
                    onClick={() => updateFilters({ asOfDate: "" })}
                  >
                    Về hiện tại
                  </Button>
                )}
              </div>

              {/* Tìm kiếm phòng ban (ở chế độ bảng) */}
              {viewMode === ORG_VIEW_MODES.TABLE && (
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm phòng ban, mã đơn vị..."
                    defaultValue={keyword}
                    onChange={(e) => setKeywordDebounced(e.target.value)}
                    className="pl-8 h-9 text-xs bg-white border-border"
                  />
                </div>
              )}
            </div>

            {/* View Mode Toggle: Tree vs Table */}
            <div className="flex items-center rounded-md border border-border bg-white p-0.5 shadow-2xs shrink-0">
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === ORG_VIEW_MODES.TREE
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => updateFilters({ viewMode: ORG_VIEW_MODES.TREE })}
              >
                <FolderTree className="h-3.5 w-3.5" />
                <span>Dạng cây</span>
              </button>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === ORG_VIEW_MODES.TABLE
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => updateFilters({ viewMode: ORG_VIEW_MODES.TABLE })}
              >
                <List className="h-3.5 w-3.5" />
                <span>Dạng bảng</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content Area (2 cột Master-Detail chuẩn CYCLOSA) ────── */}
        {viewMode === ORG_VIEW_MODES.TREE ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Tree Structure (2 cols) */}
            <div className="lg:col-span-2 table-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Cây phả hệ đơn vị phòng ban</span>
                </h2>
                <span className="text-xs text-muted-foreground">
                  Click vào đơn vị để xem chi tiết & tác vụ
                </span>
              </div>

              <OrgTreeView
                nodes={treeNodes}
                isLoading={isTreeLoading}
                selectedNodeId={selectedDept?.id}
                onSelectNode={(node) => setSelectedDept(nodeToDepartment(node))}
                onAddSubDepartment={handleOpenAddSub}
                onEdit={handleOpenEdit}
                onMove={handleOpenMove}
                onDissolve={handleOpenDissolve}
                onViewDetail={handleOpenDetail}
              />
            </div>

            {/* Department Detail Side Panel (1 col) */}
            <div className="lg:col-span-1">
              <DepartmentDetailPanel
                selectedDept={selectedDept}
                onEdit={handleOpenEdit}
                onMove={handleOpenMove}
                onDissolve={handleOpenDissolve}
                onAddSubDepartment={handleOpenAddSub}
                onViewDetail={handleOpenDetail}
              />
            </div>
          </div>
        ) : (
          /* Table View */
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
          targetParentDepartmentId={moveTargetParentId}
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
    </PermissionGuard>
  );
}
