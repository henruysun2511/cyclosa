"use client";

import React from "react";
import { FolderOpen, Trash2, Sparkles, Tag, Armchair } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkplaceAmenity } from "../../types/workplace.types";

interface WorkplaceAmenityTableProps {
  amenities: WorkplaceAmenity[];
  isLoading: boolean;
  onDelete: (id: string, name: string) => void;
}

export function WorkplaceAmenityTable({
  amenities,
  isLoading,
  onDelete,
}: WorkplaceAmenityTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="w-64 text-xs font-semibold">Tên tiện ích</TableHead>
              <TableHead className="w-36 text-xs font-semibold">Biểu tượng (Icon)</TableHead>
              <TableHead className="text-xs font-semibold">Mô tả chi tiết</TableHead>
              <TableHead className="w-36 text-center text-xs font-semibold">Số bàn đang gắn</TableHead>
              <TableHead className="w-20 text-right text-xs font-semibold pr-4">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-right pr-4"><Skeleton className="h-7 w-7 ml-auto rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : amenities.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Chưa có danh mục tiện ích nào</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm vào nút &quot;Thêm tiện ích mới&quot; bên trên để bổ sung trang thiết bị phục vụ bàn làm việc
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              amenities.map((amenity, index) => (
                <TableRow key={amenity.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary shrink-0" />
                      <span>{amenity.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {amenity.iconName ? (
                      <Badge variant="outline" className="text-[11px] font-mono">
                        {amenity.iconName}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {amenity.description || "—"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Badge variant="secondary" className="font-mono">
                      {amenity.seatCount ?? 0} bàn
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(amenity.id, amenity.name)}
                      title="Xóa tiện ích"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
