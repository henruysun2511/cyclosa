"use client";

import React, { useState, useMemo } from "react";
import { Building2, Building, Landmark, Warehouse, Hotel, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkplaceSite } from "../../types/workplace.types";

interface WorkplaceSiteListProps {
  sites: WorkplaceSite[];
  selectedSiteId: string | null;
  onSelectSite: (site: WorkplaceSite) => void;
  onOpenFloors?: (site: WorkplaceSite) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

// Danh sách các icon tòa nhà từ Lucide React
const BUILDING_ICONS = [Building2, Building, Landmark, Hotel, Warehouse];

export function WorkplaceSiteList({
  sites,
  selectedSiteId,
  onSelectSite,
  onOpenFloors,
  onAddNew,
  isLoading = false,
}: WorkplaceSiteListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSites = useMemo(() => {
    if (!searchTerm.trim()) return sites;
    const term = searchTerm.toLowerCase();
    return sites.filter((s) => s.name.toLowerCase().includes(term));
  }, [sites, searchTerm]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* ── Header Cột Danh sách Tòa nhà ───────────────────────────────────── */}
      <div className="p-4 border-b border-border bg-muted/20 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Danh sách Tòa nhà</h3>
            <Badge variant="secondary" className="text-[11px] h-5 px-1.5 font-mono">
              {sites.length}
            </Badge>
          </div>
          <Button size="sm" onClick={onAddNew} className="h-8 text-xs gap-1 shadow-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm mới</span>
          </Button>
        </div>

        {/* Ô tìm kiếm nhanh */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên tòa nhà..."
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* ── Danh sách các Thẻ Tòa nhà (CHỈ CÓ ICON TO VÀ TÊN Ở DƯỚI) ───────── */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-260px)] min-h-[440px]">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-border bg-muted/20 text-center space-y-3">
                <Skeleton className="w-16 h-16 rounded-2xl mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Không tìm thấy tòa nhà phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSites.map((site, index) => {
              const isSelected = site.id === selectedSiteId;
              const IconComponent = BUILDING_ICONS[index % BUILDING_ICONS.length] || Building2;

              return (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => onSelectSite(site)}
                  onDoubleClick={() => onOpenFloors && onOpenFloors(site)}
                  title={`${site.name} (Nhấp 1 lần: Xem thông tin • Nhấp 2 lần: Mở danh sách tầng)`}
                  className={`group relative text-center p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer outline-none select-none min-h-[140px] focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md"
                      : "border-border/80 bg-background hover:bg-muted/40 hover:border-border hover:shadow-xs"
                  }`}
                >
                  {/* Icon tòa nhà to bằng Lucide React */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xs ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:shadow-xs"
                    }`}
                  >
                    <IconComponent className="w-10 h-10" />
                  </div>

                  {/* CHỈ CÓ Tên tòa nhà ở bên dưới */}
                  <div className="w-full text-center px-1">
                    <h4
                      className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                        isSelected ? "text-primary font-extrabold" : "text-foreground group-hover:text-primary"
                      }`}
                      title={site.name}
                    >
                      {site.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer cột trái ────────────────────────────────────────────────── */}
      <div className="p-3 border-t border-border bg-muted/10 text-center text-[11px] text-muted-foreground">
        Click 1 lần để xem thông tin • Click 2 lần để mở danh sách tầng
      </div>
    </div>
  );
}
