"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { INITIAL_COMPANIES, INITIAL_COMPANY_STATS } from "../constants/company.constants";
import type { Company, CompanyStats } from "../types/company.types";
import { CompanyKpiCards } from "./company-kpi-cards";
import { CompanyTable } from "./company-table";
import { CompanyAddModal } from "./company-add-modal";
import { CompanyExportDropdown } from "./company-export-dropdown";
import { toast } from "sonner";

export function CompanyDashboardView() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [stats, setStats] = useState<CompanyStats>(INITIAL_COMPANY_STATS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [kpiCollapsed, setKpiCollapsed] = useState(false);

  // Add Company handler
  const handleAddCompany = (newComp: Omit<Company, "id">) => {
    const created: Company = {
      ...newComp,
      id: `comp-${Date.now()}`,
    };
    setCompanies([created, ...companies]);
    setStats((prev) => ({
      ...prev,
      totalCompanies: prev.totalCompanies + 1,
      activeCompanies:
        created.status === "Active"
          ? prev.activeCompanies + 1
          : prev.activeCompanies,
      inactiveCompanies:
        created.status === "Inactive"
          ? prev.inactiveCompanies + 1
          : prev.inactiveCompanies,
    }));
  };

  // Delete Company handler
  const handleDeleteCompany = (id: string) => {
    const target = companies.find((c) => c.id === id);
    if (!target) return;

    setCompanies((prev) => prev.filter((c) => c.id !== id));
    setStats((prev) => ({
      ...prev,
      totalCompanies: Math.max(0, prev.totalCompanies - 1),
      activeCompanies:
        target.status === "Active"
          ? Math.max(0, prev.activeCompanies - 1)
          : prev.activeCompanies,
      inactiveCompanies:
        target.status === "Inactive"
          ? Math.max(0, prev.inactiveCompanies - 1)
          : prev.inactiveCompanies,
    }));

    toast.success(`Đã xóa công ty "${target.name}"`);
  };

  // Edit Company handler
  const handleEditCompany = (company: Company) => {
    toast.info(`Chỉnh sửa công ty: ${company.name}`, {
      description: "Tính năng chỉnh sửa đang sẵn sàng.",
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Title & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title & Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Companies
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="hover:text-primary cursor-pointer transition-colors">
              Super Admin
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Companies List</span>
          </nav>
        </div>

        {/* Right: Action Buttons Group */}
        <div className="flex items-center gap-2.5">
          {/* Export Dropdown Button */}
          <CompanyExportDropdown />

          {/* + Add Company Button */}
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            <span>Add Company</span>
          </button>

          {/* Collapse/Scroll Button */}
          <button
            type="button"
            onClick={() => {
              setKpiCollapsed(!kpiCollapsed);
              toast.info(kpiCollapsed ? "Mở rộng thống kê KPI" : "Thu gọn thống kê KPI");
            }}
            title={kpiCollapsed ? "Mở rộng thẻ KPI" : "Thu gọn thẻ KPI"}
            className="btn-icon"
          >
            {kpiCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── 4 KPI Cards (Grid 4 columns) ────────────────────────────── */}
      {!kpiCollapsed && (
        <div className="animate-fadeIn">
          <CompanyKpiCards stats={stats} />
        </div>
      )}

      {/* ── Data Table Card ─────────────────────────────────────────── */}
      <CompanyTable
        companies={companies}
        onDeleteCompany={handleDeleteCompany}
        onEditCompany={handleEditCompany}
      />

      {/* ── Modal Add Company ───────────────────────────────────────── */}
      <CompanyAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddCompany}
      />
    </div>
  );
}

export const CompaniesDashboardView = CompanyDashboardView;
