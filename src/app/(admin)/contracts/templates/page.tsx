"use client";

import React, { useState } from "react";
import {
  FileCode,
  Plus,
  Search,
  Eye,
  Edit,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetCompaniesQuery } from "@/features/organization/api";
import { useGetContractTemplatesQuery } from "@/features/contract/api/contract-api";
import { TEMPLATE_KIND_LABELS } from "@/features/contract/constants/contract.constants";
import type { ContractTemplate, TemplateKind } from "@/features/contract/types/contract.types";

export default function ContractTemplatesPage() {
  const router = useRouter();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [kindFilter, setKindFilter] = useState<string>("all");

  // Companies
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  React.useEffect(() => {
    if (!selectedCompanyId && companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  // Templates
  const {
    data: templatesData,
    isLoading,
    refetch,
  } = useGetContractTemplatesQuery({
    companyId: selectedCompanyId || undefined,
    page: 0,
    size: 50,
    kind: kindFilter !== "all" ? kindFilter : undefined,
    search: search.trim() || undefined,
  });

  const templates = templatesData?.items || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/contracts">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-1 text-slate-500">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileCode className="w-6 h-6 text-primary" />
              Quản lý Biểu mẫu Hợp đồng
            </h1>
          </div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 ml-9">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/contracts" className="hover:text-primary transition-colors">
              Hợp đồng lao động
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Biểu mẫu hợp đồng</span>
          </nav>
        </div>

        <Link href="/contracts/templates/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo biểu mẫu mới
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc mã biểu mẫu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Dropdown Công ty */}
          <div className="flex items-center gap-2 w-full sm:w-64">
            <Select
              value={selectedCompanyId}
              onValueChange={(val) => val && setSelectedCompanyId(val)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Chọn công ty...">
                  {(val: string) => {
                    if (!val) return "Chọn công ty...";
                    const c = companies.find((i) => i.id === val);
                    return c ? (c.code ? `${c.name} (${c.code})` : c.name) : "Chọn công ty...";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id} label={c.name}>
                    {c.name} {c.code ? `(${c.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-64">
            <Select
              value={kindFilter}
              onValueChange={(val) => val && setKindFilter(val)}
            >
              <SelectTrigger className="w-full h-9 text-xs">
                <SelectValue placeholder="Tất cả phân loại">
                  {(val: string) => {
                    if (!val || val === "all") return "Tất cả phân loại";
                    return TEMPLATE_KIND_LABELS[val as TemplateKind] || val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" label="Tất cả phân loại">
                  Tất cả phân loại
                </SelectItem>
                {Object.entries(TEMPLATE_KIND_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k} label={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Mã mẫu</TableHead>
                <TableHead>Tên biểu mẫu</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead className="w-28 text-center">Trạng thái</TableHead>
                <TableHead className="w-36 text-center">Phiên bản áp dụng</TableHead>
                <TableHead className="w-32 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Đang tải danh sách biểu mẫu...
                  </TableCell>
                </TableRow>
              ) : templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Chưa có biểu mẫu hợp đồng nào được tạo.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map((tpl) => (
                  <TableRow key={tpl.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      <Link
                        href={`/contracts/templates/${tpl.id}`}
                        className="hover:underline text-primary"
                      >
                        {tpl.templateCode}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/contracts/templates/${tpl.id}`}
                        className="space-y-0.5 block hover:underline"
                      >
                        <span className="font-medium text-sm text-foreground">
                          {tpl.name}
                        </span>
                        {tpl.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {tpl.description}
                          </p>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline">
                        {TEMPLATE_KIND_LABELS[tpl.kind] || tpl.kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {tpl.isActive ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Đã ẩn
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {tpl.activeVersion ? (
                        <span className="font-semibold text-primary">
                          v{tpl.activeVersion.versionNumber} ({tpl.activeVersion.format})
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Chưa phát hành</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/contracts/templates/${tpl.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Chỉnh sửa
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

