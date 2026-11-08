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
  Layers,
  MapPin,
  Briefcase,
  HelpCircle,
  ShieldCheck,
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
  ORG_DIMENSIONS,
  ORG_VIEW_MODES,
  type OrgDimension,
} from "@/features/organization/constants/organization.constants";
import { OrgTreeView } from "@/features/organization/components/org-tree/org-tree-view";
import { OrgTableView } from "@/features/organization/components/org-tree/org-table-view";
import {
  OrgDimensionSelector,
  OrgImpactAlert,
  OrgInspectorPanel,
  OrgGeographyView,
  OrgJobMatrixView,
} from "@/features/organization/components/org-canvas";
import { DepartmentFormDialog } from "@/features/organization/components/dialogs/department-form-dialog";
import { DepartmentMoveDialog } from "@/features/organization/components/dialogs/department-move-dialog";
import { DepartmentDetailDialog } from "@/features/organization/components/dialogs/department-detail-dialog";
import { DepartmentDissolveDialog } from "@/features/organization/components/dialogs/department-dissolve-dialog";
import { RegionFormDialog } from "@/features/organization/components/dialogs/region-form-dialog";
import { BranchFormDialog } from "@/features/organization/components/dialogs/branch-form-dialog";
import { JobTitleFormDialog } from "@/features/organization/components/dialogs/job-title-form-dialog";
import { JobLevelFormDialog } from "@/features/organization/components/dialogs/job-level-form-dialog";
import type { Department, DepartmentNode } from "@/features/organization/types/department.types";
import type { Region } from "@/features/organization/types/region.types";
import type { Branch } from "@/features/organization/types/branch.types";
import type { JobTitle } from "@/features/organization/types/job-title.types";
import type { JobLevel } from "@/features/organization/types/job-level.types";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/token-storage";

