"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  MapPin,
  Tag,
  Briefcase,
  Layers,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetCompaniesQuery,
  useDeleteCompanyMutation,
  useGetAllRegionsQuery,
  useDeleteRegionMutation,
  useGetBranchesByCompanyQuery,
  useDeleteBranchMutation,
  useGetAllCostCentersQuery,
  useDeleteCostCenterMutation,
  useGetAllJobTitlesQuery,
  useDeleteJobTitleMutation,
  useGetAllJobLevelsQuery,
  useDeleteJobLevelMutation,
} from "@/features/organization/api/organization-api";
import { CompanyFormDialog } from "@/features/organization/components/dialogs/company-form-dialog";
import { RegionFormDialog } from "@/features/organization/components/dialogs/region-form-dialog";
import { BranchFormDialog } from "@/features/organization/components/dialogs/branch-form-dialog";
import { CostCenterFormDialog } from "@/features/organization/components/dialogs/cost-center-form-dialog";
import { JobTitleFormDialog } from "@/features/organization/components/dialogs/job-title-form-dialog";
import { JobLevelFormDialog } from "@/features/organization/components/dialogs/job-level-form-dialog";
import { useCatalogFilters } from "@/features/organization/hooks/use-catalog-filters";
import {
  DEFAULT_COMPANY_ID,
  CATALOG_TABS,
  type CatalogTab,
} from "@/features/organization/constants/organization.constants";
import type {
  Company,
  Region,
  Branch,
  CostCenter,
  JobTitle,
  JobLevel,
} from "@/features/organization/types";

