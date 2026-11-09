"use client";

import React from "react";
import { Search, RotateCcw, Download, Building2, Layers, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMPLOYEE_STATUS_OPTIONS,
  EMPLOYEE_STATUS_LABELS,
} from "../constants/employee.constants";

interface CompanyItem {
  id: string;
  name: string;
  code?: string;
}

interface DepartmentItem {
  id: string;
  name: string;
  code?: string;
}

interface EmployeeFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  companies: CompanyItem[];
  selectedCompanyId: string;
  onCompanyChange: (id: string) => void;
  departments: DepartmentItem[];
  selectedDepartmentId: string;
  onDepartmentChange: (id: string) => void;
  selectedStatus?: string;
  onStatusChange: (status: string) => void;
  onReset: () => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function EmployeeFilters({
  keyword,
  onKeywordChange,
  companies,
  selectedCompanyId,
  onCompanyChange,
  departments,
  selectedDepartmentId,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  onReset,
  onExport,
  isExporting,
}: EmployeeFiltersProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardContent className="p-3.5 space-y-3">
        {/* Hàng 1: Ô tìm kiếm từ khóa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã NV, họ tên, email, số điện thoại..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="pl-9 text-sm h-9 bg-background"
          />
        </div>

        {/* Hàng 2: Bộ lọc phân cấp Công ty - Phòng ban - Trạng thái & Thao tác */}
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
                    const c = companies.find((i) => i.id === val);
                    return c ? (c.code ? `${c.name} (${c.code})` : c.name) : val;
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

          {/* Dropdown Phòng ban */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
            <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Phòng ban:</span>
            <Select
              value={selectedDepartmentId || "all"}
              onValueChange={(val) => onDepartmentChange(val === "all" ? "" : (val || ""))}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Tất cả phòng ban">
                  {(val: string) => {
                    if (!val || val === "all") return "Tất cả phòng ban";
                    const d = departments.find((i) => i.id === val);
                    return d ? (d.code ? `${d.name} (${d.code})` : d.name) : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" label="Tất cả phòng ban">
                  Tất cả phòng ban
                </SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id} label={d.name}>
                    {d.name} {d.code ? `(${d.code})` : ""}
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
              value={selectedStatus || "ALL"}
              onValueChange={(val) => onStatusChange(val || "ALL")}
            >
              <SelectTrigger className="w-full h-8 text-xs bg-background">
                <SelectValue placeholder="Tất cả trạng thái">
                  {(val: string) => {
                    if (!val || val === "ALL") return "Tất cả trạng thái";
                    return EMPLOYEE_STATUS_LABELS[val] || val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nút Xóa bộ lọc & Xuất Excel */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại
            </Button>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={isExporting}
                className="h-8 text-xs gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? "Đang xuất..." : "Xuất Excel"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

