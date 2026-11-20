"use client";

import React from "react";
import { ArrowRight, MoreHorizontal, Pencil, Trash2, FolderOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { CareerPathItem } from "../types/career.types";

interface CareerPathTableProps {
  items?: CareerPathItem[];
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onEdit: (item: CareerPathItem) => void;
  onDelete: (item: CareerPathItem) => void;
}

export function CareerPathTable({
  items = [],
  page,
  pageSize,
  isLoading = false,
  onEdit,
  onDelete,
}: CareerPathTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="text-xs font-semibold">Vị trí khởi điểm</TableHead>
              <TableHead className="w-10 text-center text-xs font-semibold"></TableHead>
              <TableHead className="text-xs font-semibold">Vị trí mục tiêu</TableHead>
              <TableHead className="w-40 text-center text-xs font-semibold">Kinh nghiệm tối thiểu</TableHead>
              <TableHead className="text-xs font-semibold">Yêu cầu & Năng lực cần có</TableHead>
              <TableHead className="w-20 text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">Chưa có tuyến thăng tiến nào</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Thêm tuyến thăng tiến&quot; để thiết lập lộ trình phát triển nghề nghiệp cho nhân viên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const stt = (page - 1) * pageSize + index + 1;

                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {stt}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">
                        {item.fromJobTitleName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {item.fromJobTitleCode}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">
                        {item.toJobTitleName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {item.toJobTitleCode}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-semibold">
                        {item.minExperienceYears} năm
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
                        {item.requirements || "Theo tiêu chuẩn chức danh & khung năng lực"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Thao tác</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(item)} className="text-xs gap-2">
                            <Pencil className="h-3.5 w-3.5" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-xs gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa tuyến
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
