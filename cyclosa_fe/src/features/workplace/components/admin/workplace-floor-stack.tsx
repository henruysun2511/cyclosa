"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  Plus,
  SlidersHorizontal,
  FileCode2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkplaceFloor, WorkplaceSite } from "../../types/workplace.types";

interface WorkplaceFloorStackProps {
  site: WorkplaceSite;
  floors: WorkplaceFloor[];
  isLoading: boolean;
  onSelectFloor: (floor: WorkplaceFloor) => void;
  onAddFloor?: () => void;
  onBackToSites?: () => void;
}

export function WorkplaceFloorStack({
  site,
  floors,
  isLoading,
  onSelectFloor,
  onAddFloor,
  onBackToSites,
}: WorkplaceFloorStackProps) {
  // Sắp xếp các tầng từ trên cao xuống dưới đất (descending theo floorNumber)
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);

  // Tầng hiện đang được hover/active trong bảng thanh tra bên phải
  const [hoveredFloor, setHoveredFloor] = useState<WorkplaceFloor | null>(
    sortedFloors.length > 0 ? sortedFloors[0] : null
  );

  // Đồng bộ hoveredFloor nếu danh sách tầng tải xong
  React.useEffect(() => {
    if (sortedFloors.length > 0 && !hoveredFloor) {
      setHoveredFloor(sortedFloors[0]);
    }
  }, [sortedFloors, hoveredFloor]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Toolbar của Tòa nhà ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-3.5">
          {onBackToSites && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToSites}
              className="gap-1.5 h-9 text-xs"
              title="Quay lại danh sách tòa nhà"
            >
              <span>← Tòa nhà</span>
            </Button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>{site.name}</span>
              </h2>
              <Badge variant="secondary" className="text-xs font-mono">
                {site.code}
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                {floors.length} Tầng văn phòng
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-primary shrink-0" />
              <span>{site.address || "Trụ sở chính"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onAddFloor && (
            <Button size="sm" onClick={onAddFloor} className="h-9 gap-1.5 shadow-xs">
              <Plus className="w-4 h-4" />
              <span>Thêm tầng mới</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Workspace: Stack Cột Tầng (Trái) & Thanh tra Tầng (Phải) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI (7 cột): Mô hình các tầng xếp chồng lên nhau */}
        <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Mốc chỉ báo Skyline trên đỉnh */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-4 border-b border-border/60">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Mặt bằng Tầng cao nhất (Skyline)
            </span>
            <span>Rê chuột để xem nhanh • Bấm để mở Sơ đồ 2D</span>
          </div>

          {/* Danh sách các tầng xếp chồng theo trục dọc */}
          <div className="space-y-3.5 py-6">
            {sortedFloors.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs space-y-2">
                <p>Tòa nhà này hiện chưa được cấu hình tầng nào.</p>
                {onAddFloor && (
                  <Button variant="outline" size="sm" onClick={onAddFloor} className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo tầng đầu tiên</span>
                  </Button>
                )}
              </div>
            ) : (
              sortedFloors.map((floor, index) => {
                const isHovered = hoveredFloor?.id === floor.id;
                
                // Màu sắc nhấn nhá theo từng tầng từ trên xuống
                const floorColorClasses = [
                  "from-purple-500/10 border-purple-300 dark:border-purple-800",
                  "from-blue-500/10 border-blue-300 dark:border-blue-800",
                  "from-emerald-500/10 border-emerald-300 dark:border-emerald-800",
                  "from-amber-500/10 border-amber-300 dark:border-amber-800",
                  "from-rose-500/10 border-rose-300 dark:border-rose-800",
                ];
                const colorBorder = floorColorClasses[index % floorColorClasses.length];

                return (
                  <div
                    key={floor.id}
                    onMouseEnter={() => setHoveredFloor(floor)}
                    onClick={() => onSelectFloor(floor)}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? "translate-x-2 -translate-y-1 bg-gradient-to-r via-primary/5 to-card border-primary shadow-lg ring-2 ring-primary/20 z-10"
                        : `bg-card hover:bg-muted/30 border-border shadow-xs hover:border-primary/50`
                    }`}
                  >
                    {/* Cột trái: Số tầng + Tên tầng */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl font-mono font-bold flex items-center justify-center text-sm shadow-xs transition-transform duration-200 shrink-0 ${
                          isHovered
                            ? "bg-primary text-primary-foreground scale-110 shadow-md"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }`}
                      >
                        T{floor.floorNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {floor.name}
                          </h4>
                          {floor.publishedPlanVersion ? (
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 shrink-0">
                              {floor.publishedPlanVersion}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">
                              Bản nháp
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-md">
                          {floor.description || "Chưa có mô tả quy hoạch phân khu"}
                        </p>
                      </div>
                    </div>

                    {/* Cột phải: Thông số tóm tắt + Mũi tên */}
                    <div className="flex items-center gap-4 shrink-0 pl-2">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-semibold text-foreground block">
                          {floor.seatCount || 0} bàn ghế
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {floor.zoneCount || 0} phân khu
                        </span>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isHovered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mốc chỉ báo Ground Floor dưới đáy */}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-4 border-t border-border/60">
            <span>📍 Tầng trệt / Lối vào sảnh chính</span>
            <span>Tổng cộng: {floors.length} tầng</span>
          </div>
        </div>

        {/* CỘT PHẢI (5 cột): Bảng Thanh Tra Chi Tiết Tầng (Live Floor Inspector) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden sticky top-6">
            <div className="p-5 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Thông số Tầng đang xem</span>
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                  Live Preview
                </Badge>
              </div>

              {hoveredFloor ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-mono font-bold flex items-center justify-center text-base shadow-md">
                    T{hoveredFloor.floorNumber}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-foreground truncate">
                      {hoveredFloor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Thuộc {site.name}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">Di chuột vào tầng bất kỳ bên trái để xem thông tin</p>
              )}
            </div>

            <CardContent className="p-5 space-y-5">
              {hoveredFloor ? (
                <>
                  {/* Grid 2 cột: Bàn ghế & Phân khu */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Chỗ làm việc
                      </span>
                      <span className="text-lg font-bold text-foreground block mt-1">
                        {hoveredFloor.seatCount || 0}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        Khả dụng làm việc
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        Phân khu (Zones)
                      </span>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                        {hoveredFloor.zoneCount || 0}
                      </span>
                      <span className="text-[10px] text-muted-foreground block mt-0.5">
                        Khu vực chức năng
                      </span>
                    </div>
                  </div>

                  {/* Mô tả quy hoạch tầng */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      Mô tả quy hoạch mặt bằng:
                    </span>
                    <p className="text-xs text-foreground/80 bg-muted/30 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                      {hoveredFloor.description || "Tầng làm việc chuẩn với không gian linh hoạt mở, trang bị đầy đủ hạ tầng mạng và phòng họp."}
                    </p>
                  </div>

                  {/* Trạng thái bản vẽ mặt bằng */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs">
                    <div>
                      <span className="font-semibold text-foreground block">Bản vẽ thiết kế 2D</span>
                      <span className="text-[10px] text-muted-foreground block">
                        {hoveredFloor.publishedPlanVersion ? "Đã phát hành bản vẽ chính thức" : "Đang ở chế độ bản vẽ nháp"}
                      </span>
                    </div>
                    <Badge variant={hoveredFloor.publishedPlanVersion ? "default" : "outline"} className="text-xs">
                      {hoveredFloor.publishedPlanVersion || "v1.0 (Draft)"}
                    </Badge>
                  </div>

                  {/* Nhóm Nút Hành động */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    {/* Nút chính: Mở Sơ đồ 2D ngay */}
                    <Button
                      onClick={() => onSelectFloor(hoveredFloor)}
                      className="w-full h-10 gap-2 font-semibold shadow-md"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Xem Sơ đồ Mặt bằng 2D của {hoveredFloor.name}</span>
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        <Link href={`/workplace/floors/${hoveredFloor.id}/editor`}>
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Biên tập bản vẽ</span>
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                        <Link href={`/workplace/floors/${hoveredFloor.id}/plans`}>
                          <FileCode2 className="w-3.5 h-3.5" />
                          <span>Lịch sử bản vẽ</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Chưa có tầng nào được chọn
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
