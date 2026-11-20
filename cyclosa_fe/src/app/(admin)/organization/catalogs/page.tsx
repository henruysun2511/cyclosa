"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Tag,
  Briefcase,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PermissionGuard } from "@/features/authorization/components/permission-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetCompaniesQuery,
  useGetBranchesByCompanyQuery,
  useGetAllCostCentersQuery,
  useGetAllJobTitlesQuery,
  useGetAllJobLevelsQuery,
} from "@/features/organization/api/organization-api";
import { useCatalogFilters } from "@/features/organization/hooks/use-catalog-filters";
import {
  DEFAULT_COMPANY_ID,
  CATALOG_TABS,
  type CatalogTab,
} from "@/features/organization/constants/organization.constants";
import {
  CatalogStatsCards,
  CompanyCatalogTab,
  BranchCatalogTab,
  CostCenterCatalogTab,
  JobMatrixCatalogTab,
} from "@/features/organization/components/catalogs";
import type { Company } from "@/features/organization/types";

export default function OrganizationCatalogsPage() {
  const {
    activeTab,
    companyId: selectedCompanyId,
    setTab: setActiveTab,
    setCompanyId: setSelectedCompanyId,
  } = useCatalogFilters();

  // Queries cho Danh sách Công ty & Dữ liệu Tổng quan KPI
  const {
    data: companiesData,
    isLoading: isCompaniesLoading,
  } = useGetCompaniesQuery({ size: 100 });

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

  // Tự động chọn công ty hợp lệ đầu tiên nếu chưa chọn hoặc ID không tồn tại
  React.useEffect(() => {
    if (companies.length > 0) {
      const exists = companies.some((c) => c.id === selectedCompanyId);
      if (!selectedCompanyId || !exists) {
        setSelectedCompanyId(companies[0].id);
      }
    }
  }, [companies, selectedCompanyId, setSelectedCompanyId]);

  // Queries số liệu phụ vụ KPI Stats Cards theo công ty đang chọn
  const { data: branches = [] } = useGetBranchesByCompanyQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const { data: costCenters = [] } = useGetAllCostCentersQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const { data: jobTitles = [] } = useGetAllJobTitlesQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  const { data: jobLevels = [] } = useGetAllJobLevelsQuery(selectedCompanyId, {
    skip: !selectedCompanyId,
  });

  return (
    <PermissionGuard permission={PERMISSIONS.ORG.VIEW}>
      <div className="space-y-6 pb-12">
        {/* ── 1. Page Header Chuẩn mực (Rule 02) ────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
              <Layers className="w-6 h-6 text-primary shrink-0" />
              <span>Danh mục Cơ cấu Tổ chức</span>
            </h1>

            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/organization" className="hover:text-primary transition-colors">
                Cơ cấu tổ chức
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">Danh mục tổ chức</span>
            </nav>
          </div>

          {/* Selector Công ty áp dụng cho các danh mục phụ thuộc */}
          {activeTab !== CATALOG_TABS.COMPANIES && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 w-full sm:w-auto">
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block shrink-0">
                Pháp nhân:
              </span>
              <div className="w-full sm:w-80">
                <Select
                  value={selectedCompanyId}
                  onValueChange={(val) => val && setSelectedCompanyId(val)}
                >
                  <SelectTrigger className="w-full h-9 text-xs bg-background border-border overflow-hidden">
                    <SelectValue placeholder="Chọn công ty / pháp nhân">
                      {(val: string) => {
                        const comp = companies.find((c) => c.id === val);
                        if (comp) {
                          return (
                            <span className="truncate max-w-[220px] text-left block font-medium">
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
            </div>
          )}
        </div>

        {/* ── 2. Thẻ KPI Stats Cards Chuẩn (Rule 03) ────────────────────── */}
        <CatalogStatsCards
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          companyCount={companiesData?.pagination?.total || companies.length}
          branchCount={branches.length}
          costCenterCount={costCenters.length}
          jobTitleCount={jobTitles.length}
          jobLevelCount={jobLevels.length}
          isLoading={isCompaniesLoading}
        />

        {/* ── 3. Tabs Navigation Đồng bộ Hệ thống ───────────────────────── */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as CatalogTab)}
          className="space-y-4"
        >
          <TabsList className="h-10 bg-slate-100 p-1 rounded-xl w-full sm:w-auto flex flex-wrap gap-1">
            <TabsTrigger
              value={CATALOG_TABS.COMPANIES}
              className="gap-2 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Công ty & Pháp nhân</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-2xs font-mono font-medium">
                {companiesData?.pagination?.total || companies.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value={CATALOG_TABS.BRANCHES}
              className="gap-2 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Vùng miền & Chi nhánh (GPS)</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-2xs font-mono font-medium">
                {branches.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value={CATALOG_TABS.COST_CENTERS}
              className="gap-2 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all"
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Trung tâm Chi phí</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-2xs font-mono font-medium">
                {costCenters.length}
              </Badge>
            </TabsTrigger>

            <TabsTrigger
              value={CATALOG_TABS.JOB_MATRIX}
              className="gap-2 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all"
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Chức danh & Cấp bậc</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-2xs font-mono font-medium">
                {jobTitles.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Công ty & Pháp nhân ────────────────────────────── */}
          <TabsContent value={CATALOG_TABS.COMPANIES} className="mt-0">
            <CompanyCatalogTab />
          </TabsContent>

          {/* ── Tab 2: Vùng miền & Chi nhánh GPS ──────────────────────── */}
          <TabsContent value={CATALOG_TABS.BRANCHES} className="mt-0">
            <BranchCatalogTab companyId={selectedCompanyId} />
          </TabsContent>

          {/* ── Tab 3: Trung tâm Chi phí ───────────────────────────────── */}
          <TabsContent value={CATALOG_TABS.COST_CENTERS} className="mt-0">
            <CostCenterCatalogTab companyId={selectedCompanyId} />
          </TabsContent>

          {/* ── Tab 4: Chức danh & Cấp bậc ────────────────────────────── */}
          <TabsContent value={CATALOG_TABS.JOB_MATRIX} className="mt-0">
            <JobMatrixCatalogTab companyId={selectedCompanyId} />
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  );
}
