"use client";

import React from "react";
import { Grid, Sparkles, User, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { NineBoxGridResponse } from "../types/career.types";
import { TALENT_TAG_CONFIG } from "../constants/career.constants";

interface NineBoxGridViewProps {
  gridData?: NineBoxGridResponse;
  isLoading?: boolean;
}

export function NineBoxGridView({ gridData, isLoading = false }: NineBoxGridViewProps) {
  const cells = gridData?.cells || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, idx) => (
          <Skeleton key={idx} className="h-44 rounded-xl" />
        ))}
      </div>
    );
  }

  // Pre-arrange cells in 3x3 layout:
  // Row 1 (High Potential): [Low Perf, Med Perf, High Perf] -> ROUGH_DIAMOND, FUTURE_STAR, STAR
  // Row 2 (Medium Potential): [Low Perf, Med Perf, High Perf] -> INCONSISTENT, CORE_PLAYER, HIGH_PERFORMER
  // Row 3 (Low Potential): [Low Perf, Med Perf, High Perf] -> UNDERPERFORMER, SPECIALIST, SOLID_PERFORMER
  const cellByCode = new Map(cells.map((c) => [c.boxCode, c]));

  const matrixLayout = [
    [cellByCode.get("ROUGH_DIAMOND"), cellByCode.get("FUTURE_STAR"), cellByCode.get("STAR")],
    [cellByCode.get("INCONSISTENT"), cellByCode.get("CORE_PLAYER"), cellByCode.get("HIGH_PERFORMER")],
    [cellByCode.get("UNDERPERFORMER"), cellByCode.get("SPECIALIST"), cellByCode.get("SOLID_PERFORMER")],
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Grid className="h-4 w-4 text-primary" />
            <span>Ma trận 9 ô đánh giá nhân tài (9-Box Grid)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Phân bổ nhân lực theo 2 chiều: Hiệu suất đóng góp (Performance) và Tiềm năng phát triển (Potential)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            Trục tung: Tiềm năng ↑ | Trục hoành: Hiệu suất →
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {matrixLayout.map((row, rowIdx) => {
          const rowLabel =
            rowIdx === 0
              ? "Tiềm năng Cao"
              : rowIdx === 1
              ? "Tiềm năng Trung bình"
              : "Tiềm năng Thấp";

          return (
            <div key={rowIdx} className="space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {rowLabel}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {row.map((cell, colIdx) => {
                  if (!cell) return null;

                  const isStar = cell.boxCode === "STAR";
                  const isFutureStar = cell.boxCode === "FUTURE_STAR";
                  const isHighPerformer = cell.boxCode === "HIGH_PERFORMER";

                  let cardBorder = "border-border/70 bg-card";
                  if (isStar) cardBorder = "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/20";
                  else if (isFutureStar) cardBorder = "border-cyan-500/40 bg-cyan-500/5";
                  else if (isHighPerformer) cardBorder = "border-indigo-500/40 bg-indigo-500/5";

                  return (
                    <div
                      key={cell.boxCode}
                      className={`rounded-xl border p-4 space-y-3 transition-all hover:shadow-xs min-h-[140px] flex flex-col justify-between ${cardBorder}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            {isStar && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                            <span>{cell.title}</span>
                          </h4>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {cell.performanceLevel} Perf • {cell.potentialLevel} Pot
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="font-mono text-[11px] font-semibold h-5 px-1.5"
                        >
                          {cell.candidateCount}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        {cell.candidates.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/70 italic">
                            Chưa có nhân sự trong nhóm này
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {cell.candidates.map((cand) => (
                              <div
                                key={cand.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-background border border-border shadow-2xs"
                              >
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium text-foreground">{cand.employeeName}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  ({cand.employeeCode})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
