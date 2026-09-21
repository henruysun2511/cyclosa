"use client";

import React, { useState } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

export function CompanyExportDropdown() {
  const [open, setOpen] = useState(false);

  const handleExport = (format: string) => {
    setOpen(false);
    toast.success(`Đang xuất file ${format}...`, {
      description: `Danh sách công ty đang được tải xuống dưới dạng ${format}.`,
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-outline"
      >
        <Download className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Export</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="filter-dropdown-menu w-44">
          <button
            type="button"
            onClick={() => handleExport("Excel (.xlsx)")}
            className="filter-menu-item gap-2"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export to Excel</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("CSV (.csv)")}
            className="filter-menu-item gap-2"
          >
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Export to CSV</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("PDF (.pdf)")}
            className="filter-menu-item gap-2"
          >
            <Printer className="h-3.5 w-3.5 text-rose-600" />
            <span>Export to PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}

export const ExportDropdown = CompanyExportDropdown;
