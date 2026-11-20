"use client";

import React from "react";
import { Search, X, RotateCcw, ShieldAlert, Building2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RISK_LEVEL_CONFIG, TALENT_TAG_CONFIG } from "../constants/career.constants";
import type { RiskLevel, TalentTag } from "../types/career.types";

interface CareerPathFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  onReset: () => void;
}

export function CareerPathFilters({
  search,
  onSearchChange,
  onReset,
}: CareerPathFiltersProps) {
  const hasActiveFilters = search.trim() !== "";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo chức danh khởi điểm hoặc mục tiêu..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9 w-full bg-background/50 h-9 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
}

interface SuccessionFiltersProps {
  search: string;
  riskLevel: RiskLevel | "ALL";
  departmentId: string;
  departments: { id: string; name: string }[];
  onSearchChange: (val: string) => void;
  onRiskChange: (val: RiskLevel | "ALL") => void;
  onDepartmentChange: (val: string) => void;
  onReset: () => void;
}

export function SuccessionFilters({
  search,
  riskLevel,
  departmentId,
  departments,
  onSearchChange,
  onRiskChange,
  onDepartmentChange,
  onReset,
}: SuccessionFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" || riskLevel !== "ALL" || departmentId !== "ALL";

  const selectedDept = departments.find((d) => d.id === departmentId);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo chức danh trọng yếu, phòng ban hoặc người đương nhiệm..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 w-full bg-background/50 h-9 text-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-[220px]">
          <Select
            value={riskLevel}
            onValueChange={(val) => onRiskChange((val as RiskLevel | "ALL") || "ALL")}
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Mức rủi ro:</span>
                <SelectValue placeholder="Tất cả mức độ">
                  {riskLevel && riskLevel !== "ALL"
                    ? RISK_LEVEL_CONFIG[riskLevel]?.label || riskLevel
                    : "Tất cả mức độ"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả mức độ</SelectItem>
              {Object.entries(RISK_LEVEL_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[240px]">
          <Select
            value={departmentId}
            onValueChange={(val) => onDepartmentChange(val || "ALL")}
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Phòng ban:</span>
                <SelectValue placeholder="Tất cả phòng ban">
                  {selectedDept ? selectedDept.name : "Tất cả phòng ban"}
                </SelectValue>
              </div>
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
}

interface TalentPoolFiltersProps {
  search: string;
  tag: TalentTag | "ALL";
  departmentId: string;
  departments: { id: string; name: string }[];
  onSearchChange: (val: string) => void;
  onTagChange: (val: TalentTag | "ALL") => void;
  onDepartmentChange: (val: string) => void;
  onReset: () => void;
}

export function TalentPoolFilters({
  search,
  tag,
  departmentId,
  departments,
  onSearchChange,
  onTagChange,
  onDepartmentChange,
  onReset,
}: TalentPoolFiltersProps) {
  const hasActiveFilters =
    search.trim() !== "" || tag !== "ALL" || departmentId !== "ALL";

  const selectedDept = departments.find((d) => d.id === departmentId);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên nhân sự, mã nhân viên hoặc lý do bình chọn..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 w-full bg-background/50 h-9 text-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-[240px]">
          <Select
            value={tag}
            onValueChange={(val) => onTagChange((val as TalentTag | "ALL") || "ALL")}
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Thẻ nhân tài:</span>
                <SelectValue placeholder="Tất cả thẻ">
                  {tag && tag !== "ALL"
                    ? TALENT_TAG_CONFIG[tag]?.label || tag
                    : "Tất cả thẻ"}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả thẻ</SelectItem>
              {Object.entries(TALENT_TAG_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[240px]">
          <Select
            value={departmentId}
            onValueChange={(val) => onDepartmentChange(val || "ALL")}
          >
            <SelectTrigger className="h-9 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Phòng ban:</span>
                <SelectValue placeholder="Tất cả phòng ban">
                  {selectedDept ? selectedDept.name : "Tất cả phòng ban"}
                </SelectValue>
              </div>
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

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Đặt lại
          </Button>
        )}
      </div>
    </div>
  );
}
