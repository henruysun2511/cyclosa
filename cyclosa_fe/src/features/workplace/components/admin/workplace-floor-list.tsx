"use client";

import React, { useState, useMemo } from "react";
import { Layers, Plus, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WorkplaceFloor, WorkplaceSite } from "../../types/workplace.types";

interface WorkplaceFloorListProps {
  floors: WorkplaceFloor[];
  sites: WorkplaceSite[];
  selectedSiteId: string;
  selectedFloorId: string | null;
  onSelectSite: (siteId: string) => void;
  onSelectFloor: (floor: WorkplaceFloor) => void;
  onOpenFloorPlan?: (floor: WorkplaceFloor) => void;
  onAddNewFloor: () => void;
  isLoading?: boolean;
}

export function WorkplaceFloorList({
  floors,
  sites,
  selectedSiteId,
  selectedFloorId,
  onSelectSite,
  onSelectFloor,
  onOpenFloorPlan,
  onAddNewFloor,
  isLoading = false,
}: WorkplaceFloorListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Sắp xếp tầng từ trên cao xuống thấp
  const sortedFloors = useMemo(() => {
    const list = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (f) =>
        f.name.toLowerCase().includes(term) ||
        f.floorNumber.toString().includes(term) ||
        (f.description && f.description.toLowerCase().includes(term))
    );
  }, [floors, searchTerm]);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      {/* ── Header & Bộ chọn Tòa nhà ────────────────────────────────────────── */}
      <div className="p-4 border-b border-border bg-muted/20 space-y-3">
        {/* Bộ chọn Tòa nhà */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Chọn Tòa nhà / Cơ sở:</span>
          </label>
          <Select value={selectedSiteId} onValueChange={(val) => val && onSelectSite(val)}>
            <SelectTrigger className="h-9 text-xs bg-background">
              <SelectValue placeholder="Chọn tòa nhà cơ sở">
                {(val: string) => {
                  if (!val) return "Chọn tòa nhà cơ sở";
                  const s = sites.find((item) => item.id === val);
                  return s ? `${s.name} (${s.code})` : "Chọn tòa nhà cơ sở";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sites.map((s) => (
                <SelectItem key={s.id} value={s.id} label={`${s.name} (${s.code})`} className="text-xs">
                  {s.name} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tiêu đề danh sách tầng + Nút thêm mới */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/60">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs text-foreground">Danh sách Tầng</h3>
            <Badge variant="secondary" className="text-[11px] h-5 px-1.5 font-mono">
              {floors.length}
            </Badge>
          </div>
          <Button size="sm" onClick={onAddNewFloor} className="h-7 text-xs gap-1 shadow-xs px-2.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tầng</span>
          </Button>
        </div>

        {/* Ô tìm kiếm tầng */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc số tầng..."
            className="h-8 pl-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* ── Danh sách các Thẻ Tầng (KIỂU CARD DÀI: ICON BÉ BÊN TRÁI, TÊN BÊN PHẢI) ── */}
      <div className="p-3.5 overflow-y-auto max-h-[calc(100vh-320px)] min-h-[440px]">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="p-3 px-4 rounded-xl border border-border bg-muted/20 flex items-center gap-3.5">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <Skeleton className="h-4 w-1/2 flex-1" />
              </div>
            ))}
          </div>
        ) : sortedFloors.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-muted-foreground">
            <Layers className="w-10 h-10 mx-auto opacity-40" />
            <p className="text-xs">Chưa có tầng nào trong cơ sở này</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedFloors.map((floor) => {
              const isSelected = floor.id === selectedFloorId;

              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => onSelectFloor(floor)}
                  onDoubleClick={() => onOpenFloorPlan && onOpenFloorPlan(floor)}
                  title={`${floor.name} (Nhấp 1 lần: Xem thông tin • Nhấp 2 lần: Mở mặt bằng)`}
                  className={`group relative text-left p-3 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer outline-none select-none w-full focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-sm"
                      : "border-border/80 bg-background hover:bg-muted/40 hover:border-border hover:shadow-xs"
                  }`}
                >
                  {/* Icon Tầng bên trái nhỏ gọn */}
                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105 shadow-xs ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:shadow-xs"
                    }`}
                  >
                    <Layers className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-mono font-bold leading-none">
                      T{floor.floorNumber}
                    </span>
                  </div>

                  {/* Tên tầng bên phải trải dài */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4
                      className={`font-semibold text-sm leading-snug line-clamp-1 transition-colors ${
                        isSelected ? "text-primary font-bold" : "text-foreground group-hover:text-primary"
                      }`}
                      title={floor.name}
                    >
                      {floor.name}
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
        Click 1 lần để xem thông tin • Click 2 lần để mở mặt bằng
      </div>
    </div>
  );
}
