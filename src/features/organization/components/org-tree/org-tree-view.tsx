"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  FolderTree,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  ArrowRightLeft,
  Trash2,
  Tag,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import type { Department, DepartmentNode } from "../../types/organization.types";

interface OrgTreeViewProps {
  nodes: DepartmentNode[];
  isLoading: boolean;
  selectedNodeId?: string | null;
  onSelectNode: (node: DepartmentNode) => void;
  onAddSubDepartment: (parentId: string) => void;
  onEdit: (node: DepartmentNode) => void;
  onMove: (node: DepartmentNode) => void;
  onDissolve: (node: DepartmentNode) => void;
  className?: string;
}

export function OrgTreeView({
  nodes,
  isLoading,
  selectedNodeId,
  onSelectNode,
  onAddSubDepartment,
  onEdit,
  onMove,
  onDissolve,
  className,
}: OrgTreeViewProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (list: DepartmentNode[]) => {
      list.forEach((n) => {
        all[n.id] = true;
        if (n.children && n.children.length > 0) traverse(n.children);
      });
    };
    traverse(nodes);
    setExpandedMap(all);
  };

  const collapseAll = () => {
    setExpandedMap({});
  };

  const renderNodeCard = (node: DepartmentNode, level: number = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    // Mặc định mở 2 cấp đầu tiên nếu chưa set
    const isExpanded = expandedMap[node.id] !== undefined ? expandedMap[node.id] : level < 2;
    const isSelected = selectedNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node)}
          className={cn(
            "group flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border my-1 transition-all cursor-pointer",
            isSelected
              ? "bg-primary/10 border-primary/40 shadow-xs ring-1 ring-primary/20"
              : level === 0
              ? "bg-slate-50 border-slate-200/90 hover:border-primary/30 shadow-2xs"
              : "bg-white border-border hover:border-primary/40 hover:bg-slate-50/80 shadow-2xs",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${Math.max(12, level * 20)}px` }}
        >
          {/* Cột trái: Nút expand, Icon Building2, Tên & Mã */}
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {hasChildren ? (
              <button
                type="button"
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 shrink-0 transition-colors"
                onClick={(e) => toggleExpand(node.id, e)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <span className="w-5 shrink-0" />
            )}

            <Building2
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                isSelected
                  ? "text-primary"
                  : level === 0
                  ? "text-primary"
                  : "text-slate-400 group-hover:text-primary"
              )}
            />

            <div className="truncate flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold tracking-tight transition-colors truncate",
                    isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}
                >
                  {node.name}
                </span>
                <span className="font-mono text-xs font-medium text-slate-400 shrink-0">
                  ({node.code})
                </span>
              </div>
            </div>
          </div>

          {/* Cột giữa: Tag Trung tâm chi phí & Kế thừa quyền & Số nhân sự */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {node.costCenterName && (
              <Badge variant="outline" className="hidden lg:flex font-normal text-2xs bg-slate-50 text-slate-500">
                <Tag className="h-3 w-3 mr-1 text-slate-400" />
                {node.costCenterName}
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "hidden sm:flex text-2xs",
                node.isPermissionInherited
                  ? "text-emerald-700 bg-emerald-50/50 border-emerald-200"
                  : "text-slate-400 border-slate-200"
              )}
              title={
                node.isPermissionInherited
                  ? "Phòng ban con kế thừa quyền"
                  : "Không kế thừa quyền"
              }
            >
              {node.isPermissionInherited ? (
                <Unlock className="h-3 w-3 mr-1 text-emerald-600" />
              ) : (
                <Lock className="h-3 w-3 mr-1 text-slate-400" />
              )}
              {node.isPermissionInherited ? "Kế thừa quyền" : "Quyền độc lập"}
            </Badge>

            <Badge variant="secondary" className="px-2 py-0.5 text-xs font-normal">
              <Users className="h-3 w-3 mr-1 text-slate-500" />
              {node.memberCount || 0}
            </Badge>

            {/* Quick action: Thêm đơn vị con */}
            {canManage && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-primary"
                title="Thêm đơn vị con trực thuộc"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubDepartment(node.id);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Action menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onSelectNode(node)}>
                  <Eye className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Xem chi tiết & Lịch sử</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(node)} disabled={!canManage}>
                  <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Chỉnh sửa cơ cấu</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(node)} disabled={!canManage}>
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Điều chuyển vị trí</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDissolve(node)}
                  disabled={!canManage}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  <span>Giải thể phòng ban</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Cành con */}
        {hasChildren && isExpanded && (
          <div className="border-l-2 border-slate-200 ml-5 my-0.5">
            {node.children.map((child) => renderNodeCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-2 bg-white p-4 rounded-lg border border-border shadow-2xs", className)}>
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FolderTree className="h-4 w-4 text-primary" />
          Sơ đồ phả hệ phân cấp ({nodes.length} đơn vị cấp cao)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={expandAll}
          >
            Mở rộng tất cả
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2.5"
            onClick={collapseAll}
          >
            Thu gọn tất cả
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
          Đang tải cây sơ đồ tổ chức...
        </div>
      ) : nodes.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          Chưa có cơ cấu phòng ban nào được thiết lập.
        </div>
      ) : (
        <div className="space-y-1 overflow-x-auto">
          {nodes.map((rootNode) => renderNodeCard(rootNode, 0))}
        </div>
      )}
    </div>
  );
}

