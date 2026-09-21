"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  ChevronDown,
  Search,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Company } from "../types/company.types";
import { toast } from "sonner";

export interface CompanyTableProps {
  companies: Company[];
  onDeleteCompany: (id: string) => void;
  onEditCompany: (company: Company) => void;
}

export function CompanyTable({
  companies,
  onDeleteCompany,
  onEditCompany,
}: CompanyTableProps) {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string>("All Plans");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [sortBy, setSortBy] = useState<string>("Last 7 Days");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter Dropdowns open state
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Filtered & Searched data
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.accountUrl.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan =
        selectedPlan === "All Plans" || c.plan === selectedPlan;

      const matchesStatus =
        selectedStatus === "All Status" || c.status === selectedStatus;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [companies, searchQuery, selectedPlan, selectedStatus]);

  // Pagination calculation
  const totalEntries = filteredCompanies.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCompanies.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected =
    paginatedCompanies.length > 0 &&
    paginatedCompanies.every((c) => selectedIds.includes(c.id));

  return (
    <div className="table-card">
      {/* ── 1. Header & Filter Toolbar ──────────────────────────────── */}
      <div className="table-toolbar">
        <div>
          <h2 className="text-lg font-bold text-foreground">Companies List</h2>
        </div>

        {/* Filters cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Picker */}
          <div className="inline-flex items-center gap-2 h-9 rounded-md border border-border bg-white px-3 text-xs text-foreground shadow-2xs">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">09/13/2026 - 09/19/2026</span>
          </div>

          {/* Select Plan Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setPlanDropdownOpen(!planDropdownOpen);
                setStatusDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className={`filter-btn ${selectedPlan !== "All Plans" ? "active" : ""}`}
            >
              <span>{selectedPlan === "All Plans" ? "Select Plan" : `Plan: ${selectedPlan}`}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {planDropdownOpen && (
              <div className="filter-dropdown-menu w-36">
                {["All Plans", "Advanced", "Basic", "Enterprise"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(p);
                      setPlanDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`filter-menu-item ${selectedPlan === p ? "active" : ""}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setPlanDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className={`filter-btn ${selectedStatus !== "All Status" ? "active" : ""}`}
            >
              <span>{selectedStatus === "All Status" ? "Select Status" : `Status: ${selectedStatus}`}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {statusDropdownOpen && (
              <div className="filter-dropdown-menu w-36">
                {["All Status", "Active", "Inactive"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(s);
                      setStatusDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`filter-menu-item ${selectedStatus === s ? "active" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSortDropdownOpen(!sortDropdownOpen);
                setPlanDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              className="filter-btn"
            >
              <span>Sort By : {sortBy}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {sortDropdownOpen && (
              <div className="filter-dropdown-menu w-44">
                {["Last 7 Days", "Last 30 Days", "This Month", "All Time"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSortBy(st);
                      setSortDropdownOpen(false);
                    }}
                    className={`filter-menu-item ${sortBy === st ? "active" : ""}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Secondary Toolbar: Rows Per Page & Search ───────────── */}
      <div className="table-sub-toolbar">
        {/* Left: Rows Per Page & selection count */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Row Per Page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 rounded-md border border-border bg-white px-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>

          {selectedIds.length > 0 && (
            <span className="ml-3 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search company, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* ── 3. Table Data ───────────────────────────────────────────── */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {/* Checkbox column */}
              <th className="w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>

              {/* Company Name */}
              <th>Company Name</th>

              {/* Email */}
              <th>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                  <span>Email</span>
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </th>

              {/* Account URL */}
              <th>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                  <span>Account URL</span>
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </th>

              {/* Plan */}
              <th>Plan</th>

              {/* Created Date */}
              <th>
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                  <span>Created Date</span>
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                </div>
              </th>

              {/* Status */}
              <th>Status</th>

              {/* Actions */}
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedCompanies.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Không tìm thấy công ty nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              paginatedCompanies.map((company) => {
                const isSelected = selectedIds.includes(company.id);
                return (
                  <tr
                    key={company.id}
                    className={`table-row ${isSelected ? "selected" : ""}`}
                  >
                    {/* Checkbox */}
                    <td className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(company.id)}
                      />
                    </td>

                    {/* Company Logo + Name */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${company.logoBg} ${company.logoColor} font-bold text-xs shadow-2xs`}
                        >
                          {company.initials}
                        </div>
                        <span className="font-semibold text-foreground text-sm hover:text-primary cursor-pointer transition-colors">
                          {company.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-xs text-[#4B5563]">
                      {company.email}
                    </td>

                    {/* Account URL */}
                    <td className="text-xs text-[#38BDF8] font-mono hover:underline cursor-pointer">
                      {company.accountUrl}
                    </td>

                    {/* Plan + Upgrade badge */}
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">
                          {company.plan} ({company.billingCycle})
                        </span>
                        {company.canUpgrade && (
                          <button
                            type="button"
                            onClick={() =>
                              toast.info(`Nâng cấp gói cho ${company.name}`)
                            }
                            className="badge-upgrade"
                          >
                            Upgrade
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="text-xs text-muted-foreground">
                      {company.createdDate}
                    </td>

                    {/* Status badge */}
                    <td>
                      {company.status === "Active" ? (
                        <span className="badge badge-active">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="badge badge-inactive">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {/* View Eye */}
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() =>
                            toast.info(`Xem chi tiết: ${company.name}`, {
                              description: `Email: ${company.email} | URL: ${company.accountUrl}`,
                            })
                          }
                          className="btn-icon-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Pencil */}
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => onEditCompany(company)}
                          className="btn-icon-sm hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete Trash2 */}
                        <button
                          type="button"
                          title="Xóa công ty"
                          onClick={() => onDeleteCompany(company.id)}
                          className="btn-icon-sm hover:bg-[#FEE2E2] hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── 4. Pagination Footer ─────────────────────────────────────── */}
      <div className="table-pagination">
        <div>
          Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
          <span className="font-semibold text-foreground">{totalEntries}</span> entries
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="pagination-nav-btn"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="pagination-nav-btn"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export const CompaniesTable = CompanyTable;
