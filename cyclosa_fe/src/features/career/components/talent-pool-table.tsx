"use client";

import React from "react";
import { Trash2, FolderOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TALENT_TAG_CONFIG } from "../constants/career.constants";
import type { TalentPoolItem } from "../types/career.types";

interface TalentPoolTableProps {
  items?: TalentPoolItem[];
  page: number;
  pageSize: number;
  isLoading?: boolean;
  onRemove: (item: TalentPoolItem) => void;
}

export function TalentPoolTable({
  items = [],
  page,
  pageSize,
  isLoading = false,
  onRemove,
}: TalentPoolTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="text-xs font-semibold">Nhân tài nội bộ</TableHead>
              <TableHead className="text-xs font-semibold">Chức vụ & Phòng ban</TableHead>
              <TableHead className="w-48 text-xs font-semibold">Thẻ phân loại</TableHead>
              <TableHead className="text-xs font-semibold">Lý do bình chọn & Năng lực nổi bật</TableHead>
              <TableHead className="w-32 text-xs font-semibold">Ngày ghi nhận</TableHead>
              <TableHead className="w-16 text-right text-xs font-semibold">Thao tác</TableHead>
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
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-20 font-mono" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
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
                    <p className="text-sm font-medium">Chưa có nhân sự nào trong kho nhân tài</p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &quot;Gắn thẻ nhân tài&quot; để định vị và theo dõi nhóm nhân sự trọng yếu, Hi-Po của tổ chức
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => {
                const stt = (page - 1) * pageSize + index + 1;
                const tagConfig = TALENT_TAG_CONFIG[item.tag];

                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {stt}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                          {item.employeeName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-foreground">
                            {item.employeeName}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {item.employeeCode}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-foreground">
                        {item.jobTitleName || "Chưa phân bổ chức danh"}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.departmentName || "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border font-medium ${tagConfig?.className}`}
                      >
                        {tagConfig?.label || item.tag}
                      </span>
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-muted-foreground line-clamp-2 max-w-md">
                        {item.reason}
                      </p>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Thu hồi thẻ nhân tài"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
