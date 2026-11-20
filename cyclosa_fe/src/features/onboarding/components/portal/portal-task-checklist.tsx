"use client";

import React from "react";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskGroupBadge } from "../shared/task-group-badge";
import type { OnboardingTaskDto } from "../../types/onboarding.types";

interface PortalTaskChecklistProps {
  tasks: OnboardingTaskDto[];
  onCompleteTask: (taskId: string) => void;
}

export function PortalTaskChecklist({
  tasks,
  onCompleteTask,
}: PortalTaskChecklistProps) {
  return (
    <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-foreground">
            Danh sách Công việc Hội nhập Cần Hoàn thành
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hoàn tất các hạng mục theo từng giai đoạn để chuẩn bị tốt nhất cho công việc.
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {tasks.filter((t) => t.status === "COMPLETED").length}/{tasks.length} Đã xong
        </Badge>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Chưa có công việc nào được giao trong lộ trình của bạn.
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";

            return (
              <div
                key={task.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/15 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="pt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/60" />
                    )}
                  </div>

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
                      <TaskGroupBadge taskGroup={task.taskGroup} showIcon={false} />
                      {task.isMandatory && (
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-rose-50 text-rose-700 border-rose-200 font-mono py-0"
                        >
                          Bắt buộc
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10.5px] text-muted-foreground font-mono pt-0.5">
                      <span>Hạn: {task.dueDate}</span>
                      <span>Phụ trách: {task.assigneeRole || "HR"}</span>
                      {task.documentFileUrl && (
                        <a
                          href={task.documentFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Tài liệu đính kèm</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {!isCompleted && task.status === "PENDING" && (
                  <div className="shrink-0 self-end sm:self-center">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onCompleteTask(task.id)}
                      className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      Báo đã xong
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

