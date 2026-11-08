"use client";

import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrgImpactAlertProps {
  actionLabel?: string;
  affectedTargetName?: string;
  userImpactCount?: number;
  policyImpactCount?: number;
  workflowImpactCount?: number;
  recordImpactCount?: number;
  className?: string;
}

export function OrgImpactAlert({
  actionLabel = "Đổi cơ cấu tổ chức",
  affectedTargetName,
  userImpactCount = 21,
  policyImpactCount = 4,
  workflowImpactCount = 2,
  recordImpactCount = 184,
  className,
}: OrgImpactAlertProps) {
  const impactItems = [
    {
      count: userImpactCount,
      label: "người dùng đổi phạm vi truy cập",
      color: "text-slate-800",
    },
    {
      count: policyImpactCount,
      label: "chính sách phân quyền tham chiếu",
      color: "text-amber-700",
    },
    {
      count: workflowImpactCount,
      label: "luồng duyệt có bước định tuyến",
      color: "text-amber-700",
    },
    {
      count: recordImpactCount,
      label: "hồ sơ / nhân sự trực thuộc",
      color: "text-slate-800",
    },
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-200/90 bg-amber-50/30 overflow-hidden shadow-2xs",
        className
      )}
    >
      {/* Top Banner Header */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-100/60 border-b border-amber-200/80">
        <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
          !
        </span>
        <span className="font-semibold text-xs text-amber-950">
          Xem trước ảnh hưởng khi đổi cơ cấu
        </span>
        <div className="flex-1" />
        {affectedTargetName && (
          <span className="text-[11px] text-amber-800">
            {actionLabel}: <b className="font-semibold">{affectedTargetName}</b>
          </span>
        )}
      </div>

      {/* KPI Grid */}
      <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {impactItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-amber-200/70 bg-white/90 shadow-2xs"
          >
            <div className={cn("font-mono text-base font-bold", item.color)}>
              {item.count}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Audit Footnote */}
      <div className="px-4 pb-3 text-[11px] text-slate-500 flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Đổi cơ cấu là thao tác nhạy cảm: Chạy quy trình phê duyệt kép (dual-control), ghi vết kiểm toán, và lưu phiên bản cây để giải trình quyền truy cập trong quá khứ.
        </span>
      </div>
    </div>
  );
}
