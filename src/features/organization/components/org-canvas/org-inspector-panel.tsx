"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Department, DepartmentNode } from "../../types/organization.types";

interface OrgInspectorPanelProps {
  selectedNode: Department | DepartmentNode | null;
  onEdit?: (node: DepartmentNode | Department) => void;
  onMove?: (node: DepartmentNode | Department) => void;
  onDissolve?: (node: DepartmentNode | Department) => void;
  className?: string;
}

export function OrgInspectorPanel({
  selectedNode,
  onEdit,
  onMove,
  onDissolve,
  className,
}: OrgInspectorPanelProps) {
  if (!selectedNode) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-slate-200 bg-white/70 p-6 flex flex-col items-center justify-center text-center text-slate-400 min-h-[380px]",
          className
        )}
      >
        <Building2 className="w-10 h-10 text-slate-300 stroke-[1.5] mb-2" />
        <p className="text-xs font-medium text-slate-600">Chưa chọn đơn vị</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Nhấp vào một đơn vị trên cây sơ đồ để kiểm tra chi tiết thuộc tính & nhân sự
        </p>
      </div>
    );
  }

  const isInherited =
    "isPermissionInherited" in selectedNode
      ? Boolean(selectedNode.isPermissionInherited)
      : true;

  // Mock list nhân sự demo theo chuẩn DocuCore (trong tương lai gắn kết với API nhân viên của Module 02)
  const mockPeople = [
    { name: "Trần Bảo Sơn", ini: "TS", pos: "Trưởng phòng", access: "cấp=4" },
    { name: "Trần Thu Hà", ini: "TH", pos: "Chuyên viên quản lý", access: "cấp=3" },
    { name: "Phạm Quốc Đạt", ini: "PĐ", pos: "Kiểm soát viên", access: "cấp=3" },
    { name: "Nguyễn Thanh Bình", ini: "NB", pos: "Chuyên viên nghiệp vụ", access: "cấp=2" },
  ];

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      {/* ── CARD 1: Chi tiết đơn vị & Thuộc tính ──────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-xs text-slate-900 truncate">
              {selectedNode.name}
            </span>
            <Badge
              variant="outline"
              className="font-mono text-[10px] font-medium bg-white text-slate-600 shrink-0"
            >
              {selectedNode.code}
            </Badge>
          </div>
        </div>

        {/* Facts List */}
        <div className="p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Phân cấp:</span>
            </span>
            <span className="font-medium text-slate-800">
              {selectedNode.parentDepartmentId ? "Đơn vị trực thuộc" : "Đơn vị gốc"}
            </span>
          </div>

          {"costCenterName" in selectedNode && selectedNode.costCenterName && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Cost Center:</span>
              </span>
              <span className="font-medium text-slate-800 font-mono text-[11px]">
                {selectedNode.costCenterName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Hiệu lực từ:</span>
            </span>
            <span className="font-medium text-slate-800 font-mono text-[11px]">
              {selectedNode.effectiveFrom
                ? new Date(selectedNode.effectiveFrom).toLocaleDateString("vi-VN")
                : "01/01/2026"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Tham chiếu:</span>
            </span>
            <span className="text-primary font-medium text-[11px]">
              4 luật phân quyền · 2 luồng
            </span>
          </div>
        </div>

        {/* Toggle Kế thừa quyền con */}
        <div className="px-3.5 pb-3.5 pt-1">
          <div
            className={cn(
              "flex items-center justify-between gap-2 p-2.5 rounded-lg border text-xs transition-colors",
              isInherited
                ? "bg-primary/5 border-primary/20 text-primary"
                : "bg-slate-50 border-slate-200 text-slate-600"
            )}
          >
            <div className="flex items-center gap-1.5 text-[11.5px] font-medium">
              <CheckCircle2
                className={cn(
                  "w-3.5 h-3.5",
                  isInherited ? "text-primary" : "text-slate-400"
                )}
              />
              <span>Kế thừa quyền xuống đơn vị con</span>
            </div>
            <span
              className={cn(
                "relative inline-flex h-4 w-7 shrink-0 cursor-default rounded-full transition-colors duration-200 ease-in-out",
                isInherited ? "bg-primary" : "bg-slate-300"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out mt-0.5",
                  isInherited ? "translate-x-3.5" : "translate-x-0.5"
                )}
              />
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="px-3.5 pb-3.5 pt-0 flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(selectedNode)}
              className="flex-1 h-7 text-[11px]"
            >
              Chỉnh sửa
            </Button>
          )}
          {onMove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove(selectedNode)}
              className="flex-1 h-7 text-[11px]"
            >
              Chuyển cấp
            </Button>
          )}
          {onDissolve && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDissolve(selectedNode)}
              className="h-7 text-[11px] text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
            >
              Giải thể
            </Button>
          )}
        </div>
      </div>

      {/* ── CARD 2: Nhân sự trực thuộc đơn vị ────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Nhân sự trực thuộc
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {mockPeople.length} nhân sự
          </span>
        </div>

        <div className="space-y-2">
          {mockPeople.map((person, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-mono text-[9px] font-semibold shrink-0">
                {person.ini}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-[11.5px] truncate">
                  {person.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{person.pos}</p>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-[9.5px] px-1 py-0 font-normal bg-slate-50 text-slate-500 shrink-0"
              >
                {person.access}
              </Badge>
            </div>
          ))}
        </div>

        <Link
          href="/users"
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-medium text-slate-600 transition-colors"
        >
          <span>Mở trong Quản lý người dùng</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ── CARD 3: Chính sách bảo toàn dữ liệu ──────────────────────── */}
      <div className="rounded-xl border border-dashed border-slate-300/80 bg-slate-50/60 p-3.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11.5px] mb-1">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Đơn vị có dữ liệu chỉ ngừng sử dụng</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Không xóa cứng đơn vị đang được hồ sơ, giao dịch hay phân quyền tham chiếu. Chuyển sang trạng thái ngừng sử dụng kèm mốc hiệu lực để bảo toàn lịch sử kiểm toán.
        </p>
      </div>
    </div>
  );
}
