"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RotateCcw } from "lucide-react";
import type { OffboardingStatus, OffboardingType } from "../types/offboarding.types";

interface OffboardingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type?: OffboardingType;
  onTypeChange: (value: string) => void;
  status?: OffboardingStatus;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  isPending?: boolean;
}

export function OffboardingFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  onReset,
  isPending,
}: OffboardingFiltersProps) {
  return (
    <div className="space-y-3 bg-card p-4 rounded-xl border border-border/60 shadow-sm">
      {/* Hàng 1: Search input full width */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo họ tên nhân viên, mã nhân viên, số quyết định..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 w-full"
        />
      </div>

      {/* Hàng 2: Bộ lọc linh hoạt & nút Reset */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-[220px]">
          <Select
            value={type || "ALL"}
            onValueChange={(val) => onTypeChange(val || "ALL")}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Loại hồ sơ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại hồ sơ</SelectItem>
              <SelectItem value="RESIGNATION">Thôi việc tự nguyện</SelectItem>
              <SelectItem value="TERMINATION">Quyết định chấm dứt HĐLĐ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[200px]">
          <Select
            value={status || "ALL"}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ phê duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
              <SelectItem value="PROCESSING">Đang bàn giao</SelectItem>
              <SelectItem value="COMPLETED">Đã hoàn tất</SelectItem>
              <SelectItem value="REJECTED">Đã từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={isPending}
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Làm mới
          </Button>
        </div>
      </div>
    </div>
  );
}
