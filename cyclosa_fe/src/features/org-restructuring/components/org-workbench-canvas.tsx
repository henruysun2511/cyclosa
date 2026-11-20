"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import {
  Building2,
  Users,
  UserCheck,
  ShieldAlert,
  Trash2,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";
import type {
  ScenarioDepartmentTreeNode,
  ScenarioDepartmentItem,
} from "../types/org-restructuring.types";
import { DEPT_SCENARIO_STATUS_CONFIG } from "../constants/org-restructuring.constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrgWorkbenchCanvasProps {
  treeData: ScenarioDepartmentTreeNode[];
  onSelectDepartment: (deptId: string) => void;
  onDissolveDepartment?: (deptId: string) => void;
  isLoading?: boolean;
}

// 1. Custom Node cho Phòng ban trong Canvas Tái cơ cấu
function OrgDeptCustomNode({
  data,
  selected,
}: {
  data: {
    dept: ScenarioDepartmentTreeNode;
    onSelect: (id: string) => void;
    onDissolve?: (id: string) => void;
  };
  selected?: boolean;
}) {
  const dept = data.dept;
  const statusConfig = DEPT_SCENARIO_STATUS_CONFIG[dept.statusInScenario] || {
    label: dept.statusInScenario,
    badgeClass: "bg-slate-100 text-slate-700",
    nodeClass: "border-border/80 bg-card",
  };

  return (
    <div
      onClick={() => data.onSelect(dept.id)}
      className={`relative min-w-[260px] max-w-[300px] rounded-xl border bg-card/95 backdrop-blur-xs p-3.5 shadow-md transition-all duration-200 cursor-pointer ${
        selected ? "ring-2 ring-primary border-primary shadow-lg scale-102" : statusConfig.nodeClass
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background shadow-xs -top-1.5"
      />

      {/* Header card: Mã + Badge trạng thái */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
          {dept.code}
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusConfig.badgeClass}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Body: Tên phòng ban */}
      <div className="flex items-start gap-2 mb-2.5">
        <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
            {dept.name}
          </h4>
        </div>
      </div>

      {/* Footer: Trưởng phòng + Định biên */}
      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 truncate max-w-[150px]">
          <UserCheck className="h-3 w-3 text-primary shrink-0" />
          <span className="truncate">{dept.managerEmployeeName || "Chưa bổ nhiệm"}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 font-medium text-foreground">
          <Users className="h-3 w-3 text-primary" />
          <span>{dept.currentHeadcount}</span>
          {dept.targetHeadcount > 0 && (
            <span className="text-muted-foreground font-normal">/{dept.targetHeadcount}</span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background shadow-xs -bottom-1.5"
      />
    </div>
  );
}

const nodeTypes = {
  orgDept: OrgDeptCustomNode,
};

export function OrgWorkbenchCanvas({
  treeData,
  onSelectDepartment,
  onDissolveDepartment,
  isLoading = false,
}: OrgWorkbenchCanvasProps) {
  // Biến đổi cây lồng nhau sang phẳng Nodes và Edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let currentYByLevel: Record<number, number> = {};

    function traverse(
      node: ScenarioDepartmentTreeNode,
      level: number,
      parentPos?: { x: number; y: number }
    ) {
      if (!currentYByLevel[level]) currentYByLevel[level] = 60;

      const x = 80 + level * 340;
      const y = currentYByLevel[level];
      currentYByLevel[level] += 160;

      nodes.push({
        id: node.id,
        type: "orgDept",
        position: { x, y },
        data: {
          dept: node,
          onSelect: onSelectDepartment,
          onDissolve: onDissolveDepartment,
        },
      });

      if (node.parentScenarioDeptId && parentPos) {
        edges.push({
          id: `e-${node.parentScenarioDeptId}-${node.id}`,
          source: node.parentScenarioDeptId,
          target: node.id,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--primary, #3b82f6)",
            width: 14,
            height: 14,
          },
          style: {
            stroke: "var(--primary, #3b82f6)",
            strokeWidth: 2,
          },
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child, level + 1, { x, y }));
      }
    }

    treeData.forEach((root) => traverse(root, 0));

    return { initialNodes: nodes, initialEdges: edges };
  }, [treeData, onSelectDepartment, onDissolveDepartment]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="w-full h-[640px] rounded-xl border border-border bg-card flex items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">
          Đang kết xuất sơ đồ cây tổ chức giả lập...
        </p>
      </div>
    );
  }

  if (treeData.length === 0) {
    return (
      <div className="w-full h-[640px] rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center p-8">
        <Building2 className="h-10 w-10 text-muted-foreground/60 mb-2" />
        <h4 className="text-sm font-semibold">Chưa có phòng ban trong kịch bản</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Hãy bấm "Thêm đơn vị" trên thanh công cụ để xây dựng cấu trúc tổ chức mới.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[640px] rounded-xl border border-border bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden shadow-xs">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.8}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#94a3b8" />
        <Controls className="!bg-card !border-border !shadow-md !rounded-lg" />
        <MiniMap
          zoomable
          pannable
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-card !border-border !rounded-lg !shadow-md"
        />
      </ReactFlow>

      {/* Legend Footer */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-3 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-[11px]">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Mới thành lập
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Có điều chỉnh
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Sáp nhập
        </span>
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Giải thể
        </span>
      </div>
    </div>
  );
}
