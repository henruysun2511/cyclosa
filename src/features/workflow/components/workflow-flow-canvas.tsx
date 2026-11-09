"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Settings2,
  UserCheck,
  Shield,
  Users,
  User,
  ArrowDown,
  LayoutGrid,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPROVER_TYPE_OPTIONS,
  CONDITION_TYPE_OPTIONS,
} from "../constants/workflow.constants";
import type {
  ApproverType,
  StepConditionType,
  CreateWorkflowStepRequest,
} from "../types/workflow.types";

interface RoleOption {
  id: string;
  name: string;
}

interface EmployeeOption {
  id: string;
  fullName: string;
  employeeCode: string;
}

// ── CUSTOM NODES ─────────────────────────────────────────────────────────────

// 1. Start Node
function StartNode() {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg border-2 border-emerald-400/50 min-w-[170px] text-center">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 backdrop-blur-xs">
        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">Khởi tạo hồ sơ</span>
      <span className="text-[10px] text-emerald-100 opacity-90 mt-0.5">Người tạo gửi duyệt</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

// 2. Approval Step Node Data Interface
interface ApprovalStepNodeData {
  index: number;
  step: CreateWorkflowStepRequest;
  roleName?: string;
  employeeName?: string;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  canDelete: boolean;
}

// Approval Step Node Component
function ApprovalStepNode({ data }: { data: ApprovalStepNodeData }) {
  const { index, step, roleName, employeeName, onEdit, onDelete, canDelete } = data;

  const getApproverInfo = () => {
    switch (step.approverType) {
      case "DIRECT_MANAGER":
        return {
          icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />,
          label: "Quản lý trực tiếp",
          bg: "bg-blue-600 text-white",
          sub: "Tự động phân công theo sơ đồ",
        };
      case "DEPARTMENT_HEAD":
        return {
          icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
          label: "Trưởng phòng ban",
          bg: "bg-cyan-600 text-white",
          sub: "Trưởng đơn vị công tác",
        };
      case "ROLE":
        return {
          icon: <Shield className="w-3.5 h-3.5 text-purple-400" />,
          label: roleName || "Theo vai trò",
          bg: "bg-purple-600 text-white",
          sub: "Phân bổ theo quyền hệ thống",
        };
      case "SPECIFIC_EMPLOYEE":
        return {
          icon: <User className="w-3.5 h-3.5 text-indigo-400" />,
          label: employeeName || "Nhân viên chỉ định",
          bg: "bg-indigo-600 text-white",
          sub: "Chỉ định cố định",
        };
      default:
        return {
          icon: <UserCheck className="w-3.5 h-3.5" />,
          label: "Người duyệt",
          bg: "bg-slate-600 text-white",
          sub: "",
        };
    }
  };

  const info = getApproverInfo();

  return (
    <div className="relative group rounded-xl bg-card border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60 transition-all duration-200 min-w-[270px] max-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !w-3 !h-3 !border-2 !border-white"
      />

      {/* Card Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/60 border-b">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-foreground truncate max-w-[170px]" title={step.stepName}>
            {step.stepName || `Cấp duyệt ${index + 1}`}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(index);
            }}
            className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Chỉnh sửa bước này"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </Button>
          {canDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
              className="h-6 w-6 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Xóa bước này"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2.5">
        {/* Approver Tag */}
        <div className="flex items-center gap-2">
          <Badge className={`${info.bg} text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5`}>
            {info.icon}
            <span className="truncate max-w-[190px]">{info.label}</span>
          </Badge>
        </div>

        {/* Condition details */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
          <span className="text-muted-foreground">Điều kiện:</span>
          {step.conditionType === "AMOUNT_ABOVE_THRESHOLD" ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded text-[10px]">
              Vượt {Number(step.conditionThreshold || 0).toLocaleString("vi-VN")} đ
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Luôn luôn duyệt
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

// 3. Condition Gateway Node (Khối Rẽ Nhánh Điều Kiện)
interface ConditionGatewayNodeData {
  threshold: number;
  stepName: string;
  stepIndex: number;
  onEdit: (index: number) => void;
}

function ConditionGatewayNode({ data }: { data: ConditionGatewayNodeData }) {
  const { threshold, stepName, stepIndex, onEdit } = data;
  return (
    <div
      onClick={() => onEdit(stepIndex)}
      className="relative group cursor-pointer p-3 rounded-xl bg-amber-500/10 border-2 border-amber-500/70 dark:bg-amber-950/40 shadow-md hover:shadow-lg hover:border-amber-500 transition-all text-center min-w-[230px] max-w-[270px]"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="flex items-center justify-center gap-1.5 text-amber-700 dark:text-amber-400 mb-1">
        <GitBranch className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider">
          Rẽ nhánh điều kiện
        </span>
      </div>
      <div className="text-xs font-semibold text-foreground">
        Số tiền {">"} {Number(threshold || 0).toLocaleString("vi-VN")} đ?
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
        Duyệt bởi: {stepName}
      </div>

      {/* Handle YES: Bottom */}
      <Handle
        type="source"
        id="yes"
        position={Position.Bottom}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
      />

      {/* Handle NO: Right */}
      <Handle
        type="source"
        id="no"
        position={Position.Right}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  );
}

// 4. End Node
function EndNode() {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg border-2 border-emerald-400/50 min-w-[170px] text-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
      />
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 backdrop-blur-xs">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">Hoàn tất quy trình</span>
      <span className="text-[10px] text-emerald-100 opacity-90 mt-0.5">Phê duyệt thành công</span>
    </div>
  );
}

const nodeTypes = {
  start: StartNode,
  approvalStep: ApprovalStepNode,
  conditionGateway: ConditionGatewayNode,
  end: EndNode,
};

// ── WORKFLOW FLOW CANVAS COMPONENT ──────────────────────────────────────────

interface WorkflowFlowCanvasProps {
  steps: CreateWorkflowStepRequest[];
  onChangeSteps: (steps: CreateWorkflowStepRequest[]) => void;
  roles: RoleOption[];
  employees: EmployeeOption[];
}

export function WorkflowFlowCanvas({
  steps,
  onChangeSteps,
  roles,
  employees,
}: WorkflowFlowCanvasProps) {
  // Modal Edit Step State
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editStepForm, setEditStepForm] = useState<CreateWorkflowStepRequest | null>(null);

  // Generate initial nodes and edges based on steps
  const generateNodesAndEdges = useCallback(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    const startX = 260;
    let currentY = 30;

    // 1. Start Node
    generatedNodes.push({
      id: "node-start",
      type: "start",
      position: { x: startX + 45, y: currentY },
      data: {},
    });

    currentY += 120;

    let previousTargetId = "node-start";
    // Stores bypass edges from any conditional step that should merge into the next target
    let pendingBypassList: { gatewayId: string; threshold: number }[] = [];

    // 2. Iterate through steps
    steps.forEach((step, idx) => {
      const role = roles.find((r) => r.id === step.approverRoleId);
      const emp = employees.find((e) => e.id === step.approverEmployeeId);
      const stepNodeId = `node-step-${idx}`;
      const isConditional = step.conditionType === "AMOUNT_ABOVE_THRESHOLD";

      if (isConditional) {
        const gatewayId = `node-gateway-${idx}`;
        const threshold = Number(step.conditionThreshold || 0);

        // A. Add Condition Gateway Node
        generatedNodes.push({
          id: gatewayId,
          type: "conditionGateway",
          position: { x: startX + 20, y: currentY },
          data: {
            threshold,
            stepName: step.stepName || `Cấp duyệt ${idx + 1}`,
            stepIndex: idx,
            onEdit: (i: number) => {
              setEditingIndex(i);
              setEditStepForm({ ...steps[i] });
            },
          },
        });

        // Edge from previous step into gateway
        generatedEdges.push({
          id: `edge-${previousTargetId}-${gatewayId}`,
          source: previousTargetId,
          target: gatewayId,
          animated: true,
          style: { stroke: "var(--primary)", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "var(--primary)" },
        });

        // Connect any previous pending bypasses into this gateway
        if (pendingBypassList.length > 0) {
          pendingBypassList.forEach((bypass, bIdx) => {
            generatedEdges.push({
              id: `edge-bypass-${bypass.gatewayId}-${gatewayId}-${bIdx}`,
              source: bypass.gatewayId,
              sourceHandle: "no",
              target: gatewayId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
              label: `Bỏ qua (<= ${bypass.threshold.toLocaleString("vi-VN")} đ)`,
              labelStyle: { fill: "#b45309", fontSize: 10, fontWeight: 600 },
              labelBgStyle: { fill: "var(--card)", fillOpacity: 0.95 },
            });
          });
          pendingBypassList = [];
        }

        currentY += 130;

        // B. Add Approval Step Node (Branch YES)
        generatedNodes.push({
          id: stepNodeId,
          type: "approvalStep",
          position: { x: startX, y: currentY },
          data: {
            index: idx,
            step,
            roleName: role?.name,
            employeeName: emp ? `${emp.fullName} (${emp.employeeCode})` : undefined,
            onEdit: (i: number) => {
              setEditingIndex(i);
              setEditStepForm({ ...steps[i] });
            },
            onDelete: (i: number) => {
              if (steps.length <= 1) return;
              const updated = steps
                .filter((_, sIdx) => sIdx !== i)
                .map((s, newIdx) => ({ ...s, stepOrder: newIdx + 1 }));
              onChangeSteps(updated);
            },
            canDelete: steps.length > 1,
          },
        });

        // Edge YES: Gateway (Bottom) -> Step Node
        generatedEdges.push({
          id: `edge-yes-${gatewayId}-${stepNodeId}`,
          source: gatewayId,
          sourceHandle: "yes",
          target: stepNodeId,
          animated: true,
          style: { stroke: "#10b981", strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
          label: `Thỏa (> ${threshold.toLocaleString("vi-VN")} đ)`,
          labelStyle: { fill: "#047857", fontSize: 10, fontWeight: 700 },
          labelBgStyle: { fill: "var(--card)", fillOpacity: 0.95 },
        });

        // Add this gateway's NO branch to pending list (to connect to the next step or End)
        pendingBypassList.push({ gatewayId, threshold });
        previousTargetId = stepNodeId;
        currentY += 170;
      } else {
        // ALWAYS step
        generatedNodes.push({
          id: stepNodeId,
          type: "approvalStep",
          position: { x: startX, y: currentY },
          data: {
            index: idx,
            step,
            roleName: role?.name,
            employeeName: emp ? `${emp.fullName} (${emp.employeeCode})` : undefined,
            onEdit: (i: number) => {
              setEditingIndex(i);
              setEditStepForm({ ...steps[i] });
            },
            onDelete: (i: number) => {
              if (steps.length <= 1) return;
              const updated = steps
                .filter((_, sIdx) => sIdx !== i)
                .map((s, newIdx) => ({ ...s, stepOrder: newIdx + 1 }));
              onChangeSteps(updated);
            },
            canDelete: steps.length > 1,
          },
        });

        // Edge from previous step
        generatedEdges.push({
          id: `edge-${previousTargetId}-${stepNodeId}`,
          source: previousTargetId,
          target: stepNodeId,
          animated: true,
          style: { stroke: "var(--primary)", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "var(--primary)" },
        });

        // If there were any pending bypass edges from prior steps, connect them to this step
        if (pendingBypassList.length > 0) {
          pendingBypassList.forEach((bypass, bIdx) => {
            generatedEdges.push({
              id: `edge-bypass-${bypass.gatewayId}-${stepNodeId}-${bIdx}`,
              source: bypass.gatewayId,
              sourceHandle: "no",
              target: stepNodeId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
              label: `Bỏ qua (<= ${bypass.threshold.toLocaleString("vi-VN")} đ)`,
              labelStyle: { fill: "#b45309", fontSize: 10, fontWeight: 600 },
              labelBgStyle: { fill: "var(--card)", fillOpacity: 0.95 },
            });
          });
          pendingBypassList = [];
        }

        previousTargetId = stepNodeId;
        currentY += 170;
      }
    });

    // 3. End Node
    generatedNodes.push({
      id: "node-end",
      type: "end",
      position: { x: startX + 45, y: currentY },
      data: {},
    });

    // Connect from last step to End Node
    generatedEdges.push({
      id: `edge-${previousTargetId}-node-end`,
      source: previousTargetId,
      target: "node-end",
      animated: true,
      style: { stroke: "#10b981", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#10b981" },
    });

    // Connect any remaining bypasses into End Node
    if (pendingBypassList.length > 0) {
      pendingBypassList.forEach((bypass, bIdx) => {
        generatedEdges.push({
          id: `edge-bypass-${bypass.gatewayId}-node-end-${bIdx}`,
          source: bypass.gatewayId,
          sourceHandle: "no",
          target: "node-end",
          type: "smoothstep",
          animated: true,
          style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
          label: `Bỏ qua (<= ${bypass.threshold.toLocaleString("vi-VN")} đ)`,
          labelStyle: { fill: "#b45309", fontSize: 10, fontWeight: 600 },
          labelBgStyle: { fill: "var(--card)", fillOpacity: 0.95 },
        });
      });
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [steps, roles, employees, onChangeSteps]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync nodes & edges whenever steps change
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [generateNodesAndEdges, setNodes, setEdges]);

  // Add Step Helpers
  const handleAddPresetStep = (approverType: ApproverType) => {
    const nextOrder = steps.length + 1;
    let stepName = `Cấp duyệt ${nextOrder}`;
    if (approverType === "DIRECT_MANAGER") stepName = "Quản lý trực tiếp xác nhận";
    else if (approverType === "DEPARTMENT_HEAD") stepName = "Trưởng phòng ban xem xét";
    else if (approverType === "ROLE") stepName = "Phê duyệt theo chức vụ";
    else if (approverType === "SPECIFIC_EMPLOYEE") stepName = "Chuyên viên chỉ định thẩm định";

    const newStep: CreateWorkflowStepRequest = {
      stepOrder: nextOrder,
      stepName,
      approverType,
      approverRoleId: approverType === "ROLE" && roles.length > 0 ? roles[0].id : null,
      approverEmployeeId:
        approverType === "SPECIFIC_EMPLOYEE" && employees.length > 0 ? employees[0].id : null,
      conditionType: "ALWAYS",
    };

    onChangeSteps([...steps, newStep]);
  };

  // Save Step Edit from Dialog
  const handleSaveEditStep = () => {
    if (editingIndex === null || !editStepForm) return;
    const updated = [...steps];
    updated[editingIndex] = { ...editStepForm };
    onChangeSteps(updated);
    setEditingIndex(null);
    setEditStepForm(null);
  };

  const handleResetLayout = () => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges();
    setNodes(newNodes);
    setEdges(newEdges);
  };

  return (
    <div className="space-y-3">
      {/* Canvas Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-muted/30 border rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Thêm nhanh:
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddPresetStep("DIRECT_MANAGER")}
            className="h-7 text-xs bg-background hover:bg-primary/5 hover:text-primary border-dashed"
          >
            <UserCheck className="w-3 h-3 mr-1 text-blue-500" />
            + Quản lý trực tiếp
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddPresetStep("DEPARTMENT_HEAD")}
            className="h-7 text-xs bg-background hover:bg-primary/5 hover:text-primary border-dashed"
          >
            <Users className="w-3 h-3 mr-1 text-cyan-500" />
            + Trưởng phòng ban
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddPresetStep("ROLE")}
            className="h-7 text-xs bg-background hover:bg-primary/5 hover:text-primary border-dashed"
          >
            <Shield className="w-3 h-3 mr-1 text-purple-500" />
            + Theo vai trò
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddPresetStep("SPECIFIC_EMPLOYEE")}
            className="h-7 text-xs bg-background hover:bg-primary/5 hover:text-primary border-dashed"
          >
            <User className="w-3 h-3 mr-1 text-indigo-500" />
            + Nhân viên chỉ định
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResetLayout}
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          title="Tự động căn chỉnh lại các khối trên bảng vẽ"
        >
          <LayoutGrid className="w-3.5 h-3.5 mr-1" />
          Căn chỉnh lại sơ đồ
        </Button>
      </div>

      {/* React Flow Container */}
      <div className="w-full h-[640px] rounded-xl border bg-card/60 shadow-inner overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1.2} />
          <Controls showInteractive={false} className="!bg-card !border-border !shadow-md" />
          <MiniMap
            zoomable
            pannable
            className="!bg-card/80 !border-border !rounded-lg"
            nodeColor={() => "var(--primary)"}
          />
        </ReactFlow>

        {/* Tip helper floating */}
        <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-xs border px-3 py-1.5 rounded-lg text-[11px] text-muted-foreground shadow-sm pointer-events-none">
          💡 Bạn có thể kéo thả các khối tự do trên bảng vẽ, hoặc bấm nút bánh răng ⚙️ trên thẻ để chỉnh sửa.
        </div>
      </div>

      {/* Edit Step Modal */}
      <Dialog
        open={editingIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingIndex(null);
            setEditStepForm(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Chỉnh sửa Cấp duyệt thứ {(editingIndex ?? 0) + 1}
            </DialogTitle>
          </DialogHeader>

          {editStepForm && (
            <div className="space-y-3.5 py-2">
              {/* Tên bước */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tên bước phê duyệt</Label>
                <Input
                  value={editStepForm.stepName}
                  onChange={(e) =>
                    setEditStepForm({ ...editStepForm, stepName: e.target.value })
                  }
                  placeholder="VD: Quản lý trực tiếp xác nhận"
                  className="h-9 text-xs"
                />
              </div>

              {/* Loại đối tượng duyệt */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Đối tượng phê duyệt</Label>
                <Select
                  value={editStepForm.approverType}
                  onValueChange={(val: ApproverType | null) => {
                    if (!val) return;
                    setEditStepForm({
                      ...editStepForm,
                      approverType: val,
                      approverRoleId: val === "ROLE" ? editStepForm.approverRoleId || roles[0]?.id : null,
                      approverEmployeeId:
                        val === "SPECIFIC_EMPLOYEE"
                          ? editStepForm.approverEmployeeId || employees[0]?.id
                          : null,
                    });
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn đối tượng duyệt">
                      {APPROVER_TYPE_OPTIONS.find((opt) => opt.value === editStepForm.approverType)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {APPROVER_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Role / Employee Select */}
              {editStepForm.approverType === "ROLE" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Chọn vai trò duyệt</Label>
                  <Select
                    value={editStepForm.approverRoleId || ""}
                    onValueChange={(val) =>
                      setEditStepForm({ ...editStepForm, approverRoleId: val })
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn vai trò...">
                        {roles.find((r) => r.id === editStepForm.approverRoleId)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {editStepForm.approverType === "SPECIFIC_EMPLOYEE" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Chọn nhân viên chỉ định</Label>
                  <Select
                    value={editStepForm.approverEmployeeId || ""}
                    onValueChange={(val) =>
                      setEditStepForm({ ...editStepForm, approverEmployeeId: val })
                    }
                  >
                    <SelectTrigger className="w-full h-9 text-xs">
                      <SelectValue placeholder="Chọn nhân viên...">
                        {(() => {
                          const e = employees.find(
                            (emp) => emp.id === editStepForm.approverEmployeeId
                          );
                          return e ? `${e.fullName} (${e.employeeCode})` : undefined;
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.fullName} ({e.employeeCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Điều kiện duyệt */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Điều kiện kích hoạt bước</Label>
                <Select
                  value={editStepForm.conditionType}
                  onValueChange={(val: StepConditionType | null) => {
                    if (!val) return;
                    setEditStepForm({
                      ...editStepForm,
                      conditionType: val,
                      conditionThreshold:
                        val === "AMOUNT_ABOVE_THRESHOLD"
                          ? editStepForm.conditionThreshold || 50000000
                          : null,
                    });
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Chọn điều kiện">
                      {CONDITION_TYPE_OPTIONS.find((opt) => opt.value === editStepForm.conditionType)?.label}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ngưỡng số tiền nếu AMOUNT_ABOVE_THRESHOLD */}
              {editStepForm.conditionType === "AMOUNT_ABOVE_THRESHOLD" && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Định mức số tiền (VND)</Label>
                  <Input
                    type="number"
                    placeholder="VD: 50000000"
                    value={editStepForm.conditionThreshold || ""}
                    onChange={(e) =>
                      setEditStepForm({
                        ...editStepForm,
                        conditionThreshold: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="h-9 text-xs font-mono"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingIndex(null);
                setEditStepForm(null);
              }}
              className="text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEditStep}
              className="text-xs shadow-xs"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
