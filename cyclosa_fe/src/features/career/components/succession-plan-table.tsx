"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  User,
  Users,
  FolderOpen,
} from "lucide-react";
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
import { RISK_LEVEL_CONFIG } from "../constants/career.constants";
import type { SuccessionPlanItem } from "../types/career.types";

interface SuccessionPlanTableProps {
  items?: SuccessionPlanItem[];
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onEdit: (item: SuccessionPlanItem) => void;
  onDelete: (item: SuccessionPlanItem) => void;
}

export function SuccessionPlanTable({
  items = [],
  page,
  pageSize,
  isLoading = false,
  onEdit,
  onDelete,
}: SuccessionPlanTableProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="text-xs font-semibold">Vị trí trọng yếu & Phòng ban</TableHead>
              <TableHead className="text-xs font-semibold">Người đương nhiệm</TableHead>
              <TableHead className="w-36 text-center text-xs font-semibold">Mức độ rủi ro</TableHead>
              <TableHead className="w-44 text-center text-xs font-semibold">Ứng viên kế cận</TableHead>
              <TableHead className="w-32 text-xs font-semibold">Ngày rà soát</TableHead>
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
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 font-mono" />
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
                    <p className="text-sm font-medium">Chưa có kế hoạch kế nhiệm nào</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Lập kế hoạch kế nhiệm&quot; để thiết lập dự phòng nhân sự cho các vị trí trọng yếu
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const stt = (page - 1) * pageSize + index + 1;
                const riskConfig = RISK_LEVEL_CONFIG[item.riskLevel];

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/career/succession/${item.id}`)}
                  >
                    <TableCell className="text-center font-mono text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                      {stt}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-xs text-foreground">
                        {item.jobTitleName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.departmentName}
                      </div>
                    </TableCell>

                    <TableCell>
                      {item.currentHolderName ? (
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                            {item.currentHolderName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-xs text-foreground">
                              {item.currentHolderName}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {item.currentHolderCode}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 dark:text-amber-400 italic flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          Trống vị trí
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskConfig?.className}`}
                      >
                        {riskConfig?.label || item.riskLevel}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{item.candidateCount}</span>
                        {item.readyNowCount > 0 && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            ({item.readyNowCount} sẵn sàng)
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.reviewDate ? new Date(item.reviewDate).toLocaleDateString("vi-VN") : "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Thao tác</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/career/succession/${item.id}`)} className="text-xs gap-2">
                            <Eye className="h-3.5 w-3.5" />
                            Chi tiết & Ứng viên
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item)} className="text-xs gap-2">
                            <Pencil className="h-3.5 w-3.5" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-xs gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa kế hoạch
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
