"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, MoreHorizontal, Eye, UserPlus, PlayCircle, CheckCircle2, Lock } from "lucide-react";
import { ComplaintStatusBadge } from "./reward-badges";
import { COMPLAINT_CATEGORY_LABELS } from "../constants/reward.constants";
import type { Complaint } from "../types/reward.types";

interface ComplaintTableProps {
  items: Complaint[];
  isLoading: boolean;
  page: number;
  size: number;
  onDetail: (id: string) => void;
  onAssign: (item: Complaint) => void;
  onStartInvestigate: (id: string) => void;
  onResolve: (item: Complaint) => void;
  onClose: (id: string) => void;
}

export function ComplaintTable({
  items,
  isLoading,
  page,
  size,
  onDetail,
  onAssign,
  onStartInvestigate,
  onResolve,
  onClose,
}: ComplaintTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center text-xs font-semibold">
                STT
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Người gửi khiếu nại
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Tiêu đề & Nhóm phản ánh
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Ngày gửi
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Cán bộ thụ lý
              </TableHead>
              <TableHead className="text-xs font-semibold">
                Trạng thái
              </TableHead>
              <TableHead className="w-16 text-center text-xs font-semibold">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-7 w-7 rounded-md mx-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm font-medium">
                      Không tìm thấy khiếu nại hoặc phản ánh nào
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center text-xs text-muted-foreground">
                    {(page - 1) * size + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-xs text-foreground">
                      {item.complainantEmployeeName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {item.complainantEmployeeCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-xs text-foreground max-w-[280px] truncate">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {COMPLAINT_CATEGORY_LABELS[item.category] || item.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {item.submittedAt ? item.submittedAt.split("T")[0] : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {item.handlerEmployeeName || (
                      <span className="text-muted-foreground italic">
                        Chưa phân công
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ComplaintStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem onClick={() => onDetail(item.id)}>
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          <span>Xem chi tiết khiếu nại</span>
                        </DropdownMenuItem>

                        {item.status !== "CLOSED" && (
                          <DropdownMenuItem onClick={() => onAssign(item)}>
                            <UserPlus className="h-3.5 w-3.5 mr-2" />
                            <span>Phân công cán bộ HR</span>
                          </DropdownMenuItem>
                        )}

                        {item.status === "OPEN" && (
                          <DropdownMenuItem onClick={() => onStartInvestigate(item.id)}>
                            <PlayCircle className="h-3.5 w-3.5 mr-2 text-indigo-600" />
                            <span>Bắt đầu thụ lý điều tra</span>
                          </DropdownMenuItem>
                        )}

                        {item.status === "INVESTIGATING" && (
                          <DropdownMenuItem onClick={() => onResolve(item)}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                            <span>Ghi nhận giải quyết</span>
                          </DropdownMenuItem>
                        )}

                        {item.status === "RESOLVED" && (
                          <DropdownMenuItem onClick={() => onClose(item.id)}>
                            <Lock className="h-3.5 w-3.5 mr-2 text-slate-600" />
                            <span>Đóng hồ sơ khiếu nại</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

