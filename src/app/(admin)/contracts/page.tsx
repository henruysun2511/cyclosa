"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  FileSignature,
  Building2,
  Calendar,
  AlertTriangle,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useGetCompaniesQuery } from "@/features/organization/api";
import { useGetContractsQuery } from "@/features/contract/api/contract-api";
import { ContractStatsCards } from "@/features/contract/components/contract-stats-cards";
import {
  ContractStatusBadge,
  ContractTypeBadge,
} from "@/features/contract/components/contract-status-badge";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
} from "@/features/contract/constants/contract.constants";
import { ContractCreateDialog } from "@/features/contract/components/dialogs/contract-create-dialog";
import { ContractDetailDialog } from "@/features/contract/components/dialogs/contract-detail-dialog";
import { ContractSigningDialog } from "@/features/contract/components/dialogs/contract-signing-dialog";
import type {
  ContractStatus,
  ContractType,
  ContractSummary,
} from "@/features/contract/types/contract.types";

export default function ContractsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expiringFilter, setExpiringFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(0);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [signingContract, setSigningContract] = useState<{ id: string; number: string } | null>(
    null
  );

  // Companies
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  React.useEffect(() => {
    if (!selectedCompanyId && companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  // Expiring filter calculation
  let expiringBefore: string | undefined = undefined;
  if (expiringFilter === "30") {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    expiringBefore = d.toISOString().split("T")[0];
  } else if (expiringFilter === "60") {
    const d = new Date();
    d.setDate(d.getDate() + 60);
    expiringBefore = d.toISOString().split("T")[0];
  }

  // Contracts
  const {
    data: contractsData,
    isLoading,
    refetch,
  } = useGetContractsQuery(
    {
      companyId: selectedCompanyId || undefined,
      status: selectedStatus !== "all" && selectedStatus !== "EXPIRING" ? (selectedStatus as ContractStatus) : undefined,
      contractType: selectedType !== "all" ? (selectedType as ContractType) : undefined,
      expiringBefore: selectedStatus === "EXPIRING" ? expiringBefore || new Date(Date.now() + 60*24*60*60*1000).toISOString().split("T")[0] : expiringBefore,
      search: search.trim() || undefined,
      page,
      size: 20,
    },
    { skip: !selectedCompanyId }
  );

  const contracts = contractsData?.items || [];

  const handleOpenDetail = (contractId: string) => {
    setSelectedContractId(contractId);
    setIsDetailOpen(true);
  };

  const handleOpenSigning = (contract: ContractSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setSigningContract({ id: contract.id, number: contract.contractNumber });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Quản lý Hợp đồng Lao động & Ký điện tử
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý toàn diện vòng đời hợp đồng lao động, phụ lục điều chỉnh và tiến độ ký số E-Contract.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/contracts/templates">
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Biểu mẫu HĐ
            </Button>
          </Link>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Soạn thảo hợp đồng
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <ContractStatsCards
        contracts={contracts}
        selectedStatus={selectedStatus}
        onFilterStatus={(st) => setSelectedStatus(st || "all")}
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo số HĐ, họ tên hoặc mã nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(CONTRACT_STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>

            {/* Loại HĐ */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Tất cả loại HĐ</option>
              {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>

            {/* Hạn HĐ */}
            <select
              value={expiringFilter}
              onChange={(e) => setExpiringFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">Mọi thời hạn</option>
              <option value="30">Sắp hết hạn trong 30 ngày</option>
              <option value="60">Sắp hết hạn trong 60 ngày</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Số hợp đồng</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Loại hợp đồng</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead className="text-right">Lương cơ bản</TableHead>
                <TableHead className="w-32 text-center">Trạng thái</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Đang tải danh sách hợp đồng...
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy hợp đồng lao động nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow
                    key={contract.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpenDetail(contract.id)}
                  >
                    <TableCell className="font-mono text-xs font-semibold">
                      {contract.contractNumber}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-medium text-sm text-foreground">
                          {contract.employeeName}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {contract.employeeCode}
                          {contract.jobTitleName && ` • ${contract.jobTitleName}`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ContractTypeBadge type={contract.contractType} />
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{contract.startDate}</span>
                        <span>→</span>
                        <span>{contract.endDate || "Không xác định"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs font-mono">
                      {Number(contract.baseSalary).toLocaleString("vi-VN")} đ
                    </TableCell>
                    <TableCell className="text-center">
                      <ContractStatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {contract.status === "IN_SIGNING" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-purple-600 gap-1 text-xs"
                            onClick={(e) => handleOpenSigning(contract, e)}
                          >
                            <FileSignature className="w-3.5 h-3.5" />
                            Ký số
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleOpenDetail(contract.id)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Xem
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {isCreateOpen && (
        <ContractCreateDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          companyId={selectedCompanyId}
          onSuccess={() => refetch()}
        />
      )}

      {isDetailOpen && selectedContractId && (
        <ContractDetailDialog
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          contractId={selectedContractId}
          onSuccess={() => refetch()}
        />
      )}

      {signingContract && (
        <ContractSigningDialog
          open={Boolean(signingContract)}
          onOpenChange={(op) => !op && setSigningContract(null)}
          contractId={signingContract.id}
          contractNumber={signingContract.number}
          isSelfSigning={true}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

