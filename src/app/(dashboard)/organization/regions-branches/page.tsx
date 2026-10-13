"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  MapPin,
  Building,
  Plus,
  Compass,
  Search,
  ExternalLink,
  ChevronRight,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { toast } from "sonner";

interface Region {
  id: string;
  name: string;
  code: string;
  branchCount: number;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  regionId: string;
  address: string;
  employeeCount: number;
  radiusMeters: number;
  status: string;
}

const INITIAL_REGIONS: Region[] = [
  { id: "reg_north", name: "Khu Vực Miền Bắc", code: "REG_MB", branchCount: 3 },
  { id: "reg_south", name: "Khu Vực Miền Nam", code: "REG_MN", branchCount: 2 },
  { id: "reg_central", name: "Khu Vực Miền Trung", code: "REG_MT", branchCount: 1 },
];

const INITIAL_BRANCHES: Branch[] = [
  {
    id: "br_hn1",
    name: "Trụ Sở Chính — Tòa Nhà FSI Tower",
    code: "HN-HQ",
    regionId: "reg_north",
    address: "Tầng 8-12, Tòa nhà FSI, Số 18 Cầu Giấy, Hà Nội",
    employeeCount: 310,
    radiusMeters: 200,
    status: "ACTIVE",
  },
  {
    id: "br_hn2",
    name: "Chi Nhánh Hoàn Kiếm",
    code: "HN-HK",
    regionId: "reg_north",
    address: "Số 45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    employeeCount: 45,
    radiusMeters: 150,
    status: "ACTIVE",
  },
  {
    id: "br_hcm1",
    name: "Chi Nhánh TP. Hồ Chí Minh",
    code: "HCM-D1",
    regionId: "reg_south",
    address: "Tầng 5, Bitexco Financial Tower, Quận 1, TP. HCM",
    employeeCount: 85,
    radiusMeters: 200,
    status: "ACTIVE",
  },
  {
    id: "br_dn1",
    name: "Chi Nhánh Đà Nẵng",
    code: "DN-HC",
    regionId: "reg_central",
    address: "Số 120 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng",
    employeeCount: 10,
    radiusMeters: 200,
    status: "ACTIVE",
  },
];

export default function RegionsBranchesPage() {
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredBranches = branches.filter((b) => {
    const matchesRegion = selectedRegionId === "all" || b.regionId === selectedRegionId;
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Actions ───────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Khu vực & Chi nhánh
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
              Cơ cấu tổ chức
            </span>
            <span>/</span>
            <span className="text-foreground font-medium">Khu vực & Chi nhánh</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-primary"
            onClick={() => toast.info("Tính năng thêm chi nhánh mới")}
          >
            <Plus className="h-4 w-4" />
            <span>Thêm chi nhánh</span>
          </button>
        </div>
      </div>

      {/* ── Regions Quick Cards (KPI Grid) ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {regions.map((reg) => {
          const isSelected = selectedRegionId === reg.id;
          return (
            <div
              key={reg.id}
              onClick={() => setSelectedRegionId(isSelected ? "all" : reg.id)}
              className={`kpi-card cursor-pointer transition-all ${
                isSelected ? "border-primary ring-1 ring-primary" : "hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`kpi-icon-wrapper ${isSelected ? "bg-primary" : "bg-slate-700"}`}>
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <p className="kpi-title">{reg.code}</p>
                  <h3 className="kpi-value text-base">{reg.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reg.branchCount} chi nhánh trực thuộc
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Table Card ──────────────────────────────────────────────── */}
      <div className="table-card">
        <div className="table-toolbar">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Danh sách chi nhánh văn phòng ({filteredBranches.length})
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedRegionId !== "all" && (
              <button
                type="button"
                className="btn-outline h-8 text-xs"
                onClick={() => setSelectedRegionId("all")}
              >
                Xóa lọc vùng
              </button>
            )}

            <div className="relative w-full sm:w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Tìm theo tên, mã hoặc địa chỉ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 w-full rounded-md border border-border bg-white pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã CN</th>
                <th>Tên chi nhánh</th>
                <th>Địa chỉ trụ sở</th>
                <th className="text-center">Quy mô nhân sự</th>
                <th className="text-center">Bán kính Geofence</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBranches.map((br) => (
                <tr key={br.id} className="table-row">
                  <td className="font-mono text-xs font-bold text-primary">
                    {br.code}
                  </td>
                  <td>
                    <Link
                      href={`/organization/branches/${br.id}`}
                      className="font-semibold text-foreground text-sm hover:text-primary transition-colors block"
                    >
                      {br.name}
                    </Link>
                  </td>
                  <td className="text-xs text-[#4B5563]">
                    {br.address}
                  </td>
                  <td className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {br.employeeCount}
                    </span>
                  </td>
                  <td className="text-center font-mono text-xs text-muted-foreground">
                    {br.radiusMeters} m
                  </td>
                  <td className="text-center">
                    <StatusBadge status={br.status} />
                  </td>
                  <td className="text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        href={`/organization/branches/${br.id}`}
                        title="Cấu hình tọa độ GPS & Geofence"
                        className="btn-icon-sm"
                      >
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </Link>
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => toast.info(`Chỉnh sửa chi nhánh: ${br.name}`)}
                        className="btn-icon-sm hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
