"use client";

import React from "react";
import { Search, RotateCcw, LayoutList, Kanban, CheckCircle2, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ONBOARDING_STATUS_OPTIONS } from "../../constants/onboarding.constants";
import { useGetDepartmentsQuery } from "@/features/organization/api/department-api";

interface ProcessFiltersProps {
  search: string;
  status: string;
  departmentId: string;
  viewMode: "list" | "kanban";
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onDepartmentChange: (val: string) => void;
  onViewModeChange: (mode: "list" | "kanban") => void;
  onReset: () => void;
}

export function ProcessFilters({
  search,
  status,
  departmentId,
  viewMode,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onViewModeChange,
  onReset,
}: ProcessFiltersProps) {
  const { data: departmentData } = useGetDepartmentsQuery({ page: 0, size: 100 });
  const departments = departmentData?.items || [];

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Row 1: Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên nhân viên, mã NV, vị trí..."
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Row 2: Selects + View Mode + Reset */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc Trạng thái tiến trình */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select
            value={status}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc Phòng ban */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Phòng ban:</span>
          <Select
            value={departmentId || "ALL"}
            onValueChange={(val) => onDepartmentChange(!val || val === "ALL" ? "" : val)}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
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

        {/* Chế độ xem List / Kanban */}
        <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`h-7 px-2.5 text-xs gap-1.5 rounded-md cursor-pointer ${
              viewMode === "list"
                ? "bg-card text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutList className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Danh sách</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange("kanban")}
            className={`h-7 px-2.5 text-xs gap-1.5 rounded-md cursor-pointer ${
              viewMode === "kanban"
                ? "bg-card text-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </Button>
        </div>

        {/* Nút đặt lại */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground ml-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}

