"use client";

import React from "react";
import Link from "next/link";
import { User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OnboardingProcessDto, OnboardingStatus } from "../../types/onboarding.types";
import {
  ONBOARDING_STATUS_LABELS,
} from "../../constants/onboarding.constants";

interface ProcessKanbanBoardProps {
  processes: OnboardingProcessDto[];
  isLoading: boolean;
}

const KANBAN_COLUMNS: OnboardingStatus[] = [
  "PREPARING",
  "IN_PROGRESS",
  "REVIEW_PENDING",
  "COMPLETED",
];

export function ProcessKanbanBoard({
  processes,
  isLoading,
}: ProcessKanbanBoardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {KANBAN_COLUMNS.map((status) => {
        const columnProcesses = processes.filter((p) => p.status === status);

        return (
          <div
            key={status}
            className="rounded-xl border border-border bg-muted/20 p-3 space-y-3 min-h-[500px] flex flex-col"
          >
            {/* Header Cột */}
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <h3 className="text-xs font-bold text-foreground">
                  {ONBOARDING_STATUS_LABELS[status]}
                </h3>
              </div>
              <Badge
                variant="outline"
                className="font-mono text-[11px] font-bold px-2 py-0.2 bg-card"
              >
                {columnProcesses.length}
              </Badge>
            </div>

            {/* Danh sách thẻ trong cột */}
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-28 rounded-xl bg-card border border-border animate-pulse p-3.5 space-y-2"
                  />
                ))
              ) : columnProcesses.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl bg-card/40">
                  Không có hồ sơ
                </div>
              ) : (
                columnProcesses.map((proc) => {
                  const percent = proc.progressPercentage || 0;
                  return (
                    <Link
                      key={proc.id}
                      href={`/onboarding/processes/${proc.id}`}
                      className="block group rounded-xl border border-border bg-card p-3.5 space-y-3 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      {/* Top: Avatar & Name */}
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                          {getInitials(proc.employeeName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {proc.employeeName}
                          </h4>
                          <p className="text-[10.5px] text-muted-foreground truncate">
                            {proc.jobTitle || "Nhân viên"} • {proc.employeeCode}
                          </p>
                        </div>
                      </div>

                      {/* Mentor / Buddy */}
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <User className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate">
                          Mentor: {proc.mentorName || "Chưa gán"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="text-muted-foreground">
                            {proc.completedTasks}/{proc.totalTasks} việc
                          </span>
                          <span className="font-mono font-bold text-primary">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Footer: Dates */}
                      <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {proc.startDate}
                        </span>
                        <span>Đến: {proc.probationEndDate}</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

