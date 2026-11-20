"use client";

import React from "react";
import { Building2, MapPin, Layers, Users, MoreVertical, Edit, Trash2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WorkplaceSite } from "../../types/workplace.types";

interface WorkplaceSiteCardsProps {
  sites: WorkplaceSite[];
  isLoading: boolean;
  onSelectSite: (site: WorkplaceSite) => void;
  onEdit: (site: WorkplaceSite) => void;
  onDelete: (id: string, name: string) => void;
}

export function WorkplaceSiteCards({
  sites,
  isLoading,
  onSelectSite,
  onEdit,
  onDelete,
}: WorkplaceSiteCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/60 flex items-center justify-center text-3xl">
          🏢
        </div>
        <h3 className="text-base font-semibold text-foreground">Chưa có tòa nhà hoặc cơ sở nào</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Bấm nút &quot;Thêm cơ sở mới&quot; ở góc trên để tạo tòa nhà đầu tiên cho hệ thống không gian làm việc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sites.map((site, index) => {
        // Màu sắc phân biệt nhẹ nhàng theo từng card
        const gradientColors = [
          "from-blue-600 to-indigo-600",
          "from-emerald-600 to-teal-600",
          "from-purple-600 to-pink-600",
          "from-amber-600 to-orange-600",
        ];
        const color = gradientColors[index % gradientColors.length];

        return (
          <Card
            key={site.id}
            onClick={() => onSelectSite(site)}
            className="group relative rounded-2xl border-2 border-border hover:border-primary/60 bg-card hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Hiệu ứng Glow nền phía sau */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-all" />

            <CardContent className="p-6 space-y-5 relative">
              {/* Header Card: Icon + Tên + Menu dropdown */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${color} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0`}
                  >
                    🏢
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                        {site.code || "SITE"}
                      </span>
                      {site.branchName && (
                        <Badge variant="outline" className="text-[10px] truncate max-w-[120px]">
                          {site.branchName}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate mt-1">
                      {site.name}
                    </h3>
                  </div>
                </div>

                {/* Dropdown Menu sửa / xóa */}
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem onClick={() => onEdit(site)} className="gap-2 text-xs cursor-pointer">
                        <Edit className="h-3.5 w-3.5" />
                        <span>Chỉnh sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(site.id, site.name)}
                        className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Xóa cơ sở</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Địa chỉ cơ sở */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 line-clamp-2 min-h-[32px]">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{site.address || "Chưa cập nhật địa chỉ"}</span>
              </p>

              {/* Chỉ số nhanh (Số tầng, Chỗ ngồi) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/80">
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block flex items-center justify-center gap-1">
                    <Layers className="h-3 w-3" />
                    Số tầng
                  </span>
                  <span className="font-bold text-sm text-foreground block mt-0.5">
                    {site.floorCount || 0} tầng
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block flex items-center justify-center gap-1">
                    <Users className="h-3 w-3" />
                    Chỗ làm việc
                  </span>
                  <span className="font-bold text-sm text-foreground block mt-0.5">
                    {site.totalSeats ?? (site.floorCount ? site.floorCount * 40 : 0)} bàn
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Footer Card: Nút vào xem các tầng */}
            <div className="px-6 py-3.5 bg-muted/20 border-t border-border/70 flex items-center justify-between text-xs font-semibold text-primary group-hover:bg-primary/5 transition-colors">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Xem mô hình tầng xếp chồng</span>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
