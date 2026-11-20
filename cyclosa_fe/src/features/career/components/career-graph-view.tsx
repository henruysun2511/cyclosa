"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Network,
  Clock,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  Maximize2,
  Info,
  CheckCircle2,
} from "lucide-react";
import type { CareerGraphResponse, CareerGraphNode, CareerGraphEdge } from "../types/career.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CareerGraphViewProps {
  graphData?: CareerGraphResponse;
  isLoading?: boolean;
}

// 1. Custom Node thể hiện Chức danh (Job Title) trong Đồ thị
function JobTitleCustomNode({
  data,
  selected,
}: {
  data: {
    label: string;
    code: string;
    isCurrent?: boolean;
    requirementsCount?: number;
  };
  selected?: boolean;
}) {
  return (
    <div
      className={`relative min-w-[240px] max-w-[280px] rounded-xl border bg-card/95 backdrop-blur-xs p-4 shadow-md transition-all duration-200 cursor-pointer ${
        selected
          ? "border-primary ring-3 ring-primary/20 shadow-lg scale-102"
          : data.isCurrent
          ? "border-primary/60 ring-2 ring-primary/10 shadow-primary/5"
          : "border-border/80 hover:border-primary/50 hover:shadow-lg"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background shadow-xs -left-1.5"
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
          {data.code}
        </span>
        {data.isCurrent && (
          <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] h-4.5 px-2 font-medium">
            <Sparkles className="h-2.5 w-2.5 mr-1 text-primary" />
            Hiện tại
          </Badge>
        )}
      </div>

      <div className="flex items-start gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
          <Award className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
            {data.label}
          </h4>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background shadow-xs -right-1.5"
      />
    </div>
  );
}

const nodeTypes = {
  jobTitle: JobTitleCustomNode,
};

// 2. Thuật toán tự động sắp xếp tầng (DAG Layout: Left-to-Right Hierarchy)
function calculateDagLayout(nodes: CareerGraphNode[], edges: CareerGraphEdge[]) {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodes.forEach((n) => {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  });

  edges.forEach((e) => {
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
    const list = adj.get(e.source) || [];
    list.push(e.target);
    adj.set(e.source, list);
  });

  const depth = new Map<string, number>();
  nodes.forEach((n) => depth.set(n.id, 0));

  // Gốc là các node không có cạnh dẫn tới
  const roots = nodes.filter((n) => (inDegree.get(n.id) || 0) === 0).map((n) => n.id);
  if (roots.length === 0 && nodes.length > 0) {
    roots.push(nodes[0].id);
  }

  const queue = [...roots];
  const visited = new Set<string>(queue);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currDepth = depth.get(curr) || 0;
    const neighbors = adj.get(curr) || [];

    neighbors.forEach((next) => {
      const nextDepth = Math.max(depth.get(next) || 0, currDepth + 1);
      depth.set(next, nextDepth);
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    });
  }

  // Nhóm theo từng tầng (Level)
  const layers = new Map<number, string[]>();
  nodes.forEach((n) => {
    const d = depth.get(n.id) || 0;
    const list = layers.get(d) || [];
    list.push(n.id);
    layers.set(d, list);
  });

  // Gán tọa độ (X, Y)
  const positions = new Map<string, { x: number; y: number }>();
  layers.forEach((nodeIds, layerIndex) => {
    const x = 60 + layerIndex * 360;
    nodeIds.forEach((id, idx) => {
      const y = 80 + idx * 150;
      positions.set(id, { x, y });
    });
  });

  return positions;
}

export function CareerGraphView({ graphData, isLoading = false }: CareerGraphViewProps) {
  const rawNodes = graphData?.nodes || [];
  const rawEdges = graphData?.edges || [];

  const [selectedEdge, setSelectedEdge] = useState<CareerGraphEdge | null>(null);
  const [selectedNode, setSelectedNode] = useState<CareerGraphNode | null>(null);

  // Tạo map tra cứu tên node
  const nodeNameMap = useMemo(() => {
    const map = new Map<string, string>();
    rawNodes.forEach((n) => map.set(n.id, n.label));
    return map;
  }, [rawNodes]);

  // Chuyển đổi dữ liệu sang React Flow Nodes & Edges
  const initialNodes: Node[] = useMemo(() => {
    const positions = calculateDagLayout(rawNodes, rawEdges);

    return rawNodes.map((n) => {
      const pos = positions.get(n.id) || { x: 80, y: 80 };
      return {
        id: n.id,
        type: "jobTitle",
        position: pos,
        data: {
          label: n.label,
          code: n.code,
          isCurrent: n.isCurrent,
        },
      };
    });
  }, [rawNodes, rawEdges]);

  const initialEdges: Edge[] = useMemo(() => {
    return rawEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "var(--primary, #2563eb)",
        width: 16,
        height: 16,
      },
      style: {
        stroke: "var(--primary, #2563eb)",
        strokeWidth: 2.2,
      },
      label: `${e.minYears} năm`,
      labelStyle: {
        fill: "var(--foreground, #0f172a)",
        fontWeight: 600,
        fontSize: 11,
      },
      labelBgStyle: {
        fill: "var(--card, #ffffff)",
        fillOpacity: 0.95,
        stroke: "var(--primary, #2563eb)",
        strokeWidth: 1,
        rx: 6,
        ry: 6,
      },
      labelBgPadding: [6, 4] as [number, number],
      data: {
        minYears: e.minYears,
        requirements: e.requirements,
      } as Record<string, unknown>,
    }));
  }, [rawEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Cập nhật khi prop thay đổi
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Xử lý khi click vào edge
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const matched = rawEdges.find((e) => e.id === edge.id);
      if (matched) {
        setSelectedEdge(matched);
        setSelectedNode(null);
      }
    },
    [rawEdges]
  );

  // Xử lý khi click vào node
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const matched = rawNodes.find((n) => n.id === node.id);
      if (matched) {
        setSelectedNode(matched);
        setSelectedEdge(null);
      }
    },
    [rawNodes]
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground animate-pulse">
          <Network className="h-10 w-10 text-primary" />
          <p className="text-sm font-medium">Đang khởi tạo canvas đồ thị mạng lưới thăng tiến...</p>
        </div>
      </div>
    );
  }

  if (rawNodes.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
        <Network className="h-12 w-12 text-muted-foreground/60 mb-3" />
        <h3 className="text-base font-semibold text-foreground">Chưa có dữ liệu đồ thị thăng tiến</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          Hãy tạo các tuyến thăng tiến ở tab Danh sách để hệ thống tự động kết xuất mạng lưới nấc thang công danh.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-border bg-card/50">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <span>Sơ đồ Đồ thị Mạng lưới Thăng tiến (Career Graph)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Trực quan hóa luồng nấc thang công danh theo mô hình DAG. Bạn có thể kéo thả, phóng to / thu nhỏ và bấm vào từng nút / mũi tên để xem chi tiết.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2.5 py-1 bg-background">
            <Layers className="h-3 w-3 mr-1 text-primary" />
            {rawNodes.length} Vị trí chức danh
          </Badge>
          <Badge variant="outline" className="text-xs px-2.5 py-1 bg-background">
            <ArrowRight className="h-3 w-3 mr-1 text-primary" />
            {rawEdges.length} Tuyến thăng tiến
          </Badge>
        </div>
      </div>

      {/* 2. Main Interactive Canvas Area */}
      <div className="relative w-full h-[620px] bg-slate-50/50 dark:bg-slate-950/40">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={1.8}
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.2} color="#94a3b8" />
          <Controls className="!bg-card !border-border !shadow-md !rounded-lg" />
          <MiniMap
            zoomable
            pannable
            nodeColor="#3b82f6"
            maskColor="rgba(0, 0, 0, 0.1)"
            className="!bg-card !border-border !rounded-lg !shadow-md"
          />
        </ReactFlow>

        {/* 3. Floating Detail Inspector Panel (Khi chọn Node hoặc Edge) */}
        {selectedEdge && (
          <div className="absolute top-4 right-4 z-10 w-84 rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Chi tiết Tuyến thăng tiến
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedEdge(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <span className="text-muted-foreground">Từ:</span>
                <span className="font-semibold">{nodeNameMap.get(selectedEdge.source) || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <span className="text-muted-foreground">Đến:</span>
                <span className="font-semibold text-primary">{nodeNameMap.get(selectedEdge.target) || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Kinh nghiệm tối thiểu:</span>
                <Badge variant="secondary" className="font-semibold">
                  {selectedEdge.minYears} năm
                </Badge>
              </div>

              {selectedEdge.requirements && (
                <div className="pt-2 border-t border-border/60">
                  <span className="font-medium text-muted-foreground block mb-1">
                    Tiêu chuẩn & Yêu cầu năng lực:
                  </span>
                  <p className="text-foreground leading-relaxed bg-muted/40 p-2 rounded-md">
                    {selectedEdge.requirements}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedNode && (
          <div className="absolute top-4 right-4 z-10 w-80 rounded-xl border border-border bg-card/95 backdrop-blur-md p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                Thông tin Chức danh
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Mã chức danh</span>
                <span className="font-mono font-medium text-foreground">{selectedNode.code}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Tên chức danh</span>
                <span className="text-sm font-semibold text-foreground">{selectedNode.label}</span>
              </div>
              {selectedNode.isCurrent && (
                <div className="flex items-center gap-1.5 text-primary font-medium pt-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Đây là vị trí làm việc hiện tại của bạn</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Canvas Footer Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-muted/20 border-t border-border text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Nút chức danh (Node)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-primary inline-block" />
            <span>Đường dẫn thăng tiến kèm số năm kinh nghiệm</span>
          </span>
        </div>
        <span>Mẹo: Cuộn chuột để phóng to/thu nhỏ, giữ chuột trái để di chuyển toàn bộ sơ đồ.</span>
      </div>
    </div>
  );
}
