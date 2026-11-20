"use client";

import React from "react";
import { Search, X, Filter, Clock, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSFER_TYPE_LABELS } from "../constants/transfer.constants";

interface DepartmentOption {
  id: string;
  name: string;
}

interface TransferFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  transferType: string;
  onTransferTypeChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  departmentId: string;
  onDepartmentIdChange: (val: string) => void;
  onReset: () => void;
  departments?: DepartmentOption[];
  hasActiveFilters?: boolean;
}

export function TransferFilters({
  keyword,
  onKeywordChange,
  transferType,
  onTransferTypeChange,
  status,
  onStatusChange,
  departmentId,
  onDepartmentIdChange,
  onReset,
  departments = [],
  hasActiveFilters = false,
}: TransferFiltersProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Ô nhập tìm kiếm từ khóa chính */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo họ tên, mã nhân viên, lý do điều chuyển..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 pr-9 text-sm h-9 bg-background"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => onKeywordChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hàng 2: Các Dropdown bộ lọc theo trường + Nút Đặt lại */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Nhóm Filter 1: Loại điều chuyển */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Loại hình:</span>
          <Select value={transferType} onValueChange={(val) => val && onTransferTypeChange(val)}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả loại hình" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại hình</SelectItem>
              {Object.entries(TRANSFER_TYPE_LABELS).map(([k, label]) => (
                <SelectItem key={k} value={k}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhóm Filter 2: Trạng thái */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select value={status} onValueChange={(val) => val && onStatusChange(val)}>
            <SelectTrigger className="h-8 text-xs bg-background flex-1">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="DRAFT">Dự thảo</SelectItem>
              <SelectItem value="PENDING_APPROVAL">Chờ phê duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
              <SelectItem value="COMPLETED">Đã áp dụng</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nhóm Filter 3: Phòng ban tiếp nhận */}
        {departments.length > 0 && (
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground shrink-0">Phòng ban đích:</span>
            <Select value={departmentId} onValueChange={(val) => val && onDepartmentIdChange(val)}>
              <SelectTrigger className="h-8 text-xs bg-background flex-1">
                <SelectValue placeholder="Tất cả phòng ban">
                  {(val: string) => (!val || val === "ALL" ? "Tất cả phòng ban" : departments.find((d) => d.id === val)?.name || val)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả phòng ban</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Nút Đặt lại (Reset) */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0 ml-auto"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>
    </div>
  );
}
