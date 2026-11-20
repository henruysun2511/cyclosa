"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiffFieldChange {
  fieldName: string;
  fieldLabel: string;
  oldValue: string | number | boolean | null | undefined;
  newValue: string | number | boolean | null | undefined;
}

export interface AuditSideBySideDiffProps {
  changes: DiffFieldChange[];
  className?: string;
}

export function AuditSideBySideDiff({ changes, className }: AuditSideBySideDiffProps) {
  if (!changes || changes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        Không có sự thay đổi giá trị nào được ghi nhận.
      </div>
    );
  }

  const formatVal = (val: unknown) => {
    if (val === null || val === undefined || val === "") {
      return <span className="italic text-muted-foreground/60">(trống)</span>;
    }
    if (typeof val === "boolean") {
      return val ? "Có (True)" : "Không (False)";
    }
    return String(val);
  };

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-white", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="py-3 px-4 w-1/4">Trường thông tin</th>
            <th className="py-3 px-4 w-[37.5%]">Giá trị trước</th>
            <th className="py-3 px-4 w-[37.5%]">Giá trị mới</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {changes.map((item, idx) => {
            const hasChanged = item.oldValue !== item.newValue;
            return (
              <tr key={idx} className={cn("hover:bg-slate-50/50 transition-colors", hasChanged && "bg-amber-50/20")}>
                <td className="py-3 px-4 font-medium text-foreground">
                  {item.fieldLabel || item.fieldName}
                  <div className="text-2xs text-muted-foreground font-mono">{item.fieldName}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-rose-50/80 border border-rose-100 text-rose-800 line-through">
                    <Minus className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="font-mono text-xs">{formatVal(item.oldValue)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-emerald-50/80 border border-emerald-100 text-emerald-800">
                    <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-mono text-xs font-semibold">{formatVal(item.newValue)}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
