"use client";

import React from "react";
import { FolderOpen, MoreHorizontal, Eye, CheckCircle2, UserCheck, Play, AlertTriangle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPagination } from "@/components/common/data-pagination";
import {
  ISSUE_STATUS_OPTIONS,
  ISSUE_SEVERITY_OPTIONS,
  ISSUE_TYPE_OPTIONS,
} from "../../constants/workplace.constants";
import type { WorkplaceIssue } from "../../types/workplace.types";

interface WorkplaceIssueTableProps {
  issues: WorkplaceIssue[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (id: string) => void;
  onAssign: (issue: WorkplaceIssue) => void;
  onStart: (issueId: string) => void;
  onResolve: (issue: WorkplaceIssue) => void;
}

export function WorkplaceIssueTable({
  issues,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onAssign,
  onStart,
  onResolve,
}: WorkplaceIssueTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="text-xs font-semibold">Sự cố</TableHead>
                <TableHead className="text-xs font-semibold">Phân loại & Mức độ</TableHead>
                <TableHead className="text-xs font-semibold">Vị trí phản ánh</TableHead>
                <TableHead className="text-xs font-semibold">Người báo cáo</TableHead>
                <TableHead className="text-xs font-semibold">Người phụ trách</TableHead>
                <TableHead className="w-32 text-center text-xs font-semibold">Trạng thái</TableHead>
                <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-7 w-7 mx-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : issues.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Không tìm thấy báo cáo sự cố nào</p>
                      <p className="text-xs text-muted-foreground">
                        Tất cả các cơ sở vật chất và bàn làm việc đang hoạt động ổn định
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue, index) => {
                  const statusConfig =
                    ISSUE_STATUS_OPTIONS.find((s) => s.value === issue.status) || ISSUE_STATUS_OPTIONS[0];
                  const severityConfig =
                    ISSUE_SEVERITY_OPTIONS.find((s) => s.value === issue.severity) || ISSUE_SEVERITY_OPTIONS[0];
                  const typeConfig =
                    ISSUE_TYPE_OPTIONS.find((t) => t.value === issue.issueType) || ISSUE_TYPE_OPTIONS[0];

                  return (
                    <TableRow key={issue.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground max-w-xs">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-foreground line-clamp-1">{issue.title}</p>
                          <p className="text-muted-foreground text-[11px] line-clamp-1">{issue.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-[11px] font-normal">
                            {typeConfig.label}
                          </Badge>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${severityConfig.color}`}>
                            {severityConfig.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">{issue.floorName || "Tầng làm việc"}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {issue.seatCode ? `Bàn: ${issue.seatCode}` : issue.floorObjectName || "Khu vực chung"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-medium">
                        {issue.reporterName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {issue.assignedToName ? (
                          <span className="font-medium text-foreground">{issue.assignedToName}</span>
                        ) : (
                          <span className="text-muted-foreground italic">Chưa phân công</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={() => onViewDetail(issue.id)}>
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              <span>Xem chi tiết</span>
                            </DropdownMenuItem>
                            {issue.status === "OPEN" && (
                              <DropdownMenuItem onClick={() => onAssign(issue)}>
                                <UserCheck className="h-3.5 w-3.5 mr-2 text-primary" />
                                <span>Phân công kỹ thuật viên</span>
                              </DropdownMenuItem>
                            )}
                            {issue.status === "OPEN" && (
                              <DropdownMenuItem onClick={() => onStart(issue.id)}>
                                <Play className="h-3.5 w-3.5 mr-2 text-blue-600" />
                                <span>Bắt đầu xử lý</span>
                              </DropdownMenuItem>
                            )}
                            {issue.status === "IN_PROGRESS" && (
                              <DropdownMenuItem onClick={() => onResolve(issue)}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                                <span>Nghiệm thu sự cố</span>
                              </DropdownMenuItem>
                            )}
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

      {!isLoading && totalPages > 0 && (
        <DataPagination
          pagination={{
            page: page - 1,
            size: 15,
            total: totalItems,
            pages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }}
          onPageChange={(p) => onPageChange(p + 1)}
        />
      )}
    </div>
  );
}
