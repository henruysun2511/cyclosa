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

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
        Đang tải danh sách phòng ban...
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Không tìm thấy phòng ban nào phù hợp với bộ lọc.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden shadow-2xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/75 hover:bg-slate-50/75">
            <TableHead className="w-12 text-center">STT</TableHead>
            <TableHead className="w-36 font-semibold">Mã đơn vị</TableHead>
            <TableHead className="font-semibold">Tên phòng ban</TableHead>
            <TableHead className="font-semibold">Trực thuộc (Cấp trên)</TableHead>
            <TableHead className="font-semibold">Trung tâm chi phí</TableHead>
            <TableHead className="w-32 text-center font-semibold">Ngày hiệu lực</TableHead>
            <TableHead className="w-28 text-center font-semibold">Kế thừa quyền</TableHead>
            <TableHead className="w-28 text-center font-semibold">Trạng thái</TableHead>
            <TableHead className="w-16 text-center font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept, index) => (
            <TableRow key={dept.id} className="hover:bg-slate-50/50">
              <TableCell className="text-center font-normal text-slate-500">
                {index + 1}
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold text-primary">
                {dept.code}
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {dept.name}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {dept.parentDepartmentName || (
                  <span className="italic text-slate-400">Đơn vị gốc (Root)</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {dept.costCenterName ? (
                  <Badge variant="outline" className="font-normal text-2xs bg-slate-50">
                    {dept.costCenterName}
                  </Badge>
                ) : (
                  <span className="text-slate-400">--</span>
                )}
              </TableCell>
              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                {dept.effectiveFrom || "--"}
              </TableCell>
              <TableCell className="text-center">
                {dept.isPermissionInherited ? (
                  <Badge variant="secondary" className="text-2xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    <Unlock className="h-3 w-3 mr-1 text-emerald-600" />
                    Có
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-2xs text-slate-500">
                    <Lock className="h-3 w-3 mr-1 text-slate-400" />
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Thao tác</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onViewDetail(dept)}>
                      <Eye className="mr-2 h-4 w-4 text-slate-500" />
                      <span>Xem chi tiết & Lịch sử</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(dept)} disabled={!canManage}>
                      <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                      <span>Chỉnh sửa cơ cấu</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onMove(dept)} disabled={!canManage}>
                      <ArrowRightLeft className="mr-2 h-4 w-4 text-slate-500" />
                      <span>Điều chuyển vị trí</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDissolve(dept)}
                      className="text-destructive focus:text-destructive"
                      disabled={!canManage || !dept.isActive}
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      <span>Giải thể phòng ban</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

