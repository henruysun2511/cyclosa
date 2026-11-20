"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Award } from "lucide-react";
import type {
  PerformanceGoalDto,
  ManagerAssessmentPayload,
} from "../../types/performance.types";

interface ManagerAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goals: PerformanceGoalDto[];
  initialComment?: string;
  onSubmit: (payload: ManagerAssessmentPayload, submitDirectly: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function ManagerAssessmentDialog({
  open,
  onOpenChange,
  goals,
  initialComment,
  onSubmit,
  isLoading,
}: ManagerAssessmentDialogProps) {
  const [generalComment, setGeneralComment] = useState("");
  const [scores, setScores] = useState<Record<string, { score: string; comment: string }>>({});

  useEffect(() => {
    if (open) {
      setGeneralComment(initialComment || "");
      const map: Record<string, { score: string; comment: string }> = {};
      goals.forEach((g) => {
        map[g.id] = {
          score: g.managerScore !== undefined && g.managerScore !== null ? g.managerScore.toString() : "",
          comment: g.managerComment || "",
        };
      });
      setScores(map);
    }
  }, [open, goals, initialComment]);

  const handleScoreChange = (goalId: string, val: string) => {
    setScores((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        score: val,
      },
    }));
  };

  const handleCommentChange = (goalId: string, val: string) => {
    setScores((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        comment: val,
      },
    }));
  };

  const buildPayload = (): ManagerAssessmentPayload => {
    return {
      generalComment: generalComment.trim() || undefined,
      goalScores: goals.map((g) => {
        const item = scores[g.id];
        const numScore = item?.score !== "" ? parseFloat(item?.score || "0") : undefined;
        return {
          goalId: g.id,
          managerScore: numScore,
          managerComment: item?.comment?.trim() || undefined,
        };
      }),
    };
  };

  const handleSaveDraft = async () => {
    await onSubmit(buildPayload(), false);
    onOpenChange(false);
  };

  const handleSubmitFinal = async () => {
    await onSubmit(buildPayload(), true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Quản lý đánh giá & Chấm điểm hiệu suất</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Nhập điểm số (thang điểm 100) và nhận xét chi tiết cho từng mục tiêu công việc của nhân sự.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 flex-1 overflow-y-auto pr-1">
          {/* Danh sách mục tiêu chấm điểm */}
          <div className="space-y-3">
            {goals.map((g, index) => {
              const current = scores[g.id] || { score: "", comment: "" };
              return (
                <div
                  key={g.id}
                  className="p-3 rounded-lg border border-border bg-muted/20 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-foreground">
                        {index + 1}. {g.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="text-[10px] py-0 px-1 font-semibold">
                          Trọng số: {g.weight}%
                        </Badge>
                        {g.targetValue !== undefined && g.targetValue !== null && (
                          <span>
                            Chỉ tiêu: {g.targetValue} {g.kpiUnit || ""}
                          </span>
                        )}
                        {g.selfScore !== undefined && g.selfScore !== null && (
                          <span className="text-blue-600 dark:text-blue-400">
                            (Nhân viên tự chấm: {g.selfScore})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {g.selfComment && (
                    <div className="bg-background/80 p-2 rounded text-[11px] text-muted-foreground italic border">
                      &quot;{g.selfComment}&quot;
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                    <div className="sm:col-span-1">
                      <Label className="text-[11px] font-medium">
                        Điểm quản lý chấm (0-100) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        placeholder="VD: 85"
                        value={current.score}
                        onChange={(e) => handleScoreChange(g.id, e.target.value)}
                        className="h-8 text-xs font-bold text-amber-600 dark:text-amber-400 mt-1"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Label className="text-[11px] font-medium">
                        Nhận xét của quản lý
                      </Label>
                      <Input
                        placeholder="Ghi nhận nỗ lực hoặc điểm cần cải thiện..."
                        value={current.comment}
                        onChange={(e) => handleCommentChange(g.id, e.target.value)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nhận xét tổng quát */}
          <div className="space-y-1.5 pt-2 border-t">
            <Label className="text-xs font-medium">
              Nhận xét chung & Định hướng phát triển
            </Label>
            <Textarea
              placeholder="Đánh giá tổng quan tinh thần thái độ, tiềm năng phát triển và mục tiêu chu kỳ tiếp theo..."
              value={generalComment}
              onChange={(e) => setGeneralComment(e.target.value)}
              className="text-xs resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-8 text-xs"
          >
            Đóng
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="h-8 text-xs"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              Lưu nháp điểm
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmitFinal}
              disabled={isLoading}
              className="h-8 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Lưu & Nộp đánh giá</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
