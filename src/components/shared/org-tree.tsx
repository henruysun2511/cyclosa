"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  FolderTree,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DepartmentNode {
  id: string | number;
  name: string;
  code: string;
  managerName?: string;
  employeeCount?: number;
  children?: DepartmentNode[];
}

export const MOCK_ORG_TREE: DepartmentNode[] = [
  {
    id: "corp",
    name: "Tập Đoàn CYCLOSA FSI",
    code: "CORP",
    managerName: "Nguyễn Văn An (CEO)",
    employeeCount: 450,
    children: [
      {
        id: "bod",
        name: "Ban Tổng Giám Đốc",
        code: "BOD",
        managerName: "Nguyễn Văn An",
        employeeCount: 6,
      },
      {
        id: "hr",
        name: "Khối Quản Trị Nhân Sự",
        code: "HRD",
        managerName: "Trần Thị Mai (HR Director)",
        employeeCount: 28,
        children: [
          { id: "hr_rec", name: "Phòng Tuyển Dụng & Thu Hút Nhân Tài", code: "REC", managerName: "Lê Thu Trang", employeeCount: 10 },
          { id: "hr_cbn", name: "Phòng Tiền Lương & Đãi Ngộ (C&B)", code: "CBN", managerName: "Đỗ Hải Nam", employeeCount: 8 },
          { id: "hr_ops", name: "Phòng Vận Hành Nhân Sự & Đào Tạo", code: "OPS", managerName: "Bùi Tuyết Mai", employeeCount: 10 },
        ],
      },
      {
        id: "tech",
        name: "Khối Công Nghệ & Chuyển Đổi Số",
        code: "TECH",
        managerName: "Lê Hoàng Nam (CTO)",
        employeeCount: 215,
        children: [
          { id: "tech_fe", name: "Phòng Phát Triển Frontend", code: "FED", managerName: "Phạm Minh Tuấn", employeeCount: 45 },
          { id: "tech_be", name: "Phòng Phát Triển Backend & Cloud", code: "BED", managerName: "Trần Quốc Bảo", employeeCount: 65 },
          { id: "tech_ai", name: "Trung Tâm Nghiên Cứu AI & Data", code: "AIR", managerName: "Lê Thúy Hằng", employeeCount: 30 },
          { id: "tech_qa", name: "Phòng Đảm Bảo Chất Lượng (QA/QC)", code: "QAD", managerName: "Nguyễn Kim Ngân", employeeCount: 40 },
          { id: "tech_sec", name: "Phòng An Toàn Thông Tin & SecOps", code: "SEC", managerName: "Vũ Hải Đăng", employeeCount: 35 },
        ],
      },
      {
        id: "fin",
        name: "Khối Tài Chính - Kế Toán",
        code: "FIN",
        managerName: "Hoàng Thảo Linh (CFO)",
        employeeCount: 35,
        children: [
          { id: "fin_acc", name: "Phòng Kế Toán Doanh Nghiệp", code: "ACC", managerName: "Ngô Quang Huy", employeeCount: 22 },
          { id: "fin_treasury", name: "Phòng Quản Lý Vốn & Ngân Quỹ", code: "TRS", managerName: "Lý Gia Hân", employeeCount: 13 },
        ],
      },
      {
        id: "biz",
        name: "Khối Kinh Doanh & Tiếp Thị",
        code: "BIZ",
        managerName: "Vũ Đức Long (CCO)",
        employeeCount: 140,
        children: [
          { id: "biz_sales", name: "Trung Tâm Kinh Doanh Doanh Nghiệp", code: "ENT", managerName: "Đinh Trọng Phúc", employeeCount: 95 },
          { id: "biz_mkt", name: "Phòng Marketing & Truyền Thông", code: "MKT", managerName: "Chu Diệu Linh", employeeCount: 45 },
        ],
      },
      {
        id: "leg",
        name: "Ban Pháp Chế & Quản Trị Rủi Ro",
        code: "LEG",
        managerName: "Đặng Bích Ngọc (Chief Legal Officer)",
        employeeCount: 26,
      },
    ],
  },
];

export interface OrgTreeProps {
  data?: DepartmentNode[];
  selectedId?: string | number | null;
  onSelect?: (node: DepartmentNode) => void;
  className?: string;
  showEmployeeCount?: boolean;
  showManager?: boolean;
}

export function OrgTree({
  data = MOCK_ORG_TREE,
  selectedId,
  onSelect,
  className,
  showEmployeeCount = true,
  showManager = true,
}: OrgTreeProps) {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({
    corp: true,
    tech: true,
    hr: true,
  });

  const toggleExpand = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMap((prev) => ({
      ...prev,
      [String(id)]: !prev[String(id)],
    }));
  };

  const renderNode = (node: DepartmentNode, level: number = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedMap[String(node.id)] ?? false;
    const isSelected = selectedId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors border border-transparent my-0.5",
            isSelected ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "hover:bg-slate-100/80 text-foreground",
            level > 0 && "ml-4"
          )}
          style={{ paddingLeft: `${Math.max(12, level * 18)}px` }}
          onClick={() => onSelect?.(node)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {hasChildren ? (
              <button
                type="button"
                className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500 shrink-0"
                onClick={(e) => toggleExpand(node.id, e)}
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span className="w-5 shrink-0" />
            )}

            <Building2 className={cn("h-4 w-4 shrink-0", level === 0 ? "text-primary" : "text-slate-500")} />

            <div className="truncate">
              <span className="text-sm font-medium">{node.name}</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-mono font-normal">({node.code})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            {showManager && node.managerName && (
              <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
                <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate max-w-40">{node.managerName}</span>
              </div>
            )}

            {showEmployeeCount && node.employeeCount !== undefined && (
              <Badge variant="secondary" className="px-2 py-0 text-2xs font-mono font-normal bg-slate-100 text-slate-700">
                <Users className="h-3 w-3 mr-1" />
                {node.employeeCount}
              </Badge>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-slate-200 ml-5 my-0.5">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-1 bg-white p-3 rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FolderTree className="h-4 w-4 text-primary" />
          Sơ đồ cơ cấu tổ chức
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => {
              const allExpanded: Record<string, boolean> = {};
              const fill = (nodes: DepartmentNode[]) => {
                nodes.forEach((n) => {
                  allExpanded[String(n.id)] = true;
                  if (n.children) fill(n.children);
                });
              };
              fill(data);
              setExpandedMap(allExpanded);
            }}
          >
            Mở rộng hết
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setExpandedMap({ corp: true })}
          >
            Thu gọn
          </Button>
        </div>
      </div>

      <div className="space-y-0.5 overflow-x-auto">
        {data.map((rootNode) => renderNode(rootNode, 0))}
      </div>
    </div>
  );
}
