"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, FileCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { useGetCompaniesQuery } from "@/features/organization/api";
import {
  useGetContractsQuery,
  useContractFilters,
  ContractStatsCards,
  ContractFilters,
  ContractTable,
  ContractFormDialog,
  ContractDetailDialog,
  ContractSigningDialog,
  ContractAppendixDialog,
} from "@/features/contract";
import type { ContractDetail } from "@/features/contract/types/contract.types";

export default function ContractsPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.EMPLOYEE.CREATE);

  // Hook quản lý bộ lọc và phân trang URL Search Params (Rule 7.2 & 4.2)
  const {
    search,
    debouncedSearch,
    companyId,
    status,
    statusParam,
    contractType,
    typeParam,
    expiringFilter,
    expiringBefore,
    page,
    size,
    setSearch,
    setCompanyId,
    setStatus,
    setContractType,
    setExpiringFilter,
    setPage,
    setSize,
    resetFilters,
  } = useContractFilters();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractDetail | null>(null);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [signingContract, setSigningContract] = useState<{ id: string; number: string } | null>(
    null
  );
  const [appendixContract, setAppendixContract] = useState<{ id: string; number: string } | null>(
    null
  );

  // Nạp danh sách công ty
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  // Tự động chọn công ty đầu tiên lên URL nếu chưa có
  useEffect(() => {
    if (!companyId && companies.length > 0) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId, setCompanyId]);

  // Nạp danh sách hợp đồng
  const {
    data: contractsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetContractsQuery({
    companyId: companyId || undefined,
    status: status,
    contractType: contractType,
    expiringBefore: expiringBefore,
    search: debouncedSearch.trim() || undefined,
    page,
    size,
  });

  const contracts = contractsData?.items || [];
  const totalElements = contractsData?.pagination?.total || 0;

  // Thống kê nhanh từ danh sách
  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const inSigningCount = contracts.filter((c) => c.status === "IN_SIGNING").length;
  const draftCount = contracts.filter((c) => c.status === "DRAFT").length;
  const expiringCount = contracts.filter((c) => {
    if (!c.endDate || c.status !== "ACTIVE") return false;
    const diff = (new Date(c.endDate).getTime() - Date.now()) / (1000 * 3600 * 24);
    return diff > 0 && diff <= 60;
  }).length;

  const handleOpenCreate = () => {
    setEditingContract(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const item = contracts.find((c) => c.id === id);
    if (item) {
      setEditingContract(item as unknown as ContractDetail);
      setIsFormOpen(true);
    }
  };

  const handleOpenDetail = (id: string) => {
    setSelectedContractId(id);
    setIsDetailOpen(true);
  };

  const handleOpenSign = (contract: { id: string; number: string }) => {
    setSigningContract(contract);
  };

  const handleOpenAddAppendix = (id: string) => {
    const item = contracts.find((c) => c.id === id);
    if (item) {
      setAppendixContract({ id: item.id, number: item.contractNumber });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Header & Nút Điều hướng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Quản lý Hợp đồng Lao động & Ký điện tử
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản trị vòng đời hợp đồng lao động, đối soát Bộ luật Lao động 2019 và luồng ký số OTP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/contracts/templates">
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <FileCode className="w-4 h-4 text-primary" />
              Mẫu hợp đồng
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          {canManage && (
            <Button size="sm" onClick={handleOpenCreate} className="h-9 gap-1.5 shadow-xs">
              <Plus className="w-4 h-4" />
              Soạn thảo hợp đồng
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thẻ KPI Thống kê nhanh */}
      <ContractStatsCards
        contracts={contracts}
        onFilterStatus={(st) => setStatus(st || "all")}
        selectedStatus={statusParam}
      />

      {/* 3. Thanh Lọc Chuẩn Select (Rule 11.8) */}
      <ContractFilters
        search={search}
        onSearchChange={setSearch}
        companies={companies}
        selectedCompanyId={companyId}
        onCompanyChange={setCompanyId}
        selectedStatus={statusParam}
        onStatusChange={setStatus}
        selectedType={typeParam}
        onTypeChange={setContractType}
        expiringFilter={expiringFilter}
        onExpiringChange={setExpiringFilter}
        onReset={resetFilters}
      />

      {/* 4. Bảng Dữ liệu Chuẩn Table */}
      <ContractTable
        contracts={contracts}
        isLoading={isLoading}
        page={page}
        totalPages={contractsData?.pagination?.pages || 1}
        totalItems={totalElements}
        onPageChange={setPage}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onSign={handleOpenSign}
        onAddAppendix={handleOpenAddAppendix}
        canManage={canManage}
      />

      {/* 5. Dialog CRUD Hợp nhất (Rule 11.2) */}
      <ContractFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        companyId={companyId}
        contract={editingContract}
        onSuccess={() => refetch()}
      />

      {/* 6. Dialog Xem Chi tiết Hợp đồng */}
      <ContractDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        contractId={selectedContractId || ""}
        onSuccess={() => refetch()}
      />

      {/* 7. Dialog Ký số OTP điện tử */}
      {signingContract && (
        <ContractSigningDialog
          open={Boolean(signingContract)}
          onOpenChange={(open) => !open && setSigningContract(null)}
          contractId={signingContract.id}
          contractNumber={signingContract.number}
          onSuccess={() => refetch()}
        />
      )}

      {/* 8. Dialog Phụ lục Hợp đồng */}
      {appendixContract && (
        <ContractAppendixDialog
          open={Boolean(appendixContract)}
          onOpenChange={(open) => !open && setAppendixContract(null)}
          contractId={appendixContract.id}
          contractNumber={appendixContract.number}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
