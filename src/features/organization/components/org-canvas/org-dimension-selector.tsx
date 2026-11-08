"use client";

import React from "react";
import {
  ORG_DIMENSIONS,
  ORG_DIMENSION_CONFIG,
  type OrgDimension,
} from "../../constants/organization.constants";
import { cn } from "@/lib/utils";

interface OrgDimensionSelectorProps {
  selectedDimension: OrgDimension;
  onSelectDimension: (dimension: OrgDimension) => void;
  className?: string;
}

export function OrgDimensionSelector({
  selectedDimension,
  onSelectDimension,
  className,
}: OrgDimensionSelectorProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-2.5 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/80",
        className
      )}
    >
      {ORG_DIMENSION_CONFIG.map((dim) => {
        const isActive = selectedDimension === dim.id;

        return (
          <button
            key={dim.id}
            type="button"
            onClick={() => onSelectDimension(dim.id)}
            className={cn(
              "group text-left px-3.5 py-2.5 rounded-lg border transition-all duration-150 focus:outline-hidden",
              isActive
                ? "bg-white border-primary/40 shadow-xs ring-1 ring-primary/20"
                : "bg-white/60 border-slate-200/70 hover:bg-white hover:border-slate-300 text-slate-600"
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-200"
                )}
              >
                {dim.code}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold tracking-tight transition-colors",
                  isActive ? "text-primary" : "text-slate-800"
                )}
              >
                {dim.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">
              {dim.desc}
            </p>
          </button>
        );
      })}
    </div>
  );
}