export default function OrganizationPage() {
  const { filters, updateFilters, setKeywordDebounced } = useOrganizationFilters();
  const {
    companyId: selectedCompanyId,
    asOfDate,
    dimension,
    viewMode,
    keyword,
    page,
    size,
  } = filters;

  // Modals state for Department
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDissolveOpen, setIsDissolveOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);

  // Modals state for Geography & Job Matrix
  const [isRegionFormOpen, setIsRegionFormOpen] = useState(false);
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [targetRegionId, setTargetRegionId] = useState<string>("");

  const [isJobTitleFormOpen, setIsJobTitleFormOpen] = useState(false);
  const [isJobLevelFormOpen, setIsJobLevelFormOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
  const [selectedJobLevel, setSelectedJobLevel] = useState<JobLevel | null>(null);

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

  // Helper convert Node to Department for Modals & Inspector
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

  // Tự động chọn node đầu tiên nếu chưa có node nào được chọn
  React.useEffect(() => {
    if (!selectedDept && treeNodes.length > 0) {
      const first = treeNodes[0];
      setSelectedDept(nodeToDepartment(first));
    }
  }, [treeNodes, selectedDept]);

  // Department Handlers
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

  // Geography Handlers
  const handleOpenCreateRegion = () => {
    setSelectedRegion(null);
    setIsRegionFormOpen(true);
  };

  const handleOpenEditRegion = (region: Region) => {
    setSelectedRegion(region);
    setIsRegionFormOpen(true);
  };

  const handleOpenCreateBranch = (regionId?: string) => {
    setSelectedBranch(null);
    setTargetRegionId(regionId || "");
    setIsBranchFormOpen(true);
  };

  const handleOpenEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setTargetRegionId(branch.regionId);
    setIsBranchFormOpen(true);
  };

  // Job Matrix Handlers
  const handleOpenCreateJobTitle = () => {
    setSelectedJobTitle(null);
    setIsJobTitleFormOpen(true);
  };

  const handleOpenEditJobTitle = (jt: JobTitle) => {
    setSelectedJobTitle(jt);
    setIsJobTitleFormOpen(true);
  };

  const handleOpenCreateJobLevel = () => {
    setSelectedJobLevel(null);
    setIsJobLevelFormOpen(true);
  };

  const handleOpenEditJobLevel = (jl: JobLevel) => {
    setSelectedJobLevel(jl);
    setIsJobLevelFormOpen(true);
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
      <div className="space-y-4 pb-12 max-w-[1600px] mx-auto">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Building2 className="h-4 w-4" />
              </span>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Sơ đồ Cơ cấu Tổ chức
                </h1>
                <p className="text-[11px] text-slate-500">
                  Nền tảng lõi · Ba chiều độc lập: Đơn vị (kế thừa) · Địa lý · Vị trí việc làm · Hiệu lực theo thời gian
                </p>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/organization/catalogs">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-slate-600">
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                <span>Quản lý danh mục</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="h-8 gap-1.5 text-xs text-slate-600"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>{isExporting ? "Đang xuất..." : "Xuất sơ đồ Excel"}</span>
            </Button>

            <PermissionGuard permission={PERMISSIONS.ORG.MANAGE}>
              {dimension === ORG_DIMENSIONS.ORGANIZATION && (
                <Button
                  onClick={handleOpenCreateRoot}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm đơn vị</span>
                </Button>
              )}
              {dimension === ORG_DIMENSIONS.GEOGRAPHY && (
                <Button
                  onClick={handleOpenCreateRegion}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm vùng</span>
                </Button>
              )}
              {dimension === ORG_DIMENSIONS.JOB_POSITIONS && (
                <Button
                  onClick={handleOpenCreateJobTitle}
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm chức danh</span>
                </Button>
              )}
            </PermissionGuard>
          </div>
        </div>

        {/* ── 3 Chiều độc lập (DocuCore Dimension Selector) ─────────────── */}
        <OrgDimensionSelector
          selectedDimension={dimension}
          onSelectDimension={(dim) => updateFilters({ dimension: dim })}
        />

        {/* ── Filter Toolbar ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Bộ chọn công ty */}
            <div className="w-56">
              <Select
                value={selectedCompanyId}
                onValueChange={(val) => val && updateFilters({ companyId: val })}
              >
                <SelectTrigger className="h-8 text-xs bg-slate-50/50">
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

            {/* Ngày chốt cơ cấu hiệu lực (Mốc thời gian phiên bản cây) */}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <Input
                type="date"
                value={asOfDate}
                onChange={(e) => updateFilters({ asOfDate: e.target.value })}
                className="h-8 text-xs w-36 bg-slate-50/50"
                placeholder="Chốt tại ngày"
                title="Xem cơ cấu tổ chức chốt tại mốc ngày chỉ định"
              />
              {asOfDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground"
                  onClick={() => updateFilters({ asOfDate: "" })}
                >
                  Hôm nay
                </Button>
              )}
            </div>

            {/* Tìm kiếm phòng ban (ở chế độ bảng) */}
            {dimension === ORG_DIMENSIONS.ORGANIZATION && viewMode === ORG_VIEW_MODES.TABLE && (
              <div className="relative w-60">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Tìm mã hoặc tên đơn vị..."
                  defaultValue={keyword}
                  onChange={(e) => setKeywordDebounced(e.target.value)}
                  className="pl-8 h-8 text-xs bg-slate-50/50"
                />
              </div>
            )}
          </div>

          {/* View Mode Toggle: Tree vs Table (cho Chiều Đơn vị tổ chức) */}
          {dimension === ORG_DIMENSIONS.ORGANIZATION && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => updateFilters({ viewMode: ORG_VIEW_MODES.TREE })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === ORG_VIEW_MODES.TREE
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FolderTree className="h-3.5 w-3.5" />
                <span>Cây sơ đồ</span>
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ viewMode: ORG_VIEW_MODES.TABLE })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === ORG_VIEW_MODES.TABLE
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>Bảng danh sách</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Main Canvas (Master-Detail Grid: 8 cột Canvas + 4 cột Inspector) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* CỘT TRÁI (CANVAS CHÍNH: 8 CỘT) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Chiều 1: ĐƠN VỊ TỔ CHỨC (F-C02) */}
            {dimension === ORG_DIMENSIONS.ORGANIZATION && (
              <>
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/40">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">
                        Cây Cơ cấu Đơn vị tổ chức
                      </span>
                      <span className="font-mono text-[10.5px] text-slate-400">
                        {treeNodes.length} nút gốc · Hiệu lực {asOfDate || "hiện hành"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Nhấp vào đơn vị để kiểm tra chi tiết & thuộc tính
                    </span>
                  </div>

                  <div className="p-3">
                    {viewMode === ORG_VIEW_MODES.TREE ? (
                      <OrgTreeView
                        nodes={treeNodes}
                        isLoading={isTreeLoading}
                        selectedNodeId={selectedDept?.id}
                        onSelectNode={(node) => setSelectedDept(nodeToDepartment(node))}
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
                  </div>
                </div>

                {/* Thẻ Cảnh báo Xem trước ảnh hưởng (Impact Preview Widget) */}
                <OrgImpactAlert
                  actionLabel="Đang chọn"
                  affectedTargetName={selectedDept?.name}
                  userImpactCount={21}
                  policyImpactCount={4}
                  workflowImpactCount={2}
                  recordImpactCount={988}
                />
              </>
            )}

            {/* 2. Chiều 2: ĐỊA LÝ & CHI NHÁNH (F-C03) */}
            {dimension === ORG_DIMENSIONS.GEOGRAPHY && (
              <OrgGeographyView
                companyId={selectedCompanyId}
                onOpenCreateRegion={handleOpenCreateRegion}
                onOpenCreateBranch={handleOpenCreateBranch}
                onOpenEditRegion={handleOpenEditRegion}
                onOpenEditBranch={handleOpenEditBranch}
              />
            )}

            {/* 3. Chiều 3: VỊ TRÍ VIỆC LÀM (F-C04) */}
            {dimension === ORG_DIMENSIONS.JOB_POSITIONS && (
              <OrgJobMatrixView
                companyId={selectedCompanyId}
                onOpenCreateJobTitle={handleOpenCreateJobTitle}
                onOpenCreateJobLevel={handleOpenCreateJobLevel}
                onOpenEditJobTitle={handleOpenEditJobTitle}
                onOpenEditJobLevel={handleOpenEditJobLevel}
              />
            )}
          </div>

          {/* CỘT PHẢI (INSPECTOR PANEL: 4 CỘT) */}
          <div className="lg:col-span-4 space-y-4">
            {dimension === ORG_DIMENSIONS.ORGANIZATION ? (
              <OrgInspectorPanel
                selectedNode={selectedDept}
                onEdit={handleOpenEdit}
                onMove={handleOpenMove}
                onDissolve={handleOpenDissolve}
              />
            ) : dimension === ORG_DIMENSIONS.GEOGRAPHY ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Nguyên tắc Chiều Địa lý (F-C03)</span>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Cây địa lý phân cấp theo <b>Vùng miền → Chi nhánh / Điểm giao dịch</b>.
                  Mỗi chi nhánh gắn tọa độ GPS và bán kính chấm công độc lập, phục vụ phân luồng duyệt theo vùng và giới hạn truy cập theo vị trí thực tế.
                </p>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bán kính mặc định:</span>
                    <span className="font-mono font-medium">100m – 150m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phục vụ:</span>
                    <span className="font-medium text-primary">Chấm công GPS & Phân quyền vùng</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2 font-semibold text-xs text-slate-800">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>Nguyên tắc Vị trí việc làm (F-C04)</span>
                </div>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Danh mục chức danh và cấp bậc là <b>danh mục phẳng dùng chung</b>.
                  Một chức danh (ví dụ: <i>Chuyên viên tín dụng</i>) có thể xuất hiện tại nhiều phòng ban và chi nhánh khác nhau mà không cần khai báo lại.
                </p>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Thang cấp bậc:</span>
                    <span className="font-mono font-medium">Thứ tự rank 1 → 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phục vụ:</span>
                    <span className="font-medium text-amber-700">Định mức lương & Quyền hạn ký duyệt</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Dialogs: Department ────────────────────────────────────────── */}
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

        {/* ── Dialogs: Geography ────────────────────────────────────────── */}
        <RegionFormDialog
          open={isRegionFormOpen}
          onOpenChange={setIsRegionFormOpen}
          region={selectedRegion}
          companyId={selectedCompanyId}
        />

        <BranchFormDialog
          open={isBranchFormOpen}
          onOpenChange={setIsBranchFormOpen}
          branch={selectedBranch}
          regionId={targetRegionId}
        />

        {/* ── Dialogs: Job Matrix ───────────────────────────────────────── */}
        <JobTitleFormDialog
          open={isJobTitleFormOpen}
          onOpenChange={setIsJobTitleFormOpen}
          jobTitle={selectedJobTitle}
          companyId={selectedCompanyId}
        />

        <JobLevelFormDialog
          open={isJobLevelFormOpen}
          onOpenChange={setIsJobLevelFormOpen}
          jobLevel={selectedJobLevel}
          companyId={selectedCompanyId}
        />
      </div>
    </PermissionGuard>
  );
}
