"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Building2, Filter, FileText, Calendar } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
} from "../constants/contract.constants";
import type { ContractStatus, ContractType } from "../types/contract.types";

interface CompanyItem {
  id: string;
  name: string;
  code?: string;
}

interface ContractFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  companies: CompanyItem[];
  selectedCompanyId: string;
  onCompanyChange: (id: string) => void;
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
  selectedType?: string;
  onTypeChange: (type: string) => void;
  expiringFilter: string;
  onExpiringChange: (exp: string) => void;
  onReset: () => void;
}

export function ContractFilters({
  search,
  onSearchChange,
  companies,
  selectedCompanyId,
  onCompanyChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  expiringFilter,
  onExpiringChange,
  onReset,
}: ContractFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  const debouncedSearchChange = useDebouncedCallback((val: string) => {
    onSearchChange(val);
  }, 350);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedSearchChange(val);
  };

  const handleReset = () => {
    setSearchTerm("");
    onReset();
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo số HĐ, tên hợp đồng, họ tên nhân viên, mã nhân viên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

        {/* Hàng 2: Các dropdown lọc chuẩn Design System (Rule 11.8) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dropdown Công ty */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
            <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Công ty:</span>
            <Select
              value={selectedCompanyId}
              onValueChange={(val) => val && onCompanyChange(val)}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
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

          {/* Dropdown Trạng thái */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
            <Select
              value={selectedStatus || "all"}
              onValueChange={(val) => onStatusChange(val || "all")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Tất cả trạng thái">
                  {(val: string) => {
                    if (!val || val === "all") return "Tất cả trạng thái";
                    return CONTRACT_STATUS_LABELS[val as ContractStatus] || val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" label="Tất cả trạng thái">
                  Tất cả trạng thái
                </SelectItem>
                {Object.entries(CONTRACT_STATUS_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k} label={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Loại hợp đồng */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Loại HĐ:</span>
            <Select
              value={selectedType || "all"}
              onValueChange={(val) => onTypeChange(val || "all")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Tất cả loại HĐ">
                  {(val: string) => {
                    if (!val || val === "all") return "Tất cả loại HĐ";
                    return CONTRACT_TYPE_LABELS[val as ContractType] || val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" label="Tất cả loại HĐ">
                  Tất cả loại HĐ
                </SelectItem>
                {Object.entries(CONTRACT_TYPE_LABELS).map(([k, label]) => (
                  <SelectItem key={k} value={k} label={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Hạn hợp đồng */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[190px]">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Thời hạn:</span>
            <Select
              value={expiringFilter || "all"}
              onValueChange={(val) => onExpiringChange(val || "all")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Tất cả thời hạn">
                  {(val: string) => {
                    if (val === "30") return "Hết hạn trong 30 ngày";
                    if (val === "60") return "Hết hạn trong 60 ngày";
                    return "Tất cả thời hạn";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" label="Tất cả thời hạn">
                  Tất cả thời hạn
                </SelectItem>
                <SelectItem value="30" label="Hết hạn trong 30 ngày">
                  Hết hạn trong 30 ngày
                </SelectItem>
                <SelectItem value="60" label="Hết hạn trong 60 ngày">
                  Hết hạn trong 60 ngày
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nút đặt lại */}
          <div className="shrink-0 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại
            </Button>
          </div>
        </div>
    </div>
  );
}

