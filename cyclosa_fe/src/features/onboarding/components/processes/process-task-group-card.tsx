"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  OnboardingTaskDto,
  OnboardingTaskGroup,
} from "../../types/onboarding.types";
import {
  ONBOARDING_TASK_GROUP_LABELS,
  ONBOARDING_TASK_GROUP_ICONS,
  ONBOARDING_TASK_STATUS_LABELS,
  ONBOARDING_TASK_STATUS_COLORS,
} from "../../constants/onboarding.constants";

interface ProcessTaskGroupCardProps {
  taskGroup: OnboardingTaskGroup;
  tasks: OnboardingTaskDto[];
  canManage: boolean;
  onOpenCompleteModal: (task: OnboardingTaskDto) => void;
  onSkipTask: (task: OnboardingTaskDto) => void;
}

export function ProcessTaskGroupCard({
  taskGroup,
  tasks,
  canManage,
  onOpenCompleteModal,
  onSkipTask,
}: ProcessTaskGroupCardProps) {
  const Icon = ONBOARDING_TASK_GROUP_ICONS[taskGroup];
  const groupLabel = ONBOARDING_TASK_GROUP_LABELS[taskGroup];

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>{groupLabel}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {completedCount}/{tasks.length}
              </Badge>
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-24 bg-muted h-1.5 rounded-full overflow-hidden hidden sm:block">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-primary">
            {progressPercent}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground italic">
            Chưa có đầu việc nào thuộc nhóm {groupLabel}.
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";
            const isSkipped = task.status === "SKIPPED";
            const statusStyle = ONBOARDING_TASK_STATUS_COLORS[task.status];

            return (
              <div
                key={task.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/15 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Icon Checkbox Status */}
                  <div className="pt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : isSkipped ? (
                      <XCircle className="h-5 w-5 text-zinc-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border flex items-center justify-center" />
                    )}
                  </div>

                  {/* Title & Details */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold ${
                          isCompleted
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>

                      {task.isMandatory ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-rose-50 text-rose-700 border-rose-200 font-mono py-0 shrink-0"
                        >
                          Bắt buộc
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-muted-foreground font-mono py-0 shrink-0"
                        >
                          Tùy chọn
                        </Badge>
                      )}

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium py-0 shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {ONBOARDING_TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 text-[10.5px] text-muted-foreground font-mono pt-0.5 flex-wrap">
                      <span>Hạn: {task.dueDate}</span>
                      {task.assigneeRole && (
                        <span>Phụ trách: {task.assigneeRole}</span>
                      )}
                      {task.completedByName && (
                        <span className="text-emerald-700 dark:text-emerald-400">
                          ✓ Xong bởi {task.completedByName}
                        </span>
                      )}
                      {task.documentFileUrl && (
                        <a
                          href={task.documentFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Xem file</span>
                        </a>
                      )}
                    </div>

                    {task.completionNotes && (
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20 p-1.5 rounded-md mt-1">
                        Ghi chú: {task.completionNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {canManage && task.status === "PENDING" && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!task.isMandatory && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onSkipTask(task)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Bỏ qua
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onOpenCompleteModal(task)}
                      className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      Hoàn thành
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

