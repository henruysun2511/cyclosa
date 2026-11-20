"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  ArrowRightLeft,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import type { Department } from "../../types/organization.types";

interface OrgTableViewProps {
  departments: Department[];
  isLoading: boolean;
  onViewDetail: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onMove: (dept: Department) => void;
  onDissolve: (dept: Department) => void;
}

export function OrgTableView({
  departments,
  isLoading,
  onViewDetail,
  onEdit,
  onMove,
  onDissolve,
}: OrgTableViewProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
            <TableHead className="w-36 text-xs font-semibold">Mã đơn vị</TableHead>
            <TableHead className="text-xs font-semibold">Tên phòng ban</TableHead>
            <TableHead className="text-xs font-semibold">Trực thuộc (Cấp trên)</TableHead>
            <TableHead className="text-xs font-semibold">Trung tâm chi phí</TableHead>
            <TableHead className="w-32 text-center text-xs font-semibold">Ngày hiệu lực</TableHead>
            <TableHead className="w-28 text-center text-xs font-semibold">Kế thừa quyền</TableHead>
            <TableHead className="w-28 text-center text-xs font-semibold">Trạng thái</TableHead>
            <TableHead className="w-16 text-center text-xs font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center"><div className="h-4 w-6 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-4 w-32 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                <TableCell className="text-center"><div className="h-4 w-20 bg-muted animate-pulse rounded mx-auto" /></TableCell>
                <TableCell className="text-center"><div className="h-4 w-12 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                <TableCell className="text-center"><div className="h-4 w-16 bg-muted animate-pulse rounded-full mx-auto" /></TableCell>
                <TableCell className="text-center"><div className="h-8 w-8 bg-muted animate-pulse rounded mx-auto" /></TableCell>
              </TableRow>
            ))
          ) : departments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                Không tìm thấy phòng ban nào phù hợp với bộ lọc.
              </TableCell>
            </TableRow>
          ) : (
            departments.map((dept, index) => (
              <TableRow key={dept.id} className="hover:bg-muted/25 transition-colors">
                <TableCell className="text-center font-normal text-muted-foreground text-xs">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {dept.code}
                </TableCell>
                <TableCell className="font-medium text-foreground text-xs">
                  {dept.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {dept.parentDepartmentName || (
                    <span className="italic text-muted-foreground/60">Đơn vị gốc (Root)</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {dept.costCenterName ? (
                    <Badge variant="outline" className="font-normal text-2xs">
                      {dept.costCenterName}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground/50">--</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                  {dept.effectiveFrom || "--"}
                </TableCell>
                <TableCell className="text-center">
                  {dept.isPermissionInherited ? (
                    <Badge variant="secondary" className="text-2xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">
                      <Unlock className="h-3 w-3 mr-1 text-emerald-600" />
                      Có
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-2xs text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1 text-muted-foreground/60" />
                      Không
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={dept.isActive ? "default" : "secondary"}
                    className={`text-2xs ${dept.isActive ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
                  >
                    {dept.isActive ? "Hoạt động" : "Giải thể"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Thao tác</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 text-xs">
                      <DropdownMenuItem onClick={() => onViewDetail(dept)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Xem chi tiết & Lịch sử</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(dept)} disabled={!canManage} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Chỉnh sửa cơ cấu</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMove(dept)} disabled={!canManage} className="cursor-pointer">
                        <ArrowRightLeft className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Điều chuyển vị trí</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDissolve(dept)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                        disabled={!canManage || !dept.isActive}
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        <span>Giải thể phòng ban</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

