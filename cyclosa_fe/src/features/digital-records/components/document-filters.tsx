"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Filter, Layers, ShieldAlert } from "lucide-react";
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
import type { DocumentTypeSimple } from "../types/digital-records.types";

interface DocumentFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  documentTypes: DocumentTypeSimple[];
  selectedDocumentTypeId?: string;
  onDocumentTypeChange: (val: string) => void;
  selectedStatus?: string;
  onStatusChange: (val: string) => void;
  selectedLegalHold?: boolean | undefined;
  onLegalHoldChange: (val: boolean | undefined) => void;
  onReset: () => void;
}

export function DocumentFilters({
  search,
  onSearchChange,
  documentTypes,
  selectedDocumentTypeId = "ALL",
  onDocumentTypeChange,
  selectedStatus = "ALL",
  onStatusChange,
  selectedLegalHold,
  onLegalHoldChange,
  onReset,
}: DocumentFiltersProps) {
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

  const legalHoldValue =
    selectedLegalHold === true ? "HOLD" : selectedLegalHold === false ? "NORMAL" : "ALL";

  const handleLegalHoldSelect = (val: string | null) => {
    if (val === "HOLD") onLegalHoldChange(true);
    else if (val === "NORMAL") onLegalHoldChange(false);
    else onLegalHoldChange(undefined);
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
      {/* Hàng 1: Tìm kiếm từ khóa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo mã tài liệu, tiêu đề hồ sơ, họ tên nhân viên..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 text-sm h-9 bg-background"
        />
      </div>

      {/* Hàng 2: Các dropdown lọc chuẩn Design System (Rule 03) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown Loại tài liệu */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[220px]">
          <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Loại hồ sơ:</span>
          <Select
            value={selectedDocumentTypeId || "ALL"}
            onValueChange={(val) => onDocumentTypeChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả loại hồ sơ">
                {selectedDocumentTypeId === "ALL" || !selectedDocumentTypeId
                  ? "Tất cả loại hồ sơ"
                  : documentTypes.find((t) => t.id === selectedDocumentTypeId)
                  ? `${documentTypes.find((t) => t.id === selectedDocumentTypeId)?.name} (${
                      documentTypes.find((t) => t.id === selectedDocumentTypeId)?.code
                    })`
                  : "Tất cả loại hồ sơ"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại hồ sơ</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dropdown Trạng thái vòng đời */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Trạng thái:</span>
          <Select
            value={selectedStatus || "ALL"}
            onValueChange={(val) => onStatusChange(val || "ALL")}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái">
                {selectedStatus === "DRAFT"
                  ? "Bản nháp"
                  : selectedStatus === "VERIFIED"
                  ? "Đã thẩm định OCR"
                  : selectedStatus === "ARCHIVED"
                  ? "Đã nộp lưu kho bất biến"
                  : selectedStatus === "DESTROYED"
                  ? "Đã tiêu hủy"
                  : "Tất cả trạng thái"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="DRAFT">Bản nháp</SelectItem>
              <SelectItem value="VERIFIED">Đã thẩm định OCR</SelectItem>
              <SelectItem value="ARCHIVED">Đã nộp lưu kho bất biến</SelectItem>
              <SelectItem value="DESTROYED">Đã tiêu hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dropdown Tạm giữ pháp lý */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px]">
          <ShieldAlert className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-muted-foreground shrink-0">Pháp lý:</span>
          <Select
            value={legalHoldValue}
            onValueChange={handleLegalHoldSelect}
          >
            <SelectTrigger className="w-full h-8 text-xs bg-background">
              <SelectValue placeholder="Tất cả trạng thái pháp lý">
                {legalHoldValue === "HOLD"
                  ? "Đang tạm giữ pháp lý"
                  : legalHoldValue === "NORMAL"
                  ? "Bình thường"
                  : "Tất cả"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="HOLD">Đang tạm giữ pháp lý</SelectItem>
              <SelectItem value="NORMAL">Bình thường (Không tạm giữ)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nút Đặt lại */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          <span>Đặt lại</span>
        </Button>
      </div>
    </div>
  );
}