export default function OrganizationCatalogsPage() {
  const {
    activeTab,
    companyId: selectedCompanyId,
    setTab: setActiveTab,
    setCompanyId: setSelectedCompanyId,
  } = useCatalogFilters();

  // Dialog States
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branchRegionId, setBranchRegionId] = useState<string>("");

  const [isCostCenterOpen, setIsCostCenterOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

  const [isJobTitleOpen, setIsJobTitleOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);

  const [isJobLevelOpen, setIsJobLevelOpen] = useState(false);
  const [selectedJobLevel, setSelectedJobLevel] = useState<JobLevel | null>(null);

  // Queries
  const {
    data: companiesData,
    isLoading: isCompaniesLoading,
    refetch: refetchCompanies,
  } = useGetCompaniesQuery({ size: 50 });

  const fallbackCompany: Company = React.useMemo(
    () => ({
      id: DEFAULT_COMPANY_ID,
      code: "CYC_CORP",
      name: "Công ty Cổ phần Tập đoàn CYCLOSA",
      taxCode: "0109998888",
      address: "Tòa nhà Keangnam Landmark 72, Đường Phạm Hùng, Nam Từ Liêm, Hà Nội",
      phone: "02473008888",
      email: "contact@cyclosa.vn",
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
        setSelectedCompanyId(companies[0].id);
      }
    }
  }, [companies, selectedCompanyId, setSelectedCompanyId]);

  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    refetch: refetchRegions,
  } = useGetAllRegionsQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const {
    data: branches = [],
    isLoading: isBranchesLoading,
    refetch: refetchBranches,
  } = useGetBranchesByCompanyQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const {
    data: costCenters = [],
    isLoading: isCostCentersLoading,
    refetch: refetchCostCenters,
  } = useGetAllCostCentersQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const {
    data: jobTitles = [],
    isLoading: isJobTitlesLoading,
    refetch: refetchJobTitles,
  } = useGetAllJobTitlesQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const {
    data: jobLevels = [],
    isLoading: isJobLevelsLoading,
    refetch: refetchJobLevels,
  } = useGetAllJobLevelsQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  // Mutations Delete
  const [deleteCompany] = useDeleteCompanyMutation();
  const [deleteRegion] = useDeleteRegionMutation();
  const [deleteBranch] = useDeleteBranchMutation();
  const [deleteCostCenter] = useDeleteCostCenterMutation();
  const [deleteJobTitle] = useDeleteJobTitleMutation();
  const [deleteJobLevel] = useDeleteJobLevelMutation();

  // Dialog xác nhận xóa an toàn theo Chuẩn 9.2
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: string;
    id: string;
    name: string;
    isLoading: boolean;
  }>({
    open: false,
    type: "",
    id: "",
    name: "",
    isLoading: false,
  });

  const handleDelete = (type: string, id: string, name: string) => {
    setDeleteConfirm({
      open: true,
      type,
      id,
      name,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteConfirm((prev) => ({ ...prev, isLoading: true }));
      const { type, id } = deleteConfirm;
      if (type === "company") {
        await deleteCompany(id).unwrap();
        refetchCompanies();
      }
      if (type === "region") {
        await deleteRegion(id).unwrap();
        refetchRegions();
      }
      if (type === "branch") {
        await deleteBranch(id).unwrap();
        refetchBranches();
      }
      if (type === "cost-center") {
        await deleteCostCenter(id).unwrap();
        refetchCostCenters();
      }
      if (type === "job-title") {
        await deleteJobTitle(id).unwrap();
        refetchJobTitles();
      }
      if (type === "job-level") {
        await deleteJobLevel(id).unwrap();
        refetchJobLevels();
      }
      toast.success("Xóa bản ghi thành công!");
      setDeleteConfirm((prev) => ({ ...prev, open: false, isLoading: false }));
    } catch {
      toast.error("Không thể xóa bản ghi này! Vui lòng kiểm tra ràng buộc dữ liệu liên quan.");
      setDeleteConfirm((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <PermissionGuard permission={PERMISSIONS.ORG.VIEW}>
      <div className="space-y-6 pb-12">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/organization">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1 text-slate-500">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Danh mục Cơ cấu Tổ chức
            </h1>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 ml-9">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/organization" className="hover:text-primary transition-colors">
              Cơ cấu tổ chức
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Quản lý danh mục</span>
          </nav>
        </div>

        {/* Company Dropdown (nếu tab không phải là companies) */}
        {activeTab !== "companies" && (
          <div className="w-72 sm:w-80 min-w-[220px]">
            <Select value={selectedCompanyId} onValueChange={(val) => val && setSelectedCompanyId(val)}>
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
        )}
      </div>

      {/* ── Tabs Navigation ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === "companies" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("companies")}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Công ty & Pháp nhân ({companies.length})</span>
        </Button>
        <Button
          variant={activeTab === "branches" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("branches")}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Vùng miền & Chi nhánh GPS ({branches.length})</span>
        </Button>
        <Button
          variant={activeTab === "cost-centers" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("cost-centers")}
        >
          <Tag className="h-3.5 w-3.5" />
          <span>Trung tâm chi phí ({costCenters.length})</span>
        </Button>
        <Button
          variant={activeTab === "job-matrix" ? "default" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => setActiveTab("job-matrix")}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Chức danh & Cấp bậc</span>
        </Button>
      </div>

      {/* ── TAB 1: CÔNG TY & PHÁP NHÂN ──────────────────────────────── */}
      {activeTab === "companies" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Quản lý danh sách các pháp nhân và công ty thành viên trong tập đoàn
            </span>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => {
                setSelectedCompany(null);
                setIsCompanyOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm công ty</span>
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/75">
                  <TableHead className="w-12 text-center">STT</TableHead>
                  <TableHead className="w-32">Mã công ty</TableHead>
                  <TableHead>Tên pháp nhân</TableHead>
                  <TableHead>Mã số thuế</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-20 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCompaniesLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-xs text-muted-foreground">
                      Đang tải danh sách công ty...
                    </TableCell>
                  </TableRow>
                ) : companies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-xs text-muted-foreground">
                      Chưa có công ty nào được tạo.
                    </TableCell>
                  </TableRow>
                ) : (
                  companies.map((c, idx) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-center text-slate-500 text-xs font-normal">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {c.code}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {c.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.taxCode || "--"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.phone || "--"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.email || "--"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.status === "ACTIVE" ? "default" : "secondary"}
                          className={`text-2xs ${c.status === "ACTIVE" ? "bg-emerald-600" : ""}`}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500"
                            onClick={() => {
                              setSelectedCompany(c);
                              setIsCompanyOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete("company", c.id, c.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── TAB 2: VÙNG MIỀN & CHI NHÁNH GPS ─────────────────────────── */}
      {activeTab === "branches" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Khu vực / Vùng miền */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                Khu vực địa lý ({regions.length})
              </h2>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2 gap-1"
                onClick={() => {
                  setSelectedRegion(null);
                  setIsRegionOpen(true);
                }}
              >
                <Plus className="h-3 w-3" />
                <span>Thêm khu vực</span>
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white divide-y divide-border overflow-hidden shadow-2xs">
              {isRegionsLoading ? (
                <div className="py-6 text-center text-xs text-muted-foreground">Đang tải khu vực...</div>
              ) : regions.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">Chưa có khu vực nào.</div>
              ) : (
                regions.map((r) => (
                  <div key={r.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <span className="text-xs font-semibold text-foreground block">{r.name}</span>
                      <span className="text-2xs font-mono text-muted-foreground">{r.code}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-foreground"
                        onClick={() => {
                          setSelectedRegion(r);
                          setIsRegionOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-slate-400 hover:text-destructive"
                        onClick={() => handleDelete("region", r.id, r.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cột phải: Chi nhánh văn phòng GPS */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-primary" />
                Chi nhánh & Geofence GPS ({branches.length})
              </h2>
              <Button
                size="sm"
                className="h-7 text-xs px-2.5 gap-1"
                disabled={regions.length === 0}
                onClick={() => {
                  setSelectedBranch(null);
                  setBranchRegionId(regions[0]?.id || "");
                  setIsBranchOpen(true);
                }}
              >
                <Plus className="h-3 w-3" />
                <span>Thêm chi nhánh</span>
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/75">
                    <TableHead className="w-28">Mã CN</TableHead>
                    <TableHead>Tên chi nhánh</TableHead>
                    <TableHead>Khu vực</TableHead>
                    <TableHead>Tọa độ GPS (Lat / Lng)</TableHead>
                    <TableHead className="w-24 text-center">Bán kính</TableHead>
                    <TableHead className="w-24 text-center">Trạng thái</TableHead>
                    <TableHead className="w-16 text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isBranchesLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                        Đang tải chi nhánh...
                      </TableCell>
                    </TableRow>
                  ) : branches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                        Chưa có chi nhánh nào thuộc công ty này.
                      </TableCell>
                    </TableRow>
                  ) : (
                    branches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs font-semibold text-primary">
                          {b.code}
                        </TableCell>
                        <TableCell className="font-medium text-xs text-foreground">
                          {b.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {b.regionName || "--"}
                        </TableCell>
                        <TableCell className="font-mono text-2xs text-muted-foreground">
                          {b.latitude && b.longitude ? (
                            <span>{b.latitude}, {b.longitude}</span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa cài GPS</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          {b.attendanceRadiusMeters}m
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={b.isActive ? "default" : "secondary"}
                            className={`text-2xs ${b.isActive ? "bg-emerald-600" : ""}`}
                          >
                            {b.isActive ? "Hoạt động" : "Ngưng"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-500"
                              onClick={() => {
                                setSelectedBranch(b);
                                setBranchRegionId(b.regionId);
                                setIsBranchOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => handleDelete("branch", b.id, b.name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: TRUNG TÂM CHI PHÍ ─────────────────────────────────── */}
      {activeTab === "cost-centers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Danh mục trung tâm chi phí hạch toán ngân sách độc lập theo từng khối / phòng ban
            </span>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => {
                setSelectedCostCenter(null);
                setIsCostCenterOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm trung tâm chi phí</span>
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/75">
                  <TableHead className="w-12 text-center">STT</TableHead>
                  <TableHead className="w-36">Mã trung tâm</TableHead>
                  <TableHead className="w-64">Tên trung tâm chi phí</TableHead>
                  <TableHead>Mô tả mục đích phân bổ ngân sách</TableHead>
                  <TableHead className="w-20 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCostCentersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      Đang tải trung tâm chi phí...
                    </TableCell>
                  </TableRow>
                ) : costCenters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      Chưa có trung tâm chi phí nào được thiết lập.
                    </TableCell>
                  </TableRow>
                ) : (
                  costCenters.map((cc, idx) => (
                    <TableRow key={cc.id}>
                      <TableCell className="text-center text-slate-500 text-xs font-normal">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {cc.code}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {cc.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {cc.description || "--"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500"
                            onClick={() => {
                              setSelectedCostCenter(cc);
                              setIsCostCenterOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => handleDelete("cost-center", cc.id, cc.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── TAB 4: CHỨC DANH & CẤP BẬC (JOB MATRIX) ──────────────────── */}
      {activeTab === "job-matrix" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột 1: Chức danh công việc */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-primary" />
                Chức danh chuyên môn ({jobTitles.length})
              </h2>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2 gap-1"
                onClick={() => {
                  setSelectedJobTitle(null);
                  setIsJobTitleOpen(true);
                }}
              >
                <Plus className="h-3 w-3" />
                <span>Thêm chức danh</span>
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/75">
                    <TableHead className="w-28">Mã</TableHead>
                    <TableHead>Tên chức danh</TableHead>
                    <TableHead className="w-16 text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isJobTitlesLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                        Đang tải chức danh...
                      </TableCell>
                    </TableRow>
                  ) : jobTitles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-xs text-muted-foreground">
                        Chưa có chức danh công việc nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobTitles.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs font-semibold text-primary">
                          {t.code}
                        </TableCell>
                        <TableCell className="font-medium text-xs text-foreground">
                          {t.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400"
                              onClick={() => {
                                setSelectedJobTitle(t);
                                setIsJobTitleOpen(true);
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDelete("job-title", t.id, t.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Cột 2: Cấp bậc thẩm quyền (rank_order) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary" />
                Thang Cấp bậc thẩm quyền ({jobLevels.length})
              </h2>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs px-2 gap-1"
                onClick={() => {
                  setSelectedJobLevel(null);
                  setIsJobLevelOpen(true);
                }}
              >
                <Plus className="h-3 w-3" />
                <span>Thêm cấp bậc</span>
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/75">
                    <TableHead className="w-16 text-center">Cấp</TableHead>
                    <TableHead className="w-24">Mã</TableHead>
                    <TableHead>Tên cấp bậc thẩm quyền</TableHead>
                    <TableHead className="w-16 text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isJobLevelsLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                        Đang tải cấp bậc...
                      </TableCell>
                    </TableRow>
                  ) : jobLevels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-xs text-muted-foreground">
                        Chưa có cấp bậc nào được thiết lập.
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobLevels.map((lvl) => (
                      <TableRow key={lvl.id}>
                        <TableCell className="text-center font-mono font-bold text-xs text-primary">
                          #{lvl.rankOrder}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-slate-700">
                          {lvl.code}
                        </TableCell>
                        <TableCell className="font-medium text-xs text-foreground">
                          {lvl.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-slate-400"
                              onClick={() => {
                                setSelectedJobLevel(lvl);
                                setIsJobLevelOpen(true);
                              }}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDelete("job-level", lvl.id, lvl.name)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* ── Dialogs ─────────────────────────────────────────────────── */}
      <CompanyFormDialog
        open={isCompanyOpen}
        onOpenChange={setIsCompanyOpen}
        company={selectedCompany}
        onSuccess={() => refetchCompanies()}
      />

      <RegionFormDialog
        open={isRegionOpen}
        onOpenChange={setIsRegionOpen}
        region={selectedRegion}
        companyId={selectedCompanyId}
        onSuccess={() => refetchRegions()}
      />

      <BranchFormDialog
        open={isBranchOpen}
        onOpenChange={setIsBranchOpen}
        branch={selectedBranch}
        regionId={branchRegionId}
        onSuccess={() => refetchBranches()}
      />

      <CostCenterFormDialog
        open={isCostCenterOpen}
        onOpenChange={setIsCostCenterOpen}
        costCenter={selectedCostCenter}
        companyId={selectedCompanyId}
        onSuccess={() => refetchCostCenters()}
      />

      <JobTitleFormDialog
        open={isJobTitleOpen}
        onOpenChange={setIsJobTitleOpen}
        jobTitle={selectedJobTitle}
        companyId={selectedCompanyId}
        onSuccess={() => refetchJobTitles()}
      />

      <JobLevelFormDialog
        open={isJobLevelOpen}
        onOpenChange={setIsJobLevelOpen}
        jobLevel={selectedJobLevel}
        companyId={selectedCompanyId}
        onSuccess={() => refetchJobLevels()}
      />

      {/* Confirm Dialog xóa bản ghi chuẩn shadcn */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title="Xác nhận xóa bản ghi"
        description={`Bạn có chắc chắn muốn xóa "${deleteConfirm.name}"? Dữ liệu sẽ được chuyển vào trạng thái xóa mềm.`}
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        isLoading={deleteConfirm.isLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  </PermissionGuard>
  );
}

